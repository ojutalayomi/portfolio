(function ($) {
    "use strict";
    
    // loader
    var loader = function () {
        setTimeout(function () {
            if ($('#loader').length > 0) {
                $('#loader').removeClass('show');
            }
        }, 5000);
    };
    loader();
    
    
    // Initiate the wowjs
    new WOW().init();
    
    //Digital Clock
    var a = document.querySelectorAll('a');
        const clocK = `
        <div class="main">
        <div id="hr"></div>
        <span>:</span>
        <div id="mn"></div>
        <span>:</span>
        <div id="sc"></div>
        <span>-</span>
        <div id="period"></div>
        </div>`;
        a[4].innerHTML = clocK;
    
        setInterval(displayTime, 1000);

        function displayTime() {
        
            const timeNow = new Date();
        
            let hoursOfDay = timeNow.getHours();
            let minutes = timeNow.getMinutes();
            let seconds = timeNow.getSeconds();
            let weekDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
            let today = weekDay[timeNow.getDay()];
            let months = timeNow.toLocaleString("default", {
                month: "long"
            });
            let year = timeNow.getFullYear();
            let period = "AM";
        
            if (hoursOfDay > 12) {
                hoursOfDay-= 12;
                period = "PM";
            }
        
            if (hoursOfDay === 0) {
                hoursOfDay = 12;
                period = "AM";
            }
        
            hoursOfDay = hoursOfDay < 10 ? "0" + hoursOfDay : hoursOfDay;
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
        
            let time = hoursOfDay + ":" + minutes + ":" + seconds + period;
            let hr = document.getElementById('hr');
            let mn = document.getElementById('mn');
            let sc = document.getElementById('sc');
            let per = document.getElementById('period');
        
            //document.getElementById('Clock').innerHTML = time + " " + today + " " + months + " " + year;
            hr.innerHTML = hoursOfDay;
            mn.innerHTML = minutes;
            sc.innerHTML = seconds;
            per.innerHTML = period;
        
        }
        displayTime();
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });
    
    
    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 0) {
            $('.navbar').addClass('nav-sticky');
        } else {
            $('.navbar').removeClass('nav-sticky');
        }
    });
    
    
    // Smooth scrolling on the navbar links
    $(".navbar-nav a").on('click', function (event) {
        if (this.hash !== "") {
            event.preventDefault();
            
            $('html, body').animate({
                scrollTop: $(this.hash).offset().top - 45
            }, 1500, 'easeInOutExpo');
            
            if ($(this).parents('.navbar-nav').length) {
                $('.navbar-nav .active').removeClass('active');
                $(this).closest('a').addClass('active');
            }
        }
    });
    
    
    // Typed Initiate
    if ($('.hero .hero-text h2').length == 1) {
        var typed_strings = $('.hero .hero-text .typed-text').text();
        var typed = new Typed('.hero .hero-text h2', {
            strings: typed_strings.split(', '),
            typeSpeed: 100,
            backSpeed: 20,
            smartBackspace: false,
            loop: true
        });
    }
    if ($('#loader .loader-text h2').length == 1) {
        var typed_strings = $('#loader .loader-text .typed-text').text();
        var typed = new Typed('#loader .loader-text h2', {
            strings: typed_strings.split(', '),
            typeSpeed: 100,
            backSpeed: 20,
            smartBackspace: false,
            loop: true
        });
    }
    
    
    // Skills
    $('.skills').waypoint(function () {
        $('.progress .progress-bar').each(function () {
            $(this).css("width", $(this).attr("aria-valuenow") + '%');
        });
    }, {offset: '80%'});


    // Testimonials carousel
    $(".githubstats-carousel").owlCarousel({
        center: true,
        autoplay: true,
        dots: true,
        loop: true,
        responsive: {
            0:{
                items:1
            }
        }
    });
    
    
    
    // Portfolio filter
    var portfolioIsotope = $('.portfolio-container').isotope({
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
    });

    $('#portfolio-filter li').on('click', function () {
        $("#portfolio-filter li").removeClass('filter-active');
        $(this).addClass('filter-active');
        portfolioIsotope.isotope({filter: $(this).data('filter')});
    });
    
})(jQuery);
