<template>
    <a-layout style="padding: 0 24px 24px">
        <a-layout-header
                :style="{ background: '#fff', padding: '0px', margin: 0, minHeight:'50px',paddingLeft:'25px',marginBottom:'24px'}">
            名称：
            <a-input v-model="searchMsg.name" :placeholder="'输入名称'"
                     style="width: 200px;height:29px;margin-right: 15px"
                     @pressEnter="queryFactorList()"/>
            编码：
            <a-input v-model="searchMsg.code" :placeholder="'输入编码'"
                     style="width: 200px"
                     @pressEnter="queryFactorList()"/>
            <a-button style="margin-left: 20px;" type="primary"
                      @click="queryFactorList()">
                查询
            </a-button>
            <a-button style="margin-left: 20px;background-color: #2828FF" type="primary"
                      @click="openForm()">
                新增
            </a-button>
        </a-layout-header>
        <a-layout-content :style="{ background: '#fff', padding: '50,50,50,50', margin: 0, minHeight:100+'%' }">
            <a-tabs type="card" @change="callback" size="large">
                <a-tab-pane key="1" tab="监测因子">
                    <pollutionFactorTable ref="childPollutionFactorTable" :factorColumn="factorColumn" @openForm="openForm"></pollutionFactorTable>
                </a-tab-pane>
                <a-tab-pane key="2" tab="动态因子">
                    <dynamicFactorTable ref="childDynamicFactorTable" :factorColumn="factorColumn" @openForm="openForm"></dynamicFactorTable>
                </a-tab-pane>
            </a-tabs>

        </a-layout-content>

        <divisorForm ref="childrendivisorForm" :factorColumn="factorColumn" @queryFactorList="queryFactorList"></divisorForm>
    </a-layout>
</template>
<script>
    import pollutionFactorTable from "./PollutionFactorTable"
    import dynamicFactorTable from "./DynamicFactorTable"
    import divisorForm from "./DivisorForm"

    export default {
        data() {
            return {
                factorColumn:[],
                searchMsg: {
                    code: "",
                    name: "",
                    type: 0
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
            this.queryFactorColumn();
        },
        methods: {
            queryFactorColumn(){
                this.$api.column.getByType(2)
                    .then(response => (
                        this.factorColumn = response.data.data
                    ))
                    .catch(function (error) { // 请求失败处理
                        console.log(error);
                    });
            },
            openForm(id) {
                this.$refs.childrendivisorForm.showModal(id, this.searchMsg.type)
            },
            callback(key) {
                this.searchMsg.name = "",
                    this.searchMsg.code = "",
                    this.searchMsg.type = Number(key)
                this.queryFactorList(key);
            },
            queryFactorList(key) {
                if (key != undefined) {
                    this.searchMsg.type = Number(key) - 1;
                }
                this.$nextTick(() => {
                    switch (this.searchMsg.type + 1) {
                        case 1:
                            this.$refs.childPollutionFactorTable.getList(this.searchMsg);
                            break;
                        case 2:
                            this.$refs.childDynamicFactorTable.getList(this.searchMsg);
                            break;
                    }
                })
            }
        },
    };
</script>