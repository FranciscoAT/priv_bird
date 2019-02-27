$(document).ready(() => {

    /**
     * Check to see if we are localhost:3000 unfortunately
     * the manifest json complains about localhost only urls
     */

    let allowed_url = 'localhost:3000'
    let current_url = $(location).attr("href");
    if (!current_url.includes(allowed_url)) {
        return
    }

    // Get the p3p.xml and send it to background js
    let p3pLocation = 'p3p.xml';
    makeRequest('GET', `${current_url}${p3pLocation}`)
        .then((data) => {
            sendMessage('p3pData', data);
        })
        .catch((err) => {
            console.log('Error occured in getting p3p xml file', err);
        });

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
});