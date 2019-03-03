
//CHANGER directement sur le site web - commit test 2
// Save user preferences - test 2
function saveUserPreferences() {
    var name = document.getElementById("name").checked;
    var email = document.getElementById("email").checked;
    var addr = document.getElementById("address").checked;
    var phone = document.getElementById("phone").checked;

    chrome.storage.local.set({
      name: name,
      email: email,
      addr: addr,
      phone: phone

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
      addr: false,
      phone: false
    }, function(checkBoxes) {
      document.getElementById("name").checked = checkBoxes.name;
      document.getElementById("email").checked = checkBoxes.email;
      document.getElementById("address").checked = checkBoxes.addr;
      document.getElementById("phone").checked = checkBoxes.phone;
    });
  }
  
  
  // --------------------------Ajouter du code pour changer l'icône--------------------------
  //Modification to icon
  //Sources: https://developer.chrome.com/extensions/browserAction
  //https://stackoverflow.com/questions/35852715/changing-chrome-extension-icon
  function iconColorChange(){
	var status = "vert";
	chrome.browserAction.setBadgeText( { text: status } );
	chrome.browserAction.setBadgeBackgroundColor({color: [0,255,0,255]});
  }
  
  
  //remet l'icône comme avant
  function iconColorDeChange(){
	var status = "";
	chrome.browserAction.setBadgeText( { text: status } );
	chrome.browserAction.setBadgeBackgroundColor({color: [0,0,0]});
  }
 
 
  //NE fonctionne pas - code pour un pop up
  //à moins que popup n'est pas un string mais un fichier html comme dans les exemples?
  function iconPopUp2(){
	var msg = "not work";	
	chrome.browserAction.setBadgeText( { text: msg } );
	chrome.browserAction.setBadgeBackgroundColor({color: "red"});
	
	chrome.browserAction.setPopup({popup: "afficher msg"}); //fonctionne pas
  }
  

  // ---------------------Action Listener pour les boutons du fichier HTML-------------------------
  
  document.addEventListener("DOMContentLoaded", loadUserPreferences, false);
  document.getElementById("save").addEventListener("click", saveUserPreferences, false);
  
  document.getElementById("iconModification").addEventListener("click", iconColorChange, false);
  document.getElementById("iconDeModification").addEventListener("click", iconColorDeChange, false);
  document.getElementById("iconpopup").addEventListener("click", iconPopUp2, false);