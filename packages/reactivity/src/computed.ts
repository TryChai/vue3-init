import { isFunction } from '@vue/shared';
import { ReactiveEffect, effect, activeEffect, trackEffect, traggeEffect } from './effect';
export function computed(getterOrOptions){
    let isGetter = isFunction(getterOrOptions)
    let getter,setter
    let fn = ()=>console.warn('computed is readonly')
    if(isGetter){
        getter = getterOrOptions
        setter = fn
    }else{
        getter = getterOrOptions.get
        setter = getterOrOptions.set || fn 
    }
    return new ComputedRefImpl(getter,setter)
}
class ComputedRefImpl{
    private _value
    private _dirty = true
    public effect
    public deps
    private _v_isRef = true
    constructor(getter,public setter){
        // 拿到effect实例 让函数执行
       this.effect = new ReactiveEffect(getter,()=>{
        if(!this._dirty){
            this._dirty = true
            traggeEffect(this.deps)
        }
       })
    }
    get value(){ // 只有当。value 的时候 dirty为true执行
        
        if(activeEffect){
            //让计算属性做依赖收集
            // debugger
            trackEffect(this.deps ||(this.deps = new Set()) )
        }
        if(this._dirty){
            this._dirty = false
            this._value = this.effect.run()
        }
        return this._value
    }
    set value(newValue){
        this.setter(newValue)
    }
}