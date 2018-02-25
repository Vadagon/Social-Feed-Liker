var timer;
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.task == 'count')
		sendResponse({count: $('button.ProfileTweet-actionButton.js-actionButton.js-actionFavorite:visible').length});
	if(request.task == 'start'){
		var cont = 0;
		var pase = 0;
		(function foo(){
			clearTimeout(timer)
			timer = setTimeout(function() {
				$('button.ProfileTweet-actionButton.js-actionButton.js-actionFavorite:visible')[0].click()
				if(pase++ > request.pause){
					pase = 0;
					setTimeout(function() {
						foo()
					}, request.resume * 1000);
				}else if(cont++ < request.estimated){
					foo()
				}
			}, request.interval * 1000);
		})()
	}
})
// chrome.runtime.sendMessage({ data: data, channel: window.location.pathname.split('/b/')[1].replace('/', '') })