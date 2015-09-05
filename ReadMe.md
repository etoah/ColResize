#动态改变列宽

##功能

1. 通过拖拽表头，动态的改变列宽。
2. 双表联动

##如何使用

###引用`ColResize.js`
```html
 <script src="js/ColResize.js"></script>
```
或者把文件内容复制到自已的库当中,当页面加载完成后，脚本就会为table加载事件。

**对无需动态改变列宽的表，只需添加`data-col-resize="false"` 属性即可：**

```html
	<table data-col-resize="false">
	
```


###双表联动
  把`data-resize-col`即可。例

```html
	   <table id="ad" data-resize-col="table2">
	
```


* 如果目标表不需单独改变列宽，请在目标表添加`data-resize-col="false"`   
如  
```html
 <table id="table2" data-resize-col="false">
```
	
* 如果两个表需要相互联动，则只需把`data-resize-col`,改为对方的id即可。

##兼容性

* 现代浏览器（Chrome,Oprea,firefox）
* IE9+