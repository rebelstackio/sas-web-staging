document.getElementsByClassName = function(clsName){ 
 var r = new Array(); 
 var e = document.getElementsByTagName("div"); 
 for(var i = 0;i < e.length;i++) if(e[i].className == clsName) r.push(e[i]); 
 return r; 
}