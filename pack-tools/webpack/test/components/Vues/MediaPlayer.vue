<style scoped>
	
</style>

<template>
	
</template>

<script>
export default {
	data() {
		return {
			mp: null,

			/*
				如果 type = 1 全屏，xywh此时为0
				如果 type = 0 非全屏，那就需要调用setAare设置视频区
			*/
			area: {
				type: 1,
				x: 0,
				y: 0,
				w: 0,
				h: 0,
			}
		};
	},

	props: {},
	methods: {
		init() {
			this.mp = new MediaPlayer();

			if (this.area.type === 1) {
				this.mp.setVideoDisplayMode(1);
			} else {
				this.mp.setVideoDisplayMode(0);
				this.mp.setVideoDisplayArea(
					this.area.x, 
					this.area.y, 
					this.area.w, 
					this.area.h
				);
			}

			this.mp.refreshVideoDisplay();
		},

		// 设置视频区
		setArea() {

			/*
				支持 
					1. 不传值，返回当前area
					2. 对象({type:0, x:0, y:0, w:1280, h:720})
					3. 值数组([0,0,0,1280,720])，
					4. 单个值(x,y,w,h)
			 */

			let args = arguments;

			if (args.length <= 0) { // 返回当前值
				return this.area;
			} else if (this.type(args[0]) === 'object') { // 直接覆盖
				this.area = args[0];
			} else if (this.type(args[0]) === 'array') { // 数组转成对象赋值给area
				this.area = this.array2Obj(args[0], ['type', 'x', 'y', 'w', 'h']);
			} else if (args.length === 4) { // 一个个赋值
				this.area.type = 0;
				this.area.x = args[0];
				this.area.y = args[1];
				this.area.w = args[2];
				this.area.h = args[3];
			}
		},

		// 数组转化成对象
		array2Obj(array, keys) {

			if (!array || this.type(array) !== 'array' || array.length <= 0) {
				return {};
			}

			const obj = {};

			if (array.map) {
				array.map((v, i) => {
					if (keys && keys[i]) {
						obj[keys[i]] = v;
					} else {
						obj[v] = v;
					}
				});
			} else {
				for (let i = 0; i < array.length; i++) {
					if (keys && keys[i]) {
						obj[keys[i]] = v;
					} else {
						obj[v] = v;
					}
				}
			}

			return obj;
		},

		type(obj) {
			return (
				Object.prototype.toString
					.call(obj)
					.split(' ')[1]
					.replace(/]/, '')
					.toLowerCase()
			);
		},
	},
	components: {},
	computed: {},
	events: {

	},

	ready() {
		
	},
};
</script>