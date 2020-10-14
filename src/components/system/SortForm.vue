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
                <a-form-model-item label="图标" prop="icomId" >
                    <a-select v-model="form.icomId" placeholder="请选择" >
                        <a-select-option v-for="icom in icoms" :value='icom.id' :key="icom.id">
                            <a-icon :type="icom.name" /> {{icom.name}}
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
                labelCol: {span: 5},
                wrapperCol: {span: 19},
                icoms:[],
                form: {
                    id:Number,
                    name: '',
                    icomId: undefined,
                },
                rules: {
                    name: [{required: true, message: '请输入', trigger: 'blur'}],
                    icomId: [{required: true, message: '请选择', trigger: 'change'}],
                }
            };
        },
        methods: {
            getIcoms(){
                this.$axios
                    .get(this.$base.api+'/icom/getAll')
                    .then(response => (
                        this.icoms=response.data.data
                    ))
                    .catch(function (error) { // 请求失败处理
                        console.log(error);
                    });
            },
            showModal(id) {
                this.title="新增"
                this.getIcoms()
                if(id!=undefined){
                    this.title="编辑"
                    this.$axios
                        .get(this.$base.api+'/navigation/getById?id=' + id)
                        .then(response => (
                            this.form.id=response.data.data.id,
                                this.form.name = response.data.data.name,
                                this.form.icomId = response.data.data.icomId
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
                                vm.$axios.post(vm.$base.api+'/navigation/add', {
                                    name: this.form.name,
                                    icomId: this.form.icomId,
                                })
                                    .then(function () {
                                        vm.$message.success("新增成功")
                                        vm.$emit("getSiderList")
                                        vm.visible = false;
                                        vm.$refs.ruleForm.resetFields();
                                        vm.updateBookMarkLeftNavigation();
                                    })
                                    .catch(function (error) {
                                        vm.$message.error("新增失败"+error)
                                    });
                            } else {
                                vm.$axios.post(vm.$base.api+'/navigation/update', {
                                    id:this.form.id,
                                    name: this.form.name,
                                    icomId: this.form.icomId,
                                })
                                    .then(function () {
                                        vm.$message.success("编辑成功")
                                        vm.$emit("getSiderList")
                                        vm.visible = false;
                                        vm.$refs.ruleForm.resetFields();
                                        vm.updateBookMarkLeftNavigation();
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
            updateBookMarkLeftNavigation(){
                this.$api.home.getBookMarkLeftNavigation()
                    .then(response => {
                        localStorage.setItem('bookMarkLeftNavigation', JSON.stringify(response.data.data))
                    })
                    .catch(function (error) { // 请求失败处理
                        console.log(error);
                    });
            },
        },
    };
</script>
