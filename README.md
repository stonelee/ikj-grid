# grid

---

用于ace,提供了表格展示功能，可以分页，点击，排序

演示地址:http://stonelee.info/ikj-grid/demo/

---


## 配置

### url `String`

ajax请求数据的路径

### urlParser `RegExp`

用来适配翻页url

### data `Array`

直接加载静态数据

## model

### fields `Array`

每列的配置，配置项包括

* `header` 列名
* `name` data中该列对应的key
* `width` `Number` 该列宽度,如果不设则平均分配
* `align` 对齐方式(包括列名),取值为`left`,`center`,`right`
* `phone` 如果设为false,则小屏幕时该列自动隐藏
* `tablet` 如果设为false,则中小屏幕时该列自动隐藏
* `render` 自定义渲染函数，参数为该单元格的值

```js
//加粗，并加后缀
render: function(value) {
  return '<b>' + value + '吨</b>';
}

//显示为一张可点击的图片
render: function(value) {
  return '<img data-role="detail" src="./application_view_detail.png" width="16" title="详细信息" style="vertical-align:middle;cursor:pointer;">';
}
```

* `children` 可以定义复杂表头，如果设置了children则width无效，这时宽度取决于子表的宽度。

```js
//定义两个子表头
header: '名称',
children: [{
  header: '验票站名称',
  name: 'stationName',
  width: 150
}, {
  header: '矿企名称',
  name: 'mineName'
}]
```

* `sort` 如果设为true，该列可以点击表头进行排序；如果设为"asc"，该列初始显示升序排列；如果设为"desc"，该列初始显示降序排列

### title `String`

表格标题，默认为空，表示不显示标题栏

### paginate `Boolean`

默认为true，如果设为false则不显示分页栏

### needCheckbox `Boolean`

默认为false，如果设为true则出现多选框列

### checkboxWidth `Number`

多选框列的宽度，默认为30

### needOrder `Boolean`

默认为false，如果设为true则出现自动编号列

### orderWidth `Number`

自动编号列的宽度，默认为30

### width `Number`

整个grid的宽度，默认扩展到父元素宽度

### height `Number`

表格内容高度，如果显示内容过多，会自动出现下拉滚动条

## 属性

### data `Array`

返回从url或者data中得到的数据

### selected `$tr|Array`

返回当前选中的行，类型为jquery对象，可以使用 `$tr.data('data')` 得到该行对应的数据

默认为单选，返回的是jquery对象。
如果设置needCheckbox则为多选，返回的是数组

## 方法

### gotoPage `id`

加载某页数据

### prevPage ` `

加载上一页数据

### nextPage ` `

加载下一页数据

### firstPage ` `

加载第一页数据

### lastPage ` `

加载最后一页数据

### refresh ` `

刷新数据

### showLoading ` `

显示loading提示

### hideLoading ` `

隐藏loading提示

## 事件

### click `target, data`

在表格行中点击触发

* `target` 被点击的元素，被包装成了jquery对象
* `data` 该行对应的数据

### sort `name, direction`

点击列名触发

* `name` 该列对应的数据key name
* `direction` 升序还是降序

### loaded `  `

数据加载完毕后触发，可以自由更改默认样式

* `grid` 组件实例

## $row.data

### data `  `

该行对应的data

## 节点属性

### data-name `th`

该列对应的key

### data-role `input|i`

* 多选框 `check`
* 位于header的多选框 `checkAll`

* 上一页 `prev`
* 下一页 `next`
* 第一页 `first`
* 最后一页 `last`
* 刷新 `refresh`
* input，到某一页 `num`

## TODO

* 直接打印
* 列拉伸
* 配置项sortable

