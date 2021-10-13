<template>
    <div>
        <el-form :inline="true" class="container">
            <div class="handle-box">
                <el-input v-model="query.searchData.appName" placeholder="应用名称" class="handle-input"></el-input>
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
                >新增发布任务</el-button>
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
                <el-table-column prop="taskId" width="100" label="任务Id" />
                <el-table-column prop="appName" width="250" label="应用名称" />
                <el-table-column prop="appEnv"  width="170" label="发布环境" >
                    <template slot-scope="scope">
                        <el-tag v-for="item in scope.row.appEnv.split(',')"  effect="plain" style="margin-right: 2px">
                            {{ getEnvName(item) }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="appPackTag"  width="150" label="打包Tag" />
                <el-table-column prop="jenkinsServerKey" width="100" label="打包机器" />
                <el-table-column prop="taskStatus" width="150" label="任务进度" >
                    <template slot-scope="scope">
                        <el-progress :percentage="scope.row.taskStatus / 10 * 34"  :status="scope.row.taskStatus === 40 ? 'success':'warning'"/>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">

                        <el-button
                                icon="el-icon-edit"
                                type="warning"
                                @click="openEdit(scope.$index, scope.row)"
                        >编辑</el-button>

                        <el-button
                                icon="el-icon-position"
                                type="success"
                                @click="goInfo(scope.$index, scope.row)"
                        >发布详情</el-button>

                        <el-button
                                icon="el-icon-position"
                                type="danger"
                                @click="goInfo(scope.$index, scope.row)"
                        >结单</el-button>

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

        <el-dialog :title="addEditTitle" :visible.sync="addEditVisible" :before-close='closeAddEdit' width="60%">
            <el-form ref="form" :model="form" :rules="rules" label-width="130px">
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="应用名称">
                            <el-select v-model="form.appName" filterable placeholder="请选择" @change="queryAppEnv" :disabled="form.taskId != undefined">
                                <el-option
                                        v-for="item in allAppList"
                                        :key="item.appName"
                                        :label="item.appName"
                                        :value="item.appName">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="10">
                        <el-form-item label="发布环境">
                            <!--  <el-input v-model="form.appEnv"></el-input>-->
                            <el-checkbox-group  v-model="form.appEnvArray" @change="handleAppEnvArray">
                                <el-checkbox label="100" key="100">开发环境</el-checkbox>
                                <el-checkbox label="200" key="200">测试环境</el-checkbox>
                                <el-checkbox label="300" key="300">预发布环境</el-checkbox>
                                <el-checkbox label="400" key="400">线上环境</el-checkbox>
                            </el-checkbox-group>
<!--                                <el-checkbox-group v-model="form.appEnvArray" @change="handleAppEnvArray">-->
<!--                                    <el-checkbox v-for="(label,env) in form.server_env" :label="env" >{{label}}</el-checkbox>-->
<!--                                </el-checkbox-group>-->
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="10">
                        <el-form-item label="打包Tag">
                            <el-input v-model="form.appPackTag"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="10">
                        <el-form-item label="打包机器选择">
                            <el-input v-model="form.jenkinsServerKey"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeAddEdit">取 消</el-button>
                <el-button @click="closeAddEdit">测试连接</el-button>
                <el-button type="primary" @click="handleAddEdit(form.serverKey)" :disabled="addEditButtonUnAble" >确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>


<script>
import BaseList from '@/components/BaseTableCurd.vue';
import publishUrl from '@/api/publishUrl';
import global from '@/utils/Global';
import request from '@/utils/request';

export default {
    extends: BaseList,
    data() {
        const data = BaseList.data();
        data.url = publishUrl.allUrl.pushTask;
        data.allAppList = [];
        data.form.appEnvArray = [];
        return data
    },
    created() {
        this.queryAllAppList();
        this.queryAppEnv();
    },

    methods:{
        getEnvName(env){
            return global.getEnvName(env);
        },
        goInfo(index,row){
            this.$router.push({path: "push-task/info",query: {taskId: row.taskId}});
        },
        showTaskStatus(status){
            if (status === 1){
                return "待打包";
            }else if (status === 2){
                return "待推送";
            }else if (status === 3){
                return "待发布";
            }
            else if (status === 4){
                return "完成";
            }
        },
        handleAppEnvArray(){
            this.form.appEnv = this.form.appEnvArray.join(",");
        },
        queryAllAppList(){
            request({
                url: global.rubberBasePath + "/publish/app/list-all",
                method: 'get',
            }).then(result => {
                console.info(result);
                if (global.SUCCESS === result.code){
                    this.allAppList = result.data;
                }else {
                    this.$message.error(result.msg);
                }
            })
        },
        /**
         * 打开编辑/新增框之后的统一操作
         */
        afterOpenAddEdit(){
            this.queryAppEnv();
            if (this.form.appEnv != undefined){
                this.form.appEnvArray = this.form.appEnv.split(",");
            }

        },
        queryAppEnv(){
            if(this.form.appName === undefined || this.form.appName === ''){
                return;
            }
            request({
                url: global.rubberBasePath + "/publish/app/server-env/"+this.form.appName,
                method: 'get',
            }).then(result => {
                if (global.SUCCESS === result.code){
                    this.form.server_env = result.data;
                }else {
                    this.$message.error(result.msg);
                }
            })
        }
    }
};


</script>


<style scoped>


</style>
