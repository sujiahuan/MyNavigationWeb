<template>

    <a-layout :style="{ background: '#fff', padding: '0px', margin: 0, minHeight:$globalConstant.curHeight- 153+'px' }">
        <!--            <a-layout-header>Header</a-layout-header>-->
        <a-layout-content>
            <conDivisorTable ref="childrenDivisorTable"></conDivisorTable>
            <conSADataTypeTable ref="childrenConSADataTypeTable" @getSocketConnetionStatus="getSocketConnetionStatus"></conSADataTypeTable>
        </a-layout-content>

    </a-layout>
</template>

<script>
    import conDivisorTable from "../ConDivisorTable";
    import conSADataTypeTable from "./ConSADataTypeTable";

    export default {
        data() {
            return {
            };
        },
        components: {
            conDivisorTable,
            conSADataTypeTable
        },
        watch:{
            '$route.path':function () {
                if(this.$route.path.indexOf('controlDevice')!=-1){
                    let controlDeviceSelectTabKey=sessionStorage.getItem("controlDeviceSelectTabKey");
                    if(controlDeviceSelectTabKey=="2"){
                        this.init()
                    }
                }
            }
        },
        // mounted() {
        //     this.init()
        // },
        methods:{
            init(){
                this.getSocketConnetionStatus();
                this.$refs.childrenDivisorTable.getCode()
                this.$refs.childrenDivisorTable.scanData()
                this.$refs.childrenConSADataTypeTable.scanData()
            },
            getSocketConnetionStatus(){
                console.log("补发进来了")
                this.$refs.childrenDivisorTable.getSocketConnetionStatus();
            },
        }
    }
</script>

<style scoped>

</style>