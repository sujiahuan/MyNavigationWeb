<template>
    <a-layout style="padding: 0 24px 24px" >
        <a-tabs type="card" @change="callback"  style="background-color: white;" :tabBarStyle="tabBarStyle" size="large"  >
            <a-tab-pane key="1" tab="实时数据">
                <divisorTable></divisorTable>
            </a-tab-pane>
            <a-tab-pane key="2" tab="补发数据">
                Content of Tab Pane 2
            </a-tab-pane>
            <a-tab-pane key="3" tab="远程反控">
                Content of Tab Pane 3
            </a-tab-pane>
        </a-tabs>
    </a-layout>
</template>
<script>
    import divisorTable from "./DivisorTable";
    export default {
        data() {
            return {
                tabBarStyle:{
                    // backgroundColor:'black'
                }
            };
        },
        components:{
            divisorTable
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