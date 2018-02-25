var urls = ['plus.google.com',
    '.facebook.com',
    'twitter.com',
    'instagram.com',
    'linkedin.com',
    'tumblr.com',
    'incomeon.com',
    'youtube.com',
    'reddit.com'
];

function isSupport(url) {
    for (idx in urls) {
        if (url.indexOf(urls[idx]) > 0) {
            return true;
        }
    }
    return false;
}