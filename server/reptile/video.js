const puppeteer=require('puppeteer');
const base=`https://movie.douban.com/subject/`
const sleep=time=>new Promise(resolve=>{
    setTimeout(resolve,time);
})
process.on('message',async movies=>{
    console.log('start-----')
    const browser = await puppeteer.launch({
        args:['--no-sandbox'],

    });
    const page = await browser.newPage();
    for(let i=0;i<movies.length;i++){
        let doubanId=movies[i].doubanId;
        await page.goto(base+doubanId,{
            waitUntil:'networkidle2'
        });
        await sleep(1000);
        const result=await page.evaluate(()=>{
            let $=window.$;
            let it=$('.related-pic-video');
            if(it&&it.length>0){
                let link=it.attr('href');
                let cover=it.css("backgroundImage").replace('url(','').replace(')','').replace(/\"/g,"");
                return{
                    link,
                    cover
                }
            }
            return {};
        })
        let video;
        if(result.link){
            await page.goto(result.link,{
                waitUntil:'networkidle2'
            })
            sleep(2000);
            video=await page.evaluate(()=>{
                let $=window.$;
                let it=$('source');
                if(it&&it.length>0){
                    return it.attr('src')
                }
                return ''
            })
        }
        const data={
            doubanId,
            cover:result.cover,
            video
        }
        process.send(data);
    }
    browser.close();
    process.exit(0);
})