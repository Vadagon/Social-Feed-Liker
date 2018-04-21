/*
 * Global logging trigger.
 * Logging a message via `LOG && log.v('x');` allows minification
 * tools to omit logging lines altogether when LOG is false.
 */
var DEBUG = false;
var CLICK_BUTTON = true;
var log = {};

var Utils = {
    fireEvent: fireEvent,
    sendNumberToActionButton: sendNumberToActionButton,
    removeRunningBackgroundColor: removeRunningBackgroundColor,
    addRunningBackgroundColor: addRunningBackgroundColor,
    getRandom: getRandom,
    loadMoreByElement: loadMoreByElement,
    loadMoreByScroll: loadMoreByScroll,
    clickOnButton: clickOnButton,
    clickButtonListOneByOne: clickButtonListOneByOne,
    clickButtonListOneByOneWithCloseWarning: clickButtonListOneByOneWithCloseWarning,
    clickOnElementAndWait: clickOnElementAndWait,
    clickOnElementTill: clickOnElementTill
};

log.ASSERT = 1;
log.ERROR = 2;
log.WARN = 3;
log.INFO = 4;
log.DEBUG = 5;
log.VERBOSE = 6;

log.setLevel = function(level) {
    if (level >= log.ASSERT) {
        log.assert = console.assert.bind(window.console);
    } else {
        log.assert = function() {}
    }
    if (level >= log.ERROR) {
        log.error = console.error.bind(window.console);
    } else {
        log.error = function() {}
    }
    if (level >= log.WARN) {
        log.warn = console.warn.bind(window.console);
    } else {
        log.warn = function() {}
    }
    if (level >= log.INFO) {
        log.info = console.info.bind(window.console);
    } else {
        log.info = function() {}
    }
    if (level >= log.DEBUG) {
        log.debug = console.debug.bind(window.console);
    } else {
        log.debug = function() {}
    }
    if (level >= log.VERBOSE) {
        log.verbose = console.log.bind(window.console);
    } else {
        log.verbose = function() {}
    }
    log.level = level;
};
if (DEBUG) {
    log.setLevel(log.DEBUG);
} else {
    log.setLevel(log.ASSERT);
}

function clickOnButton(button, time, number, additionalTask) {
    var d = $.Deferred();
    // debugger;	
    if (isVisbile(button)) {
        var rand = getRandom(1, 1000);
        setTimeout(function() {
            executeFunction(additionalTask);
            // The root of everything
            number++;
            log.debug("button clicked : " + number);
            if (CLICK_BUTTON) {
                button.click();
            }
            sendNumberToActionButton(number);
            d.resolve(number);
        }, time + rand);
    } else {
        log.debug("Button is invisible : ", button);
        d.resolve(number);
    }
    return d.promise();
}

function executeFunction(varFunc) {
    if (typeof varFunc === "function") {
        varFunc();
    }
}

function clickButtonListOneByOne(buttons, time, number, taskAfterButtonClick) {
    var d = $.Deferred();
    var promise = d.promise();
    $.each(buttons, function(index, button) {
        promise = promise.then(function(number) {
            number = number === undefined ? 0 : number;
            return clickOnButton(button, time, number, taskAfterButtonClick);
        });
    });
    d.resolve();
    return promise;
}

function clickButtonListOneByOneWithCloseWarning(buttons, time, number, warningButtonSelector) {
    var d = $.Deferred();
    var promise = d.promise();
    $.each(buttons, function(index, button) {
        promise = promise.then(function(number) {
            number = number === undefined ? 0 : number;
            clickOnElementAndWait(warningButtonSelector);
            return clickOnButton(button, time, number);
        });
    });
    d.resolve();
    return promise;
}
/*
 * This method click on cssSelector till expected times.
 */
function loadMoreByElement(cssSelector, expected) {
    var d = $.Deferred();
    return clickOnElementTill(cssSelector, d, 1, expected);
}
/*
Function scroll by given selector, 
support scroll by javascript not default browser scroll.
*/
function loadMoreByScroll(cssSelector, expected) {
    var d = $.Deferred();
    return scrollWrapper(cssSelector, d, 1, expected);
}

function clickOnXpathButtonTill(buttonXpath, time, expected) {
    var d = $.Deferred();
    return clickOnXpathButtonRecursive(buttonXpath, d, time, 1, expected);
}

function clickOnElementTill(cssSelector, d, times, expected) {
    if (expected != 0 && times == expected) {
        d.resolve();
        return d.promise();
    }
    log.debug("Load more by element  " + times);
    clickOnElementAndWait(cssSelector).then(function(resolve) {
        times++;
        clickOnElementTill(cssSelector, d, times, expected);
    }, function(reason) {
        d.resolve();
    });
    return d.promise();
}

function clickOnElementAndWait(cssSelector) {
    var d = $.Deferred();
    var elementObject = $(cssSelector).get(0);
    var rand = getRandom(1, 1000);
    if (elementObject) {
        setTimeout(function() {
            elementObject.click();
        }, 1000 + rand);

        setTimeout(function() {
            log.debug("clickOnElementAndWait - just keep going.");
            d.resolve();
        }, 5000 + rand);
    } else {
        log.debug("clickOnElementAndWait - no more button to click.");
        d.reject();
    }
    return d.promise();
}

function scrollWrapper(cssSelector, d, times, expected) {
    if (!times) {
        if (expected == 5) {
            d.resolve();
            return d.promise();
        }
    } else if (times == expected) {
        d.resolve();
        return d.promise();
    }
    times++;
    scrollToBottom(cssSelector).then(function(resolve) {
        log.debug("Load more by scroll  " + times);
        scrollWrapper(cssSelector, d, times, expected);
    });
    return d.promise();
}

function clickOnXpathButtonRecursive(cssSelector, d, time, counter, expected) {
    if (counter == expected) {
        d.resolve();
        return d.promise();
    }
    var button = $(cssSelector)[0];
    if (button) {
        clickOnButton(button, time, counter).then(function(counter) {
            clickOnXpathButtonRecursive(cssSelector, d, time, counter, expected);
        });
    } else {
        d.resolve();
    }
    return d.promise();
}

function scrollToBottom(cssSelector) {
    var d = $.Deferred();
    if (cssSelector) {
        var element = $(cssSelector).get(0);
        element.scrollTop = element.scrollHeight - element.clientHeight;
    } else {
        window.scrollTo(0, document.body.scrollHeight);
    }
    window.setTimeout(function() {
        d.resolve();
    }, 4000 + getRandom(1, 1000));
    return d.promise();
}

function loadMoreByScrollWithSelectorCondition(scrollSelector, selectorCondition) {
    var d = $.Deferred();
    return scrollToBottomConditionWrapper(scrollSelector, d, 1, selectorCondition);
}

function scrollToBottomConditionWrapper(scrollbarSelector, d, times, conditionSelector) {
    if (times == 50) {
        log.debug("Stop scrollToBottomConditionWrapper, cause it reach the maximum.");
        d.resolve();
        return d.promise();
    }
    log.debug("Load more by scroll  " + times);
    times++;
    scrollToBottomCondition(scrollbarSelector, conditionSelector).then(function(resolve) {
        scrollToBottomConditionWrapper(scrollbarSelector, d, times, conditionSelector);
    }, function(reject) {
        d.resolve();
    });
    return d.promise();
}

/*
 * This medthod for scrolling util find nothing more of conditionSelector
 * Example:
 * scrollbarSelector = button container
 * conditionSelector = button
 * The method will stop if it find no more button after scroll.
 */
function scrollToBottomCondition(scrollbarSelector, conditionSelector) {
    var d = $.Deferred();
    var currentElements = $(conditionSelector);
    if (scrollbarSelector) {
        var element = getFirstElement(scrollbarSelector);
        if (!element) {
            d.reject();
        } else {
            element.scrollTop = element.scrollHeight - element.clientHeight;
        }
    } else {
        window.scrollTo(0, document.body.scrollHeight);
    }
    window.setTimeout(function() {
        var elementsAfterScroll = $(conditionSelector);
        if (elementsAfterScroll.length > currentElements.length) {
            log.debug("Number of element increase from " + currentElements.length + " to " + elementsAfterScroll.length);
            d.resolve();
        } else {
            log.debug("Number of element not change, Stop scroll");
            d.reject();
        }
    }, 4000 + getRandom(1, 1000));
    return d.promise();
}

function getRandom(min, max) {
    return Math.floor(Math.random() * max) + min;
}

function openPage(url) {
    var d = $.Deferred();
    window.location.href = url;
    window.setTimeout(function() {
        d.resolve();
    }, 4000 + getRandom(1, 1000));
    return d.promise();
}

function waitForElementToDisplay(selector) {
    var d = $.Deferred();
    waitForElementToDisplayPromise(selector, d).then(function(response) {
        d.resolve();
    });
    return d.promise();
}

function waitForElementToDisplayPromise(selector, d) {
    if ($('form[action*="ajax/pages/invite/"]').is(":visible")) {
        log.debug("Finished waiting for selector appear : " + selector);
        d.resolve();
        return d.promise();
    } else {
        setTimeout(function() {
            log.debug("Waiting for selector appear : " + selector);
            waitForElementToDisplayPromise(selector, d);
        }, 500);
    }
    return d.promise();
}

function getFullUrl() {
    return window.location.href;
}

function sendNumberToActionButton(number) {
    if (!chrome.runtime) {
        return;
    }
    chrome.runtime.sendMessage({ count: number }, function(response) {
        //console.log(response);
    });
}

function checkLinkInLinks(link, links) {
    var len = links.length;
    for (var i = 0; i < len; i++) {
        if (link.indexOf(links[i]) > -1) {
            return true;
        }
    }
    return false;
}

function xPath(xpth) {
    var jpgLinks = document.evaluate(
        xpth,
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
    );
    var numLinks = jpgLinks.snapshotLength;
    var result = [];
    for (var J = 0; J < numLinks; ++J) {
        var thisLink = jpgLinks.snapshotItem(J);
        result.push(thisLink);
    }
    return result;
}

function getFirstElement(cssSelector) {
    var elements = $(cssSelector).filter(function(index) {
        return $(this).is(":visible");
    });
    return elements.get(0);
}

function getAllVisible(elements) {
    var visibleElements = elements.filter(function(index) {
        return isVisbile(this);
    });
    return visibleElements;
}

function isVisbile(element) {
    return $(element).is(":visible");
}

function sendAnalytic(buttonId) {
    chrome.runtime.sendMessage({
        isAnalytic: true,
        buttonId: buttonId
    }, function(response) {
        //console.log(response);
    });
}

function setStorageSync(object, callback) {
    if (!object || !(object instanceof Object)) {
        console.log("Incorrect object key");
        callback(null);
        return;
    }
    chrome.storage.sync.set(object, function() {
        callback(true);
    });
}

function getStorageSync(object, callback) {
    if (!object || !(object instanceof Object)) {
        console.log("Incorrect object key");
        callback(null);
        return;
    }
    chrome.storage.sync.get(object, function(storagedObject) {
        callback(storagedObject);
    });
}

function addRunningBackgroundColor() {
    var bodyElement = $('body');
    if (!bodyElement.hasClass('like-all-plus-all-running')) {
        bodyElement.addClass('like-all-plus-all-running');
    }
}

function removeRunningBackgroundColor() {
    setTimeout(function() {
        var bodyElement = $('body');
        bodyElement.removeClass('like-all-plus-all-running');
    }, 3000);

}

function fireEvent(node, eventName) {
    log.debug("content_script - fireEvent - "+ eventName);
    // Make sure we use the ownerDocument from the provided node to avoid cross-window problems
    var doc;
    if (node.ownerDocument) {
        doc = node.ownerDocument;
    } else if (node.nodeType == 9) {
        // the node may be the document itself, nodeType 9 = DOCUMENT_NODE
        doc = node;
    } else {
        throw new Error("Invalid node passed to fireEvent: " + node.id);
    }

    if (node.dispatchEvent) {
        // Gecko-style approach (now the standard) takes more work
        var eventClass = "";

        // Different events have different event classes.
        // If this switch statement can't map an eventName to an eventClass,
        // the event firing is going to fail.
        switch (eventName) {
            case "click": // Dispatching of 'click' appears to not work correctly in Safari. Use 'mousedown' or 'mouseup' instead.
            case "mousedown":
            case "mouseup":
            case "mouseover":
            case "mouseout":
            case "mouseleave":
                eventClass = "MouseEvents";
                break;

            case "focus":
            case "change":
            case "blur":
            case "select":
                eventClass = "HTMLEvents";
                break;

            default:
                throw "fireEvent: Couldn't find an event class for event '" + eventName + "'.";
        }
        var event = doc.createEvent(eventClass);

        var bubbles = eventName == "change" ? false : true;
        event.initEvent(eventName, bubbles, true); // All events created as bubbling and cancelable.

        event.synthetic = true; // allow detection of synthetic events
        // The second parameter says go ahead with the default action
        node.dispatchEvent(event, true);
    } else if (node.fireEvent) {
        // IE-old school style
        var event = doc.createEventObject();
        event.synthetic = true; // allow detection of synthetic events
        node.fireEvent("on" + eventName, event);
    }
}