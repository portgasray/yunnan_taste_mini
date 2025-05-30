import type { UserConfigExport } from "@tarojs/cli"

export default {
  mini: {
    /**
     * Production optimization settings for WeChat Mini-Program
     */
    webpackChain(chain) {
      // Enable minification and optimization
      chain.mode('production')
      chain.optimization.minimize(true)
      
      // Split chunks for better performance
      chain.optimization.splitChunks({
        chunks: 'all',
        maxInitialRequests: 5,
        minSize: 0,
        cacheGroups: {
          vendors: {
            name: 'vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: 10
          },
          common: {
            name: 'common',
            minChunks: 2,
            priority: 5
          },
          components: {
            name: 'components',
            test: /[\\/]components[\\/]/,
            minChunks: 2,
            priority: 8
          },
          animations: {
            name: 'animations',
            test: /[\\/]animations[\\/]/,
            priority: 7
          }
        }
      })
      
      // Enable tree shaking
      chain.optimization.usedExports(true)
      
      // Add bundle analyzer in case we need to analyze the bundle size
      if (process.env.ANALYZE === 'true') {
        const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
        chain.plugin('analyzer').use(BundleAnalyzerPlugin, [])
      }
    },
    
    // Optimize CSS
    postcss: {
      // Enable CSS minification
      csso: {
        enable: true,
        config: {
          // Keep necessary comments only
          comments: false
        }
      }
    },
    
    // Compress images
    imageMinifier: {
      enable: true,
      config: {
        // Image optimization settings
        mozjpeg: {
          quality: 80
        },
        pngquant: {
          quality: [0.8, 0.9],
          speed: 4
        },
        optipng: {
          optimizationLevel: 7
        },
        gifsicle: {
          interlaced: false
        }
      }
    },
    
    // Enable source maps for debugging
    enableSourceMap: false,
    
    // Enable ES6 to ES5 conversion for better compatibility
    enableEs6ToEs5: true,
    
    // Enable extract common chunks
    enableExtract: true,
    
    // Minify options
    minifyXML: {
      collapseWhitespace: true
    },
    
    // Compiler options
    compilerOptions: {
      // WeChat specific compiler options
      type: 'webpack5',
      hot: false
    }
  },
  h5: {
    /**
     * WebpackChain plugin configuration
     * @docs https://github.com/neutrinojs/webpack-chain
     */
    webpackChain(chain) {
      // Enable minification and optimization
      chain.mode('production')
      chain.optimization.minimize(true)
      
      // Add bundle analyzer if needed
      if (process.env.ANALYZE === 'true') {
        const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
        chain.plugin('analyzer').use(BundleAnalyzerPlugin, [])
      }
    },
    
    // Enable source maps for debugging
    enableSourceMap: false,
    
    // Enable extract common chunks
    enableExtract: true
  }
} satisfies UserConfigExport<'webpack5'>
