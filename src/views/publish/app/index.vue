<template>
    <div>
        <el-form :inline="true" class="container">
            <div class="handle-box">
                <el-input v-model="query.searchData.appName" placeholder="应用名称" class="handle-input"></el-input>
                <el-input v-model="query.searchData.appPort" placeholder="应用端口" class="handle-input"></el-input>
                <el-input v-model="query.searchData.appBusinessLine" placeholder="业务线" class="handle-input"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
        </el-form>
        <div class="container">
            <div class="container-head ">
                <el-button
                        type="primary"
                        icon="el-icon-lx-add"
                        class="el-button-add"
                        @click="openAdd"
                >新增应用</el-button>
            </div>

            <el-table
                    :data="tableData"
                    border
                    class="table"
                    row-key="key"
                    ref="multipleTable"
                    highlight-current-row
                    header-cell-class-name="table-header"
                    :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                <el-table-column prop="id" width="50" label="ID" />
                <el-table-column prop="appName" width="280" label="应用名称" >
                    <template slot-scope="scope">
                        <el-link type="primary" @click="goInfo(scope.$index, scope.row)">{{scope.row.appName}}</el-link>
                    </template>
                </el-table-column>
                <el-table-column prop="appPort" width="80" label="应用端口" />
                <el-table-column prop="appBusinessLine"  width="150" label="业务类型" />
                <el-table-column prop="appType"  width="100" label="应用类型" >
                    <template slot-scope="scope">
                        IO密集
                    </template>
                </el-table-column>
                <el-table-column prop="jdkVersion"  width="80" label="jdk版本" />
                <el-table-column prop="deployNum"  width="80" label="部署量">
                    <template>
                        1
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button
                                icon="el-icon-edit"
                                type="primary"
                                @click="openEdit(scope.$index, scope.row)"
                        >配置编辑</el-button>

                        <el-button
                                icon="el-icon-position"
                                type="success"
                                @click="goInfo(scope.$index, scope.row)"
                        >机器详情</el-button>

                        <el-button
                                icon="el-icon-rank"
                                type="warning"
                                @click="openCapacity(scope.$index, scope.row)"
                        >伸缩容</el-button>

                    </template>
                </el-table-column>

            </el-table>
            <div class="pagination">
                <el-pagination
                        background
                        layout="total, prev, pager, next"
                        :current-page="query.page"
                        :page-size="query.size"
                        :total="pageTotal"
                        @current-change="handlePageSearch"/>
            </div>

        </div>


        <el-dialog :title="addEditTitle" :visible.sync="addEditVisible" :before-close='closeAddEdit' width="60%" style="min-height: 400px">
            <el-form ref="form" :model="form" :rules="rules" label-width="130px">
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="应用名称">
                            <el-input v-model="form.appName" :disabled="this.addEditType === 'edit'"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="10">
                        <el-form-item label="应用端口">
                            <el-input v-model="form.appPort"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>


                <el-row>
                    <el-col :span="10">
                        <el-form-item label="业务类型">
                            <el-input v-model="form.appBusinessLine"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="10">
                        <el-form-item label="应用类型">
                            <el-select v-model="form.appType">
                                <el-option key="io" label="IO密集" value="io"/>
                                <el-option key="cpu" label="CPU密集" value="cpu"/>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="10">
                        <el-form-item label="jdk版本">
                            <el-select v-model="form.jdkVersion">
                                <el-option key="1.8" label="1.8" value="1.8"/>
                                <el-option key="1.7" label="1.7" value="1.7"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="20">
                        <el-form-item label="gitHub代码地址">
                            <el-input v-model="form.githubUrl"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="10">
                        <el-form-item label="maven打包路径">
                            <el-input v-model="form.mavenPath"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="服务推送地址">
                            <el-input v-model="form.deployPath"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="发布子模块">
                            <el-input v-model="form.publishModel"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeAddEdit">取 消</el-button>
                <el-button type="primary" @click="handleAddEdit(form.appName)">确 定</el-button>
            </div>
        </el-dialog>


        <el-dialog title="伸缩容" :visible.sync="capacity" :before-close='closeCapacity' width="60%">
            <el-form label-position = "right" label-width="120px" size="medium">
                <el-form-item label="应用名称:">
                    <span>{{capacityAppInfo.appName}}</span>
                </el-form-item>

                <el-form-item label="端口:">
                    <span>{{capacityAppInfo.appPort}}</span>
                </el-form-item>
                <el-form-item label="扩容的环境:">
                    <el-select v-model="capacitycheckEnv" placeholder="选择扩容环境" @change="getAllEnvServerInfo()">
                        <el-option v-for="(index,item) in getAllEnvInfo()" :label="index" :value="item"/>
                    </el-select>
                </el-form-item>

            </el-form>

            <template>
                <el-table :data="checkEnvServerList" stripe style="width: 96%;margin-left: 2%">
                    <el-table-column prop="applicationId" label="ID" width="100"/>
                    <el-table-column prop="serverKey" label="服务器key" >
                        <template slot-scope="scope">
                            <span v-if="scope.row.applicationId != undefined">{{scope.row.serverKey}}</span>
                            <el-select v-else  v-model="scope.row.serverKey"   @change="selectCapacityApp(scope.$index,scope.row)" filterable>
                                <el-option v-for="item in listAppAll" :label="item.serverKey" :value="item.serverKey"/>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="serverName" label="服务器名称" />
                    <el-table-column prop="serverIp"  label="服务器ip" />
                    <el-table-column prop="serverShPort"  label="容器端口" />
                    <el-table-column prop="appServerStatus"  label="服务状态" >
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
                        <template slot-scope="scope">
                            <el-button v-if="scope.row.applicationId != undefined" icon="el-icon-remove-outline" type="warning" @click="submitReduction(scope.row)" :disabled="scope.row.appServerStatus == '40'">缩容当前机器</el-button>
                            <el-button v-else icon="el-icon-remove-outline" @click="removeCapacityApp(scope.$index, checkEnvServerList)">移除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>

            <div style="width: 100%;text-align: center;margin-top: 10px">
                <el-button icon="el-icon-circle-plus-outline" type="success" @click="addCapacityApp()">服务扩容</el-button>
                <el-button icon="el-icon-circle-plus-outline"  @click="submitCapacityApp">提交申请</el-button>

            </div>

        </el-dialog>

    </div>
</template>


<script>
import BaseList from '@/components/BaseTableCurd.vue';
import publishUrl from '@/api/publishUrl';
import global from "@/utils/Global";
import request from '@/utils/request';

export default {
    extends: BaseList,
    data() {
        const data = BaseList.data();
        data.url = publishUrl.allUrl.app;
        data.capacity = false;
        data.capacityAppInfo = {};
        data.checkEnvServerList = [];
        data.capacitycheckEnv = '';
        data.listAppAll = [];
        return data
    },
    created() {
        this.getListAppAll();
    },

    methods:{
        showAppStatus(status){
            if (status === 10){
                return '正常';
            }else if (status === 20){
                return '停用';
            }
        },
        goInfo(index,row){
            this.goInfoForName(row.appName);
        },
        goInfoForName(appName){
            this.$router.push({path: "app/info",query: {appName: appName}});
        },
        showStatus(status){
            return global.showStatusLabel(status)
        },
        closeCapacity(){
            this.capacity = false;
            this.capacityAppInfo = {};
            this.checkEnvServerList = [];
            this.capacitycheckEnv = '';
        },
        openCapacity(index,row){
            this.capacity = true;
            this.capacityAppInfo = row;
            for (let itm in this.getAllEnvInfo()){
                console.info(itm)
            }
        },
        getAllEnvInfo(){
            return global.getAllEnv();
        },
        getAllEnvServerInfo(){
            //开始拉去列表
            request({
                url: global.rubberBasePath + "/publish/app/server-list",
                method: 'get',
                params: {
                    "appName":this.capacityAppInfo.appName,
                    "checkEnv":this.capacitycheckEnv
                }
            }).then(result => {
                console.info(result);
                if (global.SUCCESS === result.code){
                    this.checkEnvServerList = result.data;
                }else {
                    this.$message.error(result.msg);
                }
            })
        },
        getListAppAll(){
            //开始拉去列表
            request({
                url: global.rubberBasePath + "/publish/server-device/list-app-all",
                method: 'get',
            }).then(result => {
                console.info(result);
                if (global.SUCCESS === result.code){
                    this.listAppAll = result.data;
                }else {
                    this.$message.error(result.msg);
                }
            })
        },
        addCapacityApp(){
            if (this.capacitycheckEnv === ''){
                this.$message.error("请选择需要扩容的环境");
                return;
            }
            this.checkEnvServerList.push({})
        },
        removeCapacityApp(index,rows){
            rows.splice(index, 1);
        },
        selectCapacityApp(index,rows){
            for (let i in this.checkEnvServerList){
                let tmp = this.checkEnvServerList[i];
                if (i != index && tmp.serverKey === rows.serverKey){
                    rows.serverKey = '';
                    rows.serverName = '';
                    rows.serverIp = '';
                    rows.serverShPort = '';
                    this.$message.error("当前机器已经部署此服务");
                    return;
                }
            }
            let checkCapacity = {};
            for (let i in this.listAppAll){
                let tmp = this.listAppAll[i];
                if (tmp.serverKey === rows.serverKey){
                    checkCapacity = tmp;
                }
            }
            rows.serverName = checkCapacity.serverName;
            rows.serverIp = checkCapacity.serverIp;
            rows.serverShPort = checkCapacity.serverShPort;
        },
        submitCapacityApp(){
            if (this.capacitycheckEnv === ''){
                this.$message.error("请选择需要扩容的环境");
                return;
            }
            let submitDataList = [];
            for (let i in this.checkEnvServerList){
                let item =  this.checkEnvServerList[i];
                if (item.serverKey == ''){
                    this.$message.error("请选择一个扩容机器");
                    return;
                }
                if (item.applicationId === undefined ){
                    submitDataList.push(item);
                }
            }

            let submitData = this.capacityAppInfo;
            let appServerList = {};
            appServerList[this.capacitycheckEnv] = submitDataList;
            submitData.appServerList = appServerList;
            //开始拉去列表
            request({
                url: global.rubberBasePath + "/publish/app/capacity",
                method: 'post',
                data: submitData,
            }).then(result => {
                console.info(result);
                if (global.SUCCESS === result.code){
                    let appName = this.capacityAppInfo.appName;
                    this.closeCapacity();
                    this.goInfoForName(appName);
                }else {
                    this.$message.error(result.msg);
                }
            })
        },
        submitReduction(row){
            this.$confirm('确定要缩容当前机器吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                request({
                    url: global.rubberBasePath + "/publish/app/reduction/" + row.applicationId,
                    method: 'post',
                }).then(result => {
                    if (global.SUCCESS === result.code){
                        console.info(result)
                        row.appServerStatus = 40;
                    }else {
                        this.$message.error(result.msg);
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消缩容'
                });
            });
        }

    }
};


</script>


<style scoped>


</style>
