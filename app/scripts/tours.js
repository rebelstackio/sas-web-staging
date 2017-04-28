import tplen from '../tpl/partials/tours-page.en.njk';
import tples from '../tpl/partials/tours-page.es.njk';
import { getPageLanguage, getTourPageByLanguage } from './utils';

let content = document.querySelector('#page-content');
let dataRef = content.getAttribute('data-ref');

const language	= getPageLanguage('lng') || 'en' ;

const tpl = getTourPageByLanguage(language);

System.import(`../data/tours/${dataRef}.${language}.js`).then(function(m) {
	console.log(m);
	let data = m.default;
	var html = tpl.render({ data:	data });
	document.querySelector('#page-content').innerHTML = html;
});
