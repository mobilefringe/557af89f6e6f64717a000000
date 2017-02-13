$(document).ready(function(){
    var iframeURL = window.location.search.match(/\?mappedin\=(.*)/)[1];
    
    // Update the iframe url.
    updateIframeURL(iframeURL);
    
    function updateIframeURL(url) {
        
        if (!isValidMappedInURL(url)) {
            alert("This does not appear to be whitelisted url.");
        }
        
        $('.')
    }
    
    function isValidMappedInURL(url) {
        // Validate iframe URL to prevet xss attacks
        
        
    }
    
});