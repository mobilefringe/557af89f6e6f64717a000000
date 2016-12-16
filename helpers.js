function init(e){
    
    $('<div class="modal-backdrop custom_backdrop"><img src="http://kodekloud.s3.amazonaws.com/sites/554a79236e6f64713f000000/69e8cd982124dc73de1f5a67a627ee75/loading.gif" class="" alt=""></div>').appendTo(document.body);
    $('#open_search').click(function(e){
        $('#open_search').hide();
        $('#close_search').css('display','inline-block');
        $('#search_input').show();
        $('#search_input').focus();
        e.preventDefault();
    });
    $('#close_search').click(function(e){
        $('#close_search').hide();
        $('#open_search').css('display','inline-block');
        $('#search_input').hide();
        $('.search-results').hide();
        $('#search_input').val('');
        e.preventDefault();
    });
    $('#search_mobile').click(function(e){
        $('#mobile_search').show();
        $('.social_icon_mobile').hide();
        $('#m_search').hide();
        $('#m_search_close').show();
        $('#mobile_search_box').focus();
        e.preventDefault();
    });
    
    $('#close_search_mobile').click(function(e){
        $('#mobile_search').hide();
        $('.social_icon_mobile').show();
        $('#m_search').show();
        $('#m_search_close').hide();
        e.preventDefault();
    });
    
    $('#mobile_search_form').submit(function(e){
        e.preventDefault();
        window.location.href = "/search?query=" + $('#mobile_search_box').val();
    });
    
    $('.alpha_list a').click(function(e){  
        $('html, body').stop().animate({scrollTop: $( $(this).attr('href') ).offset().top - 60}, 800);
        e.preventDefault();
    });
    $(window).scroll(function(e){
		if ($(this).scrollTop() > 100) {
			$('.scrollToTop').fadeIn();
		} else {
			$('.scrollToTop').fadeOut();
		}
	});
	
	//Click event to scroll to top
	$('.scrollToTop').click(function(e){
		$('html, body').animate({scrollTop : 0},800);
		e.preventDefault();
	});
    
    $('#search_input').keyup(function(e){
        showSearchResults();
    });
    
    $('#search_input').on('input', function() {
        showSearchResults();
    });
    
    $('.close-search').click(function(){
    $('#search_results').hide();
    
    
});
        
$('#mobile_search_box').on('input', function() {
    $('#search_results_mobile').show();
    if($('#mobile_search_box').val().length == 0){
        var search_results = getSearchResults('xxxxxxxxxxxxxxxx',0,0);
        renderSearchResultsTemplate('#search_results_mobile_container','#search_results_mobile_template',search_results);
        $('#search_results_mobile').hide();
    }else{
        var search_results = getSearchResults($('#mobile_search_box').val(),99,100);
        $('.search-results-count').html(search_results.summary.count);
        //console.log('--------');
        renderSearchResultsTemplate('#search_results_mobile_container','#search_results_mobile_template',search_results);
        //console.log(getSearchResults($('#search_input').val(),100));
    }
});
            
$('.close-search-mobile').click(function(){
    var search_results = getSearchResults('xxxxxxxxxxxxxxxx',0,0);
    renderSearchResultsTemplate('#search_results_mobile_container','#search_results_mobile_template',search_results);
    $('#mobile_search_box').val('');
});
}


function show_content(){
    $('.yield').fadeIn();
    $(".modal-backdrop").remove();
    $.get('//stc.mallmaverick.com/is_chat_available', function(data){
        if (data.status == false){
            $('.chat_link').hide()
            $('.chat_banner').hide()
        }
    })
    
}

function pinIt(){
    var e = document.createElement('script');
    e.setAttribute('type','text/javascript');
    e.setAttribute('charset','UTF-8');
    e.setAttribute('src','https://assets.pinterest.com/js/pinmarklet.js?r='+Math.random()*99999999);
    document.body.appendChild(e);
    return false;
}

function check_open_time(d, close){
    var time = "";
    var date = moment();
    var current_time = moment().format("h:mm A");
    var open = getTodaysHours().open_time;
    var close = getTodaysHours().close_time;
    if (current_time >= open && current_time < close){
        time = "OPEN NOW";
    }
    else{
        time = convert_hour(d);
    }
    return time;
}

function more_less(e){
    $('.more').click(function(e){
        var id = $(this).attr('data-id');
        $(this).hide();
        $('#show_' + id).show();
        $('#less_' + id).show();
        e.preventDefault();
    });
    
    $('.less').click(function(e){
        var id = $(this).attr('data-id');
        $(this).hide();
        $('#show_' + id).hide();
        $('#more_' + id).show();
        e.preventDefault();
    });
}


// function convert_hour(d){
//     var h = addZero(d.getUTCHours());
//     var m = addZero(d.getUTCMinutes());
//     var s = addZero(d.getUTCSeconds());
//     if (h >= 12) {
//         if ( h != 12) {
//             h = h - 12;    
//         }
        
//         i = "PM"
//     } else {
//         i = "AM"
//     }
//     return h+":"+m+" "+i;
// }



function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function get_month (id){
    var month = ""
    switch(id) {
        case 0:
            month = "Jan";
            break;
        case 1:
            month = "Feb";
            break;
        case 2:
            month = "Mar";
            break;
        case 3:
            month = "Apr";
            break;
        case 4:
            month = "May";
            break;
        case 5:
            month = "June";
            break;
        case 6:
            month = "July";
            break;
        case 7:
            month = "Aug";
            break;
        case 8:
            month = "Sep";
            break;
        case 9:
            month = "Oct";
            break;
        case 10:
            month = "Nov";
            break;
        case 11:
            month = "Dec";
            break;
            
    }
    return month;
}


function randomgen() {
    var rannumber='';
    for(ranNum=1; ranNum<=6; ranNum++){
        rannumber+=Math.floor(Math.random()*10).toString();
    }
    $('#verifyNum').html(rannumber);
    $('#verifyNumHidden').val(rannumber);
}

function validateEmail($email) {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    if( !emailReg.test( $email ) ) {
        return false;
    }
    else {
        return true;
    }
}

function load_more(num){
    var n = parseInt(num);
    for(i=n; i < n+5; i++){
        
        var id = i.toString();
        $('#show_' + id ).fadeIn();
    }
    if(i >= getAllPublishedPosts().length+1){
        $('#loaded_posts').hide();
        $('#all_loaded').show();
    }
    $('#num_loaded').val(i);
}

function load_more_2(num, l){
    var n = parseInt(num);
    for(i=n; i < n+2; i++){
        
        var id = i.toString();
        $('#show_' + id ).fadeIn();
    }
    if(i >= l+1){
        $('#loaded_posts').hide();
        $('#all_loaded').show();
    }
    $('#num_loaded').val(i);
}




            
            
function showSearchResults(){
    $('#search_results').show();
    if($('#search_input').val().length == 0){
        $('#search_results').hide();
    }else{
        var search_results = getSearchResults($('#search_input').val(),99,100);
        $('.search-results-count').html("Total Results : "+search_results.summary.count);
        renderSearchResultsTemplate('#search_results_template','#search_results_items',search_results);
        if (search_results["stores"]){
            if (search_results["stores"].length > 0){
                $("#store_results_header").html(search_results["stores"].length+" Stores <i id='store_arrow' class='fa fa-chevron-right pull-right'></i>") ;
                $("#store_results_header").show();
            }
            
        } else {
            $("#store_results_header").hide();
        }
        if (search_results["promotions"]){
            if (search_results["promotions"].length > 0){
                $("#promotions_results_header").html(search_results["promotions"].length+" Promotions <i id='promo_arrow' class='fa fa-chevron-right pull-right'></i>")    ;
                $("#promotions_results_header").show();
            }
            
        } else {
            $("#promotions_results_header").hide();
        }
        if (search_results["events"]){
            if (search_results["events"].length > 0) {
                $("#events_results_header").html(search_results["events"].length+" Events <i id='event_arrow' class='fa fa-chevron-right pull-right'></i>")
                $("#events_results_header").show();
            }
            
        } else {
            $("#events_results_header").hide();
        }
    }
}
        


function show_results(id){
    if ( $("#"+id+"_results").is(":visible")){
        $("#"+id+"_results").slideUp();
        $("#"+id+"_arrow").removeClass("fa-chevron-down", 1000);
        $("#"+id+"_arrow").addClass("fa-chevron-right", 1000);
    } else {
        $(".results_div").slideUp();
        $(".fa").removeClass("fa-chevron-down", 1000);
        $(".fa").addClass("fa-chevron-right", 1000);
        $("#"+id+"_results").slideDown();   
        $("#"+id+"_arrow").removeClass("fa-chevron-right", 1000);
        $("#"+id+"_arrow").addClass("fa-chevron-down", 1000);
    }
}

function pinIt(){
    var e = document.createElement('script');
    e.setAttribute('type','text/javascript');
    e.setAttribute('charset','UTF-8');
    e.setAttribute('src','https://assets.pinterest.com/js/pinmarklet.js?r='+Math.random()*99999999);
    document.body.appendChild(e);
    return false;
}

function show_pages(id){
    if ($("#pages_"+id+"_stores").is(":visible")){
        $("#pages_"+id+"_stores").slideUp();
    } else {
        $("#pages_"+id+"_stores").slideDown();
    }
}

function isIE () {
  var myNav = navigator.userAgent.toLowerCase();
  return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
}

