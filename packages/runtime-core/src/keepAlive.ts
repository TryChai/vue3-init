import { getCurrentInstance } from './component';
import { shapeFlags } from './createVNode';
import { onMounted ,onUpdated} from './apiLifeCycle';
export const KeepAlive = {
    __isKeepAlive:true,//自定义用来标识keepalive组件
    setup(props,{slots}){

        const keys = new Set() //缓存组件的key
        const cache = new Map() //缓存组件的映射关系

        //dom 操作的api 都在 instance.ctx.renderer上
        const instance = getCurrentInstance()
       
        let {createElement,move,unmount} = instance.ctx.renderer

        let storageContainer = createElement('div')

        instance.ctx.activated=(vnode,dom,anchor)=>{
            move(vnode,dom,anchor)
        }
        instance.ctx.deactivated = (n1)=>{
            move(n1,storageContainer)//组件卸载的时候 会将虚拟几点对应的真实节点 移除到容器中
        }

        let pendingCacheKey = null
        const cacheSubTree = ()=>{
            cache.set(pendingCacheKey,instance.subTree)
        }
        onMounted(cacheSubTree)
        onUpdated(cacheSubTree)

        return ()=>{
            let vnode = slots.default()
            
            if(!(vnode.shapFlag & shapeFlags.COMPONENT)){
                return vnode
            }
            let comp  = vnode.type
            let key = vnode.key == null ? comp :vnode.key
            pendingCacheKey = key

            let cacheVNode = cache.get(key)
            if(cacheVNode){
               vnode.component = cacheVNode.component
               vnode.shapFlag |= shapeFlags.COMPONENT_KEEP_ALIVE

            }else{
                keys.add(key)
            }
            vnode.shapFlag |= shapeFlags.COMPONENT_SHOULD_KEEP_ALIVE // 用来告诉这个vnode 卸载的时候 应该缓存起来
            //获取到了虚拟节点
            
            return vnode
        }
    }

}