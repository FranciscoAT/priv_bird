/**
 * This file triggers whenever you visit a new website or refresh a page and will check if the site
 * has a p3p document. Then if it does it will send it off to background.js
 */

$(document).ready(() => {
    // Checks if on localhost:3000
    if (checkURL()) {
        return;
    }

    // Get the p3p.xml and send it to background.js
    makeRequest('GET', `${base_url}${p3pLocation}`)
        .then((data) => {
            hasp3p = true;
            sendMessage('p3pData', data);
            p3pxmlRaw = data;
        })
        .catch((err) => {
            console.log('Error occured in getting p3p xml file', err);
        });
});