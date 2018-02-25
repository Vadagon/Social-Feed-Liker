//The main function.
log.debug("Background is running");
var youtubeURL = "www.youtube.com/watch";
var count = 0;
var currentTab = null;
var _gaq;
var FB_URL_PARTERNS = ["https://*.facebook.com/*", "http://*.facebook.com/*"];
chrome.browserAction.onClicked.addListener(function(tab) {
    try {
        executeScripts(null, [
            { file: "libs/jquery.js" },
            { file: "scripts/utils.js" },
            { file: "scripts/content_script.js" },
            { file: "scripts/on-button-action-click.js" }
        ]);
        setBadgeText(tab, '');
        disableButton(tab);
        updateNumberOfUsed();
    } catch (e) {
        console.log('Exception on chrome.browserAction.onClicked');
    }
});

chrome.tabs.onCreated.addListener(function(tab) {
    currentTab = tab;
    log.debug('chrome.tabs.onCreated.addListener tab.id ' + tab.id + ' ; tab.url ' + tab.url);
    disableButton(tab);
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    currentTab = tab;
    var url = tab.url;
    log.debug('chrome.tabs.onUpdated.addListener tab.id ' + tab.id + ' ; tab.url ' + tab.url);
    try {
        if (checkEnable(tab.url)) {
            enableButtonIfNoneText(tab);
        } else {
            disableButton(tab);
        }
    } catch (e) {
        log.debug(' Exception on chrome.tabs.onUpdated');
    }
    
    if (url !== undefined && changeInfo.status == "complete" && url.indexOf('youtube') > 0) {
        likeYoutubeVideo(tab.url);
    }
    
});
chrome.runtime.onInstalled.addListener(function(details) {
    log.debug("on Installed");
    //    setStorageNumber("isCloseOptionPage", false);
    chrome.storage.sync.get({
        isCloseOptionPage: false
    }, function(cfgData) {
        log.debug("Option is not opened yet!" + JSON.stringify(cfgData));
        if (!cfgData["isCloseOptionPage"]) {
            log.debug("Option tab is openning");
            openOptionPage();
            setStorageNumber("isCloseOptionPage", true);
        }
    });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    log.debug('receive: ' + request.count + " from tab : " + sender.tab.id + " content script:" + sender.tab.url);
    if (request.isAnalytic) {
        trackButton(request.buttonId);
        return;
    }
    if (request.count || request.count == 0) {
        count = request.count;
        var tab = sender.tab;
        if (count == 0) {
            setBadgeText(tab, getDefaultText(tab));
            enableButton(tab);
        } else {
            setBadgeNumber(tab, request.count);
            disableButton(tab);
        }
    }
});

var CONSTANT = {
    "FACEBOOK": {
        "MENUS": {
            "CONFIRM-FRIEND": "confirm-friend-request",
            "REQUEST-FRIEND": "send-friend-request",
            "LIKE-ALL": "like-all",
            "LIKE-POST": 'like-post',
            "LIKE-COMMENT": 'like-comment',
            "REACT-ALL": "react-all",
            "REACT-POST": 'react-posts',
            "REACT-COMMENT": 'react-comments',
            "OPEN-COMMENT": 'open-comment',
            "INVITE-FRIEND": "invite-friend",
            "LOVE-ALL":"love-all",
            "COMMENT": "comment",
            "STOP": "stop",
            "OPTION": "option"
        }
    }
}

function genericOnClick(info, tab) {
    log.debug("Cliked : " + info.menuItemId);
    if (!isFacebook(tab)) {
        log.debug("Context menus support Facebook only.");
        return;
    }
    trackButton(info.menuItemId);
    switch (info.menuItemId) {
        case CONSTANT["FACEBOOK"]["MENUS"]["CONFIRM-FRIEND"]:
            executeScripts(null, [
                { file: "libs/jquery.js" },
                { file: "scripts/utils.js" },
                { file: "scripts/confirm-friend.js" }
            ]);
            updateNumberOfUsed();
            break;
        case CONSTANT["FACEBOOK"]["MENUS"]["REQUEST-FRIEND"]:
            executeScripts(null, [
                { file: "libs/jquery.js" },
                { file: "scripts/utils.js" },
                { file: "scripts/request-friend.js" }
            ]);
            updateNumberOfUsed();
            break;
        case CONSTANT["FACEBOOK"]["MENUS"]["INVITE-FRIEND"]:
            executeScripts(null, [
                { file: "libs/jquery.js" },
                { file: "scripts/utils.js" },
                { file: "scripts/invite-friend.js" }
            ]);
            updateNumberOfUsed();
            break;
        case CONSTANT["FACEBOOK"]["MENUS"]["LIKE-ALL"]:
            executeScripts(null, [
                { file: "libs/jquery.js" },
                { file: "scripts/utils.js" },
                { file: "scripts/fb-utils.js" },
                { file: "scripts/like-all.js" }
            ]);
            updateNumberOfUsed();
            break;
        case CONSTANT["FACEBOOK"]["MENUS"]["LIKE-POST"]:
            executeScripts(null, [
                { file: "libs/jquery.js" },
                { file: "scripts/utils.js" },
                { file: "scripts/fb-utils.js" },                
                { file: "scripts/like-post.js" }
            ]);
            updateNumberOfUsed();
            break;
        case CONSTANT["FACEBOOK"]["MENUS"]["LIKE-COMMENT"]:
            executeScripts(null, [
                { file: "libs/jquery.js" },
                { file: "scripts/utils.js" },
                { file: "scripts/fb-utils.js" },
                { file: "scripts/like-comment.js" }
            ]);
            updateNumberOfUsed();
            break;
        case CONSTANT["FACEBOOK"]["MENUS"]["REACT-ALL"]:
            executeScripts(null, [
                { file: "libs/jquery.js" },
                { file: "scripts/utils.js" },
                { file: "scripts/fb-utils.js" },
                { file: "scripts/fb-reaction-all.js" }
            ]);
            updateNumberOfUsed();
            break;
        case CONSTANT["FACEBOOK"]["MENUS"]["REACT-POST"]:
            executeScripts(null, [
                { file: "libs/jquery.js" },
                { file: "scripts/utils.js" },
                { file: "scripts/fb-utils.js" },                
                { file: "scripts/fb-reaction-post.js" }
            ]);
            updateNumberOfUsed();
            break;
        case CONSTANT["FACEBOOK"]["MENUS"]["REACT-COMMENT"]:
            executeScripts(null, [
                { file: "libs/jquery.js" },
                { file: "scripts/utils.js" },
                { file: "scripts/fb-utils.js" },
                { file: "scripts/fb-reaction-comment.js" }
            ]);
            updateNumberOfUsed();
            break;
        case CONSTANT["FACEBOOK"]["MENUS"]["OPEN-COMMENT"]:
            executeScripts(null, [
                { file: "libs/jquery.js" },
                { file: "scripts/utils.js" },
                { file: "scripts/open-comment.js" }
            ]);
            updateNumberOfUsed();
            break;
        case CONSTANT["FACEBOOK"]["MENUS"]["LOVE-ALL"]:
            executeScripts(null, [
                { file: "libs/jquery.js" },
                { file: "scripts/utils.js" },
                { file: "scripts/fb-emotion.js" }
            ]);
            updateNumberOfUsed();
            break;
        case CONSTANT["FACEBOOK"]["MENUS"]["OPTION"]:
            openOptionPage();
            //updateNumberOfUsed();
            break;
        case CONSTANT["FACEBOOK"]["MENUS"]["STOP"]:
            executeScripts(null, [
                { file: "scripts/utils.js" },
                { file: "scripts/stop-reload.js" }
            ]);
            break;
        default:
            break;
    }

}



function createContextMenus() {
    var menuTitle = "Facebook Auto";
    menuTitle =  DEBUG ? menuTitle + " - Dev" : menuTitle;   
    var rootFbMenu = createMenuItem( "facebook-auto", menuTitle, undefined, undefined, ["all"]);
    chrome.contextMenus.onClicked.addListener( genericOnClick );
    var SEPARATOR_TYPE = "separator";
    // Create a parent item and two children.
    createMenuItem( CONSTANT["FACEBOOK"]["MENUS"]["CONFIRM-FRIEND"], "Accept Friends", rootFbMenu, undefined, undefined);
    createMenuItem( CONSTANT["FACEBOOK"]["MENUS"]["REQUEST-FRIEND"], "Add Friends", rootFbMenu, undefined, undefined);
    createMenuItem( "separator1", undefined, rootFbMenu, SEPARATOR_TYPE, undefined);
    createMenuItem( CONSTANT["FACEBOOK"]["MENUS"]["INVITE-FRIEND"], "Invite Friends", rootFbMenu, undefined, undefined);
    createMenuItem( "separator2", undefined, rootFbMenu, SEPARATOR_TYPE, undefined);
    createMenuItem( CONSTANT["FACEBOOK"]["MENUS"]["REACT-ALL"], "React to all", rootFbMenu, undefined, undefined);
    createMenuItem( CONSTANT["FACEBOOK"]["MENUS"]["REACT-POST"], "React to posts", rootFbMenu, undefined, undefined);
    createMenuItem( CONSTANT["FACEBOOK"]["MENUS"]["REACT-COMMENT"], "React to comments", rootFbMenu, undefined, undefined);
    createMenuItem( "separator21", undefined, rootFbMenu, SEPARATOR_TYPE, undefined);
    createMenuItem( CONSTANT["FACEBOOK"]["MENUS"]["LIKE-ALL"], "Like all", rootFbMenu, undefined, undefined);
    createMenuItem( CONSTANT["FACEBOOK"]["MENUS"]["LIKE-POST"], "Like posts", rootFbMenu, undefined, undefined);
    createMenuItem( CONSTANT["FACEBOOK"]["MENUS"]["LIKE-COMMENT"], "Like comments", rootFbMenu, undefined, undefined);
    createMenuItem( "separator3", undefined, rootFbMenu, SEPARATOR_TYPE, undefined);
    createMenuItem( CONSTANT["FACEBOOK"]["MENUS"]["OPEN-COMMENT"], "Open comments", rootFbMenu, undefined, undefined);
    createMenuItem( "separator4", undefined, rootFbMenu, SEPARATOR_TYPE, undefined);
    createMenuItem( CONSTANT["FACEBOOK"]["MENUS"]["STOP"], "Stop by Reload (F5)", rootFbMenu, undefined, undefined);
    createMenuItem( CONSTANT["FACEBOOK"]["MENUS"]["OPTION"], "Option", rootFbMenu, undefined, undefined);
}

var allMenuIds = {};
function createMenuItem( id, title, parentId, type, context){
    if( !allMenuIds[ id ]){
       allMenuIds[ id ] = chrome.contextMenus.create({ 
           "id": id, 
           "title": title, 
           "type": type,
           "parentId": parentId, 
           "documentUrlPatterns": FB_URL_PARTERNS ,
           "contexts": context
        });
        return allMenuIds[id];
    }
}

createContextMenus();


function setBadgeNumber(tab, count) {
    if (checkEnable(tab.url)) {
        if (count > 999) {
            setBadgeText(tab, '99+');
        } else if (count == 0) {
            setBadgeText(tab, '');
        } else {
            setBadgeText(tab, String(count));
        }
    }
}

function setBadgeText(tab, text) {
    chrome.browserAction.setBadgeText({
        text: text,
        'tabId': tab.id
    });
}

function checkEnable(url) {
    for (idx in urls) {
        if (url.indexOf(urls[idx]) > 0) {
            return true;
        }
    }
    return false;
}

function checkTabIsEnable() {
    if (!currentTab || !currentTab.url) {
        return false;
    }
    var url = currentTab.url;
    return checkEnable(url);

}

function enableButtonIfNoneText(tab) {
    chrome.browserAction.getBadgeText({ "tabId": tab.id }, function(text) {
        log.debug("enableButtonIfNoneText : " + text);
        if (text == '') {
            enableButton(tab);
            setBadgeText(tab, getDefaultText(tab));
        }
    });
}

function enableButton(tab) {
    chrome.browserAction.enable(tab.id);
}

function disableButton(tab) {
    chrome.browserAction.disable(tab.id);
}

function getDefaultText(tab) {
    var url = tab.url;
    // Goole plus
    if (url.indexOf(urls[0]) > -1) {
        return "Plus";
    } else if (isConnect(url)) {
        return "Con.";
    } else {
        return "Like";
    }
}

function isFacebook(tab) {
    if (!tab || !tab.url) {
        return false;
    }
    var url = tab.url;
    if (url.indexOf(urls[1]) > 1) {
        return true;
    }
    return false;
}

function isConnect(currentUrl) {
    var urls = ["https://www.linkedin.com/vsearch/", "https://www.linkedin.com/mynetwork/"];
    var url = urls.find(link => currentUrl.indexOf(link) > -1);
    return url != undefined;
}

function likeYoutubeVideo(url) {
    chrome.storage.sync.get({
        "youtube_like": false
    }, function(cfgData) {
        log.debug(cfgData);
        if (cfgData['youtube_like']) {
            if (url.indexOf(youtubeURL) > -1) {
                log.debug("You are in youtube watch page");
                try {
                    executeScripts(null, [
                        { file: "libs/jquery.js" },
                        { file: "scripts/utils.js" },
                        { file: "scripts/youtube.js" }
                    ]);
                } catch (e) {
                    console.log(' Exception on chrome.browserAction.onClicked');
                }
            } else {
                log.debug("You are in youtube, but not waching page");
            }
        }
    });
}

function setStorageNumber(key, number, callback) {
    var object = {};
    object[key] = number;
    chrome.storage.sync.set(object, function() {
        if (callback) {
            callback();
        }
    });
}

function getStorageNumber(key, callback) {
    var object = {};
    object[key] = 0;
    chrome.storage.sync.get(object, function(item) {
        if (callback) {
            callback(item[key]);
        } else {
            console.log("You can't get value without callback.")
        }
    });
}

function executeScripts(tabId, injectDetailsArray) {
    function createCallback(tabId, injectDetails, innerCallback) {
        return function() {
            chrome.tabs.executeScript(tabId, injectDetails, innerCallback);
        };
    }

    var callback = null;

    for (var i = injectDetailsArray.length - 1; i >= 0; --i)
        callback = createCallback(tabId, injectDetailsArray[i], callback);

    if (callback !== null)
        callback(); // execute outermost function
}

function updateNumberOfUsed() {
    var countNumberFieldName = "count_number";
    getStorageNumber(countNumberFieldName, function(numberOfUsed) {
        var times = Number(numberOfUsed);
        times++;
        setStorageNumber(countNumberFieldName, times);
    });
}

function openOptionPage() {
    chrome.tabs.create({
        url: "options.html"
    });
}

getStorageSync({
    'google_analytic': true,
    'allow-auto-like': false,
    'auto-like-time': 5
}, function(object) {
    log.debug("get system storage : ", object);
    registerGoogleAnalytic(object['google_analytic']);
    handleIntervalTask(object['allow-auto-like'], object['auto-like-time']);
});

//registerGoogleAnalytic('true');

function registerGoogleAnalytic(isAllow) {
    log.debug("isAllowGoogleAnalytic : ", isAllow);
    if (isAllow) {
        _gaq = _gaq || [];
        _gaq.push(['_setAccount', 'UA-83786826-2']);
        _gaq.push(['_trackPageview']);

        var ga = document.createElement('script');
        ga.type = 'text/javascript';
        ga.async = true;
        // ga.src = 'https://ssl.google-analytics.com/u/ga_debug.js';
        ga.src = 'https://ssl.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(ga, s);
    }
}

function handleIntervalTask(isEnable, intervalTime) {
    var intervalMinute = Number(intervalTime);
    var intervalTimeInSeconds = intervalMinute * 1000 * 60;
    var IntervalTask;
    log.debug("Interval time in second is set : "+ intervalTimeInSeconds);
    if (isEnable && !IntervalTask) {
        IntervalTask = setInterval(function() {
            log.debug("IntervalTask Execute after " + intervalTimeInSeconds + " seconds.");
            executeScripts(null, [
                { file: "libs/jquery.js" },
                { file: "scripts/supported-url-utils.js" },
                { file: "scripts/utils.js" },
                { file: "scripts/content_script.js" },
                { file: "scripts/on-interval-execute.js" }
            ]);
        }, intervalTimeInSeconds);
    } else {
        if (!isEnable) {
            clearInterval(IntervalTask);
        }
    }
}

function trackButton(id) {
    getStorageSync({
        'google_analytic': true
    }, function(obj) {
        if (obj['google_analytic'] && _gaq) {
            _gaq.push(['_trackEvent', id, 'clicked']);
        }
    });
};