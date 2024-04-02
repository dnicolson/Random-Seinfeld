var gulp = require('gulp');
var del = require('del');
var $ = require('gulp-load-plugins')({
  pattern: '*',
});

var environments = ['development', 'production'];
var environment = environments.indexOf($.util.env.t) > -1 ? $.util.env.t : 'development';
var isProduction = environment === 'production';
var webpackConfig = require('./webpack.config.js')[environment];

var port = $.util.env.p || 9001;
var src = 'web/app/';
var dist = 'web/public/';

gulp.task('scripts', function () {
  return gulp
    .src(webpackConfig.entry.app)
    .pipe($.webpackStream(webpackConfig))
    .pipe(isProduction ? $.uglify({ preserveComments: 'license' }) : $.util.noop())
    .pipe(isProduction ? $.stripDebug() : $.util.noop())
    .pipe(gulp.dest(dist))
    .pipe(
      $.size({
        title: 'js',
      }),
    )
    .pipe($.connect.reload());
});

gulp.task('serve', async function () {
  $.connect.server({
    root: dist,
    port: port,
    livereload: {
      port: 35728,
    },
  });
});

gulp.task('static', function () {
  return gulp
    .src(src + 'assets/**/*')
    .pipe(
      $.size({
        title: 'static',
      }),
    )
    .pipe(gulp.dest(dist + 'assets/'));
});

gulp.task('watch', async function () {
  gulp.watch(src + 'assets/**/*', gulp.series('static'));
  gulp.watch([src + '**/*.js', src + '**/*.hbs', src + '**/*.json', src + '**/*.css'], gulp.series('scripts'));
});

gulp.task('clean', async function () {
  await del([dist]);
});

// waits until clean is finished then builds the project
gulp.task('build', gulp.series('clean', gulp.parallel('static', 'scripts')));

// by default build project and then watch files
gulp.task('default', gulp.series('build', gulp.parallel('serve', 'watch')));
