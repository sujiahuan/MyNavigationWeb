<template>

    <a-layout :style="{ background: '#fff', padding: '0px', margin: 0, minHeight:$globalCss.curHeight- 145+'px' }">
        <!--            <a-layout-header>Header</a-layout-header>-->
        <a-layout-content>
            <conDivisorTable ref="childrenDivisorTable"></conDivisorTable>
            <conRTDataTypeTable ref="childrenConRTDataTypeTable"></conRTDataTypeTable>
        </a-layout-content>
        <a-layout-footer>
            <template>
                <a-textarea placeholder="Basic usage" v-model="text" :rows="5" />
            </template>
        </a-layout-footer>
    </a-layout>
</template>

<script>
    import conDivisorTable from "./ConDivisorTable";
    import conRTDataTypeTable from "./ConRTDataTypeTable";

    export default {
        data() {
            return {
                text:''
            };
        },
        components: {
            conDivisorTable,
            conRTDataTypeTable
        },
        watch:{
            '$route.path':function () {
                console.info(this.$route.path)
                if(this.$route.path.indexOf('controlDevice')!=-1){
                   this.init()
                }
            }
        },
        methods:{
            init(){
                this.$refs.childrenDivisorTable.scanData()
                this.$refs.childrenConRTDataTypeTable.scanData()
                this.openSocket()
            },
            openSocket(){
                // eslint-disable-next-line no-debugger
                debugger
                let socket;
                if(typeof(WebSocket) == "undefined") {
                    console.log("您的浏览器不支持WebSocket");
                }else{
                    console.log("您的浏览器支持WebSocket");
                    //实现化WebSocket对象，指定要连接的服务器地址与端口  建立连接
                    var userId = this.$route.params.id
                    // var socketUrl="ws://127.0.0.1:22599/webSocket/"+userId;
                    var socketUrl="ws://"+this.$base.api.replace("http://","")+"/webSocket/"+userId;
                    console.log(socketUrl);
                    if(socket!=null){
                        socket.close();
                        socket=null;
                    }
                    socket = new WebSocket(socketUrl);
                    //打开事件
                    socket.onopen = function() {
                        console.log("websocket已打开");
                        //socket.send("这是来自客户端的消息" + location.href + new Date());
                    };
                    //获得消息事件
                    socket.onmessage = function(msg) {
                        var serverMsg = "收到服务端信息：" + msg.data;
                        console.log(serverMsg);
                        //发现消息进入    开始处理前端触发逻辑
                    };
                    //关闭事件
                    socket.onclose = function() {
                        console.log("websocket已关闭");
                    };
                    //发生了错误事件
                    socket.onerror = function() {
                        console.log("websocket发生了错误");
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>