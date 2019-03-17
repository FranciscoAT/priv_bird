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



//data: objet JSON (tous les valeurs dans local storage)
//p3p: converti fichier XML a un objet JSON
function compare(data, p3p) {
    // Reset the current conflicts
    conflicts = {
        "warnings": [],
        "errors": []
    };


    //P3P variables
    var statement = p3p.POLICIES.POLICY.STATEMENT;

    // more than one statement, the JSON object is an array
    if (Array.isArray(statement)) {

        //go through each statement
        for (var i = 0; i < statement.length; i++) {
            console.log(i);
            compareStatement(data, statement[i]);
        }
    }

    // one statement
    else {
        //P3P variables
        var statement = p3p.POLICIES.POLICY.STATEMENT;
        compareStatement(data, statement);
    }

    updateBadge();
}





//compare one statement at time --------------------------------------------------------------
function compareStatement(data, statement) {
    //user preferences variables
    var share_checkbox = data["share-data-general"]; // if user allowed info to be shared
    var general_retention = data["retention-general"]; // retention for general info
    var critical_rentention = data["retention-critical"]; // rentention for critical info


    //P3P variables
    //var website_statement_data = p3p.POLICIES.POLICY.STATEMENT["DATA-GROUP"].DATA;
    //var website_retention = p3p.POLICIES.POLICY.STATEMENT.RETENTION; 
    var website_statement_data = statement["DATA-GROUP"].DATA;
    var website_retention = statement.RETENTION;

    console.log("website_statement_data");
    console.log(website_statement_data);

    //valeurs calculées
    var num_critical_data = totCriticalInfoStored(website_statement_data);
    var num_general_data = totGeneralInfoStored(website_statement_data);

    console.log("num_critical_data: " + num_critical_data)
    console.log("num_general_data: " + num_general_data)


    //1 - user preference: share checkbox (info may be shared)
    if (share_checkbox == false && website_statement_data.length > 0) {
        conflicts.errors.push("General information will be shared");
    }


    //2 - user preference: retention-general
    if (num_general_data > 0) {

        // the website will store the user's information
        if (general_retention == "no-retention" && !("no-retention" in website_retention)) {
            conflicts.errors.push("General information will be stored");
        }

        //store info for more than a period of time
        if (general_retention == "legal-retention" && ("legal-requirement" in website_retention)) {
            conflicts.warnings.push("General information may be stored longer than needed");
        }

        //store info for more than a period of time
        if (general_retention == "legal-retention" && ("indefinitely" in website_retention)) {
            conflicts.errors.push("General information will be stored for an indeterminate period of time");
        }
    }

    //3 - user preference: retention-critical
    if (num_critical_data > 0) {

        // the website will store the user's information
        if (critical_rentention == "no-retention" && !("no-retention" in website_retention)) {
            conflicts.errors.push("Critical information will be stored");
        }

        //store info for more than a period of time
        if (critical_rentention == "legal-retention" && ("legal-requirement" in website_retention)) {
            conflicts.warnings.push("Critical information may be stored longer than needed");
        }

        //store info for more than a period of time
        if (critical_rentention == "legal-retention" && ("indefinitely" in website_retention)) {
            conflicts.errors.push("Critical information will be stored for an indeterminate period of time");
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

    } else {
        attribute_category = website_statement_data["@attributes"].category;
        if (attribute_category == "financial") {
            counter = counter + 1;
        }
    }

    return counter;
}


function totGeneralInfoStored(website_statement_data) {

    var counter = 0;

    if (Array.isArray(website_statement_data)) {
        //loop through each attribute and check if the category
        for (var i = 0; i < website_statement_data.length; i++) {
            attribute_category = website_statement_data[i]["@attributes"].category;
            if (attribute_category != "financial") {
                counter = counter + 1;
            }
        }

    } else {
        attribute_category = website_statement_data["@attributes"].category;
        if (attribute_category != "financial") {
            counter = counter + 1;
        }
    }

    return counter;
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
        numConflicts = '\u2713';
    }

    setBadgeTextColor(badgeColor, `${numConflicts}`);
}

function setBadgeTextColor(color, text) {
    chrome.browserAction.setBadgeText({ text: text });
    chrome.browserAction.setBadgeBackgroundColor({ color: color });
}
