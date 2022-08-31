DT.last_products = {
    t: { anadelo_por: window.anadelo },
    n_prod: window.ultimas_n || 16,
    current_index: 0,
    init: function (params) {
        console.log('[LAST PRODUCTS]=\n', params)
        if (params.this_product && window.paramsUltimas) {
            console.log('SSSSSSSSSSSSSSSS')
            this.save(params.this_product)
        }
        if (this.show_last_products()) {
            this.applay_behaviors();
            var url = $('.card_0').attr('data-link') + '.json';
            this.update_price(url);
        }
    },
    applay_behaviors: function () {

        console.log('[LAST PRODUCTS] -> applay_behaviors')



        $(document).on('click', '.product_card_', function (e) {
            e.preventDefault()
            DT.last_products.mover()
        })

        //$(document).on('dragstart','.product_card', function(e){ 
        //$(this).addClass('grabbing')
        //})  

        $('#btn_cards_next').click(function (e) {
            e.preventDefault()
            console.log('[LAST PRODUCTS]=\n', 'btn_cards_next')
            DT.last_products.mover()
        })
        $('#btn_cards_prev').click(function (e) {
            e.preventDefault()
            console.log('[LAST PRODUCTS]=\n', 'btn_cards_prev')
            DT.last_products.mover_reverse()
        })


        //Si le ponemos link
        /* 
        $(document).on('click','.last-search-card.last-selected',function(e){
                e.preventDefault()  
                document.location = $(this).data('link') 
            })   
        */
        return true;
    },
    mover_reverse: function () {
        console.log('[LAST PRODUCTS]=\n', '----mover_reverse----')
        var that = this;
        var $card_0 = $('.card_0')
        var $card_1 = $('.card_1')
        var $card_2 = $('.card_2')

        $card_2.remove()

        this.current_index--

        if (this.current_index < 0) {
            this.current_index = this.list_last.length - 1
        }
        var new_card_index = this.current_index

        console.log('[LAST PRODUCTS]',
            '\n this.current_index ', this.current_index,
            '\n new_card_index', new_card_index
        )

        var prev_card = this.format_product(this.list_last[new_card_index], new_card_index, 0, 'card_0_temp')

        $('#dv_last_prods').prepend(prev_card)

        var $card_0_temp = $('.card_0_temp')

        $card_0_temp.addClass('a_la_derecha_reverse')

        $card_0
            .addClass('card_transform_to_1_reverse')
            .removeClass('card_0')
            .addClass('card_1')

        $card_1
            .addClass('card_transform_to_2_reverse')
            .removeClass('card_1')
            .addClass('card_2')

        setTimeout(function () {
            $('.card_0_temp')
                .removeClass('a_la_derecha_reverse')
                .removeClass('card_0_temp')
                .addClass('card_0')
                .data('index', '0')
            var url = $('.card_0').attr('data-link') + '.json';
            that.update_price(url);
        }, 300)
        setTimeout(function () {
            $card_0.removeClass('card_transform_to_1_reverse')
            $card_1.removeClass('card_transform_to_2_reverse')

        }, 500)
    },
    mover: function () {

        console.log('[LAST PRODUCTS]=\n', 'mover')
        var that = this;
        var $card_0 = $('.card_0')
        var $card_1 = $('.card_1')
        var $card_2 = $('.card_2')

        if (this.current_index == (this.list_last.length - 3)) {
            var new_card_index = 0
        } else if (this.current_index == this.list_last.length - 2) {
            var new_card_index = 1
        } else if (this.current_index == this.list_last.length - 1) {
            var new_card_index = 2
        } else {
            var new_card_index = this.current_index + 3
        }

        this.current_index++

        if (this.current_index == this.list_last.length) {
            this.current_index = 0
        }

        console.log('[LAST PRODUCTS]',
            '\n this.current_index ', this.current_index,
            '\n new_card_index', new_card_index
        )

        var next_card = this.format_product(this.list_last[new_card_index], new_card_index, 2, 'card_2_temp')

        $('#dv_last_prods').append(next_card)

        $card_0.addClass('a_la_derecha')
        $card_1.addClass('card_transform_to_0')

        setTimeout(function () {

            $card_1
                .removeClass('card_1')
                .addClass('card_0')

            $card_2
                .addClass('card_transform_to_1')
                .removeClass('card_2')
                .addClass('card_1')

            $('.card_2_temp').removeClass('card_2_temp')

            $card_0.remove()
        }, 300)

        setTimeout(function () {
            $card_1.removeClass('card_transform_to_0')
            $card_2.removeClass('card_transform_to_1')
            var url = $('.card_0').attr('data-link') + '.json';
            that.update_price(url);
        }, 500)


    },
    save: function (this_product) {

        console.log('last_products save', this_product.id)

        this.arr_nav = JSON.parse(this.get()) || []
        var is_in_list = _.find(this.arr_nav, { id: this_product.id })
        if (!is_in_list) {
            this.arr_nav.reverse()
            this.arr_nav.push(this_product)
            this.arr_nav.reverse()
            this.arr_nav = this.arr_nav.slice(0, this.n_prod)
            window.localStorage.setItem('DTLastProducts', JSON.stringify(this.arr_nav))
        } else {
        }


    },
    get: function () {

        return window.localStorage.getItem('DTLastProducts') || false

    },
    format_product: function (prod, index, position, extra_class = false) {

        var formated_title = function (original_title, prodUrl) {
            var product_title_parts = original_title.split('|')
            var titulo_producto = product_title_parts[0]
            var similar_a = DT.str['Similar a']
            var de = DT.str['de']
            if (product_title_parts[1]) {
                var marca = product_title_parts[1].replace(similar_a, '').split(de)[1]
                var imitation_product = product_title_parts[1].replace(similar_a, '').split(de)[0]
                var familia = product_title_parts[2]
            } else {
                var imitation_product = ''
                var familia = ''
            }
            if (!marca) {marca = 'Divain'}
            if (prod.vendor == 'Rise.ai') {
                imitation_product = product_title_parts[0];
                de = '';
                marca = '';
                var hide = 'style="display: none;"'
                var giftClass = " lastgift "
            }

            var html_title = '<a href="' + prodUrl + '" class="lastsearch-name-title" style="width:100%; text-decoration: none; position: relative;">'
                + '<p><span ' + hide + ' class="lastsearch-title-top">' + titulo_producto + ' - ' + similar_a + '</span><br>'
                + '   <a style="text-decoration:none;" href="' + prodUrl + '" class="lastsearch-product-name ' + giftClass + '">  ' + imitation_product + ' ' + de + ' ' + marca + '</a>'
                + '</p>'
                + ' </a>'

            return html_title
        }

        console.log('[format_product]', position, index + ')' + prod.title.split('|')[0])

        var my_classes = 'card_' + position + ' '
        if (extra_class) {
            my_classes += ' ' + extra_class
        }

        var estacion = ''
        var marca = '<span class="marca">DIOR</span>'
        var uso = 'dia'
        var familia = 'Amaderada'
        var envase = '100 ml'
        var n_opiniones = ''
        var categoria = 'Hombre'
        var featured_image = prod.featured_image

        _.each(prod.tags, function (tag) {
            tag = tag.trim().split(':')

            if (tag[0] == 'estacion') {
                estacion = tag[1]
            }
            if (tag[0] == 'marca') {
                marca = '<span class="marca">' + tag[1] + '</span>'
            }
            if (tag[0] == 'uso') {
                uso = tag[1]
            }
            if (tag[0] == 'familia') {
                familia = tag[1]
            }
            if (tag[0] == 'envase') {
                envase = tag[1]
            }
            if (tag[0] == 'n_opiniones') {
                n_opiniones = tag[1]
            }
            if (tag[0] == 'categoria' && tag[1] != 'nicho') {
                categoria = tag[1]
            }
        })

        var img_back_class = uso.capitalize()


        if (categoria != 'mujer' && uso == 'dia') {
            img_back_class = 'back-dia-gen'
        } else if (categoria != 'mujer' && uso == 'noche') {
            img_back_class = 'back-noche-gen'
        }

        if (categoria == 'hombre' && uso == 'dia') {
            img_back_class = 'back-dia-hombre'
        } else if (categoria == 'hombre' && uso == 'noche') {
            img_back_class = 'back-noche-hombre'
        }



        // if(uso == 'noche' ){
        //    night_day_class = 'night'   
        // }   

        uso = DT.str[uso].capitalize()
        categoria = DT.str[categoria]

        if (prod.vendor == 'Rise.ai') {
            marca = '';
            uso = ' ';
            categoria = ' ';
        }
        var link = window.ultimas_shop + '/products/' + prod.handle
        var comparedPrice='';
        if(prod.variants[0].compare_at_price !=null){comparedPrice = prod.variants[0].compare_at_price;}
		console.log('SDFDSFSDFDSFSDF', prod.variants[0])
	      var freeSample="false";
              for(let i = 0; prod.variants.length > i; i++) {
                if (prod.variants[i].price == 0 && prod.variants[i].available) {freeSample = prod.variants[i].id; break;}
              }
        var html_prod =
            '<div class="last-search-card product_card ' + my_classes + '" data-link="' + link + '" data-index="' + index + '">'
            //---> old line '<div class="last-search-card '+ my_classes +'" data-link="'+ link +'" data-index="'+ index  +'">'
            + '<div class="last-img-back ' + img_back_class + '">'
            + marca
            + '    <span class="section-title day">' + uso + '</span>'
            + ' </div>'
            + ' <div class="last-card-content">'
            + '    <a href="' + link + '" class="img-card" style="background: url(' + featured_image + '); background-repeat: no-repeat; background-size: cover; background-position:center;"></a>'
            + '    <div class="last-card-text">'
            + formated_title(prod.title, link)

            + '<div class="vendor-and-button">'
            + '<p class="product-categoria"> ' + categoria + ' </p>'
            + '</div>'
            + '<a id="add_to_cart-' + prod.id + '-ult" class="button button-add button-and-busqueda" href="#" data-compared="'+ comparedPrice +'" data-rel="' + prod.variants[0].id + '" data-free="'+freeSample+'">' + this.t.anadelo_por + '<span class="price"></span></a>'
            + '  </div>'
            + ' </div>'
            + ' </div>'

        return html_prod

    },
    show_last_products: function () {

        this.list_last = JSON.parse(this.get()) || []

        console.log('[show_last_products]', this.n_prod, this.list_last.length)

        if (this.list_last.length == 0) {
            $('#ultimas-busquedas').remove()
            return
        }

        var html_productos = ''
        _this = this

        _.each(this.list_last, function (prod, index) {
            console.log(index + ')' + prod.title.split('|')[0])
        })

        _.each(this.list_last, function (prod, index) {
            if (index <= 2) {
                html_productos += _this.format_product(prod, index, index)
            }
        })
        $('#dv_last_prods').html(html_productos)
        return true

    },
    update_price: function (url) {

        $.ajax({
            url: url,
            type: 'GET'
        })
            .done(function (data) {
                let price = data.product.variants[0].price;
                let compared = data.product.variants[0].compare_at_price.replace('.', '');
                $('.card_0 .price').html(' ' + price + ' €');
                $('.card_0 .button-and-busqueda').data('compared', compared);
            })
            .fail(function (data) {
                console.log('fail to retrieve product json');
            })

    }
}

DT.last_products.init({
    this_product: window.ultimas_this_product
})