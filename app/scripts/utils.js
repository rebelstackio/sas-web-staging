import tourtplen from '../tpl/partials/tours-page.en.njk';
import tourtples from '../tpl/partials/tours-page.es.njk';

export function getPageLanguage(name, url) {
	return  localStorage['lng'] ;
}


export function getTourPageByLanguage(lng) {
	switch (lng) {
		case 'es':
			return tourtples;
			break;
		case 'en':
			return tourtplen;
			break;
		default:
			return tourtplen;
	}
}
