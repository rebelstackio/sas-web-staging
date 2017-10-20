import msgsten from '../tpl/partials/messageboard-settings.en.njk';
import msgstes from '../tpl/partials/messageboard-settings.es.njk';
//email validation
var validateEmail = function (email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
};

const language	= localStorage['lng'] || 'en';
const tpl = language == 'es'? msgstes : msgsten;
var html = tpl.render();
document.querySelector('#page-content').innerHTML = html;

document.title = language == "es" ? "Contáctanos" : "Contact Us";

// Bind event to add email button
document.getElementById("add-email-btn").addEventListener("click", function(){
        var email = document.getElementById("settings-email").value;
        var email_list = document.getElementById("email_list");
        if(validateEmail(email)){
            var li = document.createElement("li");
            li.innerHTML = email;
            email_list.appendChild(li);
        }else{
            document.getElementById("settings-warn-email").setAttribute("class","settings-warn");
            document.getElementById("settings-email").focus();
        }
});

//Bind event to email input
document.getElementById("settings-email").addEventListener("keypress", function(){
	document.getElementById("settings-warn-email").setAttribute("class","settings-warn settings-warn-hidden");
});