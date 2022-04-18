<template>
    <div>
        <el-form :inline="true" class="container">
            <div class="handle-box">
                <el-input v-model="query.searchData.packName" placeholder="包名称" class="handle-input"></el-input>
                <el-input v-model="query.searchData.jarVersion" placeholder="包版本" class="handle-input"></el-input>
                <el-input v-model="query.searchData.appPackTag" placeholder="打包Tag" class="handle-input"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
        </el-form>
        <div class="container">
            <div class="publish-container-head">
                <el-button
                        type="primary"
                        icon="el-icon-lx-add"
                        class="el-button-add"
                        @click="openAdd"
                >新增打包任务</el-button>
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
                <el-table-column prop="packName" min-width="250" label="包名称" />
                <el-table-column prop="jarVersion" min-width="150" label="包版本" />
                <el-table-column prop="appPackTag"  width="150" label="打包Tag" />
                <el-table-column prop="jenkinsServerKey" width="150" label="打包机器" />
                <el-table-column prop="taskStatus" width="150" label="打包状态" >
                    <template slot-scope="scope">
                        <el-tag :type="[0,13,22].includes(scope.row.taskStatus) ? 'danger': (scope.row.taskStatus >= 14 ? 'success':'info')">
                            {{scope.row.taskStatus >= 14 ? '打包成功' : status_desc[scope.row.taskStatus]}}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="操作" min-width="250" align="center">
                    <template slot-scope="scope">

                        <el-button
                                icon="el-icon-edit"
                                type="warning"
                                :disabled="scope.row.taskStatus === 0 || scope.row.taskStatus >= 14"
                                @click="openEdit(scope.$index, scope.row)"
                        >编辑</el-button>

                        <el-button
                                icon="el-icon-position"
                                type="success"
                                @click="goInfo(scope.$index, scope.row)"
                        >打包详情</el-button>

                        <el-button
                                icon="el-icon-circle-close"
                                type="danger"
                                :disabled="scope.row.taskStatus === 0 || scope.row.taskStatus >= 14"
                                @click="stopTask(scope.$index, scope.row)"
                        >关闭</el-button>

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

        <el-dialog :title="addEditTitle" :visible.sync="addEditVisible" :before-close='closeAddEdit' width="800px" >
            <el-form ref="form" :model="form" :rules="rules" label-width="130px" class="dialog-form" v-loading="addEditButtonUnAble">
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="应用名称" :rules="[{required: true}]">
                            <el-select v-model="form.packName" filterable placeholder="请选择" :disabled="form.taskId != undefined">
                                <el-option
                                        v-for="item in allPackList"
                                        :key="item.packName"
                                        :label="item.packName"
                                        :value="item.packName">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="打包分支/Tag" :rules="[{required: true}]">
                            <el-input v-model="form.appPackTag"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="20">
                        <el-form-item label="打包机器选择" >
                            <el-input v-model="form.jenkinsServerKey"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeAddEdit">取 消</el-button>
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
        data.url = publishUrl.allUrl.packOrder;
        data.allPackList = [];
        data.form.appEnvArray = [];
        data.status_desc = {
            0:"已关闭",
            10:"待打包",
            11:"开始打包",
            12:"打包中",
            13:"打包失败",
            14:"已打包",
            20:"待推送",
            21:"推送中",
            22:"推送失败",
            23:"已推送",
            30:"待发布",
            31:"发布中",
            32:"已发布",
            40:"已完成"
        };
        return data
    },
    created() {
        this.queryAllAppList();
    },

    methods:{
        stopTask(index,row){
            this.$confirm('是否结束次任务?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                request({
                    url: global.rubberBasePath + "/publish/pack-order/stop/"+row.taskId,
                    method: 'post',
                }).then(result => {
                    if (global.SUCCESS === result.code){
                        this.getPageList();
                    }else {
                        this.$message.error(result.msg);
                    }
                })

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消重复打包'
                });
            });
        },

        goInfo(index,row){
            this.$router.push({path: "pack-order/info",query: {taskId: row.taskId}});
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
        queryAllAppList(){
            request({
                url: global.rubberBasePath + "/publish/pack-config/list-all",
                method: 'get',
            }).then(result => {
                console.info(result);
                if (global.SUCCESS === result.code){
                    this.allPackList = result.data;
                }else {
                    this.$message.error(result.msg);
                }
            })
        },
        /**
         * 打开编辑/新增框之后的统一操作
         */
        afterOpenAddEdit(){
        }
    }
};


</script>


<style scoped>


</style>
