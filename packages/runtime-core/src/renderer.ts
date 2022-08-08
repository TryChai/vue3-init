import { shapeFlags, createVNode, Text } from './createVNode';
import { isString, isNumber } from '../../shared/src/index';

export function createRenderer(options){
    // 用户可调用此方法 传入对应的渲染选项
    let {
        createElement:hostCreateElement,
        createTextNode:hostCreateTextNode,
        insert:hostInsert,
        remove:hostRemove,
        querySelector:hostQuerySelector,
        parentNode:hostParentNode,
        nextSibling:hostNextSibling,
        setText:hostSetText,
        setElementText:hostSetElementText,
        patchProp:hostPatchProp
    } = options

    function normalize(children,i){
        if(isString(children[i]) && isNumber(children[i])){
            //给文本加标识  不能给字符串加 ，要给对象加
            children[i] = createVNode(Text,null,children[i])
        }
        return children[i]
    }

    function mountChildren(children,container){
        for(let i = 0;i<children.length;i++){

            // 处理后 不会改变children 的内容
            let child = normalize(children,i)
            //child 可能是文本 把文本变成虚拟节点


            patch(null,child,container) //递归渲染子节点
        }
    }

    function mountElement(vnode,dom){
        let {type,props,children,shapFlag} = vnode
        let el = vnode.el = hostCreateElement(type)
        //children 不是字符串 就是数组
        if(shapFlag & shapeFlags.TEXT_CHILDREN ){
            hostSetElementText(el,children)
        }
        if(shapFlag & shapeFlags.ARRAY_CHILDREN){
            mountChildren(children,el)
        }
        hostInsert(el,dom)
    }

    function patch(preVnode,vnode,dom){
        // 看preVnode 如果是null 说明之前没有 直接增加
        if(preVnode == null){
            mountElement(vnode,dom)
        }
    }

    function render(vnode,container){
        // 我们需要将vnode 渲染到container中，并且调用options的api
        console.log(vnode,container)

        if(vnode == null){
            //卸载元素


        }else{
            //更新
            patch(container._vnode || null ,vnode,container)
        }
    }
    return {
        render
    }
}