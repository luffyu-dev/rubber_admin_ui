<template>
    <div>
        <el-form :inline="true" class="container">
            <div class="handle-box">
                <el-input v-model="query.searchData.packName" placeholder="包名称" class="handle-input"></el-input>
                <el-input v-model="query.searchData.githubUrl" placeholder="仓库地址" class="handle-input"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
        </el-form>
        <div class="container">
            <div class="publish-container-head ">
                <el-button
                        type="primary"
                        icon="el-icon-lx-add"
                        class="el-button-add"
                        @click="openAdd"
                >新增包配置</el-button>
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
                <el-table-column prop="packName" width="280" label="包名称" />
                <el-table-column prop="githubUrl"  label="仓库地址" >
                    <template slot-scope="scope">
                        <el-link :href="scope.row.githubUrl" target="_blank" type="primary">{{scope.row.githubUrl}}</el-link>
                    </template>
                </el-table-column>

                <el-table-column prop="mavenPath" width="280" label="打包目录" />
                <el-table-column prop="jdkVersion"  width="80" label="jdk版本" >
                    <template slot-scope="scope">
                        <el-tag type="success">{{scope.row.jdkVersion}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button
                                icon="el-icon-edit"
                                type="warning"
                                @click="openEdit(scope.$index, scope.row)"
                        >配置编辑</el-button>
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


        <el-dialog :title="addEditTitle" :visible.sync="addEditVisible" :before-close='closeAddEdit' width="800px" style="min-height: 400px;">
            <el-form ref="form" :model="form" label-width="130px" class="dialog-form">
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="包名称" :rules="[{required: true}]">
                            <el-input v-model="form.packName" :disabled="this.addEditType === 'edit'"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="20">
                        <el-form-item label="jdk版本" :rules="[{required: true}]">
                            <el-select v-model="form.jdkVersion">
                                <el-option key="1.8" label="1.8" value="1.8"/>
                                <el-option key="1.7" label="1.7" value="1.7"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="24">
                        <el-form-item label="gitHub代码地址" :rules="[{required: true}]">
                            <el-input v-model="form.githubUrl"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="20">
                        <el-form-item label="maven打包路径" :rules="[{required: true}]">
                            <el-input v-model="form.mavenPath"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="20">
                        <el-form-item label="发布子模块">
                            <el-input v-model="form.publishModel"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeAddEdit">取 消</el-button>
                <el-button type="primary" @click="handleAddEdit(form.packName)">确 定</el-button>
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
        data.url = publishUrl.allUrl.packConfig;
        return data
    },
    created() {

    },

    methods:{
    }
};


</script>


<style scoped>


</style>
