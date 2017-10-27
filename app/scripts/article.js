import tpl from '../tpl/partials/article.en.njk';
import { getPageLanguage, getArticleSidebar } from './utils';

const language	= getPageLanguage('lng') || 'en' ;

document.title = language == "es" ? "Artículos" : "Articles";

const template = getArticleSidebar(language);

System.import(`../data/articles/articles.${language}.js`).then(function(m) {
	console.log(m);
	let articles = m.default;
	var rMore = language == 'en' ? 'Continue Reading...':'Leer Artículo...';
	var sTour = language == 'en' ? 'See tour':'Ver tour';
	var share = language == 'en' ? 'Share':'Compartir';
	var uri = window.location.href;
	if (uri.indexOf("http://localhost:9000") > -1) {
	  uri = "https://southamericanssecrets.github.io/web/";
	}
	const html = tpl.render({ items:	articles, link: rMore, sTour: sTour, share: share, uri: uri });
	document.querySelector('#page-content').innerHTML = html;
	const html2 = template.render({});
	document.querySelector('#articles-banners').innerHTML = html2;
});
