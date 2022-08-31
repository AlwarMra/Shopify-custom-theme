
console.log('::::::CART MUESTRAS:::::');

DT.cart = {
  add_to_cart:function( item, callback = false){
    
    
          fetch('/cart/add.js', {
            method: "post",
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(item)
          })
          .then(response => {

            console.log(' producto add_to_cart response-> ', response);
            
             if (callback)    callback();
              
            DT.mini_cart.get_cart(DT.mini_cart.format_mini_cart, true)

          }) 
     
     
  },
    checkout: function () { 
      
      $('.go-checkout').addClass('loading-btn')
      var attr_string = 'attributes[catalogue]='+window.promo_assets.catalogue
      					+'&attributes[flyer]='+window.promo_assets.flyer
                         
      console.log('checkout>>>>>', window.promo_assets,  attr_string  );
      
     
      
     	$.post('/cart/update.js', 
               attr_string)
          .done( function(){ 
              DT.cart.check_cart(function(){
              	 document.location = '/checkout'
              }) 

          });
      
    },
    check_cart:function( callback = false){  
      
        console.log('[CART CHECK] cart',DT.mini_cart.cart)
     
      
       var cart_items = []
            
            _.each( DT.mini_cart.cart.items,function(item){
              if(item.properties._is_free !== 'false'){
                cart_items.push({
                  id: item.id,
                  product_id: item.product_id,
                  variant_id: item.variant_id,
                  properties: item.properties,
                  sku: item.sku,  
                  q: item.quantity
                })
              }
            })
      
         
            console.log('[CART CHECK]',    cart_items  ) 
              
             
            $.post( "https://blacklabelparfum.com/sfapp/addmuestra/cart_check.php",
                  {	
                  'tienda':window.country,
                  'itemsCart':cart_items 
                	} 
                  ).done(function( data ) {
              
                      console.log('[CART CHECK]->GET',data)
                      const json_data = JSON.parse(data)
                      
                      
                      if( json_data.status == 'OK-CHECK' ){ 

                          console.log('[CART CHECK]->OK-CHECK', json_data.variants_ids_lack) 
								let updates = []
                            _.each( json_data.variants_ids_lack,function(item){ 
                            
                              	  console.log('[CART CHECK]->GET item',item)
                                  updates.push( 'updates['+item.id+']='+item.quantity )
                            })
                                   
                            var updates_string = updates.join('&')
                            
                             console.log('[CART CHECK]->GET updates_string',updates_string)
                          
                          
                          $.post( 
                             '/cart/update.js',
                              updates_string
                          ).done(function(data){
                          	
                          	 console.log('[CART CHECK]->GET update',data)
                            if( callback) callback() 
                            
                              })
                          
                          /*
                          fetch('/cart/add.js', {
                            method: "post",
                            headers: { 'content-type': 'application/json' },
                            body: JSON.stringify({ items: json_data.variants_ids_lack })
                          })
                          .then(response => { 
                            	if( callback) callback() 
                          }) 
                          */
                          

                      } else {
                      	if( callback) callback() 
                      }
                  
                }); 
      
    
    }

}

DT.mini_cart = {
    init: function () {

        $('#openModal').on('click', ()=> DT.mini_cart.openCart());
        /*
        * Load minicart on page load
        */
        DT.mini_cart.get_cart(DT.mini_cart.format_mini_cart, false);

        $(document).on('click', '.cart-qty-control-minicart, .btn_quantity', function (event) {
            event.preventDefault();
            console.log('---cart-qty-control-minicart---')
            DT.mini_cart.updateQty($(this));
        });

        $(document).on('click', '.cart-remove', function (event) {
            event.preventDefault();
            DT.mini_cart.updateQty($(this));
        });

      

        if (window.innerWidth >= 764) {
            $(document).on("click", '#btn_open_side_cart', function (e) {
                e.preventDefault();
                //DT.mini_cart.openCart(); 
                    var loc = document.location.toString()
                    if (loc.indexOf('cart') < 0) {
                        DT.mini_cart.openCart();
                }

            });
        }

      
      
        /*  */
        $(document).on("click", '.button-add-p, .button-buy, .button-add', function (e) {
            e.preventDefault();
          
          
          	//MAIN PRODUCT
            var product_variant =  
            			 $(this).attr('data-rel') 
            			|| $(this).attr('data-variant');

          
             console.log('[button-add] product_variant', $(this), product_variant)
             
           
             //MAIN PROD -----------------------------------------
             var compared = $('#variant').attr('data-compared') ||  $(this).attr('data-compared')
              var prop = {
                  _compare_at_price: compared,
                  _is_main_product: true,
                  _is_free: $(this).attr('data-free')
              } 

              var myProduct = {
                  id: product_variant,
                  quantity: 1,
                  properties: prop
              } 
              console.log('[button-add] product_variant', $(this), product_variant)
              
              //FREE MUESTRA -----------------------------------------
              var free_muestra_id = $(this).attr('data-free') || 'false' 
              if( free_muestra_id != 'false'){
                  var free_muestra = {
                      id: free_muestra_id,
                      quantity: 1,
                      properties: {
                          _compare_at_price: 0,
                          _id_associated: product_variant,
                          _is_free_tB: true
                      }
                  }

                  DT.mini_cart.muestras_gratis.add(free_muestra)
              }
              
          
          	

               DT.cart.add_to_cart(myProduct, function () {    
                  $(e.target).hasClass('go-checkout') ? DT.cart.checkout() :  DT.mini_cart.format_mini_cart(DT.mini_cart.openCart) 
            	});
          
          return;
             
          
           	console.log('[button-add] VariantsToAdd->myProduct', VariantsToAdd)
             
          
             
          	//console.log('[button-add] VariantsToAdd->free_muestra', VariantsToAdd)
            
         	 console.log('[button-add] free_muestra', free_muestra)
            
            
            
             return
               
			//ADD TO CART
            DT.cart.add_to_cart(VariantsToAdd, function () { 
              
               	//DT.cart.check_cart()
              
                $(e.target).hasClass('go-checkout') ? DT.cart.checkout() : DT.mini_cart.openCart()
            });
          
        });
     
   
      

        $(document).on("click", '#cart_modal_checkout', function (e) {
			e.preventDefault();
            DT.cart.checkout();
        })
        $(document).on("click", '#cart_page_checkout', function (e) {
			e.preventDefault();
            DT.cart.checkout();
        })
        $(document).on("click", '#cart_modal_seguir', function (e) {
            e.preventDefault();
            DT.mini_cart.closeCart();
        })





        /*
         * Close minicart when user clicks outside minicart
         */
        $('.backdrop, .page-overlay').click(() => {
            console.log('cart to close')
            DT.mini_cart.closeCart();
        });

        /*
         * Close minicart when user clicks close minicart icon (X)
         */
        $(document).on("click", '.close-cart,  .page-overlay', DT.mini_cart.closeCart)


    },
  	muestras_gratis:{
    get:function(){
    	 		let muestras_gratis = []
              
                if( window.localStorage.getItem('muestras_gratis') ){
                	muestras_gratis = JSON.parse(  window.localStorage.getItem('muestras_gratis') )
                }
              
      		return muestras_gratis
    
    },
      add:function(item_muestra){
        	   let muestras_gratis = []
        
        		if( window.localStorage.getItem('muestras_gratis') ){
                	muestras_gratis = JSON.parse(  window.localStorage.getItem('muestras_gratis') )
                }
        		 muestras_gratis.push(item_muestra)
                 
                 window.localStorage.setItem('muestras_gratis', JSON.stringify(muestras_gratis))
                 
                 return muestras_gratis
        	
      
      }
  },
    show: function (update = false) {
        console.log('[[[[ SHOW MINICART ]]]] update:', update)

        if (update) {
            DT.mini_cart.get_cart(function () {
                if (DT.mini_cart.format_mini_cart()) {
                    DT.mini_cart.openCart()
                }
            })

        }
    },
    /*
     * Update quantity of cart item
     */
    updateQty($el) {
        var action = '';
        const qtyInit = $el.data('q');
        let newQty;
        if ($el.hasClass('plus')) {
            newQty = (1 * Number(qtyInit)) + 1;
            action = 'plus';
        } else if ($el.hasClass('minus')) {
            newQty = (1 * Number(qtyInit)) - 1;
            action = 'minus';
        } else {
            newQty = (1 * Number(qtyInit)) - 1;
            if (newQty == -1) {
                newQty = 0;
            }
            action = 'remove';
        }

        var dataId = $el.data('rel');
        var dataAssociated = $('.cart__item[data-associated="' + dataId + '"]').data('rel');
        if (newQty == 0) {
            $('.minicart-items .cart__item[data-rel="' + dataId + '"]').addClass('evaporar');
            $('.minicart-items .cart__item[data-associated="' + dataId + '"]').addClass('evaporar');
        }
        if (dataAssociated) {
            var updateProducts = 'updates[' + dataId + ']=' + newQty + '&updates[' + dataAssociated + ']=' + newQty;
        } else {
            var updateProducts = 'updates[' + dataId + ']=' + newQty
        }
        $.ajax({
            type: 'POST',
            url: '/cart/update.js',
            data: updateProducts,
            dataType: 'JSON',
            success: function (data) {
                console.log('[[--update--]]', data);
                var prod = data.items.find(id => id.id === dataId);
                prod ? DT.data_layer.update(action, prod) : DT.data_layer.remove_product($el.data('handle'));
                if ($el.hasClass('maincart') || $el.hasClass('cartTemplate')) {
                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                } else {
                    DT.mini_cart.cart = data
                    DT.mini_cart.format_mini_cart();
                }
            },

        });

    },

    /*
     * Opens the minicart
     */
    openCart() {
        console.log('cart openCart')
        $('#cart_modal').removeClass('close').addClass('open');
        $('.page-overlay').addClass('is-visible');
        $('html').addClass('no-scroll');
        $('#cart_modal_checkout, #cart_modal_seguir, #shopping-number').show();
    },

    /*
     * Closes the minicart when invoked
     */
    closeCart() {
        $('#cart_modal').removeClass('open').addClass('close');
        $('.page-overlay').removeClass('is-visible');
        $('html').removeClass('no-scroll');
    },
    get_cart: function (callback = false) {
        console.log('[[[[ GET CART ]]]]')
        $.get('/cart.json', function (data) {
            console.log('[[[[ NEW CART ]]]]', data)
            
            let items_to_remove = []
            
            _.each(data.items, function (myitem) {
              console.log('[CART]-->ITEM', myitem.properties._id_associated)
              if( myitem.properties._id_associated) {
              	items_to_remove.push(myitem.id)
              } 
            })
            
            if( items_to_remove.length ){
              	//quitar las muestras y recargar
              
               console.log('[CART]-->BORRA MUESTRAS',items_to_remove)
               
               //"updates[794864053]=2&updates[794864233]=3"

                
               let the_updates = []
               _.each(items_to_remove,function(id_item){
                 //the_updates.push( {id: id_item,   quantity: 0})
                 the_updates.push('updates['+id_item+']=0')
               })

 				console.log('[CART]-->updates',the_updates.join('&')) 
                
                
                
                $.ajax({
                  type: 'POST',
                  url: '/cart/update.js',                
                  data: the_updates.join('&'),
                  dataType: 'JSON',
                  success: function (data) {
                  	DT.mini_cart.cart = data
                  	if (callback)  callback(data)
                    console.log('FFFFFFFFFFFFFFFFFF', data)
                  }                
                })
                
                
                
               // $.post('/cart/update.js',   the_updates.join('&')  )
                //.done( function(cart){  
                 // console.log('[CART]-->UPDATED',cart)
                  // DT.mini_cart.cart = data
                // console.log('FFFFFFFFFFFFFFFFFF', data)
              	//if (callback)  callback(data);
                //}); 
            
            } else {
            	 DT.mini_cart.cart = data
                 
              	if (callback)  callback(data);
               
            }
             
            
           
          
          
        });
    },
    format_mini_cart: function (callback = false) {
        console.log('[[[[format_mini_cart]]]]', DT.mini_cart.cart);

        data = DT.mini_cart.cart
        
        $('#cart_modal_inner').html('');

        var countCart = 0
        var counting = data.items.filter(elem => {
          if(elem.price > 0) {
              countCart = parseInt(countCart + elem.quantity)
          }
          return false
        }).length
        $('#shopping-number').find('span').text(countCart).show()
        
        
        
        if (data.items.length === 0) {
            $('#cart_modal_inner,#cart_inner').html('<p class="minicart__title-empty section-title">' + DT.str['no_tienes_productos'] + '</p>').show();
            $('#cart_modal_total,.cart_total,#minicart-header-banner,.minicart-buttons-box,#shopping-number').hide();
            $('#cart_modal_totals_inner,#cart_modal_checkout, #cart_checkout, #cart_modal_seguir').hide();
            $('.minicart-crossed-sell').hide();
            //$('#cart_modal_inner').css('margin', 30);
            $('.header-cart').removeClass('with_items');
            $('#cart-bubble').addClass('hidden');
            $('.minicart__qty-total,#cart_modal_totals_inner').text('');
            $('.minicart__default_content').show();


        } else {

            if (data.items.length > 2) {
                $('.minicart-buttons-box').addClass('sombra');
            }

            $('#cart_modal').removeClass('cart-empty');

            $('.minicart__qty-total').text('(' + countCart + ')');
            $('#cart_modal_total,.cart_total,#minicart-header-banner,.minicart-buttons-box,.minicart-totals, .minicart-crossed-sell').show();
            DT.mini_cart.envio_gratis(data.total_price);


            $('.header-cart').addClass('with_items')
            $('#cart-bubble').removeClass('hidden')

            const cartHtml = _.template($('#cart_line_template').html());

            const newFormat = DT.money_format;

            $('#cart_modal_inner').append('<div class="minicart-items"></div>');

            _.each(data.items, function (myitem) {
              if(myitem.final_line_price !== 0) {
                myitem.handle = myitem.handle;
                myitem.img_url = myitem.image;

                
                var product_title_parts = myitem.title.split('|');
            	var titulo_producto = product_title_parts[0];
              	var similar_a = DT.str['Similar a']
              	var de = DT.str['de']
                if (product_title_parts[1]) {
                  var marca = product_title_parts[1].replace(similar_a, '').split(de)[1]
                  var imitation_product = product_title_parts[1].replace(similar_a, '').split(de)[0]
                } else {
                    var imitation_product = ''
                }
                if (!marca) {
                    marca = 'Divain'
                }    
         
                    myitem.title =  `<div style="width:100%">`    
              + `<p><span class="mincart-title-top">${titulo_producto} - ${similar_a}</span><br>`    
              + `<span class="minicart-product-name">${imitation_product} ${de} ${marca}</span></p></div>`
                
                  myitem.try_title_top = `${DT.str['muestra_gratis']} <span class="trybuy-modal">${DT.str['tryandbuy']}</span><a class="info" href="${DT.str['trybuy_link']}"><span>i</span></a>`
                myitem.try_title_bottom = `${titulo_producto} ${DT.str['Similar a']} ${imitation_product} ${DT.str['de']} ${marca}`              
                
                
                myitem.properties._is_free !== 'false' ? myitem.sample = true : myitem.sample = false
                 
                myitem.try_title = ''

                
                myitem.formatted_price = Shopify.formatMoney(myitem.final_line_price, newFormat)
                myitem.quantity_txt = myitem.quantity + ' Unidad'
                if (myitem.quantity > 1) {
                    myitem.quantity_txt += 'es'
                }
                if (myitem.total_discount === 0) {
                    if (myitem.properties._compare_at_price != '' && myitem.properties._compare_at_price != 0) {
                        myitem.discount_price = '<span class="crossed-price">' + Shopify.formatMoney(myitem.properties._compare_at_price * myitem.quantity, newFormat) + '</span>'
                    } else {
                        myitem.discount_price = '';
                    }
                } else {
                    myitem.discount_price = '<span class="crossed-price">' + Shopify.formatMoney(myitem.final_line_price + myitem.total_discount, newFormat) + '</span>'
                }
                const lineHtml = cartHtml(myitem);
                $('.minicart-items').append(lineHtml);
              }
            });

            const subtotal = Shopify.formatMoney(data.total_price, newFormat);
            let iva = data.total_price - (data.total_price / 1.21)
            iva = Shopify.formatMoney(iva, newFormat)

            var gastos_envio = DT.gastos_envio
            if (data.total_price > window.envio_gratis_importe * 100) {
                gastos_envio = 0
                // $('#minicart-header-banner').hide();
            }

            var total_total = data.total_price;
            total_total = Shopify.formatMoney(total_total, newFormat)

            var total_discount = data.total_price + data.total_discount;
            if (total_discount === data.total_price) {
                total_discount = ''
            } else {
                total_discount = Shopify.formatMoney(total_discount, newFormat);
            }
            DT.mini_cart.format_cross_sell()
            $('#cart_modal_totals_inner').html(
                '<div id="cart_modal_total" class="cart-totals cart_modal_total">' +
                '  <div class="cart-totals-label">' + DT.str['total'].toUpperCase() + ' <span class="iva_incluido">(' + DT.str['iva_incluido'] + ': ' + iva + ')</span></div>' +
                '  <div class="cart-totals-value">' + total_total + '</div>' +
                '</div>',
            ).show();

            $('#subtotal_price').html(subtotal);
            $('#cart_modal_checkout, #cart_modal_seguir').show();
            $('#cart_modal_inner').css('margin-bottom', 0);
        }

        // Open cart
        if (data.openCart) {
            DT.mini_cart.openCart()
        }
      if (callback && typeof callback === 'function')   callback();
          
      
    },
    format_cross_sell: function(){     
        const prods = window.cross_sell_products
        var HTMLCrossSell = ''
        var CrossProds = ''
        _.each(prods, (prod) => {
              
          	var crossedPrice = ''
            if(prod.compare_price > prod.price) crossedPrice = `<span class="crossed-price">${prod.price_format_compared}</span>`
          
              const lineItem = `<div class="cart__item">
								<div class="cart__wrapper">
								<div class="cart__img">
								<a href="${prod.url}"><img class="lazyload" data-src="${prod.img}" alt="${prod.title}"></a>
								</div>
								<div class="cart-content">
								<a href="${prod.url}"><div style="width: 100%;"><p>
								<span class="mincart-title-top">${prod.title_top} - ${window.similar_a}</span><br>
								<span class="minicart-product-name">${prod.name }</span></p></div></a>
								<div class="crossed_price"><p style="font-weight: bold;">${crossedPrice}
								<span>${prod.price_format}</span></p>
								<button class="button button-add" data-free="${prod.free}"
								data-compared="${prod.compare_price}" data-variant="${prod.id}">${window.buy_now}</button>
								</div></div></div></div>`
              
              CrossProds+=lineItem
              })       
        HTMLCrossSell = `<h4 class="crossed_product_title">${DT.str['completa_pedido']}</h4>
						<div class="crossed-sell-slider">${CrossProds}</div>`       
        $('#cross-sell').html(HTMLCrossSell).show()
        $('.crossed-sell-slider').flickity({
            prevNextButtons: false,
            autoPlay: true,
            wrapAround: true
        });
      },
    envio_gratis: function (total_price) {
        var precio_envio_gratis = window.envio_gratis_importe * 100;
        var falta_para_envio_gratis = ((precio_envio_gratis - total_price) / 100).toFixed(2);
        var progress = (1000 - ((precio_envio_gratis - total_price)*1000)/precio_envio_gratis )/10;
        console.log(progress);
        if (falta_para_envio_gratis > 0) {
            falta_para_envio_gratis.replace('.', ',');
            var div_aununcio = 
            '<progress id="progress" max="100" value="'+progress+'"></progress><p>'
            +window.envio_icon
            + window.envio_gratis_text.split('XX').join('<b>' + falta_para_envio_gratis + '</b>')
            +'</p>';
        } else {
            var div_aununcio = 
            '<progress id="progress" max="100" value="100"></progress><p>'
            + window.envio_icon + window.envio_gratis_finish +'</p>';
        }
        $('.envio-gratis').html(div_aununcio);
    }
};
DT.data_layer = {
    format_prod(data) {

        var product_title_parts = data.title.split('|');
        var similar_a = DT.str['Similar a'];
        var de = DT.str['de'];
        if (product_title_parts[1]) {
            var marca = product_title_parts[1].replace(similar_a, '').split(de)[1];
        } else {
            var marca = 'Divain';
        }
        var categoria = product_title_parts[2];

        if (!marca) marca = 'Divain';
        if (!categoria) categoria = '';

        return prod = {
            'name': data.title,
            'id': data.sku,
            'price': data.final_price,
            'brand': marca,
            'category': categoria,
            'quantity': 1
        }
    },
    add(prod, data) {
        var impression = this.format_prod(data);
        impression.quantity = prod.quantity;
        var event = {
            'event': 'addToCart',
            'ecommerce': {
                'currencyCode': 'EUR',
                'add': {
                    'products': [impression]
                }
            }
        }
        const index = dataLayer.findIndex(elem => elem.event === "addToCart");
        if (index != -1) {
            dataLayer[index].ecommerce.add.products.push(impression);
        } else {
            dataLayer.push(event);
        }
    },
    update(action, data) {
        data.title = data.product_title;
        var impression = this.format_prod(data);
        if (action == 'plus') {
            for (let i = 0; dataLayer.length > i; i++) {
                if (dataLayer[i].event == 'addToCart') { dataLayer[i].ecommerce.add.products.push(impression) };
            }
        }
        else if (action == 'minus') {
            for (let i = 0; dataLayer.length > i; i++) {
                if (dataLayer[i].event == 'removeFromCart') { dataLayer[i].ecommerce.remove.products.push(impression) };
            }
        }

    },
    remove_product(prod) {

        $.ajax({
            type: 'GET',
            url: '/products/' + prod + '.js',
            dataType: 'JSON',
            success: function (product) {
                var impression = DT.data_layer.format_prod(product);
                var event = {
                    'event': 'removeFromCart',
                    'ecommerce': {
                        'currencyCode': 'EUR',
                        'remove': {
                            'products': [impression]
                        }
                    }
                }
                const index = dataLayer.findIndex(elem => elem.event === "removeFromCart");
                if (index != -1) {
                    dataLayer[index].ecommerce.remove.products.push(impression);
                } else {
                    dataLayer.push(event);
                }
            }
        });
    }

};

DT.mini_cart.init()