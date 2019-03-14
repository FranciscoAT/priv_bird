$('document').ready(() => {
    var $saveBtn = $('#save-preferences');
    var $msgDiv = $('#msg');

    function getValues() {
        return new Promise((res, rej) => {
            chrome.storage.local.get(fullNamesArr, (result) => {
                if (result == {}) {
                    rej(result);
                }
                res(result);
            });
        });
    }

    function onLoad() {
        setComboBoxes();

        getValues()
            .then((values) => {
                loadValues(values);
            })
            .catch((values) => {
                console.log("No Values stored", values);
            });
    }

    function setComboBoxes() {
        let options = [
            "No Retention",
            "Legal Retention",
            "Any Retention"
        ];

        retentionNames.map((selectId) => {
            let $selectInput = $(`#${selectId}`);
            options.map((optionName) => {
                let optiondVal = optionName.toLowerCase().replace(' ', '-');
                $selectInput.append(new Option(optionName, optiondVal));
            });
        });
    }

    function setValues(values) {
        let newValues = {};
        fullNamesArr.map((inputId) => {
            let $inputId = $(`#${inputId}`);
            let newValue;
            if (inputId.includes('share')) {
                newValue = $inputId.is(':checked');
            } else {
                newValue = $inputId.val();
            }
            newValues[inputId] = newValue;
        });
        
        chrome.storage.local.set(newValues, () => {
            $msgDiv.text("Preferences have been saved.");
            setTimeout(() => {
                $msgDiv.text('');
            }, 2000);
        });
        alertMessageSave();
    }

    function loadValues(values) {
        fullNamesArr.map((inputId) => {
            let $inputId = $(`#${inputId}`);
            if (inputId.includes('share') && values['share-data-general']) {
                $inputId.prop('checked', true);
            } else {
                $inputId.val(values[inputId]);
            }
        });
    }

    // Set button hooks
    $saveBtn.on('click', () => {
        setValues();
    });

    // Run init function
    onLoad();
});
