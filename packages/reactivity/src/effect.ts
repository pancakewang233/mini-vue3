export let activeEffect = undefined;

class ReactiveEffect{
    // effect 默认是激活状态
    active = true
    fn = null
    constructor(fn){
        this.fn = fn
    }
    // run 是 effect 执行函数
    run(){
        // 非激活的情况，只需要执行函数，不需要进行依赖收集。
        if(!this.active){
            this.fn()
        }

        // 这里就要依赖收集了，核心是将当前的effect 和稍后渲染的属性关联在一起。
        try{
            activeEffect = this;
            this.fn()
        }finally{
            activeEffect = undefined;
        }
    }
}

export const effect = (fn) =>{
    // 创建响应式 effect，fn根据状态变化重新执行，effect可以嵌套着写。
    const _effect = new ReactiveEffect(fn);
    // 默认先执行一次
    _effect.run();
}