<script>
  //rubber后台的全局地址
  const rubberBasePath = '/oa-api';


  //请求成功的code
  const SUCCESS = '1000000';
  //用户没有登陆
  const USER_NOT_LOGIN = '3020100';
  //登陆的token过期
  const TOKEN_IS_EXPIRED = '3020105';
  //账户登陆状态异常
  const LOGIN_VERSION_ILLEGAL = '3020109';


  const OA_SYSTEM_CONFIG = [
      {
          "system_key":"admin-user",
          "system_name":"OA权限系统",
      },
      {
          "system_key":"publish",
          "system_name":"发布系统",
      }
  ];

  export default
  {
    rubberBasePath,
    SUCCESS,
    OA_SYSTEM_CONFIG,
    checkLoginFlag,
    handelRequestError,
    getSystemIndex,
    getEnvName,
    showStatusLabel,
    showLinkStatusLabel,
      getAllEnv,
      showPublishLabel,
      showPublishStatus

  }

  /**
   * 检测登陆状态
   * @param code 当前的接口请求code
   * @returns {boolean} 返回true表示登陆状态正常 返回false表示不正常
   */
  export function checkLoginFlag(code) {
    if(code === USER_NOT_LOGIN || code === TOKEN_IS_EXPIRED || code === LOGIN_VERSION_ILLEGAL){
      return false;
    }
    return true;
  }

  export function handelRequestError(result) {
    this.$message.error(result.msg);
  }


  export function getSystemIndex() {
      let activeSystemIndex = "";
      let url = location.href;
      let  arrUrl = url.split("//");
      let  start = arrUrl[1].split("/");
      if (start.length >= 1 ){
          let  systemIndex = start[1];
          if (systemIndex != ""){
              activeSystemIndex = systemIndex;
          }
      }
      return activeSystemIndex;
  }



  export function getEnvName(env) {
      let allEnv = getAllEnv();
      return allEnv[env];
  }


  export function getAllEnv() {
        return {
            "100":"开发环境",
            "200":"测试环境",
            "300":"预发布环境",
            "400":"线上环境",
        }
  }


  export function showStatusLabel(statue) {
      if (statue == '10'){
          return "初始化";
      }else if (statue == '20'){
          return "正常";
      }else if (statue == '30'){
          return "停用";
      }else if (statue == '40'){
          return "释放";
      }else {
          return "未知"
      }
  }


  export function showLinkStatusLabel(statue) {
      if (statue == '10'){
          return "初始化中";
      }else if (statue == '20'){
          return "连接正常";
      }else if (statue == '30'){
          return "连接失败";
      }else if (statue == '40'){
          return "释放中";
      }else {
          return "未知"
      }
  }

  export function showPublishLabel(publishStatus) {
      return showPublishStatus()[publishStatus];
  }

  export function showPublishStatus() {
      return {
          "10":"待打包",
          "11":"开始打包",
          "12":"打包中",
          "13":"打包失败",
          "14":"已打包",
          "20":"待推送",
          "21":"推送中",
          "22":"推送失败",
          "23":"已推送",
          "30":"待发布",
          "31":"发布中",
          "32":"已发布"
      }
  }

</script>
