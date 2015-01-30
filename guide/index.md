## 综述

VcNumber。

数字加减器，附带滑动效果（插件），以及两种中文提示（插件）

支持部分键盘操作，按上下键可切换数字

![VC-LOGO](http://gtms02.alicdn.com/tps/i2/TB1DApgHXXXXXbOXXXXFvIM3VXX-434-180.png)

## 初始化组件
		
    S.use('kg/vc-number/1.2.0/index,kg/vc-number/1.2.0/index.css', function (S, VcNumber) {
         var vcNumber = new VcNumber();
         vcNumber.render();
    })

    > 提供两种皮肤：'kg/vc-number/1.2.0/index.css', 'kg/vc-number/1.2.0/arrow.css'

## 默认配置

### 代码

    <input type="text" value="40.00" class="vc-number" data-range="2.00" data-max="9999999.00" data-min="1" id="J_1">

    S.use('kg/vc-number/1.2.0/index,kg/vc-number/1.2.0/index.css', function (S, VcNumber) {
            var number = new VcNumber({
                $target: '.vc-number',
                range: 2,
                max: 88,
                min: 1,
                hasDecimal: true,
                showRange: true
            }).on('afterChange',function(e){
                var $target = e.input;
                alert($target.val());
            });

            number.render();
    })

### 属性配置
属性名 | 类型|只读|默认值|说明
------------ | -------------| -------------| -------------| -------------
$target | Node|N|| 目标元素，input对象，不填则以页面中所有的input type="text"为对象
range | Boolean|N|1| 增减幅度
max | String|N|Number.MAX_VALUE| 最大值
min | Number|N|Number.MIN_VALUE| 最小值
hasDecimal | Boolean|N|false| 是否显示小数点(两位)
showRange | Boolean|N| false| 是否显示加减幅度


	> 批量初始化的时候，DOM里的自定义属性data-range,data-max,data-min,会覆盖初始化属性
	> 长按加减按钮会自动变换数字


### 事件说明
#### beforeChange

```
/**
* @description 在数字发生改变之前触发
* @param {ev.input} node 值发生改变的input
* @param {ev.trigger} node 触发节点(如果是按键则返回keyCode)
* @return null
*/
vcNumber.on('beforeChage',function(ev) {
    var $target = ev.input, trigger = ev.trigger;
})
```
#### afterChange

```
/**
* @description 在数字发生改变之后触发
* @param {ev.input} node 值发生改变的input
* @param {ev.trigger} node 触发节点(如果是按键则返回keyCode)
* @return null
*/
vcNumber.on('afterChange',function(ev) {
    var $target = ev.input, trigger = ev.trigger;
})
```

## 滑动效果插件(CSS3)

### 代码
    S.use('kg/vc-number/1.2.0/plugins/slide/slide,kg/vc-number/1.2.0/plugins/slide/slide.css',function(S, Slide){
                var number2 = new VcNumber({
                    $target: '.vc-number-slide',
                    range: 2,
                    max: 888,
                    min: 1,
                    hasDecimal: false,
                    showRange: true
                });

                number2.render();

                number2.plug(new Slide());

            })
    })

    > 利用css3属性，IE8+

### 属性配置
   无

## 中文提示插件

### 代码
    S.use('kg/vc-number/1.2.0/plugins/amountInWords/amountInWords,kg/vc-number/1.2.0/plugins/amountInWords/amountInWords.css',function(S, AmountInWords){
                var number2 = new VcNumber({
                    $target: '.vc-number-ch',
                    range: 1000,
                    max: 999999999,
                    min: 1,
                    hasDecimal: true
                });

                number2.render();

                number2.plug(new AmountInWords());

                /*换种中文提示方式*/
                var number3 = new VcNumber({
                    $target: '.vc-number-ch2',
                    range: 1000,
                    max: 999999999,
                    min: 1,
                    hasDecimal: false,
                    showRange: true

                });

                number3.render();

                number3.plug(new AmountInWords({type: 'inWords'}));

    })

### 属性配置

属性名 | 类型|只读|默认值|说明
------------ | -------------| -------------| -------------| -------------
type | String|N|'inCells'| 'inCells':中文表格提示;'inWords'：中文提示;

### 方法
#### toCnNumber(val) 转换成大写数字

    var amountInWords = new AmountInWords();
    amountInWords.toCnNumber(val);

#### addCommas(val) 转换成带逗号分割的字符串

    var amountInWords = new AmountInWords();
    amountInWords.addCommas(val);

    > 注意是插件的方法，不是宿主的。

## changeLog
+   2015-01-23发布1.0.0版
+   2015-01-23发布1.1.0，解决一系列小bug
+   2015-01-27发布1.2.0，解决无线端适配问题
