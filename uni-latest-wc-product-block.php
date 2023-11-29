<?php
/**
 * Plugin Name: "Latest WC products" Gutenberg block
 * Plugin URI: https://vitaliykiyko.com
 * Description: A plugin-extension for WooCommerce and Gutenberg. Adds a configurable Gutenberg block with the 3 latest products.
 * Version: 1.0.0
 * Author: Vitalii Kiiko
 * Author URI: https://vitaliykiyko.com
 * Domain Path: /languages/
 * Text Domain: uni-lwpblock
 * Requires PHP: 7.4
 * WC requires at least: 8.0
 * WC tested up to: 8.2
 * License: GPL v2
 *
 */

/**
 * Get products data array
 *
 * @return array|array[]
 */
function uniLwpBlock_latest_products_data() {
    if ( class_exists( 'WC_Product_Query' ) ) {
        $query    = new WC_Product_Query( array(
            'limit' => 3,
            'type'  => 'simple'
        ) );
        $products = $query->get_products();

        return array_map(
            function ( $product ) {
                $product_id = $product->get_id();
                $image_url  = get_the_post_thumbnail_url( $product_id, 'full' );

                if ( empty( $image_url ) ) {
                    $image_url = wc_placeholder_img_src( 'woocommerce_single' );
                }
                return [
                    'id'          => $product->get_id(),
                    'price'       => $product->get_price_html(),
                    'sale'        => $product->is_on_sale(),
                    'image'       => $image_url,
                    'title'       => $product->get_title(),
                    'url'         => get_permalink( $product->get_id() ),
                    'add_to_cart' => $product->add_to_cart_url()
                ];
            },
            $products
        );
    } else {
        return [];
    }
}

/**
 * Declaration of 'register_block_type' in php. We need it for 'render_callback' method
 *
 * @return void
 */
function uniLwpBlock_register_custom_block() {
    wp_register_script(
        'uni-lwpblock-block-script',
        plugins_url( 'uni-latest-wc-product-block.js', __FILE__ ),
        array('wp-blocks', 'wp-editor', 'wp-components', 'wp-i18n', 'wp-element')
    );

    wp_localize_script(
        'uni-lwpblock-block-script',
        'uniLwpBlockLatestProducts',
        uniLwpBlock_latest_products_data()
    );

    wp_register_style(
        'uni-lwpblock-block-style',
        plugins_url( 'uni-latest-wc-product-block.css', __FILE__ )
    );

    wp_register_style(
        'uni-lwpblock-frontend-style',
        plugins_url( 'uni-latest-wc-product-block-frontend.css', __FILE__ )
    );

    register_block_type( 'uni-lwpblock/latest-products', array(
        'editor_script'   => 'uni-lwpblock-block-script',
        'editor_style'    => 'uni-lwpblock-block-style',
        'style'           => 'uni-lwpblock-frontend-style',
        'render_callback' => 'uniLwpBlock_custom_block_render_callback'
    ) );
}

add_action( 'init', 'uniLwpBlock_register_custom_block' );

/**
 * The front end template of the block.
 *
 * @param $attributes
 * @return void
 */
function uniLwpBlock_custom_block_render_callback( $attributes ) {
    $gridGap             = isset( $attributes['gridGap'] ) ? "{$attributes['gridGap']}px" : '10px';
    $displaySaleTag      = isset( $attributes['displaySaleTag'] ) ? $attributes['displaySaleTag'] : true;
    $displayProductTitle = isset( $attributes['displayProductTitle'] ) ? $attributes['displayProductTitle'] : true;
    $displayProductPrice = isset( $attributes['displayProductPrice'] ) ? $attributes['displayProductPrice'] : true;
    $displayProductBtn   = isset( $attributes['displayProductBtn'] ) ? $attributes['displayProductBtn'] : true;
    $titleColor          = isset( $attributes['titleColor'] ) ? "{$attributes['titleColor']}" : 'black';
    $priceColor          = isset( $attributes['priceColor'] ) ? "{$attributes['priceColor']}" : 'black';
    $btnColor            = isset( $attributes['btnColor'] ) ? "{$attributes['btnColor']}" : 'white';
    $btnBgColor          = isset( $attributes['btnBgColor'] ) ? "{$attributes['btnBgColor']}" : 'black';

    $products = uniLwpBlock_latest_products_data();

    if ( !empty( $products ) ) {
        ob_start();
        ?>
        <div>
            <div class="uniLwpBlockLatestProductsGrid" style="gap: <?php echo esc_attr( $gridGap ); ?>;">
                <?php foreach ( $products as $product ) { ?>
                    <div class="uniLwpBlockLatestProductsGrid__item">
                        <?php if ( $product['sale'] && $displaySaleTag ) { ?>
                            <span class="uniLwpBlockLatestProductsGrid__itemSaleTag"></span>
                        <?php } ?>
                        <picture class="uniLwpBlockLatestProductsGrid__itemPicture">
                            <source srcset="<?php echo esc_url( $product['image'] ); ?>">
                            <img src="<?php echo esc_url( $product['image'] ); ?>">
                        </picture>
                        <?php if ( $displayProductTitle ) { ?>
                            <a class="uniLwpBlockLatestProductsGrid__itemTitle"
                               style="color: <?php echo esc_attr( $titleColor ); ?>"
                               href="<?php echo esc_url( $product['url'] ); ?>">
                                <?php echo esc_html( $product['title'] ); ?>
                            </a>
                        <?php } ?>
                        <?php if ( $displayProductPrice ) { ?>
                            <p class="uniLwpBlockLatestProductsGrid__itemPrice"
                               style="color: <?php echo esc_attr( $priceColor ); ?>">
                                <?php echo $product['price']; ?>
                            </p>
                        <?php } ?>
                        <?php if ( $displayProductBtn ) { ?>
                            <a href="<?php echo esc_url( $product['add_to_cart'] ) ?>"
                               style="color: <?php echo esc_attr( $btnColor ); ?>; background-color: <?php echo esc_attr( $btnBgColor ); ?>;"
                               class="components-button uniLwpBlockLatestProductsGrid__itemBtn">
                                <?php _e( 'Add to cart' ) ?>
                            </a>
                        <?php } ?>
                    </div>
                <?php } ?>
            </div>
        </div>
        <?php
        $tmpl = ob_get_clean();

        return $tmpl;
    }
}