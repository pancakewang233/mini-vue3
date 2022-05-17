export let activeEffect = undefined;

class ReactiveEffect{
    // effect 默认是激活状态
    public parent = null;
    public active = true;
    public deps = [];
    constructor(public fn){
        this.fn = fn
    }
    // run 是 effect 执行函数
    run(){
        // 非激活的情况，只需要执行函数，不需要进行依赖收集。
        if(!this.active){
            this.fn()
        }

        // 这里就要依赖收集了，核心是将当前的 effect 和稍后渲染的属性关联在一起。
        try{
            this.parent = activeEffect;
            activeEffect = this;
            return this.fn()
        }finally{
            activeEffect = this.parent;
            this.parent = null;
        }
    }
}

// 一个 effect 对应多个属性，一个属性对应多个 effect， 多对多。
const targetMap = new WeakMap();
export const track = (target, type, key) =>{
    // WeakMap = {obj:Map{name:Set}}
    if(!activeEffect) return;

    let depsMap = targetMap.get(target)
    if(!depsMap){
        targetMap.set(target, (depsMap = new Map()))
    }

    let dep = depsMap.get(key)
    if(!dep){
        depsMap.set(key, (dep = new Set()))
    }

    let shouldTrack = !dep.has(activeEffect)
    if(shouldTrack){
        dep.add(activeEffect)
        // 让 effect 记录住对应的dep，稍后清理的时候会用到。
        activeEffect.deps.push(dep)
    }
}

export const trigger = (target, type, key, value) =>{
    const depsMap = targetMap.get(target);
    if(!depsMap) return; // 触发值不在模板中使用

    const effects = depsMap.get(key);
    effects && effects.forEach(effect=>{
        if(effect != activeEffect) effect.run()
    })
}

export const effect = (fn) =>{
    // 创建响应式 effect，fn根据状态变化重新执行，effect可以嵌套着写。
    const _effect = new ReactiveEffect(fn);
    // 默认先执行一次
    _effect.run();
}