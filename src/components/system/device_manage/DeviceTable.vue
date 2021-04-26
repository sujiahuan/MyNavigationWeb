<template>
    <a-layout style="padding: 0 24px 24px">
        <a-layout-header
                :style="{ background: '#fff', padding: '0px', margin: 0, minHeight:'50px',paddingLeft:'25px',marginBottom:'24px'}">
            名称：
            <a-input v-model="searchName" :placeholder="'输入名称'"
                     style="width: 200px;height:29px;margin-right: 15px"
                     @pressEnter="getDeviceList()"/>
            MN号：
            <a-input v-model="searchMn" :placeholder="'输入MN号'"
                            style="width: 200px"
                            @pressEnter="getDeviceList()"/>
            <a-button style="margin-left: 20px;" type="primary"
                      @click="getDeviceList()">
                查询
            </a-button>
            <a-button style="margin-left: 20px;background-color: #2828FF" type="primary"
                      @click="openDeviceForm()">
                新增
            </a-button>
        </a-layout-header>

        <!--        <a-breadcrumb style="padding-left: 25px;padding: 5px">-->
        <!--            <a-breadcrumb-item>{{topNavigations[1].name}}</a-breadcrumb-item>-->
        <!--            <template v-for="leftNavigation in leftNavigations">-->
        <!--                <a-breadcrumb-item v-if="leftNavigation.id==leftSelect" :key="leftNavigation.id">{{leftNavigation.name}}</a-breadcrumb-item>-->
        <!--            </template>-->
        <!--        </a-breadcrumb>-->

        <a-layout-content :style="{ background: '#fff', padding: '24px', margin: 0, minHeight:100+'%' }">
            <a-table :columns="columns" :data-source="data" :pagination="ipagination" @change="change" :locale="locale"
                     :loading="isLoading" rowKey="id">
                <span slot="index" slot-scope="text, record, index">{{index+1}}</span>
                <span slot="autoConnection" slot-scope="text">
<!--                    {{text==false?'关闭':"打开"}}-->
                    <a-icon type="api" v-if="text==false"/>
                    <a-icon type="api" theme="twoTone" v-else/>
                </span>
                <span slot="monitoringType" slot-scope="text,record">
                    <template v-if="record.monitoringType==21" >
                        21 / 地表水质量监测
                    </template>
                    <template v-else-if="record.monitoringType==22">
                        22 / 空气质量监测
                    </template>
                    <template v-else-if="record.monitoringType==23">
                        23 / 声环境质量监测
                    </template>
                    <template v-else-if="record.monitoringType==24">
                        24 / 地下水质量监测
                    </template>
                    <template v-else-if="record.monitoringType==25">
                        25 / 土壤质量监测
                    </template>
                    <template v-else-if="record.monitoringType==26">
                        26 / 海水质量监测
                    </template>
                    <template v-else-if="record.monitoringType==27">
                        27 / 挥发性有机物监测
                    </template>
                    <template v-else-if="record.monitoringType==31">
                        31 / 大气环境污染源
                    </template>
                    <template v-else-if="record.monitoringType==32">
                        32 / 地表水体环境污染源
                    </template>
                    <template v-else-if="record.monitoringType==33">
                        33 / 地下水体环境污染源
                    </template>
                    <template v-else-if="record.monitoringType==34">
                        34 / 海洋环境污染源
                    </template>
                    <template v-else-if="record.monitoringType==35">
                        35 / 土壤环境污染源
                    </template>
                    <template v-else-if="record.monitoringType==36">
                        36 / 声环境污染源
                    </template>
                    <template v-else-if="record.monitoringType==37">
                        37 / 振动环境污染源
                    </template>
                    <template v-else-if="record.monitoringType==38">
                        38 / 放射性环境污染源
                    </template>
                    <template v-else-if="record.monitoringType==39">
                        39 / 工地扬尘污染源
                    </template>
                    <template v-else-if="record.monitoringType==41">
                        41 / 电磁环境污染源
                    </template>
                    <template v-else-if="record.monitoringType==51">
                        51 / 烟气排放过程监控
                    </template>
                    <template v-else-if="record.monitoringType==52">
                        52 / 污水排放过程监控
                    </template>
                    <template v-else-if="record.monitoringType==91">
                        91 / 系统交互
                    </template>
<!--                    <template>-->
<!--                        {{record.monitoringType=="31"?'废气':'废水'}}-->
<!--                    </template>-->
                </span>

                <span slot="subpackage" slot-scope="text, record">
                    <template v-if="record.subpackage==0" >
                        不分包
                    </template>
                    <template v-else-if="record.subpackage==1">
                       分包，带包头
                    </template>
                    <template v-else-if="record.subpackage==2">
                        分包，没包头
                    </template></span>
                <span slot="agreement" slot-scope="text, record">{{record.agreement=="17"?'17协议':'05协议'}}</span>
                <span slot="analogNumber" slot-scope="text, record">
                    {{record.analogNumber=="1"?'关':record.analogNumber}}
                </span>
                <span slot="action" slot-scope="text, record">
                    <a @click="skipControlDevice(record.id)">模拟设备</a>
      <a-divider type="vertical"/>
      <a @click="openDeviceForm(record.id)">编辑</a>
      <a-divider type="vertical"/>
      <a @click="showConfirm(record.id)">删除</a>
    </span>
            </a-table>
        </a-layout-content>

        <deviceForm ref="childrenDeviceForm" @getDeviceList="getDeviceList"></deviceForm>
    </a-layout>
</template>
<script>
    import deviceForm from "./DeviceForm"

    const columns = [
        {
            title: '序号',

            dataIndex: 'index',
            key: 'index',
            scopedSlots: {customRender: 'index'},
        },
        {
            title: '名称',
            dataIndex: 'name',
            // width: '20%',
            // scopedSlots: {customRender: 'name'},
        },
        {
            title: '主机地址',
            dataIndex: 'ip',
            // width: '20%',
            // scopedSlots: {customRender: 'ip'},
        },
        {
            title: '端口',
            dataIndex: 'port',
            // width: '10%',
            // scopedSlots: {customRender: 'port'},
        },
        {
            title: '自动连接',
            dataIndex: 'autoConnection',
            align: 'center',
            // width: '10%',
            scopedSlots: {customRender: 'autoConnection'},
        },
        {
            title: 'MN号',
            dataIndex: 'mn',
            // width: '20%',
            // scopedSlots: {customRender: 'mn'},
        },
        {
            title: '监测类型',
            dataIndex: 'monitoringType',
            // width: '10%',
            scopedSlots: {customRender: 'monitoringType'},
        },
        {
            title: '协议',
            dataIndex: 'agreement',
            // width: '10%',
            scopedSlots: {customRender: 'agreement'},
        },
        {
            title: '分包',
            dataIndex: 'subpackage',
            // width: '20%',
            scopedSlots: {customRender: 'subpackage'},
        },
        {
            title: '模拟设备数',
            dataIndex: 'analogNumber',
            // width: '20%',
            scopedSlots: {customRender: 'analogNumber'},
        },
        {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: {customRender: 'action'},
        },
    ];

    export default {
        data() {
            return {
                data: [],
                columns,
                id:"",
                searchMn: '',
                searchName:"",
                topNavigations: [],
                topSelect: [],
                isLoading: false,
                ipagination: {
                    current: 0,
                    pageSize: 10,
                    total: 0,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '30'],  //这里注意只能是字符串，不能是数字
                    showTotal: (total) => `共有 ${total}条`,
                    buildOptionText: pageSizeOptions => `${pageSizeOptions.value}条/页`,
                },
                locale: {
                    emptyText: "亲，没数据啦。赶紧添一下数据吧！"
                }
            };
        },
        components: {
            deviceForm
        },
        mounted() {
            this.getDeviceList()
        },
        methods: {
            change(obj) {
                this.ipagination.current = obj.current
                this.ipagination.pageSize = obj.pageSize
                this.getDeviceList()
            },
            getDeviceList() {
                this.isLoading = true
                if (sessionStorage.getItem("deviceName")!= null) {
                    this.searchName = sessionStorage.getItem("deviceName")
                    sessionStorage.removeItem("deviceName")
                }
                let data = {
                    page: this.ipagination.current,
                    size: this.ipagination.pageSize,
                    mn: this.searchMn,
                    name:this.searchName
                }
                this.$axios
                    .get(this.$base.api + '/counDevice/getPage', {params: data})
                    .then(response => (
                        this.data = response.data.data.records,
                            this.ipagination.total = response.data.data.total,
                            this.isLoading = false
                    ))
                    .catch(function (error) { // 请求失败处理
                        console.log(error);
                    });
            },
            openDeviceForm(id) {
                this.$refs.childrenDeviceForm.showModal(id)
            },
            skipControlDevice(id) {
                this.$api.home.getSimulationLeftNavigations()
                    .then(response => {
                        localStorage.setItem('simulationLeftNavigations', JSON.stringify(response.data.data))
                        // setTimeout(()=>{
                            this.$router.push({
                                name: 'controlDevice',
                                params: {id: id}
                            })
                        // },500)

                    })
                    .catch(function (error) { // 请求失败处理
                        console.log(error);
                    });
            },
            showConfirm(id) {
                const vm = this
                this.$confirm({
                    title: '确定要删除图标吗?',
                    content: '删除后会将无法恢复。',
                    okText: '确定',
                    cancelText: '取消',
                    onOk() {
                        vm.$axios
                            .delete(vm.$base.api + '/counDevice/deleteById', {params: {id: id}})
                            .then(response => {
                                if (response.data.state == "0") {
                                    vm.$message.success("删除成功"),
                                        vm.getDeviceList()
                                } else {
                                    vm.$message.error("删除失败：" + response.data.msg)
                                }
                            })
                            .catch(function (error) { // 请求失败处理
                                vm.$message.error("删除失败：" + error)
                            });
                    },
                    onCancel() {
                    },
                });
            },
        },
    };
</script>
<style scoped>
</style>
