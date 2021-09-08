const Axios = require('axios');
const fs = require('fs');
// 镜像P站 https://pixivic.com/ , API：https://pix.ipv4.host/
const pixiv_url = 'https://pix.ipv4.host/ranks'

const getDate = () => {
    date = new Date();
    const month = date.getMonth() + 1 < 10 ? ('0'.concat(date.getMonth() + 1)) : date.getMonth()
    const day = date.getDate() - 3 < 10 ? ('0'.concat(date.getDate() - 3)) : date.getDate() - 3
    const yymmddDate = `${date.getFullYear()}-${month}-${day}`;
    return yymmddDate;
}
// console.log(getDate());

// https://pix.ipv4.host/ranks?page=1&date=2021-09-03&mode=day&pageSize=10
Axios.get(
    pixiv_url,
    {
        params: {
            page: 3,
            date: getDate(),
            mode: 'day',
            pageSize: 30
        }
    })
    .then(ret => ret.data)
    .then(async (ret) => {
        if(ret.message !='获取排行成功') return console.error('获取排行失败');
        const data = await ret.data;
        var imageUrls = [];
        for (singleArr of data) {
            // const imageUrls = singleArr['imageUrls'];
            // console.log(imageUrls);rd
            const originUrl = singleArr['imageUrls'][0]['original'];
            const imageUrl = originUrl.replace('i.pximg', 'o.acgpic');
            // https://o.acgpic.net/img-original/img/2021/09/02/05/30/08/92442686_p0.jpg  
            imageUrls.unshift(imageUrl);
        }
        return imageUrls;
    })
    .then((imageUrls) => {
        imageUrls.forEach(element => {
            Axios.get(element, {
                headers: {
                    Referer: 'https://pixivic.com/'
                },
                responseType: 'stream'
            })
                .then(ret => ret)
                .then(async (ret) => {
                    filename = element.slice(-10);
                    // fs.writeFile(filename, ret, (err) => {
                    //     if (err) throw err;
                    //     console.log('保存成功');
                    // })
                    await ret.data.pipe(fs.createWriteStream('./images/' + filename));
                    console.log(filename+'保存成功');
                }).catch((e)=>{
                    console.log(e);
                })
        });
    })
