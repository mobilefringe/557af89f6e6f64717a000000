/*Created 2015-06-12  by Rajbir Karan Singh*/

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
    
    $('#mobile_search').submit(function(e){
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
    
    if ($('#instafeed').length > 0) {
        var feed = new Instafeed({
            get: 'user',
            userId: '1285623815',
            clientId: 'da5cf03899eb49a496424d9a76bafa0d',
            template: '<a class="ig-image" target=_blank href="{{link}}" title="{{caption}}" ><img src="{{image}}" /></a>',
            limit : 10

        });
    
        feed.run();
    }
}

function init_home_hours(){
    var hours = getPropertyHours();
    var d = new Date();
    var n = d.getDay();
    var hours_today = [];
    $.each(hours, function(key, val){
        if (val.day_of_week == n && val.is_closed == false && val.is_holiday == false){
            hours_today.push(val);
        } 
    });
    var item_list = [];
    var item_rendered = [];
    var template_html = $('#home_hours_template').html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    $.each( hours_today , function( key, val ) {
        var open_time = new Date (val.open_time);
        var close_time = new Date (val.close_time);
        val.open = check_open_time(open_time, close_time);
        val.close = convert_hour(close_time);
        var open_t = convert_hour(open_time)
        console.log(val.close)
        var open = new Date("2001-01-01 " + open_t);
        var open_in_mins = open.getHours()*60 + open.getMinutes()
        var close = new Date("2001-01-01 " + val.close);
        var close_in_mins = close.getHours()*60 + close.getMinutes()
        var time_now_in_mins = d.getHours()*60 + d.getMinutes()
        console.log(open_in_mins)
        console.log(time_now_in_mins)
        if (time_now_in_mins < close_in_mins && time_now_in_mins >= open_in_mins){
        
        }
        else{
            $('.chat_link').hide()
        }
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
        
    });
    $('#home_hours_container').html(item_rendered.join(''));
    
    $.each( getPropertyHours(), function(i,v){
        if(v.is_holiday == true || v.is_closed == true){
            var hours_day = new Date(v.holiday_date + "T05:00:00Z")
            if(hours_day.setHours(0, 0, 0, 0) == d.setHours(0, 0, 0, 0)){
                $('#home_hours_container').text("Closed Today")
                $('.chat_link').hide()
            }
            
        } 
    })
}

function renderStoreList(container, template, collection, type,starter, breaker){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    var store_initial="";
    $.each( collection , function( key, val ) {
        if (type == "stores" || type == "category_stores"){
            if(!val.store_front_url ||  val.store_front_url.indexOf('missing.png') > -1 || val.store_front_url.length === 0){
                val.alt_store_front_url = "http://assets.codecloudapp.com/sites/56056be06e6f641a1d020000/image/png/1446826281000/stc-logo-holiday-360 copy.png";
            } else {
                val.alt_store_front_url = getImageURL(val.store_front_url);    
            }
            
        }
        //var categories = getStoreCategories();
        var current_initial = val.name[0];
        
        if(store_initial.toLowerCase() == current_initial.toLowerCase()){
            val.initial = "";
            val.show = "display:none;";
        }
        else{
            val.initial = current_initial;
            store_initial = current_initial;
            val.show = "display:block;";
        }
        if (val.promotions.length > 0){
            val.promotion_exist = "display:inline-block";
        }
        else{
            val.promotion_exist = "display:none";
        }
        if (val.jobs.length > 0){
            val.job_exist = "display:inline-block";
        }
        else{
            val.job_exist = "display:none";
        }
        val.block = current_initial + '-block';
        var rendered = Mustache.render(template_html,val);
        var upper_current_initial = current_initial.toUpperCase();
        if (upper_current_initial.charCodeAt(0) <= breaker.charCodeAt(0) && upper_current_initial.charCodeAt(0) >= starter.charCodeAt(0)){
            item_rendered.push(rendered);
        }

    });
    
    $(container).show();
    $(container).html(item_rendered.join(''));
}

function renderStoreListCatetories(container, template, category_list,stores){
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future use
    var initial_id = 0;
    var category_index = 0;
    $.each(category_list , function( key, category ) {
        var category_id = parseInt(category.id);
        var category_name = category.name;
        var current_id = category.id;
        var count = 0;
        
        $.each( stores , function( i, store ) {
            var store_category = store.categories;
            var a = store.categories.indexOf(category_id);
            
            if(a > -1){
                if (count == 0){
                    store.show  = "display:block"; 
                }else{
                    store.show  = "display:none"; 
                }
                store.header = category_name;
                store.block = category.id;
                var rendered = Mustache.render(template_html,store);
                item_rendered.push(rendered);
                count += 1;
            }
            
        });
        category_index += 1;
    
    });
    $(container).show();
    $(container).html(item_rendered.join(''));
}
function renderStoreDetails(container, template, collection, slug){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    var prop = getPropertyDetails(getPropertyID());
    var map_url = prop.mm_host + prop.map_url;
    var d = new Date();
    var n = d.getDay();
    var hours = getHoursForIds(collection.store_hours);
    var todays_hours = "";
    $.each( hours , function( key, val ) {
        var open_time = new Date (val.open_time);
        var close_time = new Date (val.close_time);
        val.open_time = convert_hour(open_time);
        val.close_time = convert_hour(close_time);
        if (val.day_of_week == n){
            todays_hours = val.open_time + " - " + val.close_time;
        }
    });
    if (todays_hours.length < 1){
        todays_hours = "display:none";
    }
    Mustache.parse(template_html);   // optional, speeds up future uses
    item_list.push(collection);
    $.each( item_list , function( key, val ) {
        val.map_image = map_url;
        
        if (val.z_coordinate == 1){
            val.level = "Lower Level";
        }
        else if (val.z_coordinate == 2){
            val.level = "Upper Level";
        }
        if ((val.store_front_url).indexOf('missing.png') > -1){
            val.alt_store_front_url = "http://assets.codecloudapp.com/sites/56056be06e6f641a1d020000/image/png/1446826281000/stc-logo-holiday-360 copy.png";
        } else {
            val.alt_store_front_url = getImageURL(val.store_front_url); 
        }
        val.category_list = getCategoriesNamesByStoreSlug(slug);
        val.map_x_coordinate = val.x_coordinate - 19;
        val.map_y_coordinate = val.y_coordinate - 58;
        val.todays_hours = todays_hours;
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    
    $(container).show();
    
    $(container).html(item_rendered.join(''));
}

function renderGeneral(container, template, collection, type){
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future use
    $.each( collection , function( key, val ) {
        if (type == "promos"){
            if ((val.promo_image_url_abs).indexOf('missing.png') > -1){
                if (val.promotionable_type == "Store") {
                    var store_details = getStoreDetailsByID(val.promotionable_id);
                    if ((store_details.store_front_url_abs).indexOf('missing.png') > -1) {
                        val.alt_promo_image_url = "http://assets.codecloudapp.com/sites/56056be06e6f641a1d020000/image/png/1446826281000/stc-logo-holiday-360 copy.png";
                        val.store_image = "http://assets.codecloudapp.com/sites/56056be06e6f641a1d020000/image/png/1446826281000/stc-logo-holiday-360 copy.png";
                    } else {
                        val.alt_promo_image_url = (store_details.store_front_url_abs); 
                        val.store_image = store_details.store_front_url_abs
                    }
                    
                    val.store_name = store_details.name;
                } else {
                    val.alt_promo_image_url = "http://assets.codecloudapp.com/sites/56056be06e6f641a1d020000/image/png/1446826281000/stc-logo-holiday-360 copy.png";
                }
                
            } else {
                val.alt_promo_image_url = (val.promo_image_url_abs);
                if (val.promotionable_type == "Store") {
                    var store_details = getStoreDetailsByID(val.promotionable_id);
                    val.store_detail_btn = store_details.slug;
                    val.store_name = store_details.name;
                    val.store_image = store_details.store_front_url_abs
                }
        
            }
            
            
            start = new Date (val.start_date + "T05:00:00Z");
            end = new Date (val.end_date + "T05:00:00Z");
        
            if (start.toDateString() == end.toDateString()) {
                val.dates = (get_month(start.getMonth()))+" "+(start.getDate());    
            } else {
                val.dates = (get_month(start.getMonth()))+" "+(start.getDate())+" - "+get_month(end.getMonth())+" "+end.getDate();    
            }
            
        }
        if(type == "jobs"){
            val.alt_promo_image_url = (val.promo_image_url_abs);
            if (val.jobable_type == "Store") {
                var store_details = getStoreDetailsByID(val.jobable_id);
                if ((store_details.store_front_url_abs).indexOf('missing.png') > -1) {
                    val.alt_promo_image_url = "http://assets.codecloudapp.com/sites/56056be06e6f641a1d020000/image/png/1446826281000/stc-logo-holiday-360 copy.png"
                } else {
                    val.alt_promo_image_url = (store_details.store_front_url_abs);    
                }
                val.store_name = store_details.name;
                val.store_slug = store_details.slug;
            }
            else{
                val.store_name = "Scarborough Town Centre";
            }
            start = new Date (val.start_date + "T05:00:00Z");
            end = new Date (val.end_date + "T05:00:00Z");
            val.closing_date = (get_month(end.getMonth()))+" "+(end.getDate());  
            if (val.contact_name == ""){
                val.contact_name = "N/A"                
            }
            if (val.contact_email == ""){
                val.contact_email = "N/A"                
            }
        }
        if(type=="events"){
            start = new Date (val.start_date + "T05:00:00Z");
            end = new Date (val.end_date + "T05:00:00Z");
            if (start.toDateString() == end.toDateString()) {
                val.dates = (get_month(start.getMonth()))+" "+(start.getDate());    
            } else {
                val.dates = (get_month(start.getMonth()))+" "+(start.getDate())+" - "+get_month(end.getMonth())+" "+end.getDate();    
            }
            if ((val.event_image_url_abs).indexOf('missing.png') > -1) {
                val.event_image_url_abs = "http://assets.codecloudapp.com/sites/56056be06e6f641a1d020000/image/png/1446826281000/stc-logo-holiday-360 copy.png"
            }
        }
        var rendered = Mustache.render(template_html,val);
         item_rendered.push(rendered);
    });
    $(container).show();
    $(container).html(item_rendered.join(''));
}



function renderStoreExtras(container, template, type, ids){
    var collection = [];
    if (ids.length > 0 && type == "promos") {
        $('#promotion_extra').show();
    }
    if (ids.length > 0 && type == "jobs") {
        $('#employment_extra').show();
    }
    if (type == "promos"){
        collection = getPromotionsForIds(ids);
    }
    else if (type =="jobs"){
        collection = getJobsForIds(ids);
    }
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    $.each( collection , function( key, val ) {
        start = new Date (val.start_date + "T05:00:00Z");
        end = new Date (val.end_date + "T05:00:00Z");
        if (start.toDateString() == end.toDateString()) {
            val.dates = (get_month(start.getMonth()))+" "+(start.getDate());    
        } else {
            val.dates = (get_month(start.getMonth()))+" "+(start.getDate())+" - "+get_month(end.getMonth())+" "+end.getDate();    
        }
        val.closing_date = (get_month(end.getMonth()))+" "+(end.getDate());  
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderHours(container, template, collection, type){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    if (type == "property_details"){
        item_list.push(collection);
        collection = [];
        collection = item_list;
    }
    if (type == "reg_hours") {
        $.each( collection , function( key, val ) {
            if (!val.store_id && val.is_holiday == false) {
                switch(val.day_of_week) {
                case 0:
                    val.day = "Sunday";
                    break;
                case 1:
                    val.day = "Monday";
                    break;
                case 2:
                    val.day = "Tuesday";
                    break;
                case 3:
                    val.day = "Wednesday";
                    break;
                case 4:
                    val.day = "Thursday";
                    break;
                case 5:
                    val.day = "Friday";
                    break;
                case 6:
                    val.day = "Saturday";
                    break;
                
            }
            if (val.open_time && val.close_time && val.is_closed == false){
                var open_time = new Date (val.open_time);
                var close_time = new Date (val.close_time);
                val.open_time = convert_hour(open_time);
                val.close_time = convert_hour(close_time);    
                val.h = val.open_time+ " - " + val.close_time;
            } else {
                "Closed";
            }
                item_list.push(val);
            }
        });
        collection = [];
        collection = item_list;
    }
    
    if (type == "holiday_hours") {
        $.each( collection , function( key, val ) {
            if (!val.store_id && val.is_holiday == true) {
                holiday = new Date (val.holiday_date + "T05:00:00Z");
                var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                val.formatted_date = weekdays[holiday.getDay()]+ ", " + get_month(holiday.getMonth()) + " " +holiday.getDate()+ ", " + holiday.getFullYear();
                if (val.open_time && val.close_time && val.is_closed == false){
                    var open_time = new Date (val.open_time);
                    var close_time = new Date (val.close_time);
                    val.open_time = convert_hour(open_time);
                    val.close_time = convert_hour(close_time);    
                    if (val.open_time == "0:00 AM"){
                        val.open_time = "12:00 AM";
                    }
                     if (val.close_time == "0:00 AM"){
                        val.close_time = "12:00 AM";
                    }
                    val.h = val.open_time+ " - " + val.close_time;
                } else {
                    val.h = "Closed";
                }
                if (val.h != "Closed"){
                    item_list.push(val);
                }
            }
        });
        collection = [];
        collection = item_list;
    }
    
    if (type == "closed_hours") {
        $.each( collection , function( key, val ) {
            if (!val.store_id && val.is_holiday == true) {
                holiday = new Date (val.holiday_date + "T05:00:00Z");
                var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                val.formatted_date = weekdays[holiday.getDay()]+ " " + get_month(holiday.getMonth()) + " " +holiday.getDate()+ " " + holiday.getFullYear();
                if (val.open_time && val.close_time && val.is_closed == false){
                    var open_time = new Date (val.open_time);
                    var close_time = new Date (val.close_time);
                    val.open_time = convert_hour(open_time);
                    val.close_time = convert_hour(close_time);    
                    if (val.open_time == "0:00 AM"){
                        val.open_time = "12:00 AM";
                    }
                     if (val.close_time == "0:00 AM"){
                        val.close_time = "12:00 AM";
                    }
                    val.h = val.open_time+ " - " + val.close_time;
                } else {
                    val.h = "Closed";
                }
                if (val.h == "Closed"){
                    item_list.push(val);
                }
            }
        });
        collection = [];
        collection = item_list;
    }
    
    $.each( collection , function( key, val ) {
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);

    });
    
    $(container).show();
    $(container).html(item_rendered.join(''));
}


function renderContest(container, template, collection, type){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    if (type == "contestDetails"){
        collection.alt_photo_url = getImageURL(collection.photo_url);
        collection.property_id = getPropertyID();
        item_list.push(collection);
        collection = [];
        collection = item_list;
    }
    $.each( collection , function( key, val ) {
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);

    });
    
    $(container).show();
    $(container).html(item_rendered.join(''));
}


function submit_contest(data) {
    var propertyDetails = getPropertyDetails();
    var host = propertyDetails.mm_host;
    var email = $("#email").val();
    var name = $("#first_name").val() + " " + $("#last_name").val();
    $.ajax({
        url: host+"/newsletter_no_captcha",
        type: "POST",
        data: data,
        success: function(data) {
            $("#success_subscribe").fadeIn();
            $('#form_div').hide();
        },
        error: function(data){
            $("#success_subscribe").fadeIn();
            $('#form_div').hide();
        }
    });
}


function renderBanner(banner_template,home_banner,banners){
    var item_list = [];
    var item_rendered = [];
    var banner_template_html = $(banner_template).html();
    Mustache.parse(banner_template_html);   // optional, speeds up future uses
    $.each( banners , function( key, val ) {
        today = new Date();
        start = new Date (val.start_date);
       
        start.setDate(start.getDate());
       if(val.url == "" || val.url === null){
           val.css = "style=cursor:default;";
           val.noLink = "return false";
       }
       if (start <= today){
         if (val.end_date){
             end = new Date (val.end_date);
             end.setDate(end.getDate() + 1);
             if (end >= today){
               item_list.push(val);  
             }
             
         } else {
             item_list.push(val);
         }
       
        
       }
    });

    $.each( item_list , function( key, val ) {
        var repo_rendered = Mustache.render(banner_template_html,val);
        item_rendered.push(repo_rendered);
       
    });
    $(home_banner).html(item_rendered.join(''));
    
}
function renderFashion(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    item_list.push(collection);
    Mustache.parse(template_html);   // optional, speeds up future uses
    $.each( item_list , function( key, val ) {
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderFashionImages(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    $.each( collection , function( key, val ) {
        val.image_url = getPropertyDetails().mm_host + val.photo_url;
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    
    $(container).show();
    $(container).html(item_rendered.join(''));
}


function renderTrending(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    $.each( collection , function( key, val ) {
        var post = val.posts[0];
        val.post_title = post.title;
        val.post_slug = post.slug;
        if (post.image_url.indexOf('missing.png') > -1) {
            val.post_image = "http://assets.codecloudapp.com/sites/56056be06e6f641a1d020000/image/png/1446826281000/stc-logo-holiday-360 copy.png";
        } else {
            val.post_image = post.image_url;
        }
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    
    $(container).show();
    $(container).html(item_rendered.join(''));
}

function renderPosts(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    var counter = 1;
    Mustache.parse(template_html);   // optional, speeds up future uses
    $.each( collection , function( key, val ) {
        if (val.image_url.indexOf('missing.png') > -1) {
            val.post_image = "http://assets.codecloudapp.com/sites/56056be06e6f641a1d020000/image/png/1446826281000/stc-logo-holiday-360 copy.png";
        } else {
            val.post_image = val.image_url;
        }
        if(val.body.length > 100){
            val.description_short = val.body.substring(0,100) + "...";
        }
        else{
            val.description_short = val.body;
        }
        val.description_short = val.description_short.replace("&amp;", "&");
        val.slug = "posts/" +val.slug;
        var lb = getBlogDataBySlug("stc-lookbook");
        var contest = getBlogDataBySlug("stc-contest");
        var out_blog = lb.posts.concat(contest.posts);
        var id = val.id;
        var result = $.grep(out_blog, function(e){ return e.id == id; });
        if(result.length > 0){
            val.slug = val.video_link;
        }
        val.counter = counter;
        var date_blog = new Date(val.publish_date);
        console.log(val)
        val.published_on = get_month(date_blog.getMonth()) + " " + date_blog.getDate() + ", " + date_blog.getFullYear();
        
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
        counter = counter+1;
    });
    
    $(container).show();
    $(container).html(item_rendered.join(''));
}

function renderPosts2(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    var counter = 1;
    Mustache.parse(template_html);   // optional, speeds up future uses
    $.each( collection , function( key, val ) {
        if (val.image_url.indexOf('missing.png') > -1) {
            val.post_image = "http://assets.codecloudapp.com/sites/56056be06e6f641a1d020000/image/png/1446826281000/stc-logo-holiday-360 copy.png";
        } else {
            val.post_image = val.image_url;
        }
        if(val.body.length > 100){
            val.description_short = val.body.substring(0,100) + "...";
        }
        else{
            val.description_short = val.body;
        }
        
        
        val.counter = counter;
        var date_blog = new Date(val.publish_date);
        val.published_on = get_month(date_blog.getMonth()) + " " + date_blog.getDate() + ", " + date_blog.getFullYear();
        
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
        counter = counter+1;
    });
    
    $(container).show();
    $(container).html(item_rendered.join(''));
}



function renderPostDetails(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    $.each( collection , function( key, val ) {
        if (val.image_url.indexOf('missing.png') > -1) {
            val.post_image = "http://assets.codecloudapp.com/sites/56056be06e6f641a1d020000/image/png/1446826281000/stc-logo-holiday-360 copy.png";
        } else {
            val.post_image = val.image_url;
        }
        if(val.body.length > 100){
            val.description_short = val.body.substring(0,100) + "...";
        }
        else{
            val.description_short = val.body;
        }
        var date_blog = new Date((val.publish_date + " 05:00:00").replace(/-/g,"/"));
        val.published_on = get_month(date_blog.getMonth()) + " " + date_blog.getDate() + ", " + date_blog.getFullYear();
        var next_p = getNextPublishedPostBySlug(val.slug);
        var prev_p = getPrevPublishedPostBySlug(val.slug);
        if (next_p == undefined){
            val.next_post_show = "display:none";
        }
        else{
            val.next_post = next_p.title;
            val.next_slug = next_p.slug;
            val.next_post_show = "display:inline-block";
        }
        if (prev_p == undefined){
            val.prev_post_show = "display:none";
        }
        else{
            val.prev_post = prev_p.title;
            val.prev_slug = prev_p.slug;
            val.prev_post_show = "display:inline-block";
        }
        
        if (val.tag != undefined){
            val.tag_list = val.tag.join(', ');
        }
        val.twitter_title= val.title + " via @shopSTC";
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    
    $(container).html(item_rendered.join(''));
}

function renderBlogs(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    $.each( collection , function( key, val ) {
        
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    
    $(container).show();
    $(container).html(item_rendered.join(''));
}

function renderFeatureItems(feature_template,feature_items,featureList){
    var item_list = [];
    var item_rendered = [];
    var feature_template_html = $(feature_template).html();
    Mustache.parse(feature_template_html);   // optional, speeds up future uses
    $.each( featureList , function( key, val ) {
        val.alt_url = val.image_url;
        var featureitem_rendered = Mustache.render(feature_template_html,val);
        item_rendered.push(featureitem_rendered);
       
    });
    
   
    $(feature_items).show();
    $(feature_items).html(item_rendered.join(''));
    $(".modal-backdrop").remove();
    
}

function renderInsidePages(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    $.each( collection , function( key, val ) {
        
        var title = val.title.split(" - ");
        val.title = title[1]
        
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);

    });
    
    $(container).show();
    $(container).html(item_rendered.join(''));
};

function renderPromos(container, template, collection){
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future use
    $.each( collection , function( key, val ) {
        if ((val.promo_image_url_abs).indexOf('missing.png') > -1){
            if (val.promotionable_type == "Store") {
                var store_details = getStoreDetailsByID(val.promotionable_id);
                if ((store_details.store_front_url_abs).indexOf('missing.png') > -1) {
                    val.alt_promo_image_url = "http://assets.codecloudapp.com/sites/56056be06e6f641a1d020000/image/png/1446826281000/stc-logo-holiday-360 copy.png";
                    val.store_image = "http://assets.codecloudapp.com/sites/56056be06e6f641a1d020000/image/png/1446826281000/stc-logo-holiday-360 copy.png";
                } else {
                    val.alt_promo_image_url = (store_details.store_front_url_abs); 
                    val.store_image = store_details.store_front_url_abs
                }
                
                val.store_name = store_details.name;
            } else {
                val.alt_promo_image_url = "http://assets.codecloudapp.com/sites/56056be06e6f641a1d020000/image/png/1446826281000/stc-logo-holiday-360 copy.png";
            }
            
        } else {
            val.alt_promo_image_url = (val.promo_image_url_abs);
            if (val.promotionable_type == "Store") {
                var store_details = getStoreDetailsByID(val.promotionable_id);
                val.store_detail_btn = store_details.slug;
                val.store_name = store_details.name;
                val.store_image = store_details.store_front_url_abs
            }
    
        }
        
        
        start = new Date (val.start_date);
        end = new Date (val.end_date);
        start.setDate(start.getDate()+1);
        end.setDate(end.getDate()+1);
    
        if (start.toDateString() == end.toDateString()) {
            val.dates = (get_month(start.getMonth()))+" "+(start.getDate());    
        } else {
            val.dates = (get_month(start.getMonth()))+" "+(start.getDate())+" - "+get_month(end.getMonth())+" "+end.getDate();    
        }
        if(val.is_special_promo != true){
            var rendered = Mustache.render(template_html,val);
        }
        item_rendered.push(rendered);
    });
    $(container).show();
    $(container).html(item_rendered.join(''));
}


function renderSplPromos(container, template, collection){
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future use
    $.each( collection , function( key, val ) {
        if ((val.promo_image_url_abs).indexOf('missing.png') > -1){
            if (val.promotionable_type == "Store") {
                var store_details = getStoreDetailsByID(val.promotionable_id);
                if ((store_details.store_front_url_abs).indexOf('missing.png') > -1) {
                    val.alt_promo_image_url = "http://assets.codecloudapp.com/sites/56056be06e6f641a1d020000/image/png/1446826281000/stc-logo-holiday-360 copy.png";
                    val.store_image = "http://assets.codecloudapp.com/sites/56056be06e6f641a1d020000/image/png/1446826281000/stc-logo-holiday-360 copy.png";
                } else {
                    val.alt_promo_image_url = (store_details.store_front_url_abs); 
                    val.store_image = store_details.store_front_url_abs
                }
                val.store_name = store_details.name;
            } else {
                val.alt_promo_image_url = "http://assets.codecloudapp.com/sites/56056be06e6f641a1d020000/image/png/1446826281000/stc-logo-holiday-360 copy.png";
            }
            
        } else {
            val.alt_promo_image_url = (val.promo_image_url_abs);
            if (val.promotionable_type == "Store") {
                var store_details = getStoreDetailsByID(val.promotionable_id);
                if ((store_details.store_front_url_abs).indexOf('missing.png') > -1) {
                    val.alt_promo_image_url = "http://assets.codecloudapp.com/sites/56056be06e6f641a1d020000/image/png/1446826281000/stc-logo-holiday-360 copy.png";
                    val.store_image = "http://assets.codecloudapp.com/sites/56056be06e6f641a1d020000/image/png/1446826281000/stc-logo-holiday-360 copy.png";
                } else {
                    val.alt_promo_image_url = (store_details.store_front_url_abs); 
                    val.store_image = store_details.store_front_url_abs
                }
                val.store_name = store_details.name;
            } else {
                val.alt_promo_image_url = "http://assets.codecloudapp.com/sites/56056be06e6f641a1d020000/image/png/1446826281000/stc-logo-holiday-360 copy.png";
            }
    
        }
        
        
        start = new Date (val.start_date);
        end = new Date (val.end_date);
        start.setDate(start.getDate()+1);
        end.setDate(end.getDate()+1);
    
        if (start.toDateString() == end.toDateString()) {
            val.dates = (get_month(start.getMonth()))+" "+(start.getDate());    
        } else {
            val.dates = (get_month(start.getMonth()))+" "+(start.getDate())+" - "+get_month(end.getMonth())+" "+end.getDate();    
        }
        if(val.is_special_promo == true){
            var rendered = Mustache.render(template_html,val);
        }
        item_rendered.push(rendered);
    });
    $(container).show();
    $(container).html(item_rendered.join(''));
}





