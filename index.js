var $ = require('node').all;
var Base = require('base');
var AmountInWords = require('./plugins/amountInWords/amountInWords');
var amountInWords = new AmountInWords();
var EV_BEFORE = 'beforeChange', EV_AFTER = 'afterChange', EV_ON = 'changing';

var VcNumber = Base.extend({
    initializer:function(){
        var self = this;
        var $target = self.get('$target');
        self.timer = undefined;
        self.range = self.get('range');
        if(!$target.length){
            self.set('$target',$('input[type="text"]'));
        }
    },
    render: function(){
        var self = this,$target = self.get('$target');
        if(!$target.length) return false;

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
                $minusEl = $(self.get('minusTpl')),
                $rangeEl = $(self.get('rangeTpl'));

            // 赋予aria属性
            item.attr({'aria-label':ariaLabel});

            //建立元素之间关系
            $containerEl.append($minusEl).append(item).append($plusEl).append($rangeEl);
            $parent.append($containerEl);
        })

    },

    /**
     * [_eventOnChangeNum 点击按钮时触发]
     */
    _eventOnChangeNum: function(){
        var self = this,  getCls = self.get('cls');
        var $input = self.get('$target');
        var evts = 'keyup keydown mouseup mousedown';
        if(S.UA.mobile){
            evts = 'touchstart touchend';
        }
        $input.each(function(node){
            var $sign = node.siblings('.' + getCls.sign);
            var timer ;
            $sign.on(evts, function(e){
                var $this = $(e.currentTarget), $parent = $this.parent(1), $target = $parent.children('.' + getCls.init), inputValue = Number(S.trim($target.val().replace(/\,/g,''))),
                    range = Number(S.trim($target.attr('data-range'))) || self.get('range'),
                    interval = 1000, intervalCount = 0;
                var evBack = true;
                var changeValue = function(){
                    var cls = e.currentTarget.className;
                    if(cls && cls.indexOf(getCls.disabled) > -1){
                        self.set('isLimit',true);
                    }
                    if(cls && cls.indexOf(getCls.plus)> -1 ){
                        inputValue += range;
                    }
                    else if(cls && cls.indexOf(getCls.minus)>-1){
                        inputValue -= range;
                    }
                    evBack = self.fire(EV_BEFORE,{input: $target, trigger: $this});
                    self.set('evBack',evBack);
                    if(evBack == false){
                        return;
                    }
                    self._limitRange(inputValue, $target, range);
                    self.fire(EV_ON,{input: $target, trigger: $this});
                };
                if(e.type == 'keydown' || e.type == 'mousedown' || e.type == 'touchstart'){
                    timer && clearTimeout(timer);
                    timer = setTimeout(function(){
                        console.log(e.type);
                        changeValue();
                        if(self.timer) {clearTimeout(self.timer);}
                        self.timer = setTimeout(function(){
                            changeValue();
                            interval = 150;
                            intervalCount ++ ;
                            if(intervalCount > 10){
                                interval = 100;
                            }
                            self.timer = setTimeout(arguments.callee, interval);
                        },interval);
                    },10);
                }
                if(e.type == 'keyup' || e.type == 'mouseup' || e.type == 'touchend'){
                    setTimeout(function(){
                        console.log(e.type);
                        clearTimeout(self.timer);
                        intervalCount = 0;

                        /*触发change事件*/
                        if(self.get('evBack') == false || self.get('isLimit')){
                            return;
                        }
                        self.fire(EV_AFTER,{input: $target, trigger: $this, range: self.range});
                    },10)
                }

            });
        });

        $input.on('keydown keyup',function(e){
            var $target = $(e.currentTarget), inputValue = Number(S.trim($target.val().replace(/\,/g,''))),
                range = Number(S.trim($target.attr('data-range'))) || self.get('range');
            var evBack = true;
            var changeValue = function(){
                //向上键
                if(e.keyCode === 38){
                    inputValue += range;
                }
                //向下键
                else if(e.keyCode === 40){
                    inputValue -= range;
                }
                evBack = self.fire(EV_BEFORE,{input: $target, trigger: e.keyCode});
                self.set('evBack',evBack);
                if(evBack == false){
                    return;
                }
                self._limitRange(inputValue, $target, range);
                self.fire(EV_ON,{input: $target, trigger: e.keyCode});
            };

            if(e.keyCode === 38 || e.keyCode === 40){
                if(e.type == 'keydown'){
                    changeValue();
                }
                if(e.type == 'keyup'){
                    if(self.get('evBack') == false || self.get('isLimit')){
                        return;
                    }
                    /*触发change事件*/
                    self.fire(EV_AFTER,{input: $target, trigger: e.keyCode, range: self.range});
                }
            }

        });

        if(!self.get('showRange')) return;
        self.on(EV_AFTER,function(e){
            var $target = e.input, $trigger = e.trigger,
                range = e.range;
            var $rangeEl = $target.siblings('.'+getCls.range), text;
            if (($trigger.hasClass && $trigger.hasClass(getCls.plus)) || $trigger == 38){
                text = '+';
            }
            else if (($trigger.hasClass && $trigger.hasClass(getCls.minus)) || $trigger == 40){
                text = '-';
            }
            if(self.get('isLimit') || !text) return;
            $rangeEl.html(text+range).show();
            setTimeout(function(){
                $rangeEl.addClass(getCls.slideout);
            },50);
            setTimeout(function(){
                $rangeEl.hide().removeClass(getCls.slideout)
            },500)
        });

    },
    _eventOnValide: function(){
        var self = this, $target = self.get('$target');
        var oldValue;
        $target.each(function(item){
            item.on('focus',function(){
                oldValue = $(this).val();
            });
            item.on('blur',function(){
                var $this = $(this);
                var range = Number(S.trim($this.attr('data-range'))) || self.get('range');

                self._formatNum($this);
                self._limitRange(Number(S.trim($this.val())), $this, range);
                /*防止因为blur时同时触发btn的click事件,从而生成不必要的timer*/
                if(self.timer) {clearTimeout(self.timer);}
                if(self.get('evBack') == false || self.get('isLimit')){
                    return;
                }
                /*触发change事件*/
                self.fire(EV_AFTER,{input: $target, trigger: $this, range: self.get('range')});
            });
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
     * @param  {[Number]} range [增减幅度]
     */
    _limitRange : function(value, target, range){
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
            //self.set('range',range - min + value);
            self.range = range - min + value;
            $('.' + getCls.minus, $parent).addClass(getCls.disabled);
            $('.' + getCls.plus, $parent).removeClass(getCls.disabled);
        }
        else if (inputValue === max) {
            //self.set('range',range - value + max);
            self.range = range - value + max;
            $('.' + getCls.plus, $parent).addClass(getCls.disabled);
            $('.' + getCls.minus, $parent).removeClass(getCls.disabled);
        }
        else {
            $('.' + getCls.sign, $parent).removeClass(getCls.disabled);
            self.set('isLimit',false);
            //self.set('range', range);
            self.range = range;
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
        showRange: {
            value: false
        },
        hasDecimal: {
            value: false
        },
        /**
        * 是否达到临界值
        * */
        isLimit: {
            value: false
        },
        /**
         * 事件监听函数返回值
         * **/
        evBack: {
            value: true
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
                disabled: 'vc-number-disabled',
                range: 'vc-number-range-icon',
                slideout: 'slideout'
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
            value:'<a href="#!/plus" class="{plus} {sign}" role="button"><span class="{plus}-sign">+</span></a>',
            getter:function(v){
                var self = this, cls = self.get('cls');
                return S.substitute(v,{plus:cls.plus, sign:cls.sign});
            }
        },
        minusTpl:{
            value: '<a href="#!/minus" class="{minus} {sign}"  role="button"><span class="{minus}-sign">-</span></a>',
            getter:function(v){
                var self = this, cls = self.get('cls');
                return S.substitute(v,{minus:cls.minus, sign:cls.sign});
            }
        },
        rangeTpl:{
            value: '<p class="vc-number-range-icon"></p>'
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



