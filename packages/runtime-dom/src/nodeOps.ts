export const nodeOps = {
    createElement(tagName){
        return document.createElement(tagName)
    },
    createTextNode(text){
        return document.createTextNode(text)
    },
    insert(element,container,anchor = null){
        container.insertBefore(element,anchor) //如果 anchor为null 则是appendChild
    },
    remove(child){
        const parent = child.parentNode
        if(parent){
            parent.removeChild(child)
        }
    },
    querySelector(selectors){
        return document.querySelector(selectors)
    },
    parentNode(child){
        return child.parentNode
    },
    nextSibling(child){
        return child.nextSibling
    },
    setText(element,text){ //给文本节点设置内容
        element.nodeValue = text
    },
    setElementText(element,text){ // 给元素节点设置内容
        element.textContent = text
    }
}
//创建元素节点 创建文本节点 节点的增删改查 获取父子关系