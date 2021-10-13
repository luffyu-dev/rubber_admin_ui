<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <i v-if="!collapse" class="el-icon-s-fold"></i>
            <i v-else class="el-icon-s-unfold"></i>
        </div>
        <div class="logo">前进·梅利号</div>
        <div class="header-middle">
            <el-menu
                    :default-active="activeSystemIndex"
                    class="sidebar-el-menu"
                    background-color="#242f42"
                    active-text-color="#20a0ff"
                    text-color="#fff"
                    unique-opened
                    mode="horizontal"
                    @select="handleSelect">

                <el-menu-item v-for="item in osSystemConfig" :index="item.system_key" @click="checkNav(item.system_key)">{{item.system_name}}</el-menu-item>

                <!--                <el-submenu index="2">-->
<!--                    <template slot="title">我的工作台</template>-->
<!--                    <el-menu-item index="2-1">选项1</el-menu-item>-->
<!--                    <el-menu-item index="2-2">选项2</el-menu-item>-->
<!--                    <el-menu-item index="2-3">选项3</el-menu-item>-->
<!--                    <el-submenu index="2-4">-->
<!--                        <template slot="title">选项4</template>-->
<!--                        <el-menu-item index="2-4-1">选项1</el-menu-item>-->
<!--                        <el-menu-item index="2-4-2">选项2</el-menu-item>-->
<!--                        <el-menu-item index="2-4-3">选项3</el-menu-item>-->
<!--                    </el-submenu>-->
<!--                </el-submenu>-->
            </el-menu>
        </div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 全屏显示 -->
                <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
                        <i class="el-icon-rank"></i>
                    </el-tooltip>
                </div>
                <!-- 消息中心 -->
                <div class="btn-bell">
                    <el-tooltip
                        effect="dark"
                        :content="message?`有${message}条未读消息`:`消息中心`"
                        placement="bottom"
                    >
                        <router-link to="/tabs">
                            <i class="el-icon-bell"></i>
                        </router-link>
                    </el-tooltip>
                    <span class="btn-bell-badge" v-if="message"></span>
                </div>
                <!-- 用户头像 -->
                <div class="user-avator">
                    <img src="../../assets/img/img.jpg" />
                </div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{username}}
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item divided command="loginout" >退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>
<script>
import bus from '../../api/home/bus';
import { loginOut , getUserInfo } from "@/utils/auth";
import global from "@/utils/Global";
export default {
    data() {
        return {
            collapse: false,
            fullscreen: false,
            name: 'luffyu',
            message: 2,
            activeSystemIndex: 'admin-user',
            osSystemConfig : global.OA_SYSTEM_CONFIG
    };
    },
    created() {
        this.activeSystemIndex = global.getSystemIndex();
    },
    computed: {
        username() {
            let username = localStorage.getItem('ms_username');
            return username ? username : this.name;
        }
    },
    methods: {
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
        },
        // 用户名下拉菜单选择事件
        handleCommand(command) {
            if (command == 'loginout') {
                loginOut();
                this.$router.push('/login');
            }
        },
        // 侧边栏折叠
        collapseChage() {
            this.collapse = !this.collapse;
            bus.$emit('collapse', this.collapse);
        },
        // 全屏事件
        handleFullScreen() {
            let element = document.documentElement;
            if (this.fullscreen) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.webkitRequestFullScreen) {
                    element.webkitRequestFullScreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.msRequestFullscreen) {
                    // IE11
                    element.msRequestFullscreen();
                }
            }
            this.fullscreen = !this.fullscreen;
        },
        checkNav(href){
            location.href = `//${location.host}/${href}`;
            this.activeSystemIndex = href;
        }

    },
    mounted() {

    }
};
</script>
<style scoped>
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 60px;
    color: #fff;
}
.collapse-btn {
    float: left;
    cursor: pointer;
    line-height: 60px;
    width: 64px;
    text-align: center;
}
.header .logo {
    float: left;
    width: 200px;
    line-height: 60px;
    font-size: 18px;
}
.header-right {
    float: right;
    padding-right: 50px;
}
.header-middle{
    float: left;
}
.header-user-con {
    display: flex;
    height: 60px;
    align-items: center;
}
.btn-fullscreen {
    transform: rotate(45deg);
    margin-right: 5px;
    font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
}
.btn-bell-badge {
    position: absolute;
    right: 0;
    top: -2px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #f56c6c;
    color: #fff;
}
.btn-bell .el-icon-bell {
    color: #fff;
}
.user-name {
    margin-left: 10px;
}
.user-avator {
    margin-left: 20px;
}
.user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
.el-dropdown-link {
    color: #fff;
    cursor: pointer;
}
.el-dropdown-menu__item {
    text-align: center;
}
.el-menu-item,.el-submenu,.el-submenu.template{
    min-width: 150px;
    text-align: center;
}
</style>
