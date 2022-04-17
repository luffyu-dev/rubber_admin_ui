<template>
    <div class="wrapper">
        <v-head @activeSystemIndex="getVal" ></v-head>
        <div>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import vHead from './../home/Header.vue';
import vSidebar from './../home/Sidebar.vue';
import vTags from './../home/Tags.vue';
import bus from '../../api/home/bus';
export default {
    data() {
        return {
            tagsList: [],
            collapse: false,
            activeSystemIndex:""
        };
    },
    components: {
        vHead,
        vSidebar,
        vTags
    },
    created() {
        bus.$on('collapse-content', msg => {
            this.collapse = msg;
        });

        // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
        bus.$on('tags', msg => {
            let arr = [];
            for (let i = 0, len = msg.length; i < len; i++) {
                msg[i].name && arr.push(msg[i].name);
            }
            this.tagsList = arr;
        });
    },
    methods:{
        getVal(msg){//msg就是传过来的数据了  这只是个形参  名字可以随意
           console.info(">>>>>"+msg);
           this.activeSystemIndex = msg;
        }
    }

};
</script>
