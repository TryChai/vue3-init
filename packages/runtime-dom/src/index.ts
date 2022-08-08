import { nodeOps } from "./nodeOps";

import { patchProp } from "./patchProp";
import { createRenderer } from '@vue/runtime-core';


const renderOptions = {
    patchProp,...nodeOps
}
//vue 内置的渲染器 我们也可以同个createRenderer 创建一个渲染器
export function render(vnode,container){
   let {render} = createRenderer(renderOptions)
   render(vnode,container)
}
export * from '@vue/runtime-core'