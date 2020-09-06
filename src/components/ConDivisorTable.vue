<template>
    <div >
        <a-button class="editable-add-btn" @click="handleAdd" style="background-color: #1890ff;color:#ffffff;margin-left: 5px" >
            添加因子
        </a-button>
        <a-table :columns="columns" :data-source="tableData" rowKey="id" :loading="isLoading" :pagination=false :scroll="{  y: 323 }"
                 bordered>
            <template
                    v-for="col in ['name', 'code', 'avg','max','min','cou','zavg','zmax','zmin','flag']"
                    :slot="col"
                    slot-scope="text, record"
            >
                <div :key="col">
                    <a-input
                            v-if="record.editable && col!='flag'"
                            style="margin: -5px 0"
                            :value="text"
                            @change="e => handleChange(e.target.value, record.id, col)"
                    />

                    <a-select v-else-if="record.editable && col=='flag'" :value="text" style="width: 100%" @change="e => handleChange(e, record.id, col)">
                        <a-select-option value="N">
                            N
                        </a-select-option>
                        <a-select-option value="F">
                            F
                        </a-select-option>
                        <a-select-option value="M">
                            M
                        </a-select-option>
                        <a-select-option value="S">
                            S
                        </a-select-option>
                        <a-select-option value="D">
                            D
                        </a-select-option>
                        <a-select-option value="C">
                            C
                        </a-select-option>
                        <a-select-option value="T">
                            T
                        </a-select-option>
                        <a-select-option value="B">
                            B
                        </a-select-option>
                    </a-select>

                    <template v-else>
                        {{ text }}
                    </template>
                </div>
            </template>
            <template slot="operation" slot-scope="text, record">
                <div class="editable-row-operations">
        <span v-if="record.editable">
          <a @click="() => save(record.id)">保存</a>
          <a-popconfirm title="确定取消?" cancelText="取消" okText="确认" @confirm="() => cancel(record.id)">
            <a>取消</a>
          </a-popconfirm>
        </span>
                    <span v-else>
          <a :disabled="editingKey !== ''" @click="() => edit(record.id)">编辑</a>
        </span>
                    <a-popconfirm
                            v-if="tableData.length"
                            title="确定要删除?"
                            @confirm="() => onDelete(record.id)"
                            cancelText="取消" okText="确认"
                    >
                        <a href="javascript:;">删除</a>
                    </a-popconfirm>

                </div>
            </template>
        </a-table>
    </div>
</template>
<script>
    const columns = [
        {
            title: '名称',
            dataIndex: 'name',
            width: '9%',
            scopedSlots: {customRender: 'name'},
        },
        {
            title: '编码',
            dataIndex: 'code',
            width: '9%',
            scopedSlots: {customRender: 'code'},
        },
        {
            title: 'Avg',
            dataIndex: 'avg',
            width: '9%',
            scopedSlots: {customRender: 'avg'},
        },
        {
            title: 'Max',
            dataIndex: 'max',
            width: '9%',
            scopedSlots: {customRender: 'max'},
        },
        {
            title: 'Min',
            dataIndex: 'min',
            width: '9%',
            scopedSlots: {customRender: 'min'},
        },
        {
            title: 'Cou',
            dataIndex: 'cou',
            width: '9%',
            scopedSlots: {customRender: 'cou'},
        },
        {
            title: 'Zavg',
            dataIndex: 'zavg',
            width: '9%',
            scopedSlots: {customRender: 'zavg'},
        },
        {
            title: 'Zmax',
            dataIndex: 'zmax',
            width: '9%',
            scopedSlots: {customRender: 'zmax'},
        },
        {
            title: 'Zmin',
            dataIndex: 'zmin',
            width: '9%',
            scopedSlots: {customRender: 'zmin'},
        },
        {
            title: 'Flag',
            dataIndex: 'flag',
            width: '9%',
            scopedSlots: {customRender: 'flag'},
        },
        {
            title: '操作',
            dataIndex: 'operation',
            scopedSlots: {customRender: 'operation'},
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
                cacheData: [],
                tableData: [],
                columns,
                editingKey: '',
            };
        },
        mounted() {
            this.scanData();
        },
        methods: {
            handleAdd() {
                let data = {
                    id: "",
                    deviceId: "",
                    name: "",
                    code: "",
                    avg: "",
                    max: "0",
                    min: "0",
                    cou: "0",
                    zavg: "0",
                    zmax: "0",
                    zmin: "0",
                    flag: "N",
                }
                this.tableData.push(data),
                    this.edit("")
            },
            onDelete(key) {
                this.isLoading = true
                const dataSource = [...this.tableData];
                const deleteData = dataSource.filter(item => item.id === key);
                if (deleteData[0].id != '') {
                    this.$axios.delete(this.$base.api + "/counDivisor/deleteById", {params: {id: deleteData[0].id}})
                        .then(response => {
                            if (response.data.state == "0") {
                                this.tableData = dataSource.filter(item => item.id !== key),
                                    this.cacheData = this.tableData.map(item => ({...item})),
                                    this.isLoading = false
                            }
                        })
                        .catch(function (error) { // 请求失败处理
                            console.log(error);
                        });
                } else {
                    this.tableData = dataSource.filter(item => item.id !== key),
                        this.cacheData = this.tableData.map(item => ({...item}))
                    this.isLoading = false
                }
            },
            scanData() {
                this.isLoading = true;
                let data = {
                    deviceId: parseInt(this.$route.params.id),
                }
                this.$axios.get(this.$base.api + "/counDivisor/getListByDeviceId", {params: data})
                    .then(response => {
                        if (response.data.state == 0) {
                            // if(){
                            this.tableData = response.data.data,
                                this.cacheData = this.tableData.map(item => ({...item})),
                            // }
                            this.isLoading = false
                        }
                    })
                    .catch(function (error) { // 请求失败处理
                        console.log(error);
                    });
            },
            handleChange(value, key, column) {
                const newData = [...this.tableData];
                const target = newData.filter(item => key === item.id)[0];
                if (target) {
                    target[column] = value;
                    this.tableData = newData;
                }
            },
            edit(key) {
                const newData = [...this.tableData];
                const target = newData.filter(item => key === item.id)[0];
                this.editingKey = key;
                if (target) {
                    target.editable = true;
                    this.tableData = newData;
                }
            },
            save(key) {
                const newData = [...this.tableData];
                const newCacheData = [...this.tableData];
                const target = newData.filter(item => key === item.id)[0];
                const targetCache = newCacheData.filter(item => key === item.id)[0];
                if (target && targetCache) {
                    let data = {
                        id: target.id,
                        deviceId: parseInt(this.$route.params.id),
                        name: target.name.trim(),
                        code: target.code.trim(),
                        avg: target.avg,
                        max: target.max,
                        min: target.min,
                        cou: target.cou,
                        zavg: target.zavg,
                        zmax: target.zmax,
                        zmin: target.zmin,
                        flag: target.flag,
                    }

                    let vm = this
                    if (data.id != '') {
                        this.$axios.post(this.$base.api + '/counDivisor/update', data)
                            .then(function () {
                                vm.$message.success("编辑成功")
                                delete target.editable;
                                vm.tableData = newData;
                                Object.assign(targetCache, target);
                                vm.cacheData = newCacheData;
                                vm.scanData()
                            })
                            .catch(function (error) {
                                vm.$message.error("编辑失败" + error)
                            });
                    } else {
                        if (data.code == '' || data.avg == ''||data.zavg==''||data.flag=='') {
                            this.$message.warn("兄die，除code、avg、zavg、flag外，其余都是必填")
                        } else {
                            this.$axios.post(this.$base.api + '/counDivisor/add', data)
                                .then(function () {
                                    vm.$message.success("保存成功")
                                    delete target.editable;
                                    vm.tableData = newData;
                                    Object.assign(targetCache, target);
                                    vm.cacheData = newCacheData;
                                    vm.scanData()
                                })
                                .catch(function (error) {
                                    vm.$message.error("保存失败" + error)
                                });
                        }

                    }
                }
                this.editingKey = '';
            },
            cancel(key) {
                const newData = [...this.tableData];
                const target = newData.filter(item => key === item.id)[0];
                this.editingKey = '';
                if (target) {
                    if (target.id != '') {
                        Object.assign(target, this.cacheData.filter(item => key === item.id)[0]);
                        delete target.editable;
                        this.tableData = newData;
                    } else {
                        this.tableData= this.cacheData.filter(item => key !== item.id)
                    }

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
