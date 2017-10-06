import tourtplen from '../tpl/partials/tours-page.en.njk';
import tourtples from '../tpl/partials/tours-page.es.njk';
import contacten from '../tpl/partials/contactcontent.en.njk';
import contactes from '../tpl/partials/contactcontent.es.njk';
import packagees from '../tpl/partials/package-page.es.njk';
import packageen from '../tpl/partials/package-page.en.njk';
import lastnewsbanneres from '../tpl/partials/last-news-banner.es.njk';
import lastnewsbanneren from '../tpl/partials/last-news-banner.en.njk';
import articlesidebaren from '../tpl/partials/article-sidebar.en.njk';
import articlesidebares from '../tpl/partials/article-sidebar.es.njk';

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

export function getPackagePageByLanguafge(lng) {
	switch (lng) {
		case 'es':
			return packagees;
			break;
		case 'en':
			return packageen;
			break;
		default:
			return packageen;
	}
}

export function getLastNewsBannerByLanguage(lng) {
	switch (lng) {
		case 'es':
			return lastnewsbanneres;
			break;
		case 'en':
			return lastnewsbanneren;
			break;
		default:
			return lastnewsbanneren;
	}
}

export function getArticleSidebar(lng) {
	switch (lng) {
		case 'es':
			return articlesidebares;
			break;
		case 'en':
			return articlesidebaren;
			break;
		default:
			return articlesidebaren;
	}
}
