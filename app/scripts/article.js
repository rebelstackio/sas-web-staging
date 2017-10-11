import tpl from '../tpl/partials/article.en.njk';
import { getPageLanguage, getArticleSidebar } from './utils';

const language	= getPageLanguage('lng') || 'en' ;

document.title = language == "es" ? "Artículos" : "Articles";

const template = getArticleSidebar(language);

System.import(`../data/articles/articles.${language}.js`).then(function(m) {
	console.log(m);
	let articles = m.default;
	const html = tpl.render({ items:	articles });
	document.querySelector('#page-content').innerHTML = html;

	const html2 = template.render({});
	document.querySelector('#articles-banners').innerHTML = html2;
});
