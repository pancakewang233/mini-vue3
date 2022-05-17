import { ReactiveFlags } from "./reactive"
export const mutableHandlers = {
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
}