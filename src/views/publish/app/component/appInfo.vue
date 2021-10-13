<template>
    <div>
        <div class="container">
            <el-divider content-position="left">基础信息</el-divider>
            <div class="app-info-text">
                <el-form :model="appInfo" :label-position = "labelPosition" label-width="120px" size="medium">
                    <el-form-item label="应用名称:">
                        <span>{{appInfo.appName}}</span>
                    </el-form-item>

                    <el-form-item label="端口:">
                        <span>{{appInfo.appPort}}</span>
                    </el-form-item>
                    <el-form-item label="状态:">
                        <span>
                             <el-tag type="success">正常</el-tag>
                        </span>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="container">
            <el-divider content-position="left">服务信息</el-divider>
            <div class="app-info-dev">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane v-for="(item,index) in appInfo.appServerList" :label="getEnvName(index)" :name="index" >
                        <div>
                            <template>
                                <el-table :data="item" stripe style="width: 100%">
                                    <el-table-column prop="serverIp"  label="服务器ip" width="180"/>
                                    <el-table-column prop="serverShPort"  label="容器端口" width="180"/>
                                    <el-table-column prop="serverName" label="服务器名称" width="180"/>
                                    <el-table-column prop="appPackTag" label="打包Tag" width="100"/>
                                    <el-table-column prop="appServerStatus" label="服务状态" width="100">
                                        <template slot-scope="scope">
                                            <el-tag v-if="scope.row.appServerStatus == '10'" type="warning">
                                               <i class=" el-icon-loading"/> <span > {{showStatus(scope.row.appServerStatus)}}</span>
                                            </el-tag>
                                            <el-tag v-else-if="scope.row.appServerStatus == '40'" type="info">
                                                <i class=" el-icon-loading"/> <span > {{showStatus(scope.row.appServerStatus)}}</span>
                                            </el-tag>
                                            <el-tag v-else :type=" scope.row.appServerStatus == '20' ? 'success': 'danger' ">
                                                <span > {{showStatus(scope.row.appServerStatus)}}</span>
                                            </el-tag>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作" align="center">
                                        <el-button icon="el-icon-edit" type="success">检测</el-button>
                                        <el-button icon="el-icon-edit" type="primary">重启</el-button>
                                        <el-button icon="el-icon-edit" type="danger">停用</el-button>
                                    </el-table-column>
                                </el-table>
                            </template>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>

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
                labelPosition:"right",
                activeName: "100",
                appInfo:{

                },

            }
        },
        methods: {
            handleClick(tab, event) {
                console.log(tab, event);
            },
            getEnvName(env){
                return global.getEnvName(env);
            },
            showStatus(status){
                return global.showStatusLabel(status)
            }
        },
        created() {
            let appName = this.$route.query.appName;
            const infoUrl = publishUrl.allUrl.app.info.replace("%s",appName);
            request({
                url: global.rubberBasePath + infoUrl,
                method: 'get',
            }).then(result => {
                console.info(result);
                if (global.SUCCESS === result.code){
                    this.appInfo = result.data;
                    for (var i in this.appInfo.appServerList){
                        this.activeName = i;
                        return;
                    }
                }else {
                    this.$message.error(result.msg);
                }
            })
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




</style>
