<template>

    <a-layout :style="{ background: '#fff', padding: '0px', margin: 0, minHeight:$globalConstant.curHeight- 153+'px' }">
        <!--            <a-layout-header>Header</a-layout-header>-->
        <a-layout-content>
            <conDivisorTable ref="childrenDivisorTable" ></conDivisorTable>
            <conRTDataTypeTable ref="childrenConRTDataTypeTable" @setBeforeText="setBeforeText" @getSocketConnetionStatus="getSocketConnetionStatus"></conRTDataTypeTable>

        </a-layout-content>
        <a-layout-footer>
            <template>
                <a-row>
                    <a-col :span="10">
                        <a-textarea placeholder="提取该设备的数据或手动输入且进行crc计算的数据" v-model="beforeText" :rows="4" />
                    </a-col>
                    <a-col :span="2">
                        <a-button type="primary" block @click="computeCrc" :loading="crcLoading">
                            CRC计算
                        </a-button>
                    </a-col>
                    <a-col :span="10">
                        <a-textarea placeholder="要发送的数据，默认发送到该设备的服务器" v-model="afterText" :rows="4"/>
                    </a-col>
                    <a-col :span="2">
                        <a-button type="primary" block @click="sendMessage" :loading="sendLoading" >
                            发送
                        </a-button>
                    </a-col>
                </a-row>
            </template>
        </a-layout-footer>

    </a-layout>
</template>

<script>
    import conDivisorTable from "../ConDivisorTable";
    import conRTDataTypeTable from "./ConRTDataTypeTable";

    export default {
        data() {
            return {
                beforeText:'',
                afterText:'',
                crcLoading:false,
                sendLoading:false
            };
        },
        components: {
            conDivisorTable,
            conRTDataTypeTable
        },
        watch:{
            '$route.path':function () {
                if(this.$route.path.indexOf('controlDevice')!=-1){
                    let controlDeviceSelectTabKey=sessionStorage.getItem("controlDeviceSelectTabKey");
                    if(controlDeviceSelectTabKey=="1"){
                        this.init()
                    }
                }
            },

        },
        // mounted() {
        // this.queryChildrenEmissionFactor()
        //     this.init()
        // },
        methods:{
            init(){
                this.getSocketConnetionStatus();
                this.$refs.childrenDivisorTable.getCode()
                this.$refs.childrenDivisorTable.scanData()
                this.$refs.childrenConRTDataTypeTable.scanData()
            },
            queryChildrenEmissionFactor(){
                this.$refs.childrenDivisorTable.queryTheEmissionFactor()
            },
            getSocketConnetionStatus(){
                console.log("实时进来了")
                this.$refs.childrenDivisorTable.getSocketConnetionStatus();
            },
            setBeforeText(msg){
                this.beforeText=msg
            },
            computeCrc(){
                this.crcLoading=true
                let data={
                    msg:this.beforeText.trim()
                }
                if(data.msg==''){
                    this.$message.warn("提取文本框不能为空")
                    this.crcLoading=false
                    return
                }
                let vue=this
                this.$axios.get(this.$base.api + "/counDataType/computeCrc", {params:data})
                    .then(response => {
                        if (response.data.state == "0") {
                            vue.afterText=response.data.data
                            vue.$message.success("计算成功")
                            this.crcLoading=false
                        }else{
                            vue.$message.warn("计算失败:"+response.data.msg)
                            this.crcLoading=false
                        }
                    })
                    .catch(function (error) { // 请求失败处理
                        vue.$message.error("计算失败:"+error)
                        this.crcLoading=false
                    });
            },
            sendMessage(){
                this.sendLoading=true
                let data={
                    deviceId:this.$route.params.id,
                    msg:this.afterText.trim()
                }
                if(data.msg==''){
                    this.$message.warn("发送文本框不能为空")
                    this.sendLoading=false
                    return
                }
                let vue=this
                this.$axios.get(this.$base.api + "/counDataType/sendMessage", {params:data})
                    .then(response => {
                        if (response.data.state == "0") {
                            vue.$message.success("发送成功")
                            this.sendLoading=false
                        }else{
                            vue.$refs.childrenDivisorTable.getSocketConnetionStatus();
                            vue.$message.warn("发送失败:"+response.data.msg)
                            this.sendLoading=false
                        }
                    })
                    .catch(function (error) { // 请求失败处理
                        vue.$message.error("发送失败:"+error)
                        this.sendLoading=false
                    });
            }

        }
    }
</script>

<style scoped>
    .ant-btn{
        height:94px;
        /*border-radius:0px*/
    }
</style>