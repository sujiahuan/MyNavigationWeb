const base = {
    api: ""
}

if (process.env.NODE_ENV == "test") {
    base.api = "http://localhost:7001"
} else if (process.evn.NODE_ENV == "dev") {
    base.api = "http://127.0.0.1"
}

export default base;
