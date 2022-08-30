export function recordEffectScope(effect){
    if(activeEffectScope && activeEffectScope.active){
        activeEffectScope.effects.push(effect)
    }
}
//effectScope 基本收集 子 
export let activeEffectScope
class EffectScope{
    public effects = []
    public parent
    public active = true
    public scopes = []
    constructor(detached){
        console.log(activeEffectScope);
        if(!detached && activeEffectScope){
            activeEffectScope.scopes.push(this)
        }
    }
    run(fn){
        if(this.active){
            try{
                this.parent = activeEffectScope
                activeEffectScope = this
                return fn() //用户里面函数放的返回值
            }finally{
                activeEffectScope = this.parent
            }

        }
       
    }
    stop(){
        if(this.active) {
            this.active = false
            this.effects.forEach(effect=>effect.stop())
        }
        if(this.scopes){
            this.scopes.forEach(scopesEffect=>scopesEffect.stop())
        }
    }
}
export function effectScope(detached){
    return new EffectScope(detached)
}