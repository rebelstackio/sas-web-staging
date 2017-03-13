function initMenu(){
 var menus = document.getElementsByTagName("menu");
 for (i=0; i < menus.length; i++)
 {
  var as = menus[i].getElementsByTagName("a");
  for (j=0; j < as.length; j++) { if (!as[j].title) as[j].title = "click here to read more about " + as[j].innerHTML; }
 }
}