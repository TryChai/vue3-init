import { isObject } from "@vue/shared"
import { trackEffect, traggeEffect } from "./effect"
import { reactive } from "./reactive"

export function ref(value){
    return new RefImpl(value)
}
export function toReactive(value){
    return isObject(value) ? reactive(value) :value
}
export function toRef(object,key){
    return new ObjectRefImpl(object,key)
}
export function proxyRefs(object){
    return new Proxy(object,{
        get(target,key,receiver){
            let r = Reflect.get(target,key,receiver)
           return r._v_isRef ? r.value : r
        },
        set(target,key,value,receiver){
            if( target[key]._v_isRef ) {
                target[key].value = value
                return true
            }
           return Reflect.set(target,key,value,receiver)
        }
    })
}
export function toRefs(object){
    let result = {}
    for(let key in object){
        result[key] = new ObjectRefImpl(object,key)
    }
    return result
}
class RefImpl{
    private _value
    private dep
    private _v_isRef = true
    constructor(public rawValue){
        // rawValue 可能是个对象 
        this._value = toReactive(rawValue)
    }
    get value(){
        //这里需要依赖收集 

        trackEffect(this.dep || (this.dep = new Set()))
        return this._value
    }
    set value(newValue){
        if(newValue != this.rawValue) {
            this._value = toReactive(newValue)
            this.rawValue = newValue
            traggeEffect(this.dep)
        }
        
    }
}
class ObjectRefImpl{
    private _v_isRef = true
    constructor(public object,public key){}
    get value(){
        return this.object[this.key]
    }
    set value(newValue){
        this.object[this.key] = newValue
    }   
}