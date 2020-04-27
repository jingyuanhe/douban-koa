const Koa=require('koa');

const {connect,initSchemas,initAdmin}=require('./database/init');
const R = require('ramda');
const {resolve}=require('path');
const MIDDLEWARES=['router'];
const useMiddlewares=(app)=>{
    R.map(
        R.compose(
            R.forEachObjIndexed(
                initWith=>initWith(app)
            ),
            require,
            name=>resolve(__dirname,`./middlewares/${name}`)
        )
    )(MIDDLEWARES)
}
;(async ()=>{
    await connect();
    initSchemas();
    await initAdmin();
    require('./tasks/qiniu')
   // require('./tasks/trailer')
  // require('./tasks/api');
    //require('./tasks/movie');
    const app=new Koa();
    await useMiddlewares(app);
    app.listen(3000);
})()

