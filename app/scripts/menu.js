import { getPageLanguage } from './utils';

const language	= getPageLanguage('lng') || 'en' ;
let menu = document.querySelector('#menu-content');
System.import(`../tpl/partials/menu.${language}.njk`).then(function(m) {
	console.log(m);
	let tpl = m;
	var html = tpl.render({});
	menu.innerHTML = html;
});





//floating navbar event
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
