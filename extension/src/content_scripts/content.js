$(document).ready(() => {

    /**
     * Check to see if we are localhost:3000 unfortunately
     * the manifest json complains about localhost only urls
     */

    var allowed_url = 'localhost:3000'
    var current_url = $(location).attr("href");
    if (!current_url.includes(allowed_url)) {
        console.log("Bad URL");
        return
    } else {
        console.log("Good URL");
    }

    // All code should exist below this!!

    
    
});