var buttons = {
    twitter: 'button.ProfileTweet-actionButton.js-actionButton.js-actionFavorite:not(.ProfileTweet-action--unfavorite)',
    facebook: '._4-u2.mbm._4mrt._5v3q._4-u8 form .UFILikeLink[data-testid=fb-ufi-likelink]',
    linkedin: '.core-rail button.like-button.button.like:not(.feed-shared-comment-social-bar__action-button)',
    instagram: '.coreSpriteHeartOpen'
}
function content(item) {
return `
	var obj = document.createElement('div');
	obj.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,0.5);z-index:9999999;';
	document.body.appendChild(obj);

	console.log('injected');
	var times = 0;
	setInterval(function() {
		if(times >= ${settings.net[item].max}) window.close();
		[].some.call(document.querySelectorAll('${buttons[item]}:not([alreadyClickedByExtension=true])'), function(el){
			if(el.offsetWidth > 0 && el.offsetHeight > 0){
	            el.setAttribute("alreadyClickedByExtension", 'true')
	            el.scrollIntoView({behavior: "smooth", block: "end", inline: "center"})
	            el.click()
	            return !0
			}else{
				return !1;
			}
		});
		times++;
	}, ${settings.net[item].interval} * 1000);
`}
var settings = {
	net: {
	    twitter: {
	    	enabled: !1,
	    	sessionTime: 3,
	    	interval: 4,
	    	max: 60
	    },
	    facebook: {
	    	enabled: !1,
	    	sessionTime: 3,
	    	interval: 4,
	    	max: 60
	    },
	    linkedin: {
	    	enabled: !1,
	    	sessionTime: 3,
	    	interval: 4,
	    	max: 60
	    },
	    instagram: {
	    	enabled: !1,
	    	sessionTime: 3,
	    	interval: 4,
	    	max: 60
	    }
	}
}
var A = {
	queue: [],
	createTab: function(item){
		chrome.tabs.create({ url: 'https://'+item+'.com', pinned: !0, selected: !1 }, function(e){
			setTimeout(function() {
				chrome.tabs.executeScript(e.id, {code: content(item)}, function(){
					console.log('injected')
				});
			}, 3000);
		});
	},
	handler: function(delay){
		A.timeOut && clearTimeout(A.timeOut)
		A.timeOut = setTimeout(function() {
			if(!A.queue.length){
				A.init(!0);
				return;
			}
			A.createTab(A.queue[0].item)
			A.handler(A.queue[0].time)
			A.queue.shift()
		}, delay * 1000);
	},
	init: function(e){
		for(var i in settings.net){
			console.log(settings.net[i].enabled)
			settings.net[i].enabled && A.queue.push({item: i, time: settings.net[i].interval * settings.net[i].max});
			// =========|
			(e && A[i]) && clearInterval(A[i]);
			if(e && settings.net[i].enabled) A[i] = setInterval(function(ittt) {
				A.createTab(ittt)
			}, settings.net[i].sessionTime * 60 * 60 * 1000, i);
		}
		!e && A.handler(3)
	}
}
chrome.runtime.onMessage.addListener(function(e){
	if(!e.act.includes('run')){
		settings = e.settings
		chrome.storage.sync.set({settings: settings})
	}else{
		if(e.act == 'run'){
			console.log(e)
			settings = e.data
			A.init(!0)
		}else{
			A.createTab(e.act.replace('run-', ''))
		}
	}
    chrome.browserAction.setBadgeText({ text: e.count.toString() })
});
// chrome.storage.sync.set({settings: settings})
chrome.storage.sync.get(['settings'], function(res) {
	console.log(res.settings)
	!res.settings ? chrome.storage.sync.set({settings: settings}) : settings = res.settings;
	A.init()
});
