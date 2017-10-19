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

//email validation
var validateEmail = function (email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
};

let content = document.querySelector('#page-content');
let dataRef = content.getAttribute('data-ref');

const language	= getPageLanguage('lng') || 'en' ;

const tpl = getTourPageByLanguage(language);

System.import(`../data/tours/${dataRef}.${language}.js`).then(function(m) {
	console.log(m);
	let data = m.default;
	document.title = data.tab_title;
	var html = tpl.render({ data:	data });
	document.querySelector('#page-content').innerHTML = html;

	//Bind event to inputs
	var inputs = document.getElementsByClassName("rsv-input");
	for(var i=0; i<inputs.length; i++) {
		inputs[i].addEventListener("keypress", function(){
			document.getElementById("rsv-warn").setAttribute("class","rsv-warn rsv-warn-hidden");
		});
	}

	//Bind event to email input
	document.getElementById("rsv-email").addEventListener("keypress", function(){
		document.getElementById("rsv-warn-email").setAttribute("class","rsv-warn rsv-warn-hidden");
	});

	// Bind event to submit button
	document.getElementById("request-reservation").addEventListener("click", function(){
		var name = document.getElementById("rsv-name").value,
		email = document.getElementById("rsv-email").value,
		date = document.getElementById("rsv-date").value,
		nPeople = document.getElementById("rsv-people").value,
		notes = document.getElementById("rsv-notes").value,
		tTitle = document.getElementById("rsv-tour-info").value,
		lang = document.getElementById("rsv-lang").value,
		tId = document.getElementById("rsv-tour-info").getAttribute('tour-id');

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
					lang: lang
				});
			}else{
				//Notify user...rsv-warn-email
				document.getElementById("rsv-warn-email").setAttribute("class","rsv-warn");
				document.getElementById("rsv-email").focus();
			}
		}else{
			//Notify user...
			document.getElementById("rsv-warn").setAttribute("class","rsv-warn");
		}
	});
});

// creates uuid
function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
}

//Insert to Firebase
function insertReservation(obj){
	//DB auth
	firebase.auth().signInAnonymously().catch(function(error) {
		console.log(error.code);
		console.log(error.message);
	});
	//DB post-auth event listener
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			// User is signed in.
			var isAnonymous = user.isAnonymous;
			var uid = user.uid;
			// ...
			var database = firebase.database();

			database.ref('reservations/' + uuidv4()).set({
				name: obj.name,
				email: obj.email,
				date : obj.date,
				tour_id : obj.tId,
				tour_title : obj.tTitle,
				notes: obj.notes,
				nPeople: obj.nPeople,
				lang: obj.lang,
				timestamp: firebase.database.ServerValue.TIMESTAMP
			}).then(function(e){
				// The message has been saved
				// Shows sent message
				// Notify user...
				$("#"+obj.tId+"-modal").modal("hide");
				$("#sent-reservation").modal({backdrop: true});
			});
		} else {
			// User is signed out.
			// ...
		}
	});
}