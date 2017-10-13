import aen from '../tpl/pages/about.en.njk';
import aes from '../tpl/pages/about.es.njk';

var language = localStorage['lng'] || 'en' ;

let content = document.querySelector('#page-content');

const tpl = language == "es" ? aes : aen;
var html = tpl.render();
document.querySelector('#page-content').innerHTML = html;

document.title = "About us";

//const options = getContactChatOptionsByLanguafge(language);

document.addEventListener("DOMContentLoaded", function(event) {
//	const chat = new RebelChat(options);
});
