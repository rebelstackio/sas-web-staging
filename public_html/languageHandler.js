/* Language Handler - by Rein Petersen */
var LanguageHandler = {};
LanguageHandler.lls = [];
LanguageHandler.buildLangSelector = function(langSelector){
 var langSelectors = document.getElementsByClassName(langSelector);
 if (langSelectors.length > 0){
  for (var i=0; i<langSelectors.length; i++)
   for (var j=0; j<this.lls.length; j++){
    var a=document.createElement('a');
    a.lang=this.lls[j].getAttribute('hreflang');
    a.href=this.lls[j].getAttribute('href');
    a.title=this.lls[j].getAttribute('data-title');
    a.innerHTML=this.lls[j].getAttribute('data-language');
       a.addEventListener('click',function(){
           document.setPrefLang(this.lang,30);
           console.log('set preflang cookie to: ' + this.lang);
       },false)
    langSelectors[i].appendChild(a);
   }
 }
 else console.warn('LanguageHandler cannot find an langSelector element with className: ' + langSelector);
};
LanguageHandler.init = function(langSelector){
 var heads = document.getElementsByTagName("head");
 var links = heads[0].getElementsByTagName("link");
 for (var i=0; i<links.length; i++) if (links[i].getAttribute('hreflang')) this.lls.push(links[i]);
 if (this.lls.length > 0) {
     for (var j=0; j<this.lls.length; j++){
         var hreflang = this.lls[j].getAttribute('hreflang');
         if (hreflang == document.getPrefLang()){
             if (window.location.replace) window.location.replace(this.lls[j].href);
             else window.location=this.lls[j].href;
         }
     }
     this.buildLangSelector(langSelector);
 }
};

var initLang = function(){ LanguageHandler.init('langSelect'); };

document.addEventListener("DOMContentLoaded",initLang,false);
