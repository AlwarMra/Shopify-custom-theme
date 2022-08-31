/**-------COLLECTION PAGE--------**/


function pageTransition(page, filter, collection) {

    var $el = $('#Collection__Products')

    if (!page) page = 0

    setTimeout(function () {
        $el.addClass('loading')
    }, 200)

    setTimeout(function () {

        console.log('pageTransition', page)

        if (page) {
            $("html, body").stop().animate({ scrollTop: 0 }, 1);
            F.go_to_page(page, collection)
        }

        /**/
        if (filter) {
            $("html, body").stop().animate({ scrollTop: 0 }, 1);

            if (F.filter_products_restrictivo(collection)) {
                //F.page = 0;
                //console.log('RESULTS',window.results) 
                F.go_to_page(page, collection)
            }
            F.manage_reset_btn(collection)

        }

        $el.css('opacity', 1)

    }, 700)



}


DT.colFilter = {
    filtros: {},
    filtros_aplicados: [],
    all_tags: [],
    modo: 'restrictivo', //'restrictivo' - 'acumulativo'
    page: 0,
    n_pages: 0,
    search: false,
    caducidad_segundos: 60,
    page_size: false,
    view_mode: 'collection', //'product'
    paginacion: false,
    sortBy: window.collection_sortby,
    products_to_show: [],
    init: function (collection) {
        console.log('=======[FILTROS]===============')

        this.page_size = window.page_size

        console.log('filter', this.page_size)
        var arr = collection.map(elem => elem.tags.find(tag => tag.includes('marca:')))
        var brands = [... new Set(arr)]
        brands.sort()
        var brandsHtml = ''
  
        for(let i = 0; brands.length > i; i++) {
          if(brands[i] !== undefined) {
              let brandElem = `<a href="#" class="brand-card" data-brand="${brands[i].replace('marca:', '')}">
              <p class="brand-type">${brands[i].replace('marca:', '')}</p></a>`;
              brandsHtml += brandElem
            }
        }
        $('.brand-card-container').html(brandsHtml)
        
        F = this
        F.add_behaviors(collection)
        F.preparar_productos(collection)
        F.preparar_filtros(collection, true)
        F.filter_products_restrictivo(collection)
        this.html_pagina_original = $('#shopify-section-collection-cards').html();
        this.html_search_original = $('#Collection__Products').html();
      

    },
    add_behaviors: function (collection) {
      console.log('FFFFFFFFFFF', collection)
        console.log('[FILTROS] add_behaviors ')

        //BTN CATEGORÍA
        $(document).on('click', '.btn_filtro_uso', function (e) {
            e.preventDefault()

            if (F.filtros.uso.length === 1 && F.filtros.uso[0] === $(this).data('uso')) {
                $('.btn_filtro_uso').removeClass('disabled').removeClass('active')
            } else {
                $('.btn_filtro_uso').removeClass('active')
                $(this).addClass('active')
            }
            F.filter_products_restrictivo(collection)
            //var prods = F.filtrar('uso', $(this).data('uso'), productos) 

        })


        $(document).on('click', '.btn_filtro_categoria', function (e) {
            e.preventDefault()
            if ($(this).parent().hasClass('has_products')) {
                $('.btn_filtro_categoria').parent().removeClass('selected-item')
                $(this).parent().addClass('selected-item')
                F.filter_products_restrictivo(collection)
            }
        })

        $(document).on('click', '.odor-card', function (e) {
            e.preventDefault()
            
            if (!$(this).hasClass('disabled')) {
                if ($(this).hasClass('active')) {
                    $(this).removeClass('active')

                } else {
                    $('.odor-card.active').removeClass('active')
                    $(this).addClass('active')
                }
                F.filter_products_restrictivo(collection)
            }
        })
        $(document).on('click', '.brand-card', function (e) {
            e.preventDefault()
            
            if (!$(this).hasClass('disabled')) {
                if ($(this).hasClass('active')) {
                    $(this).removeClass('active')

                } else {
                    $('.brand-card.active').removeClass('active')
                    $(this).addClass('active')
                }
                F.filter_products_restrictivo(collection)
            }
        })
        $(document).on('click', '.order-card', function (e) {
            e.preventDefault()
            if ($(this).hasClass('active')) {
                $(this).removeClass('active')
                $('#order-value').attr('value', 'best-selling')
                
                } else {
                    $('.order-card.active').removeClass('active')
                    $(this).addClass('active')
                    $('#order-value').attr('value', $(this).attr('data-order'))
                }
                F.filter_products_restrictivo(collection)
        })

        $(document).on('click', '.intensity', function (e) {
            e.preventDefault()
            var new_level = $(this).data('intensity_level')
            console.log('.intensity', new_level)

            if ($(this).hasClass('intensity-selected')) {
                //set to 0
                $('.intensity').removeClass('intensity-selected')
                F.filter_products_restrictivo(collection)
                return
            }

            if (new_level == 3) {
                $('.intensity').addClass('intensity-selected')
            }
            if (new_level == 2) {
                $('.intensity[data-intensity_level="3"]').removeClass('intensity-selected')
                $('.intensity[data-intensity_level="1"],.intensity[data-intensity_level="2"]').addClass('intensity-selected')
            }
            if (new_level == 1) {
                $('.intensity').removeClass('intensity-selected')
                $(this).addClass('intensity-selected')
            }
            F.filter_products_restrictivo(collection)
        })
        
        
        
        
        $('.subcollection').on('click', function(){
          $('#btn_limpiar').trigger('click');
          if($(this).hasClass('active')) {
          	$('.subcollection').removeClass('active');
            $('.mother-col').addClass('active');
          } else {
          	$('.subcollection').removeClass('active');
            $(this).addClass('active');
          }
        F.filter_products_restrictivo(collection);
        
        });


        $(document).on('change', '.season-checker', function (e) {
            //e.preventDefault()

            if ($(this).prop('checked')) {
                $('.season-checker[data-estacion="' + $(this).data('estacion') + '"]').prop('checked', true)
            } else {
                $('.season-checker[data-estacion="' + $(this).data('estacion') + '"]').prop('checked', false)

            }

            //var prods = F.filtrar('estacion', $(this).data('estacion'), productos)
            //console.log('estacion', $(this).data('estacion'), prods)
            setTimeout(function () {
                F.filter_products_restrictivo(collection)

            }, 100)

        })


        //=======================
        /*
        $('.sort_by').change(function (e) {
            console.log('sort-button', $(this).val())
            this.sortBy = $(this).data('value')
            window.collection_sortby = $(this).val();
            F.filter_products_restrictivo(collection)
            pageTransition(false, true)
            // _this.manage_reset_btn(collection)
        })
        */

        $(document).on('click', '.Pagination__NavItem', function (e) {
            e.preventDefault()

            if (!$(this).hasClass('is-current')) {
                console.log('page ->', $(this).data('page'));
                F.page = $(this).data('page')
                pageTransition($(this).data('page') + '', false, collection)
            }

        })

        $(document).on('click', '#btn_limpiar, .button-clean', function (e) {
            e.preventDefault()
            F.manage_reset_btn(collection)

        })



        $(document).on('click', '.btn_reset_filtros', function (e) {

            $('.Button-size-color').each(function (filtro) {
                if ($(this).hasClass('active')) {
                    $(this).trigger('click')
                }
            })

        })


    },
    preparar_productos: function (collection) {


        //FILTRAR LOS NO DISPONIBLES
        //Quitar los productos no disponibles 
        if (!window.show_unavailable_products) {
            collection = _.where(collection, { 'available': true })
        }
        console.log('window.collection_products available->', collection.length)

        /*
        //MANDAR LOS NO DISPONIBLES AL FINAL
        var available_products = _.where(collection, { available: true })
        var unavailable_products = _.difference(collection, available_products) 
        collection = _.union(available_products,unavailable_products) 
        console.log('window.collection_products avaiability_array->', collection)

        //mostrar aunque agotados
        var mostrados_aunque_agotados = _.filter(unavailable_products, function(pr) { return pr.tags.indexOf('mostrar_aunque_agotado') >= 0; });          
        collection = _.union(available_products, mostrados_aunque_agotados)
        console.log('window.collection_products mostrados_aunque_agotados->', mostrados_aunque_agotados)
        */


        //ASIGNAR VALORES DE FILTROS A LOS PRODUCTOS
        _.each(collection, function (prod) {


            // tags 
            prod.familias_todas_arr = []

            _.each(prod.tags, function (tag) {
                var tag_parts = tag.split(':')
                if (tag_parts[0] == 'familia') {
                    var familia = tag_parts[1]
                    prod.familias_todas_arr.push(familia)
                }
                if (tag_parts[0] == 'subfamilia' || tag_parts[0] == 'subfamilia2') {
                    var subfamilia = tag_parts[1]
                    prod.familias_todas_arr.push(subfamilia)
                }
            })

            prod.familias_todas_arr = _.uniq(prod.familias_todas_arr)

        })



        //RANGO PRECIOS
        /*
        var prices = _.map(collection, function (pr) { return pr.price })
        this.price_min = _.min(prices) / 100
        this.price_max = _.max(prices) / 100
        this.filtro_precio_min = _.min(prices) / 100
        this.filtro_precio_max = _.max(prices) / 100
        console.log('precios', this.price_min, this.filtro_precio_min, this.price_max, this.filtro_precio_max)
        */
        //PAGINACIÓN 
        var n_paginas = Math.ceil(collection.length / F.page_size)
        console.log('n_paginas', collection.length, F.page_size, n_paginas)

        //TODO PAGINATION 
        //$('#dv_pagination').html(F.get_paginacion(0, n_paginas)).show()

        return true
    },
    preparar_filtros: function (productos, first_load = false) {

        //RESET
        //$('.btn_filtro_categoria').not('[data-categoria="todos"]').addClass('disabled')
        //$('.btn_filtro_categoria[data-categoria="todos"]').parent().show()

        $('.btn_filtro_uso,.odor-card-, .intensity').addClass('disabled');
        $('.season-checker').parent().addClass('disabled');
        $('.season-checker').parent().find('.num_estacion').text('')
        //intensity-selected

        if (!F.search) {
            F.all_tags = []
            F.filtros.categorias = []
            F.filtros.familias_olfativas = []
            F.filtros.uso = []
            F.filtros.intensidad = []
            F.filtros.estacion = []
            F.filtros.marca = []
            F.filtros.subcollection = []
        }


        console.log('[preparar_filtros] productos', productos.length, productos)



        _.each(productos, function (prod) {
            _.each(prod.tags, function (tag) {
              if (F.all_tags.indexOf(tag) < 0){
                
                if(tag.indexOf(':') > 0) {
                    F.all_tags.push(tag)
                    //console.log(tag)
                    var tag_parts = tag.split(':')
                    if (tag_parts[0] == 'intensidad') {
                        F.filtros.intensidad.push(tag_parts[1])
                    }
                    if (tag_parts[0] == 'estacion') {
                        F.filtros.estacion.push(tag_parts[1])
                    }
                    if (tag_parts[0] == 'marca') {
                        F.filtros.marca.push(tag_parts[1])
                    }
                    if (tag_parts[0] == 'uso') {
                        F.filtros.uso.push(tag_parts[1])
                    }
                    if (tag_parts[0] == 'familia') {
                        F.filtros.familias_olfativas.push(tag_parts[1])
                    }

                    //incluir subfamilias
                    if (tag_parts[0] == 'subfamilia' || tag_parts[0] == 'subfamilia2') {
                        F.filtros.familias_olfativas.push(tag_parts[1].toLowerCase())
                    }


                    if (tag_parts[0] == 'categoria') {
                        F.filtros.categorias.push(tag_parts[1])
                    }
                } else {
                  if(tag == 'novedad' || tag == 'musthave' || tag == 'layering' || tag == 'packdemuestras') {
                    F.all_tags.push(tag)
                  	F.filtros.subcollection.push(tag);
                  }
                
                }
              }
            })
        })

        /**/
        //MOSTRAR FILTROS PRESENTES



        //CATEGORIA
        $('.btn_filtro_categoria').each(function () {
            console.log('[filtrar->.btn_filtro_categoria]', $(this).data('categoria'), $(this).parent().hasClass('selected-item'))

            if (F.filtros.categorias.indexOf($(this).data('categoria')) < 0 && $(this).data('categoria') != 'todos') {
                console.log('REMOVE:', $(this).data('categoria'))
                $(this).parent().hide()
            }
            if ($(this).data('categoria') == window.bg_collection) {
                $(this).parent().hide()
            }
        })



        _.each(F.filtros.categorias, function (cat) {
            //console.log('categoria presente:', cat, 'has_products', 'true' ) 
            if (cat != window.bg_collection) {
                $('.btn_filtro_categoria[data-categoria="' + cat + '"]')
                    .removeClass('disabled')
                    .parent()
                    .addClass('has_products')
                    .show()
            }
        });
      
        _.each(F.filtros.uso, function (uso) {
            $('.btn_filtro_uso[data-uso="' + uso + '"]').removeClass('disabled')
        })

        
        
        if (first_load) { }

        F.filtros.familias_olfativas = _.uniq(F.filtros.familias_olfativas)
        $('.odor-card').addClass('disabled')
        _.each(F.filtros.familias_olfativas, function (familia) {
            console.log('odor-card:', familia, 'has_products', 'true')
            $('.odor-card[data-familia="' + familia + '"]').removeClass('disabled')
        })

        F.filtros.marca = _.uniq(F.filtros.marca)


        _.each(F.filtros.estacion, function (estacion) {
            var prods = F.filtrar('estacion', estacion, productos)
            $('.season-checker[data-estacion="' + estacion + '"]').parent().removeClass('disabled');
        })
        
        _.each(F.filtros.intensidad, function (intensidad) {
          var prods = F.filtrar('intensidad', intensidad, productos)
            $('.intensity[data-intensity_level="' + intensidad + '"]').removeClass('disabled');
        })

    },
  
    order(collection) {

    },

    filtrar(filtro, valor, collection) {
      
      	var elem = filtro + ':' + valor;
		if(filtro == 'subcollection')  elem = valor
        var productos = _.filter(collection, function (prod) {
            return prod.tags.indexOf(elem) >= 0;
        });
      
        return productos
    },
  
    filter_products_restrictivo: function (collection) {
		
      var productos = collection
        console.log('----filter_products_restrictivo---------', productos);
        

        DT.colFilter.filtros_aplicados = []

        var n_total_filtros = 0

        //USO
        $('.btn_filtro_uso').each(function () {
            if ($(this).hasClass('active')) {
                var prod_uso = F.filtrar('uso', $(this).data('uso'),productos)
                productos = _.intersection(productos, prod_uso);
                DT.colFilter.filtros_aplicados.push($(this).data('uso'))
                n_total_filtros++
            }
        })


        console.log('[n productos USO]', productos.length, productos[1])

                  //SUBCOLLECTIONS
        $('.subcollection').each(function(){
            if ($(this).hasClass('active') && $(this).data('subcol')!='all') {
                var prod_col = F.filtrar('subcollection', $(this).data('subcol'),productos)
                productos = _.intersection(productos, prod_col);
                DT.colFilter.filtros_aplicados.push($(this).data('subcol'))
                n_total_filtros++
            }
        
        
        });     

        
        
        //CATEGORIA
        $('.btn_filtro_categoria').each(function () {
            // console.log('[filtrar->.btn_filtro_categoria]', $(this).data('categoria'), $(this).parent().hasClass('selected-item'))
            if ($(this).parent().hasClass('selected-item') && $(this).data('categoria') != 'todos') {
                var prod_categoria = F.filtrar('categoria', $(this).data('categoria'), productos)
                productos = _.intersection(productos, prod_categoria);
              console.log('CATEGORIA', productos)
                DT.colFilter.filtros_aplicados.push($(this).data('categoria'))
                n_total_filtros++
            }
        })

        console.log('[n productos CATEGORIA]', productos.length)

        //INTENSITY
        var has_intensity = false
        $('.intensity').each(function () {
            if ($(this).hasClass('intensity-selected')) {
                has_intensity = true
            }
        })
        if (has_intensity) {
            if ($('.intensity[data-intensity_level=3]').hasClass('intensity-selected')) {
                var prod_intensity = F.filtrar('intensidad', 3, productos)
                productos = _.intersection(productos, prod_intensity);
            } else if ($('.intensity[data-intensity_level=2]').hasClass('intensity-selected')) {
                var prod_intensity = F.filtrar('intensidad', 2, productos)
                productos = _.intersection(productos, prod_intensity);
            } else {
                var prod_intensity = F.filtrar('intensidad', 1, productos)
                productos = _.intersection(productos, prod_intensity);
            }
            DT.colFilter.filtros_aplicados.push('intensidad')
            n_total_filtros++
        }
        console.log('[n productos INTENSITY]', productos.length)




        //FAMILIAS OLFATIVAS *****AND******
        /*-------------OLD-------------------
        var prods_familias = []
        $('.odor-card').each(function () {
            if ($(this).hasClass('active')) {
                var prod_familia = F.filtrar('familia', $(this).data('familia'), productos)
                //console.log($(this).data('familia'), prod_familia)
                _.each(prod_familia, function (prod) {
                    prods_familias.push(prod)
                })
            }
        })
        if (prods_familias.length > 0) {
            productos = _.intersection(productos, prods_familias);
        } 
        console.log('[n productos FAMILIAS OLFATIVAS]', productos.length)
        */

        var prods_familias = []
        $('.odor-card').each(function () {
            if ($(this).hasClass('active')) {

                console.log('[.odor-card]', $(this).data('familia'))

                var familia_to_search = $(this).data('familia');
                var prod_familia = _.filter(collection, function (prod) {
                    return prod.familias_todas_arr.indexOf(familia_to_search) >= 0;
                });
                _.each(prod_familia, function (prod) {
                    prods_familias.push(prod)
                })

                DT.colFilter.filtros_aplicados.push($(this).data('familia'))
                n_total_filtros++
            }
        })
        if (prods_familias.length > 0) {
            productos = _.intersection(productos, prods_familias);

        }
        console.log('[n productos FAMILIAS OLFATIVAS]', productos.length)

        //BRANDS************
        var prods_brands = []
        $('.brand-card').each(function () {
            if ($(this).hasClass('active')) {
                var prod_brand = F.filtrar('marca', $(this).data('brand'), productos)

                _.each(prod_brand, function (prod) {
                    prods_brands.push(prod)
                })

                DT.colFilter.filtros_aplicados.push($(this).data('brand'))
                n_total_filtros++
            }
        })
        if (prods_brands.length > 0) {
            productos = _.intersection(productos, prods_brands);

        }
        console.log('[n productos BRANDS]', productos.length)

        //ESTACION *****AND******
        var prods_estaciones = []
        $('.season-checker').each(function () {
            console.log('....> filtrar:', $(this).data('estacion'), $(this).prop('checked'))
            if ($(this).prop('checked')) {
                var prod_estacion = F.filtrar('estacion', $(this).data('estacion'), productos)
                _.each(prod_estacion, function (prod) {
                    prods_estaciones.push(prod)
                })
                DT.colFilter.filtros_aplicados.push($(this).data('estacion'))
                n_total_filtros++
            }
        })
        prods_estaciones = _.uniq(prods_estaciones)
        console.log('prods_estaciones', prods_estaciones, productos)
        if (prods_estaciones.length > 0) {
            productos = _.intersection(productos, prods_estaciones);
        }


        $('.order-card').each(function(){
            if ($(this).hasClass('active')) {
                n_total_filtros++
            }
        })
        const order = document.getElementById('order-value').value
        if (order == 'price-ascending') {
            productos = _.sortBy(productos, function (item) { return item.price; });
            productos.reverse()
        } else if (order == 'price-descending') {
            productos = _.sortBy(productos, function (item) { return item.price; });

        } else if (order == 'created-descending') {
            productos = _.sortBy(productos, function (item) { return item.created_at; });
            productos.reverse()
        }
        else if (order == 'created-ascending') {
            productos = _.sortBy(productos, function (item) { return item.created_at; });
        }

        console.log('QWERTY', productos)
        
        F.preparar_filtros(productos)

        //BORRAR LA SECCIÓN MÁS VENDIDOS 
        $('.mas-vendidos-section').remove()



        //NO PRODUCTS TO SHOW
        if (productos.length == 0) {
            console.log('=====NO PRODUCTS TO SHOW====')


            var text = window.no_products_text.split('|')
            var image_no_results = ''
            if (window.image_no_results != '') {
                image_no_results = '<img class="image_no_results" src="' + window.image_no_results + '">'
            }

            var html_no_results = '<div class="filters-sin-reslutados">'
                + image_no_results
                + '<h2 class="section-title" style="font-size:.875rem; letter-spacing: 4.72px; text-transform: uppercase"><span>' + text[0] + '</span></h2><br><p style="text-transform: uppercase">' + text[1] + '</p></div>'

            $('#Collection__Products')
                .html(html_no_results)
                .removeClass('loading')

            //OCULTAR LA SECCIÓN COLLECTION DESCRIPTION
            $('.panel-wrapper').hide()

            return
        } else {
            //MOSTRAR LA SECCIÓN COLLECTION DESCRIPTION
            $('.panel-wrapper').show()
        }


        if (n_total_filtros == 0) {
            console.log('--[  NO FILTROS    ]--', n_total_filtros, productos.length )
            $('#shopify-section-collection-cards').html(DT.colFilter.html_pagina_original);
            $('#Collection__Products').html(DT.colFilter.html_search_original);
            return
        }

        window.results = productos //-> paginación

        console.log('filtros', n_total_filtros, 'window.results', window.results)


        /**
         * *************************************************************
         * 
         //PINTAR PRODUCTOS  
         * 
         
        $('#Collection__Products')
        .html(this.format_products(productos)) //this.pages[this.page]))
        $('.trustpilot-widget').each(function(TP){
            var trustbox = document.getElementById(  $(this).attr('id')  ); 
             window.Trustpilot.loadFromElement(trustbox);
           })
   
         return
         * *************************************************************
         * 
         //PINTAR PRODUCTOS  
         * 
         */


        //PAGINATION 
        this.get_pages(productos)

        var pagination = this.pagination(productos, this.page)

        this.paginacion = pagination

        console.log('filter_products_restrictivo this.pages', this.pages, this.page, this.pages[this.page])



        if (this.pages[this.page]) {
            var page_content = this.pages[this.page]
        } else {
            this.page = 0
            var page_content = this.pages[0]
        }

        // window.page_filtros = 0; 
        console.log('------NEW dv_pagination--------')
        //PINTAR PRODUCTOS   
        $('#Collection__Products')
            .html(this.format_products(this.pages[this.page]))
            .append(this.get_paginacion(this.page, this.pages.length))

            DT.wishlist.init();
        return true


    },
  

    format_products: function (productos) {
        var html_products = ' ';
        _.each(productos,  (prod) => html_products += DT.cards.init(prod)); 
        return html_products;
    },
    get_pages: function (productos) {

        console.log('get_pages', productos.length, this.page_size)

        var page_size = this.page_size

        var pages = []

        var partition = []

        var n = 0
        for(let i = 0; productos.length >i; i ++) {
            partition.push(productos[i])
            n++
            if (n == page_size) {
                n = 0
                pages.push(partition)
                partition = []
                //console.log('partition',partition )
            }
        }



        pages.push(partition) //last

        //console.log('this.pages', pages ) 
        this.pages = pages

        return true


    },
    pagination: function (productos, page) {

        if (productos.length > this.page_size) {
            var n_paginas = Math.ceil(productos.length / this.page_size)
            var index_ini = this.page * this.page_size
            var index_fin = index_ini + this.page_size
            if (index_fin > productos.length) {
                index_fin = productos.length
            }

            var page_size = this.page_size

            window.results = []


            var partition = []

            var n = 0
            _.each(productos, function (prod) {
                partition.push(prod)
                n++
                if (n == page_size) {
                    n = 0
                    window.results.push(partition)
                    partition = []
                }

            })

            //last
            window.results.push(partition)

            console.log('n_paginas', n_paginas, index_ini, index_fin, window.results)

            return {
                'n_paginas': n_paginas,
                'index_ini': index_ini,
                'index_fin': index_fin,
                'productos': window.results[0]
            }



        } else {
            //$('#Collection__Pagination').html('').hide()
            return false
        }


    },
    get_paginacion: function (pag_actual, npag) {

        var html_paginacion = '<div class="pagination">'

        console.log('[get_paginacion]', pag_actual, npag)

        pag_actual = 1 * pag_actual


        if (npag <= 5) {
            for (i = 0; i < npag; i++) {
                if (i == pag_actual) {
                    html_paginacion += ' <span class="pagination-item  is-active ">' + (i + 1) + '</span>'
                } else {
                    html_paginacion += ' <a href="#"  data-page="' + i + '" class="Pagination__NavItem pagination-item link" >' + (i + 1) + '</a>'

                }
            }

        } else { //npag > 5



            var limit_prev = pag_actual - 1

            if (limit_prev < 0) limit_prev = 0

            if (pag_actual == npag - 1) {
                limit_prev = pag_actual - 2
            }



            var limit_next = pag_actual + 2
            if (limit_next > npag) {
                limit_next = npag

            }
            if (pag_actual == 0) {
                limit_next = 3
            }


            var arrow_prev = '<a class="pagination-item link" rel="prev" title="Navegar a la página anterior" data-page="' + (pag_actual - 1) + ' href="#"> '
                + '<svg xmlns="http://www.w3.org/2000/svg" width="7" height="10" viewBox="0 0 7 10">'
                + '      <g fill="none" fill-rule="evenodd">'
                + '          <g fill="#57544F" stroke="#57544F">'
                + '              <g>'
                + '                  <g>'
                + '                      <g>'
                + '                          <path d="M5 10L14 10 9.5 16z" transform="translate(-226 -4214) translate(0 4139) translate(52) translate(168 67) matrix(0 -1 -1 0 22.5 22.5)"></path>'
                + '                      </g>'
                + '                  </g>'
                + '              </g>'
                + '          </g>'
                + '      </g>'
                + '   </svg></a>'


            // <li><a class="Pagination__NavItem Link Link--primary pagination-link" data-page="' + (pag_actual - 1) + '" rel="prev" title="Prev page" href="#">' +
            //   'Anterior</a></li>'
            //var arrow_next = '<li><a class="Pagination__NavItem Link Link--primary pagination-link" data-page="' + (pag_actual + 1) + '" rel="next" title="next page" href="#">' +
            //   'Siguiente</a></li>'

            var arrow_next = '<a class="Pagination__NavItem pagination-item link " rel="next" title="Navegar a la página siguiente"  data-page="' + (pag_actual + 1) + '" href="#">'
                + '<svg xmlns="http://www.w3.org/2000/svg" width="7" height="10" viewBox="0 0 7 10">'
                + '<g fill="none" fill-rule="evenodd">'
                + '  <g fill="#57544F" stroke="#57544F">'
                + '      <g>'
                + '          <g>'
                + '              <g>'
                + '                  <path d="M315 10L324 10 319.5 16z" transform="translate(-536 -4214) translate(0 4139) translate(52) translate(168 67) rotate(-90 319.5 13)"></path>'
                + '              </g>'
                + '          </g>'
                + '      </g>'
                + '    </g>'
                + ' </g>'
                + '</svg></a>'

            var puntos = '<span class="pagination-item ">…</span>'



            if (pag_actual != 0) {
                html_paginacion += arrow_prev
            }

            if (limit_prev > 0 && pag_actual > 3) {
                html_paginacion += '<a href="#"  data-page="0" class="Pagination__NavItem pagination-item link" >1</a>' + puntos

            }

            //anteriores
            for (i = limit_prev; i < pag_actual; i++) {
                html_paginacion += ' <a href="#"  data-page="' + i + '" class="Pagination__NavItem pagination-item link" >' + (i + 1) + '</a>'
            }

            //actual pag_actual 
            html_paginacion += ' <span class="pagination-item  is-active ">' + (i + 1) + '</span>'

            //siguientes
            for (i = (pag_actual + 1); i < limit_next; i++) {
                html_paginacion += ' <a href="#"  data-page="' + i + '" class="Pagination__NavItem pagination-item link" >' + (i + 1) + '</a>'
            }

            if (limit_next < npag - 1) {
                html_paginacion += puntos
            }
            if (limit_next < npag) {
                html_paginacion += ' <a href="#"  data-page="' + (npag - 1) + '" class="Pagination__NavItem pagination-item link" >' + npag + '</a>'

            }


            if (limit_next < npag - 1) {
                html_paginacion += arrow_next
            }


        }


        html_paginacion += '</div>'

        //console.log('get_paginacion>>',html_paginacion)

        return html_paginacion

    },
    go_to_page: function (pag, collection) {

        console.log('go_to_page>>', pag)

        if (!this.pages) {
            this.get_pages(collection)
        }

        $('#Collection__Products')
            .html(this.format_products(this.pages[pag]))
            .append(this.get_paginacion(pag, this.pages.length))
        DT.wishlist.init();

    },
    get_page_infinity: function (pag, collection) {

        console.log('get_page_infinity>>', pag)
        if (!this.pages) {
            this.get_pages(collection)
        }

        if (this.pages[pag]) {
            $('#Collection__Products')
                //.append('============================pag '+ pag+' ==============================')
                .append(this.format_products(this.pages[pag]))
                .removeClass('loading')

            DT.wishlist.init();

        }


    },
    load_products_ajax: function () {


        var current_tags = []
        //get Marcas
        _.each(F.filtros.marcas, function (marca) {
            current_tags.push('marca:' + marca)
        })
        //get colores
        _.each(F.filtros.colores, function (color) {
            current_tags.push('color:' + color)
        })
        //get estilos
        _.each(F.filtros.estilos, function (estilo) {
            current_tags.push('estilo:' + estilo)
        })


        var url = location.pathname + '/' +
            current_tags.join('+') +
            '?view=ajax'
        //+'&sort_by=' + this.currentSortBy

        console.log('url', url);

        fetch(url, {
            credentials: 'same-origin',
            method: 'GET'
        }).then(function (response) {
            response.text().then(function (content) {
                console.log('DDDD',content);


            });
        });

    },
    manage_reset_btn(collection) {
        console.log('[FILTROS] limpiar ')
        $('.btn_filtro_uso').each(function () {
            if ($(this).hasClass('active')) {
                $(this).removeClass('active')
            }
        })
        $('.btn_filtro_categoria').each(function () {
            if ($(this).parent().hasClass('selected-item') && $(this).data('categoria') != 'todos') {
                $(this).parent().removeClass('selected-item')

            }
        })
        $('.btn_filtro_categoria[data-categoria="todos"]').parent().addClass('selected-item')

        $('.intensity').each(function () {
            if ($(this).hasClass('intensity-selected')) {
                $(this).removeClass('intensity-selected')
            }
        })

        $('.odor-card').each(function () {
            if ($(this).hasClass('active')) {
                $(this).removeClass('active')
            }
        })
        $('.brand-card').each(function () {
            if ($(this).hasClass('active')) {
                $(this).removeClass('active')
            }
        })
        $('.order-card').each(function () {
            if ($(this).hasClass('active')) {
                $(this).removeClass('active')
            }
            $('#order-value').attr('value', 'best-selling')
        })
        $('.season-checker').each(function () {
            if ($(this).prop('checked')) {
                $(this).prop('checked', false)
            }
        })




        F.filter_products_restrictivo(collection)
    },

    is_filtering: function () {

        var is_filtering = false
        console.log('===================is_filtering============================')
        that = this

        _.each(that.filtros, function (filtro) {
            console.log('fil', filtro)
            if (filtro.length > 0) {
                is_filtering = true
            }
        })

 


        return is_filtering

    },
    load_filtered_page: function () {
        console.log('---load_filtered_page----')
    },
    getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sParam) {
                return sParameterName[1];
            }
        }
    }

}





