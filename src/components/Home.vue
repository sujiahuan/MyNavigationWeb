<template>
    <a-layout id="components-layout-demo-top-side-2">
        <a-layout-header class="header">
            <!--            <div class="logo"/>-->
            <a-input-search class="logo" v-model="querySideMenu" :placeholder="'输入侧边栏名称'"
                            style="width: 200px"
                            @search="filterSideNavigation()"/>
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
            <a-layout-sider width="200"
                            :style="{background:'#fff',height:$globalConstant.curHeight-64+'px',overflow: 'auto'}">
                <a-menu
                        mode="inline"
                        :default-selected-keys="[1]"
                        :default-open-keys="[0]"
                        :style="{ height: '100%', borderRight: 0 }"
                        v-model="leftSelect"
                >
                    <!--                    侧边栏1、2、3-->
                    <template>
                        <a-menu-item v-for="leftnavigation in leftNavigations" :key="leftnavigation.id"
                                     @click="controlLeftNavigationRequest(leftnavigation.id)">
                            <a-icon :type="leftnavigation.icomName!=''&&topSelect!=3?leftnavigation.icomName:'robot'"/>
                            <Tooltip placement="right" :title="leftnavigation.name">
                                <span>{{leftnavigation.name}}</span>
                            </Tooltip>
                        </a-menu-item>
                    </template>

                </a-menu>
            </a-layout-sider>
            <router-view></router-view>
            <a-layout-sider
                    width="400"
                    style="background: #fff"
                    v-if="topSelect==3"
                    collapsible
                    collapsedWidth="0"
                    :zeroWidthTriggerStyle="zeroWidthTriggerStyle"
                    :defaultCollapsed="true"
            >
                <a-textarea placeholder="发送到服务器上的消息" v-model="text" :rows="5" :allowClear="true" style="height: 100%"/>
            </a-layout-sider>

        </a-layout>
    </a-layout>
</template>
<script>
    const topNavigations = [
        {id: 1, name: '书签'},
        {id: 2, name: '系统管理'},
        {id: 3, name: '模拟设备'}
    ]
    const systemNavigations = [
        {id: 1, name: '设备管理', icomName: 'desktop', path: 'deviceTable'},
        {id: 2, name: '因子管理', icomName: 'dot-chart', path: 'codeTable'},
        {id: 3, name: '书签管理', icomName: 'unordered-list', path: 'sortTable'},
        {id: 4, name: '图标管理', icomName: 'smile', path: 'icomTable'},
    ]
    export default {
        data() {
            return {
                collapsed: false,
                querySideMenu: "",
                topNavigations,
                topSelect: [1],
                leftNavigations: [],
                leftSelect: [],
                icoms: [],
                webSocket: null,
                text: '',
                textArr: [],
                zeroWidthTriggerStyle: {
                    top: '-52px',
                    right: '0px',
                    background: '#001529'
                }
            };
        },
        mounted() {
            this.querySidebar(this.topSelect)
            setTimeout(() => {
                this.setMenu()
            }, 1000)

        },
        watch: {
            'text': function () {
                if (!this.text == '') {
                    return
                }
                this.textArr = []
            },
            '$route.path': function () {
                this.setMenu()
                if (null != this.webSocket) {
                    console.info(this.webSocket)
                    this.webSocket.close()
                }
                if (this.$route.path.indexOf('controlDevice') != -1) {
                    this.initWebSocket()
                }
            },
        },
        methods: {

            setMenu() {
                if (this.topSelect[0] != this.selectedTop()[0]) {
                    this.topSelect = this.selectedTop();
                    this.querySidebar(this.topSelect)
                } else {
                    this.leftSelect = this.selectedLeft();
                }
            },
            selectedTop() {
                if (this.$route.path.indexOf('bookMarkCard') != -1) {
                    return [1]
                } else if (this.$route.path.indexOf('controlDevice') != -1) {
                    return [3]
                } else {
                    return [2]
                }
            },
            selectedLeft() {
                for (let leftNavigation of this.leftNavigations) {
                    if (leftNavigation.path == undefined) {
                        if (this.$route.path.substring(this.$route.path.lastIndexOf("/") + 1, this.$route.path.length) == leftNavigation.id) {
                            return [leftNavigation.id]
                        }
                    } else {
                        if (this.$route.path.indexOf(leftNavigation.path) != -1) {
                            return [leftNavigation.id]
                        }
                    }
                }
            },
            filterSideNavigation() {
                let data=[];
                switch (this.topSelect[0]) {
                    case 1:
                        localStorage.setItem('filterSideNavigationA', this.querySideMenu)
                        data = JSON.parse(localStorage.getItem("bookMarkLeftNavigation")).filter(item => item.name.indexOf(this.querySideMenu) != -1)
                        break;
                    case 2:
                        localStorage.setItem('filterSideNavigationB', this.querySideMenu)
                        data = JSON.parse(localStorage.getItem("systemLeftNavigation")).filter(item => item.name.indexOf(this.querySideMenu) != -1)
                        break;
                    case 3:
                        localStorage.setItem('filterSideNavigationC', this.querySideMenu)
                        data = JSON.parse(localStorage.getItem("simulationLeftNavigations")).filter(item => item.name.indexOf(this.querySideMenu) != -1)
                        console.log(data)
                        break;
                }
                this.leftNavigations = data
            },
            //切换顶部tab肯定会调用到的方法
            querySidebar(index) {
                let data;
                //获取书签侧边栏
                if (index == 1) {
                    let filterSideNavigationA=localStorage.getItem("filterSideNavigationA");
                    this.querySideMenu=filterSideNavigationA==null?"":filterSideNavigationA;

                    this.$api.home.getBookMarkLeftNavigation()
                        .then(response => {
                            localStorage.setItem('bookMarkLeftNavigation', JSON.stringify(response.data.data))
                            if(this.querySideMenu==""){
                                data=response.data.data
                            }else{
                                data=response.data.data.filter(item => item.name.indexOf(this.querySideMenu) != -1)
                            }
                            this.leftNavigations = data;
                            if (this.leftNavigations.length != 0) {
                                this.$router.push({
                                    path: '/home/bookMarkCard/' + this.leftNavigations[0].id,
                                })
                            } else {
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
                    let filterSideNavigationB=localStorage.getItem("filterSideNavigationB");
                    this.querySideMenu=filterSideNavigationB==null?"":filterSideNavigationB;
                    localStorage.setItem('systemLeftNavigation', JSON.stringify(systemNavigations))
                    if(this.querySideMenu==""){
                        data=systemNavigations
                    }else{
                        data=systemNavigations.filter(item => item.name.indexOf(this.querySideMenu) != -1)
                    }
                    this.leftNavigations = data;

                    if (this.$route.path.indexOf('deviceTable') == -1) {
                        this.$router.push({name: 'deviceTable'})
                    } else {
                        this.leftSelect = this.selectedLeft();
                    }
                    ////获取模拟设备侧边栏
                } else if (index == 3) {
                    let filterSideNavigationC=localStorage.getItem("filterSideNavigationC");
                    this.querySideMenu=filterSideNavigationC==null?"":filterSideNavigationC;

                    this.$api.home.getSimulationLeftNavigations()
                        .then(response => {
                            localStorage.setItem('simulationLeftNavigations', JSON.stringify(response.data.data))
                            if(this.querySideMenu==""){
                                data=response.data.data
                            }else{
                                data=response.data.data.filter(item => item.name.indexOf(this.querySideMenu) != -1)
                            }
                            this.leftNavigations = data;

                            if (this.leftNavigations.length != 0 && this.$route.path.indexOf('controlDevice') == -1) {
                                this.$router.push({
                                    name: 'controlDevice',
                                    params: {id: this.leftNavigations[0].id}
                                })
                            } else {
                                this.leftSelect = this.selectedLeft();
                            }
                        })
                        .catch(function (error) { // 请求失败处理
                            console.log("错误：" + error);
                        });
                }
            },
            controlLeftNavigationRequest(id) {
                if (this.topSelect == 1) {
                    this.$router.push({
                        path: '/home/bookMarkCard/' + id,
                    })
                } else if (this.topSelect == 2) {
                    for (let systemNavigation of systemNavigations) {
                        if (id == systemNavigation.id) {
                            this.$router.push({name: systemNavigation.path})
                        }
                    }
                } else if (this.topSelect == 3) {
                    this.$router.push({
                        name: "controlDevice",
                        params: {id: id}
                    })
                }
            },

            // 初始化 webSocket
            initWebSocket() {
                // 创建 WebSocket 对象
                let userId = this.$route.params.id
                this.webSocket = new WebSocket('ws://' + this.$base.api.replace("http://", "") + '/webSocketBySpring/customWebSocketHandler?mchNo=' + userId)
                this.webSocket.onopen = this.onOpenWebSocket
                this.webSocket.onmessage = this.onMessageWebSocket
                this.webSocket.onerror = this.onErrorWebSocket
                this.webSocket.onclose = this.closeWebSocket
            },
            // 连接建立之后执行 send 方法发送数据
            onOpenWebSocket() {
                console.log('链接建立成功!')
                // this.sendWebSocket('链接建立成功')
            },
            // 连接建立失败重连
            onErrorWebSocket() {
                this.initWebSocket()
            },
            // 数据接收
            onMessageWebSocket(e) {
                this.textArr.push(e.data)
                if (this.textArr.length > 15) {
                    this.textArr.shift();
                }
                this.text = this.textArr.join("");
            },
            // 数据发送
            sendWebSocket(Data) {
                console.info(this.webSocket)
                this.webSocket.send(Data)
            },
            // 关闭
            closeWebSocket(e) {
                console.log('断开连接', e)
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

    /*.ant-layout .ant-layout-sider{*/
    /*    height:100px;*/
    /*    overflow: auto;*/
    /*}*/

    .ant-input-affix-wrapper .ant-input {
        height: 100%;
    }
</style>


