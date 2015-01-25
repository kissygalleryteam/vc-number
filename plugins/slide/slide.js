/**
 * @fileoverview  滑动显示插件
 * @author 易敛 <yilian.wj@taobao.com>
 * Date: 15/1/21 下午9:10
 */

var EMPTY = '';
var $ = require('node').all;
var Base = require('base');

module.exports =  Base.extend({
    pluginInitializer:function(vcNumber){
        var self = this;
        if(!vcNumber || S.UA.ie < 9) return;
        self._initAttr(vcNumber);
        self._bindEvents();
    },
    pluginDestructor: function(){
        var self = this, vcNumber = self.get('vcNumber');
        vcNumber.detach('beforeChange',self.get('beforeChange'));
        vcNumber.detach('afterChange',self.get('afterChange'));
        //vcNumber.detach('changing',self.get('changing'));
    },
    _initAttr: function(vcNumber){
        var self = this;
        self.set('vcNumber',vcNumber);
        self.set('$target',vcNumber.get('$target'));
    },
    /**
     * 渲染值
     * @param {Object} o 显示的值
     * @param {boolean} top 是否是按了向上键
     */
    _renderHtml: function(o, top){
        var self = this, $target = self.get('$target'), slideCls = self.get('slideCls');
        var $tranCon = $target.next('.' + slideCls.tranCls);
        $tranCon && $tranCon.remove();

        $(self.get('outerTpl')).insertAfter($target);

        $tranCon = $target.next('.' + slideCls.tranCls);
        if(top) {$tranCon.addClass(slideCls.activeCls)}
        $tranCon.html(S.substitute(self.get('moveTpl'),{top: o.top, bottom: o.bottom}));
    },
    _bindEvents: function(){
        var self = this, vcNumber = self.get('vcNumber');
        var cls = vcNumber.get('cls'), slideCls = self.get('slideCls');

        var timer;
        var handleAfterChange = function(e){
            var $target = e.input, $tranCon = $target.next('.'+slideCls.tranCls);
            timer && clearTimeout(timer);
            timer = setTimeout(function(){
                $target.removeClass(slideCls.hidCls);
                $tranCon && $tranCon.remove();
            },700)

        };

        var handleBeforeChange = function(e){
            var $target = e.input, $trigger = e.trigger,$tranCon = $target.next('.'+slideCls.tranCls);
            $target.addClass(slideCls.hidCls);
            var val = Number($target.val()),
                min = parseFloat($target.attr('data-min')) || vcNumber.get('min'),
                max = parseFloat($target.attr('data-max')) || vcNumber.get('max'),
                range = Number(S.trim($target.attr('data-range'))) || vcNumber.get('range');

            //按上键
            if (($trigger.hasClass && $trigger.hasClass(cls.plus)) || $trigger == 38) {
                if(val + range > max) {range = max - val;}
                if(!range) {
                    $target.removeClass(slideCls.hidCls);
                    $tranCon && $tranCon.remove();
                    return
                }

                self._renderHtml({top: val + range, bottom: val});
                setTimeout(function(){
                    $target.next().addClass(slideCls.activeCls);
                },50)
            }
            //按下键
            else if (($trigger.hasClass && $trigger.hasClass(cls.minus)) || $trigger == 40) {
                if(val - range < min) {range = val - min;}
                if(!range) {
                    $target.removeClass(slideCls.hidCls);
                    $tranCon && $tranCon.remove();
                    return;
                }

                self._renderHtml({top: val, bottom: val - range}, true);
                setTimeout(function(){
                    $target.next().removeClass(slideCls.activeCls);
                },50)
            }

        };


        vcNumber.on('beforeChange',handleBeforeChange);
        vcNumber.on('afterChange',handleAfterChange);
        //vcNumber.on('changing',handleBeforeChange);

        self.set('beforeChange',handleBeforeChange);
        self.set('afterChange',handleAfterChange);
        //self.set('changing',handleChanging);

    }
},{
    ATTRS:{
        pluginId:{
            value:'slide'
        },
        vcNumber:{ value:EMPTY },
        $target: { value:EMPTY },
        beforeChange: {value: EMPTY},
        afterChange: {value: EMPTY},
        slideCls: {
            value: {
                activeCls: 'active',
                tranCls  : 'tran',
                hidCls: 'hideTxt',
                disabled: 'vc-number-disabled'
            }
        },
        outerTpl: {
            value: '<div class="{cls}"></div>',
            getter: function(v){
                var self = this, cls = self.get('slideCls');
                return S.substitute(v,{cls: cls.tranCls});
            }
        },
        moveTpl: {
            value: '<div class="move"><div class="top">{top}</div><div class="bottom">{bottom}</div></div>'
        }
    }
});


