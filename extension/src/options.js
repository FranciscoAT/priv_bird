
// Save user preferences - test 2
function saveUserPreferences() {
    var name = document.getElementById("name").checked;
    var email = document.getElementById("email").checked;
    var addr = document.getElementById("address").checked;

    chrome.storage.local.set({
      name: name,
      email: email,
      addr: addr

    }, function() {
      
      var msg = document.getElementById("msg");
      msg.innerHTML = "User preferences have been saved."
      setTimeout(function() {
        msg.innerHTML = "";
      }, 1000);
    });
  }
  

  // Get user preferences from storage
  function loadUserPreferences() {
    chrome.storage.local.get({
      name: false,
      email: false,
      addr: false
    }, function(checkBoxes) {
      document.getElementById("name").checked = checkBoxes.name;
      document.getElementById("email").checked = checkBoxes.email;
      document.getElementById("address").checked = checkBoxes.addr;
    });
  }

  document.addEventListener("DOMContentLoaded", loadUserPreferences, false);
  document.getElementById("save").addEventListener("click", saveUserPreferences, false);
