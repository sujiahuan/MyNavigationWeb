<template>
    <a-layout style="padding: 0 24px 24px" >
        <a-tabs type="card" @change="callback"  style="background-color: white;" :tabBarStyle="tabBarStyle" size="large"  >
            <a-tab-pane key="1" tab="实时数据">
                <conRealTime ></conRealTime>
            </a-tab-pane>
            <a-tab-pane key="2" tab="补发数据">
<!--                <divisorTable ref="childrenDivisorTable"></divisorTable>-->
            </a-tab-pane>
            <a-tab-pane key="3" tab="远程反控">
                Content of Tab Pane 3
            </a-tab-pane>
        </a-tabs>
    </a-layout>
</template>
<script>
    import conRealTime from "./ConRealTime";
    export default {
        data() {
            return {
                tabBarStyle:{
                    // backgroundColor:'black'
                }
            };
        },
        components:{
            conRealTime
        },
        mounted() {
        },
        watch: {
            '$route': function() {
                // this.init()
            }
        },
        methods: {
            callback(key) {
                console.log(key);
            },
        },
    };
</script>
<style>

</style>