<template>
    <a-table :columns="columns" :data-source="data" :pagination="ipagination" @change="change" :locale="locale"
             :loading="isLoading" rowKey="id">
        <span slot="index" slot-scope="text, record, index">{{index+1}}</span>
        <span slot="navigationId" slot-scope="text">
            <template v-for="factor in factorColumn">
                <template v-if="factor.id==text">
                    {{factor.name}}
                </template>
            </template>
        </span>
        <span slot="action" slot-scope="text, record">
      <a @click="openForm(record.id)">编辑</a>
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
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '编码',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: '所属栏目',
            dataIndex: 'navigationId',
            key: 'navigationId',
            scopedSlots: {customRender: 'navigationId'},
        },
        {
            title: '操作',
            key: 'action',
            scopedSlots: {customRender: 'action'},
        },

    ];

    export default {
        data() {
            return {
                data: [],
                columns,
                searchMsg: {
                    code: "",
                    name: "",
                    type:1,
                },
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
        props:{
            factorColumn:Array
        },
        methods: {
            change(obj) {
                this.ipagination.current = obj.current
                this.ipagination.pageSize = obj.pageSize
                this.getList(this.searchMsg)
            },
            getList(searchMsg) {
                this.isLoading = true
                let data = {
                    page: this.ipagination.current,
                    size: this.ipagination.pageSize,
                    name: this.searchMsg.name=searchMsg.name,
                    code: this.searchMsg.code=searchMsg.code,
                    type: this.searchMsg.type=searchMsg.type
                }
                this.$api.divisor.getPage(data)
                    .then(response => (
                        this.data = response.data.data.records,
                            this.ipagination.total = response.data.data.total,
                            this.isLoading = false
                    ))
                    .catch(function (error) { // 请求失败处理
                        console.log(error);
                    });
            },
            openForm(id){
                this.$emit("openForm",id);
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
                            .delete(vm.$base.api + '/sysCode/deleteById?id=' + id)
                            .then(response => {
                                if (response.data.state == 0) {
                                        vm.getList(vm.searchMsg)
                                    vm.$message.success("删除成功")
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
        }
    };
</script>


<style scoped>

</style>
