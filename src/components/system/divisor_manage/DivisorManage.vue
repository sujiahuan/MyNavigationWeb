<template>
    <a-layout style="padding: 0 24px 24px">
        <a-layout-header
                :style="{ background: '#fff', padding: '0px', margin: 0, minHeight:'50px',paddingLeft:'25px',marginBottom:'24px'}">
            <a-input v-model="searchMsg.name" :placeholder="'输入名称'"
                     style="width: 200px;height:29px"
                     @pressEnter="queryFactorList()"/>
            <a-input-search v-model="searchMsg.code" :placeholder="'输入编码'"
                            style="width: 200px"
                            @search="queryFactorList()"/>
            <a-button style="margin-left: 20px;" type="primary"
                      @click="openForm()">
                新增
            </a-button>
        </a-layout-header>
        <a-layout-content :style="{ background: '#fff', padding: '50,50,50,50', margin: 0, minHeight:$globalConstant.curHeight- 175+'px' }">

            <a-tabs type="card" @change="callback" size="large">
                <a-tab-pane key="1" tab="监测因子">
                    <pollutionFactorTable ref="childPollutionFactorTable" @openForm="openForm"></pollutionFactorTable>
                </a-tab-pane>
                <a-tab-pane key="2" tab="动态因子">
                    <dynamicFactorTable ref="childDynamicFactorTable" @openForm="openForm"></dynamicFactorTable>
                </a-tab-pane>
            </a-tabs>

        </a-layout-content>

        <divisorForm ref="childrendivisorForm" @queryFactorList="queryFactorList"></divisorForm>
    </a-layout>
</template>
<script>
    import pollutionFactorTable from "./PollutionFactorTable"
    import dynamicFactorTable from "./DynamicFactorTable"
    import divisorForm from "./DivisorForm"

    export default {
        data() {
            return {
                searchMsg: {
                    code: "",
                    name: "",
                    type:0
                },
            };
        },
        components: {
            pollutionFactorTable,
            dynamicFactorTable,
            divisorForm
        },
        mounted() {
            this.queryFactorList();
        },
        methods: {
            openForm(id) {
                this.$refs.childrendivisorForm.showModal(id,this.searchMsg.type)
            },
            callback(key) {
                this.searchMsg.name="",
                this.searchMsg.code="",
                 this.searchMsg.type=Number(key)
                this.queryFactorList(key);
            },
            queryFactorList(key){
                if(key!=undefined){
                    this.searchMsg.type=Number(key)-1;
                }
                switch (this.searchMsg.type+1) {
                    case 1:
                        this.$refs.childPollutionFactorTable.getList(this.searchMsg);
                        break;
                    case 2:
                        this.$refs.childDynamicFactorTable.getList(this.searchMsg);
                        break;
                }
            }
        },
    };
</script>