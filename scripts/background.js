var buttons = {
    twitter: 'button.ProfileTweet-actionButton.js-actionButton.js-actionFavorite:visible',
    facebook: '._4-u2.mbm._4mrt._5v3q._4-u8 form .UFILikeLink[data-testid=fb-ufi-likelink]',
    linkedin: '.ember-view article .feed-shared-social-action-bar button.like-button',
    instagram: '.coreSpriteHeartOpen'
}
chrome.runtime.onMessage.addListener(function(e){
    chrome.browserAction.setBadgeText({ text: e.count.toString() })
});

chrome.tabs.onActivated.addListener(function(tab){
	console.log(tab);
	chrome.tabs.sendMessage(tab.tabId, { params: {task: "count"}, buttons: buttons }, function(e){
		if(!e){
			chrome.browserAction.setBadgeText({ text: '' })
		}
	})
})