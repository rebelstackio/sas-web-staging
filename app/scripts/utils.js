import tourtplen from '../tpl/partials/tours-page.en.njk';
import tourtples from '../tpl/partials/tours-page.es.njk';
import contacten from '../tpl/partials/contactcontent.en.njk';
import contactes from '../tpl/partials/contactcontent.es.njk';
import packagees from '../tpl/partials/package-page.es.njk';
import packageen from '../tpl/partials/package-page.en.njk';
import lastnewsbanneres from '../tpl/partials/last-news-banner.es.njk';
import lastnewsbanneren from '../tpl/partials/last-news-banner.en.njk';
import articlesidebaren from '../tpl/partials/article-sidebar.en.njk';
import articlesidebares from '../tpl/partials/article-sidebar.es.njk';

export function getPageLanguage(name, url) {
	return  localStorage['lng'] ;
}


export function getTourPageByLanguage(lng) {
	switch (lng) {
		case 'es':
			return tourtples;
			break;
		case 'en':
			return tourtplen;
			break;
		default:
			return tourtplen;
	}
}

export function getContactPageByLanguage(lng) {
	switch (lng) {
		case 'es':
			return contactes;
			break;
		case 'en':
			return contacten;
			break;
		default:
			return contacten;
	}
}

export function getPackagePageByLanguafge(lng) {
	switch (lng) {
		case 'es':
			return packagees;
			break;
		case 'en':
			return packageen;
			break;
		default:
			return packageen;
	}
}

export function getLastNewsBannerByLanguage(lng) {
	switch (lng) {
		case 'es':
			return lastnewsbanneres;
			break;
		case 'en':
			return lastnewsbanneren;
			break;
		default:
			return lastnewsbanneren;
	}
}

export function getArticleSidebar(lng) {
	switch (lng) {
		case 'es':
			return articlesidebares;
			break;
		case 'en':
			return articlesidebaren;
			break;
		default:
			return articlesidebaren;
	}
}

export //Request reservation
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
	if(tId != "" && name != "" && email != "" && date != "" && nPeople != ""){
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