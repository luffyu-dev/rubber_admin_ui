<template>
    <div>

        <div class="frame-work-content">
            <el-row :gutter="12">
                <el-col :span="8">
                    <el-card shadow="always">
                        <img class="image" src="https://nacos.io/img/nacos_colorful.png"/>
                    </el-card>
                </el-col>
                <el-col :span="8">
                    <el-card shadow="always">
                        <img class="image" src=" https://sentinelguard.io/img/sentinel_colorful.png"/>
                    </el-card>
                </el-col>
                <el-col :span="8">
                    <el-card shadow="always">
                        <img class="image" src="https://www.jenkins.io/images/logos/jenkins/jenkins.svg"/>
                    </el-card>
                </el-col>
            </el-row>
        </div>
    </div>
</template>


<script>

export default {
    data: function() {
        return {

        };
    },
    methods: {

    }
}

</script>


<style scoped>
    .frame-work-content{
        width: 70%;
        margin-left: 15%;
        min-height: 900px;
        margin-top: 20px;
    }
    .el-card{
        margin: 10px;
        height: 150px;
        line-height: 150px;
        text-align: center;
    }
    .image{
        display: inline-block;
        max-width: 150px;
        max-height: 120px;
    }

</style>
