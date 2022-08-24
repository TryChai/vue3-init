import { isArray, isString,isObject } from "@vue/shared"

export const Text = Symbol('Text')
export const Fragement = Symbol('Fragement')

export function isVnode(val){
    return val.__v_isVNode
}
export function isSameVNode(v1,v2){
    return v1.type === v2.type && v1.key == v2.key
}
export function createVNode(type,props=null,children=null){
    let shapFlag = isString(type) ? shapeFlags.ELEMENT : 
    isObject(type) ? shapeFlags.STATEFUL_COMPONENT: 0
    //将当前节点跟儿子做映射 权限组合 位运算
    const vnode = { // vnode 要对应真实的节点 
        __v_isVNode:true,
        type,
        props,
        component:null,
        children,
        key:props && props.key,
        el:null, //真实节点的映射
        shapFlag, //打个标记
    }

    if(children != undefined){
        let temp = 0
        if(isArray(children)){
            temp = shapeFlags.ARRAY_CHILDREN
        }else if(isObject(children)){
            temp = shapeFlags.SLOTS_CHILDREN

            //这里还有其他的情况
        }else{
            children = String(children)
            temp = shapeFlags.TEXT_CHILDREN
        } 
        vnode.shapFlag |= temp
    }
    // shapeFlags 我想知道这个虚拟节点的儿子是数组还是元素 还是文本
    return vnode
}

export const enum shapeFlags {
    ELEMENT = 1,
    FUNCTION_COMPONENT = 1 << 1,
    STATEFUL_COMPONENT = 1<<2,
    TEXT_CHILDREN = 1<<3,
    ARRAY_CHILDREN = 1<<4,
    SLOTS_CHILDREN = 1<<5,
    TELEPORT = 1<<6,
    SUSPENSE = 1<<7,
    COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8,
    COMPONENT_KEEP_ALIVE = 1<<9,
    COMPONENT = shapeFlags.STATEFUL_COMPONENT | shapeFlags.FUNCTION_COMPONENT
}

//位运算 
// 通过 | 将2个类型生成 新的类型 然后通过 & 判断生成新的类型跟原来两个类型的关系
// 比如 1 | 2 | 4 = 7 
// 1 & 7 = 1
// 2 & 7 = 2
// 4 & 7 = 4
// 大于0 表示 包含 就是7这个类型 是前面三种类型中的一种 
// 小于等于0  表示7 不属于前面三种的一种