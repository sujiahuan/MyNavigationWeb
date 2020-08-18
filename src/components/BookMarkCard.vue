<template>
    <a-layout style="padding: 0 24px 24px">
        <a-layout-header :style="{ background: '#fff', padding: '0px', margin: 0, minHeight:'50px',paddingLeft:'25px',marginBottom:'24px'}">
            <a-input-search v-model="searchMsg" placeholder="输入标题" style="width: 200px"
                            @search="getBookMarkList()"/>
            <a-button style="margin-left: 20px;" type="primary"
                      @click="openBookMarkForm()">
                新增
            </a-button>
        </a-layout-header>
        <a-layout-content :style="{ background: '#fff', padding: '24px', margin: 0, minHeight:$globalCss.curHeight- 175+'px' }">
            <a-list :grid="{ gutter: 16, column: 6 }" :data-source="bookmarks" :locale="locale" :loading="isLoading">
                <a-list-item slot="renderItem" slot-scope="item">
                    <a-card hoverable :title="item.title" :bodyStyle="cardBodyStyle">
                        <a-row :gutter="[0,20]">
                            <a-col class="cardLeft" :span="9">
                                v{{item.version}} :
                            </a-col>
                            <a-col class="cardRight" :span="15">
                                <a :href=item.link :target=item.openmode>链接地址</a>
                            </a-col>

                            <a-col class="cardLeft" :span="9" style="overflow: hidden;height: 50px">
                                账号/密码 :
                            </a-col>
                            <a-col class="cardRight" :span="15" style="overflow: hidden;height: 30px">
                                <a-tooltip :title="item.username==null?'':item.username">{{item.username==null?"-":item.username==''?'-':item.username}}/</a-tooltip>
                                <a-tooltip :title="item.password==null?'':item.password">{{item.password==null?"-":item.password==''?'-':item.password}}</a-tooltip>
                            </a-col>
                        </a-row>
                        <a-row :gutter="[0,10]">
                            <a @click="openBookMarkForm(item.id)">
                                <a-col class="cardBottom" :span="12" style="border-right: 1px #e8e8e8 solid ">
                                    <span style="color: green" >编辑</span>
                                </a-col>
                            </a>
                            <a v-on:click="showConfirm(item.id)">
                                <a-col class="cardBottom" :span="12" style="border-left: 1px #e8e8e8 solid">
                                    <span style="color:#ff0000">删除</span>
                                </a-col>
                            </a>
                        </a-row>
                    </a-card>
                </a-list-item>
            </a-list>
            <bookMarkForm ref="childrenBookMark" @getBookMarkList="getBookMarkList"></bookMarkForm>
        </a-layout-content>
    </a-layout>
</template>
<script>
    import bookMarkForm from "./BookMarkForm"
    export default {
        data() {
            return {
                cardBodyStyle: {'padding': '0px', 'padding-top': '20px'},
                bookmarks: [],
                searchMsg: '',
                isLoading: false,
                locale: {
                    emptyText: "亲，没数据啦。赶紧添一下数据吧！"
                }
            };
        },
        components: {
            bookMarkForm
        },
        mounted() {
            console.info(this.$route)
            this.getBookMarkList()
        },
        watch: {
            '$route': function() {
                this.getBookMarkList()
            }
        },
        methods: {
            getBookMarkList() {
                console.info("crad:"+this.$route.params.leftNavigations)
                this.isLoading = true
                this.$axios
                    .get(this.$base.api + '/bookmark/getBookmark?parenId=' + this.$route.params.id + "&title=" + this.searchMsg)
                    .then(response => (
                        this.bookmarks = response.data.data,
                            this.isLoading = false
                    ))
                    .catch(function (error) { // 请求失败处理
                        console.log(error);
                    });

            },
            openBookMarkForm(id) {
                this.$refs.childrenBookMark.showModal(id)
            },
            showConfirm(id) {
                const vue = this
                this.$confirm({
                    title: '确定要删除书签吗?',
                    content: '删除后将无法恢复。',
                    okText: '确定',
                    cancelText: '取消',
                    onOk() {
                        vue.$axios
                            .delete(vue.$base.api + '/bookmark/deleteById?id=' + id)
                            .then(response => (
                                vue.getBookMarkList(),
                                    console.log(response)
                            ))
                            .catch(function (error) { // 请求失败处理
                                console.log(error);
                            });
                    },
                    onCancel() {
                    },
                });
            },
        }
    };
</script>
<style>
    .ant-card-head-title {
        text-align: center;
    }

    .cardLeft {
        text-align: right;
    }

    .cardRight {
        text-align: center;
    }

    .cardBottom {
        text-align: center;
        border-top: 1px #e8e8e8 solid;
        margin-top: 10px;
    }
</style>
