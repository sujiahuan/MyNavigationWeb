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
                },
                rules: {
                    name: [{required: true, message: '请输入', trigger: 'blur'}],
                }
            };
        },
        methods: {
            showModal(id) {
                this.title="新增"
                if(id!=undefined){
                    this.title="编辑"
                    this.$axios
                        .get(this.$base.api+'/icom/getById?id=' + id)
                        .then(response => (
                            this.form.id=response.data.data.id,
                                this.form.name = response.data.data.name
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
                                vm.$axios.post(vm.$base.api+'/icom/add', {
                                    name: this.form.name,
                                })
                                    .then(function () {
                                        vm.$message.info("新增成功")
                                        vm.$emit("onSearchIcomTable")
                                        vm.visible = false;
                                        vm.$refs.ruleForm.resetFields();
                                    })
                                    .catch(function (error) {
                                        vm.$message.error("新增失败"+error)
                                    });
                            } else {
                                vm.$axios.post(vm.$base.api+'/icom/update', {
                                    id:this.form.id,
                                    name: this.form.name,
                                })
                                    .then(function () {
                                        vm.$message.info("编辑成功")
                                        vm.$emit("onSearchIcomTable")
                                        vm.visible = false;
                                        vm.$refs.ruleForm.resetFields();
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
