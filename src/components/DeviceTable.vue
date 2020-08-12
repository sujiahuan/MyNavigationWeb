<template>
    <a-table :columns="columns" :data-source="tableData" rowKey="id" :loading="isLoading" bordered>
        <template
                v-for="col in ['ip', 'port', 'mn','monitoringType','agreement']"
                :slot="col"
                slot-scope="text, record"
        >
            <div :key="col">
                <a-input
                        v-if="record.editable"
                        style="margin: -5px 0"
                        :value="text"
                        @change="e => handleChange(e.target.value, record.key, col)"
                />
                <template v-else>
                    {{ text }}
                </template>
            </div>
        </template>
        <template slot="operation" slot-scope="text, record">
            <div class="editable-row-operations">
        <span v-if="record.editable">
          <a @click="() => save(record.key)">保存</a>
          <a-popconfirm title="确定取消?" cancelText="取消" okText="确认" @confirm="() => cancel(record.key)">
            <a>取消</a>
          </a-popconfirm>
        </span>
                <span v-else>
          <a :disabled="editingKey !== ''" @click="() => edit(record.key)">编辑</a>
        </span>
            </div>
        </template>
    </a-table>
</template>
<script>
    const columns = [
        {
            title: '主机地址',
            dataIndex: 'ip',
            width: '20%',
            scopedSlots: { customRender: 'ip' },
        },
        {
            title: '端口',
            dataIndex: 'port',
            width: '10%',
            scopedSlots: { customRender: 'port' },
        },
        {
            title: 'MN号',
            dataIndex: 'mn',
            width: '20%',
            scopedSlots: { customRender: 'mn' },
        },
        {
            title: '监测类型',
            dataIndex: 'monitoringType',
            width: '10%',
            scopedSlots: { customRender: 'monitoringType' },
        },
        {
            title: '协议',
            dataIndex: 'agreement',
            width: '10%',
            scopedSlots: { customRender: 'agreement' },
        },
        {
            title: '操作',
            dataIndex: 'operation',
            scopedSlots: { customRender: 'operation' },
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
                cacheData:[],
                tableData:[],
                columns,
                editingKey: '',
            };
        },
        props: ['searchMsg'],
        mounted() {
           this.scanData();
        },
        methods: {
            scanData(){
                this.isLoading=true;
                let data= {
                    page: this.ipagination.current,
                    size: this.ipagination.pageSize,
                    mn: this.searchMsg
                }
                this.$axios.get(this.$base.api+"/counDevice/getPageByMn",{params:data})
                    .then(response => (
                        this.tableData = response.data.data.records,
                            this.cacheData = this.tableData.map(item => ({ ...item })),
                            this.ipagination.total=response.data.data.total,
                            this.isLoading=false
                    ))
                    .catch(function (error) { // 请求失败处理
                        console.log(error);
                    });
            },
            handleChange(value, key, column) {
                const newData = [...this.tableData];
                const target = newData.filter(item => key === item.key)[0];
                if (target) {
                    target[column] = value;
                    this.tableData = newData;
                }
            },
            edit(key) {
                const newData = [...this.tableData];
                const target = newData.filter(item => key === item.key)[0];
                this.editingKey = key;
                if (target) {
                    target.editable = true;
                    this.tableData = newData;
                }
            },
            save(key) {
                const newData = [...this.tableData];
                const newCacheData = [...this.cacheData];
                const target = newData.filter(item => key === item.key)[0];
                const targetCache = newCacheData.filter(item => key === item.key)[0];
                if (target && targetCache) {
                    let data={
                        id:target.id,
                        ip:target.ip,
                        port:target.port,
                        mn:target.mn,
                        monitoringType:target.monitoringType,
                        agreement:target.agreement
                    }
                    let vm=this
                this.$axios.post(this.$base.api+'/counDevice/update', data)
                        .then(function () {
                            vm.$message.info("编辑成功")
                            delete target.editable;
                            vm.tableData = newData;
                            Object.assign(targetCache, target);
                            vm.cacheData = newCacheData;
                        })
                        .catch(function (error) {
                            vm.$message.error("编辑失败"+error)
                        });
                }
                this.editingKey = '';
            },
            cancel(key) {
                const newData = [...this.tableData];
                const target = newData.filter(item => key === item.key)[0];
                this.editingKey = '';
                if (target) {
                    Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
                    delete target.editable;
                    this.tableData = newData;
                }
            },
        },
    };
</script>
<style scoped>
    .editable-row-operations a {
        margin-right: 8px;
    }
</style>
