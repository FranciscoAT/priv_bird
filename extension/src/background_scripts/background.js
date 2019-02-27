// Message Handler
chrome.runtime.onMessage.addListener((msg, sender, res) => {
    if (msg.action === 'p3pData') {
        res(false);
        handleP3P(msg.value);
    }
});

function handleP3P(data) {
    console.log(data);
    // Handle p3p data here
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