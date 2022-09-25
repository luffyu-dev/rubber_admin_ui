module.exports = {
    publicPath: "/",
    // outputDir: 在npm run build 或 yarn build 时 ，生成文件的目录名称（要和baseUrl的生产环境路径一致）
    outputDir: "dist",
    assetsDir: "static",

    productionSourceMap: false,
    devServer: {
        host: "0.0.0.0",
        port: 48080,
        https: false,

        //系统管理的后台自定义配置
        proxy: {
            // at网球管理后台
            '/oa-api/at-admin':{
                target: 'http://127.0.0.1:38003',
                changeOrigin:true
            },

            // oa-api 用户管理
            '/oa-api/sys':{
                target:'http://oa-api.luffyu.cn',
                changeOrigin:true
            },

            // oa-api 发布系统
            '/oa-api/publish':{
                target:'http://oa-api.luffyu.cn',
                changeOrigin:true
            },

            // 全局默认
            '/oa-api':{
                target:'http://oa-api.luffyu.cn',
                changeOrigin:true
            }
        }
    }
}
