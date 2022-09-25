<template>
    <div>
        <el-form :inline="true" class="container">
            <div class="handle-box">
                <el-input v-model="query.searchData.courtProvince" placeholder="所在省" class="handle-input"></el-input>
                <el-input v-model="query.searchData.courtCity" placeholder="所在市" class="handle-input"></el-input>
                <el-input v-model="query.searchData.courtDistrict" placeholder="所在区" class="handle-input"></el-input>
                <el-input v-model="query.searchData.inviteCode" placeholder="ID" class="handle-input"></el-input>
                <el-input v-model="query.searchData.inviteTitle" placeholder="邀约标题" class="handle-input"></el-input>

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
                <el-table-column prop="inviteCode" width="200" label="邀约ID" />
                <el-table-column prop="inviteTitle"  width="300" label="邀约标题" />

                <el-table-column  width="100" label="邀约主背景" >
                    <template slot-scope="scope">
                        <el-image style="width: 80px; height: 80px" :src="scope.row.inviteHomeImg"/>
                    </template>
                </el-table-column>

                <el-table-column  width="100" label="邀约图(其他)" >
                    <template slot-scope="scope">
                        <el-image style="width: 80px; height: 80px" :src="scope.row.inviteImg"/>
                    </template>
                </el-table-column>


                <el-table-column  width="100" label="邀约人数" >
                    <template slot-scope="scope">
                        {{scope.row.joinNumber ? scope.row.joinNumber  : 0 }} / {{scope.row.inviteNumber}}
                    </template>
                </el-table-column>

                <el-table-column  width="150" label="邀约截止日期" >
                    <template slot-scope="scope">
                        {{scope.row.joinDeadline}}
                    </template>
                </el-table-column>

                <el-table-column label="训练地址" >
                    <template slot-scope="scope">
                        <el-row v-if="scope.row.courtCode && scope.row.courtCode != '' ">
                            球场code:{{scope.row.courtCode}}
                        </el-row>
                        <el-row v-if="scope.row.courtLatitude && scope.row.courtLatitude != '' ">
                            经纬度:{{scope.row.courtLatitude}} - {{scope.row.courtLongitude}}
                        </el-row>
                        <el-row>
                            {{scope.row.courtProvince}}{{scope.row.courtCity}}{{scope.row.courtDistrict}}{{scope.row.courtAddress}}
                        </el-row>
                    </template>
                </el-table-column>

                <el-table-column prop="remark"  width="300" label="邀约备注" />
                <el-table-column prop="status"  width="300" label="邀约状态" >
                    <template slot-scope="scope">
                        {{getInviteStatus(scope.row.status)}}
                    </template>
                </el-table-column>
                <el-table-column label="操作"  width="150" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="primary"
                                @click="openEdit(scope.$index, scope.row)"
                        >详情</el-button>
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
            data.url = publishUrl.allUrl.invite;
            data.query.searchData = {

            };
            return data
        },
        methods:{
            // 10表示初始化 20表示已发布，30表示已完成
            getInviteStatus(status){
                if (status == 20){
                    return "已发布";
                }
                else if (status == 30){
                    return "已结束";
                }else {
                    return "初始化";
                }
            }
        }
    };


</script>


<style scoped>


</style>
