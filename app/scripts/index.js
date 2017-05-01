import LastNews from '../data/home/last-news.en.js';
import tpl from '../tpl/partials/last-news.njk';
import { getPageLanguage } from './utils';

const language	= getPageLanguage('lng') || 'en' ;

System.import(`../data/home/last-news.${language}.js`).then(function(m) {
	console.log(m);
  let LastNews = m.default;
  var html = tpl.render({ items:  LastNews });
  document.querySelector('#last-news').innerHTML = html;
});
