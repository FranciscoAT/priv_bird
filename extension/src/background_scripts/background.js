/**
 * This file handles the current status of the selected webpage privacy policies. It will recieve
 * the current pages P3P, parse it and compare it with the current privacy settings then update the 
 * badge accordingly.
 */

// Global Variables
let conflicts = {
    "warnings": [],
    "errors": []
};

let p3p_data = {
    "user_info": false,
    "financial_info": false,
    "computer_info": false,
    "retention": false,
    "telemarketing": false
};


/**
 * Chrome handler to handle what to do when a request is sent by either
 * popup.js or content.js
 */
chrome.runtime.onMessage.addListener((msg, sender, res) => {
    if (msg.action === 'p3pData') {
        res(false);
        handleP3P(msg.value);
    } else if (msg.action === 'getConflicts') {
        res(conflicts);
    }
});


/**
 * Handler function when P3P file is sent by content.js. This function will call in the current privacy
 * setting values, convert the XML to a JSON format and call in the compare function
 * @param {String} data 
 */
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


/**
 * Gets all the stored chrome variables
 * @param {array} valuesToGetArr List of variable names
 */
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


/**
 * Compares the current privacy bird settings with the p3p object. Then will append any 
 * errors or warnings to the corresponding array in the conflicts variable 
 * @param {object} data Object of privacy settings
 * @param {Object} p3p P3P XML in JSON format
 */
function compare(data, p3p) {
    //console.log(p3p);

    // Reset the current conflicts and p3p values
    conflicts = {
        "warnings": [],
        "errors": []
    };

    p3p_data = {
        "user_info": false,
        "financial_info": false,
        "computer_info": false,
        "retention": false,
        "telemarketing": false
    };

    //P3P variables
    var statement = p3p.POLICIES.POLICY.STATEMENT;

    // more than one statement, the JSON object is an array
    if (Array.isArray(statement)) {

        //go through each statement
        for (var i = 0; i < statement.length; i++) {
            compareStatement(data, statement[i]);
        }
    }

    // one statement
    else {
        //P3P variables
        var statement = p3p.POLICIES.POLICY.STATEMENT;
        compareStatement(data, statement);
    }

    badge_values(data);
    updateBadge();
}


//compare one statement at time --------------------------------------------------------------
function compareStatement(data, statement) {

    /* 1. if website stores data longer than required
          retention = "legal-requirement" OR "indefinitely", then we want to warn user
    */
    //if more than one purpose, loop through all of them
    var retention = statement.RETENTION;
    if (p3p_data.retention == false) {
        if (Array.isArray(retention)) {
            for (var i = 0; i < retention.length; i++) {
                if ("legal-requirement" in retention[i] || "indefinitely" in retention[i]) {
                    p3p_data.retention = true;
                }
            }
        } else {
            if ("legal-requirement" in retention || "indefinitely" in retention) {
                p3p_data.retention = true;
            }
        }
    }



    /* 2. if purpose is going to related to telemarketing, where
          purpose = "conctact" OR "telemarketing", then we want to warn user
    */
    var purpose = statement.PURPOSE;
    if (p3p_data.telemarketing == false) {
        if (Array.isArray(purpose)) {
            for (var i = 0; i < purpose.length; i++) {
                if ("contact" in purpose[i] || "telemarketing" in purpose[i]) {
                    p3p_data.telemarketing = true;
                }
            }
        } else {
            if ("contact" in purpose || "telemarketing" in purpose) {
                p3p_data.telemarketing = true;
            }
        }
    }



    /* 3. go through all the data and check categories */
    var data = statement["DATA-GROUP"].DATA;
    if (p3p_data.user_info == false || p3p_data.financial_info == false || p3p_data.computer_info == false) {
        if (Array.isArray(data)) {
            for (var i = 0; i < data.length; i++) {
                check_categories(data[i]);
            }
        } else {
            check_categories(data);
        }
    }

}


function check_categories(data) {

    var category = data.CATEGORIES;

    if (Array.isArray(category)) {


        //loop through each attribute and check if the category
        for (var i = 0; i < category.length; i++) {

            if ("physical" in category[i] || "online" in category[i] || "demographic" in category[i]) {
                p3p_data.user_info = true;
            }

            if ("financial" in category[i] || "purchase" in category[i]) {
                p3p_data.financial_info = true;
            }

            if ("computer" in category[i]) {
                p3p_data.computer_info = true;
            }


        }

    } else {

        if ("physical" in category || "online" in category || "demographic" in category) {
            p3p_data.user_info = true;
        }

        if ("financial" in category || "purchase" in category) {
            p3p_data.financial_info = true;
        }

        if ("computer" in category) {
            p3p_data.computer_info = true;
        }

    }
}


function totCriticalInfoStored(website_statement_data) {

    var counter = 0;

    if (Array.isArray(website_statement_data)) {
        //loop through each attribute and check if the category
        for (var i = 0; i < website_statement_data.length; i++) {
            attribute_category = website_statement_data[i]["@attributes"].category;
            console.log("loop ");
            if (attribute_category == "financial") {
                counter = counter + 1;
            }
        }


        function badge_values(data) {
            //console.log(p3p_data);
            if (data["share-user-info"] == false && p3p_data.user_info == true) {
                conflicts.errors.push("User information will be shared");
            }

            if (data["share-financial-info"] == false && p3p_data.financial_info == true) {
                conflicts.errors.push("Financial information will be shared");
            }

            if (data["share-cpu-info"] == false && p3p_data.computer_info == true) {
                conflicts.errors.push("Computer information will be shared");
            }

            if (data["retention"] == true && p3p_data.retention == true) {
                conflicts.warnings.push("Data may be stored longer than needed");
            }

            if (data["telemarketing"] == true && p3p_data.telemarketing == true) {
                conflicts.warnings.push("Information may be used for telemarketing purposes");
            }
        }
    }
}


/**
 * Updates the badge based on the current values of the conflict variable
 */
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
        numConflicts = '\u2713';
    }

    setBadgeTextColor(badgeColor, `${numConflicts}`);
}

/**
 * Sets a badge on the extension icon
 * @param {string} color Badge colour
 * @param {string} text Badge text
 */
function setBadgeTextColor(color, text) {
    chrome.browserAction.setBadgeText({
        text: text
    });
    chrome.browserAction.setBadgeBackgroundColor({
        color: color
    });
}