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
    const systemNavigations=[
        {id: 1, name: '设备管理', icomName: 'desktop',path:'deviceTable'},
        {id: 2, name: '因子管理', icomName: 'dot-chart',path:'codeTable'},
        {id: 3, name: '书签管理', icomName: 'unordered-list',path:'sortTable'},
        {id: 4, name: '图标管理', icomName: 'smile',path:'icomTable'},
    ]
    export default {
        data() {
            return {
                collapsed: false,
                topNavigations,
                topSelect: [1],
                leftNavigations: [],
                leftSelect: [],
                icoms: [],
                webSocket:null,
                text:'',
                zeroWidthTriggerStyle:{
                    top:'-52px',
                    right:'0px',
                    background:'#001529'
                }
            };
        },
        mounted() {
            this.updateBookMarkLeftNavigation()
            this.updateSystemLeftNavigation()
            this.updateSimulationLeftNavigations()
            setTimeout(()=>{
                this.querySidebar(this.topSelect)
                this.setMenu()
            },1000)

        },
        watch: {
            '$route.path': function () {
                    this.setMenu()
                if(null!=this.webSocket){
                    console.info(this.webSocket)
                    this.webSocket.close()
                }
                if(this.$route.path.indexOf('controlDevice') != -1){
                    this.initWebSocket()
                }
            },
        },
        methods: {
            updateBookMarkLeftNavigation(){
                this.$api.home.getBookMarkLeftNavigation()
                    .then(response => {
                        localStorage.setItem('bookMarkLeftNavigation', JSON.stringify(response.data.data))
                    })
                    .catch(function (error) { // 请求失败处理
                        console.log(error);
                    });
            },
            updateSystemLeftNavigation(){
                localStorage.setItem('systemLeftNavigation',JSON.stringify(systemNavigations))
            },
            updateSimulationLeftNavigations(){
                this.$api.home.getSimulationLeftNavigations()
                    .then(response => {
                        localStorage.setItem('simulationLeftNavigations',JSON.stringify(response.data.data))
                    })
                    .catch(function (error) { // 请求失败处理
                        console.log(error);
                    });
            },
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
                        if (this.$route.path.substring(this.$route.path.lastIndexOf("/")+1,this.$route.path.length)==leftNavigation.id) {
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
                    this.leftNavigations = JSON.parse(localStorage.getItem("bookMarkLeftNavigation"))
                    if (this.leftNavigations.length != 0) {
                        // this.leftSelect =[this.leftNavigations[0].id]
                        this.$router.push({
                            path: '/home/bookMarkCard/'+this.leftNavigations[0].id,
                        })
                    }else{
                        this.$router.push({
                            name: 'bookMarkCard',
                            params: {id: '1', leftNavigations: 'null'}
                        })
                    }

                    //获取系统管理侧边栏
                } else if (index == 2) {
                    this.leftNavigations =systemNavigations
                    if (this.$route.path.indexOf('deviceTable') == -1) {
                        this.$router.push({name: 'deviceTable'})
                    }else{
                        this.leftSelect=this.selectedLeft();
                    }

                    ////获取模拟设备侧边栏
                } else if(index == 3){
                    this.leftNavigations = JSON.parse(localStorage.getItem("simulationLeftNavigations"))
                    if (this.leftNavigations.length != 0 && this.$route.path.indexOf('controlDevice') == -1) {
                        this.$router.push({
                            name:'controlDevice',
                            // params: {id: this.leftNavigations[0].id}
                            params:{id:this.leftNavigations[0].id}
                        })
                    }else{
                        this.leftSelect=this.selectedLeft();
                    }
                }
            },
            controlLeftNavigationRequest(id) {
                if (this.topSelect == 1) {
                    this.$router.push({
                        path: '/home/bookMarkCard/'+id,
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
            },

            // 初始化 webSocket
            initWebSocket () {
                // 创建 WebSocket 对象
                let userId = this.$route.params.id
                this.webSocket = new WebSocket('ws://'+this.$base.api.replace("http://","")+'/webSocketBySpring/customWebSocketHandler?mchNo='+userId)
                this.webSocket.onopen = this.onOpenWebSocket
                this.webSocket.onmessage = this.onMessageWebSocket
                this.webSocket.onerror = this.onErrorWebSocket
                this.webSocket.onclose = this.closeWebSocket
            },
            // 连接建立之后执行 send 方法发送数据
            onOpenWebSocket () {
                console.log('链接建立成功!')
                // this.sendWebSocket('链接建立成功')
            },
            // 连接建立失败重连
            onErrorWebSocket () {
                this.initWebSocket()
            },
            // 数据接收
            onMessageWebSocket (e) {
                // this.$globalConstant.receiveMessage= e.data
                // console.info(this.$globalConstant.receiveMessage)
                this.text+=e.data
                console.info(e.data)
            },
            // 数据发送
            sendWebSocket (Data) {
                console.info(this.webSocket)
                this.webSocket.send(Data)
            },
            // 关闭
            closeWebSocket (e) {
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
</style>


