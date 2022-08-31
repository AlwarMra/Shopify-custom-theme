DT.muestras = {

    init: function () {
        var that = this;
        var containers = $('.muestras-input-container');
        var btnMuestra = $('.btn-muestras');
        var inputWrappers = $('.input-wrapper');
        var priceText = $('.variant-price');

        $('.add_muestra').on('click', function () {
            that.addProduct(containers);
        });
        $('#add_to_cart_muestra').on('click', function () {
            that.addProduct(containers, true);
        });
        //Alternate variant
        btnMuestra.on('click', function () {
            var that = $(this);
            btnMuestra.removeClass('muestra-active');
            that.addClass('muestra-active');
            $('#variant').attr('value', that.attr('data-variant-id'));
            $('#variant').attr('data-variant', that.attr('data-variant'));
            containers.hide();
            var remainingCointaners = containers.slice();
            containers.each(function () {
                variant = $(this).attr('data-variant');
                if (variant == that.attr('data-variant')) {
                    priceText.hide();
                    $('.variant-price[data-variant="' + variant + '"]').show();
                    remainingCointaners.length = parseInt(variant) + 1;
                    remainingCointaners.show();
                    return false;
                }
            });
        });
        //Remove Tag
        $(document).on('click', '.close-tag', function () { that.removeTag(this); });
        //Hide results when outside of box
        $(document).mouseup(function (e) {
            if (!inputWrappers.is(e.target) && inputWrappers.has(e.target).length === 0) {
                inputWrappers.find('.search-results').hide();
            }
        });

        //Search
        function delay(fn, ms) {
            let timer = 0
            return function (...args) {
                clearTimeout(timer)
                timer = setTimeout(fn.bind(this, ...args), ms || 0)
            }
        };
        $('.input-muestra').on('keyup', delay(function (e) {
            var that = $(this);
            var url = "/search?q=" + $(this).val() + "&view=ajax"
            fetch(url, {
                credentials: 'same-origin',
                method: 'GET'
            }).then(function (response) {
                response.text().then(function (content) {
                    var content_filtered = replaceAll(content, ',]', ']')
                    //console.log('PRODUCTS--------', content_filtered );  
                    window.products = JSON.parse(content_filtered)
                    that.next().html('');
                    $('.search-results').hide();
                    that.next().show();
                    if (window.products.length === 0) {
                        that.next().append('<p class="empty-search">No hay coincidencias</p>')
                    } else {
                        _.each(products, function (prod) {
                            that.next().append('<a href="#" class="btn_add_muestra" data-pr_id="' + prod.pr_id + '" data-title="' + prod.title + '">' + prod.title + '</a>')
                        });
                    }
                    //Add tag
                    $('.btn_add_muestra').on('click', function (e) {
                        e.preventDefault();
                        $(this).parent().hide();
                        DT.muestras.addTag(this);
                    });
                });
            });

        }, 300));
        $('.input-wrapper .close').on('click', function () {
            $(this).parent().remove();
            $(this).closest('.input-muestra').show();
        });
    },
    addTag: function (elem) {
        var title = elem.getAttribute('data-title');
        var tag = '<span class="tag" data-muestra="' + title + '"><span class="tag-title">' + title + '</span><span class="close-tag"></span></span>';
        $(elem).parent().siblings('.input-muestra').hide();
        $(elem).parent().siblings('.input-muestra').val('');
        $(elem).closest('.input-wrapper').prepend(tag);
    },
    removeTag: function (elem) {
        var input = $(elem).parent().siblings('.input-muestra');
        $(elem).parent().remove();
        input.show();
    },
    addProduct: function (containers, checkout = false) {
        var muestras = [];
        var idMuestra = $('#variant').attr('value');
        var v = parseInt($('#variant').attr('data-variant')) + 1;
        var q = parseInt($('#variant').attr('data-q'));
        var newContainers = containers.slice();
        newContainers.length = v;
        console.log(newContainers);
        var tags = newContainers.find('.tag');

        if (tags.length < v * 6) {
            $('.description-buttons .msg').fadeIn();
            setTimeout(() => {
                $('.description-buttons .msg').fadeOut();
            }, 2000);
        } else {
            muestras = [];
            tags.each(function () {
                let m = $(this).attr('data-muestra').split('|');
                muestras.push(m[0]);
            });
            var muestra = {
                id: idMuestra,
                q: q,
                properties: {
                    _compare_at_price: 0,
                    [DT.str['muestras']]: muestras.join(' ')
                }
            }
            $.ajax({
                type: 'POST',
                url: '/cart/add.js',
                data: muestra,
                dataType: 'JSON',
                success: (data) => {
                    console.log('Product added>>', data);
                    DT.data_layer.add(muestra, data);
                    DT.mini_cart.get_cart(DT.mini_cart.format_mini_cart, true);
                    checkout ? document.location = '/checkout' : DT.mini_cart.openCart();
                },
                error: () => {
                    console.log('error');
                }
            });
        }

    }
}
$(document).ready(() => { DT.muestras.init() });