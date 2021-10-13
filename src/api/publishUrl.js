/**
 * %s 替换符
 * @type {{sysRole: {add: string, edit: string, del: string, pageList: string}, sysPermissionDict: {add: string, edit: string, del: string, pageList: string}, sysUser: {add: string, edit: string, del: string, pageList: string}, sysMenu: {add: string, edit: string, del: string, pageList: string}, sysDept: {add: string, edit: string, del: string, pageList: string}}}
 */
const allUrl = {
  app:{
    pageList:"/publish/app/list",
    add:"/publish/app/add",
    edit:"/publish/app/update/%s",
    del:"/publish/app/del/%s",
    info:"/publish/app/info/%s",
  },
  pushTask:{
    pageList:"/publish/push-task/list",
    add:"/publish/push-task/add",
    edit:"/publish/push-task/update/%s",
    del:"/publish/push-task/del/%s",
    info:"/publish/push-task/info/%s",
  },
  serverDevice:{
    pageList:"/publish/server-device/list",
    add:"/publish/server-device/add",
    edit:"/publish/server-device/update/%s",
    del:"/publish/server-device/del/%s",
    info:"/publish/server-device/info/%s",
    checkStatus:"/publish/server-device/test-status/%s"
  },
};


export default {
  allUrl
}
