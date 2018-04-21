var timer, button, likes = 0, IGOffsets = [], activated = !1;
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    for (var i in request.buttons) {
        if (window.location.hostname.indexOf(i) > -1) {
            button = request.buttons[i];
            break;
        }
    }
    // console.log(button)
    if (request.params.task == 'count') {
        if (window.location.hostname.indexOf('instagram') != -1) {
            sendResponse({ count: likes });
            if(!activated)
                chrome.runtime.sendMessage({count: likes})
        } else {
            sendResponse({ count: $(button).length });
            if(!activated){
                chrome.runtime.sendMessage({count: $(button).length})
            }
        }
    }

    if (request.params.task == 'start') {
        $('html, body').scrollTop(0)
        var cont = 0;
        activated = !0;
        var pase = 0;
        (function foo() {
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
                    simulateMouseover($(button).eq(0).attr("alreadyClickedByExtension", 'true')[0])

                    var interval = setInterval(function() {
                        if ($('._1oxj.uiLayer [aria-label=Love]:not([alreadyClickedByExtension=true]').length) {
                            $('._1oxj.uiLayer [aria-label=Love]:not([alreadyClickedByExtension=true]').attr("alreadyClickedByExtension", 'true').click()
                            console.log('clicking')
                            chrome.runtime.sendMessage({count: request.params.estimated - cont})
                            goNext()
                            setTimeout(function() {
                        	   clearInterval(interval)
                            }, request.params.interval / 3);
                        }
                    }, 80);


                } else if (window.location.hostname.indexOf('instagram') != -1) {


                	// Instagram only
                    $('html, body').scrollTop(IGOffsets[IGOffsets.length-likes] - 200)
                    setTimeout(function() {
                        var toClick = $(button).eq(0);
                        $(button).each(function(){
                            if($(this).offset().top >= IGOffsets[IGOffsets.length-likes] - 100 && $(this).offset().top <= IGOffsets[IGOffsets.length-likes] + 100){
                                toClick = $(this)
                                return false;
                            }
                        })
                        if(toClick.length){
                            $('html, body').scrollTop(toClick.offset().top - 200)
                            toClick.click()
                        }
                        chrome.runtime.sendMessage({count: request.params.estimated - cont})
                        likes--;
                    }, (request.params.interval / 3) * 1000);
 


                    goNext()



                } else {


                    // All else
                    $(button + ':not([alreadyClickedByExtension=true])').eq(0).attr("alreadyClickedByExtension", 'true').click()
                    chrome.runtime.sendMessage({count: request.params.estimated - cont})
                    goNext()

                }
            }, request.params.interval * 1000);
        })()
    }
})
if (window.location.hostname.indexOf('instagram') != -1) {
    setInterval(function() {
        $('main > section > div > div > div > article').each(function(){
// if($(this).offset().top >= IGOffsets[IGOffsets.length-likes] - 100 && $(this).offset().top <= IGOffsets[IGOffsets.length-likes] + 100){
            var valid = !0;
            for (var i = IGOffsets.length - 1; i >= 0; i--) {
                if($(this).offset().top >= IGOffsets[i] - 100 && $(this).offset().top <= IGOffsets[i] + 100){
                    valid = !1;
                    break;
                }
            }
            if(valid && $(this).find('.coreSpriteHeartOpen').length){
                IGOffsets.push($(this).offset().top)
                console.log(IGOffsets)
                likes++
            }
            
        });
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