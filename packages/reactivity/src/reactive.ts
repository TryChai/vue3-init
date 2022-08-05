import { isObject } from "@vue/shared"
import {baseHandler,ReactiveFlags} from "./baseHandler";


const reactiveMap = new WeakMap() //key 必须是对象
// v8 垃圾回收机制 ，标记删除 引用计数 



export function reactive(target){
    if(!isObject(target)){
        return target
    }
    if(target[ReactiveFlags.IS_REACTIVE]){
        return target
    }
    const existing = reactiveMap.get(target)
    if(existing){
        return existing
    }
    const proxy = new Proxy(target,baseHandler)
    reactiveMap.set(target,proxy)
    //一个对象 被代理了 就不要代理了

    return proxy
}
// 使用proxy 要搭配Reflect 来使用

// let person = {
//     name:'ab',
//     get aliasName(){ // 属性访问器
//         return this.name + 'jb'
//     }
// }
// const proxy = new Proxy(person,{
//     get(target,key,receiver){
//         console.log('这里可以记录哪个属性使用了哪个effect')
//         return Reflect.get(target,key,receiver)
//     },
//     set(target,key,value,receiver){
//         console.log('这里可以通知effect重新执行')
//         return Reflect.set(target,key,value,receiver)
//     }
// })
// proxy.aliasName
//  这里取aliasName 值的时候 执行了get 方法
// 但是 aliasName 是基于name 取值 原则上应该再访问一次name
// 然而 this.name 并没有对proxy 的get 也意味着后面修改name 
// 不会导致页面更新

// 用了reflect之后 就会再调用一次get 而且 会从target上面重新取值
// 这就是为啥proxy要跟reflect配合使用