import { getPageLanguage } from './utils';

const language	= getPageLanguage('lng') || 'en' ;
let menu = document.querySelector('#menu-content');
System.import(`../tpl/partials/menu.${language}.njk`).then(function(m) {
	console.log(m);
	let tpl = m;
	var html = tpl.render({});
	menu.innerHTML = html;
});

$('.container-app').on('scroll', function(event){
			let navbar = $("#mainmenu");
			console.log("scroll");
			 var $elm = $(event.target);
			 if($elm.scrollTop()>240){
					navbar.addClass("navbar-fixed-top");
					$(".page").addClass("padding-page");
			 }else{
					 navbar.removeClass("navbar-fixed-top");
					 $(".page").removeClass("padding-page");
			 }
});

$(document).on('click', '#change-language-link', function(event){
	let element = event.target;
	const lng = $(this).attr('data-lng');
	let image = '';
	let newLng = '';
	let title = '';
	switch (lng) {
		case 'en':
			image = 'images/spain_flag.ico';
			newLng = 'es';
			title = 'Spanish'
			break;
		case 'es':
			image = 'images/usa_flag.ico';
			newLng = 'en';
			title = 'English'
			break;
		default:
			image = 'images/spain_flag.ico';
			newLng = 'es';
			title = 'English'
	}

	const language	= getPageLanguage('lng');

	localStorage['lng'] = lng;

	location.reload();
})
