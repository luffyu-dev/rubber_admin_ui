<template>
    <div>
        <el-form :inline="true" class="container">
            <div class="handle-box">
                <el-input v-model="query.searchData.province" placeholder="所在省" class="handle-input"></el-input>
                <el-input v-model="query.searchData.city" placeholder="所在市" class="handle-input"></el-input>
                <el-input v-model="query.searchData.district" placeholder="所在区" class="handle-input"></el-input>
                <el-input v-model="query.searchData.courtName" placeholder="球场名称" class="handle-input"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
        </el-form>

        <div class="container">
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    row-key="key"
                    ref="multipleTable"
                    highlight-current-row
                    header-cell-class-name="table-header"
                    :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                <el-table-column prop="courtCode" width="200" label="球场ID" />
                <el-table-column prop="courtName"  width="250" label="球场名称" />
                <el-table-column  width="150" label="球场经纬度" >
                    <template slot-scope="scope">
                        <el-row>latitude:{{scope.row.latitude}}</el-row>
                        <el-row>longitude:{{scope.row.longitude}}</el-row>
                    </template>
                </el-table-column>
                <el-table-column prop="nationChineseName"  label="球场地址" >
                    <template slot-scope="scope">
                        {{scope.row.province}}{{scope.row.city}}{{scope.row.district}}{{scope.row.address}}
                    </template>
                </el-table-column>
                <el-table-column  width="100" label="球场主背景" >
                    <template slot-scope="scope">
                        <el-image style="width: 80px; height: 80px" :src="scope.row.homeImage"/>
                    </template>
                </el-table-column>
                <el-table-column  width="100" label="球场环境照" >
                    <template slot-scope="scope">
                        <el-image style="width: 80px; height: 80px" :src="scope.row.envImage"/>
                    </template>
                </el-table-column>

                <el-table-column  width="300" label="球场信息" >
                    <template slot-scope="scope">
                        <el-row>开放时间：{{scope.row.openHours}}</el-row>
                        <el-row>联系人：{{scope.row.manager}}</el-row>
                    </template>
                </el-table-column>

                <el-table-column  width="300" label="预订信息" >
                    <template slot-scope="scope">
                        <el-row>预定方式：{{showReserveType(scope.row.reserveType)}}</el-row>
                        <el-row>预定详情：{{scope.row.reserveInfo}}</el-row>
                    </template>
                </el-table-column>

                <el-table-column  width="100" label="球场类型" >
                    <template slot-scope="scope">
                        {{showCourtType(scope.row.courtType)}}
                    </template>
                </el-table-column>

                <el-table-column  width="100" label="当前状态" >
                    <template slot-scope="scope">
                        {{showCourtState(scope.row.status)}}
                    </template>
                </el-table-column>

                <el-table-column label="操作"  width="150" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="primary"
                                @click="openEdit(scope.$index, scope.row)"
                        >查看详情</el-button>
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
        <el-dialog :title="addEditTitle" :visible.sync="addEditVisible" :before-close='closeAddEdit' width="1100px">
            走势
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeAddEdit">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>


<script>
    import BaseList from '@/components/BaseTableCurd.vue';
    import publishUrl from '@/api/publishUrl';
    import request from '@/utils/request';
    import global from '@/utils/Global';
    export default {
        extends: BaseList,
        data() {
            const data = BaseList.data();
            data.url = publishUrl.allUrl.court;
            data.query.searchData = {

            };
            return data
        },

        methods:{
            //10表示室外硬底 20表示风雨棚 30表示室内 40表示红土
            showCourtType(status){
                if (status === 20){
                    return "风雨棚";
                }else if (status === 30){
                    return "室内";
                }else if (status === 40){
                    return "红土";
                }
                else {
                    return "室外硬底";
                }
            },
            showCourtState(status){
                if (status === 10){
                    return "新增初始化";
                }else if (status === 20){
                    return "待审核";
                }else if (status === 30){
                    return "审核不通过";
                } else {
                    return "审核通过";
                }
            },
            showReserveType(state){
                if (state === 1){
                    return "AT网球在线预订";
                }else if (state === 2){
                    return "球场小程序/公众号";
                }else if (state === 3){
                    return "电话/微信";
                }else if (state === 4){
                    return "线下到场";
                }
            }
        }
    };


</script>


<style scoped>


</style>
