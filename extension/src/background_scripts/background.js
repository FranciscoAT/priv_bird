// chrome.browserAction.setBadgeBackgroundColor({
//     color: [255, 0, 0, 255]
// });

chrome.runtime.onMessage.addListener((msg, sender, res) => {
    if (msg.action === 'alertNumber') {
        console.log(msg);
        chrome.browserAction.setBadgeText({
            text: `${msg.value}`
        });
    }
});