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
                <a-form-model-item label="标题" prop="title">
                    <a-input v-model="form.title" placeholder="请输入"/>
                </a-form-model-item>
                <a-form-model-item label="分类" prop="classify" v-show="true" >
                    <a-select v-model="form.classify" placeholder="请选择" disabled="">
                        <a-select-option v-for="leftNavigation in leftNavigations" :value='leftNavigation.id' :key="leftNavigation.id">
                            {{leftNavigation.name}}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="打开方式" prop="openmode">
                    <a-select v-model="form.openmode" placeholder="请选择">
                        <a-select-option value="_blank">
                            外部打开
                        </a-select-option>
                        <a-select-option value="_parent">
                            内部打开
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="链接" prop="link">
                    <a-input v-model="form.link" placeholder="https://www.baidu.com"/>
                </a-form-model-item>
                <a-form-model-item label="版本" prop="version">
                    <a-input v-model="form.version" placeholder="1.0"/>
                </a-form-model-item>
                <a-form-model-item label="账号" prop="username">
                    <a-input v-model="form.username" placeholder="请输入"/>
                </a-form-model-item>
                <a-form-model-item label="密码" prop="password">
                    <a-input v-model="form.password" placeholder="请输入"/>
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
                    title: '',
                    classify: undefined,
                    openmode: '_blank',
                    link: '',
                    version: '',
                    username: '',
                    password: '',
                },
                rules: {
                    title: [{required: true, message: '请输入', trigger: 'blur'}],
                    classify: [{required: true, message: '请选择', trigger: 'change'}],
                    openmode: [{required: true, message: '请选择', trigger: 'change'}],
                    link: [{required: true, message: '请输入', trigger: 'blur'}],
                    version: [{required: true, message: '请输入', trigger: 'blur'}],
                    username: [{required: false, message: '请输入', trigger: 'blur'}],
                    password: [{required: false, message: '请输入', trigger: 'blur'}],
                }
            };
        },
        props:['leftNavigations','leftSelect'],
        methods: {
            showModal(id) {
                if(id!=undefined){
                    this.title="编辑"
                    this.$axios
                        .get(this.$base.api+'/bookmark/getById?id=' + id)
                        .then(response => (
                            this.form.id=response.data.data.id,
                                this.form.title = response.data.data.title,
                                this.form.classify = response.data.data.parentId,
                                this.form.openmode = response.data.data.openmode,
                                this.form.link = response.data.data.link,
                                this.form.version = response.data.data.version,
                                this.form.username = response.data.data.username,
                                this.form.password = response.data.data.password
                        ))
                        .catch(function (error) { // 请求失败处理
                            console.log(error);
                        });
                }
                this.form.classify=this.leftSelect;
                this.visible = true;
            },
            handleOk() {
                this.confirmLoading = true;
                    var vm=this
                    this.$refs.ruleForm.validate(valid => {
                        if (valid) {
                            if (this.title=="新增") {
                                vm.$axios.post(this.$base.api+'/bookmark/add', {
                                    title: this.form.title,
                                    parentId: this.form.classify[0],
                                    openmode: this.form.openmode,
                                    link: this.form.link,
                                    version: this.form.version,
                                    username: this.form.username,
                                    password: this.form.password
                                })
                                    .then(function () {
                                        vm.$message.info("新增成功")
                                        vm.$emit("onSearchBookmark")
                                        vm.visible=false
                                        vm.$refs.ruleForm.resetFields();
                                    })
                                    .catch(function (error) {
                                        vm.$message.error("新增失败"+error)
                                    });
                            } else {
                                vm.$axios.post(this.$base.api+'/bookmark/update', {
                                    id:this.form.id,
                                    title: this.form.title,
                                    parentId: this.form.classify[0],
                                    openmode: this.form.openmode,
                                    link: this.form.link,
                                    version: this.form.version,
                                    username: this.form.username,
                                    password: this.form.password
                                })
                                    .then(function () {
                                        vm.$message.info("编辑成功")
                                        vm.$emit("onSearchBookmark")
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
