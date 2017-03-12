/**
 * 装饰者模式（包装模式）
 * @authors zc li (lizc@ipanel.cn)
 * @date    2016-11-11 11:59:05
 * @version $Id$
 */

'use strict'

/*
 *	被装饰的组件
 */
function MyComponent() {
	let suffix = '';

	return {
		setSuffix: suf => suffix = suf,
		printValue: value => console.log(`value is ${ value + suffix }`)
	};
}

// const component = new MyComponent();
// component.setSuffix( '!' );
// component.printValue( 'My Value' );

/**
 * 1. 最基础的装饰方式
 *
 * 复制整个原始对象
 * 
 */
function toLowerDecorator( inner ) {
	return {
		setSuffix: inner.setSuffix,
		printValue: value => inner.printValue( value.toLowerCase() )
	};
}

function validatorDecorator( inner ) {
	return {
		setSuffix: inner.setSuffix,
		printValue: value => {
			const isValid = ~value.indexOf( 'My' );

			setTimeout( () => {
				if ( isValid ) inner.printValue( value )
				else console.log( 'not valid man...' )
			}, 500 );
		}
	};
}

// const component = validatorDecorator( toLowerDecorator( MyComponent() ) );
// component.setSuffix( '!' );
// component.printValue( 'My Value' );
// component.printValue( 'Invalid Value' );

/**
 * 2. 猴子补丁：动态修改一个类或模型
 *
 * 即：先保存源对象方法引用，然后在调用源对象方法基础上做出修改，
 * 再赋值给源对象，添加自己想要的东西，然后重新覆盖源方法，例如：
 *
 * // 保存源方法
 * const originalMethod = o.method;
 * // 定义新的方法，在里面调用源方法之外再做写额外的处理，即
 * // 我们所说的装饰源方法，然后赋值覆盖源方法
 * o.method = value => originalMethod( value.toLowerCase() );
 *
 * 缺点：会直接修改并覆盖调源对象的方法
 */
function decoratorWithToLower( inner ) {
	const oPrintValue = inner.printValue;
	inner.printValue = value => oPrintValue( value.toLowerCase() );
}

function decoratorWithValidator( inner ) {
	const oPrintValue = inner.printValue;
	inner.printValue = value => {
		const isValid = ~value.indexOf( 'My' );

		setTimeout( () => {
			if ( isValid ) oPrintValue( value )
			else console.log( 'Invalid value')
		}, 500 );
	};
}

// const component = MyComponent();
// decoratorWithToLower( component );
// decoratorWithValidator( component );

// component.setSuffix( '!' );
// component.printValue( 'My Value' );
// component.printValue( 'Invalid Value' );


/**
 * 3. 原型继承
 *
 * 创建源对象的子对象，然后在子对象中去添加自己的东西，即
 * 装饰源对象后获得自己的对象，这样即不会改变源对象内容，又能有针对性的
 * 装饰想要装饰的内容
 * Object.create( proto, objs, ... );
 *
 * 优点：
 * 1. 不需要修改原始对象；
 * 2. 不需要复制每个原始对象的成员到新对象，只管自己需要的；
 * 3. 不是猴子补丁，不会覆盖原始对象内容；
 * 4. 不支持差的代码？？；
 * 5. 相对简单的装饰方式；
 */
function protoToLowerDecorator( inner ) {
	const instance = Object.create( inner );
	instance.printValue = value => inner.printValue( value.toLowerCase() );
	return instance;
}

function protoValidatorDecorator( inner ) {
	const instance = Object.create( inner );
	instance.printValue = value => {
		const isValid = ~value.indexOf( 'My' );

		setTimeout( () => {
			if ( isValid ) inner.printValue( value )
			else console.log( 'Invalid value')
		}, 500 );
	};

	return instance;
}

// var component = protoValidatorDecorator( protoToLowerDecorator( MyComponent() ) );
// component.setSuffix( '!' );
// component.printValue( 'My Value' );
// component.printValue( 'Invalid Value' );

/**
 * 4. 用 ES6 的代理模块装饰
 */

// require( 'harmony-reflect' );

function proxyToLowerDecorator( inner ) {
    return new Proxy(inner, {
        get: (target, name) => {
            return (name === 'printValue')
                ? value => target.printValue(value.toLowerCase())
                : target[name]
        }
    })
}

function proxyValidatorDecorator( inner ) {
    return new Proxy(inner, {
        get: (target, name) => {
            return (name === 'printValue')
                ? value => {
                    const isValid = ~value.indexOf('my')

                    setTimeout(() => {
                        if (isValid) target.printValue(value)
                        else console.log('not valid man...')
                    }, 500)
                }
                : target[name]
        }
    })
}

/**
 * 5. 中间件装饰模式
 *
 * 将装饰逻辑放到原始对象中，让原始对象掌控装饰主动权
 */
function MyComponentMid() {
	let suffix = '';

	const instance = {
		setSuffix: suf => suffix = suf,
		printValue: value => console.log(`value is ${ value + suffix }`),
		addDecorators: decorators => {
			let printValue = instance.printValue;
			decorators.slice().reverse().forEach( decorator => printValue = decorator( instance.printValue ) );
			instance.printValue = printValue;
		}
	};

	return instance;
}

function midToLowerDecorator( inner ) {
	return value => inner( value.toLowerCase() );
}

function midValidatorDecorator( inner ) {
	return value => {
		const isValid = ~value.indexOf( 'My' );

		setTimeout( () => {
			if ( isValid ) inner( value );
			else console.log( 'not valid value' );
		}, 500 );
	};	
}

const component = MyComponentMid();
component.addDecorators( [ midToLowerDecorator, midValidatorDecorator ] );
component.setSuffix( '!' );
component.printValue( 'My Value' );
component.printValue( 'Invalid Value' );




// const component = proxyToLowerDecorator( proxyValidatorDecorator( MyComponent() ) );
// component.setSuffix('!');
// component.printValue('My Value');
// component.printValue('Invalid Value');





/**
 * Object.create( proto, objs, ... );
 *
 * 第一个参数会作为新对象的原型
 */
// 1. 相对于字面量对象(没有原型)，只是创建了其副本给子对象而已；
var parent = { name: "lizc" };

var son = Object.create( parent );

son.name; // lizc
parent.name; // lizc

son.name = 'fll';
son.name; // fll
parent.name; // lizc

// 2. 相对于函数或构造函数，则采用原型方式
function Parent() {}

Parent.prototype.myName = 'lizc';

function Son() {}

// 基于原型的继承
Son.prototype = Object.create( Parent.prototype );
Son.prototype.constructor = Son;

