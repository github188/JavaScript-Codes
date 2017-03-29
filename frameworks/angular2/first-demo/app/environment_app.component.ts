

/*
    从 angular2/core 模块中引入 Component 和 View
 */
import {Component, View} from 'angular2/core';

/*
    装饰器，用来将元数据与组件发生关联
 */
@Component({
    selector: 'my-app'
})

/*
    定义 UI 组件模版
 */
@View({
   template: '<h2>My First Angular 2 App.</h2>' 
})

/*
    导出组件
 */
export class AppComponent {
    
}