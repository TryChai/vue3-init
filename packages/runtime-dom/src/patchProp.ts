//给属性打补丁
//类名
// 行内样式
// 事件
// 其他属性

import { patchEvent } from "./patch-prop/pacthEvent"
import { patchAttr } from "./patch-prop/patchAttr"
import { patchClass } from "./patch-prop/patchClass"
import { patchStyle } from "./patch-prop/patchStyle"

export const patchProp = (el,key,preValue,nextValue)=> {
    if(key === 'class'){
        patchClass(el,nextValue)
    }else if(key === 'style'){
        patchStyle(el,preValue,nextValue)
    }else if(/on[^a-z]/g.test(key)){ // onClick
        patchEvent(el,key,nextValue)
    }else{
        patchAttr(el,key,nextValue)
    }
}
