import { isFunction ,hasOwn , isObject} from '@vue/shared';
import { reactive,proxyRefs } from '@vue/reactivity';
import { shapeFlags } from './createVNode';

export let instance = null

export const getCurrentInstance = ()=>instance

export const setCurrentInstance = i => instance = i
export function createComponentInstance(vnode,parent){
    let instance = {
        data:null, //组件本身的数据
        vnode,//标识实例对应的虚拟节点
        subTree:null,// 组件对用的渲染虚拟节点
        isMounted:false,//组件是否挂载过
        update:null,//组件的effect
        render:null,

        //vnode .type.props 这个是接收的
        // vnode.props 这个是 父组件传的

        propsOptions:vnode.type.props || {},
        props:{}, // 代表用户接收的
        attrs:{}, // 代表用户么有接受的
        proxy:null,//代理对象
        setupState:{},//setup 返回的是对象则要给这个对象赋值
        slots:{} ,//存放组件的所有插槽信息
        exposed:{},
        parent,// 标记父组件
        provides:parent?parent.provides:Object.create(null),
        //如果 儿子在provide中提供了属性 会影响父亲
        // 在用户用provide（）的时候 将父亲provide 拷贝一份
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
    
    instance.props = reactive(props) // 内部使用的是浅的响应式 
    instance.attrs = attrs // 默认不是响应式的
 
}
const publicProperties = {
    $attrs:(instance)=>instance.attrs,
    $slots:(instance)=>instance.slots,
}
//代理
const instanceProxy = {
    get(target,key,receiver){
        const {data,props,setupState} = target
        if(data && hasOwn(data,key)){
            return data[key]
        }else if(setupState && hasOwn(setupState,key)){
            return setupState[key]
        }else if(props && hasOwn(props,key)){
            return props[key]
        }
        let getter = publicProperties[key]

        if(getter){
            return getter(target)
        }
       
    },
    set(target,key,value,receiver){
        const {data,props,setupState} = target
        if(data && hasOwn(data,key)){
             data[key] = value
        }else if(setupState && hasOwn(setupState,key)){
            setupState[key] = value
        }else if(props && hasOwn(props,key)){
            console.warn('props no update')
            return 
        }
        return true
    }
}
function initSlots(instance,children){
    if(instance.vnode.shapFlag & shapeFlags.SLOTS_CHILDREN){
        instance.slots = children
    }
}
export function setupComponent(instance){
    //type 就是用户传入的属性
    let {type,props,children} = instance.vnode
    let {data,render,setup} = type
    initProps(instance,props)
    initSlots(instance,children) 
    instance.proxy = new Proxy(instance,instanceProxy)
    if(data){
       if(!isFunction(data)){
         return
       } 
       instance.data = reactive(data.call())
    }
    if(setup){
        //setup 在执行的时候有2个参数
        const context = {
            emit:(eventName,...args)=>{
                const name = `on${eventName[0].toUpperCase()}${eventName.slice(1)}`
                const invoker = instance.vnode.props[name]
                invoker && invoker(...args)
            },
            attrs:instance.attrs,
            slots:instance.slots,//插槽
            expose:(exposed)=>{
                instance.exposed = exposed || {}
            }
            
            
        }
        setCurrentInstance(instance)
        const setupResult = setup(instance.props,context)
        setCurrentInstance(null)
        if(isFunction(setupResult)){
            instance.render = setupResult
        }else if(isObject(setupResult)){
            //数据,代理取值
            instance.setupState = proxyRefs(setupResult) //bug
        }
    }
    if(!instance.render){
        if(render){
            instance.render = render
        }else{
            //模板编译
        }
    }
    // 最终一定要获取到对应的 render 函数
}