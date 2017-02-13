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
    
    function isValidMappedInURL(url) {
        // Validate iframe URL to prevet xss attacks
        
        
        return true;        
    }
});