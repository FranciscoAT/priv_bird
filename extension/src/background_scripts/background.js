// Global Variables
let conflicts = {
	"warnings": [],
	"errors": []
};

// Message Handler
chrome.runtime.onMessage.addListener((msg, sender, res) => {
	if (msg.action === 'p3pData') {
		res(false);
		handleP3P(msg.value);
	} else if (msg.action === 'getConflicts') {
		res(conflicts);
	}
});

// Function to handle incoming p3p data
function handleP3P(data) {

	// Parse P3P to JSON
	var xmlDOM = new DOMParser().parseFromString(data, 'text/xml');
	var p3p = xmlToJson(xmlDOM);

	getLocalChromeValues(fullNamesArr)
		.then((values) => {
			compare(values, p3p);
		})
		.catch((err) => {
			console.log('Using defaults', err);
			compare(defaultValues, p3p);
		});
}


function getLocalChromeValues(valuesToGetArr) {
	return new Promise((res, rej) => {
		chrome.storage.local.get(valuesToGetArr, (values) => {
			if (valuesToGetArr == {}) {
				rej('No values stored');
			} else {
				res(values);
			}
		});
	});
}

function compare(values, p3p) {
	// Reset the current conflicts
	conflicts = {
		"warnings": [],
		"errors": []
	};

	console.log(values);

	/**
	 * There are three values being passed in:
	 * share-data-general, retention-general, retention-critical
	 * Values for each:
	 * share-data-general: true/false (true being never alert, false being alert red if data is being shared)
	 * retention-*:
	 *     no-retention (alert red if data being retained for any length of time)
	 * 	   legal-retention (alert red if data being retained for longer than legally required)
	 *     any-retention (never alert essentially)
	 * Simply add to the conflicts variable in the compare function, the popup will grab this so do not worry :)
	 */

	updateBadge();
}

function updateBadge() {
	let badgeColor = 'green';
	let numConflicts = 0;
	let numWarnings = conflicts["warnings"].length;
	let numErrors = conflicts["errors"].length;

	if (numWarnings != 0) {
		badgeColor = 'rgb(192, 173, 0)';
		numConflicts += numWarnings;
	}

	if (numErrors != 0) {
		badgeColor = 'red';
		numConflicts += numErrors;
	}

	if (numConflicts == 0) {
		numConflicts  = '\u2713';
	}

	setBadgeTextColor(badgeColor, `${numConflicts}`);
}

function setBadgeTextColor(color, text) {
	chrome.browserAction.setBadgeText({ text: text });
	chrome.browserAction.setBadgeBackgroundColor({ color: color });
}





// compare function compares P3P and user's preferences
// display green or red icone with the number of conficts
// function compare(data, p3p) {
// 	console.log(p3p);
// 	var conflict = []; //store all the user's preference that did not match P3P in array

// 	// 1. compare the shared info
// 	var website_share_data = p3p.POLICIES.POLICY.STATEMENT["DATA-GROUP"].DATA; // JSON PURPOSE object
// 	var user_name_option = data.share.name_share; // if user allowed name to be shared
// 	var user_email_option = data.share.email_share; // if user allowed email to be shared
// 	var user_address_option = data.share.address_share; // if user allowed address to be shared
// 	var user_phone_option = data.share.phone_share; // if user allowed phone to be shared
// 	var attribute_name = ""; // attribute name within the array
// 	var stored_value = [];

// 	// loop through all the shared data attributes
// 	for (var i = 0; i < website_share_data.length; i++) {
//    		attribute_name = website_share_data[i]["@attributes"].name;

//    		// if the website requires the name, but the user does not want to share their name
//      	if(attribute_name == "user.name." && user_name_option == false){
//      		conflict[conflict.length] = "this website must have the authorization to your name"; 
//      		stored_value[stored_value.length] = "name";
//      	}

//      	// if the website requires the email, but the user does not want to share their email
//      	else if(attribute_name == "user.online.email" && user_email_option == false){
//      		conflict[conflict.length] = "this website must have the authorization to your email"; 
//      		stored_value[stored_value.length] = "email";
//      	}

//      	// if the website requires the address, but the user does not want to share their address
//      	else if(attribute_name == "user.online.address" && user_address_option == false){
//      		conflict[conflict.length] = "this website must have the authorization to your address"; 
//      		stored_value[stored_value.length] = "address";
//      	}

//      	// if the website requires the phone, but the user does not want to share their phone
//      	else if(attribute_name == "user.phonenum.number" && user_phone_option == false){
//      		conflict[conflict.length] = "this website must have the authorization to your phone number"; 
//      		stored_value[stored_value.length] = "phone";
//      	}


//     }



// 	// 2. compare the telemarketing info
// 	var website_telemarketing = p3p.POLICIES.POLICY.STATEMENT.PURPOSE; // JSON PURPOSE object
// 	var user_telemarketing_option = data.telemarketing; // user's telemarketing preferences

// 	//if the P3P contains <contact> under PURPOSE in their P3P, then they may want to telemarket the user
// 	//if the user has not checked the telemarketing option, then add this to the conflict array
// 	if (("contact" in website_telemarketing || "telemarketing" in website_telemarketing) && user_telemarketing_option == false){
// 		conflict[conflict.length] = "this website must have the authorization to telemarket";
// 	}



// 	// 3. compare the time of the stored info
// 	var website_store_data = p3p.POLICIES.POLICY.STATEMENT.RETENTION // JSON PURPOSE object

// 	// website stores info for an underminate period of time
// 	if ("indefinitly" in website_store_data){
// 		conflict[conflict.length] = "this website must have the authorization to store your information for an underminate period of time";
// 	}

// 	console.log(data.stored.name_stored);

// 	// website stores info for a maximum time of 6 months
// 	if ("stated-purpose" in website_store_data){
// 		var user_name_value = data.stored.name_stored; // if user allowed name to be stored up to a max time
// 		var user_email_value = data.stored.email_stored; // if user allowed email to be stored up to a max time
// 		var user_address_value = data.stored.address_stored; // if user allowed address to be stored up to a max time
// 		var user_phone_value = data.stored.phone_stored; // if user allowed phone to bbe stored up to a max time
// 		var user_credit_card = data.stored.credit_card_stored;

// 		// go through DATA-GROUP attributes		
// 		for (var i = 0; i < stored_value.length; i++) {

// 			if (stored_value[i] == "name" && (user_name_value<6 || user_name_value == "")){
// 				conflict[conflict.length] = "this website must have the authorization to store your name for a maximum time of 6 months";
// 			}

// 			if (stored_value[i] == "email" && (user_email_value<6 || user_email_value == "")){
// 				conflict[conflict.length] = "this website must have the authorization to store your email for a maximum time of 6 months";
// 			}

// 			if (stored_value[i] == "address" && (user_address_value<6 || user_address_value == "")){
// 				conflict[conflict.length] = "this website must have the authorization to store your address for a maximum time of 6 months";
// 			}		

// 			if (stored_value[i] == "phone" && (user_phone_value<6 || user_phone_value == "")){
// 				conflict[conflict.length] = "this website must have the authorization to store your phone for a maximum time of 6 months";
// 			}		
// 		}

// 		if (user_credit_card<6 || user_credit_card == ""){
// 			conflict[conflict.length] = "this website must have the authorization to store your credit card number for a maximum time of 6 months";
// 		}		

// 	}


// 	// 4. display green or red icone with the number of conflict
// 	// if all user's preferences matched with P3P, display green incone
// 	if (conflict.length == 0){
// 		// display green icone
// 		var conflict_num = "0";
// 		chrome.browserAction.setBadgeText( { text: conflict_num } );
// 		chrome.browserAction.setBadgeBackgroundColor({color: [0,255,0,255]});

// 	// else, there is at least one conflict with user's preferences matched with P3P 
// 	} else {
// 		// display red icone and the number of conflicts on the badge
// 		var conflict_num = conflict.length;	
// 		chrome.browserAction.setBadgeText( { text: conflict_num.toString() } );
// 		chrome.browserAction.setBadgeBackgroundColor({color: "red"});

// 		// pop-up, with the information in the coonflict array
// 		print(conflict);

// 		// ask if the user would like to proceed
// 	}

// } // end of the compare function


// function print(arr){
// 	for (var i = 0; i < arr.length; i++) {
// 		console.log(arr[i]);
// 	}
// }
