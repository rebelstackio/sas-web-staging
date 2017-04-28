import { getPageLanguage } from './utils';

const language	= getPageLanguage('lng') || 'en' ;
let menu = document.querySelector('#menu-content');
System.import(`../tpl/partials/menu.${language}.njk`).then(function(m) {
	console.log(m);
	let tpl = m;
	var html = tpl.render({});
	menu.innerHTML = html;
});
