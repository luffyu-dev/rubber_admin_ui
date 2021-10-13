<template>
    <div>
        <el-form :inline="true" class="container">
            <div class="handle-box">
                <el-input v-model="query.searchData.serverName" placeholder="设备名称" class="handle-input"></el-input>
                <el-input v-model="query.searchData.serverKey" placeholder="设备Key" class="handle-input"></el-input>
                <el-input v-model="query.searchData.serverIp" placeholder="设备IP" class="handle-input"></el-input>
                <el-input v-model="query.searchData.serverShPort" placeholder="设备端口" class="handle-input"></el-input>
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
                >新增管理设备</el-button>
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
                <el-table-column prop="serverKey" width="150" label="机器Key" />
                <el-table-column prop="serverName" width="150" label="机器名称" />
                <el-table-column prop="serverType" width="100" label="机器类型" />
                <el-table-column prop="serverIp"  width="100" label="机器IP" />
                <el-table-column prop="serverShPort"  width="80" label="sh端口" />
                <el-table-column   width="150" label="sh用户" >
                    <template slot-scope="scope">
                        {{scope.row.serverShUser}} / {{scope.row.serverShPsd}}
                    </template>
                </el-table-column>


                <el-table-column prop="serverStatus"  width="100" label="机器状态" >
                    <template slot-scope="scope">
                        <el-tag :type=" scope.row.serverStatus == '20' ? 'success': 'danger' ">
                            <span > {{showStatus(scope.row.serverStatus)}}</span>
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="serverUrl"  label="应用地址" >
                    <template slot-scope="scope">
                        <el-link type="primary" :href="scope.row.serverUrl" target="_blank"> {{scope.row.serverUrl}}</el-link>
                        <div v-if="scope.row.serverUser != undefined && scope.row.serverUser != ''">
                            {{scope.row.serverUser}} / {{scope.row.serverToken}}
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button
                                icon="el-icon-check"
                                type="success"
                                @click="checkStatus(scope.$index, scope.row)"
                        >检测状态</el-button>

                        <el-button
                                icon="el-icon-edit"
                                type="primary"
                                @click="openEdit(scope.$index, scope.row)"
                        >编辑</el-button>
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
                        <el-form-item label="机器key" >
                            <el-input v-model="form.serverKey" :disabled="this.addEditType === 'edit'"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="10">
                        <el-form-item label="机器名称">
                            <el-input v-model="form.serverName"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="10">
                        <el-form-item label="机器类型">
                            <el-select v-model="form.serverType">
                                <el-option key="app" label="应用服务机器" value="app"/>
                                <el-option key="jenkins" label="jenkins打包机器" value="jenkins"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="10">
                        <el-form-item label="机器ip">
                            <el-input v-model="form.serverIp"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="sh端口">
                            <el-input v-model="form.serverShPort" type="number"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="sh用户">
                            <el-input v-model="form.serverShUser"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="sh密码">
                            <el-input v-model="form.serverShPsd" show-password></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="应用url">
                            <el-input v-model="form.serverUrl"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="10">
                        <el-form-item label="应用名称">
                            <el-input v-model="form.serverUser"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="应用token">
                            <el-input v-model="form.serverToken"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="closeAddEdit">取 消</el-button>
                    <el-button @click="closeAddEdit">测试连接</el-button>
                    <el-button type="primary" @click="handleAddEdit(form.serverKey)">确 定</el-button>
                </div>
        </el-dialog>
    </div>
</template>


<script>
import BaseList from '@/components/BaseTableCurd.vue';
import publishUrl from '@/api/publishUrl';
import request from '@/utils/request';
import global from '@/utils/Global';
import {showLinkStatusLabel} from "../../../utils/Global";
export default {
    extends: BaseList,
    data() {
        const data = BaseList.data();
        data.url = publishUrl.allUrl.serverDevice;
        data.serverStatus={
            10:"正常",
            20:"停用",
            30:"负载"
        }
        return data
    },

    methods:{
        showStatus(status){
            return global.showLinkStatusLabel(status);
        },
        checkStatus(index, row){
            const checkStatus = this.url.checkStatus.replace("%s",row.serverKey);
            request({
                url: global.rubberBasePath + checkStatus,
                method: 'post',
            }).then(result => {
                if(result.code === global.SUCCESS){
                    if (result.data == 20){
                        this.$message.success(`连接正常`);
                    }else {
                        this.$message.error("连接失败");
                    }
                    this.getPageList();
                }else {
                    this.$message.error(result);
                }
            })
        }
    }
};


</script>


<style scoped>


</style>
