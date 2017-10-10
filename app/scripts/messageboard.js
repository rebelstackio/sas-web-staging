// This import loads the firebase namespace along with all its type information.
import * as firebase from 'firebase/app';
// These imports load individual services into the firebase namespace.
import 'firebase/auth';
import 'firebase/database';

// Initialize Firebase
var config = {
    apiKey: "AIzaSyADWQW2m0LOHMLhjbv27iQwQjVKLvIiqEw",
    authDomain: "secrets-74e91.firebaseapp.com",
    databaseURL: "https://secrets-74e91.firebaseio.com",
    projectId: "secrets-74e91"
};
firebase.initializeApp(config);

//Load messages from firebase
var messages = firebase.database().ref('messages');
messages.on('value', function(snapshot) {
    console.log(snapshot.val());
var arr = snapshot.val();
for (var i = 0; i < arr; i++) {
    console.log(arr[i]);
}
});
const language	= localStorage['lng'] || 'en' ;

let board = document.querySelector('#page-content');
System.import(`../tpl/partials/messages.${language}.njk`).then(function(m) {
	console.log(m);
	let tpl = m;
	var html = tpl.render({});
    board.innerHTML = html
});