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
	var lbl_JSON_Objects = ["share", "telemarketing", "stored"];

	//labels within the main JSON objects
	var lbl_share_Data = ["name_share", "email_share", "address_share", "phone_share"];
	var lbl_stored_Data = ["name_stored", "email_stored", "address_stored", "phone_stored", "credit_card_stored"];


	//get the JSON objets and call the compare function
	get_JSON_Object(lbl_JSON_Objects, p3p)
	.then((data) => {
		//call function compare where it will check the P3P and the user's preference
		//based on if there is a conflict, the icone will be green or red
		compare(data, p3p);
	})
	.catch((err) => {
		console.log(err);
	});
	
 
} //end of function P3P handle



//return all the JSON objects stored in chrome storage: share, telmarketing, stored
function get_JSON_Object(lbl, p3p){

	return new Promise((resolve, reject) => {
		chrome.storage.local.get(lbl, (data) => {
			resolve(data);
		});
	});
}



// compare function compares P3P and user's preferences
// display green or red icone with the number of conficts
function compare(data, p3p) {
	console.log(p3p);
	var conflict = []; //store all the user's preference that did not match P3P in array

	// 1. compare the shared info
	var website_share_data = p3p.POLICIES.POLICY.STATEMENT["DATA-GROUP"].DATA; // JSON PURPOSE object
	var user_name_option = data.share.name_share; // if user allowed name to be shared
	var user_email_option = data.share.email_share; // if user allowed email to be shared
	var user_address_option = data.share.address_share; // if user allowed address to be shared
	var user_phone_option = data.share.phone_share; // if user allowed phone to be shared
	var attribute_name = ""; // attribute name within the array
	var stored_value = [];

	// loop through all the shared data attributes
	for (var i = 0; i < website_share_data.length; i++) {
   		attribute_name = website_share_data[i]["@attributes"].name;
     	
   		// if the website requires the name, but the user does not want to share their name
     	if(attribute_name == "user.name." && user_name_option == false){
     		conflict[conflict.length] = "this website must have the authorization to your name"; 
     		stored_value[stored_value.length] = "name";
     	}

     	// if the website requires the email, but the user does not want to share their email
     	else if(attribute_name == "user.online.email" && user_email_option == false){
     		conflict[conflict.length] = "this website must have the authorization to your email"; 
     		stored_value[stored_value.length] = "email";
     	}

     	// if the website requires the address, but the user does not want to share their address
     	else if(attribute_name == "user.online.address" && user_address_option == false){
     		conflict[conflict.length] = "this website must have the authorization to your address"; 
     		stored_value[stored_value.length] = "address";
     	}

     	// if the website requires the phone, but the user does not want to share their phone
     	else if(attribute_name == "user.phonenum.number" && user_phone_option == false){
     		conflict[conflict.length] = "this website must have the authorization to your phone number"; 
     		stored_value[stored_value.length] = "phone";
     	}


    }



	// 2. compare the telemarketing info
	var website_telemarketing = p3p.POLICIES.POLICY.STATEMENT.PURPOSE; // JSON PURPOSE object
	var user_telemarketing_option = data.telemarketing; // user's telemarketing preferences

	//if the P3P contains <contact> under PURPOSE in their P3P, then they may want to telemarket the user
	//if the user has not checked the telemarketing option, then add this to the conflict array
	if (("contact" in website_telemarketing || "telemarketing" in website_telemarketing) && user_telemarketing_option == false){
		conflict[conflict.length] = "this website must have the authorization to telemarket";
	}


	
	// 3. compare the time of the stored info
	var website_store_data = p3p.POLICIES.POLICY.STATEMENT.RETENTION // JSON PURPOSE object
	
	// website stores info for an underminate period of time
	if ("indefinitly" in website_store_data){
		conflict[conflict.length] = "this website must have the authorization to store your information for an underminate period of time";
	}
	
	console.log(data.stored.name_stored);

	// website stores info for a maximum time of 6 months
	if ("stated-purpose" in website_store_data){
		
		// go through DATA-GROUP attributes		
		for (var i = 0; i < stored_value.length; i++) {
			if (stored_value[i] == "name"){
				conflict[conflict.length] = "this website must have the authorization to store your name for a maximum time of 6 months";
			}

			if (stored_value[i] == "email"){
				conflict[conflict.length] = "this website must have the authorization to store your email for a maximum time of 6 months";
			}
			
			if (stored_value[i] == "address"){
				conflict[conflict.length] = "this website must have the authorization to store your address for a maximum time of 6 months";
			}		
			
			if (stored_value[i] == "phone"){
				conflict[conflict.length] = "this website must have the authorization to store your phone for a maximum time of 6 months";
			}		
		}

	}
	


	// 4. display green or red icone with the number of conflict
	// if all user's preferences matched with P3P, display green incone
	if (conflict.length == 0){
		// display green icone
		var conflict_num = "0";
		chrome.browserAction.setBadgeText( { text: conflict_num } );
		chrome.browserAction.setBadgeBackgroundColor({color: [0,255,0,255]});

	// else, there is at least one conflict with user's preferences matched with P3P 
	} else {
		// display red icone and the number of conflicts on the badge
		var conflict_num = conflict.length;	
		chrome.browserAction.setBadgeText( { text: conflict_num.toString() } );
		chrome.browserAction.setBadgeBackgroundColor({color: "red"});

		// pop-up, with the information in the coonflict array
		print(conflict);

		// ask if the user would like to proceed
	}

} // end of the compare function


function print(arr){
	for (var i = 0; i < arr.length; i++) {
		console.log(arr[i]);
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
