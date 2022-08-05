import { triggerRef } from 'vue';
import { track, trigger } from './effect';
import { isObject } from '../../shared/src/index';
import { reactive } from './reactive';
export const enum ReactiveFlags {
    IS_REACTIVE = '_v_isReactive'
}
export function isReactive(value){
    return value && value[ReactiveFlags.IS_REACTIVE]
}
export const baseHandler =  {
    get(target,key,receiver){
        if(key === ReactiveFlags.IS_REACTIVE){
            return true
        }
        // 收集依赖
        track(target,key)

        // lazy proxy 如果属性是对象 就继续代理
        let res = Reflect.get(target,key,receiver)
        if(isObject(res)){
            return reactive(res)
        }
        // console.log('这里可以记录哪个属性使用了哪个effect')
        return res
    },
    set(target,key,value,receiver){
        
        //数据变化后要根据属性值找到对应的effect 列表让其依次执行
        
        let oldValue = target[key]
        let result = true
        if(oldValue !== value){
            result = Reflect.set(target,key,value,receiver)
            trigger(target,key,value)
        }
        return  result
    }
}