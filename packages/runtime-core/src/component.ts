import { isFunction } from '@vue/shared';
import { reactive } from '@vue/reactivity';
export function createComponentInstance(vnode){
    let instance = {
        data:null, //组件本身的数据
        vnode,//标识实例对应的虚拟节点
        subTree:null,// 组件对用的渲染虚拟节点
        isMounted:false,//组件是否挂载过
        update:null,//组件的effect
        render:null,

        //vnode .type.props 这个是接收的
        // vnode.props 这个是 父组件传的

        poprsOptions:vnode.type.props || {},
        poprs:{}, // 代表用户接收的
        attrs:{}, // 代表用户么有接受的
    }


    return instance
}
function  initProps(instance,rawProps){
    const props = {}
    const attrs = {}

    const options = instance.propsOptions
    if(rawProps){
        for(let key in rawProps){
            const value = rawProps[key]
            if(key in options){
                props[key] = value
            }else{
                attrs[key] = value
            }
        }
    }
    instance.props = props
    instance.attrs = attrs
}
export function setupComponent(instance){
    //type 就是用户传入的属性
    let {type,props,children} = instance.vnode
    let {data,render} = type
    initProps(instance,props)
    if(data){
       if(!isFunction(data)){
         return
       } 
       instance.data = reactive(data.call())
    }
    instance.render = render
}