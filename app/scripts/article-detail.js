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
    var share = language == 'en' ? 'Share':'Compartir';
    var sTour = language == 'en' ? 'See Tour':'Ver Tour';
    var share_quote = language == 'en' ? 'Did you like this article?':'¿Te gustó el artículo?';
    var uri = window.location.href;
    if (uri.indexOf("http://localhost:9000") > -1) {
      uri = "https://southamericanssecrets.github.io/web"+window.location.pathname+window.location.search;
    }
	const html = tpl.render({ data:	data, share: share, uri: uri, share_quote: share_quote, sTour: sTour });
	document.querySelector('#page-content').innerHTML = html;
});
