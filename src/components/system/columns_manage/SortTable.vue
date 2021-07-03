<template>
    <a-layout style="padding: 0 24px 24px">
        <a-layout-header
                :style="{ background: '#fff', padding: '0px', margin: 0, minHeight:'50px',paddingLeft:'25px',marginBottom:'24px'}">
            名称：
            <a-input v-model="searchMsg" :placeholder="'输入分类名称'"
                     style="width: 200px"
                     @pressEnter="getSiderList()"/>
            <a-button style="margin-left: 20px;" type="primary"
                      @click="getSiderList(selectTabKey)">
                查询
            </a-button>
            <a-button style="margin-left: 20px;background-color: #2828FF" type="primary"
                      @click="openSiderForm(selectTabKey)">
                新增
            </a-button>
        </a-layout-header>

        <a-layout-content :style="{ background: '#fff', padding: '24px', margin: 0, minHeight:100+'%' }">
            <a-tabs default-active-key="1" @change="callback">
                <a-tab-pane key="1" tab="书签栏目">
                    <a-table :columns="columns" :data-source="data" :pagination="ipagination" @change="change" :locale="locale"
                             :loading="isLoading">
                        <span slot="index" slot-scope="text, record, index">{{index+1}}</span>
                        <span slot="icom" slot-scope="text, record">
                    <a-icon :type="record.icomName"/>
                </span>
                        <span slot="action" slot-scope="text, record">
                    <a @click="openSiderForm(selectTabKey,record.key)">编辑</a>
                              <a-divider type="vertical"/>
                    <a @click="showConfirm(record.key)">删除</a>
                </span>
                    </a-table>
                </a-tab-pane>
                <a-tab-pane key="2" tab="因子栏目" force-render>
                    <a-table :columns="columns2" :data-source="data" :pagination="ipagination" @change="change" :locale="locale"
                             :loading="isLoading">
                        <span slot="index" slot-scope="text, record, index">{{index+1}}</span>
<!--                        <span slot="icom" slot-scope="text, record"><a-icon :type="record.icomName"/></span>-->
                        <span slot="action" slot-scope="text, record">
                            <a @click="openSiderForm(selectTabKey,record.key)">编辑</a>
                            <a-divider type="vertical"/>
                            <a @click="showConfirm(record.key)">删除</a>
                        </span>
                    </a-table>
                </a-tab-pane>
            </a-tabs>

        </a-layout-content>

        <sortForm ref="childrenSiderForm" @getSiderList="getSiderList"></sortForm>
    </a-layout>

</template>
<script>
    import sortForm from "./SortForm"

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

    const columns2 = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            scopedSlots: {customRender: 'index'},
        },
        // {
        //     title: '图标',
        //     dataIndex: 'icom',
        //     key: 'icom',
        //     scopedSlots: {customRender: 'icom'},
        // },
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
                columns2,
                selectTabKey:1,
                searchMsg: '',
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
            sortForm
        },
        mounted() {
            this.getSiderList(1)
        },
        methods: {
            callback(key) {
                this.selectTabKey=key;
                this.getSiderList(key);
            },
            change(obj) {
                this.ipagination.current = obj.current
                this.ipagination.pageSize = obj.pageSize
                this.getSiderList(1)
            },
            getSiderList(type) {
                this.isLoading = true
                let data={
                    page:this.ipagination.current,
                    size:this.ipagination.pageSize,
                    type:type,
                    name:this.searchMsg
                }
                this.$api.column.getPage(data)
                    .then(response => (
                        this.data = JSON.parse(JSON.stringify(response.data.data.records).replace(/id/g, "key")),
                            this.isLoading = false
                    ))
                    .catch(function (error) { // 请求失败处理
                        console.log(error);
                    });
            },
            openSiderForm(tabKey,id) {
                console.log(tabKey+" "+id);
                this.$refs.childrenSiderForm.showModal(tabKey,id);
            },
            showConfirm(id) {
                const vm = this
                this.$confirm({
                    title: '确定要删除侧边栏吗?',
                    content: '删除后会将该侧边栏下的所有书签一并删除。',
                    okText: '确定',
                    cancelText: '取消',
                    onOk() {
                        vm.$api.column.deleteById(id)
                            .then(response => {
                                if (response.data.state == 0) {
                                    vm.$message.success("删除成功"),
                                        vm.getSiderList(vm.selectTabKey)
                                } else {
                                    vm.$message.error("删除失败：" + response.data.msg)
                                }
                            })
                            .catch(function (error) { // 请求失败处理
                                vm.$message.success("删除失败：" + error)
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
