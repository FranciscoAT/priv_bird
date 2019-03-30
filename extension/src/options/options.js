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

    // 
    function onLoad() {
        // get full names array
        getValues()
            .then((values) => {
                loadValues(values);
            })
            .catch((values) => {
                console.log("No Values stored", values);
            });
    }





    function setValues(values) {
        let newValues = {};
        fullNamesArr.map((inputId) => {
            let $inputId = $(`#${inputId}`);
            let newValue;
            newValue = $inputId.is(':checked');
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
    // iterate thru name array
    function loadValues(values) {
        fullNamesArr.map((inputId) => {

            //if true statement has been saved, then check box
            let $inputId = $(`#${inputId}`); 
            if (values[inputId] == true) {
                $inputId.prop('checked', true);
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
