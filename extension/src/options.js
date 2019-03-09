
// Save user preferences in the options page
function saveUserPreferences() {
    
    // P3P: use of the collected information - who will receive this information
    // For our form, it is the name, email, address and phone number that is shared with the company and not third party
    var name_share = document.getElementById("name_share").checked;
    var email_share = document.getElementById("email_share").checked;
    var address_share = document.getElementById("address_share").checked;
    var phone_share = document.getElementById("phone_share").checked;

    // P3P: use of the collected information - how this information will be used
    // For our form, it is telemarketing
    var telemarketing= document.getElementById("telemarketing").checked;

    // P3P: permanancy and visibility - up to max time the user wants the server to store his/her information
    // P3P: type of information the server stores - which kind/particular of info is collected
    var name_stored = document.getElementById("name_stored").value;
    var email_stored = document.getElementById("email_stored").value;
    var address_stored = document.getElementById("address_stored").value;
    var phone_stored = document.getElementById("phone_stored").value;
    var credit_card_stored = document.getElementById("credit_card_stored").value;


    // store the user's preference into chrome local storage
    chrome.storage.sync.set({
      
      share: {
        name_share: name_share,  
        email_share: email_share, 
        address_share: address_share,
        phone_share: phone_share
      },

      telemarketing: telemarketing,

      stored: {
        name_stored: name_stored,  
        email_stored: email_stored,  
        address_stored: address_stored,  
        phone_stored: phone_stored, 
        credit_card_stored: credit_card_stored
      }
 
    }, function() {
      
      var msg = document.getElementById("msg");
      msg.innerHTML = "User preferences have been saved."
      setTimeout(function() {
        msg.innerHTML = "";
      }, 1000);
    });
  }
  

  // Get user preferences from storage and display info on form
  function loadUserPreferences() {
    chrome.storage.sync.get({
      
      share: {
        name_share: false,  
        email_share: false, 
        address_share: false,
        phone_share: false
      },

      telemarketing: false,

      stored: {
        name_stored: false,  
        email_stored: false,  
        address_stored: false,  
        phone_stored: false, 
        credit_card_stored: false
      }

    }, function(res) {
      document.getElementById("name_share").checked = res.share.name_share;
      document.getElementById("email_share").checked = res.share.email_share;
      document.getElementById("address_share").checked = res.share.address_share;
      document.getElementById("phone_share").checked = res.share.phone_share;

      document.getElementById("telemarketing").checked = res.telemarketing;
	  
      document.getElementById("name_stored").value = res.stored.name_stored;
      document.getElementById("email_stored").value = res.stored.email_stored;
      document.getElementById("address_stored").value = res.stored.address_stored;
      document.getElementById("phone_stored").value = res.stored.phone_stored;
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