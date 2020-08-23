<template>

    <a-layout :style="{ background: '#fff', padding: '0px', margin: 0, minHeight:$globalCss.curHeight- 145+'px' }">
        <!--            <a-layout-header>Header</a-layout-header>-->
        <a-layout-content>
            <divisorTable></divisorTable>
        </a-layout-content>
        <a-layout-footer>
            <conRealTimeList></conRealTimeList>
        </a-layout-footer>
    </a-layout>
</template>

<script>
    import divisorTable from "./DivisorTable";
    import conRealTimeList from "./ConRealTimeList";

    export default {
        data() {
            return {
                tabBarStyle: {
                    // backgroundColor:'black'
                }
            };
        },
        components: {
            divisorTable,
            conRealTimeList
        }
    }
</script>

<style scoped>

</style>