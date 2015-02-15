KISSY.add("kg/vc-number/1.1.0/index",["base","node"],function(e,t,n,a){var r,s,i=t("base"),l=t("node");r=function(t){var n="",a=l.all,r=i;return t=r.extend({pluginInitializer:function(e){var t=this;if(e){var n=e.get("$target");n.attr("data-cn",!0),t.set("vcNumber",e),t.set("$target",e.get("$target")),t._renderHtml(),t._bindEvents()}},pluginDestructor:function(){var e=this,t=e.get("vcNumber");t.detach("beforeChange",e.get("beforeChange")),t.detach("afterChange",e.get("afterChange"));var n=t.get("$target").siblings("."+e.get("cls"));n.length&&n.remove()},_renderHtml:function(){var e=this,t=e.get("$target"),n=e.get("moneyTpl");a(n).insertBefore(t)},_bindEvents:function(){var e=this,t=e.get("vcNumber"),n=function(){},r=function(t){var n=t.input||a(t.currentTarget),r=e.addCommas(n.val());n.val(r);var s=e.get("type"),i=e.get("types");switch(s){case i.cellType:e._renderChineseNumUl();break;case i.wordType:e._renderChineseWords()}};e.set("beforeChange",n),e.set("afterChange",r),t.on("beforeChange",n),t.on("afterChange",r),e.get("$target").on("focus",r);var s=t.get("cls").init,i=t.get("cls").sign,l=e.get("cls");a(document).on("click",function(t){var n=a(t.target);n.hasClass(s)||n.hasClass(l)||n.hasClass(i)||!n.parent()||n.parent().hasClass(i)||e._hideChineseNumUl()})},_hideChineseNumUl:function(){var e=this,t=e.get("$target");t.prev("."+e.get("cls")).fadeOut(.4)},_renderChineseNumUl:function(){var t,n=this,r=n.get("$target"),s=r.prev("."+n.get("cls")),i=["元","十","百","千","万","十","百","千","亿","十","百","千","兆","十","百","千"],l=["角","分"],u=[];a("ul",s).html("");var g=r.val().replace(/\,/g,"");if(g){var o=g.split(".");g=o[0];var c=o[1];if(t=a("li",s).length,g.length+1>t){for(var d=i.slice(t,g.length+1).reverse(),h=[],v=0;v<d.length;v++)h.push("元"==d[v]?'<li style="border-right:none"><div>'+d[v]+"</div><strong></strong></li>":"<li><div>"+d[v]+"</div><strong></strong></li>");a("ul",s).prepend(h.join("")),e.each(e.makeArray(a("li",s)).reverse(),function(e,t){t&&t%3==0&&a(e).addClass("separator")})}if(c&&u.length<2){for(var m=0;m<c.length;m++)u.push('<li style="border-left:2px solid '+n.get("borderColor")+';border-right:none;" class="J_PriceDot"><div>'+l[m]+"</div><strong></strong></li>");a("ul",s).append(u.join(""))}var p=a("strong",s);if(p.html("").removeClass("yen"),c){a(p[p.length-g.length-c.length-1]).html("&yen;").addClass("yen");for(var f=0;f<g.length;f++)a(p[p.length-g.length-c.length+f]).html(g.charAt(f));for(var m=0;m<c.length;m++)a(p[p.length-c.length+m]).html(c.charAt(m))}else a(p[p.length-g.length-1]).html("&yen;").addClass("yen"),e.each(g,function(e,t){a(p[p.length-g.length+t]).html(e)});s.fadeIn(.4),s.width(30*s.children().children().length)}},_renderChineseWords:function(){var e=this,t=e.get("$target"),n=t.prev("."+e.get("cls")),a=e.toCnNumber(t.val());n.replaceClass(e.get("cellMoneyCls"),e.get("cnMoneyCls")),n.html(a+'<span class="unit">元</span>'),n.width(20*(a.length+1)),n.fadeIn(.4)},toCnNumber:function(e){var t=this,n=t._resetNum(e);return t._tempChinese(n)},_tempChinese:function(e){for(var t=new Array("零","壹","贰","叁","肆","伍","陆","柒","捌","玖"),n=new Array("","拾","佰","仟","万","亿","点",""),a=(""+e).replace(/(^0*)/g,"").split("."),r=0,s="",i=a[0].length-1;i>=0;i--){switch(r){case 0:s=n[7]+s;break;case 4:new RegExp("0{4}\\d{"+(a[0].length-i-1)+"}$").test(a[0])||(s=n[4]+s);break;case 8:s=n[5]+s,n[7]=n[5],r=0}r%4==2&&"0"==a[0].charAt(i)&&"0"!=a[0].charAt(i+1)&&(s=t[0]+s),0!=a[0].charAt(i)&&(s=t[a[0].charAt(i)]+n[r%4]+s),r++}if(a.length>1){s+=n[6];for(var i=0;i<a[1].length;i++)s+=t[a[1].charAt(i)]}return s},_resetNum:function(e){var t,n=e.replace(/(\s+)|,/g,"").replace(/(\.+)/g,".").replace(/\,/g,"");return t=/^(\d*)?\d+(\.?)(\d?)(\d?)$/.test(n)?n:!1},addCommas:function(e){var t=this,n=t._resetNum(e);if(!n)return"";n+="";for(var a=n.split("."),r=a[0],s=a.length>1?"."+a[1]:"",i=/(\d+)(\d{3})/;i.test(r);)r=r.replace(i,"$1,$2");return r+s}},{ATTRS:{pluginId:{value:"amountInWords"},type:{value:"inCells"},types:{value:{cellType:"inCells",wordType:"inWords"}},cls:{value:"J_CnMoney"},cnMoneyCls:{value:"cn-money"},cellMoneyCls:{value:"cell-money"},vcNumber:{value:n},beforeChange:{value:n},afterChange:{value:n},moneyTpl:{value:'<div class="J_CnMoney cell-money"><ul></ul></div>'},borderColor:{value:"#fdcc7d"}}})}(),s=function(t){var n=l.all,a=i,s=r,u="",g=new s,o="beforeChange",c="afterChange",d="changing",h=a.extend({initializer:function(){var e=this,t=e.get("$target");t.length||e.set("$target",n('input[type="text"]'))},render:function(){var e=this,t=e.get("$target");if(!t.length)return!1;var n=e.get("cls").init;t.hasClass(n)||t.addClass(n),e._addHTML(),e._eventOnChangeNum(),e._eventOnValide()},_isNativeSpinBox:function(){var e=this,t=e.get("$target");return"number"==t.attr("type")?!0:!1},_addHTML:function(){var e=this,t=e.get("$target"),a=e.get("ariaLabel");t.each(function(t){var r=t.parent(),s=n(e.get("outerTpl")),i=n(e.get("plusTpl")),l=n(e.get("minusTpl")),u=n(e.get("rangeTpl"));t.attr({"aria-label":a}),s.append(l).append(t).append(i).append(u),r.append(s)})},_eventOnChangeNum:function(){var t=this,a=t.get("cls"),r=t.get("$target");r.each(function(r){var s=r.siblings("."+a.sign),i="keyup keydown mouseup mousedown";e.UA.mobile&&(i="touchstart touchend"),s.on(i,function(r){var s=n(r.currentTarget),i=s.parent(1),l=i.children("."+a.init),g=Number(e.trim(l.val().replace(/\,/g,""))),h=Number(e.trim(l.attr("data-range")))||t.get("range"),v=1e3,m=0,p=!0,f=function(){r.currentTarget.className.indexOf(a.plus)>-1?g+=h:r.currentTarget.className.indexOf(a.minus)>-1&&(g-=h),p=t.fire(o,{input:l,trigger:s}),t.set("evBack",p),0!=p&&(t._limitRange(g,l),t.fire(d,{input:l,trigger:s}))};if(("keydown"==r.type||"mousedown"==r.type||"touchstart"==r.type)&&(f(),u&&clearTimeout(u),u=setTimeout(function(){f(),v=150,m++,m>10&&(v=100),u=setTimeout(arguments.callee,v)},v)),"keyup"==r.type||"mouseup"==r.type||"touchend"==r.type){if(u&&clearTimeout(u),m=0,0==t.get("evBack"))return;t.fire(c,{input:l,trigger:s})}})}),r.on("keydown keyup",function(a){var r=n(a.currentTarget),s=Number(e.trim(r.val().replace(/\,/g,""))),i=Number(e.trim(r.attr("data-range")))||t.get("range"),l=!0,u=function(){38===a.keyCode?s+=i:40===a.keyCode&&(s-=i),l=t.fire(o,{input:r,trigger:a.keyCode}),t.set("evBack",l),0!=l&&(t._limitRange(s,r),t.fire(d,{input:r,trigger:a.keyCode}))};if((38===a.keyCode||40===a.keyCode)&&("keydown"==a.type&&u(),"keyup"==a.type)){if(0==t.get("evBack"))return;t.fire(c,{input:r,trigger:a.keyCode})}}),t.get("showRange")&&t.on(c,function(n){var r,s=n.input,i=n.trigger,l=Number(e.trim(s.attr("data-range")))||t.get("range"),u=s.siblings("."+a.range);i.hasClass&&i.hasClass(a.plus)||38==i?r="+":(i.hasClass&&i.hasClass(a.minus)||40==i)&&(r="-"),!s.siblings("."+a.disabled).length&&r&&(u.html(r+l).show(),setTimeout(function(){u.addClass(a.slideout)},50),setTimeout(function(){u.hide().removeClass(a.slideout)},500))})},_eventOnValide:function(){var t,a=this,r=a.get("$target");r.each(function(s){s.on("focus",function(){t=n(this).val()}),s.on("blur",function(){var t=n(this);a._formatNum(t),a._limitRange(Number(e.trim(t.val())),t),u&&clearTimeout(u),0!=a.get("evBack")&&a.fire(c,{input:r,trigger:t})})})},_toFloat:function(e){return parseFloat(e)},_formatNum:function(e){var t=this,n=Number(e.attr("data-min"))||t.get("min"),a=t._toFloat(e.val().replace(/[^\d\.]/g,"").replace(/^0+/,"").replace(/\,/g,""));a=isNaN(a)?n:Math.max(a,n);var r=e.attr("data-hasdecimal")||t.get("hasDecimal").toString(),s="true"==r?2:0;e.val(a.toFixed(s))},_limitRange:function(e,t){var a=this,r=t,s=r.parent(1),i=a._toFloat,l=a.get("cls"),u=i(r.attr("data-min"))||a.get("min"),o=i(r.attr("data-max"))||a.get("max"),c=r.attr("data-hasdecimal")||a.get("hasDecimal").toString(),d=u&&Math.max(u,e);d=o&&Math.min(o,d);var h="true"==c?2:0,v=d.toFixed(h),m=r.attr("data-cn");m&&(v=g.addCommas(v)),r.val(v),d===u?(n("."+l.minus,s).addClass(l.disabled),n("."+l.plus,s).removeClass(l.disabled)):d===o?(n("."+l.plus,s).addClass(l.disabled),n("."+l.minus,s).removeClass(l.disabled)):n("."+l.sign,s).removeClass(l.disabled)}},{ATTRS:{$target:{value:"",getter:function(e){return n(e)}},min:{value:Number.MIN_VALUE},max:{value:Number.MAX_VALUE},range:{value:1},showRange:{value:!1},hasDecimal:{value:!1},evBack:{value:!0},cls:{value:{init:"vc-number",sign:"vc-number-sign",plus:"vc-number-plus",minus:"vc-number-minus",container:"vc-plus-minus-operation",disabled:"vc-number-disabled",range:"vc-number-range-icon",slideout:"slideout"}},outerTpl:{value:'<span class="{container}"></span>',getter:function(t){var n=this,a=n.get("cls");return e.substitute(t,{container:a.container})}},plusTpl:{value:'<a href="#!/plus" class="{plus} {sign}" role="button"><span class="{plus}-sign">+</span></a>',getter:function(t){var n=this,a=n.get("cls");return e.substitute(t,{plus:a.plus,sign:a.sign})}},minusTpl:{value:'<a href="#!/minus" class="{minus} {sign}"  role="button"><span class="{minus}-sign">-</span></a>',getter:function(t){var n=this,a=n.get("cls");return e.substitute(t,{minus:a.minus,sign:a.sign})}},rangeTpl:{value:'<p class="vc-number-range-icon"></p>'},ariaLabel:{value:"出价框，请输入价格"}}});return t=h}(),a.exports=s});