// Define some constants to be used by content scripts
const base_url = 'http://localhost:3000/'
const current_url = $(location).attr("href");
const p3pLocation = 'p3p.xml';
let p3pxmlRaw = '';
let hasp3p = false;

// Library Functions
function checkURL() {
    let result = !current_url.includes(base_url);
    if (result == true) {
        console.log("Bad URL");
    }
    return result;
}

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