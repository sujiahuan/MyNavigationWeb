<template>

    <a-layout :style="{ background: '#fff', padding: '0px', margin: 0, minHeight:$globalConstant.curHeight- 145+'px' }">
        <!--            <a-layout-header>Header</a-layout-header>-->
        <a-layout-content>
            <conDivisorTable ref="childrenDivisorTable"></conDivisorTable>
            <conRTDataTypeTable ref="childrenConRTDataTypeTable"></conRTDataTypeTable>
        </a-layout-content>
        <a-layout-footer>
            <template>
                <a-textarea placeholder="Basic usage" v-model="text" :rows="5" />
            </template>
        </a-layout-footer>
    </a-layout>
</template>

<script>
    import conDivisorTable from "./ConDivisorTable";
    import conRTDataTypeTable from "./ConRTDataTypeTable";

    export default {
        data() {
            return {
                text:'',
                socket:null
            };
        },
        components: {
            conDivisorTable,
            conRTDataTypeTable
        },
        watch:{
            '$route.path':function () {
                console.info("监听一")
                if(this.$route.path.indexOf('controlDevice')!=-1){
                   this.init()
                }
            },
            "$globalConstant": function () {
                console.info("进来了:"+this.$globalConstant.receiveMessage)
                this.text+=this.$globalConstant.receiveMessage
            }
        },
        mounted() {
            this.init()
        },
        methods:{
            init(){
                this.$refs.childrenDivisorTable.scanData()
                this.$refs.childrenConRTDataTypeTable.scanData()
            },

        }
    }
</script>

<style scoped>

</style>