<template>
    <a-layout id="components-layout-demo-top-side-2">
        <a-layout-header class="header">
            <div class="logo" />
            <a-menu
                    theme="dark"
                    mode="horizontal"
                    :default-selected-keys="[1]"
                    :style="{ lineHeight: '64px' }"
                    v-model="topSelect"
            >
                <!--                顶部导航-->
                <a-menu-item v-for="topNavigation in topNavigations" :key="topNavigation.id"
                             @click="getLeftNavigation(topNavigation.id)">
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
                    <!--                    侧边栏1-->
                    <template >
                        <a-menu-item v-for="leftnavigation in leftNavigations" :key="leftnavigation.id"
                                     @click="controlLeftNavigationRequest(leftnavigation.id)">
                            <a-icon :type="leftnavigation.icomName" />
                            <span>{{leftnavigation.name}}</span>
                        </a-menu-item>
                    </template>
                </a-menu>
            </a-layout-sider>
            <a-layout style="padding: 0 24px 24px">
<!--                模板一-->
                <template v-if="topSelect==1 || topSelect==2">
                    <a-layout-header
                            :style="{ background: '#fff', padding: '0px', margin: 0, minHeight:'50px',paddingLeft:'20px'}">
                        <!--                搜索栏-->
                        <div v-show="topSelect==1">
                            <a-input-search v-model="searchMsg" placeholder="输入标题" style="width: 200px"
                                            @search="onSearchbookMarkCard(leftSelect)"/>
                            <a-button style="margin-left: 20px;" type="primary"
                                      @click="openbookMarkCardForm()">
                                新增
                            </a-button>
                        </div>

                        <div v-show="topSelect==2&&leftSelect==1">
                            <a-input-search v-model="searchMsg" :placeholder="'输入分类名称'"
                                            style="width: 200px"
                                            @search="onSearchLeftNavagationTable(searchMsg)"/>
                            <a-button style="margin-left: 20px;" type="primary"
                                      @click="openLeftNavigationForm()">
                                新增
                            </a-button>
                        </div>

                        <div v-show="topSelect==2&&leftSelect==2">
                            <a-input-search v-model="searchMsg" :placeholder="'输入图标名称'"
                                            style="width: 200px"
                                            @search="onSearchIcomTable(searchMsg)"/>
                            <a-button style="margin-left: 20px;" type="primary"
                                      @click="openIcomForm()">
                                新增
                            </a-button>
                        </div>

                        <div v-show="topSelect==2&&leftSelect==3">
                            <a-input-search v-model="searchMsg" :placeholder="'输入MN号'"
                                            style="width: 200px"
                                            @search="onSearchDeviceTable(searchMsg)"/>
                            <a-button style="margin-left: 20px;" type="primary"
                                      @click="openDeviceForm()">
                                新增
                            </a-button>
                        </div>

                    </a-layout-header>
                    <a-breadcrumb style="padding-left: 25px;padding: 5px">
                        <a-breadcrumb-item>{{topNavigations[topSelect-1].name}}</a-breadcrumb-item>
                        <template v-for="leftNavigation in leftNavigations">
                            <a-breadcrumb-item v-if="leftNavigation.id==leftSelect" :key="leftNavigation.id">{{leftNavigation.name}}</a-breadcrumb-item>
                        </template>
                    </a-breadcrumb>
                    <!--                内容-->
                    <a-layout-content
                            :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: curHeight- 175+'px' }"
                    >
                        <!--                    书签-->
                        <bookMarkCard ref="childbookMarkCard" @Search="onSearchbookMarkCard(leftSelect)"
                                      @openbookMarkCardForm="openbookMarkCardForm" v-show="topSelect==1"></bookMarkCard>
                        <!--                    侧边栏-->
                        <leftNavigationTable v-show="topSelect==2&&leftSelect==1" ref="childLeftNavigationTable" :searchMsg="searchMsg" @openLeftNavigationForm="openLeftNavigationForm"></leftNavigationTable>
                        <!--                    图标-->
                        <iconTable v-show="topSelect==2&&leftSelect==2" ref="childIcomTable" :searchMsg="searchMsg" @openIcomForm="openIcomForm"></iconTable>

                        <deviceTable v-show="topSelect==2&&leftSelect==3"  ref="childDeviceTable"  :searchMsg="searchMsg" @openDeviceForm="openDeviceForm"></deviceTable>

                        <!--                弹窗-->
                        <bookMarkForm ref="childbookMarkCardForm" :leftSelect="leftSelect" :leftNavigations="leftNavigations"
                                      @onSearchbookMarkCard="onSearchbookMarkCard(leftSelect)"></bookMarkForm>

                        <icomForm ref="childIcomForm" @onSearchIcomTable="onSearchIcomTable(searchMsg)"></icomForm>

                        <leftNavigationForm ref="childLeftNavigationForm" @onSearchLeftNavagationTable="onSearchLeftNavagationTable(searchMsg)"></leftNavigationForm>

                        <deviceForm ref="childDeviceForm" @onSearchDeviceTable="onSearchDeviceTable(searchMsg)"></deviceForm>
                    </a-layout-content>
                </template>

                <template>
                    <a-layout-content
                            :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: curHeight- 175+'px' }"
                    >
                        <router-view></router-view>
                    </a-layout-content>

                </template>
            </a-layout>
        </a-layout>
    </a-layout>
</template>
<script>
    import bookMarkCard from "./BookMarkCard"
    import bookMarkForm from "./BookMarkForm"
    import iconTable from "./IcomTable"
    import icomForm from "./IcomForm"
    import leftNavigationTable from "./LeftNavigationTable"
    import leftNavigationForm from "./LeftNavigationForm"
    import deviceTable from "./DeviceTable"
    import deviceForm from './DeviceForm'

    export default {
        data() {
            return {
                collapsed: false,
                curHeight: 800,
                curwidth: 800,
                topNavigations: [{id: 1, name: '书签'}, {id: 2, name: '系统管理'},{id: 3, name: '模拟设备'}],
                topSelect: [1],
                leftNavigations: [],
                leftSelect: [],
                searchMsg: "",
                icoms: []
            };
        },
        components: {
            'bookMarkCard': bookMarkCard,
            'bookMarkForm': bookMarkForm,
            'iconTable': iconTable,
            'leftNavigationTable':leftNavigationTable,
            "icomForm":icomForm,
            "leftNavigationForm":leftNavigationForm,
            deviceTable,
            deviceForm
        },
        methods: {
            getCurHeight() {
                this.curHeight = document.body.clientHeight;
            },
            getCurWidth() {
                this.curwidth = document.body.clientWidth;
            },
            getLeftNavigation(index) {
                this.searchMsg = ''
                if (index == 1) {
                    this.$axios
                        .get(this.$base.api+'/navigation/getAll')
                        .then(response => {
                            this.leftNavigations = response.data.data
                    if(this.leftNavigations.length!=0){
                        this.leftSelect = [this.leftNavigations[0].id]
                            this.onSearchbookMarkCard(this.leftSelect)
                    }
                })
                        .catch(function (error) { // 请求失败处理
                            console.log(error);
                        });
                } else {
                    this.leftNavigations=[{id: 1, name: '分类管理',icomName:'unordered-list'}, {id: 2, name: '图标管理',icomName:'smile'},{id: 3, name: '设备管理',icomName:'smile'}]
                    this.leftSelect = [1]
                    this.onSearchLeftNavagationTable(this.searchMsg)
                }
            },
            controlLeftNavigationRequest(id){
                if(this.topSelect==1){
                    this.onSearchbookMarkCard(id)
                }else if(this.topSelect==2){
                    switch (id) {
                        case 1:
                            this.onSearchLeftNavagationTable('')
                            break
                        case 2:
                            this.onSearchIcomTable('')
                            break
                        case 3:
                            this.onSearchDeviceTable('')
                            break
                    }

                }else{
                    this.$router.push({name:"bookMarkCard"})
                }
            },
            openDeviceForm(id) {
                this.$refs.childDeviceForm.showModal(id)
            },
            openbookMarkCardForm(id) {
                this.$refs.childbookMarkCardForm.showModal(id)
            },
            openIcomForm(id) {
                this.$refs.childIcomForm.showModal(id)
            },
            openLeftNavigationForm(id) {
                this.$refs.childLeftNavigationForm.showModal(id)
            },
            onSearchbookMarkCard(leftSelect) {
                this.$refs.childbookMarkCard.search(leftSelect, this.searchMsg)
            },
            onSearchIcomTable(name){
                this.$refs.childIcomTable.getData(name)
            },
            onSearchLeftNavagationTable: function (name) {
                setTimeout(this.$refs.childLeftNavigationTable.getData(name),500)

            },
            onSearchDeviceTable(name){
                this.$refs.childDeviceTable.getData(name)
            }
        },
        created() {
            this.getCurHeight(),
            this.getCurWidth(),
            this.getLeftNavigation(this.topSelect)
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


