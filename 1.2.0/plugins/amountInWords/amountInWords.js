/**
 * @fileoverview  中文提示插件
 * @author 易敛 <yilian.wj@taobao.com>
 * Date: 15/1/21 下午9:10
 */


var EMPTY = '';
var $ = require('node').all;
var Base = require('base');

module.exports =  Base.extend({
    pluginInitializer:function(vcNumber){
        var self = this;
        if(!vcNumber) return;
        var $target = vcNumber.get('$target');
        $target.attr('data-cn',true);
        self.set('vcNumber',vcNumber);
        self.set('$target',vcNumber.get('$target'));
        self._renderHtml();
        self._bindEvents();
    },
    pluginDestructor: function(){
        var self = this, vcNumber = self.get('vcNumber');
        vcNumber.detach('beforeChange',self.get('beforeChange'));
        vcNumber.detach('afterChange',self.get('afterChange'));
        var $pluginHtml = vcNumber.get('$target').siblings('.'+self.get('cls'));
        $pluginHtml.length && $pluginHtml.remove();
    },
    _renderHtml: function(){
        var self = this, $target = self.get('$target'), moneyTpl = self.get('moneyTpl');
        $(moneyTpl).insertBefore($target);
    },
    _bindEvents: function () {
        var self = this, vcNumber = self.get('vcNumber');
        var handleBeforeChange = function () {

        };
        var handleAfterChange = function (e) {
            var $target = e.input || $(e.currentTarget);
            var val = self.addCommas($target.val());
            $target.val(val);
            var type = self.get('type'), types = self.get('types');
            switch(type){
                case types.cellType:
                    self._renderChineseNumUl();
                    break;
                case types.wordType:
                    self._renderChineseWords();
                    break;
            }
        };

        self.set('beforeChange',handleBeforeChange);
        self.set('afterChange',handleAfterChange);

        vcNumber.on('beforeChange',handleBeforeChange);
        vcNumber.on('afterChange',handleAfterChange);
        self.get('$target').on('focus',handleAfterChange);

        var inputCls = vcNumber.get('cls').init, signCls = vcNumber.get('cls').sign, cnCls = self.get('cls');
        $(document).on('click',function(e){
            var $target = $(e.target);
            if(!$target.hasClass(inputCls) && !$target.hasClass(cnCls) && !$target.hasClass(signCls)
                && $target.parent() && !$target.parent().hasClass(signCls) ){
                self._hideChineseNumUl();
            }
        });

    },
    _hideChineseNumUl: function(){
      var self = this, $target = self.get('$target');
        $target.prev('.'+self.get('cls')).fadeOut(0.4);
    },
    _renderChineseNumUl: function(){
        var self = this, $target = self.get('$target');
        var getSpan = $target.prev('.'+self.get('cls')),
            bitText = ['元', '十', '百','千','万','十','百','千','亿', '十', '百', '千', '兆','十', '百', '千'],
            bitTextDot = ['角','分'];
        var tplDot = [],containerLen;
        //每次写重置一下
        $('ul', getSpan).html('');
        var val = $target.val().replace(/\,/g,'');
        if(!val) return;
        var valArray =val.split('.');
        val = valArray[0];
        var valDot = valArray[1];

        containerLen = $('li',getSpan).length;
        if(val.length + 1 > containerLen) {
            //补位
            var newBit = bitText.slice(containerLen, val.length + 1).reverse(),tpl = [];

            for(var i = 0; i < newBit.length; i++) {
                if(newBit[i] == '元') {
                    tpl.push('<li style="border-right:none"><div>'+newBit[i]+'</div><strong></strong></li>');
                } else {
                    tpl.push('<li><div>'+newBit[i]+'</div><strong></strong></li>');
                }
            }

            $('ul', getSpan).prepend(tpl.join(''));

            //添加分位线
            S.each(S.makeArray($('li',getSpan)).reverse(), function(el, idx) {
                if(idx && idx % 3 == 0) {
                    $(el).addClass('separator');
                }
            });
        }

        if(valDot && tplDot.length < 2){
            for(var j=0; j< valDot.length; j++){
                tplDot.push('<li style="border-left:2px solid '+self.get('borderColor')+';border-right:none;" class="J_PriceDot"><div>'+bitTextDot[j]+'</div><strong></strong></li>');
            }
            $('ul', getSpan).append(tplDot.join(''));
        }

        //填充数字
        var NumContainer = $('strong', getSpan);
        NumContainer.html('').removeClass('yen');

        if(valDot){
            //添加货币符号
            $(NumContainer[NumContainer.length - val.length - valDot.length - 1]).html('&yen;').addClass('yen');
            for(var v = 0; v < val.length; v++){
                $(NumContainer[NumContainer.length - val.length - valDot.length  + v ]).html(val.charAt(v));
            }
            for (var j =0 ; j < valDot.length; j++) {
                $(NumContainer[NumContainer.length - valDot.length + j ]).html(valDot.charAt(j));
            }
        }else{
            //添加货币符号
            $(NumContainer[NumContainer.length - val.length -1]).html('&yen;').addClass('yen');
            S.each(val, function(v, idx){
                $(NumContainer[NumContainer.length - val.length + idx]).html(v);
            });
        }

        getSpan.fadeIn(0.4);
        getSpan.width(getSpan.children().children().length * 30);

    },
    _renderChineseWords:function(){
        var self = this, $target = self.get('$target');
        var getSpan = $target.prev('.'+self.get('cls'));
        var val = self.toCnNumber($target.val());
        getSpan.replaceClass(self.get('cellMoneyCls'), self.get('cnMoneyCls'));
        getSpan.html(val + '<span class="unit">元</span>');
        getSpan.width(((val).length+1) * 20);
        getSpan.fadeIn(0.4);
    },
    /**
     * 转换成大写数字
     * @return {String}
     */
    toCnNumber:function(val){
        var self = this;
        var num = self._resetNum(val);
        return self._tempChinese(num);
    },
    _tempChinese:function(number){
        var AA = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖");
        var BB = new Array("", "拾", "佰", "仟", "万", "亿", "点", "");
        var a = ("" + number).replace(/(^0*)/g, "").split("."),
            k = 0,
            re = "";
        for (var i = a[0].length - 1; i >= 0; i--) {
            switch (k) {
                case 0:
                    re = BB[7] + re;
                    break;
                case 4:
                    if (!new RegExp("0{4}\\d{" + (a[0].length - i - 1) + "}$").test(a[0])) {re = BB[4] + re;}
                    break;
                case 8:
                    re = BB[5] + re;
                    BB[7] = BB[5];
                    k = 0;
                    break;
            }
            if (k % 4 == 2 && a[0].charAt(i) == "0" && a[0].charAt(i + 1) != "0") {re = AA[0] + re;}
            if (a[0].charAt(i) != 0) {re = AA[a[0].charAt(i)] + BB[k % 4] + re;}
            k++;
        }
        if (a.length > 1) {
            re += BB[6];
            for (var i = 0; i < a[1].length; i++) {re += AA[a[1].charAt(i)];}
        }

        return re;
    },
    /**
     * 过滤一下输入值
     * @return {String}
     */
    _resetNum: function(num){
        var newNum;
        //删除逗号,两边的小数点,空格（包括中间的空格）,连续的两个小数点换成一个
        var removeCommas = num.replace(/(\s+)|,/g,'').replace(/(\.+)/g,'.').replace(/\,/g,'');
        if(/^(\d*)?\d+(\.?)(\d?)(\d?)$/.test(removeCommas)){
            newNum = removeCommas;
        }else{
            newNum = false;
        }
        return newNum;
    },
    /**
     * 转换成带逗号分割的字符串
     * @return {String}
     */
    addCommas:function(val){
        var self = this;
        var num = self._resetNum(val);
        if(!num){
            return '';
        }
        num += '';
        var arr = num.split('.');
        var before = arr[0],
            after = arr.length > 1 ? '.' + arr[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(before)) {
            before = before.replace(rgx, '$1' + ',' + '$2');
        }
        return before + after;
    }
},{
    ATTRS:{
        pluginId:{
            value:'amountInWords'
        },
        type: {
            value: 'inCells'
        },
        types: {
            value: {
                cellType: 'inCells',
                wordType: 'inWords'
            }
        },
        cls: {
          value: 'J_CnMoney'
        },
        cnMoneyCls: {
          value: 'cn-money'
        },
        cellMoneyCls:{
          value: 'cell-money'
        },
        vcNumber:{ value:EMPTY },
        beforeChange: {value: EMPTY},
        afterChange: {value: EMPTY},
        moneyTpl: {
            value: '<div class="J_CnMoney cell-money"><ul></ul></div>'
        },
        borderColor: {
            value: '#fdcc7d'
        }
    }
});



