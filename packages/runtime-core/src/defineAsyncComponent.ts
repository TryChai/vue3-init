import { ref } from '@vue/reactivity';
import { h } from './h';
import { Fragement } from './createVNode';
export function defineAsyncComponent(loader){
    // 默认加载一个空，之后在加载对应的节点
    let Componet = null
    return {
        setup(){
            const loaded = ref(false)
            loader().then(v=>{
                loaded.value = true
                Componet = v
            })
            return ()=>{
                return loaded.value ? h(Componet):h(Fragement,[])
            }
        }
    }
}