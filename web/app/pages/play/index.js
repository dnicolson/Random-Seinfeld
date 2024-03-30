import ATV from 'atvjs';
import { API_URL } from 'config';

const showError = code => {
  const alert = `<?xml version="1.0" encoding="UTF-8" ?>
      <document>
        <alertTemplate>
          <title>Error (${code})</title>
          <description>The episode failed to download. Please try again.</description>
          <button data-alert-dissmiss="close">
            <text>OK</text>
          </button>
        </alertTemplate>
      </document>`;
  ATV.Navigation.showError({ template: alert, style: '' });
};

const PlayPage = ATV.Page.create({
  name: 'play',
  async ready(options, resolve, reject) {
    try {
      ATV.Navigation.showLoading();
      const stream = await ATV.Ajax.get(`${API_URL}/download?season=${options.season}&episode=${options.episode}`, { responseType: 'text' });

      if (stream.responseText === '{}') {
        showError(stream.status);
        return;
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
      showError(error.status);
    };
  }
});

export default PlayPage;
