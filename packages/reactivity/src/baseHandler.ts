import { ReactiveFlags } from "./reactive"
import { track } from './effect'
import { trigger } from './effect'

export const mutableHandlers = {
    get(target, key, receiver){
        if(key === ReactiveFlags.IS_REACTIVE){
            return true
        }
        track(target, 'get', key)
        return Reflect.get(target, key, receiver)
        // 等价于return target[key],  可以把target中的this改成代理对象。receiver[key]会无限循环。
    },
    set(target, key, value, receiver){
        // target[key] = value;
        let oldValue = target[key];
        let result = Reflect.set(target, key, value, receiver);
        if(oldValue != value){
            // 值变化了，需要更新
            trigger(target, 'set', key, value)
        }
        return result;
    }
}