import { getPageLanguage, getTourPageByLanguage } from './utils';
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

const tpl = getTourPageByLanguage(language);

System.import(`../data/tours/${dataRef}.${language}.js`).then(function(m) {
	console.log(m);
	let data = m.default;
	document.title = data.tab_title;
	var share = language == 'en' ? 'Share':'Compartir';
	var uri = window.location.href;
	if (uri.indexOf("http://localhost:9000") > -1) {
		uri = "https://southamericanssecrets.github.io/web"+window.location.pathname;
	}

	var html = tpl.render({ data:	data, share: share, uri: uri });
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
//Request reservation
function requestResv(id, that, fbase){
    var tour = document.getElementById(id);
    var name = tour.getElementsByClassName("rsv-name")[0].value,
    email = tour.getElementsByClassName("rsv-email")[0].value,
    date = tour.getElementsByClassName("rsv-date")[0].value,
    nPeople = tour.getElementsByClassName("rsv-people")[0].value,
    notes = tour.getElementsByClassName("rsv-notes")[0].value,
    tTitle = tour.getElementsByClassName("rsv-tour-info")[0].value,
    lang = tour.getElementsByClassName("rsv-lang")[0].value,
    tId = tour.getElementsByClassName("rsv-tour-info")[0].getAttribute('tour-id'),
    payment = tour.getElementsByClassName("rsv-payment")[0].value;

    that.disabled = true;

    //Crucial values
	if(tTitle != "" && tId != "" && name != "" && email != "" && date != "" && nPeople != ""){
        //Second validation
		if(validateEmail(email)){
            insertReservation({
                tTitle: tTitle,
                tId: tId,
                name: name,
                email: email,
                date: date,
                nPeople: nPeople,
                notes: notes,
                lang: lang,
                payment_type: payment
            },fbase,that);
        }else{
            tour.getElementsByClassName("rsv-warn-email")[0].setAttribute("class","rsv-warn-email rsv-warn");
            tour.getElementsByClassName("rsv-email")[0].focus();
            that.disabled = false;
        }
    }else{
        tour.getElementsByClassName("rsv-warn-regular")[0].setAttribute("class","rsv-warn-regular rsv-warn");
        that.disabled = false;
    }
}