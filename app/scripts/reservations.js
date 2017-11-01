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

const language	= localStorage['lng'] || 'en' ;

document.title = language == "es" ? "Reservaciones" : "Reservations";

var fixdate = function(d){
    var date = d.toString();
    if (date.length == 1) {
        date = "0"+date;
    }
    return date;
};

var months = {
    en:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    es:["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Setiembre","Octubre","Noviembre","Diciembre"]
};

var getDateByLang = function(lang, fecha){
    var dte;
    if(lang == "en"){
        dte = months["en"][fecha.getMonth()] + " " + fixdate(fecha.getDate()) + " " + fecha.getFullYear() + " at " + fecha.getHours() + ":" + fixdate(fecha.getMinutes());
        return dte;
    }
    dte = "El " + fixdate(fecha.getDate()) + " de " + months[language][fecha.getMonth()] + " de " + fecha.getFullYear() + " a las " + fecha.getHours() + ":" + fixdate(fecha.getMinutes());
    return dte;
};
firebase.auth().onAuthStateChanged(function(user) {
//Load messages from firebase
var messages = firebase.database().ref('reservations').orderByChild("timestamp").on('value', function(snapshot) {
    var messagelist = document.getElementById("message-list");
    while (messagelist.hasChildNodes()) {
        messagelist.removeChild(messagelist.lastChild);
    }
	snapshot.forEach(function(childSnapshot) {
		var key = childSnapshot.key;
		var childData = childSnapshot.val();

        var fecha = new Date(childData.timestamp);
        var dte = getDateByLang(language,fecha);
        var name = childData.name;
        var email = childData.email;
        var message = childData.notes;
        var tDate = childData.date;
        var pType = childData.payment_type;
        var nPeople = childData.nPeople;
        var tour_title = childData.tour_title;

        var title = document.createElement("div");
        title.style.className = "message-title-header";
        title.style.background = "rgba(0,0,0,0.4)";
        title.style.color = "white";
        title.innerHTML = "<p class='message-title'> "+(language == "es"? "Reservación" : "Reservation")+" <span>(" + dte + ")</span> </p>";

        var msg = document.createElement("div");
        msg.style.height = "auto";
        msg.className = "row message-wrapper";
        msg.style.background = "rgba(0,0,0,0.4)";
        msg.style.color = "white";

        var data = document.createElement("div");
        data.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";

        data.appendChild(createThingy("Tour",tour_title));
        data.appendChild(createThingy(language == "es"? "Nombre" : "Name",name));
        data.appendChild(createThingy(language == "es"? "Fecha tentativa" : "Tentative date",tDate));
        data.appendChild(createThingy(language == "es"? "N° Personas" : "N° People",nPeople));
        data.appendChild(createThingy(language == "es"? "Correo" : "Email",email));
        data.appendChild(createThingy(language == "es"? "Forma de pago" : "Payment type",pType));

        msg.appendChild(data);

        var messageDiv = document.createElement("div");
        messageDiv.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";

        var notes = document.createElement("div");
        notes.className = "reservation-label";
        notes.innerHTML = (language == "es"? "Notas adicionales" : "Additional notes")+":";

        messageDiv.appendChild(notes);


        var messagearea = document.createElement("div");
        messagearea.className = "message-area";
        messagearea.innerHTML = message;

        messageDiv.appendChild(messagearea);
        msg.appendChild(messageDiv);

        var item = document.createElement('div');
        item.appendChild(title);
        item.appendChild(msg);
        messagelist.insertBefore(item, messagelist.childNodes[0]);
	});
});
});

let board = document.querySelector('#page-content');
System.import(`../tpl/partials/reservations.${language}.njk`).then(function(m) {
	let tpl = m;
	var html = tpl.render({});
    board.innerHTML = html
});

function createThingy(labelText,contentText){
    var wrapper = document.createElement("div");
    wrapper.className = "rsv-wrapper";
    
    var label = document.createElement("span");
    label.className = "reservation-label "+labelText+"-span";
    label.innerHTML = `${labelText}:`;
    
    wrapper.appendChild(label);
    
    var content = document.createElement("span");
    content.className = "message-area";
    content.innerHTML = contentText;
    
    wrapper.appendChild(content);

    return wrapper;
}