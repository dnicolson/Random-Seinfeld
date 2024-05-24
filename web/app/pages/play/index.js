import ATV from 'atvjs';
import { API_URL } from 'config';

const showError = (code, message = '') => {
  const alert = `<?xml version="1.0" encoding="UTF-8" ?>
      <document>
        <alertTemplate>
          <title>Error (${code})</title>
          <description>${message}\n\nThe episode failed to download. Please try again.</description>
          <button data-alert-dismiss="close">
            <text>OK</text>
          </button>
        </alertTemplate>
      </document>`;
  ATV.Navigation.showError({ template: alert, style: '' });
};

const PlayPage = ATV.Page.create({
  name: 'play',
  async ready(options, resolve) {
    try {
      ATV.Navigation.showLoading();
      const stream = await ATV.Ajax.get(`${API_URL}/download?season=${options.season}&episode=${options.episode}`, {
        responseType: 'text',
      });

      if (stream.responseText === '{}') {
        showError(stream.status);
        return;
      }

      // eslint-disable-next-line no-undef
      const player = new Player();
      // eslint-disable-next-line no-undef
      const mediaItem = new MediaItem('video', stream.responseText.trimEnd());
      // eslint-disable-next-line no-undef
      const playlist = new Playlist();

      playlist.push(mediaItem);
      player.playlist = playlist;
      player.play();

      player.addEventListener('stateDidChange', async (event) => {
        if (event.state === 'end') {
          await ATV.Ajax.get(`${API_URL}/cleanup`);
        }
      });

      player.addEventListener('playbackError', (event) => {
        showError(event.error.code);
      });

      resolve(false);
    } catch (error) {
      showError(error.status, error.responseText);
    }
  },
});

export default PlayPage;
