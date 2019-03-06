$(document).ready(() => {
    if (checkURL()) {
        return;
    }

    // Get the p3p.xml and send it to background js
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