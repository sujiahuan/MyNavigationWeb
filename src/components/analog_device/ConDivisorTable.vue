<template>
    <div>
        <a-row>
            <a-col :span="12">
                <a-button class="editable-add-btn" @click="handleAdd" style="margin-left: 5px" type="primary">
                    添加因子
                </a-button>
                <a-button class="editable-add-btn" @click="save()" style="margin-left: 20px" type="primary"
                          v-if="enableAdd">
                    保存
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
                 :scroll="{  y: $globalConstant.curHeight*0.27 }" :style="{height:$globalConstant.curHeight*0.38+'px'}"
                 bordered>

            <template
                    v-for="col in [ 'divisorId', 'avgMax','avgMin','max','min','cou','zavg','zmax','zmin','flag']"
                    :slot="col"
                    slot-scope="text, record"
            >

                <div :key="col">
                    <a-select
                            v-if="record.editable && col=='divisorId'"
                            show-search
                            option-filter-prop="children"
                            :autoFocus="true"
                            :value="text"
                            style="width: 100%"
                            @blur="selectBlur()"
                            @search="e => selectSearch(e)"
                            @popupScroll="e=>selectPopupScroll(e,text)"
                            @focus="selectFocus(text)"
                            @change="e => handleChange(e, record.id, col)">

                            <a-select-option v-for="code in monitorFactors" :value='code.id' :key="code.id">
                                {{code.name}} / {{code.code}}
                            </a-select-option>

                    </a-select>

                    <a-select
                            v-else-if="record.editable && col=='flag'"
                            :value="text"
                            style="width: 100%"
                            @change="e => handleChange(e, record.id, col)">
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

                    <a-input-number
                            v-else-if="record.editable"
                            style="margin: -5px 0"
                            :value="text"
                            :precision=4
                            @blur="e => numberBlur(e, record.id,col)"
                            @change="e => handleChange(e, record.id, col)"
                    />

                    <template v-else-if=" col=='divisorId'" v-for="code in filterMonitorFactors">
                        <template v-if="code.id==record.divisorId">
                            {{code.name}} / {{code.code}}
                        </template>
                    </template>

                    <template v-else>
                        {{ text }}
                    </template>
                </div>
            </template>
            <template slot="operation" slot-scope="text, record">
                <div class="editable-row-operations">
        <span v-if="record.editable">
          <a @click="() => save(record.id)" v-if="record.gmtCreate!=null">保存</a>
            <a @click="() => cancel(record.id)">取消</a>
        </span>
                    <span v-else>
          <a :disabled="record.editable||enableAdd" @click="() => edit(record.id)">编辑</a>
        </span>
                    <a-popconfirm
                            v-if="tableData.length"
                            title="确定要删除?"
                            @confirm="() => onDelete(record.id)"
                            cancelText="取消" okText="确认"
                    >
                        <a href="javascript:;" v-if="!record.editable">删除</a>
                    </a-popconfirm>

                </div>
            </template>
        </a-table>
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
            title: 'Avg',
            children: [
                {
                    title: 'Min',
                    dataIndex: 'avgMin',
                    scopedSlots: {customRender: 'avgMin'},
                },
                {
                    title: 'Max',
                    dataIndex: 'avgMax',
                    scopedSlots: {customRender: 'avgMax'},
                },
            ],
        },
        {
            title: 'Max',
            dataIndex: 'max',
            width: '8%',
            scopedSlots: {customRender: 'max'},
        },
        {
            title: 'Min',
            dataIndex: 'min',
            width: '8%',
            scopedSlots: {customRender: 'min'},
        },
        {
            title: 'Cou',
            dataIndex: 'cou',
            width: '8%',
            scopedSlots: {customRender: 'cou'},
        },
        {
            title: 'Zavg',
            dataIndex: 'zavg',
            width: '8%',
            scopedSlots: {customRender: 'zavg'},
        },
        {
            title: 'Zmax',
            dataIndex: 'zmax',
            width: '8%',
            scopedSlots: {customRender: 'zmax'},
        },
        {
            title: 'Zmin',
            dataIndex: 'zmin',
            width: '8%',
            scopedSlots: {customRender: 'zmin'},
        },
        {
            title: 'Flag',
            dataIndex: 'flag',
            width: '8%',
            scopedSlots: {customRender: 'flag'},
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
                socketConnetionStatusLoading: false,
                monitorFactors: [],
                cacheMonitorFactors: [],
                filterMonitorFactors: [],
                scrollPage: 1,
                enableAdd: false,
                socketConnetionStatus: false,
                tableData: [],
                cacheTableData: [],
                columns,
            };
        },
        // watch:{
        //     '$route.path': function () {
        //         console.log("路由变化了")
        //         this.filterDivisor();
        //     },
        // },
        methods: {
            filterDivisor(){
                console.log("初始化")
                let deviceId=this.$route.params.id
                console.log(deviceId)
                let devices=JSON.parse(localStorage.getItem("simulationLeftNavigations"))
                let sysNavigations=devices.find(item=>item.id==deviceId).sysNavigations
                if(sysNavigations==null){
                    this.filterMonitorFactors=[]
                    return;
                }
                sysNavigations=sysNavigations.split(",")
                this.filterMonitorFactors=this.cacheMonitorFactors.filter(item=>sysNavigations.find(id=>item.navigationId==id)!=undefined)
            },
            numberBlur(e, key, column) {
                if (column == "avgMax" || column == "avgMin") {
                    const newData = [...this.tableData];
                    const target = newData.filter(item => key === item.id)[0];
                    if (target.avgMax == null && column == "avgMin" || target.avgMin == null && column == "avgMax") {
                        target.avgMin, target.avgMax = e.target.ariaValueNow;
                        this.tableData = newData;
                    }
                }
            },
            /**
             * 文本框值变化时回调
             * @param value 变化值
             */
            selectSearch(value) {
                if ("" != value) {
                    this.monitorFactors = this.filterMonitorFactors.filter(item => item.name.indexOf(value) != -1 || item.code.indexOf(value) != -1)
                } else {
                    this.monitorFactors = this.filterMonitorFactors.slice(0, 10);
                }
            },
            /**
             * 失去焦点
             */
            selectBlur() {
                this.monitorFactors = this.filterMonitorFactors.slice(0, 10);
            },
            /**
             * 获取到焦点
             */
            selectFocus(text) {
                //处理选中的因子
                this.monitorFactors = this.filterMonitorFactors.slice(0, 10);
                if(text==""){
                    return;
                }

                if (!this.monitorFactors.some(item => item.id == text)) {
                    this.monitorFactors.unshift(this.filterMonitorFactors.filter(item => item.id == text)[0])
                }
            },
            /**
             * 滚动逻辑
             * @param e
             */
            selectPopupScroll(e, text) {
                const {target} = e
                const scrollHeight = target.scrollHeight - target.scrollTop
                const clientHeight = target.clientHeight
                if (scrollHeight === 0 && clientHeight === 0) {
                    this.scrollPage = 1
                } else {
                    if (scrollHeight < clientHeight + 5) {
                        this.scrollPage++;
                        let newMonitorFactors = this.filterMonitorFactors.slice(this.scrollPage * 10 - 9, this.scrollPage * 10);
                        let deleteIndex = newMonitorFactors.findIndex(item => item.id == text)
                        if (deleteIndex != -1) {
                            //找到重复的,要删除
                            newMonitorFactors.splice(deleteIndex, 1)
                        }
                        this.monitorFactors = this.monitorFactors.concat(newMonitorFactors)
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
                        } else {
                            this.$message.warn(response.data.msg)
                        }
                        this.socketConnetionStatusLoading = false
                    })
                    .catch(function () { // 请求失败处理
                        this.socketConnetionStatusLoading = false
                    });
            },
            handleAdd() {
                this.enableAdd = true
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
                    avgMax: null,
                    avgMin: null,
                    max: 0,
                    min: 0,
                    cou: 0,
                    zavg: 0,
                    zmax: 0,
                    zmin: 0,
                    flag: "N",
                }
                this.tableData.push(data)
                this.cacheTableData=this.tableData
                this.edit(randomId)
            },
            onDelete(key) {
                this.isLoading = true
                const dataSource = [...this.tableData];
                const deleteData = dataSource.filter(item => item.id === key);
                if (deleteData[0].id != '') {
                    this.$axios.delete(this.$base.api + "/counDivisor/deleteById", {params: {id: deleteData[0].id}})
                        .then(response => {
                            if (response.data.state == "0") {
                                this.tableData = dataSource.filter(item => item.id !== key)
                                this.cacheTableData=this.tableData
                                    this.isLoading = false
                            }
                        })
                        .catch(function (error) { // 请求失败处理
                            console.log(error);
                        });
                } else {
                    this.tableData = dataSource.filter(item => item.id !== key)
                        this.cacheTableData=this.tableData
                        this.isLoading = false
                }
            },
            queryTheEmissionFactor() {
                this.$api.divisor.getAll()
                    .then(response => {
                        if (response.data.state == 0) {
                            let monitorFactors=response.data.data.filter(item => item.type==0);
                            let dynamicFactors=response.data.data.filter(item => item.type==1);
                            localStorage.setItem("cacheMonitorFactors", JSON.stringify(monitorFactors));
                            localStorage.setItem("cacheDynamicFactors", JSON.stringify(dynamicFactors));
                        } else {
                            this.$message.error("获取因子失败")
                        }
                    })
                    .catch(function (error) { // 请求失败处理
                        console.log(error);
                    });
            },
            getCode() {
                this.cacheMonitorFactors = JSON.parse(localStorage.getItem("cacheMonitorFactors"));
                this.filterDivisor();
                this.monitorFactors = this.filterMonitorFactors.filter(item => item.type == 0).slice(0, this.scrollPage * 10);
            },
            scanData() {
                this.isLoading = true;
                let data = {
                    deviceId: parseInt(this.$route.params.id),
                }
                this.$axios.get(this.$base.api + "/counDivisor/getListByDeviceId", {params: data})
                    .then(response => {
                        if (response.data.state == 0) {
                            this.tableData = response.data.data
                            this.cacheTableData = JSON.parse(JSON.stringify(response.data.data))
                            this.enableAdd = false
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
                if (target) {
                    target.editable = true;
                    this.tableData = newData;
                }
            },
            save(key) {
                this.isLoading = true;
                let vm = this
                const newData = [...this.tableData];
                if (key != null) {
                    const target = newData.filter(item => key === item.id)[0];
                    if (target) {
                        let data = {
                            id: target.id,
                            deviceId: parseInt(this.$route.params.id),
                            divisorId: target.divisorId,
                            avgMax: target.avgMax,
                            avgMin: target.avgMin,
                            max: target.max,
                            min: target.min,
                            cou: target.cou,
                            zavg: target.zavg,
                            zmax: target.zmax,
                            zmin: target.zmin,
                            flag: target.flag,
                        }
                        if (data.divisorId == '' || data.avgMax == null || data.avgMin == null || data.zavg == null || data.max == null || data.cou == null || data.min == null || data.flag == '') {
                            this.$message.warn("所有项都是必填滴")
                            this.isLoading = false
                            return
                        }

                        if (data.avgMax < data.avgMin) {
                            this.$message.warn("avg里面的Max值不能小于avg里面的min值")
                            this.isLoading = false
                            return
                        }
                        this.$axios.post(this.$base.api + '/counDivisor/update', data)
                            .then(function () {
                                vm.$message.success("编辑成功")
                                vm.scanData()
                                vm.isLoading = false
                            })
                            .catch(function (error) {
                                vm.$message.error("编辑失败" + error)
                                vm.isLoading = false
                            });
                    } else {
                        this.isLoading = false
                    }
                } else {
                    let newTable = this.tableData.filter(divisor => divisor.gmtCreate == null && divisor.divisorId != "")
                    let checkField = true;
                    newTable.forEach(divisor => {
                        if (checkField) {
                            if (divisor.avgMax == null || divisor.avgMin == null || divisor.zavg == null || divisor.max == null || divisor.cou == null || divisor.min == null || divisor.flag == '') {
                                checkField = false;
                                this.$message.warn(this.filterMonitorFactors.filter(item => item.id == divisor.divisorId)[0].name + " 所有项都是必填滴")
                                return;
                            }

                            if (divisor.avgMax < divisor.avgMin) {
                                checkField = false;
                                this.$message.warn(this.filterMonitorFactors.filter(item => item.id == divisor.divisorId)[0].name + " 的avg.Max值不能小于avg.min的值")
                                return;
                            }
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
                    }


                    this.$axios.post(this.$base.api + '/counDivisor/add', newTable)
                        .then(function () {
                            vm.$message.success("保存成功")
                            vm.scanData()
                            vm.enableAdd = false;
                            vm.isLoading = false
                        })
                        .catch(function (error) {
                            vm.$message.error("保存失败" + error)
                            this.isLoading = false
                        });

                }
            },
            cancel(key) {
                const newData = [...this.tableData];
                const target = newData.filter(item => key === item.id)[0];
                if (target) {
                    if (target.gmtCreate != null) {
                        Object.assign(target, this.tableData.filter(item => key === item.id)[0]);
                        delete target.editable;
                        this.tableData = this.cacheTableData;
                    } else {
                        this.tableData = this.cacheTableData.filter(item => key !== item.id)
                        this.cacheTableData=this.tableData
                        if (!this.tableData.find(item => item.gmtCreate == null)) {
                            this.enableAdd = false;
                        }
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
