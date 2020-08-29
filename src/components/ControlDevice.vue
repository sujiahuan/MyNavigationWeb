<template>
    <a-layout style="padding: 0 24px 24px" >
        <a-tabs type="card" @change="callback"  style="background-color: white;" :tabBarStyle="tabBarStyle" size="large" :animated="true" >
            <a-tab-pane key="1" tab="实时数据">
                <conRealTime ref="childrenConRealTime"></conRealTime>
            </a-tab-pane>
            <a-tab-pane key="2" tab="补发数据" :forceRender="true">
                <conSupplyAgain ref="childrenConSupplyAgain"></conSupplyAgain>
            </a-tab-pane>
            <a-tab-pane key="3" tab="远程反控">
                Content of Tab Pane 3
            </a-tab-pane>
        </a-tabs>
    </a-layout>
</template>
<script>
    import conRealTime from "./ConRealTime";
    import conSupplyAgain from "./ConSupplyAgain";
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
            conSupplyAgain
        },
        mounted() {
        },
        methods: {
            callback(key) {
                // eslint-disable-next-line no-debugger
                // debugger
                if(key==1){
                    this.$refs.childrenConRealTime.init()
                }else if(key==2){
                    this.$refs.childrenConSupplyAgain.init()
                }else{
                    console.info("选中第三个")
                }
            },
        },
    };
</script>
<style>

</style>