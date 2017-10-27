import tpl from '../tpl/partials/last-news.njk';
import { getPageLanguage, getLastNewsBannerByLanguage } from './utils';

const language	= getPageLanguage('lng') || 'en' ;

const template = getLastNewsBannerByLanguage(language);

document.title = "South American's Secrets";

System.import(`../data/home/last-news.${language}.js`).then(function(m) {
	console.log(m);
  let LastNews = m.default;
  var rMore = language == 'en' ? 'Continue Reading...':'Leer Artículo...';
  var sTour = language == 'en' ? 'See tour':'Ver tour';
  var share = language == 'en' ? 'Share':'Compartir';
  var uri = window.location;
  if (uri.href.indexOf("http://localhost:9000") > -1) {
    uri = "https://southamericanssecrets.github.io/web/";
  }
  const html = tpl.render({ items:  LastNews, link: rMore, sTour: sTour, share: share, uri: uri });
  document.querySelector('#last-news').innerHTML = html;

	const html2 = template.render({});
  document.querySelector('#last-news-banners').innerHTML = html2;
  
  document.getElementsByClassName("read-more");
});
