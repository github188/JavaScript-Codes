
export var class2type = {}; // 保存各类型的属性字符串

export const toString = class2type.toString; // 等价于Object.prototype.toString()

export const getProto = Object.getPrototypeOf; 

export const hasOwn   = class2type.hasOwnProperty;

export const fnToString = hasOwn.toString; // ==> Object.toString 或 Function.toString

export const ObjectFunctionString = fnToString.call( Object ); // PlainObject, 简单对象，通过{}或者new创建的对象