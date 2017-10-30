import msgsten from '../tpl/partials/messageboard-settings.en.njk';
import msgstes from '../tpl/partials/messageboard-settings.es.njk';
// This import loads the firebase namespace along with all its type information.
import firebase from 'firebase';

// Initialize Firebase
var config = {
    apiKey: "AIzaSyADWQW2m0LOHMLhjbv27iQwQjVKLvIiqEw",
    authDomain: "secrets-74e91.firebaseapp.com",
    databaseURL: "https://secrets-74e91.firebaseio.com",
    projectId: "secrets-74e91"
};
firebase.initializeApp(config);
//DB auth
firebase.auth().signInAnonymously().catch(function(error) {
    console.log(error.code);
    console.log(error.message);
});

const language	= localStorage['lng'] || 'en';
const tpl = language == 'es'? msgstes : msgsten;
var html = tpl.render();
document.querySelector('#page-content').innerHTML = html;

function singDB(){
    firebase.auth().signInAnonymously().catch(function(error) {
        console.log(error.code);
        console.log(error.message);
    });
}
function dostuffDb(cb){
    singDB();
    firebase.auth().onAuthStateChanged(function(user) {
        cb(user);
    });
}
function addMail(user,email){
    if (user) {
        // User is signed in.
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var database = firebase.database();
        database.ref('mails').push({
            email: email
        }).then(function(e){
            document.getElementById("settings-email").value = "";
        });
    } else {
        // User is signed out.
    }
}
function loadEmails(){
    var mails = firebase.database().ref('mails').on('value', function(snapshot) {
        var email_list = document.getElementById("email_list");
        while (email_list.hasChildNodes()) {
            email_list.removeChild(email_list.lastChild);
        }
        snapshot.forEach(function(childSnapshot) {
            var key = childSnapshot.key;
            var childData = childSnapshot.val();

            var email = childData.email;
            var li = document.createElement("li");
            li.innerHTML = email;
            email_list.appendChild(li);
        });
    });
}
function isNotified(){
    var notification = firebase.database().ref("notifications").once('value', function(snapshot){
        var val = snapshot.val();
        document.getElementById("isNotified").checked = (val == "1");
    });
}

document.title = language == "es" ? "Contáctanos" : "Contact Us";

document.addEventListener("DOMContentLoaded", function(event) {
    dostuffDb(loadEmails);
    dostuffDb(isNotified);
});

document.getElementById("isNotified").addEventListener("change",function(){
    var checked = this.checked;
    dostuffDb(function(){
        firebase.database().ref("notifications").set(checked? 1 : 0);
    });
});

// Bind event to add email button
document.getElementById("add-email-btn").addEventListener("click", function(){
    var email = document.getElementById("settings-email").value;
    if(validateEmail(email)){
        //DB auth
        dostuffDb(function(user){
            addMail(user,email);
        });
    }else{
        document.getElementById("settings-warn-email").setAttribute("class","settings-warn");
    }
    document.getElementById("settings-email").focus();
});

//Bind event to email input
document.getElementById("settings-email").addEventListener("keypress", function(){
	document.getElementById("settings-warn-email").setAttribute("class","settings-warn settings-warn-hidden");
});