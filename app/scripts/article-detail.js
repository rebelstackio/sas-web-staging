import tpl from '../tpl/partials/article-content.en.njk';
import { getPageLanguage, getArticleSidebar } from './utils';


/*Returns url parametters in a js object*/
var parseQueryString = function(url) {
    var urlParams = {};
    url.replace(
        new RegExp("([^?=&]+)(=([^&]*))?", "g"),
        function($0, $1, $2, $3) {
            urlParams[$1] = $3;
        }
    );

    return urlParams;
};

var params = parseQueryString(document.location.search);

const language	= getPageLanguage('lng') || 'en' ;

System.import(`../data/articles/full-articles/article.${params.id}.${language}.js`).then(function(m) {
    let data = m.default;
    document.title = data.tab_title;
	const html = tpl.render({ data:	data });
	document.querySelector('#page-content').innerHTML = html;
});
