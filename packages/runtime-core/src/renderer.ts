import { shapeFlags, createVNode, Text, isSameVNode } from './createVNode';
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
        if(isString(children[i]) || isNumber(children[i])){
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
    function patchProps(oldProps,newProps,el){
        oldProps = oldProps == null ? {} :oldProps
        newProps = newProps == null ? {} :newProps
        for(let key in newProps){
            hostPatchProp(el,key,oldProps[key],newProps[key])
        }
        for(let key in oldProps){
            if(newProps[key] == null){
                hostPatchProp(el,key,oldProps[key],null)
            }
        }
    }
    function mountElement(vnode,dom){
        let {type,props,children,shapFlag} = vnode
        let el = vnode.el = hostCreateElement(type)

        if(props){
            // 更新属性
            patchProps(null,props,el)
        }
        //children 不是字符串 就是数组
        if(shapFlag & shapeFlags.TEXT_CHILDREN ){
            hostSetElementText(el,children)
        }
        if(shapFlag & shapeFlags.ARRAY_CHILDREN){
            mountChildren(children,el)
        }
        hostInsert(el,dom)
    }
    function processText(preVnode,vnode,dom){
        if(preVnode == null){
            hostInsert(vnode.el = hostCreateTextNode(vnode.children),dom)
            
        }
    }
    function unmountChildren(children){
        children.forEach(child => {
            unmount(child)
        });
    }
    function patchKeyedChildren(c1,c2,el){
        // 尽可能的复用 
        // 先考虑一些顺序相同的情况 ，比如 追加 或者删除
        let i = 0 
        let e1 = c1.length - 1
        let e2 = c2.length -1

        while(i <=e1 && i< e2){
            const n1 = c1[i]
            const n2 = c2[i]
            if(isSameVNode(n1,n2)){
                patch(n1,n2,el)
            }else{
                break
            }
            i++
        }
        console.log(i,e1,e2)
    }
    function patchChild(preVnode,vnode,el){
        let c1 = preVnode.children
        let c2 = vnode.children

        const preShapFlag = preVnode.shapFlag
        const ShapFlag = vnode.shapFlag

        // 开始比较儿子情况 

        if(ShapFlag & shapeFlags.TEXT_CHILDREN){ // 文本 数组
            if(preShapFlag & shapeFlags.ARRAY_CHILDREN){
                unmountChildren(c1)
            }
            if(c1 !== c2){
                hostSetElementText(el,c2)
            }
        }else{
            // 最新是 空或者是数组

            if(preShapFlag & shapeFlags.ARRAY_CHILDREN ){
                // 之前是数组
                if(ShapFlag & shapeFlags.ARRAY_CHILDREN){
                    // 前后都是数组
                    // diff 算法
                    patchKeyedChildren(c1,c2,el)
                }else{
                    // 现在没有了
                    unmountChildren(c1)
                }
            }else{
                if(preShapFlag & shapeFlags.TEXT_CHILDREN){
                    hostSetElementText(el,'')
                }
                if(ShapFlag & shapeFlags.ARRAY_CHILDREN){
                    mountChildren(c2,el)
                }
            }
        }
    }
    function patchElement(preVnode,vnode){
        // preVnode,vnode 能服用 节点就不用删除
        let el = vnode.el = preVnode.el
        let oldProps = preVnode.props
        let newProps = vnode.props
        patchProps(oldProps,newProps,el)

        // 接下来比儿子
        patchChild(preVnode,vnode,el)
    }
    function processElement(preVnode,vnode,dom){
        if(preVnode == null){
            mountElement(vnode,dom)
        }else{
            //比较原元素
            patchElement(preVnode,vnode)
        }
    }
    function unmount(preVnode){
        hostRemove(preVnode.el)
    }
    
    function patch(preVnode,vnode,dom){
        // 判断 标签名 跟key 如果一样 说明是同一个节点
        if(preVnode && !isSameVNode(preVnode,vnode)){
            unmount(preVnode)
            preVnode = null // 将preVnode置为 null 就会走vnode 的初始化
        }

        // 看preVnode 如果是null 说明之前没有 直接增加
        const {type,shapFlag} = vnode
        switch(type){
            case Text:
                processText(preVnode,vnode,dom)
                break;
            default:
                if(shapFlag & shapeFlags.ELEMENT){
                    processElement(preVnode,vnode,dom)
                }
        }
        // if(preVnode == null){
        //     mountElement(vnode,dom)
        // }
    }

    function render(vnode,container){
        // 我们需要将vnode 渲染到container中，并且调用options的api
        if(vnode == null){
            //卸载元素
            if(container._vnode){
                unmount(container._vnode)
            }

        }else{
            //更新
            patch(container._vnode || null ,vnode,container)
        }
        container._vnode = vnode
    }
    return {
        render
    }
}