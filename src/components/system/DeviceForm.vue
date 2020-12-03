<template>
    <!--    弹窗-->
    <a-modal
            :title="title"
            :visible="visible"
            :confirm-loading="confirmLoading"
            okText="提交"
            cancelText="取消"
            @ok="handleOk"
            @cancel="handleCancel"
    >
        <a-form-model :model="form" ref='ruleForm' :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-model-item label="名称" prop="name">
                <a-input v-model="form.name" placeholder="请输入"/>
            </a-form-model-item>
            <a-form-model-item label="主机地址" prop="ip">
                <a-input v-model="form.ip" placeholder="请输入"/>
            </a-form-model-item>
            <a-form-model-item label="端口" prop="port">
                <a-input-number v-model="form.port" placeholder="请输入"/>
            </a-form-model-item>
            <a-form-model-item label="MN号" prop="mn">
                <a-input v-model="form.mn" placeholder="请输入"/>
            </a-form-model-item>
            <a-form-model-item label="监测类型" prop="monitoringType" >
                <a-select
                        v-model="form.monitoringType"
                        placeholder="请选择"
                        show-search
                        option-filter-prop="children"
                >
                    <a-select-option value="21">
                        21 / 地表水质量监测
                    </a-select-option>
                    <a-select-option value="22">
                        22 / 空气质量监测
                    </a-select-option>
                    <a-select-option value="23">
                        23 / 声环境质量监测
                    </a-select-option>
                    <a-select-option value="24">
                        24 / 地下水质量监测
                    </a-select-option>
                    <a-select-option value="25">
                        25 / 土壤质量监测
                    </a-select-option>
                    <a-select-option value="26">
                        26 / 海水质量监测
                    </a-select-option>
                    <a-select-option value="27">
                        27 / 挥发性有机物监测
                    </a-select-option>
                    <a-select-option value="31">
                        31 / 大气环境污染源
                    </a-select-option>
                    <a-select-option value="32">
                        32 / 地表水体环境污染源
                    </a-select-option>
                    <a-select-option value="33">
                        33 / 地下水体环境污染源
                    </a-select-option>
                    <a-select-option value="34">
                        34 / 海洋环境污染源
                    </a-select-option>
                    <a-select-option value="35">
                        35 / 土壤环境污染源
                    </a-select-option>
                    <a-select-option value="36">
                        36 / 声环境污染源
                    </a-select-option>
                    <a-select-option value="37">
                        37 / 振动环境污染源
                    </a-select-option>
                    <a-select-option value="38">
                        38 / 放射性环境污染源
                    </a-select-option>
                    <a-select-option value="39">
                        39 / 工地扬尘污染源
                    </a-select-option>
                    <a-select-option value="41">
                        41 / 电磁环境污染源
                    </a-select-option>
                    <a-select-option value="51">
                        51 / 烟气排放过程监控
                    </a-select-option>
                    <a-select-option value="52">
                        52 / 污水排放过程监控
                    </a-select-option>
                    <a-select-option value="91">
                        91 / 系统交互
                    </a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item label="协议" prop="agreement" >
                <a-select v-model="form.agreement" placeholder="请选择">
                    <a-select-option value="17">
                        17
                    </a-select-option>
                    <a-select-option value="05">
                        05
                    </a-select-option>
                </a-select>
            </a-form-model-item>
        </a-form-model>
    </a-modal>
</template>
<script>
    export default {
        data() {
            return {
                title:"新增",
                visible: false,
                confirmLoading: false,
                labelCol: {span: 4},
                wrapperCol: {span: 20},
                form: {
                    id:Number,
                    name:'',
                    ip: '',
                    port:'',
                    mn:'',
                    monitoringType:'',
                    agreement:'',
                },
                rules: {
                    ip: [{required: true, message: '请输入', trigger: 'blur'}],
                    name: [{required: true, message: '请输入', trigger: 'blur'}],
                    port: [{required: true, message: '请输入', trigger: 'blur'}],
                    mn: [{required: true, message: '请输入', trigger: 'blur'}],
                    monitoringType: [{required: true, message: '请输入', trigger: 'blur'}],
                    agreement: [{required: true, message: '请输入', trigger: 'blur'}],
                }
            };
        },
        methods: {
            showModal(id) {
                this.title="新增"
                this.form.monitoringType='31',
                    this.form.agreement='17'
                if(id!=undefined){
                    this.title="编辑"
                    this.$axios
                        .get(this.$base.api+'/counDevice/getById',{params:{id:id}})
                        .then(response => (
                            this.form.id=response.data.data.id,
                            this.form.name=response.data.data.name,
                            this.form.ip=response.data.data.ip,
                            this.form.port = response.data.data.port,
                            this.form.mn = response.data.data.mn,
                            this.form.monitoringType = response.data.data.monitoringType,
                            this.form.agreement = response.data.data.agreement
                        ))
                        .catch(function (error) { // 请求失败处理
                            console.log(error);
                        });
                }
                this.visible = true;
            },
            handleOk() {
                this.confirmLoading = true;
                let data = {
                    ip: this.form.ip,
                    name: this.form.name,
                    port: this.form.port,
                    mn: this.form.mn,
                    monitoringType: this.form.monitoringType,
                    agreement: this.form.agreement
                }
                var vm=this
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        if (this.title=="新增") {
                            vm.$axios.post(vm.$base.api+'/counDevice/add', data)
                                .then(response => {
                                    if(response.data.state=="0"){
                                        vm.$message.success("新增成功")
                                        vm.$emit("getDeviceList")
                                        vm.visible = false;
                                        vm.$refs.ruleForm.resetFields();
                                    }else{
                                        vm.$message.warn(response.data.msg)
                                    }
                                })
                                .catch(function (error) {
                                    vm.$message.error("新增失败"+error)
                                });
                        } else {
                            data.id=this.form.id
                            vm.$axios.post(vm.$base.api+'/counDevice/update', data)
                                .then(response => {
                                    if(response.data.state=="0"){
                                        vm.$message.success("编辑成功")
                                        vm.$emit("getDeviceList")
                                        vm.visible = false;
                                        vm.$refs.ruleForm.resetFields();
                                    }else{
                                        vm.$message.warn(response.data.msg)
                                    }
                                })
                                .catch(function (error) {
                                    vm.$message.error("编辑失败"+error)
                                });

                        }

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
                this.confirmLoading = false;

            },
            handleCancel() {
                this.visible = false;
                this.$refs.ruleForm.resetFields();
            },
        },
    };
</script>
