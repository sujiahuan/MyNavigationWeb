<template>

    <a-layout :style="{ background: '#fff', padding: '0px', margin: 0, minHeight:$globalConstant.curHeight- 145+'px' }">
        <!--            <a-layout-header>Header</a-layout-header>-->
        <a-layout-content>
            <conDivisorTable ref="childrenDivisorTable" ></conDivisorTable>
            <conRTDataTypeTable ref="childrenConRTDataTypeTable"></conRTDataTypeTable>
<!--            <template>-->
<!--                <a-textarea placeholder="Basic usage" :rows="4" />-->
<!--            </template>-->
        </a-layout-content>

    </a-layout>
</template>

<script>
    import conDivisorTable from "./ConDivisorTable";
    import conRTDataTypeTable from "./ConRTDataTypeTable";

    export default {
        data() {
            return {
            };
        },
        components: {
            conDivisorTable,
            conRTDataTypeTable
        },
        watch:{
            '$route.path':function () {
                if(this.$route.path.indexOf('controlDevice')!=-1){
                   this.init()
                }
            },
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