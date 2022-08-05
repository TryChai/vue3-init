
export　let activeEffect = undefined
function cleanEffect(effect){
    //清理effect 中存入属性中 set 中的effect

    // 每次执行前都需要将effect 只对应属性的set集合都清理掉
    let deps = effect.deps
    for(let i = 0; i <deps.length ; i++){
        deps[i].delete(effect)
    }
    effect.deps.length = 0
}
export class ReactiveEffect{
    public active = true
    public parent = null
    public deps = []
    constructor(public fn,public scheduler?){ // 传递的fn 放到this 上
        
    }
    run(){
        //依赖收集 让属性跟effect产生关联
        if(!this.active){
            return this.fn()
        }else{
            try{
                this.parent = activeEffect
                activeEffect = this
                cleanEffect(this)
                return this.fn()
            }finally{
                //取消activeEffect 的收集
                activeEffect = this.parent
                this.parent = null
            }

        }
        
    }
    stop(){
        if(this.active) this.active = false
        cleanEffect(this)
    }
}


//哪个对象中 的哪个属性对应哪个effect 一个属性可以对应多个effect
// 外层用一个map{object:{name:[effect,effect]}

const targetkMap = new WeakMap()

export function trigger(target,key,value){
    let depsMap = targetkMap.get(target)
    if(!depsMap){
        return
    }
    let effects = depsMap.get(key)
    traggeEffect(effects)
}

export function traggeEffect(effects){
    if(effects){
        effects = new Set(effects) // 复制一个新的 避免循环的时后死循环
        effects.forEach(effect => {
            if(effect !== activeEffect){ // 如果是通一个的话 就会死循环
                if(effect.scheduler){
                    effect.scheduler()
                }else{
                    effect.run() //重新执行effect
                }
            }
        });
    }
}
export function  track(target,key){
    if(activeEffect){
        let depsMap = targetkMap.get(target)
        if(!depsMap){
            targetkMap.set(target,(depsMap = new Map()))
        }
        let deps = depsMap.get(key)
        if(!deps){
            depsMap.set(key,(deps = new Set()))
        }
        trackEffect(deps)
       
        // console.log(targetkMap)
      
    }
   //让属性记录所 用到的effect 哪个effect 对应了哪个属性
}
export function trackEffect(deps){
    let shouleTrack = !deps.has(activeEffect)
    if(shouleTrack){
        deps.add(activeEffect)
        activeEffect.deps.push(deps)
    }
}

export function effect(fn,options = {} as any){

    

    //将用户传递的函数 变成响应式的effect

    const _effect = new ReactiveEffect(fn,options.scheduler)
    // 更改 runner 中的this
    _effect.run()
    
    const runner = _effect.run.bind(_effect)

    runner.effect = _effect //暴露effect实例
    return runner
}