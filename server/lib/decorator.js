const Router=require('koa-router');
const {resolve}=require('path');
const symbolPrefix=Symbol('prefix');
const glob=require('glob');
const routerMap=new Map();

const Route=class Route{
    constructor(app,apipath){
        this.app=app;
        this.apipath=apipath;
        this.router=new Router();
    }
    init(){
        glob.sync(resolve(this.apipath,'./**/*.js')).forEach(require);
        for(let [config,controller] of routerMap){
            const controllers=Array.isArray(controller)?controller:[controller];
            let prefixPath=config.target[symbolPrefix];
            if(prefixPath) prefixPath=normalizePath(prefixPath);
            const routerPath=prefixPath+config.path;
            this.router[config.method](routerPath,...controllers)
        }
        this.app
        .use(this.router.routes())
        .use(this.router.allowedMethods());
    }
};
const controller=path=>target=>(target.prototype[symbolPrefix]=path);
const normalizePath=path=>path.startsWith('/')?path:`/${path}`
const router=conf=>(target,key,descriptor)=>{
    conf.path=normalizePath(conf.path);
    routerMap.set({
        target:target,
        ...conf
    },target[key])
}
const get=path=>router({
    path:path,
    method:'get'
})
const post=path=>router({
    path:path,
    method:'post'
})
 const put=path=>router({
    path:path,
    method:'put'
})
const del=path=>router({
    path:path,
    method:'del'
})
const all=path=>router({
    path:path,
    method:'all'
})
const use=path=>router({
    path:path,
    method:'use'
})
module.exports={
    Route,
    controller,
    get,
    post,
    use,
    all,
    del,
    put
}