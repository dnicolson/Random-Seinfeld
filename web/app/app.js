import ATV from 'atvjs';
import loaderTpl from 'shared/templates/loader.hbs';
import errorTpl from 'shared/templates/error.hbs';
import HomePage from 'pages/home';
import PlayPage from 'pages/play';

ATV.start({
	templates: {
		loader: loaderTpl,
		error: errorTpl,
		status: {
			'404': () => errorTpl({
				title: '404',
				message: 'Page cannot be found!'
			}),
			'500': () => errorTpl({
				title: '500',
				message: 'An unknown error occurred in the application. Please try again later.'
			}),
			'503': () => errorTpl({
				title: '500',
				message: 'An unknown error occurred in the application. Please try again later.'
			})
		}
	},
	onLaunch(options) {
    ATV.Navigation.showLoading();
		ATV.Navigation.navigate('home');
	}
});
