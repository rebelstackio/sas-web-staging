import { getPageLanguage } from './utils';

const language	= getPageLanguage('lng') || 'en' ;
let footer = document.querySelector('#footer');
let fmobile = document.querySelector("#footer-mobile");
System.import(`../tpl/partials/footer.${language}.njk`).then(function(m) {
	console.log(m);
	let tpl = m;
	var html = tpl.render({});
	footer.innerHTML = html;
	fmobile.innerHTML = html;
});
