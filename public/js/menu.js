var navbar = $("#mainmenu");

$('.container-app').on('scroll', function(event){
			 var $elm = $(event.target);
			 if($elm.scrollTop()>240){
					navbar.addClass("navbar-fixed-top");
					$(".page").addClass("padding-page");
			 }else{
					 navbar.removeClass("navbar-fixed-top");
					 $(".page").removeClass("padding-page");
			 }
});

// 
// $( document ).ready(function() {
// 	window.setTimeout(function(){
// 		$('#lng-togl').bootstrapToggle({
// 			off: "<img src='images/usa_flag.ico' width='30px' height='30px'/>",
// 			on: "<img src='images/spain_flag.ico' width='30px' height='30px'/>",
// 			height:10
// 		});
// 	}, 500);
// });
