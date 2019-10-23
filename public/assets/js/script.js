/*var width = $(window).width(), height = $(window).height();
alert('width : ' +width + 'height : ' + height);*/
"use strict";
$(document).ready(function() {
    var $window = $(window);
    //add id to main menu for mobile menu start
    var getBody = $("body");
    var bodyClass = getBody[0].className;
    $(".main-menu").attr('id', bodyClass);
    //add id to main menu for mobile menu end

    // card js start
    var emailbody = $(window).height();
    $('.user-body').css('min-height', emailbody);
    $(".card-header-right .icofont-close-circled").on('click', function() {
        var $this = $(this);
        $this.parents('.card').animate({
            'opacity': '0',
            '-webkit-transform': 'scale3d(.3, .3, .3)',
            'transform': 'scale3d(.3, .3, .3)'
        });

        setTimeout(function() {
            $this.parents('.card').remove();
        }, 800);
    });
    $("#styleSelector .style-cont").slimScroll({
        height: '100%',
        allowPageScroll: false,
        wheelStep: 5,
        color: '#999',
        animate: true
    });
    $(".card-header-right .icofont-rounded-down").on('click', function() {
        var $this = $(this);
        var port = $($this.parents('.card'));
        var card = $(port).children('.card-block').slideToggle();
        $(this).toggleClass("icon-up").fadeIn('slow');
    });
    $(".icofont-refresh").on('mouseenter mouseleave', function() {
        $(this).toggleClass("rotate-refresh").fadeIn('slow');
    });
    $("#more-details").on('click', function() {
        $(".more-details").slideToggle(500);
    });
    $(".mobile-options").on('click', function() {
        $(".navbar-container .nav-right").slideToggle('slow');
    });
    // card js end

    //Menu layout end

    /*chatbar js start*/
    /*chat box scroll*/
    var a = $(window).height() - 50;
    $(".main-friend-list").slimScroll({
        height: a,
        allowPageScroll: false,
        wheelStep: 5,
        color: '#1b8bf9'
    });

    // search
    $("#search-friends").on("keyup", function() {
        var g = $(this).val().toLowerCase();
        $(".userlist-box .media-body .chat-header").each(function() {
            var s = $(this).text().toLowerCase();
            $(this).closest('.userlist-box')[s.indexOf(g) !== -1 ? 'show' : 'hide']();
        });
    });

    // open chat box
    $('.displayChatbox').on('click', function() {
        var my_val = $('.pcoded').attr('vertical-placement');
        if (my_val == 'right') {
            var options = {
                direction: 'left'
            };
        } else {
            var options = {
                direction: 'right'
            };
        }
        $('.showChat').toggle('slide', options, 500);
    });


    //open friend chat
    $('.userlist-box').on('click', function() {
        var my_val = $('.pcoded').attr('vertical-placement');
        if (my_val == 'right') {
            var options = {
                direction: 'left'
            };
        } else {
            var options = {
                direction: 'right'
            };
        }
        $('.showChat_inner').toggle('slide', options, 500);
    });
    //back to main chatbar
    $('.back_chatBox').on('click', function() {
        var my_val = $('.pcoded').attr('vertical-placement');
        if (my_val == 'right') {
            var options = {
                direction: 'left'
            };
        } else {
            var options = {
                direction: 'right'
            };
        }
        $('.showChat_inner').toggle('slide', options, 500);
        $('.showChat').css('display', 'block');
    });
    // /*chatbar js end*/

    //Language chage dropdown start
    i18next.use(window.i18nextXHRBackend).init({
        debug: !1,
        fallbackLng: !1,
        backend: {
            loadPath: "assets/locales/{{lng}}/{{ns}}.json"
        },
        returnObjects: !0
    },
    function(err, t) {
        jqueryI18next.init(i18next, $)
    }),
    $(".lng-dropdown a").on("click", function() {

        var $this = $(this),
        selected_lng = $this.data("lng");
        i18next.changeLanguage(selected_lng, function(err, t) {
            $(".main-menu").localize()
        }),
        $this.parent("li").siblings("li").children("a").removeClass("active"), $this.addClass("active"), $(".lng-dropdown a").removeClass("active");
        var drop_lng = $('.lng-dropdown a[data-lng="' + selected_lng + '"]').addClass("active");
        $(".lng-dropdown #dropdown-active-item").html(drop_lng.html())
    })
        //Language chage dropdown end
        //loader start
        $('.theme-loader').fadeOut(300);
        //loader end

   

    // SHOWING AND HIDING OPTIONS
    $('#tests').change(function () {
        var lab = $('#tests').val()
        if(lab === 'Haematology and Serology'){
            // $('option#serology').show()
            // $('option#serology').css('display','block');
            // $('.micro').hide()
            // $('.chemical').hide()
            // $('.ms-selectable').find("li:contains('Testosterone')").show();
            // $('.ms-selectable').find("li:contains('HIV')").show();
            // $('.ms-selectable').find("li:contains('STD')").show();
            // $('.ms-selectable').find("li:contains('Faecal Fat')").show();
            // $('.ms-selectable').find("li:contains('Genotype')").show();
            // $('.ms-selectable').find("li:contains('Cholesterone')").show();
            // $('.ms-selectable').find("li:contains('Widal Test(S. typhi A)')").show();
            // $('.ms-selectable').find("li:contains('Haemoglobin')").hide();
            // $('.ms-selectable').find("li:contains('WBC')").hide();
            // $('.ms-selectable').find("li:contains('Lymphocytes')").hide();
            // $('.ms-selectable').find("li:contains('RBC')").hide();
            // $('.ms-selectable').find("li:contains('FBC')").hide();
            // $('.ms-selectable').find("li:contains('SIC')").hide();
            // $('.ms-selectable').find("li:contains('PCV')").hide();
            // $('.ms-selectable').find("li:contains('ESR')").hide();
            // $('.ms-selectable').find("li:contains('HB')").hide();
            // $('.ms-selectable').find("li:contains('MCH')").hide();
            // $('.ms-selectable').find("li:contains('Widal')").hide();
            // $('.ms-selectable').find("li:contains('Jaqueline')").hide();
            // $('.ms-selectable').find("li:contains('RBC')").hide();
            // $('.ms-selectable').find("li:contains('Urinalysis')").hide();
            // $('.ms-selectable').find("li:contains('FUNCL')").hide();
            // $('.ms-selectable').find("li:contains('ANAC')").hide();

            //OLD
            // $('.ms-selectable').find("li:contains('Testosterone')").hide();
            // $('.ms-selectable').find("li:contains('Testosterone')").show();
            // $('.ms-selectable').find("li:contains('Testosterone')").show();
            // $('.ms-selectable').find("li:contains('Testosterone')").show();
            // $('.ms-selectable').find("li:contains('Testosterone')").show();
            // $('.ms-selectable').find("li:contains('Testosterone')").show();
            // $('.ms-selectable').find("li:contains('Testosterone')").show();
            // $('.ms-selectable').find("li:contains('Testosterone')").show();
            // $('.ms-selectable').find("li:contains('Testosterone')").show();
            // $('.ms-selectable').find("li:contains('Testosterone')").show();
            // $('.ms-selectable').find("li:contains('Testosterone')").show();
            // $('.ms-selectable').find("li:contains('Testosterone')").show();
            // $('.ms-selectable').find("li:contains('Testosterone')").show();
            // $('.ms-selectable').find("li:contains('Testosterone')").show();
            // $('.ms-selectable').find("li:contains('Testosterone')").show();
        }

        else if(lab === 'Chemical Pathology'){
            // $('.serology').hide()
            // $('.micro').hide()
            // $('.chemical').show()
            // $('.ms-selectable').find("li:contains('Haemoglobin')").show();
            // $('.ms-selectable').find("li:contains('WBC')").show();
            // $('.ms-selectable').find("li:contains('Lymphocytes')").show();
            // $('.ms-selectable').find("li:contains('RBC')").show();
            // $('.ms-selectable').find("li:contains('FBC')").show();
            // $('.ms-selectable').find("li:contains('SIC')").show();
            // $('.ms-selectable').find("li:contains('PCV')").show();
            // $('.ms-selectable').find("li:contains('ESR')").show();
            // $('.ms-selectable').find("li:contains('HB')").show();
            // $('.ms-selectable').find("li:contains('MCH')").show();
            // $('.ms-selectable').find("li:contains('Widal')").show();
            // $('.ms-selectable').find("li:contains('Jaqueline')").show();
            // $('.ms-selectable').find("li:contains('RBC')").show();
            // $('.ms-selectable').find("li:contains('Testosterone')").hide();
            // $('.ms-selectable').find("li:contains('HIV')").hide();
            // $('.ms-selectable').find("li:contains('STD')").hide();
            // $('.ms-selectable').find("li:contains('Faecal Fat')").hide();
            // $('.ms-selectable').find("li:contains('Genotype')").hide();
            // $('.ms-selectable').find("li:contains('Cholesterone')").hide();
            // $('.ms-selectable').find("li:contains('Widal Test(S. typhi A)')").hide();
            // $('.ms-selectable').find("li:contains('Urinalysis')").hide();
            // $('.ms-selectable').find("li:contains('FUNCL')").hide();
            // $('.ms-selectable').find("li:contains('ANAC')").hide();
        }
        else if(lab === 'Microbiology'){
            // $('.serology').hide()
            // $('.ms-selectable').show()
            // $('.chemical').hide()
            // $('.ms-selectable').find("li:contains('Urinalysis')").show();
            // $('.ms-selectable').find("li:contains('FUNCL')").show();
            // $('.ms-selectable').find("li:contains('ANAC')").show();
            // $('.ms-selectable').find("li:contains('Testosterone')").hide();
            // $('.ms-selectable').find("li:contains('HIV')").hide();
            // $('.ms-selectable').find("li:contains('STD')").hide();
            // $('.ms-selectable').find("li:contains('Faecal Fat')").hide();
            // $('.ms-selectable').find("li:contains('Genotype')").hide();
            // $('.ms-selectable').find("li:contains('Cholesterone')").hide();
            // $('.ms-selectable').find("li:contains('Widal Test(S. typhi A)')").hide();
            // $('.ms-selectable').find("li:contains('Haemoglobin')").hide();
            // $('.ms-selectable').find("li:contains('WBC')").hide();
            // $('.ms-selectable').find("li:contains('Lymphocytes')").hide();
            // $('.ms-selectable').find("li:contains('RBC')").hide();
            // $('.ms-selectable').find("li:contains('FBC')").hide();
            // $('.ms-selectable').find("li:contains('SIC')").hide();
            // $('.ms-selectable').find("li:contains('PCV')").hide();
            // $('.ms-selectable').find("li:contains('ESR')").hide();
            // $('.ms-selectable').find("li:contains('HB')").hide();
            // $('.ms-selectable').find("li:contains('MCH')").hide();
            // $('.ms-selectable').find("li:contains('Widal')").hide();
            // $('.ms-selectable').find("li:contains('Jaqueline')").hide();
            // $('.ms-selectable').find("li:contains('RBC')").hide();
            // $('.ms-selectable').find("li:contains('Chemical Pathology')").hide();
            // $('.ms-selectable').find("li:contains('Creatinine')").hide();
            // $('.ms-selectable').find("li:contains('SGOT')").hide();
            // $('.ms-selectable').find("li:contains('FBS')").hide();
            // $('.ms-selectable').find("li:contains('BUN')").hide();
            // $('.ms-selectable').find("li:contains('TG')").hide();
            // $('.ms-selectable').find("li:contains('Chol')").hide();
            // $('.ms-selectable').find("li:contains('Widal')").hide();
        }
        // if(lab === 'Pathology'){
        //     $('.ms-selectable').find("li:contains('Chemical Pathology')").show();
        //     $('.ms-selectable').find("li:contains('Creatinine')").show();
        //     $('.ms-selectable').find("li:contains('SGOT')").show();
        //     $('.ms-selectable').find("li:contains('FBS')").show();
        //     $('.ms-selectable').find("li:contains('BUN')").show();
        //     $('.ms-selectable').find("li:contains('TG')").show();
        //     $('.ms-selectable').find("li:contains('Chol')").show();
        //     $('.ms-selectable').find("li:contains('Widal')").show();
        //     $('.ms-selectable').find("li:contains('Urinalysis')").hide();
        //     $('.ms-selectable').find("li:contains('FUNCL')").hide();
        //     $('.ms-selectable').find("li:contains('ANAC')").hide();
        //     $('.ms-selectable').find("li:contains('Testosterone')").hide();
        //     $('.ms-selectable').find("li:contains('HIV')").hide();
        //     $('.ms-selectable').find("li:contains('STD')").hide();
        //     $('.ms-selectable').find("li:contains('Faecal Fat')").hide();
        //     $('.ms-selectable').find("li:contains('Genotype')").hide();
        //     $('.ms-selectable').find("li:contains('Cholesterone')").hide();
        //     $('.ms-selectable').find("li:contains('Widal Test(S. typhi A)')").hide();
        //     $('.ms-selectable').find("li:contains('Haemoglobin')").hide();
        //     $('.ms-selectable').find("li:contains('WBC')").hide();
        //     $('.ms-selectable').find("li:contains('Lymphocytes')").hide();
        //     $('.ms-selectable').find("li:contains('RBC')").hide();
        //     $('.ms-selectable').find("li:contains('FBC')").hide();
        //     $('.ms-selectable').find("li:contains('SIC')").hide();
        //     $('.ms-selectable').find("li:contains('PCV')").hide();
        //     $('.ms-selectable').find("li:contains('ESR')").hide();
        //     $('.ms-selectable').find("li:contains('HB')").hide();
        //     $('.ms-selectable').find("li:contains('MCH')").hide();
        //     $('.ms-selectable').find("li:contains('Widal')").hide();
        //     $('.ms-selectable').find("li:contains('Jaqueline')").hide();
        //     $('.ms-selectable').find("li:contains('RBC')").hide();

        // }
    })

    

    // //Izitoastr
	// iziToast.settings({
	// 	timeout: 3000, // default timeout
	// 	resetOnHover: true,
	// 	// icon: '', // icon class
	// 	transitionIn: 'flipInX',
	// 	transitionOut: 'flipOutX',
	// 	position: 'topRight', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter, center
	// 	onOpen: function () {
	// 		console.log('callback abriu!');
	// 	},
	// 	onClose: function () {
	// 		console.log("callback fechou!");
	// 	}
	// });

    

    

     


    //

    //DISPLAYING HMO NAME
    // $('#hmos').change(function () {
    //     var retainershipname = $('#hmos').val()
    //     if(retainershipname === 'NHIS'){
    //         $('#hmoname').show()
    //         $('#nhis').show()
    //         $('#fhss').hide()
    //         $('#privatehmo').hide()
    //         $('#retainer').hide()
        
    //     }else if(retainershipname === 'FHSS'){
    //         $('#hmoname').show()
    //         $('#nhis').hide()
    //         $('#fhss').show()
    //         $('#privatehmo').hide()
    //         $('#retainer').hide()
    //     }else if(retainershipname === 'PRIVATE HMO'){
    //         $('#hmoname').show()
    //         $('#nhis').hide()
    //         $('#fhss').hide()
    //         $('#privatehmo').show()
    //         $('#retainer').hide()
    //     }else if(retainershipname === 'RETAINERSHIP'){
    //         $('#hmoname').show()
    //         $('#nhis').hide()
    //         $('#fhss').hide()
    //         $('#privatehmo').hide()
    //         $('#retainer').show()
    //     }
    // })

   

    // $('#depart').change(function(){
    //     var department = $('#depart').val();
    //     if(department === 'LaboratoryInventory'){
    //         $('#labit').show()
    //         $('#pharm').hide()
    //     }else{
    //         $('#labit').hide()
    //         $('#pharm').show()
    //     }
    // })
    
    //Clone and Remove Form Fields

    // $('.add-more-btn').on('click', function() { 
    //     $('.form-block').append('.form-clone');
    //     return false; //prevent form submission
    // });

    // $('#remove-more-btn').on('click', '.remove', function() {
    //     $(this).parent().remove();
    //     return false; //prevent form submission
    // });

    //DISPLAYING PATIENT ID
    // $('#hmoname').change(function () {
    //     var retain = $('#hmoname').val();
    //     if(retain !== null && retain !== ''){
    //         $('#patientId').show()
    //     }else{
    //         $('#patientId').hide()
    //     }
    // })

    

    //
    
    // //HIDING AND SHOWING DEPARTMeNT WHEN CHOOSING DOCTOR
	// $('#patientID').change(function () {
	// 	var patientId = $('#patient_id').val()
	// 	console.log(patientId)
		
	// })
	// $('#save').click(function (event) {
	// 	var data = $('#mydata').val()
	// 	event.preventDefault()
	// 	$.ajax({
	// 		type: 'POST',
	// 		url: '/take-picture',
	// 		data: {
	// 			data: data,
	// 		},
	// 		success:function (data) {
	// 			console.log('done')
	// 		}
	// 	})
	// })
});




/* Search header start */
(function() {
    var isAnimating;
    var morphSearch = document.getElementById('morphsearch'),
    input = morphSearch.querySelector('input.morphsearch-input'),
    ctrlClose = morphSearch.querySelector('span.morphsearch-close'),
    isOpen = isAnimating = false,
    isHideAnimate = morphsearch.querySelector('.morphsearch-form'),
        // show/hide search area
        toggleSearch = function(evt) {
            // return if open and the input gets focused
            if (evt.type.toLowerCase() === 'focus' && isOpen) return false;

            var offsets = morphsearch.getBoundingClientRect();
            if (isOpen) {
                classie.remove(morphSearch, 'open');

                // trick to hide input text once the search overlay closes
                // todo: hardcoded times, should be done after transition ends
                //if( input.value !== '' ) {
                    setTimeout(function() {
                        classie.add(morphSearch, 'hideInput');
                        setTimeout(function() {
                            classie.add(isHideAnimate, 'p-absolute');
                            classie.remove(morphSearch, 'hideInput');
                            input.value = '';
                        }, 300);
                    }, 500);
                //}

                input.blur();
            } else {
                classie.remove(isHideAnimate, 'p-absolute');
                classie.add(morphSearch, 'open');
            }
            isOpen = !isOpen;
        };

    // events
    input.addEventListener('focus', toggleSearch);
    ctrlClose.addEventListener('click', toggleSearch);
    // esc key closes search overlay
    // keyboard navigation events
    document.addEventListener('keydown', function(ev) {
        var keyCode = ev.keyCode || ev.which;
        if (keyCode === 27 && isOpen) {
            toggleSearch(ev);
        }
    });
    var morphSearch_search = document.getElementsByClassName('morphsearch-search');
    $(".morphsearch-search").on('click', toggleSearch);

    /***** for demo purposes only: don't allow to submit the form *****/
    morphSearch.querySelector('button[type="submit"]').addEventListener('click', function(ev) {
        ev.preventDefault();
    });
})();
/* Search header end */

// toggle full screen
function toggleFullScreen() {
    var a = $(window).height() - 10;

    if (!document.fullscreenElement && // alternative standard method
        !document.mozFullScreenElement && !document.webkitFullscreenElement) { // current working methods
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    }
}

//light box
$(document).on('click', '[data-toggle="lightbox"]', function(event) {
    event.preventDefault();
    $(this).ekkoLightbox();
});

/* --------------------------------------------------------
        Color picker - demo only
        --------------------------------------------------------   */
        (function() {
        $('<div class="selector-toggle"><a href="javascript:void(0)"></a></div><div class="style-cont"><ul><li><p class="selector-title main-title">Mash Able CUSTOMIZER</p></li></ul><ul class="nav nav-tabs  tabs" role="tablist"><li class="nav-item"><a class="nav-link active" data-toggle="tab" href="#sel-pos" role="tab">Position</a></li><li class="nav-item"><a class="nav-link" data-toggle="tab" href="#sel-lay" role="tab">Layout</a></li><li class="nav-item"><a class="nav-link" data-toggle="tab" href="#sel-sid" role="tab">Sidebar</a></li></ul><div class="tab-content tabs"><div class="tab-pane active" id="sel-pos" role="tabpanel"><ul><li class="theme-option"><div class="checkbox-fade fade-in-success"><label><input type="checkbox" value="false" id="sidebar-position" name="sidebar-position"><span class="cr"><i class="cr-icon icofont icofont-ui-check txt-success"></i></span><span>Fixed Sidebar Position</span></label></div></li><li class="theme-option"><div class="checkbox-fade fade-in-success"><label><input type="checkbox" value="false" id="header-position" name="header-position"><span class="cr"><i class="cr-icon icofont icofont-ui-check txt-success"></i></span><span>Fixed Header Position</span></label></div></li><li class="theme-option"><div class="checkbox-fade fade-in-success"><label><input type="checkbox" value="false" id="vertical-item-border" name="vertical-item-border"><span class="cr"><i class="cr-icon icofont icofont-ui-check txt-success"></i></span><span>Hide Item Border</span></label></div></li><li class="theme-option"><div class="checkbox-fade fade-in-success"><label><input type="checkbox" value="false" id="vertical-subitem-border" name="vertical-item-border"><span class="cr"><i class="cr-icon icofont icofont-ui-check txt-success"></i></span><span>Hide SubItem Border</span></label></div></li></ul></div><div class="tab-pane" id="sel-lay" role="tabpanel"><ul><li class="theme-option"><p class="sub-title">Page Layout</p><select id="theme-layout" class="form-control minimal input-sm"><option name="vertical-layout" value="wide">Wide layout</option><option name="vertical-layout" value="box">Boxed layout</option></select></li><li class="theme-option"><p class="sub-title">Navbar Placement</p><select id="vertical-navbar-placement" class="form-control minimal input-sm"><option name="navigation-side" value="left">Left</option><option name="navigation-side" value="right">Right</option></select></li></ul></div><div class="tab-pane" id="sel-sid" role="tabpanel"><ul><li class="theme-option"><p class="sub-title drp-title">SideBar Effect</p><select id="vertical-menu-effect" class="form-control minimal"><option name="vertical-menu-effect" value="shrink">shrink</option><option name="vertical-menu-effect" value="overlay">overlay</option><option name="vertical-menu-effect" value="push">Push</option></select></li><li class="theme-option"><p class="sub-title drp-title">Border Style</p><select id="vertical-border-style" class="form-control minimal"><option name="vertical-border-style" value="solid">Style 1</option><option name="vertical-border-style" value="dotted">Style 2</option><option name="vertical-border-style" value="dashed">Style 3</option><option name="vertical-border-style" value="none">No Border</option></select></li><li class="theme-option"><p class="sub-title drp-title">DropDown Icon</p><select id="vertical-dropdown-icon" class="form-control minimal"><option name="vertical-dropdown-icon" value="style1">Style 1</option><option name="vertical-dropdown-icon" value="style2">style 2</option><option name="vertical-dropdown-icon" value="style3">style 3</option></select></li><li class="theme-option"><p class="sub-title drp-title">Submenu Item Icon</p><select id="vertical-subitem-icon" class="form-control minimal"><option name="vertical-subitem-icon" value="style1">Style 1</option><option name="vertical-subitem-icon" value="style2">style 2</option><option name="vertical-subitem-icon" value="style3">style 3</option><option name="vertical-subitem-icon" value="style4">style 4</option><option name="vertical-subitem-icon" value="style5">style 5</option><option name="vertical-subitem-icon" value="style6">style 6</option></select></li></ul></div><ul><li><p class="selector-title">Navigator Option</p></li><li class="theme-option"><span class="selector-title">Menu Caption Color</span><div class="theme-color"><a href="#" class="leftheader-theme" lheader-theme="theme1">&nbsp;</a><a href="#" class="leftheader-theme" lheader-theme="theme2">&nbsp;</a><a href="#" class="leftheader-theme" lheader-theme="theme3">&nbsp;</a><a href="#" class="leftheader-theme" lheader-theme="theme4">&nbsp;</a><a href="#" class="leftheader-theme" lheader-theme="theme5">&nbsp;</a><a href="#" class="leftheader-theme" lheader-theme="theme6">&nbsp;</a></div><div class="theme-color"><a href="#" class="leftheader-theme" lheader-theme="theme7">&nbsp;</a><a href="#" class="leftheader-theme" lheader-theme="theme8">&nbsp;</a><a href="#" class="leftheader-theme" lheader-theme="theme9">&nbsp;</a><a href="#" class="leftheader-theme" lheader-theme="theme10">&nbsp;</a><a href="#" class="leftheader-theme" lheader-theme="theme11">&nbsp;</a><a href="#" class="leftheader-theme" lheader-theme="theme12">&nbsp;</a></div></li><li class="theme-option"><span class="selector-title">Active item Theme</span><div class="theme-color"><a href="#" class="active-item-theme" active-item-theme="theme1">&nbsp;</a><a href="#" class="active-item-theme" active-item-theme="theme2">&nbsp;</a><a href="#" class="active-item-theme" active-item-theme="theme3">&nbsp;</a><a href="#" class="active-item-theme" active-item-theme="theme4">&nbsp;</a><a href="#" class="active-item-theme" active-item-theme="theme5">&nbsp;</a><a href="#" class="active-item-theme" active-item-theme="theme6">&nbsp;</a></div><div class="theme-color"><a href="#" class="active-item-theme" active-item-theme="theme7">&nbsp;</a><a href="#" class="active-item-theme" active-item-theme="theme8">&nbsp;</a><a href="#" class="active-item-theme" active-item-theme="theme9">&nbsp;</a><a href="#" class="active-item-theme" active-item-theme="theme10">&nbsp;</a><a href="#" class="active-item-theme" active-item-theme="theme11">&nbsp;</a><a href="#" class="active-item-theme" active-item-theme="theme12">&nbsp;</a></div></li><li class="theme-option"><span class="selector-title">Background Patterns</span><div class="theme-color"><a href="#" class="themebg-pattern" themebg-pattern="pattern1">&nbsp;</a><a href="#" class="themebg-pattern" themebg-pattern="pattern2">&nbsp;</a><a href="#" class="themebg-pattern" themebg-pattern="pattern3">&nbsp;</a><a href="#" class="themebg-pattern" themebg-pattern="pattern4">&nbsp;</a><a href="#" class="themebg-pattern" themebg-pattern="pattern5">&nbsp;</a><a href="#" class="themebg-pattern" themebg-pattern="pattern6">&nbsp;</a></div></li><li><p class="selector-title">Light Sidebar</p></li><li class="theme-option"><div class="theme-color"><a href="#" class="data-navbar-theme" data-navbar-theme="themelight1"><span class="head"></span><span class="cont"></span></a></div></li><li><p class="selector-title">Dark Sidebar</p></li><li class="theme-option"><div class="theme-color"><a href="#" class="data-navbar-theme" data-navbar-theme="theme1"><span class="head"></span><span class="cont"></span></a></div></li></ul></div></div>').appendTo($('#styleSelector'));
})();

/*Gradient Color*/


/*Normal Color */
$(".color-1").click(function() {
    $("#color").attr("href", "assets/css/color/color-1.css");
    return false;
});
$(".color-2").click(function() {
    $("#color").attr("href", "assets/css/color/color-2.css");
    return false;
});
$(".color-3").click(function() {
    $("#color").attr("href", "assets/css/color/color-3.css");
    return false;
});
$(".color-4").click(function() {
    $("#color").attr("href", "assets/css/color/color-4.css");
    return false;
});
$(".color-5").click(function() {
    $("#color").attr("href", "assets/css/color/color-5.css");
    return false;
});
$(".color-6").click(function() {
    $("#color").attr("href", "assets/css/color/color-6.css");
    return false;
});


$('.color-picker').animate({
    right: '-239px'
});

$('.color-picker a.handle').click(function(e) {
    e.preventDefault();
    var div = $('.color-picker');
    if (div.css('right') === '-239px') {
        $('.color-picker').animate({
            right: '0px'
        });
    } else {
        $('.color-picker').animate({
            right: '-239px'
        });
    }
});

/* Crazyegg */
// setTimeout(function(){var a=document.createElement("script");
// var b=document.getElementsByTagName("script")[0];
// a.src=document.location.protocol+"//script.crazyegg.com/pages/scripts/0067/0651.js?"+Math.floor(new Date().getTime()/3600000);
// a.async=true;a.type="text/javascript";b.parentNode.insertBefore(a,b)}, 1);

// Global site tag (gtag.js) - Google Analytics 
// function loadScriptAsync(scriptSrc, callback) {
//     if (typeof callback !== 'function') {
//         throw new Error('Not a valid callback for async script load');
//     }
//     var script = document.createElement('script');
//     script.onload = callback;
//     script.src = scriptSrc;
//     document.head.appendChild(script);
// }

/* This is the part where you call the above defined function and "call back" your code which gets executed after the script has loaded */
// loadScriptAsync('https://www.googletagmanager.com/gtag/js?id=UA-105635514-1', function(){
//     window.dataLayer = window.dataLayer || [];
//     function gtag(){dataLayer.push(arguments);}
//     gtag('js', new Date());
//     gtag('config', 'UA-105635514-1', { 'anonymize_ip': true });
// })


