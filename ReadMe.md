#动态改变列宽

###功能

通过拖拽表头，动态的改变列宽。


###如何使用

1. 引用`ColResize.js`：
```html
 <script src="js/ColResize.js"></script>
```
或者把文件内容复制到自已的库当中,当页面加载完成后，脚本就会为table加载事件。

2. 对无需动态改变列宽的表，可只需添加`data-col-resize=="false"` 属性即可：
```html
<table data-col-resize="false">
```