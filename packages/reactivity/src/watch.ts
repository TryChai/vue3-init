import { isReactive } from './baseHandler';
import { ReactiveEffect } from './effect';
import { isFunction, isObject } from '../../shared/src/index';

//对value 进行迭代访问 这样稍后执行effect的时候 会默认取值，取值的时候会收集
function traversal(value,set = new Set()){ //set用来存放迭代过的对象
    // 递归访问
    if(!isObject(value)){
        return value
    }
    if(set.has(value)){
        return value
    }
    set.add(value) // 说明对象已经迭代过了
    for(let key in value){
        traversal(value[key],set)
    }
    return value
}
export function watch(source,cb){
    let get
    if(isReactive(source)){
        //创建一个effect 让这个effect 收集这个对象的所有属性 
       console.log('是响应式对象') 
        get = ()=>traversal(source)
    }else if(isFunction(source)){
        get = source // souurce 是一个函数
    }
    let oldValue 
    const job = ()=>{
        //数据变化后重新调用effect.run 函数 获取新值
        let newValue = effect.run()
        cb(newValue,oldValue)
    }
    const effect = new ReactiveEffect(get,job)
    // 默认调用run 方法 会执行get 函数,此时 source作为第一次的值
    oldValue = effect.run() // 默认执行一次
}