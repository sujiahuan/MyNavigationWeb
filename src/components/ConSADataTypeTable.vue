<template>
    <div>
        <a-table :columns="columns" :data-source="tableData" rowKey="id" :loading="isLoading" :pagination=false
                 bordered>
            <template
                    slot="dataType"
                    slot-scope="text"
            >
                <div key="dataType">
                    <template v-if="text=='1'">
                        实时数据
                    </template>
                    <template v-else-if="text=='2'">
                        分钟数据
                    </template>
                    <template v-else-if="text=='3'">
                        小时数据
                    </template>
                    <template v-if="text=='4'">
                        日数据
                    </template>
                </div>
            </template>

            <template
                    slot="zs"
                    slot-scope="text, record"
            >
                <div key="zs">
                    <a-select v-if="record.editable" :value="text" style="width: 100%" @change="e => handleChange(e, record.id, 'zs')">
                        <a-select-option value="none">
                            没有
                        </a-select-option>
                        <a-select-option value="join">
                            合
                        </a-select-option>
                        <a-select-option value="divide">
                            分
                        </a-select-option>
                    </a-select>

                    <template v-else>
                        <template v-if="text=='divide'">
                            分
                        </template>
                        <template v-else-if="text=='join'">
                            合
                        </template>
                        <template v-if="text=='none'">
                            没有
                        </template>
                    </template>
                </div>
            </template>

<!--            <template-->
<!--                    slot="isTiming"-->
<!--                    slot-scope="text, record"-->
<!--            >-->
<!--                <div key="isTiming">-->
<!--                    <a-select v-if="record.editable" :value="text" style="width: 100%" @change="e => handleChange(e, record.id, 'isTiming')">-->
<!--                        <a-select-option :value="0">-->
<!--                            否-->
<!--                        </a-select-option>-->
<!--                        <a-select-option :value="1">-->
<!--                            是-->
<!--                        </a-select-option>-->
<!--                    </a-select>-->

<!--                    <template v-else>-->
<!--                        <template v-if="text=='0'">-->
<!--                            否-->
<!--                        </template>-->
<!--                        <template v-if="text=='1'">-->
<!--                            是-->
<!--                        </template>-->
<!--                    </template>-->
<!--                </div>-->
<!--            </template>-->

            <template
                    slot="dateInterval"
                    slot-scope="text, record"
            >
                <div key="dateInterval">
                    <a-input
                            v-if="record.editable"
                            style="margin: -5px 0;width: 60%"
                            :value="text"
                            @change="e => handleChange(e.target.value, record.id, 'dateInterval')"
                    />

                    <template v-else>
                        {{text}}
                    </template>
                    <template v-if="record.dataType==1">
                        秒
                    </template>
                    <template v-if="record.dataType==2">
                        分
                    </template>
                    <template v-if="record.dataType==3">
                        小时
                    </template>
                    <template v-if="record.dataType==4">
                        日
                    </template>
                </div>
            </template>

            <template
                    slot="startTime"
                    slot-scope="text, record"
            >
                <div key="startTime">
<!--                    <a-input-->
<!--                            :value="text"-->
<!--                            @change="e => handleChange(e.target.value, record.id, 'startTime')"-->
<!--                            :disabled="record.isTiming==0"-->
<!--                    />-->
                    <a-date-picker
                            v-if="record.editable"
                            style="margin: -5px 0;width: 60%"
                            :disabled-date="disabledStartDate"
                            show-time
                            :value="text"
                            value-format="YYYY-MM-DD HH:mm:ss"
                            placeholder="Start"
                            @openChange="handleStartOpenChange"
                            @change="e => handleChange(e, record.id, 'startTime')"
                    />

                    <template v-else>
                        {{text}}
                    </template>
                </div>
            </template>


            <template
                    slot="endTime"
                    slot-scope="text, record"
            >
                <div key="endTime">
<!--                    <a-input-->
<!--                            :value="text"-->
<!--                            :disabled="record.isTiming==0"-->
<!--                    />-->
                    <a-date-picker
                            v-if="record.editable"
                            style="margin: -5px 0;width: 60%"
                            :disabled-date="disabledEndDate"
                            :value="text"
                            show-time
                            value-format="YYYY-MM-DD HH:mm:ss"
                            placeholder="End"
                            :open="endOpen"
                            @openChange="handleEndOpenChange"
                            @change="e => handleChange(e, record.id, 'endTime')"
                    />

                    <template v-else>
                        {{text}}
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
<!--                    <a-popconfirm-->
<!--                            v-if="tableData.length"-->
<!--                            title="Sure to delete?"-->
<!--                            @confirm="() => onDelete(record.id)"-->
<!--                    >-->
<!--                        <a href="javascript:;">删除</a>-->
<!--                    </a-popconfirm>-->
                    <a @click="sendMesssage(record)">发送</a>

                </div>
            </template>
        </a-table>
    </div>
</template>
<script>
    const columns = [
        {
            title: '名称',
            dataIndex: 'dataType',
            width: '15%',
            scopedSlots: {customRender: 'dataType'},
        },
        // {
        //     title: '定时',
        //     dataIndex: 'isTiming',
        //     width: '14%',
        //     scopedSlots: {customRender: 'isTiming'},
        // },
        {
            title: '折算',
            dataIndex: 'zs',
            width: '15%',
            scopedSlots: {customRender: 'zs'},
        },
        {
            title: '开始时间',
            dataIndex: 'startTime',
            width: '15%',
            scopedSlots: {customRender: 'startTime'},
        },
        {
            title: '结束时间',
            dataIndex: 'endTime',
            width: '15%',
            scopedSlots: {customRender: 'endTime'},
        },
        {
            title: '补发间隔',
            dataIndex: 'dateInterval',
            width: '17%',
            scopedSlots: {customRender: 'dateInterval'},
        },
        {
            title: '操作',
            dataIndex: 'operation',
            scopedSlots: {customRender: 'operation'},
        },
    ];

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
                endOpen: false,
            };
        },
        // mounted() {
        //     this.scanData();
        // },
        methods: {
            sendMesssage(record){
                this.isLoading=true
                let data={
                    deviceId:record.deviceId,
                    dataType:record.dataType
                }
                let vue=this
                this.$axios.get(this.$base.api + "/counDataType/sendSupplyAgain", {params:data})
                    .then(response => {
                        if (response.data.state == "0") {
                            vue.$message.success("发送成功")
                        }else{
                            vue.$message.error("发送失败:"+response.data.msg)
                        }
                    })
                    .catch(function (error) { // 请求失败处理
                        vue.$message.error("发送失败:"+error)
                    });
                this.isLoading=false
            },
            handleAdd() {
                let data = {
                    id: "",
                    deviceId: "",
                    dataType: 1,
                    isTiming: "0",
                    zs: "none",
                    dateInterval:Number,
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
                this.$axios.get(this.$base.api + "/counDataType/getListByDeviceId", {params: data})
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
                let regex;
                if (target) {
                    if("endTime"==column||"startTime"==column){
                        switch (target.dataType) {
                            case 2:
                                regex=/(\d{2}:\d{2}:)\d{2}/g;
                                value=value.replace(regex,"$100");
                                break;
                            case 3:
                                regex=/(\d{2}:)\d{2}:\d{2}/g;
                                value=value.replace(regex,"$100:00");
                                break;
                            case 4:
                                regex=/(\d{2}:\d{2}:)\d{2}/g;
                                value=value.replace(regex,"00:00:00");
                                break;
                        }
                    }
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
                        dataType: target.dataType,
                        isTiming: target.isTiming,
                        zs: target.zs,
                        dateInterval:parseInt(target.dateInterval),
                        startTime:target.startTime,
                        endTime:target.endTime,
                    }
                    let vm = this
                    if (data.id != '') {
                        this.$axios.post(this.$base.api + '/counDataType/update', data)
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
                        if (data.startTime == ''||data.endTime == '' ||data.dateInterval == ''|| data.zs == '') {
                            this.$message.warn("兄die，想啥呢？这些都是必填呢！")
                        } else {
                            this.$message.error("兄die，这是bug！你咋弄出来的？")
                            // this.$axios.post(this.$base.api + '/counDivisor/add', data)
                            //     .then(function () {
                            //         vm.$message.success("保存成功")
                            //         delete target.editable;
                            //         vm.tableData = newData;
                            //         Object.assign(targetCache, target);
                            //         vm.cacheData = newCacheData;
                            //         vm.scanData()
                            //     })
                            //     .catch(function (error) {
                            //         vm.$message.error("保存失败" + error)
                            //     });
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

            disabledStartDate(startValue) {
                const endValue = this.endValue;
                if (!startValue || !endValue) {
                    return false;
                }
                return startValue.valueOf() > endValue.valueOf();
            },
            disabledEndDate(endValue) {
                const startValue = this.startValue;
                if (!endValue || !startValue) {
                    return false;
                }
                return startValue.valueOf() >= endValue.valueOf();
            },
            handleStartOpenChange(open) {
                if (!open) {
                    this.endOpen = true;
                }
            },
            handleEndOpenChange(open) {
                this.endOpen = open;
            },

        },
    };
</script>
<style scoped>
    .editable-row-operations a {
        margin-right: 8px;
    }
</style>
