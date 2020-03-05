import ATV from 'atvjs';
import { API_URL } from 'config';

const PlayPage = ATV.Page.create({
  name: 'play',
  async ready(options, resolve, reject) {
    try {
      ATV.Navigation.showLoading();
      const stream = await ATV.Ajax.get(`${API_URL}/download/?season=${options.season}&episode=${options.episode}`, { responseType: 'text' });

      if (stream.responseText === '{}') {
        reject({
          status: '500',
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
    } catch (error) {
      reject({
        status: '500',
        data: { title: 'Error', message: 'The episode failed to download. Please try again.' }
      });
    }
  }
});

export default PlayPage;
