const Glod = {
  // 测试环境配置
  clmPath: 'http://192.168.22.60', // 开发环境webpack代理访问的接口地址
  officeName: 'bisheng', // 毕升  bisheng 畅写   changxie。注：毕升/畅写有回调，在使用前需要关闭回调服务器的防火墙
  editorHost: 'http://127.0.0.1:80',
  cxScriptPath: 'http://127.0.0.1/web-apps/apps/api/documents/api.js', // 开发环境畅写脚本地址192.168.163.28
  publicPath: '', // 开发环境的publicPath为空
  systemCode: 'tsign_system', // 开发环境系统编码
  localEncryptedKey: 'pcp cache key' // @/util/wsCache加密使用的盐
}
