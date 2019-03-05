// Message Handler
chrome.runtime.onMessage.addListener((msg, sender, res) => {
    if (msg.action === 'p3pData') {
        res(false);
        handleP3P(msg.value);
    }
});


function handleP3P(data) {
    
    // 1. Parse to JSON
    var xmlDOM = new DOMParser().parseFromString(data, 'text/xml');
    var p3p = xmlToJson(xmlDOM);

    // 2. Get values in P3P to compare to user pref
    //console.log(p3p);
    var userData = p3p.POLICIES.POLICY.STATEMENT["DATA-GROUP"].DATA;
    var collectedData = []
    var userPreferences = []
    var test = "empty string"

    for (var i = 0; i < userData.length; i++) {
       collectedData[i] = userData[i]["@attributes"].ref;
      console.log(userData[i]["@attributes"].ref); 
    }
    
		
	//remplacer par ce que l'utilisateur a choisi
	//utilise localStorage pour stocker les donnees
	chrome.storage.local.get(['name'], function(result) {
        if (result.name == true){
        	localStorage.setItem("nameVal", "true");
        	//localStorage.test = "testvalue";
        
        } else {
        	localStorage.setItem("nameVal", "false");
        	//localStorage.test = "testvalueFALSE"
        }
	});

		chrome.storage.local.get(['email'], function(result) {
	        if (result.email == true){
	        	localStorage.setItem("emailVal", "true");
	        } else {
	        	localStorage.setItem("emailVal", "false");
	        }
    	});

    	chrome.storage.local.get(['addr'], function(result) {
	        if (result.addr == true){
	        	localStorage.setItem("addressVal", "true");
	        } else {
	        	localStorage.setItem("addressVal", "false");
	        }
    	});
		
    	chrome.storage.local.get(['phone'], function(result) {
	        if (result.phone == true){
	        	localStorage.setItem("phoneVal", "true");
	        } else {
	        	localStorage.setItem("phoneVal", "false");
	        }
    	});	
		


    //variable that we are going to use to compare
    //user preferences and P3P policies
    var name = localStorage.getItem("nameVal");
    console.log("name: " + name);
    
    var email = localStorage.getItem("emailVal");
    console.log("email: " + email);

    var address = localStorage.getItem("addressVal");
    console.log("address: " + address);

    var phone = localStorage.getItem("phoneVal");
    console.log("phone: " + phone);


    //no need in local storage because we have the data in the variables
    localStorage.removeItem("nameVal");
    localStorage.removeItem("emailVal");
    localStorage.removeItem("addressVal");
    localStorage.removeItem("phoneVal");



    // 3. Flag
   
    
} //end of function P3P handle



//Does not work as we cannot retrieve data with getters functions
//sauvegarder les données dans local storage
 function saveData() {
	if (typeof(Storage) !== "undefined") {
		
		//enlever ce qu'il y avait avant
		localStorage.removeItem("nameVal");
		localStorage.removeItem("emailVal");
		localStorage.removeItem("addressVal");
		localStorage.removeItem("phoneVal");
		
		
		//remplacer par ce que l'utilisateur a choisi
		//utilise localStorage pour stocker les donnees
		chrome.storage.local.get(['name'], function(result) {
	        if (result.name == "true"){
	        	console.log("TRUE statement");
	        	localStorage.setItem("nameVal", "mettre valeur ici");
	        	console.log("TRUE statement");
	        } else {
	        	localStorage.setItem("nameVal", "false");
	        }
    	});

		chrome.storage.local.get(['email'], function(result) {
	        if (result.email != "undefined"){
	        	localStorage.setItem("emailVal", result.email);
	        } else {
	        	localStorage.setItem("emailVal", "false");
	        }
    	});

    	chrome.storage.local.get(['address'], function(result) {
	        if (result.address != "undefined"){
	        	localStorage.setItem("addressVal", result.address);
	        } else {
	        	localStorage.setItem("addressVal", "false");
	        }
    	});
		
    	chrome.storage.local.get(['phone'], function(result) {
	        if (result.phone != "undefined"){
	        	localStorage.setItem("phoneVal", result.phone);
	        } else {
	        	localStorage.setItem("phoneVal", "false");
	        }
    	});	
		

	  } else {
	    document.getElementById("result").innerHTML = "Sorry, your browser does not support web storage...";
	  }
	} //fin de la fonction saveData



    //return if user wants to share their name
	function getName(){
		return localStorage.getItem("nameVal");
	}

    //return if user wants to share their name
	function getEmail(){
		return localStorage.getItem("emailVal");
	}

    //return if user wants to share their name
	function getAddress(){
		return localStorage.getItem("addressVal");
	}

    //return if user wants to share their name
	function getPhone(){
		return localStorage.getItem("phoneVal");
	}


// Commented out for future reference (setBadgeText is useful)
// chrome.runtime.onMessage.addListener((msg, sender, res) => {
//     if (msg.action === 'alertNumber') {
//         console.log(msg);
//         chrome.browserAction.setBadgeText({
//             text: `${msg.value}`
//         });
//     }
// });



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
