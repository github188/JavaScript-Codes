
/*
    配置文件
 */

module.exports = {
    port: 3000,
    session: {
        secret: 'myblog',
        key: 'myblog',
        maxAge: '300000'
    },
    mongodb: 'mongodb://localhost:27017/myblog'
};