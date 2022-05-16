import { isObject } from "@vue/shared"

/*
 * 1，将数据转换成响应式，只能做对象的代理
 */
// weakMap弱引用，不会导致内存泄漏，key只能是对象。保存的对象不会增加引用计数器，如果一个对象不被引用了会自动删除
const reactiveMap = new WeakMap(); 
const enum ReactiveFlags {
    IS_REACTIVE = '__v_isReactive'
}
export const reactive = (target) =>{
    if(!isObject(target)) return

    if(target[ReactiveFlags.IS_REACTIVE]){
        return target
    }
    // 相同的数据设置缓存，不用反复代理。
    let isExisitingProxy = reactiveMap.get(target)
    if(isExisitingProxy){
        return isExisitingProxy
    }
    // 并没有重新定义属性，只是代理。取值的时候调用get， 赋值的时候调用set。
    // target是原对象，receiver是代理对象proxy
    const proxy = new Proxy(target, {
        get(target, key, receiver){
            if(key === ReactiveFlags.IS_REACTIVE){
                return true
            }
            return Reflect.get(target, key, receiver)
            // 等价于return target[key],  可以把target中的this改成代理对象。receiver[key]会无限循环。
        },
        set(target, key, value, receiver){
            // target[key] = value;
            return Reflect.set(target, key, value, receiver)
        }
    })
    reactiveMap.set(target, proxy)
    return proxy;
}

let obj = {name:'Mike', age: 15}
const res = reactive(obj)

console.log('fucking res', res)