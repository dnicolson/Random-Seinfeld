import ATV from 'atvjs';
import { API_URL } from 'config';

const PlayPage = ATV.Page.create({
  name: 'play',
  ready(options, resolve, reject) {
    ATV.Navigation.showLoading();
    ATV.Ajax.get(`${API_URL}/download/?season=${options.season}&episode=${options.episode}`, { responseType: 'text' })
      .then(xhr => {
        const stream = xhr.response;
        if (stream.responseText === '{}') {
          reject({
            status: '404',
            data: { title: 'Error', message: 'The episode failed to download. Please try again.' }
          });
        }

        const player = new Player();
        const mediaItem = new MediaItem('video', stream.responseText.trimEnd());
        const playlist = new Playlist();

        playlist.push(mediaItem);
        player.playlist = playlist;
        player.play();

        player.addEventListener('stateDidChange', async (event) => {
          if (event.state === 'end') {
            await ATV.Ajax.get(`${API_URL}/cleanup`);
          }
        });
        resolve(false);
      }).catch(error => {
        console.log(error)
        reject({
          status: '404',
          data: { title: 'Error', message: 'The episode failed to download. Please try again.' }
        });
      });
  }
});

export default PlayPage;
