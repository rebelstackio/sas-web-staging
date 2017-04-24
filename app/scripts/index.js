import LastNews from '../data/home/last-news.en.js';
import tpl from '../tpl/partials/last-news.njk';
var html = tpl.render({ items:  LastNews });
document.querySelector('#last-news').innerHTML = html;

