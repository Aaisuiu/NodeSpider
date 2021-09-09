const Axios = require("axios");
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
        console.error(notice);
    }
}
const config = loadJSON(CONFIG_PATH);
// 带上配置
// Axios({
//     method: 'post',
//     url: config.baseurl + '/pc/login/verify_pwd_login/',
//     data: { type: "PP", name: config.name, pwd: config.password },
//     responseType: 'json',
// })
//     .then((ret) => {
//         if (ret.data.success != true) throw (ret.data);
//         const setCookies = ret.headers['set-cookie'];
//         const cookies = { 'csrftoken': setCookies[0].slice(10, 42), 'sessionid': setCookies[1].slice(10, 42) }
//         return cookies;
//     })
//     .then(async (cookies) => {

//         var cookie = `csrftoken=${cookies['csrftoken']};sessionid=${cookies['sessionid']};django_language=zh-cn;`
//         const ret = await Axios({
//             method: 'get',
//             url: config.baseurl + '/v/course_meta/on_lesson_courses',
//             headers: { 'Cookie': cookie },
//             withCredentials: true
//         })
//         return ret;
//     })
//     .then(ret => ret.data)
//     .then(ret => {
//         if (ret.data['on_lessons'] == '') throw(new Date()+`  尚未有课程`);
//         if (ret['success'] != true) throw ('cookies不匹配');
//         console.log(ret);
//     })
//     .then(lessonId=>{
//         console.log(cookie);
//         Axios({
//             url: config.baseurl+`/v/lesson/lesson_info_entry/{lesson_id}?ppt_version=1.5&source=5`
//         })
//     })
//     .catch(e => {
//         console.log(e);
//     })


https://zhuanlan.zhihu.com/p/29052022

const sgin = async () => {
    try {
        const ret = await Axios({
            method: 'post',
            url: config.baseurl + '/pc/login/verify_pwd_login/',
            data: { type: "PP", name: config.name, pwd: config.password },
            responseType: 'json',
        })

        if (ret.data.success != true) throw (ret.data);
        const setCookies = ret.headers['set-cookie'];
        // console.log(setCookies);
        const cookies = { 'csrftoken': setCookies[0].slice(10, 42), 'sessionid': setCookies[1].slice(10, 42) }
        const cookie = `csrftoken=${cookies['csrftoken']};sessionid=${cookies['sessionid']};django_language=zh-cn;`
        const on_lesson_courses = await Axios({
            method: 'get',
            url: config.baseurl + '/v/course_meta/on_lesson_courses',
            headers: { 'Cookie': cookie },
            withCredentials: true
        })
        if (on_lesson_courses.data['data']['on_lessons'] == '') throw (new Date() + `  尚未有课程`);
        if (on_lesson_courses['data']['success'] != true) throw ('cookies不匹配');
        const lessonId = '';
        Axios({
            url: config.baseurl + `/v/lesson/lesson_info_entry/${lessonId}?ppt_version=1.5&source=5`
        })
    }
    catch (e) {
        console.log(e);
    }
};
sgin();