import tourtplen from '../tpl/partials/tours-page.en.njk';
import tourtples from '../tpl/partials/tours-page.es.njk';

export function getPageLanguage(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	const lng = decodeURIComponent(results[2].replace(/\+/g, " "));

	//CHECK ALLOWED LANGAUGES
	const allowedLang = [ 'es' , 'en' ];
	let language	= 'en';
	if ( allowedLang.indexOf(lng) >= 0 ) {
	  language = lng;
	}
	return language;
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
