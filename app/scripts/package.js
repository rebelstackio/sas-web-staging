import { getPageLanguage, getPackagePageByLanguafge, signDB, dostuffDb, requestResv } from './utils';
import firebase from 'firebase';

// Initialize Firebase
var config = {
    apiKey: "AIzaSyADWQW2m0LOHMLhjbv27iQwQjVKLvIiqEw",
    authDomain: "secrets-74e91.firebaseapp.com",
    databaseURL: "https://secrets-74e91.firebaseio.com",
    projectId: "secrets-74e91"
};
firebase.initializeApp(config);

let content = document.querySelector('#page-content');
let dataRef = content.getAttribute('data-ref');

const language	= getPageLanguage('lng') || 'en' ;

const tpl = getPackagePageByLanguafge(language);

System.import(`../data/packages/${dataRef}.${language}.js`).then(function(m) {
	console.log(m);
	let data = m.default;
	document.title = data.tab_title;
	var share = language == 'en' ? 'Share':'Compartir';
	var uri = window.location.href;
	if (uri.indexOf("http://localhost:9000") > -1) {
	  uri = "https://southamericanssecrets.github.io/web"+window.location.pathname;
	}
	var html = tpl.render({ data: data, share: share, uri: uri });
	document.querySelector('#page-content').innerHTML = html;

		// Bind event to submit button
		var requestReservationButtons = document.getElementsByClassName("request-reservation");
		for(var i = 0; i < requestReservationButtons.length; i++){
			requestReservationButtons[i].addEventListener("click", function(){
				var id = this.getAttribute('parent-modal');
				requestResv(id, this, firebase);
			});
		}
});
