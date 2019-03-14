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
        getConflicts()
            .then((conflicts) => {
                writeConflicts(conflicts);
            })
            .catch((err) => {
                writeError(err);
            });
    }

    function writeConflicts(conflicts) {
        let errors = conflicts['errors'];
        let warnings = conflicts['warnings'];
        $conflictsDiv.text();
        let textRows = [];

        if (errors.length == 0 && warnings.length == 0) {
            textRows.push(getTextRow('No Errors or Warnings!'));
            textRows.push(getTextRow('Happy Browsing!'));
        }

        if (errors.length != 0) {
            textRows.push(getHeaderRow('Conflicts', 'red'));
            for (let i = 0; i < errors.length; i++) {
                textRows.push(getTextRow(errors[i]));
            }
        }

        if (warnings.length != 0) {
            textRows.push(getHeaderRow('Warnings', 'yellow'));
            for (let i = 0; i < warnings.length; i++) {
                textRows.push(getTextRow(warnings[i]));
            }
        }

        for (let i = 0; i < textRows.length; i++) {
            $conflictsDiv.append(textRows[i]);
        }
    }

    function writeError(err) {
        $conflictsDiv.text(`Something went wrong: ${err}`);
    }

    function getTextRow(text) {
        return `<p class="do-not-break">${text}</p>`;
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

    onLoad();
});

