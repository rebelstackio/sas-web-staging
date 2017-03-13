var galleryMgr = {};
galleryMgr.imgHeight = 524;
galleryMgr.getHeight = function(){ return window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight||0; }
galleryMgr.gcontainer = null;
galleryMgr.show = function(a){
    if (this.gcontainer){
        var img = document.createElement("img");
        img.src = a.href;
        var mtop = (galleryMgr.getHeight() - galleryMgr.imgHeight)/2;
        img.style.marginTop = mtop + "px";
        this.gcontainer.innerHTML = "";
        this.gcontainer.appendChild(img);
        this.gcontainer.className = "show";
    }
};
galleryMgr.init = function(className){
    var gs = document.getElementsByClassName(className);
    if (gs.length > 0){
        var gc = document.createElement("div");
        gc.id = "galleryContainer";
        gc.onclick = function(){
            this.className = "";
        };
        this.gcontainer = document.body.appendChild(gc);
    }
    for (var i=0; i < gs.length; i++){
        var g = gs[i];
        var base = g.getAttribute("data-base");
        var imgs = g.getAttribute("data-imgs").split(",");
        for (var j=0; j<imgs.length; j++) {
            var a = document.createElement("a");
            a.href = base + "/" + imgs[j] + ".jpg";
            a.onclick = function(){
                galleryMgr.show(this);
                event.preventDefault();
                return false;
            };
            var img = document.createElement("img");
            img.src = base + "/" + imgs[j] + "_t.jpg";
            a.appendChild(img);
            g.appendChild(a);
        }
    }
}

document.addEventListener("DOMContentLoaded",function(){ galleryMgr.init("gallery"); }, false);
