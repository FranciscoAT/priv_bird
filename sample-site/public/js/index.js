$(document).ready(() => {
    const $newp3pform = $('#newp3pform');
    const $currp3pfile = $('#currentlySelected');
    $newp3pform.on('submit', (e) => {
        $newp3pfile = $('#newp3pfile');
        $currp3pfile.text($newp3pfile.val());
    });

    // Add form functionality below
});