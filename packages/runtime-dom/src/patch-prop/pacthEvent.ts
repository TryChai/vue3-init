// click ()=>fn1 ()=> fn2 不需要每次 add  和remove
function createInvoker(preValue){
    const invoker = (e) => {invoker.value(e)} // 都要调用才会执行
    invoker.value = preValue // 后续只要更改value就可以达到调用不同的逻辑
    return invoker
}
export function patchEvent(el,eventName,nextValue){
    const invokers = el._vei || (el._vei = {})

    const exitingInvoker = invokers[eventName]

    if(exitingInvoker && nextValue){ // 进行换绑
        exitingInvoker.value = nextValue
    }else{
        const eName = eventName.slice(2).toLowerCase()
        if(nextValue){
            //不存在缓存 addEventlistener()
        
            const invoker = createInvoker(nextValue)
            invokers[eventName] = invoker
            el.addEventListener(eName, invoker)

        }else if(exitingInvoker){
            //没有新值  之前绑定过
            el.removgeEventListener(eName, exitingInvoker)
            invokers[eventName] = null
        }
    }


}