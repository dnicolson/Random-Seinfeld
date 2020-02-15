import ATV from 'atvjs';
import template from './template.hbs';
import { API_URL } from 'config';

const presentModal = (title, description) => {
  const info = `
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
		select: 'onSelect'
  },
  onSelect(event) {
    const targetElem = event.target;
    if (targetElem.tagName === 'description') {
      const body = targetElem.textContent;
      presentModal('', body);
    }
	},
  data: response => {
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
        contentRating: response.contentRating
    };
  },
});

export default HomePage;
