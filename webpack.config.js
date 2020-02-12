const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/**
 * Name of block or page to build
 * @type {String}
 */
var target;

/**
 * Building type `Page` or `Block`
 * @type {String}
 */
var type;

/**
 * Path to input file for building
 * @type {String}
 */
var entry;

/**
 * Output file name
 * @type {String}
 */
var output;

/**
 * Current environment
 * @type {String}
 * @default test
 */
var env = 'Test';

/**
 * Parsing cmd arguments, suported are
 * --block=block_name - which block to build
 * --env=environment  - test or product
 */
process.argv.forEach((argv) =>
{
    argv = argv.split('=');

    if (argv.length != 2)
    {
        return;
    }

    switch(argv[0])
    {
        case '--block':
            target = argv[1];
            output = 'Example';
            entry = target + '/.Example/Example'
            type = 'Block';
            break;
        
        case '--page':
            target = argv[1];
            output = target;
            entry = target + `/${argv[1]}`;
            type = 'Page';
            break;
        
        case '--env':
            env = (argv[1] === 'prod') ? 'Production' : 'Test';
            break;
    }
});

module.exports =
{
    entry: `./${type}s/${entry}.js`,
    output: 
    {
        filename: `${output}.js`,
        path: path.resolve(__dirname, `./Build/${env}/${type}s/${target}`),
    },
    module:
    {
        rules:
        [
            {
                test: /\.js$/,
                use:
                {
                    loader: 'babel-loader',
                    options:
                    {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            },
            { test: /\.svg$/, use: ['raw-loader'] },
            {
                test: /\.(png|jpe?g|gif)$/i,
                loader: 'file-loader',
                options:
                {
                    publicPath: 'Assets/',
                    name: '[name].[ext]',
                },
            },
        ],
    },
    plugins:
    [
        new CopyPlugin([
            { from: `${type}s/${entry}.html`, to: `${output}.html` },
            { from: `${type}s/${output}/Assets`, to: 'Assets' },
            { from: `${type}s/${output}/Basis.js`, to: 'Basis.js' }
        ]),
        new MiniCssExtractPlugin(
            { filename: `${output}.css` }
        ),
    ],
    mode: 'development',
};
