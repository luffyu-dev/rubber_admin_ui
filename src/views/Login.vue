<template>
    <div>
        <div class="login-wrap">
            <div class="system_config_title">
                <div class="logo">
                    <h1>{{titleConfig.logo}}</h1>
                </div>
                <div class="main_title">
                    {{titleConfig.title}}
                </div>
                <div class="subtitle_title">
                    {{titleConfig.subtitle}}
                </div>
            </div>
        </div>

        <div class="login-form-wrap">
            <div class="ms-login">
                <el-form :model="user" :rules="rules" ref="login" label-width="0px" class="ms-content">
                    <el-form-item prop="account">
                        <el-input v-model="user.account" placeholder="account">
                            <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input
                                type="password"
                                placeholder="password"
                                v-model="user.password"
                                @keyup.enter.native="submitForm()"
                        >
                            <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                        </el-input>
                    </el-form-item>
                    <div class="login-btn">
                        <el-button type="primary" @click="submitForm()">登录</el-button>
                    </div>
                    <p class="login-tips">Tips : 用户名和密码随便填。</p>
                </el-form>
            </div>
        </div>

        <div class="login-footer">

        </div>
    </div>
</template>

<script>

    import {login,oaSystemConfig} from '../api/login';
    import { setToken } from '../utils/auth';
    import global from "@/utils/Global";


    export default {
        data: function() {
            return {
                titleConfig:{
                    logo:"LUFFYU.CN",
                    title:"前进.梅里号系统",
                    subtitle:"OA.发布的管理平台",
                },
                user: {
                    account: '',
                    password: '',
                },
                rules: {
                    account: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                },
            };
        },
        methods: {
            submitForm() {
                this.$refs.login.validate(valid => {
                    //发送请求
                    login(this.user).then(
                        result => {
                            if(result.code === global.SUCCESS){
                                var userInfo = result.data;
                                this.$message.success('登录成功');
                                localStorage.setItem('ms_username', userInfo.name);
                                setToken(userInfo.token);
                                //读取当前的系统配置
                                this.$router.push('/');
                            }else {
                                this.$message.error(result.msg);
                                console.log('error submit!!');
                                return false;
                            }
                        }
                    );

                });
            },
        },
    };
</script>

<style scoped>
    body{
        height: 100vh;
    }
    .login-wrap {
        width: 100%;
        height: 50vh;
        background-image: url(../assets/img/login-bg-3.jpg);
        background-size: 100%;
    }

    .system_config_title{
        position: absolute;
        width: 40%;
        margin-left: 30%;
        text-align: center;
        height: 20vh;
        margin-top: 15vh;
        color: #ffffff;
    }
    .logo{
        width: 100%;
        padding: 5px;
    }
    .main_title{
        width: 100%;
        padding: 5px;
        font-size: 50px;
        font-weight: bold;
        letter-spacing: inherit;
    }
    .subtitle_title{
        width: 100%;
        padding: 5px;
        font-size: 30px;
    }

    .login-form-wrap{
        width: 20%;
        margin-left: 40%;
        min-width: 350px;
        text-align: center;
        height: 45vh;
    }
    .ms-login {
        width: 350px;
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.3);
        text-align: center;
    }
    .ms-content {
        padding: 30px 30px;
    }
    .login-btn {
        text-align: center;
    }
    .login-btn button {
        width: 100%;
        height: 36px;
        margin-bottom: 10px;
    }
    .login-tips {
        font-size: 12px;
        line-height: 30px;
        color: #fff;
    }
    .login-footer{
        width: 100%;
        background-color: #cad6dc;
        margin-bottom: 1px;
        height: 5vh;
    }
</style>
