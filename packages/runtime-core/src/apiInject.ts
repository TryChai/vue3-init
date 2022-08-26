import { instance } from './component';
export function provide(key,value){
    //provide 必须用到setup 中
    if(!instance) return 
    let parentProvides = instance.parent && instance.parent.provides
    
    //第一次 应该创建全新的
    let currentProvides = instance.provides //自己身上的
    //下一个儿子可以拿到所有的provides
    if(currentProvides === parentProvides ){ //第一次
        currentProvides = instance.provides =  Object.create(parentProvides)

    }
    currentProvides[key] = value
    
    
}

export function inject(key,defaultValue){
    if(!instance) return
    const provides = instance.parent?.provides //父组件的provides
    if(provides && (key in provides)){
        return provides[key]
    }else{
        return defaultValue
    }
}

// 前置条件：组件的实例的provides指向的是parent。provides
// 1)我们先取出自己父亲的provides，默认和自己的provides相同，创建一个新的，重新给自己的provides赋值
// 2）在上面添加属性
// 3）再次provides的时候，我拿父亲的provides，再取出自己的provides，此时不相等了，直接用自己身上的添加属性

// provide('a',1)
// provide('a',2)
// provide('c',3) //后面的会覆盖前面的