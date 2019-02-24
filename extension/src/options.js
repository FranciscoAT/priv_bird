
$(function(){
	$(#'save').click(function(){
		var name = $('#name').val();
		if (name){
		chrome.storage.sync.set({'#name':name}), function(){
			close();
		});
		}
	});
});	
	