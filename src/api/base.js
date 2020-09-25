const base = {
    api: ""
}

if (process.env.NODE_ENV == "test") {
    base.api = "http://192.168.10.111:31055"
} else if (process.env.NODE_ENV == "development") {
    base.api = "http://192.168.5.61:7002"
}else{
    console.info(process.env.NODE_ENV)
}

export default base;
