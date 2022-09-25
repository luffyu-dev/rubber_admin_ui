<template>
    <div>
        <el-form :inline="true" class="container">
            <div class="handle-box">
                <el-input v-model="query.searchData.nationChineseName" placeholder="国家" class="handle-input"></el-input>
                <el-input v-model="query.searchData.chinaFullName" placeholder="名称" class="handle-input"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
        </el-form>

        <div class="container">
            <el-tabs v-model="query.searchData.playerType" @tab-click="handleSearch" type="card" style="display: inline-block;width: 80%;float: left">
                <el-tab-pane label="ATP球员" name="atp"></el-tab-pane>
                <el-tab-pane label="WTA球员" name="wta"></el-tab-pane>
            </el-tabs>
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
                <el-table-column prop="playerType" width="100" label="排名类型" />
                <el-table-column prop="playerAvatar"  width="100" label="头像" >
                    <template slot-scope="scope">
                        <el-avatar shape="square" size="80" :src="scope.row.playerAvatar"/>
                    </template>
                </el-table-column>
                <el-table-column prop="chinaFullName"  width="250" label="球员名称" >
                    <template slot-scope="scope">
                        <el-row>{{scope.row.chinaFullName}}</el-row>
                        <el-row>{{scope.row.firstName}} {{scope.row.lastName}}</el-row>
                    </template>
                </el-table-column>
                <el-table-column prop="nationChineseName"  width="150" label="国家" >
                    <template slot-scope="scope">
                        {{scope.row.nationChineseName}}
                        <el-image style="width: 40px; height: 20px" :src="scope.row.nationImg"/>
                    </template>
                </el-table-column>
                <el-table-column prop="birthday"  width="150" label="生日" />
                <el-table-column label="个人信息" min-width="250"  >
                    <template slot-scope="scope">
                        <el-row>
                            <el-col span="12"> 身高:  {{scope.row.height}} cm</el-col>
                            <el-col span="12"> 体重:  {{scope.row.weight}} kg</el-col>
                         </el-row>
                        <el-row>
                            出生地:  {{scope.row.birthPlace}}
                        </el-row>
                        <el-row v-if="scope.row.website && scope.row.website != ''">
                            个人博客:  {{scope.row.website}}
                        </el-row>
                    </template>
                </el-table-column>

                <el-table-column label="生涯" min-width="250">
                    <template slot-scope="scope">
                        <el-row>
                            总奖金:  {{scope.row.allBonus}}$
                        </el-row>
                        <el-row>
                            <el-col span="12">单打最佳排名:{{scope.row.singlesRankHeight}} </el-col>
                            <el-col span="12">双打最佳排名:{{scope.row.doubleRankHeight}} </el-col>
                        </el-row>
                        <el-row>
                            <el-col span="12">单打冠军数:  {{scope.row.singlesChampionNum}}</el-col>
                            <el-col span="12">双打冠军数:  {{scope.row.doubleChampionNum}} </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column prop="tags"  width="200" label="AT标签" />
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
            球员详情
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
            data.url = publishUrl.allUrl.atpPlayer;
            data.query.searchData = {
                playerType:"atp"
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
