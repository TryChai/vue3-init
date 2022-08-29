import { ref } from '@vue/reactivity';
import { h } from './h';
import { Fragement } from './createVNode';
export function defineAsyncComponent(loaderOptions){
    
    if(typeof loaderOptions === 'function'){
        loaderOptions = {
            loader:loaderOptions
        }
    }
    // 默认加载一个空，之后在加载对应的节点


    let Componet = null
    return {
        setup(){
            const {loader,timeout,errorComponent,
                delay,loadingComponent,onError} = loaderOptions
            const loaded = ref(false)
            const error = ref(false)
            const loading = ref(false)
            if(timeout){
                setTimeout(()=>{
                    error.value = true
                },timeout)
            }
            let timer
            if(delay){
                timer = setTimeout(()=>{
                    loading.value = true
                },delay)
            }else{
                loading.value = true
            }
            //通过 promise 链 来实现重新加载
            function load(){
                return loader().catch(err=>{
                    if(onError){
                        return new Promise((resolve,reject)=>{
                            const retry = ()=>resolve(load())
                            const fail = ()=>reject()
                            onError(retry,fail)
                        })
                    }else{
                        throw Error()
                    }
                })
            }
            load().then(v=>{
                loaded.value = true
                Componet = v
            }).catch(err=>{
                error.value = true
            }).finally(()=>{
                loading.value = false
                clearTimeout(timer)
            })
            return ()=>{
                if(loaded.value){
                    return h(Componet)
                }else if(error.value && errorComponent){
                    return h(errorComponent)
                }else if(loading.value && loadingComponent){
                    return h(loadingComponent)
                }else{
                    //刚开始 渲染错误组件 然后切换成功组件 错误组件没有卸载
                    return h(Fragement,[])

                }
            }
        }
    }
}