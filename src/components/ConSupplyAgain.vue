<template>

    <a-layout :style="{ background: '#fff', padding: '0px', margin: 0, minHeight:$globalConstant.curHeight- 145+'px' }">
        <!--            <a-layout-header>Header</a-layout-header>-->
        <a-layout-content>
            <conDivisorTable ref="childrenDivisorTable"></conDivisorTable>
            <conSADataTypeTable ref="childrenConSADataTypeTable"></conSADataTypeTable>
        </a-layout-content>

    </a-layout>
</template>

<script>
    import conDivisorTable from "./ConDivisorTable";
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
                   this.init()
                }
            }
        },
        methods:{
            init(){
                this.$refs.childrenDivisorTable.scanData()
                this.$refs.childrenConSADataTypeTable.scanData()
            }
        }
    }
</script>

<style scoped>

</style>