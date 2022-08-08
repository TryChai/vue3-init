import { isObject, isArray } from '../../shared/src/index';
import { createVNode, isVnode } from './createVNode';


export function h(type,propOrChildren,children){
    
    // h方法 如果参数有两种情况 1）元素+属性 2）元素+儿子
    const l = arguments.length

    if(l == 2){
        //如果propOrChildren 是对象 有2种可能 可能是儿子 可能是prop
        if(isObject(propOrChildren) && !isArray(propOrChildren)){
            // 要么是元素对象 要么是属性
            if(isVnode(propOrChildren)){
                return createVNode(type,null,[propOrChildren])
            }
            return createVNode(type,propOrChildren)
        }else{
            //儿子是数组或者 字符串
            return createVNode(type,null,propOrChildren)
        }
    }else{
        if(l == 3 && isVnode(children)){
            children = [children]
        }else if(l>3){
            children = Array.from(arguments).slice(2)
        }
        return createVNode(type,propOrChildren,children)
    }
}