module.exports = { 
    'secret': '',
    'database': 'mongodb://localhost:27017/steamboat', // This needs to match
    'port': 3069,
    'onlyListenLocal': true,
    'trustProxyDepth': 1, // How many levels of proxy to trust for IP
    'sitePrefix': '',
    'oauth': {
        // OAuth is required in this instance.
        'discord': {
            'clientID': '',
            'clientSecret': ''
        }
    }
}