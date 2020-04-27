

//Map转数组
const m=new Map([['name','张三'],['age',15],['sex']]);
console.log([...m])
//Map转为对象
const o=new Map();
o.set('name','张三');
o.set('age',13);
function mapToObj(str){
    let obj=Object.create(null);
    for(let [k,v] of str){
      obj[k]=v;
    }
    return obj
}
console.log(mapToObj(o));
//对象转为 Map
let obj = {"a":1, "b":2};
let map = new Map(Object.entries(obj));