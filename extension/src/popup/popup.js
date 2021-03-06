$('document').ready(() => {
    let $conflictsDiv = $('#conflict-div');

    function getConflicts() {
        return new Promise((res, rej) => {
            chrome.runtime.sendMessage({ action: 'getConflicts' }, (msgResponse) => {
                if (typeof (msgResponse) != 'object') {
                    rej(msgResponse);
                }

                if (!msgResponse.hasOwnProperty('warnings') || !msgResponse.hasOwnProperty('errors')) {
                    rej(msgResponse);
                }
                res(msgResponse);
            });
        });
    }

    function onLoad() {
        getCurrentURL()
            .then((url) => {
                getConflicts()
                    .then((conflicts) => {
                        writeConflicts(conflicts, url);
                    })
                    .catch((err) => {
                        writeError(err);
                    });
            })
            .catch(() => {
                writeError("Not on localhost:3000");
            });
    }

    function getCurrentURL() {
        return new Promise((res, rej) => {
            let query = { active: true, currentWindow: true };
            chrome.tabs.query(query, (results) => {
                if (results.length == 0) {
                    rej();
                } else if (!(results[0].url).includes('localhost:3000')) {
                    rej();
                }
                res(results[0].url);
            });
        });
    }

    function writeConflicts(conflicts, url) {
        let errors = conflicts['errors'];
        let warnings = conflicts['warnings'];
        $conflictsDiv.text();
        let textRows = [];

        let baseURL = /^https?:\/\/[^\/]+/i.exec(url)[0];
        let p3pURL = getLink('Raw P3P', `${baseURL}/p3p.xml`);
        let readablep3pURL = getLink(`Readable P3P`, `${baseURL}/privacypolicy`);

        if (errors.length == 0 && warnings.length == 0) {
            textRows.push(getTextRow('No Errors or Warnings!'));
            textRows.push(getTextRow('Happy Browsing!'));
        }

        if (errors.length != 0) {
            textRows.push(getHeaderRow('Conflicts', 'red'));
            for (let i = 0; i < errors.length; i++) {
                textRows.push(getlistItem(errors[i]));
            }
        }

        if (warnings.length != 0) {
            textRows.push(getHeaderRow('Warnings', 'yellow'));
            textRows.push(getTextRow('The following <strong>may</strong> conflict with your preferences.', 'center no-bottom-margin')); 
            textRows.push(getTextRow(`Please read the ${readablep3pURL}.`, 'center no-top-margin'));
            for (let i = 0; i < warnings.length; i++) {
                textRows.push(getlistItem(warnings[i]));
            }
        }

        textRows.push('<hr>');
        textRows.push(getTextRow(`${readablep3pURL} | ${p3pURL}`, 'center'));

        for (let i = 0; i < textRows.length; i++) {
            $conflictsDiv.append(textRows[i]);
        }
    }

    function writeError(err) {
        $conflictsDiv.text(`Something went wrong: ${err}`);
    }

    function getTextRow(text, additionalClasses = '') {
        return `<p class="do-not-break ${additionalClasses}">${text}</p>`;
    }

    function getlistItem(text) {
        return `<li class="do-not-break">${text}</li>`
    }

    function getHeaderRow(text, colorClass) {
        let classes = "do-not-break center header-row";
        if (colorClass == 'red') {
            classes += ' red-text';
        } else if (colorClass == 'yellow') {
            classes += ' yellow-text';
        }

        return `<p class="${classes}">${text}</p>`;
    }

    function getLink(text, url) {
        return `<a href=${url}>${text}</a>`;
    }

    $(document).on('click', 'a', (e) => {
        e.preventDefault();
        let targetURL = e.target.href;

        chrome.tabs.update({ active: true, url: targetURL });
    });

    onLoad();
});

