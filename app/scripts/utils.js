import tourtplen from '../tpl/partials/tours-page.en.njk';
import tourtples from '../tpl/partials/tours-page.es.njk';
import contacten from '../tpl/partials/contactcontent.en.njk';
import contactes from '../tpl/partials/contactcontent.es.njk';
import contactopten from '../data/contact/contactoptions.en.js';
import contactoptes from '../data/contact/contactoptions.es.js';

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

export function getContactPageByLanguage(lng) {
	switch (lng) {
		case 'es':
			return contactes;
			break;
		case 'en':
			return contacten;
			break;
		default:
			return contacten;
	}
}

export function getContactChatOptionsByLanguafge(lng) {
	switch (lng) {
		case 'es':
			return contactoptes;
			break;
		case 'en':
			return contactopten;
			break;
		default:
			return contactopten;
	}
}
