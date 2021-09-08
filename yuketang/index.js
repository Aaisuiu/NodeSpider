const Axios = require('axios');
const path = require('path');
const { jsonc } = require('jsonc');
const CONFIG_PATH = path.resolve(__dirname, 'config.jsonc');
loadJSON = (path) => {
    try {
        return jsonc.readSync(path);
    } catch (e) {
        const { code, message } = e;
        let notice = '';
        if (code === 'ENOENT') {
            notice = `ERROR: 找不到配置文件 ${e.path}`;
        } else if (message && message.includes('JSON')) {
            notice = `ERROR: 配置文件 JSON 格式有误\n${message}`;
        } else notice = `${e}`;
        console.error( notice);
    }
}

const config = loadJSON(CONFIG_PATH);

Axios.post(config.baseurl, {
    headers: {
        "user-agent":"Mozilla / 5.0(Windows NT 10.0; Win64; x64) AppleWebKit / 537.36(KHTML, like  Gecko) Chrome /80.0.3987.122 Safari / 537.36",
        "Content-Type": "application/json"
    },
    data: {
        type:"PP",
        name:config.name,
        pwd:config.password
    }
})
    .then(ret => ret.data)
    .then((ret)=>{
        console.log(ret);
    })