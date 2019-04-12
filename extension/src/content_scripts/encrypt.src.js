/**
 * This file will intercept any outgoing form requests and encrypt outgoing data using IBE
 */

$(document).ready(() => {

    // Check if on localhost:3000
    if (checkURL()) {
        return;
    }

    // Create new IBE object
    const IBE = require('ibejs');
    let ibe = new IBE();

    // Hook onto any form submit and encrypt outgoing data
    $('form').on('submit', (e) => {
        // ignore this hook if no p3p
        if (!hasp3p) {
            return;
        }

        // Get the details on the form
        e.preventDefault();
        let $form = $(e.target);
        let formInputsArr = $form.serializeArray();
        let formInputs = JSON.stringify(formInputsArr);
        let formAction = $form.attr('action');

        // Encrypt the data
        let encData = ibe.encrypt(p3pxmlRaw, formInputs);

        // Create hidden form and submit encrypted data
        let $body = $('body');
        let inputDataId = "hiddenEncDataInputPrivBird";
        let hiddenFormId = "hiddenFormIdPrivBird";
        let hiddenForm = `<form id=${hiddenFormId} action=${formAction} method=POST>
                              <input hidden id="${inputDataId}" name="enc-data" type="string"></input>
                              <input hidden id=${inputDataId}-note name="note" type="string"></input>
                          </form>`
        $body.append(hiddenForm);
        $(`#${inputDataId}`).val(JSON.stringify(encData));
        $(`#${inputDataId}-note`).val('This Data has been Encrypted by Privacy Bird');
        $(`#${hiddenFormId}`).submit();
    });

});