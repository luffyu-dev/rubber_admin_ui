import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            redirect: '/admin-user/welcome'
        },
        {
            path: '/admin-user',
            component: () => import(/* webpackChunkName: "home" */ '../views/home/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '',
                    redirect: 'welcome'
                },
                {
                    path: 'welcome',
                    component: () => import(/* webpackChunkName: "welcome" */ '../views/welcome.vue'),
                    meta: { title: '我的主页' }
                },
                {
                    path: 'sys/user-view',
                    component: () => import(/* webpackChunkName: "welcome" */ '../views/adminUser/sys/user/UserView'),
                    meta: { title: '用户管理' }
                },
                {
                    path: 'sys/role-view',
                    component: () => import(/* webpackChunkName: "welcome" */ '../views/adminUser/sys/role/RoleView'),
                    meta: { title: '角色管理' }
                },
                {
                    path: 'sys/dept-view',
                    component: () => import(/* webpackChunkName: "welcome" */ '../views/adminUser/sys/dept/DeptView'),
                    meta: { title: '部门管理' }
                },
                {
                    path: 'sys/menu-view',
                    component: () => import(/* webpackChunkName: "welcome" */ '../views/adminUser/sys/menu/MenuView'),
                    meta: { title: '菜单管理' }
                },
                {
                    path: 'sys/permission-dict-view',
                    component: () => import(/* webpackChunkName: "welcome" */ '../views/adminUser/sys/permission/PermissionDictView'),
                    meta: { title: '权限字典' }
                },
                {
                    path: 'sys/authorize-view',
                    component: () => import(/* webpackChunkName: "welcome" */ '../views/adminUser/sys/authorize/AuthorizeView'),
                    meta: { title: '权限信息-v1' }
                },
                {
                    path: 'sys/authorize-config',
                    component: () => import(/* webpackChunkName: "welcome" */ '../views/adminUser/sys/authorize/AuthorizeConfigView'),
                    meta: { title: '权限配置' }
                },
                {
                    path: 'dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '*',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                }
            ]
        },
        {
            path: '/publish',
            component: () => import(/* webpackChunkName: "home" */ '../views/home/Home.vue'),
            meta: { title: '发布系统' },
            children: [
                {
                    path: '',
                    redirect: 'welcome'
                },
                {
                    path: 'welcome',
                    component: () => import(/* webpackChunkName: "welcome" */ '../views/publish/home.vue'),
                    meta: { title: '我的主页' }
                },
                {
                    path: 'app',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../views/publish/app/index.vue'),
                    meta: { title: '应用管理' }
                },
                {
                    path: 'app/info',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../views/publish/app/component/appInfo'),
                    meta: { title: '应该详情' }
                },
                {
                    path: 'push-task',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../views/publish/pushTask/index.vue'),
                    meta: { title: '发布任务' }
                },
                {
                    path: 'push-task/info',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../views/publish/pushTask/component/pushTaskInfo'),
                    meta: { title: '发布任务' }
                },
                {
                    path: 'server-device',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../views/publish/serverDevice/index.vue'),
                    meta: { title: '服务器设备' }
                },
                {
                    path: 'pack-config',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../views/publish/packConfig/index.vue'),
                    meta: { title: 'Jar包配置' }
                },
                {
                    path: 'pack-order',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../views/publish/packOrder/index.vue'),
                    meta: { title: '打包管理' }
                },
                {
                    path: 'pack-order/info',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../views/publish/packOrder/component/packOrderInfo.vue'),
                    meta: { title: '打包管理' }
                },
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/404.vue'),
            meta: { title: '404' }
        }

    ]
});
