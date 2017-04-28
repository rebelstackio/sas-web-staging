import LastNews from '../data/home/last-news.en.js';

import tpl from '../tpl/partials/last-news.njk';

//TODO CHANGE LASTNEWS DATA DEPENDS ON LANGUAGE

var html = tpl.render({ items:  LastNews });
document.querySelector('#last-news').innerHTML = html;
