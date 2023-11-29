(function() {
    const el = wp.element.createElement;
    const registerBlockType = wp.blocks.registerBlockType;
    const InspectorControls = wp.editor.InspectorControls;
    const ColorPicker = wp.components.ColorPicker;
    const RangeControl = wp.components.RangeControl;
    const ToggleControl = wp.components.ToggleControl;
    const Button = wp.components.Button;
    const htmlToElem = (html) => wp.element.RawHTML({ children: html });

    registerBlockType('uni-lwpblock/latest-products', {
        title:      '"Latest Products" Grid',
        icon:       'store',
        category:   'common',
        attributes: {
            gridGap:             {
                type:    'number',
                default: 10
            },
            displaySaleTag:      {
                type:    'boolean',
                default: true
            },
            displayProductTitle: {
                type:    'boolean',
                default: true
            },
            titleColor:          {
                type:    'string',
                default: 'black'
            },
            displayProductPrice: {
                type:    'boolean',
                default: true
            },
            priceColor:          {
                type:    'string',
                default: 'black'
            },
            displayProductBtn:   {
                type:    'boolean',
                default: true
            },
            btnColor:            {
                type:    'string',
                default: 'white'
            },
            btnBgColor:          {
                type:    'string',
                default: 'black'
            }
        },
        edit:       ({ attributes, setAttributes }) => {
            const recentProducts = uniLwpBlockLatestProducts;

            if (!recentProducts) {
                return null;
            }

            function onChangeGridGap(newGap) {
                setAttributes({ gridGap: newGap });
            }

            function onChangeDisplaySaleTag(newValue) {
                setAttributes({ displaySaleTag: newValue });
            }

            function onChangeDisplayProductTitle(newValue) {
                setAttributes({ displayProductTitle: newValue });
            }

            function onChangeTitleColor(newColor) {
                setAttributes({ titleColor: newColor.hex });
            }

            function onChangeDisplayProductPrice(newValue) {
                setAttributes({ displayProductPrice: newValue });
            }

            function onChangePriceColor(newColor) {
                setAttributes({ priceColor: newColor.hex });
            }

            function onChangeDisplayProductBtn(newValue) {
                setAttributes({ displayProductBtn: newValue });
            }

            function onChangeBtnColor(newColor) {
                setAttributes({ btnColor: newColor.hex });
            }

            function onChangeBtnBgColor(newColor) {
                setAttributes({ btnBgColor: newColor.hex });
            }

            const saleTag = attributes.displaySaleTag ? 'SALE' : '';

            return [
                el(
                    InspectorControls,
                    {},
                    el(
                        'div',
                        {
                            className: 'uniLwpBlockControls__item'
                        },
                        el(RangeControl, {
                            label:    'Grid Gap',
                            value:    attributes.gridGap,
                            onChange: onChangeGridGap,
                            min:      0,
                            max:      150
                        })
                    ),
                    el(
                        'div',
                        {
                            className: 'uniLwpBlockControls__item'
                        },
                        el(ToggleControl, {
                            label:    'Display Sale Tag',
                            checked:  attributes.displaySaleTag,
                            onChange: onChangeDisplaySaleTag
                        })
                    ),
                    el(
                        'div',
                        {
                            className: 'uniLwpBlockControls__item'
                        },
                        el(ToggleControl, {
                            label:    'Display Product Title',
                            checked:  attributes.displayProductTitle,
                            onChange: onChangeDisplayProductTitle
                        })
                    ),
                    attributes.displayProductTitle &&
                    el(
                        'div',
                        {
                            className: 'uniLwpBlockControls__item'
                        },
                        el(ColorPicker, {
                            label:            'Title Color',
                            color:            attributes.titleColor,
                            onChangeComplete: onChangeTitleColor
                        })
                    ),
                    el(
                        'div',
                        {
                            className: 'uniLwpBlockControls__item'
                        },
                        el(ToggleControl, {
                            label:    'Display Product Price',
                            checked:  attributes.displayProductPrice,
                            onChange: onChangeDisplayProductPrice
                        })
                    ),
                    attributes.displayProductPrice &&
                    el(
                        'div',
                        {
                            className: 'uniLwpBlockControls__item'
                        },
                        el(ColorPicker, {
                            label:            'Price Color',
                            color:            attributes.priceColor,
                            onChangeComplete: onChangePriceColor
                        })
                    ),
                    el(
                        'div',
                        {
                            className: 'uniLwpBlockControls__item'
                        },
                        el(ToggleControl, {
                            label:    'Display Add To Cart Button',
                            checked:  attributes.displayProductBtn,
                            onChange: onChangeDisplayProductBtn
                        })
                    ),
                    attributes.displayProductBtn &&
                    el(
                        'div',
                        {
                            className: 'uniLwpBlockControls__item'
                        },
                        el(ColorPicker, {
                            label:            'Product Button Text Color',
                            color:            attributes.btnColor,
                            onChangeComplete: onChangeBtnColor
                        })
                    ),
                    attributes.displayProductBtn &&
                    el(
                        'div',
                        {
                            className: 'uniLwpBlockControls__item'
                        },
                        el(ColorPicker, {
                            label:            'Product Button Background Color',
                            color:            attributes.btnBgColor,
                            onChangeComplete: onChangeBtnBgColor
                        })
                    )
                ),
                el(
                    'div',
                    null,
                    el(
                        'div',
                        {
                            className: 'uniLwpBlockLatestProductsGrid',
                            style:     {
                                gap: `${attributes.gridGap}px`
                            }
                        },
                        recentProducts.map(function(product) {
                            return el(
                                'div',
                                { className: 'uniLwpBlockLatestProductsGrid__item' },
                                el(
                                    'span',
                                    {
                                        className: 'uniLwpBlockLatestProductsGrid__itemSaleTag',
                                        style:     {
                                            display: product.sale && attributes.displaySaleTag ? 'inline-flex' : 'none'
                                        }
                                    },
                                    saleTag
                                ),
                                el(
                                    'picture',
                                    {
                                        className: 'uniLwpBlockLatestProductsGrid__itemPicture'
                                    },
                                    el(
                                        'source',
                                        {
                                            srcset: product.image
                                        }
                                    ),
                                    el(
                                        'img',
                                        {
                                            src: product.image
                                        }
                                    )
                                ),
                                el(
                                    'a',
                                    {
                                        className: 'uniLwpBlockLatestProductsGrid__itemTitle',
                                        style:
                                                   {
                                                       color:   attributes.titleColor,
                                                       display: attributes.displayProductTitle ? 'block' : 'none'
                                                   },
                                        href:      product.url
                                    },
                                    product.title
                                ),
                                el(
                                    'p',
                                    {
                                        className: 'uniLwpBlockLatestProductsGrid__itemPrice',
                                        style:
                                                   {
                                                       color:   attributes.priceColor,
                                                       display: attributes.displayProductPrice ? 'inline-flex' : 'none'
                                                   }
                                    },
                                    htmlToElem(product.price)
                                ),
                                el(
                                    Button,
                                    {
                                        className: 'uniLwpBlockLatestProductsGrid__itemBtn',
                                        style:
                                                   {
                                                       color:           attributes.btnColor,
                                                       backgroundColor: attributes.btnBgColor,
                                                       display:         attributes.displayProductBtn ? 'flex' : 'none'
                                                   }
                                    },
                                    'Add to Cart')
                            );
                        })
                    )
                )
            ];
        }
    });
})();
