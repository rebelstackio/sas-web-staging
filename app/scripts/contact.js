import { getPageLanguage, getContactPageByLanguage } from './utils';

let content = document.querySelector('#page-content');
const language	= getPageLanguage('lng') || 'en' ;
const tpl = getContactPageByLanguage(language);
var html = tpl.render();
document.querySelector('#page-content').innerHTML = html;

document.title = language == "es" ? "Contáctanos" : "Contact Us";

//const options = getContactChatOptionsByLanguafge(language);

document.addEventListener("DOMContentLoaded", function(event) {
//	const chat = new RebelChat(options);
});
