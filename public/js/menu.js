var navbar = $("#mainmenu");

$('.container-app').on('scroll', function(event){
       var $elm = $(event.target);
       if($elm.scrollTop()>240){
          navbar.addClass("navbar-fixed-top");
       }else{
           navbar.removeClass("navbar-fixed-top");
       }
});