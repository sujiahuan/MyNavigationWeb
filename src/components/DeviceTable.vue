<template>
    <a-table :columns="columns" :data-source="data" :pagination="ipagination" @change="change" :locale="locale"
             :loading="isLoading" rowKey="id">
        <span slot="index" slot-scope="text, record, index">{{index+1}}</span>
        <span slot="monitoringType" slot-scope="text, record">{{record.monitoringType=="31"?'废水':'废气'}}</span>
        <span slot="agreement" slot-scope="text, record">{{record.agreement=="17"?'17协议':'05协议'}}</span>
        <span slot="action" slot-scope="text, record">
      <a @click="openDeviceForm(record.id)">编辑</a>
      <a-divider type="vertical"/>
      <a @click="showConfirm(record.id)">删除</a>
    </span>
    </a-table>
</template>
<script>
    const columns = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            scopedSlots: {customRender: 'index'},
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
            title: '操作',
            dataIndex: 'action',
            scopedSlots: {customRender: 'action'},
        },
    ];

    // const tableData = [];
    // for (let i = 0; i < 100; i++) {
    //     tableData.push({
    //         key: i.toString(),
    //         name: `Edrward ${i}`,
    //         age: 32,
    //         address: `London Park no. ${i}`,
    //     });
    // }
    export default {
        data() {
            return {
                data: [],
                columns,
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
        props: ['searchMsg'],
        methods: {
            change(obj) {
                this.ipagination.current = obj.current
                this.ipagination.pageSize = obj.pageSize
                this.getData(this.searchMsg)
            },
            getData(mn) {
                this.isLoading = true
                let data = {
                    page: this.ipagination.current,
                    size: this.ipagination.pageSize,
                    mn: mn
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
                this.$emit("openDeviceForm", id)
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
                                        vm.getData(vm.searchMsg)
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
    .editable-row-operations a {
        margin-right: 8px;
    }
</style>
