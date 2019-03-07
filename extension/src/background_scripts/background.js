// Message Handler
chrome.runtime.onMessage.addListener((msg, sender, res) => {
    if (msg.action === 'p3pData') {
        res(false);
        handleP3P(msg.value);
    }
});




/*

    // Commented out for future reference (setBadgeText is useful)
	// chrome.runtime.onMessage.addListener((msg, sender, res) => {
	//     if (msg.action === 'alertNumber') {
	//         console.log(msg);
	//         chrome.browserAction.setBadgeText({
	//             text: `${msg.value}`
	//         });
	//     }
	// });

    var name_share = document.getElementById("name_share").checked;
    var email_share = document.getElementById("email_share").checked;
    var address_share = document.getElementById("address_share").checked;
    var phone_share = document.getElementById("phone_share").checked;

    // P3P: use of the collected information - how this information will be used
    // For our form, it is telemarketing
    var email_telmarketing= document.getElementById("email_telmarketing").checked;
    var address_telmarketing = document.getElementById("address_telmarketing").checked;
    var phone_telmarketing = document.getElementById("phone_telmarketing").checked;

    // P3P: permanancy and visibility - up to max time the user wants the server to store his/her information
    // P3P: type of information the server stores - which kind/particular of info is collected
    var name_stored = document.getElementById("name_stored").value;
    var email_stored = document.getElementById("email_stored").value;
    var address_stored = document.getElementById("address_stored").value;
    var phone_stored = document.getElementById("phone_stored").value;
	
*/

function handleP3P(data) {
    
    // 1. Parse P3P to JSON
    var xmlDOM = new DOMParser().parseFromString(data, 'text/xml');
    var p3p = xmlToJson(xmlDOM);

    // 2. Get values in P3P to compare to user pref
    var userData = p3p.POLICIES.POLICY.STATEMENT["DATA-GROUP"].DATA;
    
	// store the user's preferences into 3 categorical arrays
	var share_Data = []; // Y/N: user allows info being share info to company
	var telmarketing_Data = []; // Y/N: user allows info being used for telemarket purposes
    var stored_Data = []; // int: up to max time the user wants the server to store his/her information
	
	// lablel arrays
	// ex: which index is the value for the "email" in the array share_Data
	var lbl_share_Data = ["name", "email", "address", "phone"];
	var lbl_telmarketing_Data = ["email_telmarketing", "address_telmarketing", "phone_telmarketing"];
	var lbl_stored_Data = ["name_stored", "email_stored", "address_stored", "phone_stored"];

	// initialize 3 arrays
	share_Data = get_share_Data();
	telmarketing_Data = get_telmarketing_Data();
	stored_Data = get_stored_Data();
	
	console.log("share_Data len: " + share_Data.length);
	console.log("share_Data[0] et [1]: " + share_Data[0] + " " + share_Data[1]);
	console.log("telmarketing_Data len: " + telmarketing_Data.length);
	console.log("stored_Data len: " + stored_Data.length);
	
	
	// compare to see if the user's preferences matches P3P
	// compare();

	
	
    // 3. Flag
   
   //match => green icone

   //NOT match, afficher un popup pour demander a l'utilisateur si on peut prendre x donnees

   //option d'opt out => icone rouge

   //option de changer ses user's preferences

    
} //end of function P3P handle




/* 
	getters to initialize arrays, which are the user's preferences values 
	that we are going to compare with P3P
*/

//return whether user allows info to be shared 
function get_share_Data(){
	var shareData = [];
	
	chrome.storage.sync.get(['name_share'], function(result) {
		if (result.name_share == true){ shareData[0] = "true"; } 
		else { shareData[0] = "false"; }
	});
	
	chrome.storage.sync.get(['email_share'], function(result) {
		if (result.email_share == true){ shareData[1] = "true"; } 
		else { shareData[1] = "false"; }
	});
	
	chrome.storage.sync.get(['address_share'], function(result) {
		if (result.address_share == true){ shareData[2] = "true"; } 
		else { shareData[2] = "false"; }
	});
	
	chrome.storage.sync.get(['phone_share'], function(result) {
		if (result.phone_share == true){ shareData[3] = "true"; } 
		else { shareData[3] = "false"; }
	});
	return shareData;
}



//return wether user allows info to be used for telemarketing 
function get_telmarketing_Data(){
	var telmarketing_Data = [];
	  
	chrome.storage.sync.get(['email_telmarketing'], function(result) {
		if (result.email_telmarketing == true){ telmarketing_Data[0] = "true"; } 
		else { telmarketing_Data[0] = "false"; }
	});

	chrome.storage.sync.get(['address_telmarketing'], function(result) {
		if (result.address_telmarketing == true){ telmarketing_Data[1] = "true"; } 
		else { telmarketing_Data[1] = "false"; }
	});
	
	chrome.storage.sync.get(['phone_telmarketing'], function(result) {
		if (result.phone_telmarketing == true){ telmarketing_Data[0] = "true"; } 
		else { telmarketing_Data[1] = "false"; }
	});
	
	return telmarketing_Data;
}


//return max amount of time user agreed to have info stored
//if value is 0, then user does not want his/her info stored
function get_stored_Data(){
	var stored_Data = [];
	  
	chrome.storage.sync.get(['name_stored'], function(result) {
		if (result.name_stored == true){ stored_Data[0] = "true"; } 
		else { stored_Data[0] = "false"; }
	});

	chrome.storage.sync.get(['email_stored'], function(result) {
		if (result.email_stored == true){ stored_Data[0] = "true"; } 
		else { stored_Data[0] = "false"; }
	});

	chrome.storage.sync.get(['address_stored'], function(result) {
		if (result.address_stored == true){ stored_Data[0] = "true"; } 
		else { stored_Data[0] = "false"; }
	});

	chrome.storage.sync.get(['phone_stored'], function(result) {
		if (result.phone_stored == true){ stored_Data[0] = "true"; } 
		else { stored_Data[0] = "false"; }
	});
	
	chrome.storage.sync.get(['credit_card_stored'], function(result) {
		if (result.credit_card_stored == true){ stored_Data[0] = "true"; } 
		else { stored_Data[0] = "false"; }
	});

	return stored_Data;
}




// --------------------------Ajouter du code pour changer l'icône--------------------------
//Modification to icon
//Sources: https://developer.chrome.com/extensions/browserAction
//https://stackoverflow.com/questions/35852715/changing-chrome-extension-icon
function iconColorChange(){
	var status = "vert";
	chrome.browserAction.setBadgeText( { text: status } );
	chrome.browserAction.setBadgeBackgroundColor({color: [0,255,0,255]});
}


//remet l'icône comme avant
function iconColorDeChange(){
	var status = "";
	chrome.browserAction.setBadgeText( { text: status } );
	chrome.browserAction.setBadgeBackgroundColor({color: [0,0,0]});
}


//NE fonctionne pas - code pour un pop up
//à moins que popup n'est pas un string mais un fichier html comme dans les exemples?
function iconPopUp(){
	var msg = "not work";	
	chrome.browserAction.setBadgeText( { text: msg } );
	chrome.browserAction.setBadgeBackgroundColor({color: "red"});

	chrome.browserAction.setPopup({popup: "afficher msg"}); //fonctionne pas
}



/* ------------------------------------------------------------------------------------------

The xmlToJson function has been downloaded from this github:
 https://gist.github.com/chinchang/8106a82c56ad007e27b1

*/

// Changes XML to JSON
// Modified version from here: http://davidwalsh.name/convert-xml-json
function xmlToJson(xml) {

	// Create the return object
	var obj = {};

	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	// If just one text node inside
	if (xml.hasChildNodes() && xml.childNodes.length === 1 && xml.childNodes[0].nodeType === 3) {
		obj = xml.childNodes[0].nodeValue;
	}
	else if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
}
