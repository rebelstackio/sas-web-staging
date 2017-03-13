/* Reserve It - by Rein Petersen */

var ReserveIt = {};
ReserveIt.sessionID = null;
ReserveIt.location = null;
ReserveIt.session = null;
ReserveIt.modal = {};
ReserveIt.modal.element = null;
ReserveIt.locationServiceURL = "https://freegeoip.net/json/";
ReserveIt.cartStyleURL = "/cart.css";

ReserveIt.modal.getForm = function(frmcls) {
    if (frmcls) {
        var forms = this.element.getElementsByTagName('form');
        for (var i=0; i<forms.length; i++) {
            if (forms[i].className == "cartSummary") return forms[i];
        }
        return null;
    }
    else return this.element.getElementsByTagName('form')[0];
};
ReserveIt.InputTypeSupported = function(type){
    var i = document.createElement("input");
    i.setAttribute("type",type);
    if (i.type !== "text") return true;
    else return false;
};
ReserveIt.polyfillInputDate = function(){
    var lnk = ReserveIt.loadExternal("stylesheet","/jquery/jquery-ui-1.10.4.custom.min.css");
    var s1 = ReserveIt.loadExternal("script","/jquery/jquery-1.10.2.js");
    window.addEventListener("jqueryCoreLoaded",function(){
        var s2 = ReserveIt.loadExternal("script","/jquery/jquery-ui-1.10.4.custom.min.js");
        window.addEventListener("jqueryUIcustomLoaded",function(){
            var fn = function() { $(function(){ $("input[type='date']").datepicker({"altFormat":"yyyy-mm-dd"});}); };
            var delay = setTimeout(fn,1500);
        },false);
    },false);
};
ReserveIt.loadExternal = function(type,location){
    var external = null;
    var head = document.getElementsByTagName("head")[0];
    switch(type) {
        case "stylesheet":
            external = document.createElement("link");
            external.href = location;
            external.rel = "stylesheet";
            break;
        case "script":
            external = document.createElement("script");
            external.src = location;
            break;
    }
    return head.appendChild(external);
};
ReserveIt.modal.show = function(offerElement){
    var f; var modalClass = "";
    if (ReserveIt.session && ReserveIt.session.paypal) {
        f= document.getElementsByClassName("AddItem")[0];
        modalClass="AddItem"
    }
    else {
        f = document.getElementsByClassName("NewReservation")[0];
        modalClass="NewReservation";
    }
    //var f = this.getForm();
    f.code.value=offerElement.getCode();
    f.getElementsByClassName('reserveTitleEl')[0].innerHTML = offerElement.getTitle();
    f.getElementsByClassName('reserveSummaryEl')[0].innerHTML = offerElement.getSummary();
    f.price.value=offerElement.getPrice();
    f.getElementsByClassName('reservePriceEl')[0].getElementsByTagName('span')[0].innerHTML = offerElement.getPrice();
    f.getElementsByClassName('reservePriceEl')[0].getElementsByTagName('span')[1].innerHTML = offerElement.getUnit();
    f.getElementsByClassName('reserveQty')[0].getElementsByTagName('span')[0].innerHTML = offerElement.getUnit() + '(s)';
    f.getElementsByClassName('reserveQty')[0].getElementsByTagName('input')[0].min = offerElement.getMinQty();
    this.element.className = modalClass;
    ReserveIt.getSessionID(); // this may return undefined
    ReserveIt.getLocation();
};
ReserveIt.tdmake = function (txt,tr){
    var td = document.createElement("td");
    td.innerHTML = txt;
    if (tr) {
        tr.appendChild(td);
    }
    else return td;
};

ReserveIt.wireCartLogin = function(){
    var f = document.getElementsByClassName("cartLogin")[0];
    var closeButton = f.getElementsByTagName('button')[0];
    closeButton.onclick = function(){
        this.parentElement.parentElement.className = "";
        return false;
    };
    f.onsubmit = function(){
        console.log("cartLogin submitted:");
        ReserveIt.getJSONSession(this.email.value,this.invoice.value);
        return false;
    }
};

ReserveIt.buildSummaryItemTR = function(item){
    var tr = document.createElement("tr");

    var code = ReserveIt.tdmake(item.name);
    tr.appendChild(code);
    
    var date = null;
    if (item.date) date = ReserveIt.tdmake(item.date);
    else date = ReserveIt.tdmake("");
    tr.appendChild(date);
    
    var qty = ReserveIt.tdmake(item.quantity);
    tr.appendChild(qty);
    
    var itemdesc = item.description;
    var priceexp = /[^price:]\d+\.\d{2}/i;
    var priceStr = priceexp.exec(itemdesc)[0];
    var price = ReserveIt.tdmake(priceStr);
    tr.appendChild(price);
    
    var amountStr = (parseInt(item.quantity) * parseFloat(priceStr)).toFixed(2);
    var amount = ReserveIt.tdmake(amountStr);
    tr.appendChild(amount);
    
    var depositStr = (parseInt(item.quantity) * parseFloat(item.unit_price.value)).toFixed(2);
    var deposit = ReserveIt.tdmake(depositStr);
    tr.appendChild(deposit);
    
    var removeBTN = document.createElement("button");
    removeBTN.innerHTML = "remove";
    removeBTN.onclick = function(){
        console.log(" (cart summary) remove item clicked: ");
        console.log(this);
    }
    var remove = ReserveIt.tdmake("");
    remove.appendChild(removeBTN);
    tr.appendChild(remove);

    return tr;
}

ReserveIt.BuildFeeItemTR = function(item){
    var tr = document.createElement("tr");
    var code = ReserveIt.tdmake(item.name);
    code.colSpan =5;
    tr.appendChild(code);

    var depositStr = (parseInt(item.quantity) * parseFloat(item.unit_price.value)).toFixed(2);
    var deposit = ReserveIt.tdmake(depositStr);
    tr.appendChild(deposit);

    return tr;    
};

ReserveIt.BuildCSTotalDepositFeeTR = function(session){
    var tr = document.createElement("tr");
    var code = ReserveIt.tdmake("Total Deposit + Fee:");
    code.colSpan =5;
    tr.appendChild(code);

    var total = 0;
    var items = session.paypal.items;
    for (var i=0; i<items.length;i++){
        var qty = parseInt(items[i].quantity);
        var val = parseFloat(items[i].unit_price.value);
        total+=qty*val;
        
    }
    total = total.toFixed(2);
    var totalTD = ReserveIt.tdmake(total);
    tr.appendChild(totalTD);

    return tr;    
    
}

ReserveIt.buildCartControls = function(session){
    var f= document.getElementsByClassName("cartSummary")[0];
    var controls = f.getElementsByClassName('controls')[0];
    controls.innerHTML = "";
    if (controls) {
        if (session.status != "CANCEL") {
            var cancel = document.createElement("button");
            cancel.innerHTML = "CANCEL RESERVATION";
            cancel.onclick = function (e) {
                console.log("Cancel Reservation button clicked: ");
                console.log(e);
                console.log(this);
                var formData = new FormData();
                formData.append("mode","cancel");
                formData.append("lang",document.getPrefLang());
                formData.append("clientEmail",session.clientInfo.email);
                formData.append("clientName",session.clientInfo.name);
                formData.append("sessionID",session.sessionID);
                formData.append("country",session.locationInfo.country);
                var oReq = new XMLHttpRequest();
                oReq.addEventListener("load",ReserveIt.cancelComplete,false);
                oReq.addEventListener("error",ReserveIt.cancelFailed,false);
                oReq.open("post","/reservit.php",true);
                oReq.send(formData);
                ReserveIt.modal.element.className = "canceling";
                return false;
            };
            controls.appendChild(cancel);
        }
        switch (session.status) {
            case "DRAFT":
                var finalize = document.createElement('button');
                finalize.className = "paybutton";
                finalize.innerHTML = "SUBMIT RESERVATION (FINAL)";
                finalize.onclick = function (e) {
                    console.log("Submit Reservation button clicked: ");
                    console.log(e);
                    console.log(this); // use this to access button
                    /* TODO : implement finalize reservation */
                    var formData = new FormData();
                    formData.append("mode","final");
                    formData.append("lang",document.getPrefLang());
                    formData.append("clientEmail",session.clientInfo.email);
                    formData.append("clientName",session.clientInfo.name);
                    formData.append("sessionID",session.sessionID);
                    formData.append("country",session.locationInfo.country);
                    var oReq = new XMLHttpRequest();
                    oReq.addEventListener("load",ReserveIt.finalizeComplete,false);
                    oReq.addEventListener("error",ReserveIt.finalizeFailed,false);
                    oReq.open("post","/reservit.php",true);
                    oReq.send(formData);
                    ReserveIt.modal.element.className = "finalizing";
                    return false;
                };
                controls.appendChild(finalize);
                break;
            case "DRAFTFIN":
                break;

            case "CONFIRM":
                var pay = document.createElement('button');
                pay.innerHTML = "PAY RESERVATION";
                pay.className = "paybutton";
                pay.onclick = function (e) {
                    console.log("Pay button button clicked: ");
                    /* todo: wire up pay page */
                    ReserveIt.modal.element.className = "paypage";
                    var paypage = document.getElementsByClassName("paypage")[0];
                    var paywithpaypalBTN = paypage.getElementsByClassName("paywithpaypal")[0];
                    paywithpaypalBTN.onclick = function(){
                        var formData = new FormData();
                        formData.append("paypalID",session.paypal.id);
                        var oReq = new XMLHttpRequest();
                        oReq.addEventListener("load",ReserveIt.sendPaypalInvoiceComplete,false);
                        oReq.addEventListener("error",ReserveIt.sendPaypalInvoiceFailed,false);
                        oReq.open("post","/reservit_sendpaypal.php",true);
                        oReq.send(formData);
                        ReserveIt.modal.element.className = "sendingpaypal";
                    }
                    return false;
                }
                controls.appendChild(pay);
                break;
        }


    }



}

ReserveIt.statusMessages = {};
ReserveIt.statusMessages["DRAFT"] = {};
ReserveIt.statusMessages["DRAFT"]["en"] = "NEW Reservation (submit for confirmation)";
ReserveIt.statusMessages["DRAFT"]["es"] = "NEW Reservation (submit for confirmation)";

ReserveIt.statusMessages["DRAFTFIN"] = {};
ReserveIt.statusMessages["DRAFTFIN"]["en"] = "Reservation (awaiting confirmation)";
ReserveIt.statusMessages["DRAFTFIN"]["es"] = "Reservation (awaiting confirmation)";

ReserveIt.statusMessages["CONFIRM"] = {};
ReserveIt.statusMessages["CONFIRM"]["en"] = "CONFIRMED Reservation (guarantee with payment)";
ReserveIt.statusMessages["CONFIRM"]["es"] = "CONFIRMED Reservation (guarantee with payment)";

ReserveIt.statusMessages["PAID"] = {};
ReserveIt.statusMessages["PAID"]["en"] = "PAID Reservation (completed)";
ReserveIt.statusMessages["PAID"]["es"] = "PAID Reservation (completed)";

ReserveIt.statusMessages["REFUND"] = {};
ReserveIt.statusMessages["REFUND"]["en"] = "REFUNDED Reservation";
ReserveIt.statusMessages["REFUND"]["es"] = "REFUNDED Reservation";

ReserveIt.statusMessages["CANCEL"] = {};
ReserveIt.statusMessages["CANCEL"]["en"] = "CANCELED Reservation";
ReserveIt.statusMessages["CANCEL"]["es"] = "CANCELED Reservation";


ReserveIt.getResStatusMessage = function(status,lang){
    if (!lang) lang = document.getPrefLang();
    if (!lang) lang = "en";
    return ReserveIt.statusMessages[status][lang];
};


ReserveIt.buildCartSummary = function(session){
    // var f=this.getForm("cartSummary");
    var f= document.getElementsByClassName("cartSummary")[0];
    var statmsg = f.getElementsByClassName("statusmessage")[0];
    statmsg.innerHTML = ReserveIt.getResStatusMessage(session.status);
    var header = f.getElementsByClassName("cartSummaryHeader")[0];
    var tbody = f.getElementsByTagName("tbody")[0];
    tbody.innerHTML="";
    var tfoot = f.getElementsByTagName("tfoot")[0];
    tfoot.innerHTML = "";

    /* TODO: figure out the modes of a cart
     1. DRAFT or DRAFTFIN can be canceled
     2. DRAFT can be canceled or finalized
     3. later on, DRAFT can be modified (items changed (date,qty) or removed)
     How to change items within a form? simply change the paypal json items list...
     */
    ReserveIt.modal.element.className = "showCart";
    var closeButton = f.getElementsByTagName('button')[0];
    closeButton.onclick = function(){
        this.parentElement.parentElement.className = "";
        return false;
    };


    f.clientName.value = session.clientInfo.name;
    f.clientEmail.value = session.clientInfo.email;
    f.invoiceID.value = session.sessionID;
    f.date.value = session.createdUnix.split(" ")[0];
    

    var items = session.paypal.items;

    var processingfeexpr = /(processing fee){1}/i;
    for (var i=0; i < items.length; i++) {
        if (processingfeexpr.test(items[i].name)) {
            console.log("a processing fee... handle in tfoot")
            tfoot.appendChild(ReserveIt.BuildFeeItemTR(items[i]))   
        }
        else tbody.appendChild(ReserveIt.buildSummaryItemTR(items[i]));
    }
    tfoot.appendChild(ReserveIt.BuildCSTotalDepositFeeTR(session));
    
    /* TODO : add cancel and finalize buttons
     cancel button available always
     finalize button only available for drafts
     */

    ReserveIt.buildCartControls(session)

};

ReserveIt.modal.showCart = function(session) {

    if (!session) {
        /* if there is no session, maybe there is no sessionID */
        if (!ReserveIt.sessionID) ReserveIt.getSessionID();
        /* give them opportunity to fetch their draft */
        ReserveIt.wireCartLogin();
        this.element.className = "cartLogin";
    }
    else ReserveIt.buildCartSummary(session);

};
ReserveIt.transferComplete = function(oEvent){
  if (oEvent.currentTarget.status == "200") { //  oEvent.srcElement.status == "200"
    console.log("Reservation Request Message: " + oEvent.currentTarget.status);
    ReserveIt.modal.element.className = "processed";
  }
  else ReserveIt.transferFailed(oEvent);
};
ReserveIt.transferFailed = function(oEvent){
    console.log("Reservation Request Message: " + oEvent.currentTarget.status);
    ReserveIt.modal.element.className = "error";
};
ReserveIt.transferCanceled = function(oEvent){
    console.log("Reservation Request Message: " + oEvent.currentTarget.status);
    ReserveIt.modal.element.className = "error";
};
ReserveIt.gotSessionID = function(oEvent){
    console.log("Reserve.gotSessionID called (listening on event gotSessionID)");
    console.log(oEvent.detail);
    ReserveIt.sessionID = oEvent.detail.sessionID;
    /* TODO: with sessionID, ordering can contine */

}
ReserveIt.gotLocation = function(oEvent){
    console.log("Reserve.gotLocation called (listening on event gotLocation");
    console.log(oEvent.detail);
    ReserveIt.location = oEvent.detail.location;
}
ReserveIt.setSessionID = function(sessionID){
    console.log("valued passed to ReserveIt.setSessionID: "+sessionID);
    var cksettings = document.getCookie('settings');
    var settings = {};
    if (cksettings) settings = JSON.parse(cksettings);
    settings.session = {};
    settings.session.id = sessionID;
    console.log(settings);
    document.setCookie('settings',JSON.stringify(settings),0);
    // raise event
    var event = new CustomEvent("gotSessionID", {"detail":{"sessionID":sessionID}});
    document.dispatchEvent(event);
};
ReserveIt.setSessionLocation = function(location){
    var cksettings = document.getCookie('settings');
    var settings = {};
    if (cksettings) settings = JSON.parse(cksettings);
    if (!settings.session) settings.session = {};
    settings.session.location = location;
    console.log(settings);
    document.setCookie('settings',JSON.stringify(settings),0);
    var event = new CustomEvent("gotLocation",{"detail":{"location":location}});
    document.dispatchEvent(event);
};
ReserveIt.getLocation = function(callback){
    if (!callback) callback = "ReserveIt.setSessionLocation";
    var cksettings = document.getCookie('settings');
    var settings = {};
    if (cksettings) settings = JSON.parse(cksettings);
    if (settings.session && settings.session.location) return settings.session.location;
    else {
        document.getJSONP(ReserveIt.locationServiceURL,null,callback);
		return null;
    }
};
ReserveIt.getSessionID = function(callback){
    if (!callback) callback = "ReserveIt.setSessionID";
    console.log("ReserveIt.getSessionID called (calling back to: "+callback +")");
    var cksettings = document.getCookie('settings');
    var settings = {};
    if (cksettings) settings = JSON.parse(cksettings);
    if (settings.session){
        console.log("Reserve.getSessionID found existing session: ");
        console.log(settings.session);
        return settings.session.id;
    }
    else {
        document.getJSONP("/session.php",null,callback);
    }
};
ReserveIt.onsubmitCreateDraft = function(){
    this.parentElement.className = "processing";
    var session = {};
    session.preflang = document.getPrefLang();
    session.id = ReserveIt.getSessionID();
    session.note = this.notes.value;
    session.clientInfo = {};
    session.clientInfo.name = this.clientName.value;
    session.clientInfo.email = this.email.value;
    session.locationInfo = {};
	/* 
    session.locationInfo.ip = ReserveIt.getLocation().ip;
    session.locationInfo.country = ReserveIt.getLocation().country_name;
	*/
	if (ReserveIt.location) {
		session.locationInfo.ip = ReserveIt.location.ip;
		session.locationInfo.country = ReserveIt.getLocation().country_name;
	}
	else {
		session.locationInfo.ip = "-";
		session.locationInfo.country = "-";
	}
    session.paypal = {};
    session.paypal.items = [];
    session.paypal.items[0] =  {};
    session.paypal.items[0].name = this.code.value;
    session.paypal.items[0].quantity = this.minQty.value;

	var checkdt = this.date.value;
	if (checkdt.indexOf("/") > 0 ) {
		var dtc = checkdt.split("/");
		checkdt = dtc[2] + "-" + dtc[0] + "-" + dtc[1];
	}

    session.paypal.items[0].date = checkdt + " PET";
    console.log ("date submitted to paypal: " + session.paypal.items[0].date);
    session.paypal.items[0].description = "Price: "+ this.price.value + "USD - Reservation Deposit 20%";
    session.paypal.items[0].unit_price = {};
    session.paypal.items[0].unit_price.currency = "USD";
    session.paypal.items[0].unit_price.value = (parseFloat(this.price.value) * 0.2).toFixed(2);
    var fd = new FormData();
    fd.append("session", JSON.stringify(session));
    fd.append("mode","new");
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", ReserveIt.transferComplete, false);
    oReq.addEventListener("error", ReserveIt.transferFailed, false);
    oReq.addEventListener("abort", ReserveIt.transferCanceled, false);
    oReq.open("post", "/reservit.php", true);
    oReq.send(fd);
    return false;
};
ReserveIt.buildCreateDraftForm = function(form){
    form.onsubmit = ReserveIt.onsubmitCreateDraft;
    var closeButton = form.getElementsByTagName('button')[0];
    closeButton.onclick = function(){
        console.log('create draft reservation form closed');
        this.parentElement.parentElement.className = "";
        return false;
    }
};
ReserveIt.showItemSummary = function(){

};
ReserveIt.buildCartButton = function(initialState){
    ReserveIt.loadExternal("stylesheet",ReserveIt.cartStyleURL);
    var states = ["hidden","empty","full","submitted"];
    var cart = document.createElement("div");
    cart.id = "cartButton";
    if (!initialState) initialState = "hidden";
    /* TODO: logic to determine if the cart is full (cookie) or empty */

    cart.className = initialState;
    cart.onclick = function(e){
        /* TODO: check to see if an existing session is started (not just a sessionID) */
        if (ReserveIt.session) ReserveIt.modal.showCart(ReserveIt.session);
        else ReserveIt.modal.showCart();
    };
    document.body.appendChild(cart);
}
ReserveIt.buildOfferElement = function(oe){
    oe.getCode = function() { return this.getAttribute('data-code'); };
    oe.getTitle = function() { return this.getAttribute('data-title'); };
    oe.getSummary = function() { return this.getAttribute('data-summary'); };
    oe.getPrice = function() { return this.getAttribute('data-price'); };
    oe.getMinQty = function() { return this.getAttribute('data-min-qty'); };
    oe.getUnit = function() { return this.getAttribute('data-unit'); };
    oe.getDeposit = function() { return this.getAttribute('data-deposit'); };
    var button = oe.getElementsByTagName('button')[0];
    var reBtnClickListener = button.addEventListener('click',function(){
        ReserveIt.modal.show(this.parentElement);
    },false);
};
ReserveIt.gotJSONSession = function(oEvent) {
    //ReserveIt.modal.element.className = "processed";
    console.log("gotJSONSession event fired:");
    console.log(oEvent.detail);
    ReserveIt.session = oEvent.detail;
    ReserveIt.modal.showCart(oEvent.detail);
}
ReserveIt.draftFinalized = function (oEvent){
    console.log("draftFinalized event fired:");
    console.log(oEvent.detail);
    ReserveIt.modal.element.className = "draftFinalized";

}
ReserveIt.draftCanceled = function (oEvent){
    console.log("draftCanceled event fired:");
    console.log(oEvent.detail);
    ReserveIt.modal.element.className = "draftCancelled";

}
ReserveIt.finalizeComplete = function (oEvent) {
    if (oEvent.currentTarget.status == "200") { //  oEvent.srcElement.status == "200"
        console.log("getJSONSessionComplete received: " + oEvent.currentTarget.status);
        console.log(oEvent);
        var json_response = JSON.parse(oEvent.currentTarget.responseText);
        console.log(json_response);
        var event = new CustomEvent("draftFinalized",{"detail":json_response});
        document.dispatchEvent(event);
    }
    else ReserveIt.finalizeFailed(oEvent);
};
ReserveIt.finalizeFailed = function(oEvent) {
    console.log("error during finalizing of request:");
    console.log(oEvent);
    ReserveIt.modal.element.className = "finalizeError";
};
ReserveIt.sendPaypalInvoiceComplete = function (oEvent) {
    if (oEvent.currentTarget.status == "200" || oEvent.currentTarget.status =="200") { //  oEvent.srcElement.status == "200"
        console.log("sendPaypalInvoiceComplete received: " + oEvent.currentTarget.status);
        console.log(oEvent);
        ReserveIt.modal.element.className = "sendPaypalInvoiceError";
    }
    else ReserveIt.finalizeFailed(oEvent);
};
ReserveIt.sendPaypalInvoiceFailed = function(oEvent) {
    console.log("error during finalizing of request:");
    console.log(oEvent);
    ReserveIt.modal.element.className = "sendPaypalInvoiceError";
};

ReserveIt.cancelComplete = function (oEvent) {
    if (oEvent.currentTarget.status == "200") { //  oEvent.srcElement.status == "200"
        console.log("getJSONSessionComplete received: " + oEvent.currentTarget.status);
        console.log(oEvent);
        var json_response = JSON.parse(oEvent.currentTarget.responseText);
        console.log(json_response);
        var event = new CustomEvent("draftCanceled",{"detail":json_response});
        document.dispatchEvent(event);
    }
    else ReserveIt.cancelFailed(oEvent);
};
ReserveIt.cancelFailed = function(oEvent) {
    console.log("error during canceling of request:");
    console.log(oEvent);
    ReserveIt.modal.element.className = "cancelError";
};
ReserveIt.getJSONSessionComplete = function (oEvent) {
    if (oEvent.currentTarget.status == "200") { //  oEvent.srcElement.status == "200"
        console.log("getJSONSessionComplete received: " + oEvent.currentTarget.status);
        console.log(oEvent);
        var json_response = JSON.parse(oEvent.currentTarget.responseText);
        console.log(json_response);
        var event = new CustomEvent("gotJSONSession",{"detail":json_response});
        document.dispatchEvent(event);
    }
    else ReserveIt.transferFailed(oEvent);
}
ReserveIt.getJSONSessionFailed = function (oEvent){
    console.log("getJSONSessionFailed: " + oEvent.currentTarget.status);
    ReserveIt.modal.element.className = "error";
};
ReserveIt.getJSONSession = function(user,sessionid,callback){
    if (user) {
        var formData = new FormData();
        formData.append("mode","view");
        formData.append("user",user);
        formData.append("sessionID",sessionid)
        var oReq = new XMLHttpRequest();
        oReq.addEventListener("load", ReserveIt.getJSONSessionComplete, false);
        oReq.addEventListener("error", ReserveIt.getJSONSessionFailed, false);
        //oReq.addEventListener("abort", ReserveIt.transferCanceled, false);
        oReq.open("post", "/reservit.php", true);
        oReq.send(formData);
        this.modal.element.className = "gettingReservation";
    }
    else {
        /* TODO: try to get session from cookie then dispatch gotJSONSession event */
    }
};
ReserveIt.parseHash = function(){
    //#RESERVATIONuser=email@reinpetersen~id=ABA044
    var hash = window.location.hash;
    if (hash) {
        if (hash.indexOf("#RESERVATION") > -1) {
            hash = hash.replace("#RESERVATION","");
            var wellformed = false;
            var hashdict = {};
            var hasharr = hash.split("~");
            for (var i=0; i < hasharr.length; i++) {
                hashdict[hasharr[i].split("=")[0]] = hasharr[i].split("=")[1];
            }
            if (hashdict["user"] && hashdict["id"] ) {
                var rx = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
                if (rx.test(hashdict["user"])) {
                    wellformed = true;
                    // retrieve json session
                    console.log("Page entered by reservation identifier user:"+ hashdict["user"] +" invoice:"+hashdict["id"]);
                    ReserveIt.getJSONSession(hashdict["user"],hashdict["id"]);
                }
            }
        }
        // continue finding other handlers using if
    }
};
ReserveIt.sessionReturned = function(session, boolShowCart){
    /* TODO: handle the return of a session (after creating, updating, or fetching )
       note: after creation or update, the cart button should react only
             after updating or fetching the cart summary should show
        */

}
ReserveIt.init = function(offerElementClass, reserveModalID){
    document.addEventListener("gotSessionID",ReserveIt.gotSessionID,false);
    document.addEventListener("gotLocation",ReserveIt.gotLocation,false);
    document.addEventListener("gotJSONSession",ReserveIt.gotJSONSession,false);
    document.addEventListener("draftFinalized",ReserveIt.draftFinalized,false);
    document.addEventListener("draftCanceled",ReserveIt.draftCanceled,false);
    if (!ReserveIt.InputTypeSupported("date")) ReserveIt.polyfillInputDate();
    var rms = document.getElementById(reserveModalID);
    if (rms) {
        rms.onclick = function(){};
        this.modal.element = rms;
        var forms = this.modal.element.getElementsByTagName('form');  // there could be many forms... use ID...
        var form = null;
        if (forms) form = forms[0];
        if (form) ReserveIt.buildCreateDraftForm(form);
        var oes = document.getElementsByClassName(offerElementClass);
        for (var i = 0; i < oes.length; i++) ReserveIt.buildOfferElement(oes[i]);
    }
    ReserveIt.buildCartButton("full");
    ReserveIt.parseHash();
};

document.addEventListener('DOMContentLoaded',function(){ ReserveIt.init('reserveit','reservemodal') },false);
