/*
 * Author: Rein Petersen
 * Date: 07/05/14
 * Time: 12:23 PM
 */

var ReserveAdmin = {};
ReserveAdmin.control = null;
ReserveAdmin.results = null;
ReserveAdmin.viewer = null;
ReserveAdmin.session = null;
ReserveAdmin.modal = null;

ReserveAdmin.getResults = function(){
    if (this.results) return this.results;
    else {
        this.results = document.getElementsByClassName("results",true).getElementsByTagName("tbody")[0];
        return this.results;
    }
};

ReserveAdmin.getControl = function(){
    if (this.control) return this.control;
    else {
        this.control = document.getElementsByClassName("control",true);
        return this.control;
    }
};

ReserveAdmin.getViewer = function(){
    if (this.viewer) return this.viewer;
    else {
        this.viewer = document.getElementsByClassName("viewer",true);
        this.viewer.buttons = this.viewer.getElementsByClassName("buttons",true)[0];
        this.viewer.header = this.viewer.getElementsByClassName("header")[0];
        this.viewer.tbodyVIEW = this.viewer.getElementsByTagName("tbody")[0];
        this.viewer.tbodyNEW = this.viewer.getElementsByTagName("tbody")[1];
        return this.viewer;
    }
};

ReserveAdmin.displaySession = function (dataStr){
    var data = JSON.parse(dataStr);
    console.log("displaySession:");
    console.log(data);
    
};

ReserveAdmin.buildField = function (id,label,type,value,disabled){
    if (!type) type = "text";
    var fld = document.createElement("div"); fld.className = "field";
    var lbl = document.createElement("label");
    if (label) lbl.innerHTML = label + ":";
    else lbl.innerHTML = document.capitalizeFirstLetter(id) + ":";
    fld.appendChild(lbl);
    var inp = null;
    switch (type){
        case "date": 
        case "hidden":
        case "email": 
        case "text": inp = document.createElement("input"); inp.type = type; inp.value = value; break;
        case "textarea": inp = document.createElement("textarea"); inp.innerHTML = value; break;
        case "select": inp = document.createElement("select"); break;
 
    }
    inp.id = id; inp.name = id; if (disabled) inp.disabled = true; fld.input = fld.appendChild(inp);
    return fld;
};

ReserveAdmin.buildOption = function (val,txt,selected) {
    var op = document.createElement("option");
    if (selected) op.selected = true;
    op.value=val; op.innerHTML = txt;
    return op;
};

ReserveAdmin.viewUpdated = function(details){
    console.log("view was updated: ");
    console.log(details);

};

ReserveAdmin.buildViewHeader = function(session){
    console.log("buildViewHeader");
    console.log(session);
    this.viewer.header.innerHTML = "";

    var form = document.createElement("form");
    form.id="update-reservation";
    this.viewer.header.form = this.viewer.header.appendChild(form);

    var sessionID = this.buildField("sessionID","Number",null,session.invoice,true);
    sessionID.form = form.id;
    this.viewer.header.appendChild(sessionID);
    
    var date = this.buildField("date",null,null,session.created,true);
    date.form = form.id;
    this.viewer.header.appendChild(date);
    
    var status = this.buildField("status",null,"select"); status.form = form.id;
    status.input.onchange = function(){
        ReserveAdmin.session["newstatus"] = this.options[this.selectedIndex].value;
        /* TODO: raise custom event */
        var event = new CustomEvent("viewUpdated",{"detail":{"status-updated":this.options[this.selectedIndex].value}});
        document.dispatchEvent(event);
        console.log("status changed: " + ReserveAdmin.session.newstatus);
    }
    switch (session.status){
        case "DRAFT":
            var opDraft = ReserveAdmin.buildOption("DRAFT","New Request",true); status.input.appendChild(opDraft);
            var opConfirm = ReserveAdmin.buildOption("CONFIRM","Confirmed"); status.input.appendChild(opConfirm);
            var opCancel = ReserveAdmin.buildOption("CANCEL","Canceled"); status.input.appendChild(opCancel);
            break;
        case "DRAFTFIN":
            var opDraftFin = ReserveAdmin.buildOption("DRAFTFIN","Finalized Request",true); status.input.appendChild(opDraftFin);
            var opConfirm = ReserveAdmin.buildOption("CONFIRM","Confirmed"); status.input.appendChild(opConfirm);
            var opCancel = ReserveAdmin.buildOption("CANCEL","Canceled"); status.input.appendChild(opCancel);
            break;
        case "CONFIRM":
            var opConfirm = ReserveAdmin.buildOption("CONFIRM","Confirmed",true); status.input.appendChild(opConfirm);
            var opPaid = ReserveAdmin.buildOption("PAID","Deposit Paid"); status.input.appendChild(opPaid);
            var opCancel = ReserveAdmin.buildOption("CANCEL","Canceled"); status.input.appendChild(opCancel);
            break;
        case "PAID":
            var opPaid = ReserveAdmin.buildOption("PAID","Deposit Paid",true); status.input.appendChild(opPaid);
            var opPaid = ReserveAdmin.buildOption("PAID","Deposit Paid",true); status.input.appendChild(opPaid);
            var opCancel = ReserveAdmin.buildOption("CANCEL","Canceled"); status.input.appendChild(opCancel);
            var opRefund = ReserveAdmin.buildOption("REFUND","Refunded payment"); status.input.appendChild(opRefund);
            break;
        case "REFUND":
            var opRefund = ReserveAdmin.buildOption("REFUND","Refunded payment",true); status.input.appendChild(opRefund);
            break;
        case "CANCEL":
            var opCancel = ReserveAdmin.buildOption("CANCEL","Canceled",true); status.input.appendChild(opCancel);
            break;
    }
    this.viewer.header.appendChild(status);
    
    var name = this.buildField("name",null,null,session.name,true);
    name.form = form.id;
    this.viewer.header.appendChild(name);
    
    var clientEmail = this.buildField("clientEmail","Email","email",session.email,true);
    clientEmail.form = form.id;
    this.viewer.header.appendChild(clientEmail);
        
};

ReserveAdmin.buildBodyView = function(data){
    this.viewer.tbodyVIEW.innerHTML = "";

    for (var i=0; i<data.paypal.items.length; i++){
        var tr = document.createElement("tr");
        var qty = document.createElement("td"); qty.innerHTML = data.paypal.items[i].quantity; tr.appendChild(qty);
        var code = document.createElement("td"); code.innerHTML = data.paypal.items[i].name; tr.appendChild(code);
        var date = document.createElement("td"); date.innerHTML = data.paypal.items[i].date; tr.appendChild(date);
        var desc = document.createElement("td"); desc.innerHTML = data.paypal.items[i].description; tr.appendChild(desc);
        var deposit = document.createElement("td"); deposit.innerHTML = data.paypal.items[i].unit_price.value; tr.appendChild(deposit);
        var amount = document.createElement("td"); amount.innerHTML = parseFloat(data.paypal.items[i].unit_price.value) * parseFloat(data.paypal.items[i].quantity);
        tr.appendChild(amount);
        var tools = document.createElement("td");
        var deleteItem = document.createElement("button"); deleteItem.innerHTML = "delete";
        deleteItem.item = i;
        deleteItem.tr = tr;
        deleteItem.onclick = function(){
            console.log("delete item clicked: ");
            ReserveAdmin.session.paypal.items[this.item].deleted = true;
            ReserveAdmin.session.itemschanged = true;
            this.tr.style.display = "none";
            /* TODO: raise custom event */
            var event = new CustomEvent("viewUpdated",{"detail":{"item-deleted":this.item}});
            document.dispatchEvent(event);
            console.log(this);
        };
        tools.appendChild(deleteItem); tr.appendChild(tools);
        this.viewer.tbodyVIEW.appendChild(tr);
    }        

}

ReserveAdmin.updateSessionComplete = function(oEvent){
    if (oEvent.currentTarget.status == "200") {
        console.log("invoices search completed:");
        if (oEvent.currentTarget.responseText){
            ReserveAdmin.displayView(oEvent.currentTarget.responseText);
            ReserveAdmin.modal.className = "";
        }
        else {
            console.log ("results from session update were null but reported 200 OK")
            ReserveAdmin.updateSessionError(oEvent);
        }
    }
    else ReserveAdmin.updateSessionError(oEvent);

};

ReserveAdmin.updateSessionError = function(oEvent){
    console.log("There was an update error: ");
    console.log(oEvent);
    ReserveAdmin.modal.className = "error";
};

ReserveAdmin.buildSaveChangesBtn = function(){
    var savechangesbtn = document.createElement("button");
    savechangesbtn.innerHTML = "SAVE CHANGES";
    savechangesbtn.disabled = true;
    savechangesbtn.onclick = function(e){
        console.log("save changes clicked");
        var sessionUpdated = {};
        for (p in ReserveAdmin.session) {
            switch (p){
                case "paypal":
                    sessionUpdated.paypal = ReserveAdmin.session.paypal;
                    var newitems = ReserveAdmin.session.paypal.items.slice(0);
                    sessionUpdated.paypal.items = [];
                    for (var i=0; i<newitems.length; i++){
                        if (newitems[i].deleted) continue;
                        else if (newitems[i].added) delete newitems[i]["added"];
                        sessionUpdated.paypal.items.push(newitems[i]);
                    }
                    break;
/*
                case "status":
                    if (ReserveAdmin.session["newstatus"])
                        sessionUpdated[p] = ReserveAdmin.session["newstatus"];
                    break;
                case "newstatus": break;
 */
                default: sessionUpdated[p] = ReserveAdmin.session[p];
            }
        }
        fdata = new FormData();
        fdata.append("mode","update");
        fdata.append("session",JSON.stringify(sessionUpdated));
        var oReq = new XMLHttpRequest();
        oReq.addEventListener("load", ReserveAdmin.updateSessionComplete,false);
        oReq.addEventListener("error", ReserveAdmin.updateSessionError,false);
        oReq.open("post","invoices/",true);
        oReq.send(fdata);
        ReserveAdmin.modal.className="processing";
        return false;
    };
    return savechangesbtn;
};

ReserveAdmin.displayViewButtons = function(mode) {
    switch(mode){
        case "udpate": break;
        case "new": break;
    }
}

ReserveAdmin.handleViewUpdate = function(details){
    ReserveAdmin.viewer.buttons.savechanges.disabled = false;
};

ReserveAdmin.buildViewButtons = function(){

    if (this.viewer.buttons.savechanges) this.viewer.buttons.savechanges.disabled = true;
    else {
        var savechangesbtn = this.buildSaveChangesBtn();
        this.viewer.buttons.savechanges = this.viewer.buttons.appendChild(savechangesbtn);
        document.addEventListener("viewUpdated",ReserveAdmin.handleViewUpdate,false);
    }

};

ReserveAdmin.displayView = function (dataStr){
    var data = JSON.parse(dataStr);
    console.log(data);
    this.session = data;

    this.buildViewHeader(data);
    this.buildBodyView(data);
    this.buildViewButtons();
    //var buttons = this.viewer.buttons;

    document.addEventListener("viewUpdated",ReserveAdmin.handleViewUpdate,false);

    /* TODO: mode is update, add [SAVE CHANGES], [CANCEL CHANGES] buttons */




};


ReserveAdmin.displayResults = function (dataStr){
    var data = JSON.parse(dataStr);
    while (this.results.firstChild) {
        this.results.removeChild(this.results.firstChild);
    }
    console.log(data);
    for (var i =0; i < data.length; i++) {
        var tr = document.createElement("tr");
        var invoice = document.createElement("td"); invoice.innerHTML = data[i]["invoice"];
        var status = document.createElement("td"); status.innerHTML = data[i]["status"];
        var email = document.createElement("td"); email.innerHTML = data[i]["email"];
        var name = document.createElement("td"); name.innerHTML = data[i]["name"];
        var country = document.createElement("td"); country.innerHTML = data[i]["country"];
        //var paypal = document.createElement("td"); paypal.innerHTML = data[i]["paypal"];
        var created = document.createElement("td"); created.innerHTML = data[i]["created"];
        tr.appendChild(invoice);
        tr.appendChild(name);
        tr.appendChild(status);
        tr.appendChild(email);
        tr.appendChild(country);
        //tr.appendChild(paypal);
        tr.appendChild(created);
        tr.data = data[i];
        tr.onmouseover = function(){};
        tr.onclick = function(){
          this.data;
          fdata = new FormData();
          fdata.append("search","session");
          fdata.append("sessionID",this.data.invoice);
          fdata.append("clientEmail",this.data.email);
          var oReq = new XMLHttpRequest();
          oReq.addEventListener("load", ReserveAdmin.viewComplete,false);
          oReq.addEventListener("error", ReserveAdmin.viewError,false);
          oReq.open("post","invoices/",true);
          oReq.send(fdata);
          ReserveAdmin.modal.className="processing";
          return false;
        };
        this.results.appendChild(tr);

    }
};


ReserveAdmin.viewComplete = function(oEvent) {
    if (oEvent.currentTarget.status == "200") {
        console.log("invoices search completed:");
        ReserveAdmin.displayView(oEvent.currentTarget.responseText);
        ReserveAdmin.modal.className = "";
    }
    else ReserveAdmin.viewError(oEvent);
    
};

ReserveAdmin.viewError = function(oEvent) {
    console.log("There was a view error: ");
    console.log(oEvent);
    ReserveAdmin.modal.className = "error";
    
};

ReserveAdmin.searchComplete = function (oEvent){
    /* TODO : if http status OK, then present in list
     else redirect oEvent to invoicesSearchError
     */
    if (oEvent.currentTarget.status == "200") {
        console.log("invoices search completed:");
        ReserveAdmin.displayResults(oEvent.currentTarget.responseText);
        ReserveAdmin.modal.className = "";
    }
    else ReserveAdmin.searchFailed(oEvent);
}

ReserveAdmin.searchFailed = function (oEvent) {
    /* TODO: raise error message modal

     */
     ReserveAdmin.modal.className = "error";
    console.log("There was a search error: ");
    console.log(oEvent);
};

ReserveAdmin.wireSearchControl = function (cntrl) {
    this.control[cntrl] = this.control.querySelector("#"+cntrl);
    if (this.control[cntrl]) {
        this.control[cntrl].onsubmit = function(oEvent){
            fdata = new FormData(this);
            var oReq = new XMLHttpRequest();
            oReq.addEventListener("load", ReserveAdmin.searchComplete, false);
            oReq.addEventListener("error", ReserveAdmin.searchFailed, false);
            oReq.open("post", "invoices/", true);
            oReq.send(fdata);
            ReserveAdmin.modal.className = "processing";
            return false;
        }
    }
    else console.warn("Search control element was not found");
};

ReserveAdmin.init = function () {

    /* TODO: wireup control */
    if (!this.getControl()) throw new Error("Control element was not found.");
    if (!this.getResults()) throw new Error("Results element was not found.");
    if (!this.getViewer()) throw new Error("Viewer element was not found.");
    this.wireSearchControl("getInvoicesByFuzzyName");
    this.wireSearchControl("getInvoicesByEmail");
    this.wireSearchControl("getInvoicesByStatus");
    this.wireSearchControl("getInvoiceByID");
    
    this.modal = document.getElementById("reservemodal");

}

document.addEventListener('DOMContentLoaded',function(){ ReserveAdmin.init() },false);