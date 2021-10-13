<template>
    <div>
        <div class="container">
            <el-divider content-position="left">基础信息</el-divider>
            <div class="app-info-text">
                <el-form :model="publishTaskInfo" :label-position = "labelPosition" label-width="120px" size="medium">
                    <el-form-item label="应用名称:">
                        <span>{{publishTaskInfo.appName}}</span>
                    </el-form-item>

                    <el-form-item label="打包tag:">
                        <span>{{publishTaskInfo.appPackTag}}</span>
                    </el-form-item>

                    <el-form-item label="jar包名称:">
                        <span>{{publishTaskInfo.jarName}}</span>
                    </el-form-item>

                    <el-form-item label="jar包版本:">
                        <span>{{publishTaskInfo.jarVersion}}</span>
                    </el-form-item>


                    <el-form-item label="发布环境:">
                        <el-tag v-for="item in getNowTaskEnv()"  effect="plain" style="margin-right: 2px">
                            {{ getEnvName(item) }}
                        </el-tag>
                    </el-form-item>

                    <el-form-item label="">
                        <el-button v-if="publishTaskInfo.taskStatus <= 10" icon="el-icon-s-cooperation"  type="warning" @click="startPack">待打包</el-button>
                        <el-button v-else-if="publishTaskInfo.taskStatus === 11" icon="el-icon-loading"  type="warning" disabled>开始打包</el-button>
                        <el-button v-else-if="publishTaskInfo.taskStatus === 12" icon="el-icon-loading"  type="warning" disabled>打包中</el-button>
                        <el-button v-else-if="publishTaskInfo.taskStatus === 13" icon="el-icon-s-cooperation"  type="danger" @click="reStartPack">打包失败</el-button>
                        <el-button v-else-if="publishTaskInfo.taskStatus >= 14" icon="el-icon-s-cooperation"  type="warning" @click="reStartPack">已打包</el-button>

                        <el-button  icon="el-icon-s-order" type="primary" :disabled = "publishTaskInfo.taskStatus <= 11" @click="handleOpenLogDrawer">打包日志</el-button>

                    </el-form-item>
                </el-form>
            </div>

        </div>
        <div class="container">
            <el-divider content-position="left">发布详情</el-divider>
            <div class="app-info-dev">
                <el-tabs v-model="activeEnv" @tab-click="handleClick">
                    <el-tab-pane v-for="item in getNowTaskEnv()" :label="getEnvName(item)" :name="item" >
                        <div>
                            <template>
                                <el-table :data="publishOrderList[item]" stripe style="width: 100%">
                                    <el-table-column prop="serverIp"  label="服务器IP" width="180"/>
                                    <el-table-column prop="serverShPort"  label="容器端口" width="180"/>
                                    <el-table-column prop="serverName" label="服务器名称" width="180"/>
                                    <el-table-column prop="publishStatus" label="发布状态" width="100">
                                        <template slot-scope="scope">
                                            <el-tag   effect="plain" >
                                                {{ getPublishStateLabel(scope.row.publishStatus) }}
                                            </el-tag>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作" align="center">
                                        <template slot-scope="scope">
                                            <el-button :icon="scope.row.publishStatus === 21 ? 'el-icon-loading':'el-icon-edit'" type="success" :disabled="scope.row.publishStatus < 14 || scope.row.publishStatus == 21" @click="pushPack(scope.row,scope.row.publishId)">
                                                推送
                                            </el-button>
                                            <el-button icon="el-icon-edit" type="primary" :disabled="scope.row.publishStatus <= 22">发布</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </template>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>

                <el-drawer
                        title="打包日志"
                        :visible.sync="logDrawer"
                        direction="rtl"
                        size="40%"
                        :before-close="handleCloseLogDrawer">
<!--                    <p v-html = 'parkLogContent' class = "show-content"/>-->
                    <div class = "show-content" >{{parkLogContent}}</div>
                </el-drawer>
        </div>

    </div>
</template>

<!--js等函数信息-->
<script>
    import request from '@/utils/request';
    import global from '@/utils/Global';
    import publishUrl from '@/api/publishUrl';
    import {getEnvName} from "../../../../utils/Global";
    export default {
        data(){
            return {
                taskId:0,
                labelPosition:"right",
                activeEnv: "100",
                publishTaskInfo:{

                },
                publishOrderList:{

                },
                intervalId:null,
                intervalPublishList:null,
                logDrawer: false,
                parkLogContent:"",
            }
        },
        created() {
            let taskId = this.$route.query.taskId;
            this.taskId = taskId;
            this.getTaskInfo(true);
        },
        destroyed(){
            // 在页面销毁后，清除计时器
            this.stopQueryPackStatus();
            this.stopPublishInfoRefresh();
        },
        methods: {
            handleClick() {
                //开始拉去列表
                request({
                    url: global.rubberBasePath + "/publish/push-task/env-info",
                    method: 'get',
                    params: {
                        'taskId':this.taskId,
                        'env':this.activeEnv,
                    }
                }).then(result => {
                    if (global.SUCCESS === result.code){
                        this.publishOrderList[this.activeEnv] = result.data;
                        console.info(this.publishOrderList)
                        for(let i in result.data){
                            let publishInfo = result.data[i];
                            console.info(publishInfo.publishStatus);
                            if (publishInfo.publishStatus != 21 &&  publishInfo.publishStatus != 31){
                                this.stopPublishInfoRefresh();
                            }
                        }
                    }else {
                        this.$message.error(result.msg);
                    }
                })

            },
            getEnvName(env){
                return global.getEnvName(env);
            },
            getNowTaskEnv(){
                if (this.publishTaskInfo === undefined || this.publishTaskInfo.appEnv === undefined || this.publishTaskInfo.appEnv === ''){
                    return [];
                }else {
                    return this.publishTaskInfo.appEnv.split(',')
                }
            },
            getPublishStateLabel(state){
                return global.showPublishLabel(state);
            },
            reStartPack(){
                this.$confirm('已经打包完成，确认重复打包吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.startPack();
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消重复打包'
                    });
                });
            },
            startPack(){
                //开始拉去列表
                request({
                    url: global.rubberBasePath + "/publish/push-task/pack/"+this.taskId,
                    method: 'post'
                }).then(result => {
                    if (global.SUCCESS === result.code){
                        this.$notify({
                            title: '开始打包',
                            message: '应用'+this.publishTaskInfo.appName+'已经开始打包',
                            type: 'success'
                        });
                        this.queryPackStatusRefresh();
                    }else {
                        this.$message.error(result.msg);
                    }
                })
            },
            queryPublishInfoRefresh(){
                // 计时器正在进行中，退出函数
                if (this.intervalPublishList != null) {
                    return;
                }
                // 计时器为空，操作
                this.intervalPublishList = setInterval(() => {
                    console.log("刷新" + new Date());
                    this.handleClick(); //加载数据函数
                }, 3000);
            },
            // 停止定时器
            stopPublishInfoRefresh() {
                clearInterval(this.intervalPublishList); //清除计时器
                this.intervalPublishList = null; //设置为null
            },

            queryPackStatusRefresh(){
                // 计时器正在进行中，退出函数
                if (this.intervalId != null) {
                    return;
                }
                // 计时器为空，操作
                this.intervalId = setInterval(() => {
                    console.log("刷新" + new Date());
                    this.queryStartPackStatus(); //加载数据函数
                }, 3000);
            },
            // 停止定时器
            stopQueryPackStatus() {
                clearInterval(this.intervalId); //清除计时器
                this.intervalId = null; //设置为null
            },
            queryStartPackStatus(){
                //开始拉去列表
                request({
                    url: global.rubberBasePath + "/publish/push-task/status/"+this.taskId,
                    method: 'post'
                }).then(result => {
                    if (global.SUCCESS === result.code){
                        this.publishTaskInfo.taskStatus = result.data;
                        if (this.publishTaskInfo.taskStatus === undefined || this.publishTaskInfo.taskStatus >= 13){
                            this.stopQueryPackStatus();
                            this.getTaskInfo(false);
                        }
                    }else {
                        this.$message.error(result.msg);
                    }
                })
            },
            getTaskInfo(isRefreshState){
                const infoUrl = publishUrl.allUrl.pushTask.info.replace("%s",this.taskId);
                request({
                    url: global.rubberBasePath + infoUrl,
                    method: 'get',
                }).then(result => {
                    console.info(result);
                    if (global.SUCCESS === result.code){
                        this.publishTaskInfo = result.data;
                        this.publishOrderList = this.publishTaskInfo.publishOrderList;
                        if (this.publishTaskInfo.taskStatus > 10 && this.publishTaskInfo.taskStatus <= 12 && isRefreshState){
                            this.queryPackStatusRefresh();
                        }
                    }else {
                        this.$message.error(result.msg);
                    }
                })
            },
            handleOpenLogDrawer(){
                this.logDrawer = true;
                this.queryStartPackLog();
            },
            handleCloseLogDrawer(){
                this.logDrawer = false;
            },
            queryStartPackLog(){
                //开始拉去列表
                request({
                    url: global.rubberBasePath + "/publish/push-task/log/"+this.taskId,
                    method: 'get'
                }).then(result => {
                    if (global.SUCCESS === result.code){
                        this.parkLogContent = result.data;
                    }else {
                        this.$message.error(result.msg);
                    }
                })
            },
            pushPack(row,publishId){
                //开始拉去列表
                request({
                    url: global.rubberBasePath + "/publish/push-task/push/"+publishId,
                    method: 'post'
                }).then(result => {
                    if (global.SUCCESS === result.code){
                        row.publishStatus = 21;
                        this.parkLogContent = result.data;
                        this.queryPublishInfoRefresh();
                    }else {
                        this.$message.error(result.msg);
                    }
                })
            }
        }
    }

</script>


<!--样式等css信息-->
<style scoped>
    .app-info-text{
        margin-left: 20px;
        font-size: 28px;
    }
    .app-info-dev{
        margin-left: 2%;
        width: 96%;
    }
    .show-content{
        white-space: pre-wrap;
        margin-left: 20px;
        color: #484a4d;
        overflow-y: auto;
        height: 1000px;
    }
</style>
