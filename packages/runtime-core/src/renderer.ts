import { shapeFlags, createVNode, Text, isSameVNode, Fragement } from './createVNode';
import { isString, isNumber } from '@vue/shared';
import { createComponentInstance, setupComponent } from './component';
import { ReactiveEffect } from '../../reactivity/src/effect';
import { queueJob } from './scheduler';

function getSequence(arr){
    let len = arr.length
    let p = arr.slice()
    let result = [0]
    let lastIndex
    let start,end ,middle
    for(let i = 0;i<len;i++){
        const arrI = arr[i] 
        if(arrI !== 0){ // 0 代表新增的节点 不计入最长递增子序列
         lastIndex = result[result.length -1]
         if(arr[lastIndex] < arrI){ // 说明当前这一项 比结果集中 最后一项大 放入集合中
            result.push(i)
            p[i] = lastIndex // 存索引
            continue
         }

         //否则的情况
         start = 0
         end = result.length -1 
         //二分查找
         while(start < end){ // 计算有序比较 二分查找
            middle = Math.floor((start + end) /2 )
            if(arr[result[middle]] < arrI){
                start = middle + 1
            }else{
                end = middle
            }
         }
         if(arrI < arr[result[end]]){
            p[i] = result[end-1]
            result[end] = i
         }
        }
    }
    // 倒叙追溯 选取到结果集中的最后一个
    let i = result.length
    let last = result[i-1]

    while(i-->0){ 
        result[i] = last
        last = p[last]
    }
    // console.log(p)
    return result
}

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
    function mountElement(vnode,dom,anchor){
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
        hostInsert(el,dom,anchor)
    }
    function processText(preVnode,vnode,dom){
        if(preVnode == null){
            hostInsert(vnode.el = hostCreateTextNode(vnode.children),dom)
            
        }else{
            const el = vnode.el = preVnode.el
            if(vnode.children !== preVnode.children){
                hostSetText(el,vnode.children)
            }
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


        //sync form start
        // 从前往后比
        while(i <=e1 && i<= e2){
            const n1 = c1[i]
            const n2 = c2[i]
            if(isSameVNode(n1,n2)){
                patch(n1,n2,el)
            }else{
                break
            }
            i++
        }
        // console.log(i,e1,e2)
        // 从后往前比
        while(i <=e1 && i<= e2){
            const n1 = c1[e1]
            const n2 = c2[e2]
            if(isSameVNode(n1,n2)){
                patch(n1,n2,el)
            }else{
                break
            }
            e1--
            e2--
        }
        
        // 向后追加 向前追加  前删除 后删除
        if(i>e1){
            if(i<=e2){
                //往后追加的情况
                while(i<=e2){
                    //判断e2 是不是末尾项
                    const nextPos = e2+1
                    // 看一下下一项是否在数组内 说明有参照物 
                    let anchor = c2.length <= nextPos ? null : c2[nextPos].el
                   // 如果anchor有值  向前插入 如果没值就是往后追加
                    patch(null,c2[i],el,anchor)
                    i++

                }
            }
        }else if(i>e2){ //老的多 新的少
            if(i<=e1){
                while(i<=e1){
                    unmount(c1[i])
                    i++
                }
            }
        }else{
            // console.log(i,e1,e2)
            // unknow sequnce
            // a b  [c d e ] f g
            // a b  [d e q ] f g
    
            let s1 = i //s1->e1 老的需要比对的部分
            let s2 = i // s2->e2 新的需要比对的部分
    
            let toBePatched = e2-s2+1 // 我们要操作的个数
    
            const keyToNewIndexMap = new Map()
            for(let i = s2;i<=e2;i++){
                keyToNewIndexMap.set(c2[i].key,i)
            }
    
            const seq = new Array(toBePatched).fill(0)
    
            for(let i = s1;i<=e1;i++){
                const oldVNode = c1[i]
                let newIndex = keyToNewIndexMap.get(oldVNode.key)
                if(newIndex ==  null){
                    unmount(oldVNode)
                }else{ 
                    // 新的老的都有 记录当前对应的索引 
                    // 用新的位置 跟老的位置关联
                    seq[newIndex - s2] = i + 1 // 这里是因为0可能是新增的（默认为0）可能是第一个
                    patch(oldVNode,c2[newIndex],el) // 如果新老都有 就比较属性跟 子节点
                }
            }

            let incr = getSequence(seq)
            // console.log(incr)
            let j = incr.length - 1

            // toBePatched = 4 
            // incr = [1,2]

            // console.log(seq)
            for(let i=toBePatched-1;i>=0;i--){
                const currentIndex = s2+i //找到对应的索引
                const child = c2[currentIndex] // q d e 
                const anchor = currentIndex +1 <=c2.length ? c2[currentIndex+1].el : null
                //判断 要移动 还是新增
                // 如何 知道child 是新增的
                if(seq[i] === 0 ){ // 如果有el 说明渲染过
                    patch(null,child,el,anchor)
                }else{ // 这里应该尽量减少移动的节点，最长递增子序列来实现
                    if( i != incr[j]){ // 通过序列来进行比对 
                        hostInsert(child.el,el,anchor)
                    }else{
                        j-- // 不做任何操作
                    }
                }
            
            }
            // console.log(keyToNewIndexMap)

        }

    }
    // vue 中在使用的时候 必须有一个根节点 在一个代码块中
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
    function processElement(preVnode,vnode,dom,anchor){
        if(preVnode == null){
            mountElement(vnode,dom,anchor)
        }else{
            //比较原元素
            patchElement(preVnode,vnode)
        }
    }
    function unmount(preVnode){
        if(preVnode.type === Fragement){
            return unmountChildren(preVnode.children)
        }
        hostRemove(preVnode.el)
    }
    function processFragement(preVnode,vnode,dom){
        if(preVnode == null){
            mountChildren(vnode.children,dom)
        }else{
            patchKeyedChildren(preVnode.children,vnode.children,dom)
        }
    }
    function updateComponentPreRender(instance,next){
        instance.next = null
        instance.vnode = next
        updateProps(instance,instance.props,next.props)
    }
    function setupRenderEffect(instance,dom,anchor){
        const componentUpdate = ()=>{
            const {render,data,proxy} = instance
            // render 的函数可以取到data 也可以取到props 也可以取到attr
            if(!instance.isMounted){
                //组件最重要渲染的 虚拟节点
              const subTree = render.call(proxy)
              patch(null,subTree,dom,anchor)
              instance.subTree = subTree
              instance.isMounted = true
            }else{
               //更新逻辑
            //统一处理
              let next = instance.next
              if(next){ // 更新属性
                updateComponentPreRender(instance,next)
              }

               const subTree = render.call(proxy)
               patch(instance.subTree,subTree,dom,anchor)
               instance.subTree = subTree
            }
        }
        const effect = new ReactiveEffect(componentUpdate,()=>queueJob(instance.update))
        let update = instance.update = effect.run.bind(effect)
        update()
    }

   /**
    * 组件渲染过程
    * 1、创建实例 这里会有一个代理对象 会代理data,props,attrs
    * 2、给组件实例赋值，给instance 属性赋值
    * 3、创建一个effect 运行
    * 
    * 组件更新过程
    * 1、组件的状态发生变化会触发自己的effect重新执行
    * 2、属性更新，会执行updateCOmponent内容会比较要不要更新如果要更新 会调用instance的update方法，在调用render之前更新属性即可
    *
    * data，props,attrs 都被代理到instance.proxy上 
    * instance.data 是响应式的 如果直接修改data 里面的值 在代理里面是直接修改的 
    * instance.props 是响应式的 但是页面拿到的是代理过的proxy 的值并不是响应式的
    * 如果父组件修改了props 的值  就会在differ 算法里里面对比然后修改instance.props的值达到更新的目的
    * */

    function mountComponent(vnode,dom,anchor){
        // 1、组件挂载前 需要产生一个组件的实例，组件的状态，属性 生命周期
        const instance = vnode.component = createComponentInstance(vnode)
        // 2、组件的插槽 处理组件的属性 给组件的实例复制
        //这个地方处理属性和插槽
        
        setupComponent(instance)
        // 3、 给组件产生一个effect 这样可以组件变化后重新渲染
        setupRenderEffect(instance,dom,anchor)

        // 组件的 优点  复用 逻辑拆分 方便维护 vue组件级别更新
    }
    function hasChange(preProps,nextProps){
        for(let key in nextProps){
            if(nextProps[key] != preProps[key]){
                return true
            }
        }
        return false
    }
    function updateProps(instance,preProps,nextProps){
        // 比较2个属性是否有差异
        if(hasChange(preProps,nextProps)){
            for(let key in nextProps){
                // 这里可以直接修改 
                // 页面代理的是proxy 就是组件内部的this 被代理到instance.proxy上了
                // 可以修改instance.props 但是不能修改instance.proxy
                instance.props[key] = nextProps[key]
            }
            for(let key in instance.props){
                if(!(key in nextProps)){
                    delete instance.props[key]
                }
            }
        }
    }
    function shouldComponentUpdate(preVnode,vnode){
        const preProps = preVnode.props
        const nextProps = vnode.props
        return hasChange(preProps,nextProps) // 如果属性 变化 就要更新
    }
    function updateComponent(preVnode,vnode){
        //拿到之前的属性 跟之后的属性是否有变化
        const instance = vnode.component = preVnode.component
        
        if(shouldComponentUpdate(preVnode,vnode)){
            instance.next = vnode
            instance.update()
        }else{
            instance.vnode = vnode
        }
        //找个props 包含了 attrs
        // preProps,nextProps 是传进来的props 是父组件上面写的props 不是响应数据
        // instance.props 是子组件上面使用的props 是响应数据  
        // const preProps = preVnode.props
        // const nextProps = vnode.props

        // updateProps(instance,preProps,nextProps)
    }
    function processComponent(preVnode,vnode,dom,anchor){
        if(preVnode == null){
            // 初始化组件
            mountComponent(vnode,dom,anchor)
        }else{
            // 组件更新 插槽的更新
            updateComponent(preVnode,vnode)
        }
    }
    function patch(preVnode,vnode,dom,anchor = null){
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
            case Fragement:
                processFragement(preVnode,vnode,dom)
                break
            default:
                if(shapFlag & shapeFlags.ELEMENT){
                    processElement(preVnode,vnode,dom,anchor)
                }else if(shapFlag & shapeFlags.STATEFUL_COMPONENT){
                    processComponent(preVnode,vnode,dom,anchor)
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