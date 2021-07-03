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
            <a-form-model-item label="编码" prop="code">
                <a-input v-model="form.code" placeholder="请输入"/>
            </a-form-model-item>
            <a-form-model-item label="类型" prop="type">
                <a-select v-model="form.type" placeholder="请选择">
                    <a-select-option :value="0">
                        监测因子
                    </a-select-option>
                    <a-select-option :value="1">
                        动态因子
                    </a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item label="栏目" prop="navigationId">
                <a-select v-model="form.navigationId" placeholder="请选择">
                    <a-select-option v-for="column in factorColumn" :value="column.id" :key="column.id">
                        {{column.name}}
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
                title: "新增",
                visible: false,
                confirmLoading: false,
                labelCol: {span: 4},
                wrapperCol: {span: 20},
                form: {
                    id: Number,
                    name: '',
                    code: '',
                    type:0,
                    navigationId:null
                },
                rules: {
                    name: [{required: true, message: '请输入', trigger: 'blur'}],
                    code: [{required: true, message: '请输入', trigger: 'blur'}],
                    type: [{required: true, message: '请选择', trigger: 'blur'}],
                    navigationId: [{required: true, message: '请选择', trigger: 'blur'}],
                }
            };
        },
        props:{
            factorColumn:Array
        },
        methods: {
            showModal(id,type) {
                this.title = "新增"
                if (id != undefined) {

                    this.title = "编辑"

                    this.$axios
                        .get(this.$base.api + '/sysCode/getById?id=' + id)
                        .then(response => (
                            this.form.id = response.data.data.id,
                                this.form.name = response.data.data.name,
                                this.form.code = response.data.data.code,
                                this.form.type =  response.data.data.type,
                                this.form.navigationId= response.data.data.navigationId
                        ))
                        .catch(function (error) { // 请求失败处理
                            console.log(error);
                        });
                }else{
                        this.form.type =type
                }
                this.visible = true;
            },
            handleOk() {
                this.confirmLoading = true;
                var vm = this
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        if (this.title == "新增") {
                            vm.$axios.post(vm.$base.api + '/sysCode/add', {
                                name: this.form.name.trim(),
                                code: this.form.code.trim(),
                                type: this.form.type,
                                navigationId:this.form.navigationId
                            })
                                .then(response => {
                                    if (response.data.state == "0") {
                                        vm.$message.success("新增成功")
                                        vm.$emit("queryFactorList")
                                        vm.visible = false;
                                        vm.$refs.ruleForm.resetFields();
                                    } else {
                                        vm.$message.warn(response.data.msg)
                                    }
                                })
                                .catch(function (error) {
                                    vm.$message.error("新增失败" + error)
                                });
                        } else {
                            vm.$axios.post(vm.$base.api + '/sysCode/update', {
                                id: this.form.id,
                                name: this.form.name,
                                code: this.form.code.trim(),
                                type: this.form.type,
                                navigationId:this.form.navigationId
                            })
                                .then(response => {
                                    if (response.data.state == "0") {
                                        vm.$message.success("编辑成功")
                                        vm.$emit("queryFactorList")
                                        vm.visible = false;
                                        vm.$refs.ruleForm.resetFields();
                                    } else {
                                        vm.$message.warn(response.data.msg)
                                    }
                                })
                                .catch(function (error) {
                                    vm.$message.error("编辑失败" + error)
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
