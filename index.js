var $ = require('node').all;
var Base = require('base');
var AmountInWords = require('./plugins/amountInWords/amountInWords');
var timer = '', amountInWords = new AmountInWords();

var VcNumber = Base.extend({
    initializer:function(){
        var self = this;
        var $target = self.get('$target');
    },
    render: function(){
        var self = this,$target = self.get('$target');
        if(!$target.length || self._isNativeSpinBox()) return false;

        //增加ks-spinbox样式
        var boxCls = self.get('cls').init;
        if(!$target.hasClass(boxCls)) $target.addClass(boxCls);

        self._addHTML();
        self._eventOnChangeNum();
        self._eventOnValide();
    },
    /**
     * [_isNativeSpinBox 看是否原生SpinBox]
     * @return {[type]} [description]
     */
    _isNativeSpinBox: function(){
        var self = this, $target = self.get('$target');
        if($target.attr('type') == 'number'){
            return true;
        }
        else {
            return false;
        }
    },
    /**
     * 对input组件进行包装
     */
    _addHTML: function(){
        var self = this, $target = self.get('$target'),  ariaLabel = self.get('ariaLabel');

        //创建元素
        $target.each(function(item){
            var $parent = item.parent(),
                $containerEl = $(self.get('outerTpl')),
                $plusEl = $(self.get('plusTpl')),
                $minusEl = $(self.get('minusTpl'));

            // 赋予aria属性
            item.attr({'aria-label':ariaLabel});

            //建立元素之间关系
            $containerEl.append($minusEl).append(item).append($plusEl);
            $parent.append($containerEl);
        })

    },

    /**
     * [_eventOnChangeNum 点击按钮时触发]
     */
    _eventOnChangeNum: function(){
        var self = this,  getCls = self.get('cls');
        var $input = self.get('$target');
        $input.each(function(node){
            var $sign = node.siblings('.' + getCls.sign);
            $sign.on('keyup keydown mouseup mousedown', function(e){
                var $this = $(e.currentTarget), $parent = $this.parent(1), $target = $parent.children('.' + getCls.init), inputValue = Number(S.trim($target.val().replace(/\,/g,''))),
                    range = Number(S.trim($target.attr('data-range'))) || self.get('range'),
                    interval = 1000, intervalCount = 0;
                var changeValue = function(){
                    if(e.currentTarget.className.indexOf(getCls.plus)> -1 ){
                        inputValue += range;
                    }
                    else if(e.currentTarget.className.indexOf(getCls.minus)>-1){
                        inputValue -= range;
                    }
                    self._limitRange(inputValue, $target);
                };
                if(e.type == 'keydown' || e.type == 'mousedown'){
                    self.fire('beforeChange',{input: $target, trigger: $this});
                    changeValue();
                    if(timer) {clearTimeout(timer);}
                    timer = setTimeout(function(){
                        changeValue();
                        interval = 150;
                        intervalCount ++ ;
                        if(intervalCount > 10){
                            interval = 100;
                        }
                        timer = setTimeout(arguments.callee, interval);
                    },interval);
                }
                if(e.type == 'keyup' || e.type == 'mouseup'){
                    if(timer) {clearTimeout(timer);}
                    intervalCount = 0;

                    /*触发change事件*/
                    self.fire('afterChange',{input: $target, trigger: $this});
                }

            });

        });

        $input.on('keydown keyup',function(e){
            var $this = $(this), $target = $(e.currentTarget), inputValue = Number(S.trim($target.val().replace(/\,/g,''))),
                range = Number(S.trim($target.attr('data-range'))) || self.get('range');
            var changeValue = function(){
                //向上键
                if(e.keyCode === 38){
                    inputValue += range;
                }
                //向下键
                else if(e.keyCode === 40){
                    inputValue -= range;
                }
                self._limitRange(inputValue, $target);
            };

            if(e.keyCode === 38 || e.keyCode === 40){
                if(e.type == 'keydown'){
                    self.fire('beforeChange',{input: $target, trigger: $this});
                    changeValue();
                }
                if(e.type == 'keyup'){
                    /*触发change事件*/
                    self.fire('afterChange',{input: $target, trigger: $this});
                }
            }

        });

    },
    _eventOnValide: function(){
        var self = this, $target = self.get('$target');
        var oldValue;
        $target.on('focus',function(){
            oldValue = $(this).val();
        });
        $target.on('blur',function(){
            var $this = $(this);
            self._formatNum($this);
            self._limitRange(Number(S.trim($this.val())), $this);
            /*防止因为blur时同时触发btn的click事件,从而生成不必要的timer*/
            if(timer) {clearTimeout(timer);}
            /*触发change事件*/
            self.fire('afterChange',{input: $target, trigger: $this});
        });
    },

    _toFloat: function(value){
        return parseFloat(value);
    },

    /**
     * [numValidation 校正输入框格式，屏蔽非法字符]
     * @param  {[NodeList]} $target [文本框节点]
     */
    _formatNum : function($target){
        var self = this, min = Number($target.attr('data-min')) || self.get('min'),
            inputValue = self._toFloat($target.val().replace(/[^\d\.]/g, '').replace(/^0+/,'').replace(/\,/g,''));
        inputValue = isNaN(inputValue) ? min : Math.max(inputValue, min);
        var hasDecimal = $target.attr('data-hasdecimal') || self.get('hasDecimal').toString();
        var digit = (hasDecimal == 'true') ? 2 : 0;
        $target.val(inputValue.toFixed(digit));
    },
    /**
     * [_limitRange 控制输入数值的大小在最大值与最小值之间]
     * @param  {[Number]} value [输入框的值]
     * @param  {[NodeList]} target [文本框对象]
     */
    _limitRange : function(value, target){
        var self = this, $target = target, $parent = $target.parent(1), _toFloat = self._toFloat,getCls = self.get('cls'),
            min = _toFloat($target.attr('data-min')) || self.get('min'),
            max = _toFloat($target.attr('data-max')) || self.get('max'),
            hasDecimal = $target.attr('data-hasdecimal') || self.get('hasDecimal').toString(),
            inputValue = min && Math.max(min, value);
        inputValue = max && Math.min(max, inputValue);
        var digit = (hasDecimal == 'true') ? 2 : 0;
        var transVal = inputValue.toFixed(digit);
        var cnVal = $target.attr('data-cn');
        //如果是调用了amountinWords插件，则取分隔符
        if(cnVal){
            transVal = amountInWords.addCommas(transVal);
        }
        $target.val(transVal);
        if (inputValue === min) {
            $('.' + getCls.minus, $parent).addClass(getCls.disabled);
        }
        else if (inputValue === max) {
            $('.' + getCls.plus, $parent).addClass(getCls.disabled);
        }
        else {
            $('.' + getCls.sign, $parent).removeClass(getCls.disabled);
        }
    }
},{
    ATTRS:{
        $target:{
            value:'',
            getter:function(v){
                return $(v);
            }
        },
        /**
         * 一组样式名
         * @type {Object}
         * @default cls:{init: 'vc-number',plus: 'vc-number-plus',minus: 'vc-number-minus',container: 'vc-plus-minus-operation'}
         */
        cls: {
            value: {
                init: 'vc-number',
                sign: 'vc-number-sign',
                plus: 'vc-number-plus',
                minus: 'vc-number-minus',
                container: 'vc-plus-minus-operation',
                disabled: 'vc-number-disabled'
            }
        },
        outerTpl:{
            value: '<span class="{container}"></span>',
            getter:function(v){
                var self = this, cls = self.get('cls');
                return S.substitute(v,{container:cls.container});
            }
        },
        plusTpl:{
            value:'<a href="#!/plus" class="{plus} {sign}" role="button"><span>+</span></a>',
            getter:function(v){
                var self = this, cls = self.get('cls');
                return S.substitute(v,{plus:cls.plus, sign:cls.sign});
            }
        },
        minusTpl:{
            value: '<a href="#!/minus" class="{minus} {sign}"  role="button"><span>-</span></a>',
            getter:function(v){
                var self = this, cls = self.get('cls');
                return S.substitute(v,{minus:cls.minus, sign:cls.sign});
            }
        },
        /**
        * 最小值
        * */
        min: {
            value: Number.MIN_VALUE
        },
        max: {
            value: Number.MAX_VALUE
        },
        range: {
            value: 1
        },
        hasDecimal: {
            value: false
        },
        /**
         * 无障碍，设置aria-label属性值
         * @default ''
         */
        ariaLabel: {
            value: '出价框，请输入价格'
        }
    }
});

module.exports = VcNumber;



