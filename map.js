$(document).ready(function(){
    var urlWhiteList = ['stc-web.mappedin.com'];
    
    var iframeURL = window.location.search.match(/\?mappedin\=(.*)/)[1];
    
    // Update the iframe url.
    updateIframeURL(iframeURL);
    
    function updateIframeURL(url) {
        
        if (!isValidMappedInURL(url)) {
            alert("This does not appear to be whitelisted url.");
        }
        
        $('#mappedIn').attr('src', url);
    }
    
    /**
     * Validates URL to prevent non mappedIn urls.
     * @param String URL
     * @return bool true if valid url false if not.
     */
    function isValidMappedInURL(url) {
        var url = decodeURI(url) ;
        var parser = document.createElement('a');
        parser.href = url;
        
        return urlWhiteList.indexOf(parser.hostname) !== -1;
    }
});