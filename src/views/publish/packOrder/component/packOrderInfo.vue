<template>
    <div>
        <div class="container">
            <el-divider content-position="left">基础信息</el-divider>
            <div class="app-info-text">
                <el-form :model="publishTaskInfo" :label-position = "labelPosition" label-width="120px" size="medium">
                    <el-form-item label="包名称:">
                        <span>{{publishTaskInfo.packName}}</span>
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

                    <el-form-item label="">
                        <el-button v-if="publishTaskInfo.taskStatus <= 10" icon="el-icon-s-cooperation" :disabled="publishTaskInfo.taskStatus === 0"  type="warning" @click="startPack">待打包</el-button>
                        <el-button v-else-if="publishTaskInfo.taskStatus === 11" icon="el-icon-loading"  type="warning" disabled>开始打包</el-button>
                        <el-button v-else-if="publishTaskInfo.taskStatus === 12" icon="el-icon-loading"  type="warning" disabled>打包中</el-button>
                        <el-button v-else-if="publishTaskInfo.taskStatus === 13" icon="el-icon-s-cooperation"  type="danger" @click="reStartPack">打包失败</el-button>
                        <el-button v-else-if="publishTaskInfo.taskStatus >= 14" icon="el-icon-s-cooperation"  type="warning" @click="reStartPack">已打包</el-button>
                        <el-button  icon="el-icon-s-order" type="primary" :disabled = "publishTaskInfo.taskStatus <= 11" @click="handleOpenLogDrawer">打包日志</el-button>

                    </el-form-item>
                </el-form>
            </div>

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
</template>

<!--js等函数信息-->
<script>
    import request from '@/utils/request';
    import global from '@/utils/Global';
    import publishUrl from '@/api/publishUrl';
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
                    url: global.rubberBasePath + "/publish/pack-order/pack/"+this.taskId,
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
                    url: global.rubberBasePath + "/publish/pack-order/status/"+this.taskId,
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
                const infoUrl = publishUrl.allUrl.packOrder.info.replace("%s",this.taskId);
                request({
                    url: global.rubberBasePath + infoUrl,
                    method: 'get',
                }).then(result => {
                    console.info(result);
                    if (global.SUCCESS === result.code){
                        this.publishTaskInfo = result.data;
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
                    url: global.rubberBasePath + "/publish/pack-order/log/"+this.taskId,
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
