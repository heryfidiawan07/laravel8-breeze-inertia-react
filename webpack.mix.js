const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/js/app.js', 'public/js')
    .react()
    // .postCss('resources/css/app.css', 'public/css', [
    //     require('postcss-import'),
    //     require('tailwindcss'),
    //     require('autoprefixer'),
    // ])
    .sass('resources/sass/app.scss', 'public/css')
    .sourceMaps()
    .webpackConfig(require('./webpack.config'));

// mix.js(['./public/assets/js/stisla.js', './public/assets/js/scripts.js'], 'public/js/app.js');
// // mix.styles(['./public/assets/css/style.css', './public/assets/css/components.css'], 'public/css/app.css');

if (mix.inProduction()) {
    mix.version();
}
