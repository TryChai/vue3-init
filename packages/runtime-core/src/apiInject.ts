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

// provide('a',1)
// provide('a',2)
// provide('c',3) //后面的会覆盖前面的