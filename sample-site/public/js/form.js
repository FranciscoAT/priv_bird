$(document).ready(() => {
    const $newp3pform = $('#test-form');
    $newp3pform.on('submit', (e) => {
        console.log('catching and releasing form submission');
    });
});