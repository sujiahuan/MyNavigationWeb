const base = {
    api: ""
}

if (process.env.NODE_ENV == "test") {
    base.api = "http://192.168.5.61:7001"
} else if (process.env.NODE_ENV == "development") {
    base.api = "http://127.0.0.1:7001"
}else if (process.env.NODE_ENV == "production") {
    base.api = "http://192.168.10.111:31055"
}else{
    console.log("当前ENV值是："+process.env.NODE_ENV)
}

export default base;
