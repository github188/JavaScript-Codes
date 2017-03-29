
/*
    导入 Angular 的浏览器引导函数和应用程序的根组件
 */
import {bootstrap} from "angular2/platform/browser";
import {AppComponent} from "./environment_app.component";

// 通过传递根组件类型来调用 bootstrap
bootstrap(AppComponent);