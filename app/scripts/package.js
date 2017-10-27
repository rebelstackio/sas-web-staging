import { getPageLanguage, getPackagePageByLanguafge } from './utils';

let content = document.querySelector('#page-content');
let dataRef = content.getAttribute('data-ref');

const language	= getPageLanguage('lng') || 'en' ;

const tpl = getPackagePageByLanguafge(language);

System.import(`../data/packages/${dataRef}.${language}.js`).then(function(m) {
	console.log(m);
	let data = m.default;
	document.title = data.tab_title;
	var share = language == 'en' ? 'Share':'Compartir';
	var uri = window.location.href;
	if (uri.indexOf("http://localhost:9000") > -1) {
	  uri = "https://southamericanssecrets.github.io/web"+window.location.pathname;
	}
	var html = tpl.render({ data: data, share: share, uri: uri });
	document.querySelector('#page-content').innerHTML = html;
});
