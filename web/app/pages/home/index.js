import ATV from 'atvjs';
import template from './template.hbs';
import { API_URL } from 'config';

const presentModal = (title, description) => {
  const info = `<?xml version="1.0" encoding="UTF-8" ?>
      <document>
          <descriptiveAlertTemplate>
              <title>${title}</title>
              <description>${description}</description>
          </descriptiveAlertTemplate>
      </document>
  `;
  ATV.Navigation.presentModal({ template: info, style: '' });
};

const HomePage = ATV.Page.create({
  name: 'home',
  url: `${API_URL}/episode`,
  template: template,
  events: {
    select: 'onSelect',
  },
  onSelect(event) {
    const targetElem = event.target;
    if (targetElem.tagName === 'description') {
      const body = targetElem.textContent;
      presentModal('', body);
    }
    if (targetElem.textContent === 'Choose Episode') {
      const template = `<document><formTemplate><textField id="episode-text"></textField><footer><button><text>Play</text></button></footer></formTemplate></document>`;
      // eslint-disable-next-line no-undef
      const parser = new DOMParser();
      const doc = parser.parseFromString(template, 'application/xml');
      const episodeText = doc.getElementById('episode-text');
      doc.addEventListener('select', () => {
        const input = episodeText.getFeature('Keyboard').text;
        // eslint-disable-next-line no-undef
        navigationDocument.dismissModal();
        const [season, episode] = [parseInt(input.substr(0, 2), 10), parseInt(input.substr(2, 2), 10)];
        ATV.Navigation.navigate('play', { season, episode });
      });
      // eslint-disable-next-line no-undef
      navigationDocument.presentModal(doc);
    }
  },
  data: (response) => {
    return {
      episodeName: response.episodeName,
      image: response.image,
      season: response.season,
      episode: response.episode,
      description: response.description,
      director: response.director,
      writers: response.writers,
      guestStars: response.guestStars,
      firstAired: response.firstAired,
      siteRating: response.siteRating / 10,
      contentRating: response.contentRating,
    };
  },
});

export default HomePage;
