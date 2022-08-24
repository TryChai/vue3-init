import { instance, setCurrentInstance } from './component';
export const enum LifeCycle{
    BEFORE_MOUNT='bm',
    MOUNTED='m',
    UPDATED='u'
}
function createInvoker(type){
    //闭包 将currentInstance 存起来 当后面调用onMounted的时候 currentInstance就是存起来的那个
    return function(hook,currentInstance = instance){
        if(currentInstance){
            const lifeCycles = currentInstance[type] || (currentInstance[type] = [])
            const wrapHook = ()=>{
                //AOP 切片 
                setCurrentInstance(currentInstance)
                hook.call(currentInstance)
                setCurrentInstance(null)
            }
            lifeCycles.push(wrapHook)
        }
    }
}
//借助函数柯里化 实现参数的内置
export const onBeforeMount = createInvoker(LifeCycle.BEFORE_MOUNT)
export const onMounted = createInvoker(LifeCycle.MOUNTED)
export const onUpdated = createInvoker(LifeCycle.UPDATED)