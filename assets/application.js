$(document).ready(function () {
    $('#shopify-section-anouncement').addClass('sticky')
    $('#shopify-section-header').addClass('sticky')

    //ANNOUNCEMENT BAR

        var n_banners = window.n_rotation;
    var i = 1
    function show_banner(i){
       $('.banner_'+i).addClass('anim') 
         setTimeout(function(){ 
         $('.banner_'+i).removeClass('anim')
          i++
          if(i > n_banners) i= 1

          show_banner(i)

        },window.rotation_secs)
    }

        if(window.rotate) show_banner(i);


//MARCAS************
$('.indice').click(function (e) {
    e.preventDefault()
    $('html, body').animate({
        scrollTop: $("#letra_" + $(this).data('rel')).offset().top - 150
    }, 1000);
})
$('#in_search_marcas').keyup(function (e) {
        $('.letter-title').hide()
        var string = $(this).val()
        $('.marca_title').each(function () {
            if ($(this).data('rel').indexOf(string) >= 0) {
                $(this).show()
                $('#letra_' + $(this).data('inicial')).show()
            } else {
                $(this).hide()
            }
        })
    })
    .click(function () {
        if ($(this).val() == '') {
            $('.marca_title,.letter-title').show()
            return
        }
    })
  //HEADER***************************
    const getMobileOS = () => {
        const ua = navigator.userAgent
        if (/android/i.test(ua)) {
        return "Android"
        }
        else if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)){
        return "iOS"
        }
        return "Other"
    }
    var os = getMobileOS();
    if(os === 'iOS' ) {$('.minicart-buttons-box').css('padding-bottom', '5rem')}


      var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && window['safari'].pushNotification));

      
    $('.submenu-lateral-header').click(function(e){
        if(window.innerWidth <= 870) {
            e.preventDefault()
            $('.submenu-lateral').removeClass('submenu-lateral-show')
            $('.navigation').removeClass('main-menu-hide')
        }
    });
    $('.open-submenu').click(function(e){
        if(window.innerWidth <= 870) {
            e.preventDefault()
        var dataMenu = $(this).data('menu')
        $('.navigation').addClass('main-menu-hide')
        $(".submenu-lateral[data-menu='"+dataMenu+"']").addClass('submenu-lateral-show')
        }
    });  
  
  
    //Carousels***************************
    //Producto 
    var productGallery = $('.main-product-carousel').flickity({
        lazyLoad: true
    });
    //Más vistos carousel
    window.addEventListener('resize', isMobile, isDesktop);

    //Reviews carousel
    if ($('.reviews .card-review').length >= 4) {
        $('.reviews').removeClass('reviews-flex').addClass('reviews-carousel');
        $('.reviews-carousel').flickity({
            watchCSS: true,
            groupCells: 3,
            wrapAround: true,
            autoPlay: true,
            pageDots: false,
            draggable: false
        });
    }
    //Blog slider

    $('.blog-slider-cards').flickity({
        watchCSS: true,
        wrapAround: true,
        pageDots: false,
        prevNextButtons: false,
        autoPlay: true
    })

    //Social images
    $('.social-slider').flickity({
        watchCSS: true,
        wrapAround: true,
        groupCells: 2,
        pageDots: false
    })
    //Home collection cards
    $('.home-col-slider').flickity({
        wrapAround: true
    })
    //Upsell products
    $('.upsell-section .most-sold').flickity({
        pageDots: false,
        cellAlign: 'center',
        groupCells: true     
  });
    //Text Toggle*************************** 
    //Description
    $('#info-toggle').on('click touchstart', function (e) {
        e.preventDefault();
        let showText = $('#info-toggle .show-info-text');
        $('#info-toggle svg').toggleClass('rotate');


        showText.text(showText.text() == DT.str['Ver_mas_sobre_el_perfume'] ? DT.str['Ver_menos_sobre_el_perfume'] : DT.str['Ver_mas_sobre_el_perfume']);

        if ($('#toggle-text').hasClass('toggled')) {

            $('#toggle-text-2').css('display', 'block').animate({ 'opacity': 1 }, 1000)
            $('.fade').css('background', 'none');
            $('#toggle-text').animate({ 'max-height': '2500px' }).removeClass('toggled');
        } else {
            $('#toggle-text-2').hide()
            $('#toggle-text').animate({ 'max-height': '60vh' }).addClass('toggled');
            $('.fade').css('background', 'linear-gradient(to bottom, rgba(255,255,255,0) 0%,rgba(251,251,251,1) 75%)');
        }
    });


    //COLLECTION DESCRIPTION Toggle***************************    
    $('#btn_show_desc').click(function (e) {
        e.preventDefault()
        if ($(this).hasClass('open')) {
            $('.panel').removeClass('open')
            $(this).removeClass('open')
            $('#btn_show_desc_text').removeClass('open')
        } else {
            $('.panel').addClass('open')
            $(this).addClass('open')
            $('#btn_show_desc_text').addClass('open')
        }
    })


    //Filter toggle

      $('.filter-family').click(function (e) {
          if($('.oldfactory-cards').hasClass('open')){
            $('.oldfactory-cards').removeClass('open')
          } else {
              $('.oldfactory-cards').addClass('open')
          }
      })

      $('.filter-family-open').click(function (e) {
        if($('.brands-cards').hasClass('open')){
          $('.brands-cards').removeClass('open')
        } else {
            $('.brands-cards').addClass('open')
        }
    })

      function closeFilter(elem) {
        $(document).mouseup(function(e){
            var container  = $(elem)
            container.removeClass('open')
        })
      }
      closeFilter('.oldfactory-cards')
      closeFilter('.brands-cards')


    var state = true;
    $('.filtering').click(function (e) {
        e.preventDefault()
        $('.toggle-content').toggleClass('open')
        $('.toggle-order').removeClass('open')
        if (state) {
            $('.toggle-content').data('visible', 'true')
        } else {
            $('.toggle-content').data('visible', false)
        }
        state = !state;
    })
    $('.filter-order').click(function(e){
        e.preventDefault()
        $('.toggle-order').toggleClass('open')
        $('.toggle-content').removeClass('open')
    }) 
    $('.button-filter').click(function(e){
        $('.toggle-content').removeClass('open')
    })

    //SEARCH************************* 
    $('#btn_search').click(function (e) {
        e.preventDefault()
        if ($('#in_search').val() && $('#in_search').val() != "") {
            document.location = '/search?q=' + $('#in_search').val() + '&type=product'
        } else {
            document.location = '/search?q=&type=product'
        }
    })

    $('#search-col').keypress(function(e){
        if (e.which == 13) {searchRedirection(e)}
    })
    $('.filter-search .select-icon').click((e) => searchRedirection(e))
     
    function searchRedirection(e) {
         e.preventDefault()
        if ($('#search-col').val() && $('#search-col').val() != "") {
            document.location = '/search?q=' + $('#search-col').val() + '&type=product'
        } else {
            document.location = '/search?q=&type=product'
        }

     }
    //HOME TOP BACKGROUND*************************
    $('.border_image_h2').on('click touch', function (e) {
        document.location = $(this).parent().find('.border_image').attr('href')
    })

    //COLLECTION.ALTERNATE scroll***********************************
    $('.inCol').on('click', function(e){
      e.preventDefault();
          $('html,body').animate({
            scrollTop: $(".this-col").offset().top -100}, 'slow');
    });

    //TABS ACCORDION
            function initAcc(elem, option){
                document.addEventListener('click', function (e) {
                    if (!e.target.matches(elem+' .accordion-title')) return
                    else{
                        if(!e.target.parentElement.classList.contains('acc-active')){
                            if(option==true){
                                var elementList = document.querySelectorAll(elem +' .accordion-container')
                                Array.prototype.forEach.call(elementList, function (e) {
                                    e.classList.remove('acc-active')
                                }); 
                            }    
                            e.target.parentElement.classList.add('acc-active')
                        }else{
                            e.target.parentElement.classList.remove('acc-active')
                        }
                    }
                })
            } 
            initAcc('.overlay-tabs', true)         
            initAcc('.home-accordion', true)
            initAcc('.accordion', true)
 

    var thumbs = $('.product-thumbnails img');
    thumbs.click(function (e) {
      if($(this).attr('data-video')) {
        thumbs.removeClass('active');
        $(this).addClass('active');
        $('.main-img-container').hide();
        $('.main-video').show();
      } else {
        thumbs.removeClass('active');
        $(this).addClass('active');
        let newPhoto = e.currentTarget.src.replace('360x', '600x');
        $('#main-img').attr('src', newPhoto);
        $('.main-video').hide();
        $('.main-img-container').show();
              
      }
    });
    function copyToClipboard(element) {
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val($(element).text()).select();
        document.execCommand("copy");
        $temp.remove();
    }

    $('#home-promo-code').on('click', function () {
        copyToClipboard($(this));
        $(this).addClass('copied');
        setTimeout(() => {
            $(this).removeClass('copied');
        }, 2000);
    });
    //PRODUCT VARIANT CHANGE
    $('.variant-btn').on('click', function (e) {
      
      	const img = $('.product-thumbnails img[data-image="' + $(this).data('image') + '"]')
    
        $('.variant-btn').removeClass('variant-selected')
        $(this).addClass('variant-selected')
      
        $('#variant').attr('value',$(this).data('id'))
        $('#variant').attr('data-free',$(this).data('free'))
        $('#variant').attr('data-compared',$(this).data('compared'))
        $('.product-price').hide()
        $('.product-price[data-id='+$(this).data('id')+']').show()
        var isFree = $(this).attr('data-free')
    	var varID = $(this).attr('data-id')
        $('.mainProd').attr('data-variant', varID)
        $('.mainProd').attr('data-compared', $(this).attr('data-compared'))
        
        if(isFree == 'true'){
        $('.mainProd').attr('data-free',$('#variant').attr('data-free-id'))
        } else {          
         $('.mainProd').attr('data-free','false')
        }  

      if(img.length == 1) {
        const newPhoto = img[0].src.replace('360x', '600x')
        $('.product-thumbnails img').removeClass('active')
        img.addClass('active')
        $('#main-img').attr('src', newPhoto)
      }


      
    });	
    //CUSTOMER TEMPLATES

  
function randomUnicodeString(length){
    return Array.from({length: length}, ()=>{
        return String.fromCharCode(Math.floor(Math.random() * (65536)))
    }).join('')
  }


$('#editCustomer').on('submit', function(e){
e.preventDefault()

  var random = randomUnicodeString(5);
  var url = 'https://blacklabelparfum.com/sfapp/addmuestra/editCustomer/edit_customer.php?' + $(this).serialize() + '&p='+random
       fetch(url, {
       credentials: 'same-origin',
       method: 'GET'
   }).then(function (response) {
       response.text().then(function (content) {
         $('.button-account').addClass('success-edit')
         setTimeout(() => {
            $('.button-account').removeClass('success-edit')
          }, 2000)
         
       })
   })
})

//Addresses
var modalFirst = $('#modal-address-new')
var modalPut = $('.modal-address-put')

var btnFirst = $('.button[data-action="open-modal"]')
var btnPut = $('.post-button[data-action="open-modal"]')


function modalDisplay(btn, modal) {
  btn.click(()=>{modal.css('display','block')})
};
$('.close').click(()=> $('#modal-address-new').css('display', 'none'));
$('.close').click(()=> $('.modal-address-put').css('display', 'none'));

modalDisplay(btnFirst, modalFirst);
modalDisplay(btnPut, modalPut);



    $(".form-item [data-action='toggle-recover-form']").on('click', function(e) {
      e.preventDefault();
       $("#customer_login").fadeOut(1000,function(){
          $("#recover_customer_password").fadeIn(1000);
       });
    });
  
    $(".form-item [data-action=toggle-recover-form-login]").on('click', function(e) {
      e.preventDefault();
       $("#recover_customer_password").fadeOut(1000,function(){
          $("#customer_login").fadeIn(1000);
       });
    });
//Register 
    $('#createCustomer').on('submit', function(e){
        e.preventDefault();
      
          var random = randomUnicodeString(5);
          var url = 'https://blacklabelparfum.com/sfapp/addmuestra/editCustomer/create_customer.php?' + $(this).serialize() + '&p='+random;
               fetch(url, {
               credentials: 'same-origin',
               method: 'GET'
           }).then(function (response) {
               response.text().then(function (content) {
                      document.location = '/account';
                 
               });
           })
               .catch(function(request){
                   alert(request.responseText);
               
               
               });
        });


});
/**---========[ MÁS VENDIDOS ]==============------*/
DT.mas_vendidos = { 
    n_pag: 0,
    colecciones:[],
    init:function(params){ 

        console.log('[mas_vendidos]=\n',params) 

        $('.btn_filtro_mas_vendidos').click(function(e){
            e.preventDefault()
            $('#ul_filtros').find('li').removeClass('selected-item')
            $(this).parent().addClass('selected-item')
            DT.mas_vendidos.filtrar( $(this).data('categoria') )
        }) 
        DT.mas_vendidos.carousel();
         
        if(params != 'todos'){ 
              DT.mas_vendidos.filtrar( params )
        }

    }, 
    carousel: function(){
        if (DT.isMobile()) {
            $('.cards').flickity({
                freeScroll: true,
                pageDots: false,
                wrapAround: true
            });
        }  else {   
            $('.cards')
                .addClass('cards-carousel');
            $('.cards').flickity({
                groupCells: true,
                cellAlign: 'left',
                pageDots: false,
                draggable: false,
                lazyLoad: true,
                imagesLoaded: true
            });           
        }
    }, 
    filtrar: function(categoria){
        $('.carrusel-bloque').hide()
        $('#MV_'+categoria ).show()
        $('.cards').flickity('resize');

    }
}
DT.mas_vendidos.init(window.mas_vendidos_params)
/**---========[ PRODUCT ]==============------*/
DT.product = {
    init: function (params) {
        console.log('[PRODUCT] INIT =\n', params)
        this.applay_behaviors();
        this.product_brothers();

    },
    applay_behaviors: function () {


        //-----------MAIN SECTION TITLE---------- 
        $('.product-name.main').click(function (e) { 
            if (window.innerWidth < 1024) {
                var target = $('.product-description').eq(0)
            } else {
                var target = $('#shopify-section-product-descripcion-extra')
            }
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top - 100
                }, 1000);
            }

        })

        $('#btn_producto_leermas').click(function (e) {
            e.preventDefault()
            var target = $('#shopify-section-product-descripcion-extra')

            $('html, body').animate({
                scrollTop: target.offset().top - 100
            }, 1000);
        })



        //-----------BOTONES----------
        //Quantity controls
        $('.btn_quantity').click(function (e) {
            let quantity = 1 * $('.dv_quantity').eq(0).text()
            e.preventDefault()
            if ($(this).hasClass('trash')) {
                quantity = 1
            }
            if ($(this).hasClass('plus')) {
                quantity = quantity + 1
            }
            if ($(this).hasClass('minus')) {
                if (quantity > 1) {
                    quantity = quantity - 1
                }
            }
            $('.dv_quantity').text('').text(quantity)
            $('.btn_quantity').attr('data-q', quantity)
            $('.button-add-p').attr('data-q', quantity)
            $('.add_muestra').attr('data-q', quantity)
            $('#variant').attr('data-q', quantity)
        });


        //-----------STICKY CART----------
        if (window.innerWidth < 768) {
            $('#sticky-cart').fadeIn()
        }
        $(document).on('scroll', function () {
            if ($('.general-product-form').length && window.innerWidth < 768) {
                if ($('.general-product-form').isInViewport()) {
                    $('#sticky-cart').fadeOut()
                } else {
                    $('#sticky-cart').fadeIn()
                }
            } 

        });
       
      
        return true;
    },

    product_brothers: function() {
        var collections = []; 
 
        var url = location.pathname + '?view=product-brothers-ajax';
        
    fetch(url, {
      credentials: 'same-origin', 
      method: 'GET'
    }).then(function (response) {
      response.text().then(function (content) {
        var content_filtered = replaceAll(content, ',]', ']')
        collections = JSON.parse(content_filtered);
        
        for (var i = 0; i < collections.length; ++i) {
          var col = collections[i].filter(item => item.id != productId);
          collections[i] = col;
        }
        filterCollections(collections);
      });
    });  
  
    function filterCollections(cols){ 
      var cols = [];
      var items = []; 
      for (var i = 0; i < collections.length; ++i) {
  
        var colCat = collections[i].filter(function(item){
          return item.tags.indexOf(categoria) >=0
        });
  
        if(colCat.length > 0) {cols[i] = colCat}
        else { cols[i] = collections[i] }
  
        var colBrand = cols[i].filter(function(item){
          return item.tags.indexOf(marca) >=0
        }); 
  
        if(colBrand.length > 0) cols[i] = colBrand;
        
  
        if (i === 0) {
          const n = 2;
          const sample = cols[i]
            .map(x => ({ x, r: Math.random() }))
            .sort((a, b) => a.r - b.r)
            .map(a => a.x)
            .slice(0, n);        
            items.push(...sample);
        } else {
            items.push(cols[i][Math.floor(Math.random() * cols[i].length)]);
        }
      }    
      var container = document.getElementById('product-brothers');
      container.innerHTML = formatProductBrothers(items);
      DT.wishlist.init();
      
          $('#product-brothers').flickity({
            pageDots: false,
            cellAlign: 'center',
            groupCells: true     
      });
    }
      function formatProductBrothers(items) {
        var productBrothers  = ' ';
        _.each(items,  (prod) => productBrothers += DT.cards.init(prod));
        return productBrothers;
    }
    
    }


}
const productTemplate = document.getElementById('product-template')
if(productTemplate){
   DT.product.init({
      product_handle: productTemplate.getAttribute('data-handle')
   }) 
}

