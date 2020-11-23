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
            <span style="margin-right: 30px">
<!--                {{getTarget($route.params.id).monitoringType==32?'废水':'废气'}}-->
            <template v-if="getTarget($route.params.id).monitoringType==21" >
                        21/ 地表水质量监测{{getTarget($route.params.id).monitoringType}}{{record}}
                    </template>
                    <template v-else-if="getTarget($route.params.id).monitoringType==22">
                        22/ 空气质量监测
                    </template>
                    <template v-else-if="getTarget($route.params.id).monitoringType==23">
                        23/ 声环境质量监测
                    </template>
                    <template v-else-if="getTarget($route.params.id).monitoringType==24">
                        24/ 地下水质量监测
                    </template>
                    <template v-else-if="getTarget($route.params.id).monitoringType==25">
                        25/ 土壤质量监测
                    </template>
                    <template v-else-if="getTarget($route.params.id).monitoringType==26">
                        26/ 海水质量监测
                    </template>
                    <template v-else-if="getTarget($route.params.id).monitoringType==27">
                        27/ 挥发性有机物监测
                    </template>
                    <template v-else-if="getTarget($route.params.id).monitoringType==31">
                        31/ 大气环境污染源
                    </template>
                    <template v-else-if="getTarget($route.params.id).monitoringType==32">
                        32/ 地表水体环境污染源
                    </template>
                    <template v-else-if="getTarget($route.params.id).monitoringType==33">
                        33/ 地下水体环境污染源
                    </template>
                    <template v-else-if="getTarget($route.params.id).monitoringType==34">
                        34/ 海洋环境污染源
                    </template>
                    <template v-else-if="getTarget($route.params.id).monitoringType==35">
                        35/ 土壤环境污染源
                    </template>
                    <template v-else-if="getTarget($route.params.id).monitoringType==36">
                        36/ 声环境污染源
                    </template>
                    <template v-else-if="getTarget($route.params.id).monitoringType==37">
                        37/ 振动环境污染源
                    </template>
                    <template v-else-if="getTarget($route.params.id).monitoringType==38">
                        38/ 放射性环境污染源
                    </template>
                    <template v-else-if="getTarget($route.params.id).monitoringType==39">
                        39/ 工地扬尘污染源
                    </template>
                    <template v-else-if="getTarget($route.params.id).monitoringType==41">
                        41/ 电磁环境污染源
                    </template>
                    <template v-else-if="getTarget($route.params.id).monitoringType==51">
                        51/ 烟气排放过程监控
                    </template>
                    <template v-else-if="getTarget($route.params.id).monitoringType==52">
                        52/ 污水排放过程监控
                    </template>
                    <template v-else-if="getTarget($route.params.id).monitoringType==91">
                        91/ 系统交互
                    </template>
            </span>
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
            // this.getDivisorCode();
        },
        methods: {
            // getDivisorCode() {
            //     this.$api.divisor.getAll()
            //         .then(response => {
            //             if (response.data.state == 0) {
            //                 localStorage.setItem("divisorCodes", JSON.stringify(response.data.data));
            //             } else {
            //                 this.$message.error("设置因子失败")
            //             }
            //         })
            //         .catch(function (error) { // 请求失败处理
            //             console.log(error);
            //         });
            // },
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