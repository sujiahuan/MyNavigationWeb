const base = {
    api: ""
}

if (process.env.NODE_ENV == "test") {
    base.api = "http://192.168.5.61:7001"
} else if (process.env.NODE_ENV == "dev") {
    base.api = "http://localhost:7001"
}

export default base;
