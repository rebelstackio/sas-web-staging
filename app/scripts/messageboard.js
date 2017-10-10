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
	snapshot.forEach(function(childSnapshot) {
		var key = childSnapshot.key;
		var childData = childSnapshot.val();
		console.log(key);
        console.log(childData);

        var dte = new Date(childData.timestamp*1000);
        var name = childData.name;
        var email = childData.email;
        var message = childData.message;

        var title = document.createElement("div");
        title.style.height = "30px";
        title.style.background = "rgba(0,0,0,0.4)";
        title.style.color = "white";
        title.innerHTML = " On "+ dte + " " + name + "/" + email + " wrote: ";

        var msg = document.createElement("div");
        msg.style.height = "80px";
        msg.style.background = "rgba(0,0,0,0.4)";
        msg.style.color = "white";

        var messagearea = document.createElement("div");
        messagearea.style.height = "60px";
        messagearea.style.background = "rgba(255,255,255,0.9)";
        messagearea.style.color = "rgba(0,0,0,0.4)";
        messagearea.style.margin = "0 15px";
        messagearea.style.padding = "5px 5px";
        messagearea.innerHTML = message;

        msg.appendChild(messagearea);

        var item = document.createElement('li');
        item.appendChild(title);
        item.appendChild(msg);
        document.getElementById("message-list").appendChild(item);
	});
});

let board = document.querySelector('#page-content');
System.import(`../tpl/partials/messages.${language}.njk`).then(function(m) {
	console.log(m);
	let tpl = m;
	var html = tpl.render({});
    board.innerHTML = html
});