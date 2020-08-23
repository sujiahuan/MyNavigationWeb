<template>
    <a-layout id="components-layout-demo-top-side-2">
        <a-layout-header class="header">
            <div class="logo"/>
            <a-menu
                    theme="dark"
                    mode="horizontal"
                    :default-selected-keys="[1]"
                    :style="{ lineHeight: '64px' }"
                    v-model="topSelect"
            >
                <!--                顶部导航-->
                <a-menu-item v-for="topNavigation in topNavigations" :key="topNavigation.id"
                @click="querySidebar(topNavigation.id)">
                    {{topNavigation.name}}
                </a-menu-item>
            </a-menu>
        </a-layout-header>
        <a-layout>
            <a-layout-sider width="200" style="background: #fff">
                <a-menu
                        mode="inline"
                        :default-selected-keys="[1]"
                        :default-open-keys="[0]"
                        :style="{ height: '100%', borderRight: 0 }"
                        v-model="leftSelect"
                >
                    <!--                    侧边栏1、2-->
                    <template>
                        <a-menu-item v-for="leftnavigation in leftNavigations" :key="leftnavigation.id"
                                     @click="controlLeftNavigationRequest(leftnavigation.id)">
                            <a-icon :type="leftnavigation.icomName!=''&&topSelect!=3?leftnavigation.icomName:'robot'"/>
                            <span>{{leftnavigation.name}}</span>
                        </a-menu-item>
                    </template>

                </a-menu>
            </a-layout-sider>
            <router-view></router-view>
        </a-layout>
    </a-layout>
</template>
<script>
    const topNavigations = [
        {id: 1, name: '书签'},
        {id: 2, name: '系统管理'},
        {id: 3, name: '模拟设备'}
    ]
    const systemNavigations=[
        {id: 1, name: '分类管理', icomName: 'unordered-list',path:'sortTable'},
        {id: 2, name: '图标管理', icomName: 'smile',path:'icomTable'},
        {id: 3, name: '设备管理', icomName: 'smile',path:'deviceTable'}
    ]
    export default {
        data() {
            return {
                collapsed: false,
                topNavigations,
                topSelect: [1],
                leftNavigations: [],
                leftSelect: [],
                icoms: []
            };
        },
        mounted() {
            this.querySidebar(this.topSelect)
        },
        watch: {
            '$route.path': function () {
                this.setMenu()
            }
        },
        methods: {
            setMenu() {
                if(this.topSelect[0]!=this.selectedTop()[0]){
                    this.topSelect = this.selectedTop();
                    this.querySidebar(this.topSelect)
                }else{
                    this.leftSelect=this.selectedLeft();
                }
            },
            selectedTop() {
                if (this.$route.path.indexOf('bookMarkCard') != -1) {
                    return [1]
                }else if(this.$route.path.indexOf('controlDevice') != -1){
                    return [3]
                }else{
                    return [2]
                }
            },
            selectedLeft() {
                for (let leftNavigation of this.leftNavigations) {
                    if(leftNavigation.path==undefined){
                        if (this.$route.path.indexOf(leftNavigation.id) != -1) {
                            return [leftNavigation.id]
                        }
                    }else{
                        if (this.$route.path.indexOf(leftNavigation.path) != -1) {
                            return [leftNavigation.id]
                        }
                    }
                }
            },
            querySidebar(index) {
                //获取书签侧边栏
                if (index == 1) {
                    this.$axios
                        .get(this.$base.api + '/navigation/getAll')
                        .then(response => {
                            this.leftNavigations = response.data.data
                            if (this.leftNavigations.length != 0) {
                                // this.leftSelect =[this.leftNavigations[0].id]
                                this.$router.push({
                                    name: 'bookMarkCard',
                                    params: {id: '' + [this.leftNavigations[0].id], leftNavigations: '' + this.leftNavigations}
                                })
                            }else{
                                this.$router.push({
                                    name: 'bookMarkCard',
                                    params: {id: '1', leftNavigations: 'null'}
                                })
                            }
                        })
                        .catch(function (error) { // 请求失败处理
                            console.log(error);
                        });
                    //获取系统管理侧边栏
                } else if (index == 2) {
                    this.leftNavigations =systemNavigations,
                    this.$router.push({name: 'sortTable'})
                    ////获取模拟设备侧边栏
                } else if(index == 3){
                    this.$axios
                        .get(this.$base.api + '/counDevice/getAll')
                        .then(response => {
                            this.leftNavigations = response.data.data
                            // if(this.$route.path.substring(this.$route.path.lastIndexOf(""),this.$route.path.length)){
                            //     this.$route.path.substring(this.$route.path.lastIndexOf(""),this.$route.path.length)
                            // }
                            if (this.leftNavigations.length != 0 && this.$route.path.indexOf('controlDevice') == -1) {
                                this.$router.push({
                                    name: 'controlDevice',
                                    params: {id: this.leftNavigations[0].id}
                                })
                            }else{
                                this.leftSelect=this.selectedLeft();
                            }
                        })
                        .catch(function (error) { // 请求失败处理
                            console.log(error);
                        });
                }
            },
            controlLeftNavigationRequest(id) {
                if (this.topSelect == 1) {
                    console.info(this.leftSelect)
                    this.$router.push({
                        name: 'bookMarkCard',
                        params: {id: id, leftNavigations: ''+this.leftNavigations}
                    })
                } else if (this.topSelect == 2) {
                    for (let systemNavigation of systemNavigations) {
                        if(id==systemNavigation.id){
                            this.$router.push({name: systemNavigation.path})
                        }
                    }
                } else if (this.topSelect == 3) {
                    this.$router.push({
                        name: "controlDevice",
                        params:{id:id}
                    })
                }
            }
        }
    };
</script>

<style>
    #components-layout-demo-top-side-2 .logo {
        width: 120px;
        height: 31px;
        background: rgba(255, 255, 255, 0.2);
        margin: 16px 28px 16px 0;
        float: left;
    }
</style>


