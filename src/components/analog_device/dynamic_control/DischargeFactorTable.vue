<template>
    <div>
        <a-row>
            <a-col :span="12">
                <a-button class="editable-add-btn" @click="switchEdit" style="margin-left: 5px;background-color: #2828FF" type="primary"
                          v-if="!enableEdit">
                    编辑
                </a-button>
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
                              style="argin-left:5px;background-color: #555555;border-color: #555555" type="danger"
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
        <a-row>
            <a-col :span="8" style="padding: 10px">
                <a-button class="editable-add-btn" @click="handleAdd" style="margin-left: 5px;background-color: #2828FF" type="primary"
                          v-if="enableEdit">
                    添加因子
                </a-button>
            </a-col>
            <a-col :span="8" style="padding: 10px">
                <a-select
                        id="monitorFactors"
                        v-if="enableEdit"
                        show-search
                        option-filter-prop="children"
                        :value="selectMonitorFactorsText"
                        style="width: 100%;"
                        @blur="selectBlur(1)"
                        @search="e => selectSearch(1,e)"
                        @focus="selectFocus(1,selectMonitorFactorsText)"
                        @popupScroll="e=>selectPopupScroll(1,e,selectMonitorFactorsText)"
                        @change="e => handleMonitorFactorChange(e)">

                    <a-select-option v-for="factor in monitorFactors" :value='factor.id' :key="factor.id">
                        {{factor.name}} / {{factor.code}}
                    </a-select-option>
                </a-select>
                <div v-else style="height: 32px">
                    <template  v-for="factor in monitorFactors">
                        <div v-if="factor.id==selectMonitorFactorsText" :key="factor.id"
                             style="text-align: center;color: red">
                            {{factor.name}}/{{factor.code}}
                        </div>
                    </template>
                </div>

            </a-col>
        </a-row>
        <a-table :columns="columns" :data-source="tableData" rowKey="id" :loading="isLoading" :pagination=false
                 :scroll="{  y: $globalConstant.curHeight*0.47 }"
                 bordered>
            <template
                    v-for="col in [ 'divisorId', 'valueMax','valueMin','type']"
                    :slot="col"
                    slot-scope="text, record"
            >

                <div :key="col">
                    <a-select
                            v-if="enableEdit && col=='divisorId'"
                            show-search
                            option-filter-prop="children"
                            :autoFocus="true"
                            :value="text"
                            style="width: 100%"
                            @blur="selectBlur(2)"
                            @search="e => selectSearch(2,e)"
                            @popupScroll="e=>selectPopupScroll(2,e,text)"
                            @focus="selectFocus(2,text)"
                            @change="e => handleChange(e, record.id, col)">

                        <a-select-option v-for="factor in dynamicFactors" :value='factor.id' :key="factor.id">
                            {{factor.name}} / {{factor.code}}
                        </a-select-option>

                    </a-select>

                    <a-select
                            v-else-if="enableEdit && col=='type'"
                            :value="text"
                            style="width: 100%"
                            @change="e => handleChange(e, record.id, col)">
                        <a-select-option :value='1'>
                            状态
                        </a-select-option>
                        <a-select-option :value='2'>
                            参数
                        </a-select-option>
                    </a-select>

                    <a-input-number
                            v-else-if="enableEdit"
                            style="width: 100%"
                            :value="text"
                            :precision=4
                            @blur="e => numberBlur(e, record.id,col)"
                            @change="e => handleChange(e, record.id, col)"
                    />

                    <template v-else-if=" col=='divisorId'" v-for="factor in dynamicFactors">
                        <template v-if="factor.id==record.divisorId">
                            {{factor.name}} / {{factor.code}}
                        </template>
                    </template>

                    <template v-else-if=" col=='type'">
                        {{text==1?"状态":"参数"}}
                    </template>

                    <template v-else>
                        {{ text }}
                    </template>
                </div>
            </template>
            <template slot="operation" slot-scope="text, record">
                <div class="editable-row-operations">
        <span v-if="record.editable">
            <a @click="() => cancel(record.id)" style="color: red">取消</a>
        </span>
                    <!--                    <span v-else>-->
                    <!--          <a :disabled="record.editable||enableEdit" @click="() => edit(record.id)">编辑</a>-->
                    <!--        </span>-->
                    <a-popconfirm
                            v-if="tableData.length"
                            title="确定要删除?"
                            @confirm="() => onDelete(record.id)"
                            cancelText="取消" okText="确认"
                    >
                        <a href="javascript:;" v-if="!record.editable" style="color: red">删除</a>
                    </a-popconfirm>

                </div>
            </template>
        </a-table>
        <a-row>
            <a-col :span="24" align="right" style="padding-right: 20px">
                <a-button class="editable-add-btn" @click="save()" type="primary" style="background-color: #2828FF"
                          v-if="enableEdit">
                    保存
                </a-button>
                <a-button class="editable-add-btn" @click="switchEdit()" style="margin-left: 10px;background-color: red" type="primary"
                          v-if="enableEdit">
                    取消
                </a-button>
                <a-button class="editable-add-btn" @click="sendMessage(5)" type="primary"
                          :loading="isLoading" v-if="!enableEdit">
                    发送状态
                </a-button>
                <a-button class="editable-add-btn" @click="sendMessage(6)" style="margin-left: 10px" type="primary"
                          :loading="isLoading" v-if="!enableEdit">
                    发送参数
                </a-button>
            </a-col>
        </a-row>
    </div>
</template>
<script>
    const columns = [
        {
            align: 'center',
            title: '因子',
            dataIndex: 'divisorId',
            width: '23%',
            scopedSlots: {customRender: 'divisorId'},
        },
        {
            title: '值',
            children: [
                {
                    align: 'center',
                    title: '最小值',
                    dataIndex: 'valueMin',
                    scopedSlots: {customRender: 'valueMin'},
                },
                {
                    align: 'center',
                    title: '最大值',
                    dataIndex: 'valueMax',
                    scopedSlots: {customRender: 'valueMax'},
                },
            ],
        },
        {
            align: 'center',
            title: '类型',
            dataIndex: 'type',
            width: '20%',
            scopedSlots: {customRender: 'type'},
        },
        {
            align: 'center',
            title: '操作',
            dataIndex: 'operation',
            scopedSlots: {customRender: 'operation'},
        },
    ];

    export default {
        data() {
            return {
                isLoading: false,
                socketConnetionStatusLoading: false,
                monitorFactors: [],
                dynamicFactors: [],
                cacheMonitorFactors: [],
                cacheDynamicFactors: [],
                scrollPage: 1,
                enableEdit: false,
                socketConnetionStatus: false,
                tableData: [],
                selectMonitorFactorsText: "",
                columns,
            };
        },
        mounted() {
            // this.scanData();
            // this.getCode();
        },
        methods: {
            sendMessage(dataType) {
                this.isLoading = true;
                let data = {
                    deviceId: parseInt(this.$route.params.id),
                    dataType: dataType
                }
                this.$axios.get(this.$base.api + "/counDataType/sendParam3020", {params: data})
                    .then(response => {
                        if (response.data.state == 0) {
                            this.getSocketConnetionStatus()
                            this.isLoading = false;
                            this.$message.success("发送成功")
                        } else {
                            this.isLoading = false;
                            this.$message.warn("发送失败：" + response.data.msg);
                        }
                    })
                    .catch(function (error) { // 请求失败处理
                        this.isLoading = false;
                        this.$message.error("发送失败：" + error)
                    });
            },
            numberBlur(e, key, column) {
                if (column == "valueMax" || column == "valueMin") {
                    const newData = [...this.tableData];
                    const target = newData.filter(item => key === item.id)[0];
                    if (target.valueMax == null && column == "valueMin" || target.valueMin == null && column == "valueMax") {
                        target.valueMin, target.valueMax = e.target.ariaValueNow;
                        this.tableData = newData;
                    }
                }
            },
            /**
             * 文本框值变化时回调
             * @param index 污染因子还是动态因子
             * @param value 变化值
             */
            selectSearch(index, value) {
                console.log("文本框变化")
                switch (index) {
                    case 1:
                        if ("" != value) {
                            this.monitorFactors = this.cacheMonitorFactors.filter(item => item.name.indexOf(value) != -1 || item.code.indexOf(value) != -1)
                        } else {
                            this.monitorFactors = this.cacheMonitorFactors.slice(0, 10);
                        }
                        break;
                    case 2:
                        if ("" != value) {
                            this.dynamicFactors = this.cacheDynamicFactors.filter(item => item.name.indexOf(value) != -1 || item.code.indexOf(value) != -1)
                        } else {
                            this.dynamicFactors = this.cacheDynamicFactors.slice(0, 10);
                        }
                        break;
                }

            },
            /**
             * 失去焦点
             * @param index 污染因子还是动态因子
             */
            selectBlur(index) {
                console.log("失去焦点")
                switch (index) {
                    case 1:
                        this.monitorFactors = this.cacheMonitorFactors.slice(0, 10);
                        break;
                    case 2:
                        this.dynamicFactors = this.cacheDynamicFactors.slice(0, 10);
                        break
                }
            },
            /**
             * 获取到焦点
             * @param index 污染因子还是动态因子
             * @param text 当前选中的内容
             */
            selectFocus(index, text) {
                console.log("获取焦点")
                if (text == "") {
                    return;
                }
                //处理选中的因子
                switch (index) {
                    case 1:
                        if (!this.monitorFactors.some(item => item.id == text)) {
                            this.monitorFactors.unshift(this.cacheMonitorFactors.filter(item => item.id == text)[0])
                        }
                        break;
                    case 2:
                        if (!this.dynamicFactors.some(item => item.id == text)) {
                            this.dynamicFactors.unshift(this.cacheDynamicFactors.filter(item => item.id == text)[0])
                        }
                        break
                }


            },
            /**
             * 滚动逻辑
             * @param index 污染因子还是动态因子
             * @param e 滚动对象
             * @param text 当前选中的内容
             */
            selectPopupScroll(index, e, text) {
                console.log("滚动")
                const {target} = e
                const scrollHeight = target.scrollHeight - target.scrollTop
                const clientHeight = target.clientHeight
                if (scrollHeight === 0 && clientHeight === 0) {
                    this.scrollPage = 1
                } else {
                    if (scrollHeight < clientHeight + 5) {
                        this.scrollPage++;
                        let newFactors;
                        let deleteIndex;

                        switch (index) {
                            case 1:
                                console.log("进来啦")
                                newFactors = this.cacheMonitorFactors.slice(this.scrollPage * 10 - 9, this.scrollPage * 10);
                                deleteIndex = newFactors.findIndex(item => item.id == text)
                                if (deleteIndex != -1) {
                                    //找到重复的,要删除
                                    newFactors.splice(deleteIndex, 1)
                                }
                                this.monitorFactors = this.monitorFactors.concat(newFactors)
                                break;
                            case 2:
                                newFactors = this.cacheDynamicFactors.slice(this.scrollPage * 10 - 9, this.scrollPage * 10);
                                deleteIndex = newFactors.findIndex(item => item.id == text)
                                if (deleteIndex != -1) {
                                    //找到重复的,要删除
                                    newFactors.splice(deleteIndex, 1)
                                }
                                this.dynamicFactors = this.dynamicFactors.concat(newFactors)
                                break;
                        }
                    }
                }
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
                        } else {
                            this.$message.warn(response.data.msg)
                        }
                        this.socketConnetionStatusLoading = false
                    })
                    .catch(function (error) { // 请求失败处理
                        console.log(error);
                    });
            },
            getSocketConnetionStatus() {
                this.socketConnetionStatusLoading = true
                let data = {
                    deviceId: parseInt(this.$route.params.id),
                }
                this.$axios.get(this.$base.api + "/counCountercharge/getSocketConnectionStatus", {params: data})
                    .then(response => {
                        if (response.data.state == 0) {
                            this.socketConnetionStatus = response.data.data
                        } else {
                            this.$message.warn(response.data.msg)
                        }
                        this.socketConnetionStatusLoading = false

                    })
                    .catch(function (error) { // 请求失败处理
                        console.log(error);
                    });
            },
            switchEdit() {
                if (this.enableEdit == true) {
                    this.scanData()
                    this.enableEdit = false
                } else {
                    this.enableEdit = true
                }
            },
            handleAdd() {

                this.enableEdit = true
                let randomId;
                if (this.tableData.length > 0) {
                    randomId = this.tableData[this.tableData.length - 1].id + 1;
                } else {
                    randomId = 1;
                }
                let data = {
                    id: randomId,
                    deviceId: "",
                    divisorId: "",
                    valueMax: null,
                    valueMin: null,
                    type: 1
                }
                this.tableData.push(data)
                this.edit(randomId)
            },
            getCode() {
                this.cacheMonitorFactors = JSON.parse(localStorage.getItem("cacheMonitorFactors"));
                this.monitorFactors = this.cacheMonitorFactors.filter(item => item.type == 0).slice(0, this.scrollPage * 10);

                this.cacheDynamicFactors = JSON.parse(localStorage.getItem("cacheDynamicFactors"));
                this.dynamicFactors = this.cacheDynamicFactors.filter(item => item.type == 1).slice(0, this.scrollPage * 10);
                console.log(this.dynamicFactors);
            },
            scanData() {
                this.isLoading = true;

                this.$axios.get(this.$base.api + "/dynamicDivisor/getByDeviceId", {params: {deviceId: parseInt(this.$route.params.id)}})
                    .then(response => {
                        if (response.data.state == 0) {
                            // console.log(response.data.data==null)
                            if(response.data.data!=null){
                                this.handleMonitorFactorChange(response.data.data.divisorId)
                            }else{
                                this.handleMonitorFactorChange(null)
                            }
                        }
                    })
                    .catch(function (error) { // 请求失败处理
                        console.log(error);
                    });

                let data = {
                    deviceId: parseInt(this.$route.params.id),
                    type: 0
                }
                this.$axios.get(this.$base.api + "/dynamicParameter/getList", {params: data})
                    .then(response => {
                        if (response.data.state == 0) {
                            this.tableData = response.data.data
                            this.enableEdit = false
                            this.isLoading = false
                        }
                    })
                    .catch(function (error) { // 请求失败处理
                        console.log(error);
                    });
            },
            handleMonitorFactorChange(value) {
                this.selectMonitorFactorsText = value
            },
            handleChange(value, key, column) {
                console.log("handleChange");
                const newData = [...this.tableData];
                const target = newData.filter(item => key === item.id)[0];
                if (target) {
                    target[column] = value;
                    this.tableData = newData;
                }
            },
            edit(key) {
                console.log("edit" + key);
                const newData = [...this.tableData];
                const target = newData.filter(item => key === item.id)[0];
                if (target) {
                    target.editable = true;
                    this.tableData = newData;
                }
            },
            save() {
                this.isLoading = true;
                let vm = this


                let newTable = this.tableData.filter(divisor => divisor.divisorId != "")
                let checkField = true;

                newTable.forEach(divisor => {
                    if (divisor.valueMax == null || divisor.valueMin == null) {
                        checkField = false;
                        this.$message.warn(divisor.divisorName + "/" + divisor.divisorCode + " 的最大值和最小值都是必填滴")
                        return;
                    }

                    if (divisor.valueMax < divisor.valueMin) {
                        checkField = false;
                        this.$message.warn(divisor.divisorName + "/" + divisor.divisorCode + " 的最大值不能小于最小值")
                        return;
                    }
                    if (divisor.deviceId == "") {
                        divisor.deviceId = parseInt(this.$route.params.id)
                        divisor.id = ""
                    }
                })
                if (!checkField) {
                    this.isLoading = false
                    return;
                }

                if (newTable.length == 0) {
                    this.scanData();
                    this.isLoading = false
                    return;
                } else if (this.selectMonitorFactorsText == "") {
                    this.$message.warn("请选择污染物因子")
                    return;
                }

                let data = {
                    deviceId: parseInt(this.$route.params.id),
                    divisorId: this.selectMonitorFactorsText
                }

                this.$axios.post(this.$base.api + '/dynamicDivisor/addOrUpdate', data)
                    .then(function () {
                        vm.$axios.post(vm.$base.api + '/dynamicParameter/addOrUpdate', newTable)
                            .then(function () {
                                vm.$message.success("保存成功")
                                vm.scanData()
                                vm.enableEdit = false;
                                vm.isLoading = false
                            })
                            .catch(function (error) {
                                vm.$message.error("保存失败" + error)
                                this.isLoading = false
                            });
                    })
                    .catch(function (error) {
                        vm.$message.error("保存失败" + error)
                        this.isLoading = false
                    });


            },
            cancel(key) {
                const newData = [...this.tableData];
                const target = newData.filter(item => key === item.id)[0];
                if (target) {
                    this.tableData = this.tableData.filter(item => key !== item.id)
                }
            },
            onDelete(key) {
                this.isLoading = true
                const dataSource = [...this.tableData];
                const deleteData = dataSource.filter(item => item.id === key);
                if (deleteData[0].id != '') {
                    this.$axios.delete(this.$base.api + "/dynamicParameter/deleteById", {params: {id: deleteData[0].id}})
                        .then(response => {
                            if (response.data.state == "0") {
                                this.tableData = dataSource.filter(item => item.id !== key),
                                    this.isLoading = false
                            }
                        })
                        .catch(function (error) { // 请求失败处理
                            console.log(error);
                        });
                } else {
                    this.tableData = dataSource.filter(item => item.id !== key),
                        this.isLoading = false
                }
            },
        },
    };
</script>

<style scoped>
    .editable-row-operations a {
        margin-right: 8px;
    }

    /deep/ #monitorFactors .ant-select-selection__rendered .ant-select-selection-selected-value {
                text-align: center;
                width: 100%;
                color: red;
    }
</style>
