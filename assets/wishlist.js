console.log('::::::WISHLIST:::::');
DT.wishlist = {

    data: JSON.parse(window.localStorage.getItem('GL_WISHLIST')) || { customer: false, products: [] },
    init: function () {
        const that = this;
        if(this.data.products.length > 0) {$('.wish-link').addClass('active')} 
        console.log('Wishlist products',this.data.products)
        // Add Customer
        if (window.customer && !this.data.customer) {
            this.data.customer = window.customer;
            window.localStorage.setItem('GL_WISHLIST', JSON.stringify(this.data))
        }

        this.is_wishlist_page();
        // Wishlist icon click event
        $('.love-container').on('click', function (e) {
            e.preventDefault();
            var handle = $(this).data('handle');
            if ($(this).hasClass('active-wish')) {
                $(this).removeClass('active-wish');
                that.remove(handle);
                if ($('#product-wishlist').length) that.inner_text($(this).find('.love-text').get(0), false);
            } else {
                $(this).addClass('active-wish');
                that.get_product(handle, (product) => that.save(product));
                if ($('#product-wishlist').length) that.inner_text($(this).find('.love-text').get(0));
            }
        });
        // Copy share link to clipboard
        $('#copy').on('click', function () {
            var $temp = $('<input id="url-hidden">');
            $('body').append($temp);
            $temp.val($('#paramsUrl').val()).select();
            document.execCommand("copy");
            $temp.remove();
            $(this).addClass('copied');
            setTimeout(() => {
                $(this).removeClass('copied');
            }, 2000);
        });
        // Add all products to cart
        $('#add_all').on('click', function () {
            $(this).addClass('button-deactivate');
            var prodList = [];
            if (window.location.search) {
                var count = 0;
                $('.love-container').each(function () {

                    var compare = { _compare_at_price: $(this).data('compared') };
                    var prod = {
                        id: $(this).data('id'),
                        properties: compare
                    }
                    
                    if($(this).data('free')!='false' || $(this).data('free')!=undefined) {
                      var free = {
                        id: $(this).data('free'),
                        properties: {
                          _compare_at_price: 0,
                          _id_associated: $(this).data('id')
                        }
                      }
                      prodList.push(free);
                    }
                    
                    prodList.push(prod);
                    count++;
                    if (count == $('.love-container').length) that.add_all(prodList);
                });
            }
            else {
                var my_wish = that.data.products;
                for (let i = 0; my_wish.length > i; i++) {
                  var compare_prop = { _compare_at_price: my_wish[i].compare_at_price }
                    var prod = {
                        id: my_wish[i].id,
                        properties: compare_prop
                    }
                    if(my_wish[i].free != 'false' || $(this).data('free')!=undefined) {
                      var free = {
                        id: my_wish[i].free,
                        properties: {
                          _compare_at_price: 0,
                          _id_associated: my_wish[i].id
                        }
                      }
                      prodList.push(free);
                    } 
                    prodList.push(prod);
                }
                that.add_all(prodList);
            }
        });
    },
    is_wishlist_page: function () {
        //Build URL with parameters
        // Check if we are in the wishlist page
        var productUrls = [];
        if ($('#wishlist-page').length) {
            if (window.location.search) {
                const query = window.location.search;
                var urlParams = new URLSearchParams(query);
                var productUrls = urlParams.get('ids').split('|');
                document.getElementById('paramsUrl').value = window.location.href;
                this.share_button(window.location.href);
                this.get_product_from_url(productUrls);
            } else {
                for (let i = 0; this.data.products.length > i; i++) {
                    var prod = this.data.products[i];
                    prod.handle ? productUrls.push(prod.handle) : productUrls.push(prod.product_handle);
                }
                var urlParams = window.location.href + '/?ids=' + productUrls.join('|');
                document.getElementById('paramsUrl').value = urlParams;
                this.share_button(urlParams);
                this.format_products(this.data.products);
            }
        } else {
            this.is_in_wishlist();
        }
        //

    },
    save: function (prod) {
        var finding = this.data.products.find(id => id.product_id === prod.product_id);
        if (!finding) this.data.products.push(prod);
        window.localStorage.setItem('GL_WISHLIST', JSON.stringify(this.data));
        // return true
    },
    remove: function (handle) {
        this.data.products = this.data.products.filter(obj => obj.product_handle !== handle);
        window.localStorage.setItem('GL_WISHLIST', JSON.stringify(this.data));
    },
    get_product: function (prod_handle, callback) {
        $.ajax({
            type: 'GET',
            url: '/products/' + prod_handle + '.js',
            dataType: 'JSON',
            success: function (product) {
                console.log(product);
                var available = false;
                if (product.variants[0].available) available = true;
              	var free = 'false';
              for(let i = 0; product.variants.length > i; i++) {
                if (product.variants[i].price == 0 && product.variants[i].available) {free = product.variants[i].id; break;}
              }
             	
                product = {
                    product_handle: product.handle,
                    product_id: product.variants[0].id,
                    product_id_params: product.id,
                    product_url: product.url,
                    product_title: product.title,
                    product_image: product.featured_image,
                    product_image_2: product.images[2],
                    product_available: available,
                  	free: free,
                    price: product.variants[0].price,
                    price_format: product.variants[0].price,
                    compare_at_price: product.variants[0].compare_at_price,
                    compare_price_format: product.variants[0].compare_at_price,
                    tags: product.tags,
                    type: product.type,
                    time: Date.now() / 1000
                }
                if (callback) callback(product);
            }
        });
    },
    is_in_wishlist: function () {
        // Check if products are within the wishlist
        const my_products = this.data.products.map(function (handles) {
            return handles.product_handle;
        });
        const my_wish = $('.love-container');
        for (let i = 0; i < my_wish.length; i++) {
            for (let j = 0; j < my_products.length; j++) {
                if (my_wish[i].dataset.handle === my_products[j]) {
                    my_wish[i].classList.add('active-wish');
                }
            }
        }
    },
    inner_text: function (elem, is_in = true) {
        is_in ? elem.innerText = DT.str['wishlist_in'] : elem.innerText = DT.str['wishlist_out']
    },
    format_products: function (elems) {
        var wishHtml = _.template($('#wishlist_template').html());
        const newFormat = DT.money_format;
        elems.forEach(function (item) {

            item.similar = DT.str['Similar a'];
            item.of = DT.str['de'];

            var product_title = item.product_title.split('|');
            item.title = product_title[0];
            item.name = product_title[1].replace(item.similar, '').split(item.of)[0];

            item.handle = item.product_handle;
            item.id = item.product_id;
            item.url = item.product_url;
            item.image = item.product_image;
            item.image_2 = item.product_image_2;
            item.categoria = 'HOMBRE';
            item.marca = 'Divain';
          	
            var oferta1 = '';
            var oferta2 = '';
            var special = '';
            
            item.tags = item.tags;
            item.tags.forEach(function (tag) {
                if (tag.includes(':')) tag = tag.trim().split(':');
                if (tag[0] == 'categoria') item.categoria = tag[1].toUpperCase();
                if (tag[0] == 'marca') item.marca = tag[1];
                if (tag[0] == 'oferta') oferta1 = '<span class="tagoffer">' + tag[1] + '</span>';
                if (tag[0] == 'oferta2') oferta2 = '<span class="tagoffer2">' + tag[1] + '</span>';
                if (tag[0] == 'novedad') oferta2 = '<span class="novedad">New</span>';
                if (tag[0] == 'musthave') oferta2 = '<span class="musthave">Must Have</span>';
                if (tag[0] == 'special') special = `<span class="special">${DT.str["special"]}</span>`;
            });
            categoria_tag = `<span class="category">${item.categoria}</span>`;
            if (oferta1 != '' || oferta2 != '' || special != '') {
                item.oferta = `<p class="card-offer">${categoria_tag} ${oferta1} ${oferta2} ${oferta1}</p>`
            }
            else if (oferta1 != '' || oferta2 != '') {
                 item.oferta = `<p class="card-offer">${categoria1_tag} ${oferta2} ${oferta1}</p>`
                } else {
                    item.oferta = '';
                }

            item.available = item.product_available;
			item.free = item.free;
            
          	item.compare_at_price = item.compare_at_price;
            item.price = item.price;
            item.price_format = Shopify.formatMoney(item.price, newFormat);
            if (item.compare_at_price != null) {
                item.compare_price_format = Shopify.formatMoney(item.compare_at_price, newFormat);
            }
            // item.rating = ' <div id="TP_' + item.product_id + '" class="trustpilot-widget" data-locale="' + window.truspilot.locale + '"'
            // + ' data-template-id="' + window.truspilot.template_id + '"'
            // + ' data-businessunit-id="' + window.truspilot.businessunit_id + '"'
            // + ' data-style-height="24px"'
            // + ' data-style-width="100%"'
            // + ' data-theme="light"'
            // + ' data-sku="' + sku + '">'
            // + ' </div>'
            const itemHtml = wishHtml(item);
            $('.best-sellers-cards').append(itemHtml);
        });

        $('.add-all-container').show();
        this.is_in_wishlist();
    },
    get_product_from_url: function (elems) {
        var that = this;
        var productsUrl = [];
        var count = 0;
        elems.forEach(function (handle, index, array) {
            that.get_product(handle, function (prod) {
                productsUrl.push(prod);
                count++;
                if (count === array.length) that.format_products(productsUrl);
            });
        });
    },
    add_all: function (prodList) {
        const that = this;
        $('.loading-wish').show();
        if (prodList.length > 0) {
            let product = prodList.pop();
            $.ajax({
                type: "POST",
                url: '/cart/add.js',
                dataType: 'json',
                data: {
                    id: product.id,
                    q: 1,
                    properties: product.properties
                },
                success: function (data) {
                    that.add_all(prodList);
                },
                error: function () { console.log('error') }
            });
        } else {
            document.location = '/cart';
        }

    },
    share_button: function (url) {
        if (window.innerWidth <= 768) {
            if (navigator.share) {
                $('#share-mb').show();
                $('#share-mb').on('click', () => {
                    navigator.share({
                        title: DT.str['wishlist_share_title'],
                        text: DT.str['wishlist_share_text'],
                        url: url,
                    })
                        .then(() => console.log('Successful share'))
                        .catch((error) => console.log('Error sharing', error));
                });
            } else {
                $('.share-button').show();
                document.getElementById('share-facebook').href = 'https://www.facebook.com/sharer.php?u=' + url;
                document.getElementById('share-whatsapp').href = 'whatsapp://send?text=' + url;
                document.getElementById('share-mail').href = "mailto:?subject=" + DT.str['wishlist_share_title'] + "&body=" + DT.str['wishlist_share_text'] + ' ' + url;
            }
        } else {
            $('.share-button').show();
            document.getElementById('share-facebook').href = 'https://www.facebook.com/sharer.php?u=' + url;
            document.getElementById('share-whatsapp').href = 'whatsapp://send?text=' + url;
            document.getElementById('share-mail').href = "mailto:?subject=" + DT.str['wishlist_share_title'] + "&body=" + DT.str['wishlist_share_text'] + ' ' + url;
        }
        // document.getElementById('share-insta').href = 'whatsapp://send?text=' + url;

    }
}
$(document).ready(function () {
    DT.wishlist.init();
})