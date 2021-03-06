import { isObject } from "@vue/shared"
import { mutableHandlers } from "./baseHandler";
/*
 * 1，将数据转换成响应式，只能做对象的代理
 */
// weakMap弱引用，不会导致内存泄漏，key只能是对象。保存的对象不会增加引用计数器，如果一个对象不被引用了会自动删除
const reactiveMap = new WeakMap(); 

export const enum ReactiveFlags {
    IS_REACTIVE = '__v_isReactive'
}
export const reactive = (target) =>{
    if(!isObject(target)) return
    /*
        target没有被代理前，target.xxx 不存在。如果target如果被代理过，target.xxx会直接进入代理的getter做判断(proxy特性)，
        被代理过getter会返回true，这里直接return target，避免二次代理。
    */ 
    if(target[ReactiveFlags.IS_REACTIVE]){
        return target
    }
    // 对同一个数据设置缓存，不用反复代理。
    let isExisitingProxy = reactiveMap.get(target)
    if(isExisitingProxy){
        return isExisitingProxy
    }
    // 并没有重新定义属性，只是代理。取值的时候调用get， 赋值的时候调用set。
    // target是原对象，receiver是代理对象proxy
    const proxy = new Proxy(target, mutableHandlers)
    reactiveMap.set(target, proxy)
    return proxy;
}