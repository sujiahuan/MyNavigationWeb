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
                             @click="toggleTopNavigation(topNavigation.id)">
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
                    <template v-if="topSelect==2||topSelect==1">
                        <a-menu-item v-for="leftnavigation in leftNavigations" :key="leftnavigation.id"
                                     @click="controlLeftNavigationRequest(leftnavigation.id)">
                            <a-icon :type="leftnavigation.icomName"/>
                            <span>{{leftnavigation.name}}</span>
                        </a-menu-item>
                    </template>

                    <template v-if="topSelect==3">
                        <a-menu-item v-for="leftnavigation in leftNavigations" :key="leftnavigation.id"
                                     @click="controlLeftNavigationRequest(leftnavigation.id)">
                            <a-icon type="robot"/>
                            <span>{{leftnavigation.mn}}</span>
                        </a-menu-item>
                    </template>
                </a-menu>
            </a-layout-sider>
                <router-view ></router-view>
        </a-layout>
    </a-layout>
</template>
<script>
    const  topNavigations=[
        {id: 1, name: '书签'},
        {id: 2, name: '系统管理'},
        {id: 3, name: '模拟设备'}
    ]
    export default {
        data() {
            return {
                collapsed: false,
                topNavigations,
                topSelect: [1],
                leftNavigations: [],
                leftSelect: [],
                searchMsg: "",
                icoms: []
            };
        }, created() {
                this.toggleTopNavigation(this.topSelect)
        },
        methods: {
            toggleTopNavigation(index) {
                // eslint-disable-next-line no-debugger
                this.searchMsg = ''
                //获取书签侧边栏
                if (index == 1) {
                    this.$axios
                        .get(this.$base.api + '/navigation/getAll')
                        .then(response => {
                            this.leftNavigations = response.data.data
                            if (this.leftNavigations.length != 0) {
                                this.leftSelect = [this.leftNavigations[0].id]
                                this.$router.push({
                                    name: 'bookMarkCard',
                                    params: { id:this.leftSelect,leftNavigations: this.leftNavigations}
                                })
                            }
                        })
                        .catch(function (error) { // 请求失败处理
                            console.log(error);
                        });
                    //获取系统管理侧边栏
                } else  if (index == 2){
                    this.leftNavigations = [
                        {id: 1, name: '分类管理', icomName: 'unordered-list'},
                        {id: 2, name: '图标管理', icomName: 'smile'},
                        {id: 3, name: '设备管理', icomName: 'smile'}
                    ]
                    this.leftSelect = [1]
                    this.$router.push({name: 'siderTable'})
                    ////获取模拟设备侧边栏
                }else{
                    this.$axios
                        .get(this.$base.api + '/counDevice/getAll')
                        .then(response => {
                            this.leftNavigations = response.data.data
                            console.info("leftNavication:"+this.leftNavigations)
                            if (this.leftNavigations.length != 0) {
                                this.leftSelect = [this.leftNavigations[0].id]
                                console.info("leftNavication:"+this.leftNavigations)
                                this.$router.push({
                                    name: 'controlDevice',
                                    params: { id:this.leftSelect,leftNavigations: this.leftNavigations}
                                })
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
                        params: { id:id,leftNavigations: this.leftNavigations}
                    })
                } else if (this.topSelect == 2) {
                    switch (id) {
                        case 1:
                            this.$router.push({name: 'siderTable'})
                            break
                        case 2:
                            this.$router.push({name: 'icomTable'})
                            break
                        case 3:
                            this.$router.push({name: 'deviceTable'})
                            break
                    }
                } else if(this.topSelect == 3){
                    this.$router.push({name: "bookMarkCard"})
                } else {
                    this.$router.push({name: "bookMarkCard"})
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


