module.exports = {
    publicPath: "/",
    // outputDir: 在npm run build 或 yarn build 时 ，生成文件的目录名称（要和baseUrl的生产环境路径一致）
    outputDir: "dist",
    assetsDir: "static",

    productionSourceMap: false,
    devServer: {
        host: "127.0.0.1",
        port: 8080,
        https: false,

        //系统管理的后台自定义配置
        proxy: {
            '/oa-api/sys':{
                target:'http://127.0.0.1:8081',
                changeOrigin:true
            },
            '/oa-api/publish':{
                target:'http://127.0.0.1:38002',
                changeOrigin:true
            },
            '/oa-api':{
                target:'http://127.0.0.1:8081',
                changeOrigin:true
                // pathRewrite:{
                //     '/api':'/api'
                // }
            }
        }
    }
}
