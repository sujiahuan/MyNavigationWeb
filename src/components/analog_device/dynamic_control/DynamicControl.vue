<template>

    <a-layout :style="{ background: '#fff', padding: '0px', margin: 0, minHeight:$globalConstant.curHeight- 153+'px' }">
        <!--            <a-layout-header>Header</a-layout-header>-->
        <a-layout-content>
            <dischargeFactorTable ref="childDischargeFactorTable"></dischargeFactorTable>
        </a-layout-content>
        <a-layout-footer :style="{padding:'20px 15px 15px 0px'}">
            <template>
                <a-row>
                    <a-col :span="2">
                        <div :style="{height:$globalConstant.curHeight*0.10+'px'}">
                            <a-button type="primary" block @click="extract(5)" :loading="extractLoading"
                                      style="height: 49%">
                                提取状态
                            </a-button>
                            <a-button type="primary" block @click="extract(6)" :loading="extractLoading"
                                      style="height: 49%;margin-top: 2%">
                                提取参数
                            </a-button>
                        </div>

                    </a-col>
                    <a-col :span="9">
                        <a-textarea placeholder="提取该设备的数据或手动输入且进行crc计算的数据" v-model="beforeText" :rows="4"/>
                    </a-col>
                    <a-col :span="2">
                        <a-button type="primary" block @click="computeCrc" :loading="crcLoading">
                            CRC计算
                        </a-button>
                    </a-col>
                    <a-col :span="9">
                        <a-textarea placeholder="要发送的数据，默认发送到该设备的服务器" v-model="afterText" :rows="4"/>
                    </a-col>
                    <a-col :span="2">
                        <a-button type="primary" block @click="sendMessage" :loading="sendLoading">
                            发送
                        </a-button>
                    </a-col>
                </a-row>
            </template>
        </a-layout-footer>

    </a-layout>
</template>

<script>
    import dischargeFactorTable from "../dynamic_control/DischargeFactorTable";

    export default {
        data() {
            return {
                beforeText: '',
                afterText: '',
                extractLoading:false,
                crcLoading: false,
                sendLoading: false
            };
        },
        components: {
            dischargeFactorTable,
        },
        watch: {
            '$route.path': function () {
                if (this.$route.path.indexOf('controlDevice') != -1) {
                    let controlDeviceSelectTabKey = sessionStorage.getItem("controlDeviceSelectTabKey");
                    if (controlDeviceSelectTabKey == "3") {
                        this.init()
                    }
                }
            },
        },
        // mounted() {
        //     this.init()
        // },
        methods: {
            init() {
                this.getSocketConnetionStatus();
                this.$refs.childDischargeFactorTable.getCode()
                this.$refs.childDischargeFactorTable.scanData()
            },
            getSocketConnetionStatus() {
                this.$refs.childDischargeFactorTable.getSocketConnetionStatus();
            },
            setBeforeText(msg) {
                this.beforeText = msg
            },
            extract(type) {
                this.extractLoading=true
                let vm=this;
                let data={
                    deviceId:parseInt(this.$route.params.id),
                    dataType:type
                }

                this.$axios.get(this.$base.api + "/counDataType/getDataPackage", {params: data})
                    .then(response => {
                        if (response.data.state == "0") {
                            vm.beforeText = response.data.data
                            vm.$message.success("提取成功")
                            this.extractLoading = false
                        } else {
                            vm.$message.warn("提取失败:" + response.data.msg)
                            this.extractLoading = false
                        }
                    })
                    .catch(function (error) { // 请求失败处理
                        vm.$message.error("提取失败:" + error)
                        this.extractLoading = false
                    });
            },
            computeCrc() {
                this.crcLoading = true
                let data = {
                    msg: this.beforeText.trim()
                }
                if (data.msg == '') {
                    this.$message.warn("提取文本框不能为空")
                    this.crcLoading = false
                    return
                }
                let vm = this
                this.$axios.get(this.$base.api + "/counDataType/computeCrc", {params: data})
                    .then(response => {
                        if (response.data.state == "0") {
                            vm.afterText = response.data.data
                            vm.$message.success("计算成功")
                            this.crcLoading = false
                        } else {
                            vm.$message.warn("计算失败:" + response.data.msg)
                            this.crcLoading = false
                        }
                    })
                    .catch(function (error) { // 请求失败处理
                        vm.$message.error("计算失败:" + error)
                        this.crcLoading = false
                    });
            },
            sendMessage() {
                this.sendLoading = true
                let data = {
                    deviceId: this.$route.params.id,
                    msg: this.afterText.trim()
                }
                if (data.msg == '') {
                    this.$message.warn("发送文本框不能为空")
                    this.sendLoading = false
                    return
                }
                let vm = this
                this.$axios.get(this.$base.api + "/counDataType/sendMessage", {params: data})
                    .then(response => {
                        if (response.data.state == "0") {
                            vm.$message.success("发送成功")
                            this.sendLoading = false
                        } else {
                            vm.$refs.childDischargeFactorTable.getSocketConnetionStatus();
                            vm.$message.warn("发送失败:" + response.data.msg)
                            this.sendLoading = false
                        }
                    })
                    .catch(function (error) { // 请求失败处理
                        vm.$message.error("发送失败:" + error)
                        this.sendLoading = false
                    });
            }

        }
    }
</script>

<style scoped>
    .ant-btn {
        height: 94px;
        /*border-radius:0px*/
    }
</style>