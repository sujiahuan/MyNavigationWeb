<template>
    <a-layout style="padding: 0 24px 24px">
        <a-layout-header :style="{ background: '#fff', padding: '0px', margin: 0, minHeight:'50px',paddingLeft:'25px',marginBottom:'24px'}">
            图标：
            <a-input-search v-model="searchMsg" :placeholder="'输入图标名称'"
                            style="width: 200px"
                            @pressEnter="getIcomList()"/>
            <a-button style="margin-left: 20px;" type="primary"
                      @click="getIcomList()">
                查询
            </a-button>
            <a-button style="margin-left: 20px;background-color: #2828FF" type="primary"
                      @click="openIcomForm()">
                新增
            </a-button>
        </a-layout-header>
        <a-layout-content :style="{ background: '#fff', padding: '24px', margin: 0, minHeight:100+'%' }">
            <a-table :columns="columns" :data-source="data" :pagination="ipagination" @change="change" :locale="locale" :loading="isLoading" rowKey="id">
                <span slot="index" slot-scope="text, record, index" >{{index+1}}</span>
                <span slot="icom" slot-scope="text, record">
            <a-icon :type="record.name"/>
        </span>>
                <span slot="action" slot-scope="text, record">
      <a @click="openIcomForm(record.id)">编辑</a>
      <a-divider type="vertical"/>
      <a @click="showConfirm(record.id)">删除</a>
    </span>
            </a-table>
        </a-layout-content>

        <icomForm ref="childrenIcomForm" @getIcomList="getIcomList"></icomForm>
    </a-layout>


</template>
<script>
    import icomForm from "./IcomForm"

    const columns = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            scopedSlots: {customRender: 'index'},
        },
        {
            title: '图标',
            dataIndex: 'icom',
            key: 'icom',
            scopedSlots: {customRender: 'icom'},
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
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
                searchMsg:'',
                isLoading:false,
                ipagination: {
                    current: 0,
                    pageSize: 10,
                    total:0,
                    showSizeChanger: true,
                    pageSizeOptions: ['10','20','30'],  //这里注意只能是字符串，不能是数字
                    showTotal: (total) => `共有 ${total}条`,
                    buildOptionText:pageSizeOptions => `${pageSizeOptions.value}条/页`,
                },
                locale:{
                    emptyText:"亲，没数据啦。赶紧添一下数据吧！"
                }
            };
        },
        components:{
          icomForm
        },
        mounted() {
            this.getIcomList()
        },
        methods: {
            change(obj){
                this.ipagination.current=obj.current
                this.ipagination.pageSize=obj.pageSize
                this.getIcomList(this.searchMsg)
            },
            getIcomList() {
                this.isLoading=true
                this.$axios
                    .get(this.$base.api + '/icom/getPage?page='+this.ipagination.current+'&size='+ this.ipagination.pageSize+'&name=' + this.searchMsg)
                    .then(response => (
                        // this.data = JSON.parse(JSON.stringify(response.data.data.records).replace(/id/g, "key")),
                        this.data = response.data.data.records,
                        this.ipagination.total=response.data.data.total,
                            this.isLoading=false
                    ))
                    .catch(function (error) { // 请求失败处理
                        console.log(error);
                    });
            },
            openIcomForm(id) {
                this.$refs.childrenIcomForm.showModal(id)
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
                            .delete(vm.$base.api + '/icom/deleteById?id=' + id)
                            .then(response => {
                                if (response.data.state == 0) {
                                    vm.$message.success("删除成功"),
                                        vm.getIcomList()
                                } else {
                                    vm.$message.error("删除失败："+response.data.msg)
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
