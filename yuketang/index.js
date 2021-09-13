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
var sgin = async () => {
    try {
        const ret = await Axios({
            method: 'post',
            url: config.baseurl + '/pc/login/verify_pwd_login/',
            data: {
                type: "PP",
                name: config.name,
                pwd: config.password
            },
            responseType: 'json',
        })
        if (ret.data.success != true) throw (ret.data);
        const setCookies = ret.headers['set-cookie'];
        const cookies = {
            csrftoken: setCookies[0].slice(10, 42),
            sessionid: setCookies[1].slice(10, 42)
        }
        const cookie = `csrftoken=${cookies['csrftoken']};sessionid=${cookies['sessionid']};django_language=zh-cn;`
        // 🐟课堂有两个接口
        // console.log(1);
        const on_lesson_courses1 = await Axios({
            method: 'get',
            url: config.baseurl + '/v/course_meta/on_lesson_courses',
            headers: { 'Cookie': cookie },
            withCredentials: true
        });

        const on_lesson_courses3 = await Axios({
            method: 'get',
            url: config.baseurl + '/api/v3/classroom/on-lesson',
            headers: { 'Cookie': cookie },
            withCredentials: true
        });
        // console.log(on_lesson_courses3.data['data']['onLessonClassrooms'][0]);
        const v1Lesson = on_lesson_courses1.data['data'] ? on_lesson_courses1.data['data']['on_lessons'][0] : [];
        const v3Lesson = on_lesson_courses3.data['data'] ? on_lesson_courses3.data['data']['onLessonClassrooms'][0] : [];
        if (!v1Lesson && !v3Lesson) throw (new Date() + `  尚未有课程`);
        if (v1Lesson) {

            const lessonName = v1Lesson['name'];
            const lessonId = v1Lesson['lesson_id'];
            const signIn = await Axios({
                method: 'get',
                url: config.baseurl + `/v/lesson/lesson_info_v2?lesson_id=${lessonId}&source=5`,
                headers: { 'Cookie': cookie },
            })
            if (signIn.data != undefined) console.log(lessonName + " 签到成功 " + new Date());

        }
        if (v3Lesson) {
            const lessonName = v3Lesson['courseName'];
            const lessonId = v3Lesson['lessonId'];
            const signIn = await Axios({
                method: 'post',
                url: config.baseurl + `/api/v3/lesson/checkin`,
                headers: {
                    'Cookie': cookie,
                    'Referer': 'https://changjiang.yuketang.cn/lesson'
                },
                data: {
                    'source': 5,
                    'lessonId': lessonId
                }
            })
            if (signIn.data['code'] == 0) console.log(lessonName + " 签到成功 " + new Date());
        }

    }
    catch (e) {
        console.log(e);
    }
};
sgin();