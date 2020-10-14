<template>
    <a-layout style="padding: 0 24px 0px" >
        <a-tabs type="card" @change="callback"  style="background-color: white;margin-top:40px" :tabBarStyle="tabBarStyle" size="large" :animated="true" >
            <a-tab-pane key="1" tab="实时数据">
                <conRealTime ref="childrenConRealTime"></conRealTime>
            </a-tab-pane>
            <a-tab-pane key="2" tab="补发数据" :forceRender="true">
                <conSupplyAgain ref="childrenConSupplyAgain"></conSupplyAgain>
            </a-tab-pane>
            <a-tab-pane key="3" tab="远程反控" :forceRender="true">
                <conRemoteCounteraTable ref="childrenConRemoteCounteraTable" ></conRemoteCounteraTable>
            </a-tab-pane>
        </a-tabs>
        <a @click="goBack"><a-icon style="position:absolute;left:240px;top:78px;color: #555" type="left" /></a>
        <div style="position:absolute;left:35%;top:73px;color: #555">
            <span>地址：</span>
            <span style="margin-right: 30px">{{getTarget($route.params.id).ip}}</span>
            <span>端口：</span>
            <span style="margin-right: 30px">{{getTarget($route.params.id).port}}</span>
            <span>MN号：</span>
            <span style="margin-right: 30px">{{getTarget($route.params.id).mn}}</span>
            <span>类型：</span>
            <span style="margin-right: 30px">{{getTarget($route.params.id).monitoringType==32?'废水':'废气'}}</span>
            <span>协议：</span>
            <span>{{getTarget($route.params.id).agreement}}</span>
        </div>
    </a-layout>
</template>
<script>
    import conRealTime from "./ConRealTime";
    import conSupplyAgain from "./ConSupplyAgain";
    import conRemoteCounteraTable from "./ConRemoteCounteraTable";
    export default {
        data() {
            return {
                tabBarStyle:{
                    // backgroundColor:'black'
                }
            };
        },
        components:{
            conRealTime,
            conSupplyAgain,
            conRemoteCounteraTable
        },
        mounted() {
            console.info(this.$route)
        },
        methods: {
            getTarget(id){
                return JSON.parse(localStorage.getItem("simulationLeftNavigations")).filter(item => id === item.id)[0]
            },
            goBack(){
                // sessionStorage.setItem("deviceId",this.$route.params.id)
                sessionStorage.setItem("mn",this.getTarget(this.$route.params.id).mn)
                this.$router.push({
                    name:'deviceTable',
                })
            },
            callback(key) {
                if(key==1){
                    this.$refs.childrenConRealTime.init()
                }else if(key==2){
                    this.$refs.childrenConSupplyAgain.init()
                }else{
                    this.$refs.childrenConRemoteCounteraTable.scanData()
                }
            },
        },
    };
</script>
<style>
    .ant-tabs .ant-tabs-bar {
    margin:0 0 8px 0
}
</style>