var timer, button, likes = 0;
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    for (var i in request.buttons) {
        if (window.location.hostname.indexOf(i) > -1) {
            button = request.buttons[i];
            break;
        }
    }
    console.log(button)
    if (request.params.task == 'count') {
        if (window.location.hostname.indexOf('instagram') != -1) {
            sendResponse({ count: likes });
            chrome.runtime.sendMessage({count: likes})
        } else {
            sendResponse({ count: $(button).length });
            chrome.runtime.sendMessage({count: $(button).length})
        }
    }else{
    	chrome.runtime.sendMessage({count: ''})
    }
    if (request.params.task == 'start') {
        $('html, body').scrollTop(0)
        var cont = 0;
        var pase = 0;
        (function foo() {
        	chrome.runtime.sendMessage({count: request.params.estimated - cont})
            clearTimeout(timer)
            timer = setTimeout(function() {
                cont++
                pase++


                function goNext() {
                    if (pase >= request.params.pause - 1 && cont < request.params.estimated) {
                        pase = 0;
                        setTimeout(function() {
                            foo()
                        }, request.params.resume * 1000);
                    } else if (cont < request.params.estimated) {
                        foo()
                    }
                }



                if (window.location.hostname.indexOf('facebook') != -1) {


                    // Facebook only
                    if (simulateMouseover($(button + ':not([alreadyClickedByExtension=true])').eq(0).attr("alreadyClickedByExtension", 'true')[0])) {
                        setTimeout(function() {
                            var latestTop = 0;
                            var latestEl;
                            $('._1oxj.uiLayer').each(function() {
                                if (latestTop < $(this).position().top)
                                    latestEl = $(this)
                            })
                            if (latestEl) {
                                latestEl.find('[aria-label=Love]').click()
                            }
                        }, (request.params.interval / 3) * 1000);
                    }

                    if (cont == 1) {
                        var interval = setInterval(function() {
                            if ($('._1oxj.uiLayer').length) {
                                goNext()
                            	clearInterval(interval)
                            }
                        }, 10);
                    } else {
                        goNext()
                    }


                } else if (window.location.hostname.indexOf('instagram') != -1) {


                	// Instagram only
                    var scrollNow = $('html, body').scrollTop()
                    $(button).each(function() {
                        if ($(this).offset().top > scrollNow + 50) {
                            $('html, body').scrollTop($(this).offset().top + 200)
                            $(this).click()
                            return false
                        }
                    })


                    goNext()



                } else {


                    // All else
                    $(button + ':not([alreadyClickedByExtension=true])').eq(0).attr("alreadyClickedByExtension", 'true').click()
                    goNext()

                }
            }, request.params.interval * 1000);
        })()
    }
})
if (window.location.hostname.indexOf('instagram') != -1) {
    var maxHeight = 0;
    setInterval(function() {
        if ($('main > section > div > div > div > article').offset().top > maxHeight) {
            maxHeight = ($('main > section > div > div > div > article').offset().top)
            likes++
        }
    }, 1);
}




// Simulate mouseover

function simulateMouseover(el) {
    var event = new MouseEvent('mouseover', {
        'view': window,
        'bubbles': true,
        'cancelable': true
    });
    // var myTarget = document.querySelector("#u_fetchstream_2_o > div._sa_._gsd._fgm._5vsi._192z > div > div > div > div > div > div > span:nth-child(1) > div > a");
    var canceled = !el.dispatchEvent(event);
    if (canceled) {
        // A handler called preventDefault.
        console.log("canceled");
        return false;
    } else {
        // None of the handlers called preventDefault.
        console.log("not canceled");
        return true;
    }
}