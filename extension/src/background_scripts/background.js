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

	
*/

function handleP3P(data) {
    
    // Parse P3P to JSON
    var xmlDOM = new DOMParser().parseFromString(data, 'text/xml');
    var p3p = xmlToJson(xmlDOM);
    	
	// lablel arrays of the JSON objects
	var lbl_JSON_Objects = ["share", "telmarketing", "stored"];

	//labels within the main JSON objects
	var lbl_share_Data = ["name_share", "email_share", "address_share", "phone_share"];
	var lbl_telmarketing_Data = ["email_telmarketing", "address_telmarketing", "phone_telmarketing"];
	var lbl_stored_Data = ["name_stored", "email_stored", "address_stored", "phone_stored", "credit_card_stored"];


	//get the JSON objets and call the compare function
	get_JSON_Object(lbl_JSON_Objects)
	.then((data) => {
		compare(data, p3p);
	})
	.catch((err) => {
		console.log(err);
	});

	
    // 3. Flag

    
} //end of function P3P handle


//return all the JSON objects stored in chrome storage: share, telmarketing, stored
function get_JSON_Object(lbl){

	return new Promise((resolve, reject) => {
		chrome.storage.local.get(lbl, (data) => {
			resolve(data);
		});
	});
}


// compare function compares P3P and user's preferences
// display green or red icone with the number of conficts
function compare(data, xmlJSON) {
	
	var conflict = []; //store all the user's preference that did not match P3P in array

	// compare the shared info


	// compare the telemarketing info


	// compare the time of the stored info 


	// if all user's preferences matched with P3P, display green incone


	// if conflict with user's preferences matched with P3P, 
	// display red icone, number of conflicts, and pop-up
	// in the pop-up, it is the info in the array conflict
	if (conflict.length == 0){
		// green icone
		var conflict_num = "0";
		chrome.browserAction.setBadgeText( { text: conflict_num } );
		chrome.browserAction.setBadgeBackgroundColor({color: [0,255,0,255]});

	} else {
		// display red icone and the number of conflicts
		var conflict_num = conflict.length;	
		chrome.browserAction.setBadgeText( { text: conflict_num } );
		chrome.browserAction.setBadgeBackgroundColor({color: "red"});

		// pop-up

		// ask if the user would like to proceed
	}

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
