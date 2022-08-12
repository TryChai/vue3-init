export function patchStyle(el,preValue,nextValue){
    preValue = preValue ? preValue : {}
    nextValue = nextValue ? nextValue : {}
    // 比对 两个对象 需要同时遍历 新的和老的
    const style = el.style
    for(let key in nextValue){
        style[key] = nextValue[key]
    }
    if(preValue){
        for(let key in preValue){
            if(nextValue[key] == null){
                //老的 有 新的没有 需要删除老的
                style[key] = null
            }
        }
    }
}