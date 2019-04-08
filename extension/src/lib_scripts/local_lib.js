/**
 * Common utility functions used by several files
 */

// Define some constants to be used by content scripts
const base_url = 'http://localhost:3000/'
const current_url = $(location).attr("href");
const p3pLocation = 'p3p.xml';
let p3pxmlRaw = '';
let hasp3p = false;

/**
 * Checks to see if the user is on localhost:3000 our test environment
 * @returns {bool} true if not on site else false
 */
function checkURL() {
    let result = !current_url.includes(base_url);
    if (result == true) {
        console.log("Bad URL");
    }
    return result;
}

/**
 * Makes a simple request using XMLHTTP and returns a promise
 * @param {string} method XMLHTTP request type
 * @param {string} url URL to request to
 * @returns {Promise}
 */
function makeRequest(method, url) {
    return new Promise((res, rej) => {
        var request = new XMLHttpRequest();
        request.open(method, url);
        request.onload = () => {
            if (request.status >= 200 && request.status < 400) {
                var data = request.response;
                res(data);
            } else {
                rej({
                    status: request.status,
                    statusText: request.statusText
                });
            }
        };

        request.onerror = () => {
            rej({
                status: request.status,
                statusText: request.statusText
            });
        };

        request.send();
    });
}

/**
 * Sends a message to background.js
 * @param {String} msgName Name of message 
 * @param {String} msgContent Content of message
 */
function sendMessage(msgName, msgContent) {
    chrome.runtime.sendMessage({
        action: msgName,
        value: msgContent
    }, (err) => {
        if (err) {
            console.log(`An error occured sending ${msgName} to background scripts.`, err);
        }
    });
}