import { getPageLanguage, getPackagePageByLanguafge } from './utils';

let content = document.querySelector('#page-content');
let dataRef = content.getAttribute('data-ref');

const language	= getPageLanguage('lng') || 'en' ;

const tpl = getPackagePageByLanguafge(language);

System.import(`../data/packages/${dataRef}.${language}.js`).then(function(m) {
	console.log(m);
	let data = m.default;
	var html = tpl.render({ data:	data });
	document.querySelector('#page-content').innerHTML = html;
});
