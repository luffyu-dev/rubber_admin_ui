<template>
    <div>
        <el-form :inline="true" class="container">
            <div class="handle-box">
                <el-input v-model="query.searchData.dateVersion" placeholder="日期版本" class="handle-input"></el-input>
                <el-input v-model="query.searchData.nationChineseName" placeholder="国家" class="handle-input"></el-input>
                <el-input v-model="query.searchData.chinaFullName" placeholder="名称" class="handle-input"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
        </el-form>

        <div class="container">
            <el-row>
                <el-tabs v-model="query.searchData.playerType" @tab-click="handleSearch" type="card" style="display: inline-block;width: 80%;float: left">
                    <el-tab-pane label="ATP球员" name="atp"></el-tab-pane>
                    <el-tab-pane label="WTA球员" name="wta"></el-tab-pane>
                </el-tabs>
            </el-row>


            <el-table
                    :data="tableData"
                    border
                    class="table"
                    row-key="key"
                    ref="multipleTable"
                    highlight-current-row
                    header-cell-class-name="table-header"
                    :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                <el-table-column prop="playerId" width="100" label="球员ID" />
                <el-table-column prop="chinaFullName"  width="250" label="球员名称" />
                <el-table-column prop="playerType" width="100" label="排名类型" />
                <el-table-column prop="nationChineseName"  width="150" label="国家" >
                    <template slot-scope="scope">
                        <el-image style="width: 40px; height: 20px" :src="scope.row.nationImg"/>
                    </template>
                </el-table-column>
                <el-table-column prop="rank" width="100" label="实时排名" />
                <el-table-column prop="officialRank" width="100" label="官方排名" />
                <el-table-column prop="rankChange" width="100" label="排名浮动" >
                    <template slot-scope="scope">
                        <el-row v-if="scope.row.rankChange == 0"> - </el-row>
                        <el-row v-if="scope.row.rankChange < 0"> <i class= "el-icon-bottom"></i>{{-scope.row.rankChange}} </el-row>
                        <el-row v-if="scope.row.rankChange > 0"> <i class= "el-icon-top"></i>{{scope.row.rankChange}} </el-row>
                    </template>
                </el-table-column>
                <el-table-column prop="point" width="100" label="总积分" />
                <el-table-column prop="flopPoint" width="100" label="本周失效积分" />
                <el-table-column prop="winPoint" width="100" label="本周新增积分" />
                <el-table-column prop="winPoint" width="100" label="本周新增积分" />
                <el-table-column prop="cycleWinPro" width="100" label="胜率" />
                <el-table-column prop="cycleWinNum" width="100" label="胜场" />
                <el-table-column prop="cycleLoseNum" width="100" label="负场" />
                <el-table-column prop="cycleBonus" width="100" label="奖金" />
                <el-table-column prop="dateVersion" width="100" label="数据日期" />
                <el-table-column label="操作"  width="150" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="primary"
                                @click="openEdit(scope.$index, scope.row)"
                        >查看走势</el-button>
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
            var now = new Date();
            let y = String(now.getFullYear());
            let m = String((now.getMonth() + 1) <= 9 ? '0' + (now.getMonth() + 1 ) : (now.getMonth() + 1));
            let d = String(now.getDate() <= 9 ? '0' + now.getDate(): now.getDate());
            let dateVersion = y + m + d;
            const data = BaseList.data();
            data.url = publishUrl.allUrl.atpRank;
            data.query.searchData = {
                playerType:"atp",
                dateVersion:dateVersion
            }
            return data
        },

        methods:{
        }
    };


</script>


<style scoped>


</style>
