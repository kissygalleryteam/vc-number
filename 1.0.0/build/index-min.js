KISSY.add("kg/vc-number/1.0.0/index",["base","node"],function(e,t,n,a){var r,i,l=t("base"),s=t("node");r=function(t){var n="",a=s.all,r=l;return t=r.extend({pluginInitializer:function(e){var t=this;if(e){var n=e.get("$target");n.attr("data-cn",!0),t.set("vcNumber",e),t.set("$target",e.get("$target")),t._renderHtml(),t._bindEvents()}},pluginDestructor:function(){var e=this,t=e.get("vcNumber");t.detach("beforeChange",e.get("beforeChange")),t.detach("afterChange",e.get("afterChange"))},_renderHtml:function(){var e=this,t=e.get("$target"),n=e.get("moneyTpl");a(n).insertBefore(t)},_bindEvents:function(){var e=this,t=e.get("vcNumber"),n=function(){},r=function(t){var n=t.input||a(t.currentTarget),r=e.addCommas(n.val());n.val(r);var i=e.get("type"),l=e.get("types");switch(i){case l.cellType:e._renderChineseNumUl();break;case l.wordType:e._renderChineseWords()}};e.set("beforeChange",n),e.set("afterChange",r),t.on("beforeChange",n),t.on("afterChange",r),e.get("$target").on("focus",r);var i=t.get("cls").init,l=t.get("cls").sign,s=e.get("cls");a(document).on("click",function(t){var n=a(t.target);n.hasClass(i)||n.hasClass(s)||n.hasClass(l)||!n.parent()||n.parent().hasClass(l)||e._hideChineseNumUl()})},_hideChineseNumUl:function(){var e=this,t=e.get("$target");t.prev("."+e.get("cls")).fadeOut(.4)},_renderChineseNumUl:function(){var t,n=this,r=n.get("$target"),i=r.prev("."+n.get("cls")),l=["元","十","百","千","万","十","百","千","亿","十","百","千","兆","十","百","千"],s=["角","分"],u=[];a("ul",i).html("");var g=r.val().replace(/\,/g,"");if(g){var o=g.split(".");g=o[0];var c=o[1];if(t=a("li",i).length,g.length+1>t){for(var d=l.slice(t,g.length+1).reverse(),h=[],v=0;v<d.length;v++)h.push("元"==d[v]?'<li style="border-right:none"><div>'+d[v]+"</div><strong></strong></li>":"<li><div>"+d[v]+"</div><strong></strong></li>");a("ul",i).prepend(h.join("")),e.each(e.makeArray(a("li",i)).reverse(),function(e,t){t&&t%3==0&&a(e).addClass("separator")})}if(c&&u.length<2){for(var m=0;m<c.length;m++)u.push('<li style="border-left:1px solid '+n.get("borderColor")+';border-right:none;" class="J_PriceDot"><div>'+s[m]+"</div><strong></strong></li>");a("ul",i).append(u.join(""))}var p=a("strong",i);if(p.html("").removeClass("yen"),c){a(p[p.length-g.length-c.length-1]).html("&yen;").addClass("yen");for(var f=0;f<g.length;f++)a(p[p.length-g.length-c.length+f]).html(g.charAt(f));for(var m=0;m<c.length;m++)a(p[p.length-c.length+m]).html(c.charAt(m))}else a(p[p.length-g.length-1]).html("&yen;").addClass("yen"),e.each(g,function(e,t){a(p[p.length-g.length+t]).html(e)});i.fadeIn(.4),i.width(29*i.children().children().length)}},_renderChineseWords:function(){var e=this,t=e.get("$target"),n=t.prev("."+e.get("cls")),a=e.toCnNumber(t.val());n.replaceClass(e.get("cellMoneyCls"),e.get("cnMoneyCls")),n.html(a+'<span class="unit">元</span>'),n.width(19*a.length),n.fadeIn(.4)},toCnNumber:function(e){var t=this,n=t._resetNum(e);return t._tempChinese(n)},_tempChinese:function(e){for(var t=new Array("零","壹","贰","叁","肆","伍","陆","柒","捌","玖"),n=new Array("","拾","佰","仟","万","亿","点",""),a=(""+e).replace(/(^0*)/g,"").split("."),r=0,i="",l=a[0].length-1;l>=0;l--){switch(r){case 0:i=n[7]+i;break;case 4:new RegExp("0{4}\\d{"+(a[0].length-l-1)+"}$").test(a[0])||(i=n[4]+i);break;case 8:i=n[5]+i,n[7]=n[5],r=0}r%4==2&&"0"==a[0].charAt(l)&&"0"!=a[0].charAt(l+2)&&(i=t[0]+i),0!=a[0].charAt(l)&&(i=t[a[0].charAt(l)]+n[r%4]+i),r++}if(a.length>1){i+=n[6];for(var l=0;l<a[1].length;l++)i+=t[a[1].charAt(l)]}return i},_resetNum:function(e){var t,n=e.replace(/(\s+)|,/g,"").replace(/(\.+)/g,".").replace(/\,/g,"");return t=/^(\d*)?\d+(\.?)(\d?)(\d?)$/.test(n)?n:!1},addCommas:function(e){var t=this,n=t._resetNum(e);if(!n)return"";n+="";for(var a=n.split("."),r=a[0],i=a.length>1?"."+a[1]:"",l=/(\d+)(\d{3})/;l.test(r);)r=r.replace(l,"$1,$2");return r+i}},{ATTRS:{pluginId:{value:"amountInWords"},type:{value:"inCells"},types:{value:{cellType:"inCells",wordType:"inWords"}},cls:{value:"J_CnMoney"},cnMoneyCls:{value:"cn-money"},cellMoneyCls:{value:"cell-money"},vcNumber:{value:n},beforeChange:{value:n},afterChange:{value:n},moneyTpl:{value:'<div class="J_CnMoney cell-money"><ul></ul></div>'},borderColor:{value:"#fdcc7d"}}})}(),i=function(t){var n=s.all,a=l,i=r,u="",g=new i,o=a.extend({initializer:function(){{var e=this;e.get("$target")}},render:function(){var e=this,t=e.get("$target");if(!t.length||e._isNativeSpinBox())return!1;var n=e.get("cls").init;t.hasClass(n)||t.addClass(n),e._addHTML(),e._eventOnChangeNum(),e._eventOnValide()},_isNativeSpinBox:function(){var e=this,t=e.get("$target");return"number"==t.attr("type")?!0:!1},_addHTML:function(){var e=this,t=e.get("$target"),a=e.get("ariaLabel");t.each(function(t){var r=t.parent(),i=n(e.get("outerTpl")),l=n(e.get("plusTpl")),s=n(e.get("minusTpl"));t.attr({"aria-label":a}),i.append(s).append(t).append(l),r.append(i)})},_eventOnChangeNum:function(){var t=this,a=t.get("cls"),r=t.get("$target");r.each(function(r){var i=r.siblings("."+a.sign);i.on("keyup keydown mouseup mousedown",function(r){var i=n(r.currentTarget),l=i.parent(1),s=l.children("."+a.init),g=Number(e.trim(s.val().replace(/\,/g,""))),o=Number(e.trim(s.attr("data-range")))||t.get("range"),c=1e3,d=0,h=function(){r.currentTarget.className.indexOf(a.plus)>-1?g+=o:r.currentTarget.className.indexOf(a.minus)>-1&&(g-=o),t._limitRange(g,s)};("keydown"==r.type||"mousedown"==r.type)&&(t.fire("beforeChange",{input:s,trigger:i}),h(),u&&clearTimeout(u),u=setTimeout(function(){h(),c=150,d++,d>10&&(c=100),u=setTimeout(arguments.callee,c)},c)),("keyup"==r.type||"mouseup"==r.type)&&(u&&clearTimeout(u),d=0,t.fire("afterChange",{input:s,trigger:i}))})}),r.on("keydown keyup",function(a){var r=n(this),i=n(a.currentTarget),l=Number(e.trim(i.val().replace(/\,/g,""))),s=Number(e.trim(i.attr("data-range")))||t.get("range"),u=function(){38===a.keyCode?l+=s:40===a.keyCode&&(l-=s),t._limitRange(l,i)};(38===a.keyCode||40===a.keyCode)&&("keydown"==a.type&&(t.fire("beforeChange",{input:i,trigger:r}),u()),"keyup"==a.type&&t.fire("afterChange",{input:i,trigger:r}))})},_eventOnValide:function(){var t,a=this,r=a.get("$target");r.on("focus",function(){t=n(this).val()}),r.on("blur",function(){var t=n(this);a._formatNum(t),a._limitRange(Number(e.trim(t.val())),t),u&&clearTimeout(u),a.fire("afterChange",{input:r,trigger:t})})},_toFloat:function(e){return parseFloat(e)},_formatNum:function(e){var t=this,n=Number(e.attr("data-min"))||t.get("min"),a=t._toFloat(e.val().replace(/[^\d\.]/g,"").replace(/^0+/,"").replace(/\,/g,""));a=isNaN(a)?n:Math.max(a,n);var r=e.attr("data-hasdecimal")||t.get("hasDecimal").toString(),i="true"==r?2:0;e.val(a.toFixed(i))},_limitRange:function(e,t){var a=this,r=t,i=r.parent(1),l=a._toFloat,s=a.get("cls"),u=l(r.attr("data-min"))||a.get("min"),o=l(r.attr("data-max"))||a.get("max"),c=r.attr("data-hasdecimal")||a.get("hasDecimal").toString(),d=u&&Math.max(u,e);d=o&&Math.min(o,d);var h="true"==c?2:0,v=d.toFixed(h),m=r.attr("data-cn");m&&(v=g.addCommas(v)),r.val(v),d===u?n("."+s.minus,i).addClass(s.disabled):d===o?n("."+s.plus,i).addClass(s.disabled):n("."+s.sign,i).removeClass(s.disabled)}},{ATTRS:{$target:{value:"",getter:function(e){return n(e)}},cls:{value:{init:"vc-number",sign:"vc-number-sign",plus:"vc-number-plus",minus:"vc-number-minus",container:"vc-plus-minus-operation",disabled:"vc-number-disabled"}},outerTpl:{value:'<span class="{container}"></span>',getter:function(t){var n=this,a=n.get("cls");return e.substitute(t,{container:a.container})}},plusTpl:{value:'<a href="#!/plus" class="{plus} {sign}" role="button"><span class="{plus}-sign">+</span></a>',getter:function(t){var n=this,a=n.get("cls");return e.substitute(t,{plus:a.plus,sign:a.sign})}},minusTpl:{value:'<a href="#!/minus" class="{minus} {sign}"  role="button"><span class="{minus}-sign">-</span></a>',getter:function(t){var n=this,a=n.get("cls");return e.substitute(t,{minus:a.minus,sign:a.sign})}},min:{value:Number.MIN_VALUE},max:{value:Number.MAX_VALUE},range:{value:1},hasDecimal:{value:!1},ariaLabel:{value:"出价框，请输入价格"}}});return t=o}(),a.exports=i});