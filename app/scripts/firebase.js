// This import loads the firebase namespace along with all its type information.
import firebase from 'firebase';

// These imports load individual services into the firebase namespace.
/* import 'firebase/auth';
import 'firebase/database'; */

// Initialize Firebase
var config = {
    apiKey: "AIzaSyADWQW2m0LOHMLhjbv27iQwQjVKLvIiqEw",
    authDomain: "secrets-74e91.firebaseapp.com",
    databaseURL: "https://secrets-74e91.firebaseio.com",
    projectId: "secrets-74e91"
};
firebase.initializeApp(config);

// creates uuid
function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
}

// shows message
function showMsg(){
    var language = localStorage['lng'] || 'en' ;
    var lildata = {
        'es':{
            title: 'Mensaje Enviado',
            subtitle: 'Le responderemos pronto'
        },'en':{
            title: 'Message sent',
            subtitle: 'We will contact you soon'
        }};
    
    document.querySelector('#msg-form').innerHTML = '</br><div style="text-align: center" class="col-md-12">'+
    '<h2>'+lildata[language].title+'</h2>'+
    '<h3>'+lildata[language].subtitle+'</h3>'+
    '</div>';
}

// Bind event to submit button
document.getElementById("send-msg").addEventListener("click", function(){
    var name = document.getElementById("form-name").value,
    email = document.getElementById("form-email").value,
    message = document.getElementById("form-message").value;

    if(name != "" && email != "" && message != ""){

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
                
                database.ref('messages/' + uuidv4()).set({
                    name: name,
                    email: email,
                    message : message,
                    timestamp: firebase.database.ServerValue.TIMESTAMP
                }).then(function(e){
                    // The message has been saved
                    // Shows sent message
                    showMsg();
                });
            } else {
                // User is signed out.
                // ...
            }
        });
    }
});