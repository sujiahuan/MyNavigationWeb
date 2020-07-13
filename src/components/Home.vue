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
                <!--                搜索栏-->
                <a-layout-header
                        :style="{ background: '#fff', padding: '0px', margin: 0, minHeight:'50px',paddingLeft:'20px'}">

                    <div v-show="topSelect==1">
                        <a-input-search v-model="searchMsg" placeholder="输入标题" style="width: 200px"
                                        @search="onSearchBookmark(leftSelect)"/>
                        <a-button style="margin-left: 20px;" type="primary"
                                  @click="openBookmarkFrom()">
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
                    <bookmark ref="childBookmark" @Search="onSearchBookmark(leftSelect)"
                              @openBookmarkFrom="openBookmarkFrom" v-show="topSelect==1"></bookmark>
<!--                    侧边栏-->
                    <leftNavigationTable v-show="topSelect==2&&leftSelect==1" ref="childLeftNavigationTable" :searchMsg="searchMsg" @openLeftNavigationForm="openLeftNavigationForm"></leftNavigationTable>
<!--                    图标-->
                    <iconTable v-show="topSelect==2&&leftSelect==2" ref="childIcomTable" :searchMsg="searchMsg" @openIcomForm="openIcomForm"></iconTable>

                </a-layout-content>

                <!--                弹窗-->
                <bookmarkFrom ref="childBookmarkForm" :leftSelect="leftSelect" :leftNavigations="leftNavigations"
                              @onSearchBookmark="onSearchBookmark(leftSelect)"></bookmarkFrom>

                <icomForm ref="childIcomForm" @onSearchIcomTable="onSearchIcomTable(searchMsg)"></icomForm>

                <leftNavigationForm ref="childLeftNavigationForm" @onSearchLeftNavagationTable="onSearchLeftNavagationTable(searchMsg)"></leftNavigationForm>

            </a-layout>
        </a-layout>
    </a-layout>
</template>
<script>
    import bookmark from "./Bookmark"
    import bookmarkFrom from "./BookmarkForm"
    import iconTable from "./IcomTable"
    import icomForm from "./IcomForm"
    import leftNavigationTable from "./LeftNavigationTable"
    import leftNavigationForm from "./LeftNavigationForm"

    export default {
        data() {
            return {
                collapsed: false,
                curHeight: 800,
                curwidth: 800,
                topNavigations: [{id: 1, name: '书签'}, {id: 2, name: '系统管理'}],
                topSelect: [1],
                leftNavigations: [],
                leftSelect: [],
                searchMsg: "",
                icoms: []
            };
        },
        components: {
            'bookmark': bookmark,
            'bookmarkFrom': bookmarkFrom,
            'iconTable': iconTable,
            'leftNavigationTable':leftNavigationTable,
            "icomForm":icomForm,
            "leftNavigationForm":leftNavigationForm
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
                        .then(response => (
                            this.leftNavigations = response.data.data
                        ))
                        .catch(function (error) { // 请求失败处理
                            console.log(error);
                        });
                    setTimeout(() => {
                        if(this.leftNavigations.length!=0){
                            this.leftSelect = [this.leftNavigations[0].id]
                        }
                        this.onSearchBookmark(this.leftSelect)
                    }, 200)

                } else {
                    this.leftNavigations=[{id: 1, name: '分类管理',icomName:'unordered-list'}, {id: 2, name: '图标管理',icomName:'smile'}]
                    this.leftSelect = [1]
                    this.onSearchLeftNavagationTable(this.searchMsg)
                }
            },
            controlLeftNavigationRequest(id){
                if(this.topSelect==1){
                    this.onSearchBookmark(id)
                }else if(this.topSelect==2){
                    switch (id) {
                        case 1:
                            this.onSearchLeftNavagationTable('')
                            break
                        case 2:
                            this.onSearchIcomTable('')
                            break
                    }

                }
            },
            openBookmarkFrom(id) {
                this.$refs.childBookmarkForm.showModal(id)
            },
            openIcomForm(id) {
                this.$refs.childIcomForm.showModal(id)
            },
            openLeftNavigationForm(id) {
                this.$refs.childLeftNavigationForm.showModal(id)
            },
            onSearchBookmark(leftSelect) {
                this.$refs.childBookmark.search(leftSelect, this.searchMsg)
            },
            onSearchIcomTable(name){
                this.$refs.childIcomTable.getData(name)
            },
            onSearchLeftNavagationTable(name){
                this.$refs.childLeftNavigationTable.getData(name)
            }
        },
        created() {
            this.getCurHeight(),
            this.getCurWidth(),
            this.getLeftNavigation(this.topSelect)
            setTimeout(() => {
                this.onSearchBookmark(this.leftSelect)
            }, 300)
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


