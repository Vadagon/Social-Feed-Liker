var buttons = {
    twitter: 'button.ProfileTweet-actionButton.js-actionButton.js-actionFavorite:visible:not([alreadyClickedByExtension=true])',
    facebook: '._4-u2.mbm._4mrt._5v3q._4-u8 form .UFILikeLink[data-testid=fb-ufi-likelink]:not([alreadyClickedByExtension=true])',
    linkedin: '.ember-view article .feed-shared-social-action-bar button.like-button:not([alreadyClickedByExtension=true])',
    instagram: '.coreSpriteHeartOpen:not([alreadyClickedByExtension=true])'
}
chrome.runtime.onMessage.addListener(function(e){
    chrome.browserAction.setBadgeText({ text: e.count.toString() })
});
var timer = false;
chrome.tabs.onActivated.addListener(function(tab){
	if(timer){
		clearTimeout(timer)
	}
	(function foo(){
		console.log('event..')
		// console.log('timOut')
		chrome.tabs.sendMessage(tab.tabId, { params: {task: "count"}, buttons: buttons }, function(e){
			if(e == undefined){
				chrome.browserAction.setBadgeText({ text: '' })
			}
		})
		timer = setTimeout(function() {
			foo()
		}, 1000);
	})()
})