<template>
    <a-table :columns="columns" :data-source="data" :pagination="ipagination" @change="change" :locale="locale" :loading="isLoading">
        <span slot="index" slot-scope="text, record, index">{{index+1}}</span>
        <span slot="icom" slot-scope="text, record">
            <a-icon :type="record.icomName" />
        </span>
        <span slot="action" slot-scope="text, record">
      <a @click="openLeftNavigationForm(record.key)">编辑</a>
      <a-divider type="vertical" />
      <a @click="showConfirm(record.key)">删除</a>
    </span>
    </a-table>
</template>
<script>
    const columns = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            scopedSlots: { customRender: 'index' },
        },
        {
            title: '图标',
            dataIndex: 'icom',
            key: 'icom',
            scopedSlots: { customRender: 'icom' },
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '操作',
            key: 'action',
            scopedSlots: { customRender: 'action' },
        },

    ];

    export default {
        data() {
            return {
                data:[],
                columns,
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
        props: ['searchMsg'],
        methods:{
            change(obj){
                this.ipagination.current=obj.current
                this.ipagination.pageSize=obj.pageSize
                this.getData(this.searchMsg)
            },
            getData(name){
                this.isLoading=true
                this.$axios
                    .get(this.$base.api+'/navigation/getPage?page='+this.ipagination.current+'&size='+ this.ipagination.pageSize+'&name='+name)
                    .then(response => (
                        this.data=JSON.parse(JSON.stringify(response.data.data.records).replace(/id/g,"key")),
                this.isLoading=false
                    ))
                    .catch(function (error) { // 请求失败处理
                        console.log(error);
                    });
            },
            openLeftNavigationForm(id){
                this.$emit("openLeftNavigationForm",id)
            },
            showConfirm(id) {
                const  vm=this
                this.$confirm({
                    title: '确定要删除侧边栏吗?',
                    content: '删除后会将该侧边栏下的所有书签一并删除。',
                    okText: '确定',
                    cancelText:'取消',
                    onOk() {
                        vm.$axios
                            .delete(vm.$base.api+'/navigation/deleteById?id='+id)
                            .then(response => {
                        if (response.data.state == 0) {
                            vm.$message.success("删除成功"),
                                vm.getData(vm.searchMsg)
                        } else {
                            vm.$message.error("删除失败："+response.data.msg)
                        }
                            })
                            .catch(function (error) { // 请求失败处理
                                vm.$message.success("删除失败："+error)
                            });

                    },
                    onCancel() {},
                });
            },
        }
    };
</script>


<style scoped>

</style>
