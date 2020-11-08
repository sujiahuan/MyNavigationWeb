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
                    name: '',
                    code: '',
                },
                rules: {
                    name: [{required: true, message: '请输入', trigger: 'blur'}],
                    code: [{required: true, message: '请输入', trigger: 'blur'}],
                }
            };
        },
        methods: {
            getDivisorCode() {
                this.$api.divisor.getAll()
                    .then(response => {
                        if (response.data.state == 0) {
                            localStorage.setItem("divisorCodes", JSON.stringify(response.data.data));
                        } else {
                            this.$message.error("设置因子失败")
                        }
                    })
                    .catch(function (error) { // 请求失败处理
                        console.log(error);
                    });
            },
            showModal(id) {
                this.title="新增"
                if(id!=undefined){
                    this.title="编辑"
                    this.$axios
                        .get(this.$base.api+'/sysCode/getById?id=' + id)
                        .then(response => (
                            this.form.id=response.data.data.id,
                                this.form.name = response.data.data.name,
                                this.form.code = response.data.data.code
                        ))
                        .catch(function (error) { // 请求失败处理
                            console.log(error);
                        });
                }
                this.visible = true;
            },
            handleOk() {
                this.confirmLoading = true;
                    var vm=this
                    this.$refs.ruleForm.validate(valid => {
                        if (valid) {
                            if (this.title=="新增") {
                                vm.$axios.post(vm.$base.api+'/sysCode/add', {
                                    name: this.form.name,
                                    code: this.form.code.trim(),
                                })
                                    .then(function () {
                                        vm.$message.success("新增成功")
                                        vm.$emit("getList")
                                        vm.visible = false;
                                        vm.$refs.ruleForm.resetFields();
                                        vm.getDivisorCode();
                                    })
                                    .catch(function (error) {
                                        vm.$message.error("新增失败"+error)
                                    });
                            } else {
                                vm.$axios.post(vm.$base.api+'/sysCode/update', {
                                    id:this.form.id,
                                    name: this.form.name,
                                    code: this.form.code.trim(),
                                })
                                    .then(function () {
                                        vm.$message.success("编辑成功")
                                        vm.$emit("getList")
                                        vm.visible = false;
                                        vm.$refs.ruleForm.resetFields();
                                        vm.getDivisorCode();
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
