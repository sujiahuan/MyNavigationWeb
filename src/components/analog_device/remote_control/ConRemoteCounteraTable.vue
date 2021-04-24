<template>
    <div :style="{ background: '#fff', padding: '0px', margin: 0, minHeight:$globalConstant.curHeight- 180+'px' }">
        <a-row>
            <a-col :span="12">

            </a-col>
            <a-col :span="12" align="right">
                <span style="font-weight: bold;font-size: 15px">连接状态：</span>
                <a-tooltip title="断开连接" v-if="socketConnetionStatus">
                    <template slot="title">
                        prompt text
                    </template>
                    <a-button @click="openOrColseSocketConnetion(false)" style="margin-left: 5px;background-color:#00DB00;color: #4F4F4F" type="primary"
                              :loading="socketConnetionStatusLoading">
                        已连接
                    </a-button>
                </a-tooltip>
                <a-tooltip v-else title="进行连接">
                    <a-button @click="openOrColseSocketConnetion(true)"
                              style="argin-left: 5px;background-color: #555555;border-color: #555555" type="danger"
                              :loading="socketConnetionStatusLoading">
                        已断开
                    </a-button>
                </a-tooltip>
                <a-button @click="getSocketConnetionStatus" style="margin: 0px 20px 0px 5px;background-color: #FFDAC8" type="dashed"
                          :loading="socketConnetionStatusLoading">
                    刷新
                </a-button>
            </a-col>
        </a-row>
        <a-table :columns="columns" :data-source="tableData" rowKey="id" :loading="isLoading" :pagination=false
                 bordered>
            <template
                    slot="connetionStatus"
                    slot-scope="text"
            >
                <div key="connetionStatus">
                    <template v-if="text==false" >
                        <a-tag color="#555555" >
                        已关闭
                        </a-tag>
                    </template>
                    <template v-else-if="text==true">
                        <a-tag color="#108ee9">
                        已连接
                        </a-tag>
                    </template>
                </div>
            </template>

            <template
                    slot="verifyPlatformCommand"
                    slot-scope="text, record"
            >
                <div key="verifyPlatformCommand">
                    <a-select v-if="record.editable" :value="text" style="width: 100%" @change="e => handleChange(e, record.id, 'verifyPlatformCommand')">
                        <a-select-option :value="1">
                            校验
                        </a-select-option>
                        <a-select-option :value="0">
                            不校验
                        </a-select-option>
                    </a-select>

                    <template v-else>
                        {{text==1?'校验':'不校验'}}
                    </template>
                </div>
            </template>

            <template
                    slot="verifyCn"
                    slot-scope="text, record"
            >
                <div key="verifyCn">
                    <a-input
                            v-if="record.editable"
                            style="margin: -5px 0;width: 60%"
                            :value="text"
                            placeholder="不输则不校验CN号"
                            @change="e => handleChange(e.target.value, record.id, 'verifyCn')"
                    />

                    <template v-else>
                        {{(text==""||text==null)?"不校验":text}}
                    </template>
                </div>
            </template>

            <template
                    slot="responseParameter"
                    slot-scope="text, record"
            >
                <div key="responseParameter">
                    <a-select v-if="record.editable" :value="text" style="width: 100%" @change="e => handleChange(e, record.id, 'responseParameter')">
                        <a-select-option :value="9011">
                            9011
                        </a-select-option>
                        <a-select-option :value="9012">
                            9012
                        </a-select-option>
                    </a-select>

                    <template v-else>
                       {{text}}
                    </template>
                </div>
            </template>

            <template
                    slot="responseStatus"
                    slot-scope="text, record"
            >
                <div key="responseStatus">
                    <a-input
                            v-if="record.editable"
                            style="margin: -5px 0;width: 60%"
                            :value="text"
                            placeholder="输入返回状态"
                            @change="e => handleChange(e.target.value, record.id, 'responseStatus')"
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
          <a :disabled="record.editable " @click="() => edit(record.id)">编辑</a>
        </span>
                    <a @click="openRemoteConnection(record)" v-if="record.connetionStatus==0&&!record.editable">开启</a>
                    <a @click="colseRemoteConnection(record)" v-if="record.connetionStatus==1&&!record.editable">关闭</a>
                </div>
            </template>
        </a-table>
    </div>
</template>
<script>
    const columns = [
        {
            title: '当前状态',
            dataIndex: 'connetionStatus',
            width: '16%',
            scopedSlots: {customRender: 'connetionStatus'},
        },
        {
            title: '校验平台命令',
            dataIndex: 'verifyPlatformCommand',
            width: '16%',
            scopedSlots: {customRender: 'verifyPlatformCommand'},
        },
        {
            title: '校验CN',
            dataIndex: 'verifyCn',
            width: '16%',
            scopedSlots: {customRender: 'verifyCn'},
        },
        {
            title: '返回命令',
            dataIndex: 'responseParameter',
            width: '16%',
            scopedSlots: {customRender: 'responseParameter'},
        },
        {
            title: '返回状态',
            dataIndex: 'responseStatus',
            width: '16%',
            scopedSlots: {customRender: 'responseStatus'},
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
                socketConnetionStatusLoading:false,
                socketConnetionStatus:false,
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
            };
        },
        watch:{
            '$route.path':function () {
                if(this.$route.path.indexOf('controlDevice')!=-1){
                    let controlDeviceSelectTabKey=sessionStorage.getItem("controlDeviceSelectTabKey");
                    if(controlDeviceSelectTabKey=="4"){
                        this.init()
                    }
                }
            },
        },
        methods: {
            init(){
                this.getSocketConnetionStatus();
                this.scanData()
            },
            openOrColseSocketConnetion(isOpen) {
                this.socketConnetionStatusLoading = true
                let data = {
                    deviceId: parseInt(this.$route.params.id),
                    isOpen: isOpen
                }
                this.$axios.get(this.$base.api + "/counCountercharge/openOrColseSocketConnection", {params: data})
                    .then(response => {
                        if (response.data.state == 0) {
                            this.getSocketConnetionStatus()
                            if(!isOpen){
                                this.scanData()
                            }
                        } else {
                            this.$message.warn(response.data.msg)
                            this.socketConnetionStatusLoading = false
                        }

                    })
                    .catch(function () { // 请求失败处理
                        this.socketConnetionStatusLoading = false
                    });
            },
            getSocketConnetionStatus() {
                // this.socketConnetionStatusLoading = true
                let data = {
                    deviceId: parseInt(this.$route.params.id),
                }
                this.$axios.get(this.$base.api + "/counCountercharge/getSocketConnectionStatus", {params: data})
                    .then(response => {
                        if (response.data.state == 0) {
                            this.socketConnetionStatus = response.data.data
                            this.scanData()
                        } else {
                            this.$message.warn(response.data.msg)
                        }
                        this.socketConnetionStatusLoading = false
                    })
                    .catch(function () { // 请求失败处理
                        this.socketConnetionStatusLoading = false
                    });
            },
            openRemoteConnection(record){
                this.isLoading=true
                let data={
                    deviceId:record.deviceId
                }
                let vue=this
                this.$axios.get(this.$base.api + "/counCountercharge/openConnectionByDeviceId", {params:data})
                    .then(response => {
                        if (response.data.state == "0") {
                            vue.$message.success("开启成功")
                            this.isLoading=false
                            vue.scanData()
                        }else{
                            vue.$message.warn("开启失败:"+response.data.msg)
                            this.isLoading=false
                            vue.getSocketConnetionStatus();
                        }
                    })
                    .catch(function (error) { // 请求失败处理
                        vue.$message.error("开启失败:"+error)
                        this.isLoading=false
                    });
            },
            colseRemoteConnection(record){
                let data={
                    deviceId:record.deviceId
                }
                let vue=this
                this.$axios.get(this.$base.api + "/counCountercharge/colseConnectionByDeviceId", {params:data})
                    .then(response => {
                        if (response.data.state == "0") {
                            vue.$message.success("关闭成功")
                            vue.scanData()
                        }else{
                            vue.$message.warn("关闭失败:"+response.data.msg)
                        }
                    })
                    .catch(function (error) { // 请求失败处理
                        vue.$message.error("关闭失败:"+error)
                    });
            },
            // handleAdd() {
            //     let data = {
            //         id: "",
            //         deviceId: "",
            //         dataType: 1,
            //         isTiming: "0",
            //         zs: "none",
            //         dateInterval:Number,
            //     }
            //     this.tableData.push(data),
            //         this.edit("")
            // },
            onDelete(key) {
                this.isLoading = true
                const dataSource = [...this.tableData];
                const deleteData = dataSource.filter(item => item.id === key);
                console.info(deleteData[0].editable)
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
                this.$axios.get(this.$base.api + "/counCountercharge/getOneByDeviceId", {params: data})
                    .then(response => {
                        if (response.data.state == 0) {
                            this.tableData = [response.data.data],
                                this.cacheData = this.tableData.map(item => ({...item})),
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
                // this.editingKey = key;
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
                        verifyPlatformCommand:target.verifyPlatformCommand,
                        connetionStatus: target.connetionStatus,
                        verifyCn: target.verifyCn,
                        responseParameter: target.responseParameter,
                        responseStatus:parseInt(target.responseStatus),
                    }

                    let vm = this
                    if (data.id != '') {
                        this.$axios.post(this.$base.api + '/counCountercharge/update', data)
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
                        if (data.verifyPlatformCommand == '' || data.responseStatus == '') {
                            this.$message.warn("兄die，想啥呢？这些都是必填呢！")
                        } else {
                            this.$message.error("兄die，这是bug！你咋弄出来的？")
                        }

                    }
                }
            },
            cancel(key) {
                const newData = [...this.tableData];
                const target = newData.filter(item => key === item.id)[0];
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
