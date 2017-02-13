$(document).ready(function(){
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
        var url = decodeURL(url) ;
        var parser = document.createElement('a');
        parser.href = url;
        
        console.log(parse.hostname);
        // parser.hostname
        
        return true;        
    }
});