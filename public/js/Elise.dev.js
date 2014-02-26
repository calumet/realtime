/*!
 * Universidad Industrial de Santander
 * Grupo de Desarrollo de Software Calumet
 * Elise Library, Functionality
 * Duvan Vargas, @DuvanJamid; Romel Perez, @prhonedev
 * Octubre del 2012 - Noviembre del 2013
 * CODIFICACIÓN UTF-8
 **/

/*!	Bootstrap.js by @fat & @mdo
* Copyright 2012 Twitter, Inc.
* http://www.apache.org/licenses/LICENSE-2.0.txt
**/
!function(e){e(function(){"use strict";e.support.transition=function(){var e=function(){var e=document.createElement("bootstrap"),t={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"},n;for(n in t)if(e.style[n]!==undefined)return t[n]}();return e&&{end:e}}()})}(window.jQuery),!function(e){"use strict";var t='[data-dismiss="alert"]',n=function(n){e(n).on("click",t,this.close)};n.prototype.close=function(t){function s(){i.trigger("closed").remove()}var n=e(this),r=n.attr("data-target"),i;r||(r=n.attr("href"),r=r&&r.replace(/.*(?=#[^\s]*$)/,"")),i=e(r),t&&t.preventDefault(),i.length||(i=n.hasClass("alert")?n:n.parent()),i.trigger(t=e.Event("close"));if(t.isDefaultPrevented())return;i.removeClass("in"),e.support.transition&&i.hasClass("fade")?i.on(e.support.transition.end,s):s()},e.fn.alert=function(t){return this.each(function(){var r=e(this),i=r.data("alert");i||r.data("alert",i=new n(this)),typeof t=="string"&&i[t].call(r)})},e.fn.alert.Constructor=n,e(function(){e("body").on("click.alert.data-api",t,n.prototype.close)})}(window.jQuery),!function(e){"use strict";var t=function(t,n){this.$element=e(t),this.options=e.extend({},e.fn.button.defaults,n)};t.prototype.setState=function(e){var t="disabled",n=this.$element,r=n.data(),i=n.is("input")?"val":"html";e+="Text",r.resetText||n.data("resetText",n[i]()),n[i](r[e]||this.options[e]),setTimeout(function(){e=="loadingText"?n.addClass(t).attr(t,t):n.removeClass(t).removeAttr(t)},0)},t.prototype.toggle=function(){var e=this.$element.closest('[data-toggle="buttons-radio"]');e&&e.find(".active").removeClass("active"),this.$element.toggleClass("active")},e.fn.button=function(n){return this.each(function(){var r=e(this),i=r.data("button"),s=typeof n=="object"&&n;i||r.data("button",i=new t(this,s)),n=="toggle"?i.toggle():n&&i.setState(n)})},e.fn.button.defaults={loadingText:"loading..."},e.fn.button.Constructor=t,e(function(){e("body").on("click.button.data-api","[data-toggle^=button]",function(t){var n=e(t.target);n.hasClass("btn")||(n=n.closest(".btn")),n.button("toggle")})})}(window.jQuery),!function(e){"use strict";var t=function(t,n){this.$element=e(t),this.options=n,this.options.slide&&this.slide(this.options.slide),this.options.pause=="hover"&&this.$element.on("mouseenter",e.proxy(this.pause,this)).on("mouseleave",e.proxy(this.cycle,this))};t.prototype={cycle:function(t){return t||(this.paused=!1),this.options.interval&&!this.paused&&(this.interval=setInterval(e.proxy(this.next,this),this.options.interval)),this},to:function(t){var n=this.$element.find(".item.active"),r=n.parent().children(),i=r.index(n),s=this;if(t>r.length-1||t<0)return;return this.sliding?this.$element.one("slid",function(){s.to(t)}):i==t?this.pause().cycle():this.slide(t>i?"next":"prev",e(r[t]))},pause:function(t){return t||(this.paused=!0),this.$element.find(".next, .prev").length&&e.support.transition.end&&(this.$element.trigger(e.support.transition.end),this.cycle()),clearInterval(this.interval),this.interval=null,this},next:function(){if(this.sliding)return;return this.slide("next")},prev:function(){if(this.sliding)return;return this.slide("prev")},slide:function(t,n){var r=this.$element.find(".item.active"),i=n||r[t](),s=this.interval,o=t=="next"?"left":"right",u=t=="next"?"first":"last",a=this,f=e.Event("slide",{relatedTarget:i[0]});this.sliding=!0,s&&this.pause(),i=i.length?i:this.$element.find(".item")[u]();if(i.hasClass("active"))return;if(e.support.transition&&this.$element.hasClass("slide")){this.$element.trigger(f);if(f.isDefaultPrevented())return;i.addClass(t),i[0].offsetWidth,r.addClass(o),i.addClass(o),this.$element.one(e.support.transition.end,function(){i.removeClass([t,o].join(" ")).addClass("active"),r.removeClass(["active",o].join(" ")),a.sliding=!1,setTimeout(function(){a.$element.trigger("slid")},0)})}else{this.$element.trigger(f);if(f.isDefaultPrevented())return;r.removeClass("active"),i.addClass("active"),this.sliding=!1,this.$element.trigger("slid")}return s&&this.cycle(),this}},e.fn.carousel=function(n){return this.each(function(){var r=e(this),i=r.data("carousel"),s=e.extend({},e.fn.carousel.defaults,typeof n=="object"&&n),o=typeof n=="string"?n:s.slide;i||r.data("carousel",i=new t(this,s)),typeof n=="number"?i.to(n):o?i[o]():s.interval&&i.cycle()})},e.fn.carousel.defaults={interval:5e3,pause:"hover"},e.fn.carousel.Constructor=t,e(function(){e("body").on("click.carousel.data-api","[data-slide]",function(t){var n=e(this),r,i=e(n.attr("data-target")||(r=n.attr("href"))&&r.replace(/.*(?=#[^\s]+$)/,"")),s=!i.data("modal")&&e.extend({},i.data(),n.data());i.carousel(s),t.preventDefault()})})}(window.jQuery),!function(e){"use strict";var t=function(t,n){this.$element=e(t),this.options=e.extend({},e.fn.collapse.defaults,n),this.options.parent&&(this.$parent=e(this.options.parent)),this.options.toggle&&this.toggle()};t.prototype={constructor:t,dimension:function(){var e=this.$element.hasClass("width");return e?"width":"height"},show:function(){var t,n,r,i;if(this.transitioning)return;t=this.dimension(),n=e.camelCase(["scroll",t].join("-")),r=this.$parent&&this.$parent.find("> .accordion-group > .in");if(r&&r.length){i=r.data("collapse");if(i&&i.transitioning)return;r.collapse("hide"),i||r.data("collapse",null)}this.$element[t](0),this.transition("addClass",e.Event("show"),"shown"),e.support.transition&&this.$element[t](this.$element[0][n])},hide:function(){var t;if(this.transitioning)return;t=this.dimension(),this.reset(this.$element[t]()),this.transition("removeClass",e.Event("hide"),"hidden"),this.$element[t](0)},reset:function(e){var t=this.dimension();return this.$element.removeClass("collapse")[t](e||"auto")[0].offsetWidth,this.$element[e!==null?"addClass":"removeClass"]("collapse"),this},transition:function(t,n,r){var i=this,s=function(){n.type=="show"&&i.reset(),i.transitioning=0,i.$element.trigger(r)};this.$element.trigger(n);if(n.isDefaultPrevented())return;this.transitioning=1,this.$element[t]("in"),e.support.transition&&this.$element.hasClass("collapse")?this.$element.one(e.support.transition.end,s):s()},toggle:function(){this[this.$element.hasClass("in")?"hide":"show"]()}},e.fn.collapse=function(n){return this.each(function(){var r=e(this),i=r.data("collapse"),s=typeof n=="object"&&n;i||r.data("collapse",i=new t(this,s)),typeof n=="string"&&i[n]()})},e.fn.collapse.defaults={toggle:!0},e.fn.collapse.Constructor=t,e(function(){e("body").on("click.collapse.data-api","[data-toggle=collapse]",function(t){var n=e(this),r,i=n.attr("data-target")||t.preventDefault()||(r=n.attr("href"))&&r.replace(/.*(?=#[^\s]+$)/,""),s=e(i).data("collapse")?"toggle":n.data();n[e(i).hasClass("in")?"addClass":"removeClass"]("collapsed"),e(i).collapse(s)})})}(window.jQuery),!function(e){"use strict";function r(){i(e(t)).removeClass("open")}function i(t){var n=t.attr("data-target"),r;return n||(n=t.attr("href"),n=n&&/#/.test(n)&&n.replace(/.*(?=#[^\s]*$)/,"")),r=e(n),r.length||(r=t.parent()),r}var t="[data-toggle=dropdown]",n=function(t){var n=e(t).on("click.dropdown.data-api",this.toggle);e("html").on("click.dropdown.data-api",function(){n.parent().removeClass("open")})};n.prototype={constructor:n,toggle:function(t){var n=e(this),s,o;if(n.is(".disabled, :disabled"))return;return s=i(n),o=s.hasClass("open"),r(),o||(s.toggleClass("open"),n.focus()),!1},keydown:function(t){var n,r,s,o,u,a;if(!/(38|40|27)/.test(t.keyCode))return;n=e(this),t.preventDefault(),t.stopPropagation();if(n.is(".disabled, :disabled"))return;o=i(n),u=o.hasClass("open");if(!u||u&&t.keyCode==27)return n.click();r=e("[role=menu] li:not(.divider) a",o);if(!r.length)return;a=r.index(r.filter(":focus")),t.keyCode==38&&a>0&&a--,t.keyCode==40&&a<r.length-1&&a++,~a||(a=0),r.eq(a).focus()}},e.fn.dropdown=function(t){return this.each(function(){var r=e(this),i=r.data("dropdown");i||r.data("dropdown",i=new n(this)),typeof t=="string"&&i[t].call(r)})},e.fn.dropdown.Constructor=n,e(function(){e("html").on("click.dropdown.data-api touchstart.dropdown.data-api",r),e("body").on("click.dropdown touchstart.dropdown.data-api",".dropdown form",function(e){e.stopPropagation()}).on("click.dropdown.data-api touchstart.dropdown.data-api",t,n.prototype.toggle).on("keydown.dropdown.data-api touchstart.dropdown.data-api",t+", [role=menu]",n.prototype.keydown)})}(window.jQuery),!function(e){"use strict";var t=function(t,n){this.options=n,this.$element=e(t).delegate('[data-dismiss="modal"]',"click.dismiss.modal",e.proxy(this.hide,this)),this.options.remote&&this.$element.find(".modal-body").load(this.options.remote)};t.prototype={constructor:t,toggle:function(){return this[this.isShown?"hide":"show"]()},show:function(){var t=this,n=e.Event("show");this.$element.trigger(n);if(this.isShown||n.isDefaultPrevented())return;e("body").addClass("modal-open"),this.isShown=!0,this.escape(),this.backdrop(function(){var n=e.support.transition&&t.$element.hasClass("fade");t.$element.parent().length||t.$element.appendTo(document.body),t.$element.show(),n&&t.$element[0].offsetWidth,t.$element.addClass("in").attr("aria-hidden",!1).focus(),t.enforceFocus(),n?t.$element.one(e.support.transition.end,function(){t.$element.trigger("shown")}):t.$element.trigger("shown")})},hide:function(t){t&&t.preventDefault();var n=this;t=e.Event("hide"),this.$element.trigger(t);if(!this.isShown||t.isDefaultPrevented())return;this.isShown=!1,e("body").removeClass("modal-open"),this.escape(),e(document).off("focusin.modal"),this.$element.removeClass("in").attr("aria-hidden",!0),e.support.transition&&this.$element.hasClass("fade")?this.hideWithTransition():this.hideModal()},enforceFocus:function(){var t=this;e(document).on("focusin.modal",function(e){t.$element[0]!==e.target&&!t.$element.has(e.target).length&&t.$element.focus()})},escape:function(){var e=this;this.isShown&&this.options.keyboard?this.$element.on("keyup.dismiss.modal",function(t){t.which==27&&e.hide()}):this.isShown||this.$element.off("keyup.dismiss.modal")},hideWithTransition:function(){var t=this,n=setTimeout(function(){t.$element.off(e.support.transition.end),t.hideModal()},500);this.$element.one(e.support.transition.end,function(){clearTimeout(n),t.hideModal()})},hideModal:function(e){this.$element.hide().trigger("hidden"),this.backdrop()},removeBackdrop:function(){this.$backdrop.remove(),this.$backdrop=null},backdrop:function(t){var n=this,r=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var i=e.support.transition&&r;this.$backdrop=e('<div class="modal-backdrop '+r+'" />').appendTo(document.body),this.options.backdrop!="static"&&this.$backdrop.click(e.proxy(this.hide,this)),i&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in"),i?this.$backdrop.one(e.support.transition.end,t):t()}else!this.isShown&&this.$backdrop?(this.$backdrop.removeClass("in"),e.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one(e.support.transition.end,e.proxy(this.removeBackdrop,this)):this.removeBackdrop()):t&&t()}},e.fn.modal=function(n){return this.each(function(){var r=e(this),i=r.data("modal"),s=e.extend({},e.fn.modal.defaults,r.data(),typeof n=="object"&&n);i||r.data("modal",i=new t(this,s)),typeof n=="string"?i[n]():s.show&&i.show()})},e.fn.modal.defaults={backdrop:!0,keyboard:!0,show:!0},e.fn.modal.Constructor=t,e(function(){e("body").on("click.modal.data-api",'[data-toggle="modal"]',function(t){var n=e(this),r=n.attr("href"),i=e(n.attr("data-target")||r&&r.replace(/.*(?=#[^\s]+$)/,"")),s=i.data("modal")?"toggle":e.extend({remote:!/#/.test(r)&&r},i.data(),n.data());t.preventDefault(),i.modal(s).one("hide",function(){n.focus()})})})}(window.jQuery),!function(e){"use strict";var t=function(e,t){this.init("tooltip",e,t)};t.prototype={constructor:t,init:function(t,n,r){var i,s;this.type=t,this.$element=e(n),this.options=this.getOptions(r),this.enabled=!0,this.options.trigger=="click"?this.$element.on("click."+this.type,this.options.selector,e.proxy(this.toggle,this)):this.options.trigger!="manual"&&(i=this.options.trigger=="hover"?"mouseenter":"focus",s=this.options.trigger=="hover"?"mouseleave":"blur",this.$element.on(i+"."+this.type,this.options.selector,e.proxy(this.enter,this)),this.$element.on(s+"."+this.type,this.options.selector,e.proxy(this.leave,this))),this.options.selector?this._options=e.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},getOptions:function(t){return t=e.extend({},e.fn[this.type].defaults,t,this.$element.data()),t.delay&&typeof t.delay=="number"&&(t.delay={show:t.delay,hide:t.delay}),t},enter:function(t){var n=e(t.currentTarget)[this.type](this._options).data(this.type);if(!n.options.delay||!n.options.delay.show)return n.show();clearTimeout(this.timeout),n.hoverState="in",this.timeout=setTimeout(function(){n.hoverState=="in"&&n.show()},n.options.delay.show)},leave:function(t){var n=e(t.currentTarget)[this.type](this._options).data(this.type);this.timeout&&clearTimeout(this.timeout);if(!n.options.delay||!n.options.delay.hide)return n.hide();n.hoverState="out",this.timeout=setTimeout(function(){n.hoverState=="out"&&n.hide()},n.options.delay.hide)},show:function(){var e,t,n,r,i,s,o;if(this.hasContent()&&this.enabled){e=this.tip(),this.setContent(),this.options.animation&&e.addClass("fade"),s=typeof this.options.placement=="function"?this.options.placement.call(this,e[0],this.$element[0]):this.options.placement,t=/in/.test(s),e.remove().css({top:0,left:0,display:"block"}).appendTo(t?this.$element:document.body),n=this.getPosition(t),r=e[0].offsetWidth,i=e[0].offsetHeight;switch(t?s.split(" ")[1]:s){case"bottom":o={top:n.top+n.height,left:n.left+n.width/2-r/2};break;case"top":o={top:n.top-i,left:n.left+n.width/2-r/2};break;case"left":o={top:n.top+n.height/2-i/2,left:n.left-r};break;case"right":o={top:n.top+n.height/2-i/2,left:n.left+n.width}}e.css(o).addClass(s).addClass("in")}},setContent:function(){var e=this.tip(),t=this.getTitle();e.find(".tooltip-inner")[this.options.html?"html":"text"](t),e.removeClass("fade in top bottom left right")},hide:function(){function r(){var t=setTimeout(function(){n.off(e.support.transition.end).remove()},500);n.one(e.support.transition.end,function(){clearTimeout(t),n.remove()})}var t=this,n=this.tip();return n.removeClass("in"),e.support.transition&&this.$tip.hasClass("fade")?r():n.remove(),this},fixTitle:function(){var e=this.$element;(e.attr("title")||typeof e.attr("data-original-title")!="string")&&e.attr("data-original-title",e.attr("title")||"").removeAttr("title")},hasContent:function(){return this.getTitle()},getPosition:function(t){return e.extend({},t?{top:0,left:0}:this.$element.offset(),{width:this.$element[0].offsetWidth,height:this.$element[0].offsetHeight})},getTitle:function(){var e,t=this.$element,n=this.options;return e=t.attr("data-original-title")||(typeof n.title=="function"?n.title.call(t[0]):n.title),e},tip:function(){return this.$tip=this.$tip||e(this.options.template)},validate:function(){this.$element[0].parentNode||(this.hide(),this.$element=null,this.options=null)},enable:function(){this.enabled=!0},disable:function(){this.enabled=!1},toggleEnabled:function(){this.enabled=!this.enabled},toggle:function(){this[this.tip().hasClass("in")?"hide":"show"]()},destroy:function(){this.hide().$element.off("."+this.type).removeData(this.type)}},e.fn.tooltip=function(n){return this.each(function(){var r=e(this),i=r.data("tooltip"),s=typeof n=="object"&&n;i||r.data("tooltip",i=new t(this,s)),typeof n=="string"&&i[n]()})},e.fn.tooltip.Constructor=t,e.fn.tooltip.defaults={animation:!0,placement:"top",selector:!1,template:'<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover",title:"",delay:0,html:!0}}(window.jQuery),!function(e){"use strict";var t=function(e,t){this.init("popover",e,t)};t.prototype=e.extend({},e.fn.tooltip.Constructor.prototype,{constructor:t,setContent:function(){var e=this.tip(),t=this.getTitle(),n=this.getContent();e.find(".popover-title")[this.options.html?"html":"text"](t),e.find(".popover-content > *")[this.options.html?"html":"text"](n),e.removeClass("fade top bottom left right in")},hasContent:function(){return this.getTitle()||this.getContent()},getContent:function(){var e,t=this.$element,n=this.options;return e=t.attr("data-content")||(typeof n.content=="function"?n.content.call(t[0]):n.content),e},tip:function(){return this.$tip||(this.$tip=e(this.options.template)),this.$tip},destroy:function(){this.hide().$element.off("."+this.type).removeData(this.type)}}),e.fn.popover=function(n){return this.each(function(){var r=e(this),i=r.data("popover"),s=typeof n=="object"&&n;i||r.data("popover",i=new t(this,s)),typeof n=="string"&&i[n]()})},e.fn.popover.Constructor=t,e.fn.popover.defaults=e.extend({},e.fn.tooltip.defaults,{placement:"right",trigger:"click",content:"",template:'<div class="popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>'})}(window.jQuery),!function(e){"use strict";function t(t,n){var r=e.proxy(this.process,this),i=e(t).is("body")?e(window):e(t),s;this.options=e.extend({},e.fn.scrollspy.defaults,n),this.$scrollElement=i.on("scroll.scroll-spy.data-api",r),this.selector=(this.options.target||(s=e(t).attr("href"))&&s.replace(/.*(?=#[^\s]+$)/,"")||"")+" .nav li > a",this.$body=e("body"),this.refresh(),this.process()}t.prototype={constructor:t,refresh:function(){var t=this,n;this.offsets=e([]),this.targets=e([]),n=this.$body.find(this.selector).map(function(){var t=e(this),n=t.data("target")||t.attr("href"),r=/^#\w/.test(n)&&e(n);return r&&r.length&&[[r.position().top,n]]||null}).sort(function(e,t){return e[0]-t[0]}).each(function(){t.offsets.push(this[0]),t.targets.push(this[1])})},process:function(){var e=this.$scrollElement.scrollTop()+this.options.offset,t=this.$scrollElement[0].scrollHeight||this.$body[0].scrollHeight,n=t-this.$scrollElement.height(),r=this.offsets,i=this.targets,s=this.activeTarget,o;if(e>=n)return s!=(o=i.last()[0])&&this.activate(o);for(o=r.length;o--;)s!=i[o]&&e>=r[o]&&(!r[o+1]||e<=r[o+1])&&this.activate(i[o])},activate:function(t){var n,r;this.activeTarget=t,e(this.selector).parent(".active").removeClass("active"),r=this.selector+'[data-target="'+t+'"],'+this.selector+'[href="'+t+'"]',n=e(r).parent("li").addClass("active"),n.parent(".dropdown-menu").length&&(n=n.closest("li.dropdown").addClass("active")),n.trigger("activate")}},e.fn.scrollspy=function(n){return this.each(function(){var r=e(this),i=r.data("scrollspy"),s=typeof n=="object"&&n;i||r.data("scrollspy",i=new t(this,s)),typeof n=="string"&&i[n]()})},e.fn.scrollspy.Constructor=t,e.fn.scrollspy.defaults={offset:10},e(window).on("load",function(){e('[data-spy="scroll"]').each(function(){var t=e(this);t.scrollspy(t.data())})})}(window.jQuery),!function(e){"use strict";var t=function(t){this.element=e(t)};t.prototype={constructor:t,show:function(){var t=this.element,n=t.closest("ul:not(.dropdown-menu)"),r=t.attr("data-target"),i,s,o;r||(r=t.attr("href"),r=r&&r.replace(/.*(?=#[^\s]*$)/,""));if(t.parent("li").hasClass("active"))return;i=n.find(".active a").last()[0],o=e.Event("show",{relatedTarget:i}),t.trigger(o);if(o.isDefaultPrevented())return;s=e(r),this.activate(t.parent("li"),n),this.activate(s,s.parent(),function(){t.trigger({type:"shown",relatedTarget:i})})},activate:function(t,n,r){function o(){i.removeClass("active").find("> .dropdown-menu > .active").removeClass("active"),t.addClass("active"),s?(t[0].offsetWidth,t.addClass("in")):t.removeClass("fade"),t.parent(".dropdown-menu")&&t.closest("li.dropdown").addClass("active"),r&&r()}var i=n.find("> .active"),s=r&&e.support.transition&&i.hasClass("fade");s?i.one(e.support.transition.end,o):o(),i.removeClass("in")}},e.fn.tab=function(n){return this.each(function(){var r=e(this),i=r.data("tab");i||r.data("tab",i=new t(this)),typeof n=="string"&&i[n]()})},e.fn.tab.Constructor=t,e(function(){e("body").on("click.tab.data-api",'[data-toggle="tab"], [data-toggle="pill"]',function(t){t.preventDefault(),e(this).tab("show")})})}(window.jQuery),!function(e){"use strict";var t=function(t,n){this.$element=e(t),this.options=e.extend({},e.fn.typeahead.defaults,n),this.matcher=this.options.matcher||this.matcher,this.sorter=this.options.sorter||this.sorter,this.highlighter=this.options.highlighter||this.highlighter,this.updater=this.options.updater||this.updater,this.$menu=e(this.options.menu).appendTo("body"),this.source=this.options.source,this.shown=!1,this.listen()};t.prototype={constructor:t,select:function(){var e=this.$menu.find(".active").attr("data-value");return this.$element.val(this.updater(e)).change(),this.hide()},updater:function(e){return e},show:function(){var t=e.extend({},this.$element.offset(),{height:this.$element[0].offsetHeight});return this.$menu.css({top:t.top+t.height,left:t.left}),this.$menu.show(),this.shown=!0,this},hide:function(){return this.$menu.hide(),this.shown=!1,this},lookup:function(t){var n;return this.query=this.$element.val(),!this.query||this.query.length<this.options.minLength?this.shown?this.hide():this:(n=e.isFunction(this.source)?this.source(this.query,e.proxy(this.process,this)):this.source,n?this.process(n):this)},process:function(t){var n=this;return t=e.grep(t,function(e){return n.matcher(e)}),t=this.sorter(t),t.length?this.render(t.slice(0,this.options.items)).show():this.shown?this.hide():this},matcher:function(e){return~e.toLowerCase().indexOf(this.query.toLowerCase())},sorter:function(e){var t=[],n=[],r=[],i;while(i=e.shift())i.toLowerCase().indexOf(this.query.toLowerCase())?~i.indexOf(this.query)?n.push(i):r.push(i):t.push(i);return t.concat(n,r)},highlighter:function(e){var t=this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&");return e.replace(new RegExp("("+t+")","ig"),function(e,t){return"<strong>"+t+"</strong>"})},render:function(t){var n=this;return t=e(t).map(function(t,r){return t=e(n.options.item).attr("data-value",r),t.find("a").html(n.highlighter(r)),t[0]}),t.first().addClass("active"),this.$menu.html(t),this},next:function(t){var n=this.$menu.find(".active").removeClass("active"),r=n.next();r.length||(r=e(this.$menu.find("li")[0])),r.addClass("active")},prev:function(e){var t=this.$menu.find(".active").removeClass("active"),n=t.prev();n.length||(n=this.$menu.find("li").last()),n.addClass("active")},listen:function(){this.$element.on("blur",e.proxy(this.blur,this)).on("keypress",e.proxy(this.keypress,this)).on("keyup",e.proxy(this.keyup,this)),(e.browser.chrome||e.browser.webkit||e.browser.msie)&&this.$element.on("keydown",e.proxy(this.keydown,this)),this.$menu.on("click",e.proxy(this.click,this)).on("mouseenter","li",e.proxy(this.mouseenter,this))},move:function(e){if(!this.shown)return;switch(e.keyCode){case 9:case 13:case 27:e.preventDefault();break;case 38:e.preventDefault(),this.prev();break;case 40:e.preventDefault(),this.next()}e.stopPropagation()},keydown:function(t){this.suppressKeyPressRepeat=!~e.inArray(t.keyCode,[40,38,9,13,27]),this.move(t)},keypress:function(e){if(this.suppressKeyPressRepeat)return;this.move(e)},keyup:function(e){switch(e.keyCode){case 40:case 38:break;case 9:case 13:if(!this.shown)return;this.select();break;case 27:if(!this.shown)return;this.hide();break;default:this.lookup()}e.stopPropagation(),e.preventDefault()},blur:function(e){var t=this;setTimeout(function(){t.hide()},150)},click:function(e){e.stopPropagation(),e.preventDefault(),this.select()},mouseenter:function(t){this.$menu.find(".active").removeClass("active"),e(t.currentTarget).addClass("active")}},e.fn.typeahead=function(n){return this.each(function(){var r=e(this),i=r.data("typeahead"),s=typeof n=="object"&&n;i||r.data("typeahead",i=new t(this,s)),typeof n=="string"&&i[n]()})},e.fn.typeahead.defaults={source:[],items:8,menu:'<ul class="typeahead dropdown-menu"></ul>',item:'<li><a href="#"></a></li>',minLength:1},e.fn.typeahead.Constructor=t,e(function(){e("body").on("focus.typeahead.data-api",'[data-provide="typeahead"]',function(t){var n=e(this);if(n.data("typeahead"))return;t.preventDefault(),n.typeahead(n.data())})})}(window.jQuery),!function(e){"use strict";var t=function(t,n){this.options=e.extend({},e.fn.affix.defaults,n),this.$window=e(window).on("scroll.affix.data-api",e.proxy(this.checkPosition,this)),this.$element=e(t),this.checkPosition()};t.prototype.checkPosition=function(){if(!this.$element.is(":visible"))return;var t=e(document).height(),n=this.$window.scrollTop(),r=this.$element.offset(),i=this.options.offset,s=i.bottom,o=i.top,u="affix affix-top affix-bottom",a;typeof i!="object"&&(s=o=i),typeof o=="function"&&(o=i.top()),typeof s=="function"&&(s=i.bottom()),a=this.unpin!=null&&n+this.unpin<=r.top?!1:s!=null&&r.top+this.$element.height()>=t-s?"bottom":o!=null&&n<=o?"top":!1;if(this.affixed===a)return;this.affixed=a,this.unpin=a=="bottom"?r.top-n:null,this.$element.removeClass(u).addClass("affix"+(a?"-"+a:""))},e.fn.affix=function(n){return this.each(function(){var r=e(this),i=r.data("affix"),s=typeof n=="object"&&n;i||r.data("affix",i=new t(this,s)),typeof n=="string"&&i[n]()})},e.fn.affix.Constructor=t,e.fn.affix.defaults={offset:0},e(window).on("load",function(){e('[data-spy="affix"]').each(function(){var t=e(this),n=t.data();n.offset=n.offset||{},n.offsetBottom&&(n.offset.bottom=n.offsetBottom),n.offsetTop&&(n.offset.top=n.offsetTop),t.affix(n)})})}(window.jQuery);


/*! jQuery MouseWheel
 * Copyright (c) 2013 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 * Version: 3.1.3
 * Requires: 1.2.2+
 **/
(function(a){if(typeof define==="function"&&define.amd){define(["jquery"],a)}else{if(typeof exports==="object"){module.exports=a}else{a(jQuery)}}}(function(e){var d=["wheel","mousewheel","DOMMouseScroll","MozMousePixelScroll"];var g="onwheel" in document||document.documentMode>=9?["wheel"]:["mousewheel","DomMouseScroll","MozMousePixelScroll"];var f,a;if(e.event.fixHooks){for(var b=d.length;b;){e.event.fixHooks[d[--b]]=e.event.mouseHooks}}e.event.special.mousewheel={setup:function(){if(this.addEventListener){for(var h=g.length;h;){this.addEventListener(g[--h],c,false)}}else{this.onmousewheel=c}},teardown:function(){if(this.removeEventListener){for(var h=g.length;h;){this.removeEventListener(g[--h],c,false)}}else{this.onmousewheel=null}}};e.fn.extend({mousewheel:function(h){return h?this.bind("mousewheel",h):this.trigger("mousewheel")},unmousewheel:function(h){return this.unbind("mousewheel",h)}});function c(h){var i=h||window.event,n=[].slice.call(arguments,1),p=0,k=0,j=0,m=0,l=0,o;h=e.event.fix(i);h.type="mousewheel";if(i.wheelDelta){p=i.wheelDelta}if(i.detail){p=i.detail*-1}if(i.deltaY){j=i.deltaY*-1;p=j}if(i.deltaX){k=i.deltaX;p=k*-1}if(i.wheelDeltaY!==undefined){j=i.wheelDeltaY}if(i.wheelDeltaX!==undefined){k=i.wheelDeltaX*-1}m=Math.abs(p);if(!f||m<f){f=m}l=Math.max(Math.abs(j),Math.abs(k));if(!a||l<a){a=l}o=p>0?"floor":"ceil";p=Math[o](p/f);k=Math[o](k/a);j=Math[o](j/a);n.unshift(h,p,k,j);return(e.event.dispatch||e.event.handle).apply(this,n)}}));


/*! Select2 Copyright 2012 Igor Vaynberg
 * http://ivaynberg.github.io/select2/select2-latest.html
 * Version: 3.3.2 Timestamp: Mon Mar 25 12:14:18 PDT 2013
 * http://www.apache.org/licenses/LICENSE-2.0
 * http://www.gnu.org/licenses/gpl-2.0.html
 **/
(function(a){a.fn.each2===void 0&&a.fn.extend({each2:function(b){for(var c=a([0]),d=-1,e=this.length;e>++d&&(c.context=c[0]=this[d])&&b.call(c[0],d,c)!==!1;);return this}})})(jQuery),function(a,b){"use strict";function k(a,b){for(var c=0,d=b.length;d>c;c+=1)if(l(a,b[c]))return c;return-1}function l(a,c){return a===c?!0:a===b||c===b?!1:null===a||null===c?!1:a.constructor===String?a+""==c+"":c.constructor===String?c+""==a+"":!1}function m(b,c){var d,e,f;if(null===b||1>b.length)return[];for(d=b.split(c),e=0,f=d.length;f>e;e+=1)d[e]=a.trim(d[e]);return d}function n(a){return a.outerWidth(!1)-a.width()}function o(c){var d="keyup-change-value";c.bind("keydown",function(){a.data(c,d)===b&&a.data(c,d,c.val())}),c.bind("keyup",function(){var e=a.data(c,d);e!==b&&c.val()!==e&&(a.removeData(c,d),c.trigger("keyup-change"))})}function p(c){c.bind("mousemove",function(c){var d=i;(d===b||d.x!==c.pageX||d.y!==c.pageY)&&a(c.target).trigger("mousemove-filtered",c)})}function q(a,c,d){d=d||b;var e;return function(){var b=arguments;window.clearTimeout(e),e=window.setTimeout(function(){c.apply(d,b)},a)}}function r(a){var c,b=!1;return function(){return b===!1&&(c=a(),b=!0),c}}function s(a,b){var c=q(a,function(a){b.trigger("scroll-debounced",a)});b.bind("scroll",function(a){k(a.target,b.get())>=0&&c(a)})}function t(a){a[0]!==document.activeElement&&window.setTimeout(function(){var d,b=a[0],c=a.val().length;a.focus(),a.is(":visible")&&b===document.activeElement&&(b.setSelectionRange?b.setSelectionRange(c,c):b.createTextRange&&(d=b.createTextRange(),d.collapse(!1),d.select()))},0)}function u(a){a.preventDefault(),a.stopPropagation()}function v(a){a.preventDefault(),a.stopImmediatePropagation()}function w(b){if(!h){var c=b[0].currentStyle||window.getComputedStyle(b[0],null);h=a(document.createElement("div")).css({position:"absolute",left:"-10000px",top:"-10000px",display:"none",fontSize:c.fontSize,fontFamily:c.fontFamily,fontStyle:c.fontStyle,fontWeight:c.fontWeight,letterSpacing:c.letterSpacing,textTransform:c.textTransform,whiteSpace:"nowrap"}),h.attr("class","select2-sizer"),a("body").append(h)}return h.text(b.val()),h.width()}function x(b,c,d){var e,g,f=[];e=b.attr("class"),e&&(e=""+e,a(e.split(" ")).each2(function(){0===this.indexOf("select2-")&&f.push(this)})),e=c.attr("class"),e&&(e=""+e,a(e.split(" ")).each2(function(){0!==this.indexOf("select2-")&&(g=d(this),g&&f.push(this))})),b.attr("class",f.join(" "))}function y(a,c,d,e){var f=a.toUpperCase().indexOf(c.toUpperCase()),g=c.length;return 0>f?(d.push(e(a)),b):(d.push(e(a.substring(0,f))),d.push("<span class='select2-match'>"),d.push(e(a.substring(f,f+g))),d.push("</span>"),d.push(e(a.substring(f+g,a.length))),b)}function z(b){var c,d=0,e=null,f=b.quietMillis||100,g=b.url,h=this;return function(i){window.clearTimeout(c),c=window.setTimeout(function(){d+=1;var c=d,f=b.data,j=g,k=b.transport||a.ajax,l=b.type||"GET",m={};f=f?f.call(h,i.term,i.page,i.context):null,j="function"==typeof j?j.call(h,i.term,i.page,i.context):j,null!==e&&e.abort(),b.params&&(a.isFunction(b.params)?a.extend(m,b.params.call(h)):a.extend(m,b.params)),a.extend(m,{url:j,dataType:b.dataType,data:f,type:l,cache:!1,success:function(a){if(!(d>c)){var e=b.results(a,i.page);i.callback(e)}}}),e=k.call(h,m)},f)}}function A(c){var e,f,d=c,g=function(a){return""+a.text};a.isArray(d)&&(f=d,d={results:f}),a.isFunction(d)===!1&&(f=d,d=function(){return f});var h=d();return h.text&&(g=h.text,a.isFunction(g)||(e=d.text,g=function(a){return a[e]})),function(c){var h,e=c.term,f={results:[]};return""===e?(c.callback(d()),b):(h=function(b,d){var f,i;if(b=b[0],b.children){f={};for(i in b)b.hasOwnProperty(i)&&(f[i]=b[i]);f.children=[],a(b.children).each2(function(a,b){h(b,f.children)}),(f.children.length||c.matcher(e,g(f),b))&&d.push(f)}else c.matcher(e,g(b),b)&&d.push(b)},a(d().results).each2(function(a,b){h(b,f.results)}),c.callback(f),b)}}function B(c){var d=a.isFunction(c);return function(e){var f=e.term,g={results:[]};a(d?c():c).each(function(){var a=this.text!==b,c=a?this.text:this;(""===f||e.matcher(f,c))&&g.results.push(a?this:{id:this,text:this})}),e.callback(g)}}function C(b){if(a.isFunction(b))return!0;if(!b)return!1;throw Error("formatterName must be a function or a falsy value")}function D(b){return a.isFunction(b)?b():b}function E(b){var c=0;return a.each(b,function(a,b){b.children?c+=E(b.children):c++}),c}function F(a,c,d,e){var h,i,j,k,m,f=a,g=!1;if(!e.createSearchChoice||!e.tokenSeparators||1>e.tokenSeparators.length)return b;for(;;){for(i=-1,j=0,k=e.tokenSeparators.length;k>j&&(m=e.tokenSeparators[j],i=a.indexOf(m),!(i>=0));j++);if(0>i)break;if(h=a.substring(0,i),a=a.substring(i+m.length),h.length>0&&(h=e.createSearchChoice(h,c),h!==b&&null!==h&&e.id(h)!==b&&null!==e.id(h))){for(g=!1,j=0,k=c.length;k>j;j++)if(l(e.id(h),e.id(c[j]))){g=!0;break}g||d(h)}}return f!==a?a:b}function G(b,c){var d=function(){};return d.prototype=new b,d.prototype.constructor=d,d.prototype.parent=b.prototype,d.prototype=a.extend(d.prototype,c),d}if(window.Select2===b){var c,d,e,f,g,h,i,j;c={TAB:9,ENTER:13,ESC:27,SPACE:32,LEFT:37,UP:38,RIGHT:39,DOWN:40,SHIFT:16,CTRL:17,ALT:18,PAGE_UP:33,PAGE_DOWN:34,HOME:36,END:35,BACKSPACE:8,DELETE:46,isArrow:function(a){switch(a=a.which?a.which:a){case c.LEFT:case c.RIGHT:case c.UP:case c.DOWN:return!0}return!1},isControl:function(a){var b=a.which;switch(b){case c.SHIFT:case c.CTRL:case c.ALT:return!0}return a.metaKey?!0:!1},isFunctionKey:function(a){return a=a.which?a.which:a,a>=112&&123>=a}},j=a(document),g=function(){var a=1;return function(){return a++}}(),j.bind("mousemove",function(a){i={x:a.pageX,y:a.pageY}}),d=G(Object,{bind:function(a){var b=this;return function(){a.apply(b,arguments)}},init:function(c){var d,e,f=".select2-results";this.opts=c=this.prepareOpts(c),this.id=c.id,c.element.data("select2")!==b&&null!==c.element.data("select2")&&this.destroy(),this.enabled=!0,this.container=this.createContainer(),this.containerId="s2id_"+(c.element.attr("id")||"autogen"+g()),this.containerSelector="#"+this.containerId.replace(/([;&,\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g,"\\$1"),this.container.attr("id",this.containerId),this.body=r(function(){return c.element.closest("body")}),x(this.container,this.opts.element,this.opts.adaptContainerCssClass),this.container.css(D(c.containerCss)),this.container.addClass(D(c.containerCssClass)),this.elementTabIndex=this.opts.element.attr("tabIndex"),this.opts.element.data("select2",this).addClass("select2-offscreen").bind("focus.select2",function(){a(this).select2("focus")}).attr("tabIndex","-1").before(this.container),this.container.data("select2",this),this.dropdown=this.container.find(".select2-drop"),this.dropdown.addClass(D(c.dropdownCssClass)),this.dropdown.data("select2",this),this.results=d=this.container.find(f),this.search=e=this.container.find("input.select2-input"),e.attr("tabIndex",this.elementTabIndex),this.resultsPage=0,this.context=null,this.initContainer(),p(this.results),this.dropdown.delegate(f,"mousemove-filtered touchstart touchmove touchend",this.bind(this.highlightUnderEvent)),s(80,this.results),this.dropdown.delegate(f,"scroll-debounced",this.bind(this.loadMoreIfNeeded)),a.fn.mousewheel&&d.mousewheel(function(a,b,c,e){var f=d.scrollTop();e>0&&0>=f-e?(d.scrollTop(0),u(a)):0>e&&d.get(0).scrollHeight-d.scrollTop()+e<=d.height()&&(d.scrollTop(d.get(0).scrollHeight-d.height()),u(a))}),o(e),e.bind("keyup-change input paste",this.bind(this.updateResults)),e.bind("focus",function(){e.addClass("select2-focused")}),e.bind("blur",function(){e.removeClass("select2-focused")}),this.dropdown.delegate(f,"mouseup",this.bind(function(b){a(b.target).closest(".select2-result-selectable").length>0&&(this.highlightUnderEvent(b),this.selectHighlighted(b))})),this.dropdown.bind("click mouseup mousedown",function(a){a.stopPropagation()}),a.isFunction(this.opts.initSelection)&&(this.initSelection(),this.monitorSource()),(c.element.is(":disabled")||c.element.is("[readonly='readonly']"))&&this.disable()},destroy:function(){var a=this.opts.element.data("select2");this.propertyObserver&&(delete this.propertyObserver,this.propertyObserver=null),a!==b&&(a.container.remove(),a.dropdown.remove(),a.opts.element.removeClass("select2-offscreen").removeData("select2").unbind(".select2").attr({tabIndex:this.elementTabIndex}).show())},prepareOpts:function(c){var d,e,f,g;if(d=c.element,"select"===d.get(0).tagName.toLowerCase()&&(this.select=e=c.element),e&&a.each(["id","multiple","ajax","query","createSearchChoice","initSelection","data","tags"],function(){if(this in c)throw Error("Option '"+this+"' is not allowed for Select2 when attached to a <select> element.")}),c=a.extend({},{populateResults:function(d,e,f){var g,k=this.opts.id,l=this;g=function(d,e,h){var i,j,m,n,o,p,q,r,s,t;for(d=c.sortResults(d,e,f),i=0,j=d.length;j>i;i+=1)m=d[i],o=m.disabled===!0,n=!o&&k(m)!==b,p=m.children&&m.children.length>0,q=a("<li></li>"),q.addClass("select2-results-dept-"+h),q.addClass("select2-result"),q.addClass(n?"select2-result-selectable":"select2-result-unselectable"),o&&q.addClass("select2-disabled"),p&&q.addClass("select2-result-with-children"),q.addClass(l.opts.formatResultCssClass(m)),r=a(document.createElement("div")),r.addClass("select2-result-label"),t=c.formatResult(m,r,f,l.opts.escapeMarkup),t!==b&&r.html(t),q.append(r),p&&(s=a("<ul></ul>"),s.addClass("select2-result-sub"),g(m.children,s,h+1),q.append(s)),q.data("select2-data",m),e.append(q)},g(e,d,0)}},a.fn.select2.defaults,c),"function"!=typeof c.id&&(f=c.id,c.id=function(a){return a[f]}),a.isArray(c.element.data("select2Tags"))){if("tags"in c)throw"tags specified as both an attribute 'data-select2-tags' and in options of Select2 "+c.element.attr("id");c.tags=c.element.data("select2Tags")}if(e?(c.query=this.bind(function(c){var g,h,i,e={results:[],more:!1},f=c.term;i=function(a,b){var d;a.is("option")?c.matcher(f,a.text(),a)&&b.push({id:a.attr("value"),text:a.text(),element:a.get(),css:a.attr("class"),disabled:l(a.attr("disabled"),"disabled")}):a.is("optgroup")&&(d={text:a.attr("label"),children:[],element:a.get(),css:a.attr("class")},a.children().each2(function(a,b){i(b,d.children)}),d.children.length>0&&b.push(d))},g=d.children(),this.getPlaceholder()!==b&&g.length>0&&(h=g[0],""===a(h).text()&&(g=g.not(h))),g.each2(function(a,b){i(b,e.results)}),c.callback(e)}),c.id=function(a){return a.id},c.formatResultCssClass=function(a){return a.css}):"query"in c||("ajax"in c?(g=c.element.data("ajax-url"),g&&g.length>0&&(c.ajax.url=g),c.query=z.call(c.element,c.ajax)):"data"in c?c.query=A(c.data):"tags"in c&&(c.query=B(c.tags),c.createSearchChoice===b&&(c.createSearchChoice=function(a){return{id:a,text:a}}),c.initSelection===b&&(c.initSelection=function(d,e){var f=[];a(m(d.val(),c.separator)).each(function(){var d=this,e=this,g=c.tags;a.isFunction(g)&&(g=g()),a(g).each(function(){return l(this.id,d)?(e=this.text,!1):b}),f.push({id:d,text:e})}),e(f)}))),"function"!=typeof c.query)throw"query function not defined for Select2 "+c.element.attr("id");return c},monitorSource:function(){var b,a=this.opts.element;a.bind("change.select2",this.bind(function(){this.opts.element.data("select2-change-triggered")!==!0&&this.initSelection()})),b=this.bind(function(){var a,b;a="disabled"!==this.opts.element.attr("disabled"),b="readonly"===this.opts.element.attr("readonly"),a=a&&!b,this.enabled!==a&&(a?this.enable():this.disable()),x(this.container,this.opts.element,this.opts.adaptContainerCssClass),this.container.addClass(D(this.opts.containerCssClass)),x(this.dropdown,this.opts.element,this.opts.adaptDropdownCssClass),this.dropdown.addClass(D(this.opts.dropdownCssClass))}),a.bind("propertychange.select2 DOMAttrModified.select2",b),"undefined"!=typeof WebKitMutationObserver&&(this.propertyObserver&&(delete this.propertyObserver,this.propertyObserver=null),this.propertyObserver=new WebKitMutationObserver(function(a){a.forEach(b)}),this.propertyObserver.observe(a.get(0),{attributes:!0,subtree:!1}))},triggerChange:function(b){b=b||{},b=a.extend({},b,{type:"change",val:this.val()}),this.opts.element.data("select2-change-triggered",!0),this.opts.element.trigger(b),this.opts.element.data("select2-change-triggered",!1),this.opts.element.click(),this.opts.blurOnChange&&this.opts.element.blur()},enable:function(){this.enabled||(this.enabled=!0,this.container.removeClass("select2-container-disabled"),this.opts.element.removeAttr("disabled"))},disable:function(){this.enabled&&(this.close(),this.enabled=!1,this.container.addClass("select2-container-disabled"),this.opts.element.attr("disabled","disabled"))},opened:function(){return this.container.hasClass("select2-dropdown-open")},positionDropdown:function(){var o,p,q,b=this.container.offset(),c=this.container.outerHeight(!1),d=this.container.outerWidth(!1),e=this.dropdown.outerHeight(!1),f=a(window).scrollLeft()+a(window).width(),g=a(window).scrollTop()+a(window).height(),h=b.top+c,i=b.left,j=g>=h+e,k=b.top-e>=this.body().scrollTop(),l=this.dropdown.outerWidth(!1),m=f>=i+l,n=this.dropdown.hasClass("select2-drop-above");"static"!==this.body().css("position")&&(o=this.body().offset(),h-=o.top,i-=o.left),n?(p=!0,!k&&j&&(p=!1)):(p=!1,!j&&k&&(p=!0)),m||(i=b.left+d-l),p?(h=b.top-e,this.container.addClass("select2-drop-above"),this.dropdown.addClass("select2-drop-above")):(this.container.removeClass("select2-drop-above"),this.dropdown.removeClass("select2-drop-above")),q=a.extend({top:h,left:i,width:d},D(this.opts.dropdownCss)),this.dropdown.css(q)},shouldOpen:function(){var b;return this.opened()?!1:(b=a.Event("opening"),this.opts.element.trigger(b),!b.isDefaultPrevented())},clearDropdownAlignmentPreference:function(){this.container.removeClass("select2-drop-above"),this.dropdown.removeClass("select2-drop-above")},open:function(){return this.shouldOpen()?(window.setTimeout(this.bind(this.opening),1),!0):!1},opening:function(){function h(){return{width:Math.max(document.documentElement.scrollWidth,a(window).width()),height:Math.max(document.documentElement.scrollHeight,a(window).height())}}var f,b=this.containerId,c="scroll."+b,d="resize."+b,e="orientationchange."+b;this.clearDropdownAlignmentPreference(),this.container.addClass("select2-dropdown-open").addClass("select2-container-active"),this.dropdown[0]!==this.body().children().last()[0]&&this.dropdown.detach().appendTo(this.body()),this.updateResults(!0),f=a("#select2-drop-mask"),0==f.length&&(f=a(document.createElement("div")),f.attr("id","select2-drop-mask").attr("class","select2-drop-mask"),f.hide(),f.appendTo(this.body()),f.bind("mousedown touchstart",function(){var d,c=a("#select2-drop");c.length>0&&(d=c.data("select2"),d.opts.selectOnBlur&&d.selectHighlighted({noFocus:!0}),d.close())})),this.dropdown.prev()[0]!==f[0]&&this.dropdown.before(f),a("#select2-drop").removeAttr("id"),this.dropdown.attr("id","select2-drop"),f.css(h()),f.show(),this.dropdown.show(),this.positionDropdown(),this.dropdown.addClass("select2-drop-active"),this.ensureHighlightVisible();var g=this;this.container.parents().add(window).each(function(){a(this).bind(d+" "+c+" "+e,function(){a("#select2-drop-mask").css(h()),g.positionDropdown()})}),this.focusSearch()},close:function(){if(this.opened()){var b=this.containerId,c="scroll."+b,d="resize."+b,e="orientationchange."+b;this.container.parents().add(window).each(function(){a(this).unbind(c).unbind(d).unbind(e)}),this.clearDropdownAlignmentPreference(),a("#select2-drop-mask").hide(),this.dropdown.removeAttr("id"),this.dropdown.hide(),this.container.removeClass("select2-dropdown-open"),this.results.empty(),this.clearSearch(),this.search.removeClass("select2-active"),this.opts.element.trigger(a.Event("close"))}},clearSearch:function(){},getMaximumSelectionSize:function(){return D(this.opts.maximumSelectionSize)},ensureHighlightVisible:function(){var d,e,f,g,h,i,j,c=this.results;if(e=this.highlight(),!(0>e)){if(0==e)return c.scrollTop(0),b;d=this.findHighlightableChoices(),f=a(d[e]),g=f.offset().top+f.outerHeight(!0),e===d.length-1&&(j=c.find("li.select2-more-results"),j.length>0&&(g=j.offset().top+j.outerHeight(!0))),h=c.offset().top+c.outerHeight(!0),g>h&&c.scrollTop(c.scrollTop()+(g-h)),i=f.offset().top-c.offset().top,0>i&&"none"!=f.css("display")&&c.scrollTop(c.scrollTop()+i)}},findHighlightableChoices:function(){return this.results.find(".select2-result-selectable:not(.select2-selected):not(.select2-disabled)"),this.results.find(".select2-result-selectable:not(.select2-selected):not(.select2-disabled)")},moveHighlight:function(b){for(var c=this.findHighlightableChoices(),d=this.highlight();d>-1&&c.length>d;){d+=b;var e=a(c[d]);if(e.hasClass("select2-result-selectable")&&!e.hasClass("select2-disabled")&&!e.hasClass("select2-selected")){this.highlight(d);break}}},highlight:function(c){var e,f,d=this.findHighlightableChoices();return 0===arguments.length?k(d.filter(".select2-highlighted")[0],d.get()):(c>=d.length&&(c=d.length-1),0>c&&(c=0),this.results.find(".select2-highlighted").removeClass("select2-highlighted"),e=a(d[c]),e.addClass("select2-highlighted"),this.ensureHighlightVisible(),f=e.data("select2-data"),f&&this.opts.element.trigger({type:"highlight",val:this.id(f),choice:f}),b)},countSelectableResults:function(){return this.findHighlightableChoices().length},highlightUnderEvent:function(b){var c=a(b.target).closest(".select2-result-selectable");if(c.length>0&&!c.is(".select2-highlighted")){var d=this.findHighlightableChoices();this.highlight(d.index(c))}else 0==c.length&&this.results.find(".select2-highlighted").removeClass("select2-highlighted")},loadMoreIfNeeded:function(){var c,a=this.results,b=a.find("li.select2-more-results"),e=this.resultsPage+1,f=this,g=this.search.val(),h=this.context;0!==b.length&&(c=b.offset().top-a.offset().top-a.height(),this.opts.loadMorePadding>=c&&(b.addClass("select2-active"),this.opts.query({element:this.opts.element,term:g,page:e,context:h,matcher:this.opts.matcher,callback:this.bind(function(c){f.opened()&&(f.opts.populateResults.call(this,a,c.results,{term:g,page:e,context:h}),f.postprocessResults(c,!1,!1),c.more===!0?(b.detach().appendTo(a).text(f.opts.formatLoadMore(e+1)),window.setTimeout(function(){f.loadMoreIfNeeded()},10)):b.remove(),f.positionDropdown(),f.resultsPage=e,f.context=c.context)})})))},tokenize:function(){},updateResults:function(c){function m(){e.scrollTop(0),d.removeClass("select2-active"),h.positionDropdown()}function n(a){e.html(a),m()}var g,i,d=this.search,e=this.results,f=this.opts,h=this,j=d.val(),k=a.data(this.container,"select2-last-term");if((c===!0||!k||!l(j,k))&&(a.data(this.container,"select2-last-term",j),c===!0||this.showSearchInput!==!1&&this.opened())){var o=this.getMaximumSelectionSize();if(o>=1&&(g=this.data(),a.isArray(g)&&g.length>=o&&C(f.formatSelectionTooBig,"formatSelectionTooBig")))return n("<li class='select2-selection-limit'>"+f.formatSelectionTooBig(o)+"</li>"),b;if(d.val().length<f.minimumInputLength)return C(f.formatInputTooShort,"formatInputTooShort")?n("<li class='select2-no-results'>"+f.formatInputTooShort(d.val(),f.minimumInputLength)+"</li>"):n(""),b;if(f.maximumInputLength&&d.val().length>f.maximumInputLength)return C(f.formatInputTooLong,"formatInputTooLong")?n("<li class='select2-no-results'>"+f.formatInputTooLong(d.val(),f.maximumInputLength)+"</li>"):n(""),b;f.formatSearching&&0===this.findHighlightableChoices().length&&n("<li class='select2-searching'>"+f.formatSearching()+"</li>"),d.addClass("select2-active"),i=this.tokenize(),i!=b&&null!=i&&d.val(i),this.resultsPage=1,f.query({element:f.element,term:d.val(),page:this.resultsPage,context:null,matcher:f.matcher,callback:this.bind(function(g){var i;return this.opened()?(this.context=g.context===b?null:g.context,this.opts.createSearchChoice&&""!==d.val()&&(i=this.opts.createSearchChoice.call(null,d.val(),g.results),i!==b&&null!==i&&h.id(i)!==b&&null!==h.id(i)&&0===a(g.results).filter(function(){return l(h.id(this),h.id(i))}).length&&g.results.unshift(i)),0===g.results.length&&C(f.formatNoMatches,"formatNoMatches")?(n("<li class='select2-no-results'>"+f.formatNoMatches(d.val())+"</li>"),b):(e.empty(),h.opts.populateResults.call(this,e,g.results,{term:d.val(),page:this.resultsPage,context:null}),g.more===!0&&C(f.formatLoadMore,"formatLoadMore")&&(e.append("<li class='select2-more-results'>"+h.opts.escapeMarkup(f.formatLoadMore(this.resultsPage))+"</li>"),window.setTimeout(function(){h.loadMoreIfNeeded()},10)),this.postprocessResults(g,c),m(),this.opts.element.trigger({type:"loaded",data:g}),b)):(this.search.removeClass("select2-active"),b)})})}},cancel:function(){this.close()},blur:function(){this.opts.selectOnBlur&&this.selectHighlighted({noFocus:!0}),this.close(),this.container.removeClass("select2-container-active"),this.search[0]===document.activeElement&&this.search.blur(),this.clearSearch(),this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus")},focusSearch:function(){t(this.search)},selectHighlighted:function(a){var b=this.highlight(),c=this.results.find(".select2-highlighted"),d=c.closest(".select2-result").data("select2-data");d&&(this.highlight(b),this.onSelect(d,a))},getPlaceholder:function(){return this.opts.element.attr("placeholder")||this.opts.element.attr("data-placeholder")||this.opts.element.data("placeholder")||this.opts.placeholder},initContainerWidth:function(){function c(){var c,d,e,f,g;if("off"===this.opts.width)return null;if("element"===this.opts.width)return 0===this.opts.element.outerWidth(!1)?"auto":this.opts.element.outerWidth(!1)+"px";if("copy"===this.opts.width||"resolve"===this.opts.width){if(c=this.opts.element.attr("style"),c!==b)for(d=c.split(";"),f=0,g=d.length;g>f;f+=1)if(e=d[f].replace(/\s/g,"").match(/width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/),null!==e&&e.length>=1)return e[1];return"resolve"===this.opts.width?(c=this.opts.element.css("width"),c.indexOf("%")>0?c:0===this.opts.element.outerWidth(!1)?"auto":this.opts.element.outerWidth(!1)+"px"):null}return a.isFunction(this.opts.width)?this.opts.width():this.opts.width}var d=c.call(this);null!==d&&this.container.css("width",d)}}),e=G(d,{createContainer:function(){var b=a(document.createElement("div")).attr({"class":"select2-container"}).html(["<a href='javascript:void(0)' onclick='return false;' class='select2-choice' tabindex='-1'>","   <span></span><abbr class='select2-search-choice-close' style='display:none;'></abbr>","   <div><b></b></div>","</a>","<input class='select2-focusser select2-offscreen' type='text'/>","<div class='select2-drop' style='display:none'>","   <div class='select2-search'>","       <input type='text' autocomplete='off' class='select2-input'/>","   </div>","   <ul class='select2-results'>","   </ul>","</div>"].join(""));return b},disable:function(){this.enabled&&(this.parent.disable.apply(this,arguments),this.focusser.attr("disabled","disabled"))},enable:function(){this.enabled||(this.parent.enable.apply(this,arguments),this.focusser.removeAttr("disabled"))},opening:function(){this.parent.opening.apply(this,arguments),this.focusser.attr("disabled","disabled"),this.opts.element.trigger(a.Event("open"))},close:function(){this.opened()&&(this.parent.close.apply(this,arguments),this.focusser.removeAttr("disabled"),t(this.focusser))},focus:function(){this.opened()?this.close():(this.focusser.removeAttr("disabled"),this.focusser.focus())},isFocused:function(){return this.container.hasClass("select2-container-active")},cancel:function(){this.parent.cancel.apply(this,arguments),this.focusser.removeAttr("disabled"),this.focusser.focus()},initContainer:function(){var d,e=this.container,f=this.dropdown,h=!1;this.showSearch(this.opts.minimumResultsForSearch>=0),this.selection=d=e.find(".select2-choice"),this.focusser=e.find(".select2-focusser"),this.focusser.attr("id","s2id_autogen"+g()),a("label[for='"+this.opts.element.attr("id")+"']").attr("for",this.focusser.attr("id")),this.search.bind("keydown",this.bind(function(a){if(this.enabled){if(a.which===c.PAGE_UP||a.which===c.PAGE_DOWN)return u(a),b;switch(a.which){case c.UP:case c.DOWN:return this.moveHighlight(a.which===c.UP?-1:1),u(a),b;case c.TAB:case c.ENTER:return this.selectHighlighted(),u(a),b;case c.ESC:return this.cancel(a),u(a),b}}})),this.search.bind("blur",this.bind(function(){document.activeElement===this.body().get(0)&&window.setTimeout(this.bind(function(){this.search.focus()}),0)})),this.focusser.bind("keydown",this.bind(function(a){return!this.enabled||a.which===c.TAB||c.isControl(a)||c.isFunctionKey(a)||a.which===c.ESC?b:this.opts.openOnEnter===!1&&a.which===c.ENTER?(u(a),b):a.which==c.DOWN||a.which==c.UP||a.which==c.ENTER&&this.opts.openOnEnter?(this.open(),u(a),b):a.which==c.DELETE||a.which==c.BACKSPACE?(this.opts.allowClear&&this.clear(),u(a),b):b})),o(this.focusser),this.focusser.bind("keyup-change input",this.bind(function(a){this.opened()||(this.open(),this.showSearchInput!==!1&&this.search.val(this.focusser.val()),this.focusser.val(""),u(a))})),d.delegate("abbr","mousedown",this.bind(function(a){this.enabled&&(this.clear(),v(a),this.close(),this.selection.focus())})),d.bind("mousedown",this.bind(function(a){h=!0,this.opened()?this.close():this.enabled&&this.open(),u(a),h=!1})),f.bind("mousedown",this.bind(function(){this.search.focus()})),d.bind("focus",this.bind(function(a){u(a)})),this.focusser.bind("focus",this.bind(function(){this.container.addClass("select2-container-active")})).bind("blur",this.bind(function(){this.opened()||this.container.removeClass("select2-container-active")})),this.search.bind("focus",this.bind(function(){this.container.addClass("select2-container-active")})),this.initContainerWidth(),this.setPlaceholder()},clear:function(a){var b=this.selection.data("select2-data");b&&(this.opts.element.val(""),this.selection.find("span").empty(),this.selection.removeData("select2-data"),this.setPlaceholder(),a!==!1&&(this.opts.element.trigger({type:"removed",val:this.id(b),choice:b}),this.triggerChange({removed:b})))},initSelection:function(){if(""===this.opts.element.val()&&""===this.opts.element.text())this.close(),this.setPlaceholder();else{var c=this;this.opts.initSelection.call(null,this.opts.element,function(a){a!==b&&null!==a&&(c.updateSelection(a),c.close(),c.setPlaceholder())})}},prepareOpts:function(){var b=this.parent.prepareOpts.apply(this,arguments);return"select"===b.element.get(0).tagName.toLowerCase()?b.initSelection=function(b,c){var d=b.find(":selected");a.isFunction(c)&&c({id:d.attr("value"),text:d.text(),element:d})}:"data"in b&&(b.initSelection=b.initSelection||function(c,d){var e=c.val(),f=null;b.query({matcher:function(a,c,d){var g=l(e,b.id(d));return g&&(f=d),g},callback:a.isFunction(d)?function(){d(f)}:a.noop})}),b},getPlaceholder:function(){return this.select&&""!==this.select.find("option").first().text()?b:this.parent.getPlaceholder.apply(this,arguments)},setPlaceholder:function(){var a=this.getPlaceholder();if(""===this.opts.element.val()&&a!==b){if(this.select&&""!==this.select.find("option:first").text())return;this.selection.find("span").html(this.opts.escapeMarkup(a)),this.selection.addClass("select2-default"),this.selection.find("abbr").hide()}},postprocessResults:function(a,c,d){var e=0,f=this,g=!0;if(this.findHighlightableChoices().each2(function(a,c){return l(f.id(c.data("select2-data")),f.opts.element.val())?(e=a,!1):b}),d!==!1&&this.highlight(e),c===!0){var h=this.opts.minimumResultsForSearch;g=0>h?!1:E(a.results)>=h,this.showSearch(g)}},showSearch:function(b){this.showSearchInput=b,this.dropdown.find(".select2-search")[b?"removeClass":"addClass"]("select2-search-hidden"),a(this.dropdown,this.container)[b?"addClass":"removeClass"]("select2-with-searchbox")},onSelect:function(a,b){var c=this.opts.element.val();this.opts.element.val(this.id(a)),this.updateSelection(a),this.opts.element.trigger({type:"selected",val:this.id(a),choice:a}),this.close(),b&&b.noFocus||this.selection.focus(),l(c,this.id(a))||this.triggerChange()},updateSelection:function(a){var d,c=this.selection.find("span");this.selection.data("select2-data",a),c.empty(),d=this.opts.formatSelection(a,c),d!==b&&c.append(this.opts.escapeMarkup(d)),this.selection.removeClass("select2-default"),this.opts.allowClear&&this.getPlaceholder()!==b&&this.selection.find("abbr").show()},val:function(){var a,c=!1,d=null,e=this;if(0===arguments.length)return this.opts.element.val();if(a=arguments[0],arguments.length>1&&(c=arguments[1]),this.select)this.select.val(a).find(":selected").each2(function(a,b){return d={id:b.attr("value"),text:b.text(),element:b.get(0)},!1}),this.updateSelection(d),this.setPlaceholder(),c&&this.triggerChange();else{if(this.opts.initSelection===b)throw Error("cannot call val() if initSelection() is not defined");if(!a&&0!==a)return this.clear(c),c&&this.triggerChange(),b;this.opts.element.val(a),this.opts.initSelection(this.opts.element,function(a){e.opts.element.val(a?e.id(a):""),e.updateSelection(a),e.setPlaceholder(),c&&e.triggerChange()})}},clearSearch:function(){this.search.val(""),this.focusser.val("")},data:function(a){var c;return 0===arguments.length?(c=this.selection.data("select2-data"),c==b&&(c=null),c):(a&&""!==a?(this.opts.element.val(a?this.id(a):""),this.updateSelection(a)):this.clear(),b)}}),f=G(d,{createContainer:function(){var b=a(document.createElement("div")).attr({"class":"select2-container select2-container-multi"}).html(["    <ul class='select2-choices'>","  <li class='select2-search-field'>","    <input type='text' autocomplete='off' class='select2-input'>","  </li>","</ul>","<div class='select2-drop select2-drop-multi' style='display:none;'>","   <ul class='select2-results'>","   </ul>","</div>"].join(""));return b},prepareOpts:function(){var b=this.parent.prepareOpts.apply(this,arguments);return"select"===b.element.get(0).tagName.toLowerCase()?b.initSelection=function(a,b){var c=[];a.find(":selected").each2(function(a,b){c.push({id:b.attr("value"),text:b.text(),element:b[0]})}),b(c)}:"data"in b&&(b.initSelection=b.initSelection||function(c,d){var e=m(c.val(),b.separator),f=[];b.query({matcher:function(c,d,g){var h=a.grep(e,function(a){return l(a,b.id(g))}).length;return h&&f.push(g),h},callback:a.isFunction(d)?function(){d(f)}:a.noop})}),b},initContainer:function(){var e,d=".select2-choices";this.searchContainer=this.container.find(".select2-search-field"),this.selection=e=this.container.find(d),this.search.attr("id","s2id_autogen"+g()),a("label[for='"+this.opts.element.attr("id")+"']").attr("for",this.search.attr("id")),this.search.bind("input paste",this.bind(function(){this.enabled&&(this.opened()||this.open())})),this.search.bind("keydown",this.bind(function(a){if(this.enabled){if(a.which===c.BACKSPACE&&""===this.search.val()){this.close();var d,f=e.find(".select2-search-choice-focus");if(f.length>0)return this.unselect(f.first()),this.search.width(10),u(a),b;d=e.find(".select2-search-choice:not(.select2-locked)"),d.length>0&&d.last().addClass("select2-search-choice-focus")}else e.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");if(this.opened())switch(a.which){case c.UP:case c.DOWN:return this.moveHighlight(a.which===c.UP?-1:1),u(a),b;case c.ENTER:case c.TAB:return this.selectHighlighted(),u(a),b;case c.ESC:return this.cancel(a),u(a),b}if(a.which!==c.TAB&&!c.isControl(a)&&!c.isFunctionKey(a)&&a.which!==c.BACKSPACE&&a.which!==c.ESC){if(a.which===c.ENTER){if(this.opts.openOnEnter===!1)return;if(a.altKey||a.ctrlKey||a.shiftKey||a.metaKey)return}this.open(),(a.which===c.PAGE_UP||a.which===c.PAGE_DOWN)&&u(a),a.which===c.ENTER&&u(a)}}})),this.search.bind("keyup",this.bind(this.resizeSearch)),this.search.bind("blur",this.bind(function(a){this.container.removeClass("select2-container-active"),this.search.removeClass("select2-focused"),this.opened()||this.clearSearch(),a.stopImmediatePropagation()})),this.container.delegate(d,"mousedown",this.bind(function(b){this.enabled&&(a(b.target).closest(".select2-search-choice").length>0||(this.clearPlaceholder(),this.open(),this.focusSearch(),b.preventDefault()))
})),this.container.delegate(d,"focus",this.bind(function(){this.enabled&&(this.container.addClass("select2-container-active"),this.dropdown.addClass("select2-drop-active"),this.clearPlaceholder())})),this.initContainerWidth(),this.clearSearch()},enable:function(){this.enabled||(this.parent.enable.apply(this,arguments),this.search.removeAttr("disabled"))},disable:function(){this.enabled&&(this.parent.disable.apply(this,arguments),this.search.attr("disabled",!0))},initSelection:function(){if(""===this.opts.element.val()&&""===this.opts.element.text()&&(this.updateSelection([]),this.close(),this.clearSearch()),this.select||""!==this.opts.element.val()){var c=this;this.opts.initSelection.call(null,this.opts.element,function(a){a!==b&&null!==a&&(c.updateSelection(a),c.close(),c.clearSearch())})}},clearSearch:function(){var a=this.getPlaceholder();a!==b&&0===this.getVal().length&&this.search.hasClass("select2-focused")===!1?(this.search.val(a).addClass("select2-default"),this.search.width(this.getMaxSearchWidth())):this.search.val("").width(10)},clearPlaceholder:function(){this.search.hasClass("select2-default")&&this.search.val("").removeClass("select2-default")},opening:function(){this.clearPlaceholder(),this.resizeSearch(),this.parent.opening.apply(this,arguments),this.focusSearch(),this.opts.element.trigger(a.Event("open"))},close:function(){this.opened()&&this.parent.close.apply(this,arguments)},focus:function(){this.close(),this.search.focus()},isFocused:function(){return this.search.hasClass("select2-focused")},updateSelection:function(b){var c=[],d=[],e=this;a(b).each(function(){0>k(e.id(this),c)&&(c.push(e.id(this)),d.push(this))}),b=d,this.selection.find(".select2-search-choice").remove(),a(b).each(function(){e.addSelectedChoice(this)}),e.postprocessResults()},tokenize:function(){var a=this.search.val();a=this.opts.tokenizer(a,this.data(),this.bind(this.onSelect),this.opts),null!=a&&a!=b&&(this.search.val(a),a.length>0&&this.open())},onSelect:function(a,b){this.addSelectedChoice(a),this.opts.element.trigger({type:"selected",val:this.id(a),choice:a}),(this.select||!this.opts.closeOnSelect)&&this.postprocessResults(),this.opts.closeOnSelect?(this.close(),this.search.width(10)):this.countSelectableResults()>0?(this.search.width(10),this.resizeSearch(),this.getMaximumSelectionSize()>0&&this.val().length>=this.getMaximumSelectionSize()&&this.updateResults(!0),this.positionDropdown()):(this.close(),this.search.width(10)),this.triggerChange({added:a}),b&&b.noFocus||this.focusSearch()},cancel:function(){this.close(),this.focusSearch()},addSelectedChoice:function(c){var j,d=!c.locked,e=a("<li class='select2-search-choice'>    <div></div>    <a href='#' onclick='return false;' class='select2-search-choice-close' tabindex='-1'></a></li>"),f=a("<li class='select2-search-choice select2-locked'><div></div></li>"),g=d?e:f,h=this.id(c),i=this.getVal();j=this.opts.formatSelection(c,g.find("div")),j!=b&&g.find("div").replaceWith("<div>"+this.opts.escapeMarkup(j)+"</div>"),d&&g.find(".select2-search-choice-close").bind("mousedown",u).bind("click dblclick",this.bind(function(b){this.enabled&&(a(b.target).closest(".select2-search-choice").fadeOut("fast",this.bind(function(){this.unselect(a(b.target)),this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus"),this.close(),this.focusSearch()})).dequeue(),u(b))})).bind("focus",this.bind(function(){this.enabled&&(this.container.addClass("select2-container-active"),this.dropdown.addClass("select2-drop-active"))})),g.data("select2-data",c),g.insertBefore(this.searchContainer),i.push(h),this.setVal(i)},unselect:function(a){var c,d,b=this.getVal();if(a=a.closest(".select2-search-choice"),0===a.length)throw"Invalid argument: "+a+". Must be .select2-search-choice";c=a.data("select2-data"),c&&(d=k(this.id(c),b),d>=0&&(b.splice(d,1),this.setVal(b),this.select&&this.postprocessResults()),a.remove(),this.opts.element.trigger({type:"removed",val:this.id(c),choice:c}),this.triggerChange({removed:c}))},postprocessResults:function(){var a=this.getVal(),b=this.results.find(".select2-result"),c=this.results.find(".select2-result-with-children"),d=this;b.each2(function(b,c){var e=d.id(c.data("select2-data"));k(e,a)>=0&&(c.addClass("select2-selected"),c.find(".select2-result-selectable").addClass("select2-selected"))}),c.each2(function(a,b){b.is(".select2-result-selectable")||0!==b.find(".select2-result-selectable:not(.select2-selected)").length||b.addClass("select2-selected")}),-1==this.highlight()&&d.highlight(0)},getMaxSearchWidth:function(){return this.selection.width()-n(this.search)},resizeSearch:function(){var a,b,c,d,e,f=n(this.search);a=w(this.search)+10,b=this.search.offset().left,c=this.selection.width(),d=this.selection.offset().left,e=c-(b-d)-f,a>e&&(e=c-f),40>e&&(e=c-f),0>=e&&(e=a),this.search.width(e)},getVal:function(){var a;return this.select?(a=this.select.val(),null===a?[]:a):(a=this.opts.element.val(),m(a,this.opts.separator))},setVal:function(b){var c;this.select?this.select.val(b):(c=[],a(b).each(function(){0>k(this,c)&&c.push(this)}),this.opts.element.val(0===c.length?"":c.join(this.opts.separator)))},val:function(){var c,d=!1,f=this;if(0===arguments.length)return this.getVal();if(c=arguments[0],arguments.length>1&&(d=arguments[1]),!c&&0!==c)return this.opts.element.val(""),this.updateSelection([]),this.clearSearch(),d&&this.triggerChange(),b;if(this.setVal(c),this.select)this.opts.initSelection(this.select,this.bind(this.updateSelection)),d&&this.triggerChange();else{if(this.opts.initSelection===b)throw Error("val() cannot be called if initSelection() is not defined");this.opts.initSelection(this.opts.element,function(b){var c=a(b).map(f.id);f.setVal(c),f.updateSelection(b),f.clearSearch(),d&&f.triggerChange()})}this.clearSearch()},onSortStart:function(){if(this.select)throw Error("Sorting of elements is not supported when attached to <select>. Attach to <input type='hidden'/> instead.");this.search.width(0),this.searchContainer.hide()},onSortEnd:function(){var b=[],c=this;this.searchContainer.show(),this.searchContainer.appendTo(this.searchContainer.parent()),this.resizeSearch(),this.selection.find(".select2-search-choice").each(function(){b.push(c.opts.id(a(this).data("select2-data")))}),this.setVal(b),this.triggerChange()},data:function(c){var e,d=this;return 0===arguments.length?this.selection.find(".select2-search-choice").map(function(){return a(this).data("select2-data")}).get():(c||(c=[]),e=a.map(c,function(a){return d.opts.id(a)}),this.setVal(e),this.updateSelection(c),this.clearSearch(),b)}}),a.fn.select2=function(){var d,g,h,i,c=Array.prototype.slice.call(arguments,0),j=["val","destroy","opened","open","close","focus","isFocused","container","onSortStart","onSortEnd","enable","disable","positionDropdown","data"];return this.each(function(){if(0===c.length||"object"==typeof c[0])d=0===c.length?{}:a.extend({},c[0]),d.element=a(this),"select"===d.element.get(0).tagName.toLowerCase()?i=d.element.attr("multiple"):(i=d.multiple||!1,"tags"in d&&(d.multiple=i=!0)),g=i?new f:new e,g.init(d);else{if("string"!=typeof c[0])throw"Invalid arguments to select2 plugin: "+c;if(0>k(c[0],j))throw"Unknown method: "+c[0];if(h=b,g=a(this).data("select2"),g===b)return;if(h="container"===c[0]?g.container:g[c[0]].apply(g,c.slice(1)),h!==b)return!1}}),h===b?this:h},a.fn.select2.defaults={width:"copy",loadMorePadding:0,closeOnSelect:!0,openOnEnter:!0,containerCss:{},dropdownCss:{},containerCssClass:"",dropdownCssClass:"",formatResult:function(a,b,c,d){var e=[];return y(a.text,c.term,e,d),e.join("")},formatSelection:function(a){return a?a.text:b},sortResults:function(a){return a},formatResultCssClass:function(){return b},formatNoMatches:function(){return"No matches found"},formatInputTooShort:function(a,b){var c=b-a.length;return"Please enter "+c+" more character"+(1==c?"":"s")},formatInputTooLong:function(a,b){var c=a.length-b;return"Please delete "+c+" character"+(1==c?"":"s")},formatSelectionTooBig:function(a){return"You can only select "+a+" item"+(1==a?"":"s")},formatLoadMore:function(){return"Loading more results..."},formatSearching:function(){return"Searching..."},minimumResultsForSearch:0,minimumInputLength:0,maximumInputLength:null,maximumSelectionSize:0,id:function(a){return a.id},matcher:function(a,b){return(""+b).toUpperCase().indexOf((""+a).toUpperCase())>=0},separator:",",tokenSeparators:[],tokenizer:F,escapeMarkup:function(a){var b={"\\":"&#92;","&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&apos;","/":"&#47;"};return(a+"").replace(/[&<>"'\/\\]/g,function(a){return b[a[0]]})},blurOnChange:!1,selectOnBlur:!1,adaptContainerCssClass:function(a){return a},adaptDropdownCssClass:function(){return null}},window.Select2={query:{ajax:z,local:A,tags:B},util:{debounce:q,markMatch:y},"class":{"abstract":d,single:e,multi:f}}}}(jQuery);
/* Spanish Language */
(function(a){a.extend(a.fn.select2.defaults,{formatNoMatches:function(){return"No se encontraron resultados"},formatInputTooShort:function(b,c){var d=c-b.length;return"Por favor adicione "+d+" caracter"+(d==1?"":"es")},formatInputTooLong:function(c,b){var d=c.length-b;return"Por favor elimine "+d+" caracter"+(d==1?"":"es")},formatSelectionTooBig:function(b){return"Solo puede seleccionar "+b+" elemento"+(b==1?"":"s")},formatLoadMore:function(b){return"Cargando más resultados..."},formatSearching:function(){return"Buscando..."}})})(jQuery);


/*! jScrollPane - v2.0.0beta12 - 2012-09-27
 * http://jscrollpane.kelvinluck.com/
 * Copyright (c) 2010 Kelvin Luck
 * Dual licensed under the MIT or GPL licenses.
 **/
(function(b,a,c){b.fn.jScrollPane=function(e){function d(D,O){var ay,Q=this,Y,aj,v,al,T,Z,y,q,az,aE,au,i,I,h,j,aa,U,ap,X,t,A,aq,af,am,G,l,at,ax,x,av,aH,f,L,ai=true,P=true,aG=false,k=false,ao=D.clone(false,false).empty(),ac=b.fn.mwheelIntent?"mwheelIntent.jsp":"mousewheel.jsp";aH=D.css("paddingTop")+" "+D.css("paddingRight")+" "+D.css("paddingBottom")+" "+D.css("paddingLeft");f=(parseInt(D.css("paddingLeft"),10)||0)+(parseInt(D.css("paddingRight"),10)||0);function ar(aQ){var aL,aN,aM,aJ,aI,aP,aO=false,aK=false;ay=aQ;if(Y===c){aI=D.scrollTop();aP=D.scrollLeft();D.css({overflow:"hidden",padding:0});aj=D.innerWidth()+f;v=D.innerHeight();D.width(aj);Y=b('<div class="jspPane" />').css("padding",aH).append(D.children());al=b('<div class="jspContainer" />').css({width:aj+"px",height:v+"px"}).append(Y).appendTo(D)}else{D.css("width","");aO=ay.stickToBottom&&K();aK=ay.stickToRight&&B();aJ=D.innerWidth()+f!=aj||D.outerHeight()!=v;if(aJ){aj=D.innerWidth()+f;v=D.innerHeight();al.css({width:aj+"px",height:v+"px"})}if(!aJ&&L==T&&Y.outerHeight()==Z){D.width(aj);return}L=T;Y.css("width","");D.width(aj);al.find(">.jspVerticalBar,>.jspHorizontalBar").remove().end()}Y.css("overflow","auto");if(aQ.contentWidth){T=aQ.contentWidth}else{T=Y[0].scrollWidth}Z=Y[0].scrollHeight;Y.css("overflow","");y=T/aj;q=Z/v;az=q>1;aE=y>1;if(!(aE||az)){D.removeClass("jspScrollable");Y.css({top:0,width:al.width()-f});n();E();R();w()}else{D.addClass("jspScrollable");aL=ay.maintainPosition&&(I||aa);if(aL){aN=aC();aM=aA()}aF();z();F();if(aL){N(aK?(T-aj):aN,false);M(aO?(Z-v):aM,false)}J();ag();an();if(ay.enableKeyboardNavigation){S()}if(ay.clickOnTrack){p()}C();if(ay.hijackInternalLinks){m()}}if(ay.autoReinitialise&&!av){av=setInterval(function(){ar(ay)},ay.autoReinitialiseDelay)}else{if(!ay.autoReinitialise&&av){clearInterval(av)}}aI&&D.scrollTop(0)&&M(aI,false);aP&&D.scrollLeft(0)&&N(aP,false);D.trigger("jsp-initialised",[aE||az])}function aF(){if(az){al.append(b('<div class="jspVerticalBar" />').append(b('<div class="jspCap jspCapTop" />'),b('<div class="jspTrack" />').append(b('<div class="jspDrag" />').append(b('<div class="jspDragTop" />'),b('<div class="jspDragBottom" />'))),b('<div class="jspCap jspCapBottom" />')));U=al.find(">.jspVerticalBar");ap=U.find(">.jspTrack");au=ap.find(">.jspDrag");if(ay.showArrows){aq=b('<a class="jspArrow jspArrowUp" />').bind("mousedown.jsp",aD(0,-1)).bind("click.jsp",aB);af=b('<a class="jspArrow jspArrowDown" />').bind("mousedown.jsp",aD(0,1)).bind("click.jsp",aB);if(ay.arrowScrollOnHover){aq.bind("mouseover.jsp",aD(0,-1,aq));af.bind("mouseover.jsp",aD(0,1,af))}ak(ap,ay.verticalArrowPositions,aq,af)}t=v;al.find(">.jspVerticalBar>.jspCap:visible,>.jspVerticalBar>.jspArrow").each(function(){t-=b(this).outerHeight()});au.hover(function(){au.addClass("jspHover")},function(){au.removeClass("jspHover")}).bind("mousedown.jsp",function(aI){b("html").bind("dragstart.jsp selectstart.jsp",aB);au.addClass("jspActive");var s=aI.pageY-au.position().top;b("html").bind("mousemove.jsp",function(aJ){V(aJ.pageY-s,false)}).bind("mouseup.jsp mouseleave.jsp",aw);return false});o()}}function o(){ap.height(t+"px");I=0;X=ay.verticalGutter+ap.outerWidth();Y.width(aj-X-f);try{if(U.position().left===0){Y.css("margin-left",X+"px")}}catch(s){}}function z(){if(aE){al.append(b('<div class="jspHorizontalBar" />').append(b('<div class="jspCap jspCapLeft" />'),b('<div class="jspTrack" />').append(b('<div class="jspDrag" />').append(b('<div class="jspDragLeft" />'),b('<div class="jspDragRight" />'))),b('<div class="jspCap jspCapRight" />')));am=al.find(">.jspHorizontalBar");G=am.find(">.jspTrack");h=G.find(">.jspDrag");if(ay.showArrows){ax=b('<a class="jspArrow jspArrowLeft" />').bind("mousedown.jsp",aD(-1,0)).bind("click.jsp",aB);x=b('<a class="jspArrow jspArrowRight" />').bind("mousedown.jsp",aD(1,0)).bind("click.jsp",aB);
if(ay.arrowScrollOnHover){ax.bind("mouseover.jsp",aD(-1,0,ax));x.bind("mouseover.jsp",aD(1,0,x))}ak(G,ay.horizontalArrowPositions,ax,x)}h.hover(function(){h.addClass("jspHover")},function(){h.removeClass("jspHover")}).bind("mousedown.jsp",function(aI){b("html").bind("dragstart.jsp selectstart.jsp",aB);h.addClass("jspActive");var s=aI.pageX-h.position().left;b("html").bind("mousemove.jsp",function(aJ){W(aJ.pageX-s,false)}).bind("mouseup.jsp mouseleave.jsp",aw);return false});l=al.innerWidth();ah()}}function ah(){al.find(">.jspHorizontalBar>.jspCap:visible,>.jspHorizontalBar>.jspArrow").each(function(){l-=b(this).outerWidth()});G.width(l+"px");aa=0}function F(){if(aE&&az){var aI=G.outerHeight(),s=ap.outerWidth();t-=aI;b(am).find(">.jspCap:visible,>.jspArrow").each(function(){l+=b(this).outerWidth()});l-=s;v-=s;aj-=aI;G.parent().append(b('<div class="jspCorner" />').css("width",aI+"px"));o();ah()}if(aE){Y.width((al.outerWidth()-f)+"px")}Z=Y.outerHeight();q=Z/v;if(aE){at=Math.ceil(1/y*l);if(at>ay.horizontalDragMaxWidth){at=ay.horizontalDragMaxWidth}else{if(at<ay.horizontalDragMinWidth){at=ay.horizontalDragMinWidth}}h.width(at+"px");j=l-at;ae(aa)}if(az){A=Math.ceil(1/q*t);if(A>ay.verticalDragMaxHeight){A=ay.verticalDragMaxHeight}else{if(A<ay.verticalDragMinHeight){A=ay.verticalDragMinHeight}}au.height(A+"px");i=t-A;ad(I)}}function ak(aJ,aL,aI,s){var aN="before",aK="after",aM;if(aL=="os"){aL=/Mac/.test(navigator.platform)?"after":"split"}if(aL==aN){aK=aL}else{if(aL==aK){aN=aL;aM=aI;aI=s;s=aM}}aJ[aN](aI)[aK](s)}function aD(aI,s,aJ){return function(){H(aI,s,this,aJ);this.blur();return false}}function H(aL,aK,aO,aN){aO=b(aO).addClass("jspActive");var aM,aJ,aI=true,s=function(){if(aL!==0){Q.scrollByX(aL*ay.arrowButtonSpeed)}if(aK!==0){Q.scrollByY(aK*ay.arrowButtonSpeed)}aJ=setTimeout(s,aI?ay.initialDelay:ay.arrowRepeatFreq);aI=false};s();aM=aN?"mouseout.jsp":"mouseup.jsp";aN=aN||b("html");aN.bind(aM,function(){aO.removeClass("jspActive");aJ&&clearTimeout(aJ);aJ=null;aN.unbind(aM)})}function p(){w();if(az){ap.bind("mousedown.jsp",function(aN){if(aN.originalTarget===c||aN.originalTarget==aN.currentTarget){var aL=b(this),aO=aL.offset(),aM=aN.pageY-aO.top-I,aJ,aI=true,s=function(){var aR=aL.offset(),aS=aN.pageY-aR.top-A/2,aP=v*ay.scrollPagePercent,aQ=i*aP/(Z-v);if(aM<0){if(I-aQ>aS){Q.scrollByY(-aP)}else{V(aS)}}else{if(aM>0){if(I+aQ<aS){Q.scrollByY(aP)}else{V(aS)}}else{aK();return}}aJ=setTimeout(s,aI?ay.initialDelay:ay.trackClickRepeatFreq);aI=false},aK=function(){aJ&&clearTimeout(aJ);aJ=null;b(document).unbind("mouseup.jsp",aK)};s();b(document).bind("mouseup.jsp",aK);return false}})}if(aE){G.bind("mousedown.jsp",function(aN){if(aN.originalTarget===c||aN.originalTarget==aN.currentTarget){var aL=b(this),aO=aL.offset(),aM=aN.pageX-aO.left-aa,aJ,aI=true,s=function(){var aR=aL.offset(),aS=aN.pageX-aR.left-at/2,aP=aj*ay.scrollPagePercent,aQ=j*aP/(T-aj);if(aM<0){if(aa-aQ>aS){Q.scrollByX(-aP)}else{W(aS)}}else{if(aM>0){if(aa+aQ<aS){Q.scrollByX(aP)}else{W(aS)}}else{aK();return}}aJ=setTimeout(s,aI?ay.initialDelay:ay.trackClickRepeatFreq);aI=false},aK=function(){aJ&&clearTimeout(aJ);aJ=null;b(document).unbind("mouseup.jsp",aK)};s();b(document).bind("mouseup.jsp",aK);return false}})}}function w(){if(G){G.unbind("mousedown.jsp")}if(ap){ap.unbind("mousedown.jsp")}}function aw(){b("html").unbind("dragstart.jsp selectstart.jsp mousemove.jsp mouseup.jsp mouseleave.jsp");if(au){au.removeClass("jspActive")}if(h){h.removeClass("jspActive")}}function V(s,aI){if(!az){return}if(s<0){s=0}else{if(s>i){s=i}}if(aI===c){aI=ay.animateScroll}if(aI){Q.animate(au,"top",s,ad)}else{au.css("top",s);ad(s)}}function ad(aI){if(aI===c){aI=au.position().top}al.scrollTop(0);I=aI;var aL=I===0,aJ=I==i,aK=aI/i,s=-aK*(Z-v);if(ai!=aL||aG!=aJ){ai=aL;aG=aJ;D.trigger("jsp-arrow-change",[ai,aG,P,k])}u(aL,aJ);Y.css("top",s);D.trigger("jsp-scroll-y",[-s,aL,aJ]).trigger("scroll")}function W(aI,s){if(!aE){return}if(aI<0){aI=0}else{if(aI>j){aI=j}}if(s===c){s=ay.animateScroll}if(s){Q.animate(h,"left",aI,ae)
}else{h.css("left",aI);ae(aI)}}function ae(aI){if(aI===c){aI=h.position().left}al.scrollTop(0);aa=aI;var aL=aa===0,aK=aa==j,aJ=aI/j,s=-aJ*(T-aj);if(P!=aL||k!=aK){P=aL;k=aK;D.trigger("jsp-arrow-change",[ai,aG,P,k])}r(aL,aK);Y.css("left",s);D.trigger("jsp-scroll-x",[-s,aL,aK]).trigger("scroll")}function u(aI,s){if(ay.showArrows){aq[aI?"addClass":"removeClass"]("jspDisabled");af[s?"addClass":"removeClass"]("jspDisabled")}}function r(aI,s){if(ay.showArrows){ax[aI?"addClass":"removeClass"]("jspDisabled");x[s?"addClass":"removeClass"]("jspDisabled")}}function M(s,aI){var aJ=s/(Z-v);V(aJ*i,aI)}function N(aI,s){var aJ=aI/(T-aj);W(aJ*j,s)}function ab(aV,aQ,aJ){var aN,aK,aL,s=0,aU=0,aI,aP,aO,aS,aR,aT;try{aN=b(aV)}catch(aM){return}aK=aN.outerHeight();aL=aN.outerWidth();al.scrollTop(0);al.scrollLeft(0);while(!aN.is(".jspPane")){s+=aN.position().top;aU+=aN.position().left;aN=aN.offsetParent();if(/^body|html$/i.test(aN[0].nodeName)){return}}aI=aA();aO=aI+v;if(s<aI||aQ){aR=s-ay.verticalGutter}else{if(s+aK>aO){aR=s-v+aK+ay.verticalGutter}}if(aR){M(aR,aJ)}aP=aC();aS=aP+aj;if(aU<aP||aQ){aT=aU-ay.horizontalGutter}else{if(aU+aL>aS){aT=aU-aj+aL+ay.horizontalGutter}}if(aT){N(aT,aJ)}}function aC(){return -Y.position().left}function aA(){return -Y.position().top}function K(){var s=Z-v;return(s>20)&&(s-aA()<10)}function B(){var s=T-aj;return(s>20)&&(s-aC()<10)}function ag(){al.unbind(ac).bind(ac,function(aL,aM,aK,aI){var aJ=aa,s=I;Q.scrollBy(aK*ay.mouseWheelSpeed,-aI*ay.mouseWheelSpeed,false);return aJ==aa&&s==I})}function n(){al.unbind(ac)}function aB(){return false}function J(){Y.find(":input,a").unbind("focus.jsp").bind("focus.jsp",function(s){ab(s.target,false)})}function E(){Y.find(":input,a").unbind("focus.jsp")}function S(){var s,aI,aK=[];aE&&aK.push(am[0]);az&&aK.push(U[0]);Y.focus(function(){D.focus()});D.attr("tabindex",0).unbind("keydown.jsp keypress.jsp").bind("keydown.jsp",function(aN){if(aN.target!==this&&!(aK.length&&b(aN.target).closest(aK).length)){return}var aM=aa,aL=I;switch(aN.keyCode){case 40:case 38:case 34:case 32:case 33:case 39:case 37:s=aN.keyCode;aJ();break;case 35:M(Z-v);s=null;break;case 36:M(0);s=null;break}aI=aN.keyCode==s&&aM!=aa||aL!=I;return !aI}).bind("keypress.jsp",function(aL){if(aL.keyCode==s){aJ()}return !aI});if(ay.hideFocus){D.css("outline","none");if("hideFocus" in al[0]){D.attr("hideFocus",true)}}else{D.css("outline","");if("hideFocus" in al[0]){D.attr("hideFocus",false)}}function aJ(){var aM=aa,aL=I;switch(s){case 40:Q.scrollByY(ay.keyboardSpeed,false);break;case 38:Q.scrollByY(-ay.keyboardSpeed,false);break;case 34:case 32:Q.scrollByY(v*ay.scrollPagePercent,false);break;case 33:Q.scrollByY(-v*ay.scrollPagePercent,false);break;case 39:Q.scrollByX(ay.keyboardSpeed,false);break;case 37:Q.scrollByX(-ay.keyboardSpeed,false);break}aI=aM!=aa||aL!=I;return aI}}function R(){D.attr("tabindex","-1").removeAttr("tabindex").unbind("keydown.jsp keypress.jsp")}function C(){if(location.hash&&location.hash.length>1){var aK,aI,aJ=escape(location.hash.substr(1));try{aK=b("#"+aJ+', a[name="'+aJ+'"]')}catch(s){return}if(aK.length&&Y.find(aJ)){if(al.scrollTop()===0){aI=setInterval(function(){if(al.scrollTop()>0){ab(aK,true);b(document).scrollTop(al.position().top);clearInterval(aI)}},50)}else{ab(aK,true);b(document).scrollTop(al.position().top)}}}}function m(){if(b(document.body).data("jspHijack")){return}b(document.body).data("jspHijack",true);b(document.body).delegate("a[href*=#]","click",function(s){var aI=this.href.substr(0,this.href.indexOf("#")),aK=location.href,aO,aP,aJ,aM,aL,aN;if(location.href.indexOf("#")!==-1){aK=location.href.substr(0,location.href.indexOf("#"))}if(aI!==aK){return}aO=escape(this.href.substr(this.href.indexOf("#")+1));aP;try{aP=b("#"+aO+', a[name="'+aO+'"]')}catch(aQ){return}if(!aP.length){return}aJ=aP.closest(".jspScrollable");aM=aJ.data("jsp");aM.scrollToElement(aP,true);if(aJ[0].scrollIntoView){aL=b(a).scrollTop();aN=aP.offset().top;if(aN<aL||aN>aL+b(a).height()){aJ[0].scrollIntoView()}}s.preventDefault()
})}function an(){var aJ,aI,aL,aK,aM,s=false;al.unbind("touchstart.jsp touchmove.jsp touchend.jsp click.jsp-touchclick").bind("touchstart.jsp",function(aN){var aO=aN.originalEvent.touches[0];aJ=aC();aI=aA();aL=aO.pageX;aK=aO.pageY;aM=false;s=true}).bind("touchmove.jsp",function(aQ){if(!s){return}var aP=aQ.originalEvent.touches[0],aO=aa,aN=I;Q.scrollTo(aJ+aL-aP.pageX,aI+aK-aP.pageY);aM=aM||Math.abs(aL-aP.pageX)>5||Math.abs(aK-aP.pageY)>5;return aO==aa&&aN==I}).bind("touchend.jsp",function(aN){s=false}).bind("click.jsp-touchclick",function(aN){if(aM){aM=false;return false}})}function g(){var s=aA(),aI=aC();D.removeClass("jspScrollable").unbind(".jsp");D.replaceWith(ao.append(Y.children()));ao.scrollTop(s);ao.scrollLeft(aI);if(av){clearInterval(av)}}b.extend(Q,{reinitialise:function(aI){aI=b.extend({},ay,aI);ar(aI)},scrollToElement:function(aJ,aI,s){ab(aJ,aI,s)},scrollTo:function(aJ,s,aI){N(aJ,aI);M(s,aI)},scrollToX:function(aI,s){N(aI,s)},scrollToY:function(s,aI){M(s,aI)},scrollToPercentX:function(aI,s){N(aI*(T-aj),s)},scrollToPercentY:function(aI,s){M(aI*(Z-v),s)},scrollBy:function(aI,s,aJ){Q.scrollByX(aI,aJ);Q.scrollByY(s,aJ)},scrollByX:function(s,aJ){var aI=aC()+Math[s<0?"floor":"ceil"](s),aK=aI/(T-aj);W(aK*j,aJ)},scrollByY:function(s,aJ){var aI=aA()+Math[s<0?"floor":"ceil"](s),aK=aI/(Z-v);V(aK*i,aJ)},positionDragX:function(s,aI){W(s,aI)},positionDragY:function(aI,s){V(aI,s)},animate:function(aI,aL,s,aK){var aJ={};aJ[aL]=s;aI.animate(aJ,{duration:ay.animateDuration,easing:ay.animateEase,queue:false,step:aK})},getContentPositionX:function(){return aC()},getContentPositionY:function(){return aA()},getContentWidth:function(){return T},getContentHeight:function(){return Z},getPercentScrolledX:function(){return aC()/(T-aj)},getPercentScrolledY:function(){return aA()/(Z-v)},getIsScrollableH:function(){return aE},getIsScrollableV:function(){return az},getContentPane:function(){return Y},scrollToBottom:function(s){V(i,s)},hijackInternalLinks:b.noop,destroy:function(){g()}});ar(O)}e=b.extend({},b.fn.jScrollPane.defaults,e);b.each(["mouseWheelSpeed","arrowButtonSpeed","trackClickSpeed","keyboardSpeed"],function(){e[this]=e[this]||e.speed});return this.each(function(){var f=b(this),g=f.data("jsp");if(g){g.reinitialise(e)}else{b("script",f).filter('[type="text/javascript"],:not([type])').remove();g=new d(f,e);f.data("jsp",g)}})};b.fn.jScrollPane.defaults={showArrows:false,maintainPosition:true,stickToBottom:false,stickToRight:false,clickOnTrack:true,autoReinitialise:true,autoReinitialiseDelay:500,verticalDragMinHeight:0,verticalDragMaxHeight:99999,horizontalDragMinWidth:0,horizontalDragMaxWidth:99999,contentWidth:c,animateScroll:false,animateDuration:300,animateEase:"linear",hijackInternalLinks:false,verticalGutter:4,horizontalGutter:4,mouseWheelSpeed:0,arrowButtonSpeed:0,arrowRepeatFreq:50,arrowScrollOnHover:false,trackClickSpeed:0,trackClickRepeatFreq:70,verticalArrowPositions:"split",horizontalArrowPositions:"split",enableKeyboardNavigation:true,hideFocus:false,keyboardSpeed:0,initialDelay:300,speed:30,scrollPagePercent:0.8}})(jQuery,this);


/*! Metadata - jQuery plugin for parsing metadata from elements
 * Copyright (c) 2006 John Resig, Yehuda Katz, Joörn Zaefferer, Paul McLanahan
 **/
 (function($){$.extend({metadata:{defaults:{type:"class",name:"metadata",cre:/({.*})/,single:"metadata"},setType:function(type,name){this.defaults.type=type;this.defaults.name=name},get:function(elem,opts){var settings=$.extend({},this.defaults,opts);if(!settings.single.length){settings.single="metadata"}var data=$.data(elem,settings.single);if(data){return data}data="{}";if(settings.type=="class"){var m=settings.cre.exec(elem.className);if(m){data=m[1]}}else{if(settings.type=="elem"){if(!elem.getElementsByTagName){return undefined}var e=elem.getElementsByTagName(settings.name);if(e.length){data=$.trim(e[0].innerHTML)}}else{if(elem.getAttribute!=undefined){var attr=elem.getAttribute(settings.name);if(attr){data=attr}}}}if(data.indexOf("{")<0){data="{"+data+"}"}data=eval("("+data+")");$.data(elem,settings.single,data);return data}}});$.fn.metadata=function(opts){return $.metadata.get(this[0],opts)}})(jQuery);


/*! TableSorter 2.0 - Client-side table sorting with ease!
 * Version 2.0.5b
 * Copyright (c) 2007 Christian Bach
 * Examples and docs at: http://tablesorter.com
 **/
(function($){$.extend({tablesorter:new
function(){var parsers=[],widgets=[];this.defaults={cssHeader:"header",cssAsc:"headerSortUp",cssDesc:"headerSortDown",cssChildRow:"expand-child",sortInitialOrder:"asc",sortMultiSortKey:"shiftKey",sortForce:null,sortAppend:null,sortLocaleCompare:true,textExtraction:"simple",parsers:{},widgets:[],widgetZebra:{css:["even","odd"]},headers:{},widthFixed:false,cancelSelection:true,sortList:[],headerList:[],dateFormat:"us",decimal:'/\.|\,/g',onRenderHeader:null,selectorHeaders:'thead th',debug:false};function benchmark(s,d){log(s+","+(new Date().getTime()-d.getTime())+"ms");}this.benchmark=benchmark;function log(s){if(typeof console!="undefined"&&typeof console.debug!="undefined"){console.log(s);}else{alert(s);}}function buildParserCache(table,$headers){if(table.config.debug){var parsersDebug="";}if(table.tBodies.length==0)return;var rows=table.tBodies[0].rows;if(rows[0]){var list=[],cells=rows[0].cells,l=cells.length;for(var i=0;i<l;i++){var p=false;if($.metadata&&($($headers[i]).metadata()&&$($headers[i]).metadata().sorter)){p=getParserById($($headers[i]).metadata().sorter);}else if((table.config.headers[i]&&table.config.headers[i].sorter)){p=getParserById(table.config.headers[i].sorter);}if(!p){p=detectParserForColumn(table,rows,-1,i);}if(table.config.debug){parsersDebug+="column:"+i+" parser:"+p.id+"\n";}list.push(p);}}if(table.config.debug){log(parsersDebug);}return list;};function detectParserForColumn(table,rows,rowIndex,cellIndex){var l=parsers.length,node=false,nodeValue=false,keepLooking=true;while(nodeValue==''&&keepLooking){rowIndex++;if(rows[rowIndex]){node=getNodeFromRowAndCellIndex(rows,rowIndex,cellIndex);nodeValue=trimAndGetNodeText(table.config,node);if(table.config.debug){log('Checking if value was empty on row:'+rowIndex);}}else{keepLooking=false;}}for(var i=1;i<l;i++){if(parsers[i].is(nodeValue,table,node)){return parsers[i];}}return parsers[0];}function getNodeFromRowAndCellIndex(rows,rowIndex,cellIndex){return rows[rowIndex].cells[cellIndex];}function trimAndGetNodeText(config,node){return $.trim(getElementText(config,node));}function getParserById(name){var l=parsers.length;for(var i=0;i<l;i++){if(parsers[i].id.toLowerCase()==name.toLowerCase()){return parsers[i];}}return false;}function buildCache(table){if(table.config.debug){var cacheTime=new Date();}var totalRows=(table.tBodies[0]&&table.tBodies[0].rows.length)||0,totalCells=(table.tBodies[0].rows[0]&&table.tBodies[0].rows[0].cells.length)||0,parsers=table.config.parsers,cache={row:[],normalized:[]};for(var i=0;i<totalRows;++i){var c=$(table.tBodies[0].rows[i]),cols=[];if(c.hasClass(table.config.cssChildRow)){cache.row[cache.row.length-1]=cache.row[cache.row.length-1].add(c);continue;}cache.row.push(c);for(var j=0;j<totalCells;++j){cols.push(parsers[j].format(getElementText(table.config,c[0].cells[j]),table,c[0].cells[j]));}cols.push(cache.normalized.length);cache.normalized.push(cols);cols=null;};if(table.config.debug){benchmark("Building cache for "+totalRows+" rows:",cacheTime);}return cache;};function getElementText(config,node){var text="";if(!node)return"";if(!config.supportsTextContent)config.supportsTextContent=node.textContent||false;if(config.textExtraction=="simple"){if(config.supportsTextContent){text=node.textContent;}else{if(node.childNodes[0]&&node.childNodes[0].hasChildNodes()){text=node.childNodes[0].innerHTML;}else{text=node.innerHTML;}}}else{if(typeof(config.textExtraction)=="function"){text=config.textExtraction(node);}else{text=$(node).text();}}return text;}function appendToTable(table,cache){if(table.config.debug){var appendTime=new Date()}var c=cache,r=c.row,n=c.normalized,totalRows=n.length,checkCell=(n[0].length-1),tableBody=$(table.tBodies[0]),rows=[];for(var i=0;i<totalRows;i++){var pos=n[i][checkCell];rows.push(r[pos]);if(!table.config.appender){var l=r[pos].length;for(var j=0;j<l;j++){tableBody[0].appendChild(r[pos][j]);}}}if(table.config.appender){table.config.appender(table,rows);}rows=null;if(table.config.debug){benchmark("Rebuilt table:",appendTime);}applyWidget(table);setTimeout(function(){$(table).trigger("sortEnd");},0);};function buildHeaders(table){if(table.config.debug){var time=new Date();}var meta=($.metadata)?true:false;var header_index=computeTableHeaderCellIndexes(table);$tableHeaders=$(table.config.selectorHeaders,table).each(function(index){this.column=header_index[this.parentNode.rowIndex+"-"+this.cellIndex];this.order=formatSortingOrder(table.config.sortInitialOrder);this.count=this.order;if(checkHeaderMetadata(this)||checkHeaderOptions(table,index))this.sortDisabled=true;if(checkHeaderOptionsSortingLocked(table,index))this.order=this.lockedOrder=checkHeaderOptionsSortingLocked(table,index);if(!this.sortDisabled){var $th=$(this).addClass(table.config.cssHeader);if(table.config.onRenderHeader)table.config.onRenderHeader.apply($th);}table.config.headerList[index]=this;});if(table.config.debug){benchmark("Built headers:",time);log($tableHeaders);}return $tableHeaders;};function computeTableHeaderCellIndexes(t){var matrix=[];var lookup={};var thead=t.getElementsByTagName('THEAD')[0];var trs=thead.getElementsByTagName('TR');for(var i=0;i<trs.length;i++){var cells=trs[i].cells;for(var j=0;j<cells.length;j++){var c=cells[j];var rowIndex=c.parentNode.rowIndex;var cellId=rowIndex+"-"+c.cellIndex;var rowSpan=c.rowSpan||1;var colSpan=c.colSpan||1
var firstAvailCol;if(typeof(matrix[rowIndex])=="undefined"){matrix[rowIndex]=[];}for(var k=0;k<matrix[rowIndex].length+1;k++){if(typeof(matrix[rowIndex][k])=="undefined"){firstAvailCol=k;break;}}lookup[cellId]=firstAvailCol;for(var k=rowIndex;k<rowIndex+rowSpan;k++){if(typeof(matrix[k])=="undefined"){matrix[k]=[];}var matrixrow=matrix[k];for(var l=firstAvailCol;l<firstAvailCol+colSpan;l++){matrixrow[l]="x";}}}}return lookup;}function checkCellColSpan(table,rows,row){var arr=[],r=table.tHead.rows,c=r[row].cells;for(var i=0;i<c.length;i++){var cell=c[i];if(cell.colSpan>1){arr=arr.concat(checkCellColSpan(table,headerArr,row++));}else{if(table.tHead.length==1||(cell.rowSpan>1||!r[row+1])){arr.push(cell);}}}return arr;};function checkHeaderMetadata(cell){if(($.metadata)&&($(cell).metadata().sorter===false)){return true;};return false;}function checkHeaderOptions(table,i){if((table.config.headers[i])&&(table.config.headers[i].sorter===false)){return true;};return false;}function checkHeaderOptionsSortingLocked(table,i){if((table.config.headers[i])&&(table.config.headers[i].lockedOrder))return table.config.headers[i].lockedOrder;return false;}function applyWidget(table){var c=table.config.widgets;var l=c.length;for(var i=0;i<l;i++){getWidgetById(c[i]).format(table);}}function getWidgetById(name){var l=widgets.length;for(var i=0;i<l;i++){if(widgets[i].id.toLowerCase()==name.toLowerCase()){return widgets[i];}}};function formatSortingOrder(v){if(typeof(v)!="Number"){return(v.toLowerCase()=="desc")?1:0;}else{return(v==1)?1:0;}}function isValueInArray(v,a){var l=a.length;for(var i=0;i<l;i++){if(a[i][0]==v){return true;}}return false;}function setHeadersCss(table,$headers,list,css){$headers.removeClass(css[0]).removeClass(css[1]);var h=[];$headers.each(function(offset){if(!this.sortDisabled){h[this.column]=$(this);}});var l=list.length;for(var i=0;i<l;i++){h[list[i][0]].addClass(css[list[i][1]]);}}function fixColumnWidth(table,$headers){var c=table.config;if(c.widthFixed){var colgroup=$('<colgroup>');$("tr:first td",table.tBodies[0]).each(function(){colgroup.append($('<col>').css('width',$(this).width()));});$(table).prepend(colgroup);};}function updateHeaderSortCount(table,sortList){var c=table.config,l=sortList.length;for(var i=0;i<l;i++){var s=sortList[i],o=c.headerList[s[0]];o.count=s[1];o.count++;}}function multisort(table,sortList,cache){if(table.config.debug){var sortTime=new Date();}var dynamicExp="var sortWrapper = function(a,b) {",l=sortList.length;for(var i=0;i<l;i++){var c=sortList[i][0];var order=sortList[i][1];var s=(table.config.parsers[c].type=="text")?((order==0)?makeSortFunction("text","asc",c):makeSortFunction("text","desc",c)):((order==0)?makeSortFunction("numeric","asc",c):makeSortFunction("numeric","desc",c));var e="e"+i;dynamicExp+="var "+e+" = "+s;dynamicExp+="if("+e+") { return "+e+"; } ";dynamicExp+="else { ";}var orgOrderCol=cache.normalized[0].length-1;dynamicExp+="return a["+orgOrderCol+"]-b["+orgOrderCol+"];";for(var i=0;i<l;i++){dynamicExp+="}; ";}dynamicExp+="return 0; ";dynamicExp+="}; ";if(table.config.debug){benchmark("Evaling expression:"+dynamicExp,new Date());}eval(dynamicExp);cache.normalized.sort(sortWrapper);if(table.config.debug){benchmark("Sorting on "+sortList.toString()+" and dir "+order+" time:",sortTime);}return cache;};function makeSortFunction(type,direction,index){var a="a["+index+"]",b="b["+index+"]";if(type=='text'&&direction=='asc'){return"("+a+" == "+b+" ? 0 : ("+a+" === null ? Number.POSITIVE_INFINITY : ("+b+" === null ? Number.NEGATIVE_INFINITY : ("+a+" < "+b+") ? -1 : 1 )));";}else if(type=='text'&&direction=='desc'){return"("+a+" == "+b+" ? 0 : ("+a+" === null ? Number.POSITIVE_INFINITY : ("+b+" === null ? Number.NEGATIVE_INFINITY : ("+b+" < "+a+") ? -1 : 1 )));";}else if(type=='numeric'&&direction=='asc'){return"("+a+" === null && "+b+" === null) ? 0 :("+a+" === null ? Number.POSITIVE_INFINITY : ("+b+" === null ? Number.NEGATIVE_INFINITY : "+a+" - "+b+"));";}else if(type=='numeric'&&direction=='desc'){return"("+a+" === null && "+b+" === null) ? 0 :("+a+" === null ? Number.POSITIVE_INFINITY : ("+b+" === null ? Number.NEGATIVE_INFINITY : "+b+" - "+a+"));";}};function makeSortText(i){return"((a["+i+"] < b["+i+"]) ? -1 : ((a["+i+"] > b["+i+"]) ? 1 : 0));";};function makeSortTextDesc(i){return"((b["+i+"] < a["+i+"]) ? -1 : ((b["+i+"] > a["+i+"]) ? 1 : 0));";};function makeSortNumeric(i){return"a["+i+"]-b["+i+"];";};function makeSortNumericDesc(i){return"b["+i+"]-a["+i+"];";};function sortText(a,b){if(table.config.sortLocaleCompare)return a.localeCompare(b);return((a<b)?-1:((a>b)?1:0));};function sortTextDesc(a,b){if(table.config.sortLocaleCompare)return b.localeCompare(a);return((b<a)?-1:((b>a)?1:0));};function sortNumeric(a,b){return a-b;};function sortNumericDesc(a,b){return b-a;};function getCachedSortType(parsers,i){return parsers[i].type;};this.construct=function(settings){return this.each(function(){if(!this.tHead||!this.tBodies)return;var $this,$document,$headers,cache,config,shiftDown=0,sortOrder;this.config={};config=$.extend(this.config,$.tablesorter.defaults,settings);$this=$(this);$.data(this,"tablesorter",config);$headers=buildHeaders(this);this.config.parsers=buildParserCache(this,$headers);cache=buildCache(this);var sortCSS=[config.cssDesc,config.cssAsc];fixColumnWidth(this);$headers.click(function(e){var totalRows=($this[0].tBodies[0]&&$this[0].tBodies[0].rows.length)||0;if(!this.sortDisabled&&totalRows>0){$this.trigger("sortStart");var $cell=$(this);var i=this.column;this.order=this.count++%2;if(this.lockedOrder)this.order=this.lockedOrder;if(!e[config.sortMultiSortKey]){config.sortList=[];if(config.sortForce!=null){var a=config.sortForce;for(var j=0;j<a.length;j++){if(a[j][0]!=i){config.sortList.push(a[j]);}}}config.sortList.push([i,this.order]);}else{if(isValueInArray(i,config.sortList)){for(var j=0;j<config.sortList.length;j++){var s=config.sortList[j],o=config.headerList[s[0]];if(s[0]==i){o.count=s[1];o.count++;s[1]=o.count%2;}}}else{config.sortList.push([i,this.order]);}};setTimeout(function(){setHeadersCss($this[0],$headers,config.sortList,sortCSS);appendToTable($this[0],multisort($this[0],config.sortList,cache));},1);return false;}}).mousedown(function(){if(config.cancelSelection){this.onselectstart=function(){return false};return false;}});$this.bind("update",function(){var me=this;setTimeout(function(){me.config.parsers=buildParserCache(me,$headers);cache=buildCache(me);},1);}).bind("updateCell",function(e,cell){var config=this.config;var pos=[(cell.parentNode.rowIndex-1),cell.cellIndex];cache.normalized[pos[0]][pos[1]]=config.parsers[pos[1]].format(getElementText(config,cell),cell);}).bind("sorton",function(e,list){$(this).trigger("sortStart");config.sortList=list;var sortList=config.sortList;updateHeaderSortCount(this,sortList);setHeadersCss(this,$headers,sortList,sortCSS);appendToTable(this,multisort(this,sortList,cache));}).bind("appendCache",function(){appendToTable(this,cache);}).bind("applyWidgetId",function(e,id){getWidgetById(id).format(this);}).bind("applyWidgets",function(){applyWidget(this);});if($.metadata&&($(this).metadata()&&$(this).metadata().sortlist)){config.sortList=$(this).metadata().sortlist;}if(config.sortList.length>0){$this.trigger("sorton",[config.sortList]);}applyWidget(this);});};this.addParser=function(parser){var l=parsers.length,a=true;for(var i=0;i<l;i++){if(parsers[i].id.toLowerCase()==parser.id.toLowerCase()){a=false;}}if(a){parsers.push(parser);};};this.addWidget=function(widget){widgets.push(widget);};this.formatFloat=function(s){var i=parseFloat(s);return(isNaN(i))?0:i;};this.formatInt=function(s){var i=parseInt(s);return(isNaN(i))?0:i;};this.isDigit=function(s,config){return/^[-+]?\d*$/.test($.trim(s.replace(/[,.']/g,'')));};this.clearTableBody=function(table){if($.browser.msie){function empty(){while(this.firstChild)this.removeChild(this.firstChild);}empty.apply(table.tBodies[0]);}else{table.tBodies[0].innerHTML="";}};}});$.fn.extend({tablesorter:$.tablesorter.construct});var ts=$.tablesorter;ts.addParser({id:"text",is:function(s){return true;},format:function(s){return $.trim(s.toLocaleLowerCase());},type:"text"});ts.addParser({id:"digit",is:function(s,table){var c=table.config;return $.tablesorter.isDigit(s,c);},format:function(s){return $.tablesorter.formatFloat(s);},type:"numeric"});ts.addParser({id:"currency",is:function(s){return/^[£$€?.]/.test(s);},format:function(s){return $.tablesorter.formatFloat(s.replace(new RegExp(/[£$€]/g),""));},type:"numeric"});ts.addParser({id:"ipAddress",is:function(s){return/^\d{2,3}[\.]\d{2,3}[\.]\d{2,3}[\.]\d{2,3}$/.test(s);},format:function(s){var a=s.split("."),r="",l=a.length;for(var i=0;i<l;i++){var item=a[i];if(item.length==2){r+="0"+item;}else{r+=item;}}return $.tablesorter.formatFloat(r);},type:"numeric"});ts.addParser({id:"url",is:function(s){return/^(https?|ftp|file):\/\/$/.test(s);},format:function(s){return jQuery.trim(s.replace(new RegExp(/(https?|ftp|file):\/\//),''));},type:"text"});ts.addParser({id:"isoDate",is:function(s){return/^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(s);},format:function(s){return $.tablesorter.formatFloat((s!="")?new Date(s.replace(new RegExp(/-/g),"/")).getTime():"0");},type:"numeric"});ts.addParser({id:"percent",is:function(s){return/\%$/.test($.trim(s));},format:function(s){return $.tablesorter.formatFloat(s.replace(new RegExp(/%/g),""));},type:"numeric"});ts.addParser({id:"usLongDate",is:function(s){return s.match(new RegExp(/^[A-Za-z]{3,10}\.? [0-9]{1,2}, ([0-9]{4}|'?[0-9]{2}) (([0-2]?[0-9]:[0-5][0-9])|([0-1]?[0-9]:[0-5][0-9]\s(AM|PM)))$/));},format:function(s){return $.tablesorter.formatFloat(new Date(s).getTime());},type:"numeric"});ts.addParser({id:"shortDate",is:function(s){return/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/.test(s);},format:function(s,table){var c=table.config;s=s.replace(/\-/g,"/");if(c.dateFormat=="us"){s=s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,"$3/$1/$2");}else if(c.dateFormat=="uk"){s=s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,"$3/$2/$1");}else if(c.dateFormat=="dd/mm/yy"||c.dateFormat=="dd-mm-yy"){s=s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})/,"$1/$2/$3");}return $.tablesorter.formatFloat(new Date(s).getTime());},type:"numeric"});ts.addParser({id:"time",is:function(s){return/^(([0-2]?[0-9]:[0-5][0-9])|([0-1]?[0-9]:[0-5][0-9]\s(am|pm)))$/.test(s);},format:function(s){return $.tablesorter.formatFloat(new Date("2000/01/01 "+s).getTime());},type:"numeric"});ts.addParser({id:"metadata",is:function(s){return false;},format:function(s,table,cell){var c=table.config,p=(!c.parserMetadataName)?'sortValue':c.parserMetadataName;return $(cell).metadata()[p];},type:"numeric"});ts.addWidget({id:"zebra",format:function(table){if(table.config.debug){var time=new Date();}var $tr,row=-1,odd;$("tr:visible",table.tBodies[0]).each(function(i){$tr=$(this);if(!$tr.hasClass(table.config.cssChildRow))row++;odd=(row%2==0);$tr.removeClass(table.config.widgetZebra.css[odd?0:1]).addClass(table.config.widgetZebra.css[odd?1:0])});if(table.config.debug){$.tablesorter.benchmark("Applying Zebra widget",time);}}});})(jQuery);


/*! Autosize 1.15.2 - jQuery plugin for textareas
 * (c) 2013 Jack Moore - jacklmoore.com
 * license: www.opensource.org/licenses/mit-license.php
 **/
(function($){var defaults={className:"autosizejs",append:"",callback:false},hidden="hidden",borderBox="border-box",lineHeight="lineHeight",copy='<textarea tabindex="-1" style="position:absolute; top:-9999px; left:-9999px; right:auto; bottom:auto; border:0; -moz-box-sizing:content-box; -webkit-box-sizing:content-box; box-sizing:content-box; word-wrap:break-word; height:0 !important; min-height:0 !important; overflow:hidden;"/>',copyStyle=["fontFamily","fontSize","fontWeight","fontStyle","letterSpacing","textTransform","wordSpacing","textIndent"],oninput="oninput",onpropertychange="onpropertychange",mirrored,mirror=$(copy).data("autosize",true)[0];mirror.style.lineHeight="99px";if($(mirror).css(lineHeight)==="99px"){copyStyle.push(lineHeight);}mirror.style.lineHeight="";$.fn.autosize=function(options){options=$.extend({},defaults,options||{});if(mirror.parentNode!==document.body){$(document.body).append(mirror);}return this.each(function(){var ta=this,$ta=$(ta),minHeight=$ta.height(),maxHeight=parseInt($ta.css("maxHeight"),10),active,resize,boxOffset=0,value=ta.value,callback=$.isFunction(options.callback);if($ta.data("autosize")){return;}if($ta.css("box-sizing")===borderBox||$ta.css("-moz-box-sizing")===borderBox||$ta.css("-webkit-box-sizing")===borderBox){boxOffset=$ta.outerHeight()-$ta.height();}resize="none";$ta.css({overflow:hidden,overflowY:hidden,wordWrap:"break-word",resize:resize}).data("autosize",true);maxHeight=maxHeight&&maxHeight>0?maxHeight:90000;function initMirror(){mirrored=ta;mirror.className=options.className;$.each(copyStyle,function(i,val){mirror.style[val]=$ta.css(val);});}function adjust(){var height,overflow,original;if(mirrored!==ta){initMirror();}if(!active){active=true;mirror.value=ta.value+options.append;mirror.style.overflowY=ta.style.overflowY;original=parseInt(ta.style.height,10);mirror.style.width=$ta.width()+"px";mirror.scrollTop=0;mirror.scrollTop=90000;height=mirror.scrollTop;if(height>maxHeight){height=maxHeight;overflow="scroll";}else{if(height<minHeight){height=minHeight;}}height+=boxOffset;ta.style.overflowY=overflow||hidden;if(original!==height){ta.style.height=height+"px";if(callback){options.callback.call(ta);}}setTimeout(function(){active=false;},1);}}if(onpropertychange in ta){if(oninput in ta){ta[oninput]=ta.onkeyup=adjust;}else{ta[onpropertychange]=adjust;}}else{ta[oninput]=adjust;ta.value="";ta.value=value;}$(window).resize(adjust);$ta.bind("autosize",adjust);adjust();});};}(window.jQuery||window.Zepto));


/*! Loader 1.0 - jQuery plugin 
 * Copyright 2013, Duvan Jamid Vargas, @DuvanJamid
 * license: www.opensource.org/licenses/mit-license.php
 **/
(function(a){a.fn.loader=function(b){var e={type:"spinner",text:"Cargando",textPosition:"bottom"};var b=a.extend(e,b);var r=a('<div class="loader-cont"></div>');var i=a('<div class="img"></div>');var k=(b.text=="")?"":'<div class="loader-cont-text">'+b.text+"</div>";if(b.textPosition=="top"){r.html(k);this.html(r.append(i))}else{r.html(i);this.html(r.append(k))}var h=9;var d=(b.type=="spinner")?44:160;var o=(b.type=="spinner")?44:20;var j=(b.type=="spinner")?24:13;var n=(b.type=="spinner")?44:160;var g=(b.type=="spinner")?"/eisi/images/Estandar/Elise/loader/sprites_spinner.gif":"/eisi/images/Estandar/Elise/loader/sprites_bar.gif";var m=false;var q=0;var c=0;var f=0;function l(){i.css({"background-image":"url("+g+")",width:d+"px",height:o+"px"});FPS=Math.round(100/h);f=1/FPS;setTimeout(function(){p()},f/1000)}function p(){c+=n;q+=1;if(q>=j){c=0;q=0}i.css({"background-position":(-c)+"px 0"});setTimeout(function(){p()},f*1000)}l();return this.children(".loader-cont")}})(jQuery);


/*! Tooltip
 * Copyright 2010 Drew Wilson
 * www.drewwilson.com
 * code.drewwilson.com/entry/tiptip-jquery-plugin
 * Version 1.3.2 - Updated: 23 August 2013
 * Modified by Romel Perez
 **/
(function (a) {
    a.fn.toolTip = function (c) {
        var g = {
            activation: "hover",
            keepAlive: false,
            maxWidth: "300px",
            edgeOffset: 3,
            defaultPosition: "bottom",
            delay: 200,
            fadeIn: 200,
            fadeOut: 200,
            attribute: "title",
            content: false,
            enter: function () {},
            exit: function () {}
        };
        var e = a.extend(g, c);
        if (a("#tiptip_holder").length <= 0) {
            var b = a('<div id="tiptip_holder"></div>');
            var d = a('<div id="tiptip_content"></div>');
            var f = a('<div id="tiptip_arrow"></div>');
            a("body").append(b.html(d).prepend(f.html('<div id="tiptip_arrow_inner"></div>')))
        } else {
            var b = a("#tiptip_holder");
            var d = a("#tiptip_content");
            var f = a("#tiptip_arrow")
        }
        return this.each(function () {
            var i = a(this);
            var l = "";
            b.css("max-width", e.maxWidth);
            if (i.attr(e.attribute) != undefined && i.attr(e.attribute) != "") {
                l = i.attr(e.attribute);
                i.removeAttr(e.attribute)
            } else {
                if (i.data("idtooltip") != undefined) {
                    $content = a("#" + i.data("idtooltip"));
                    l = $content.html();
                    $content.remove();
                    e.keepAlive = true
                }
            }if (l != "") {
                if (!e.content) {
                    i.removeAttr(e.attribute)
                }
                var h = false;
                a.fn.toolTipOver = false;
                if (e.activation == "hover") {
                    i.hover(function () {
                        a.fn.toolTipOver = true;
                        k()
                    }, function () {
                        a.fn.toolTipOver = false;
                        if (!e.keepAlive) {
                            j()
                        } else {
                            setTimeout(function () {
                                if (!a.fn.toolTipOver) {
                                    j()
                                }
                            }, e.delay)
                        }
                    });
                    if (e.keepAlive) {
                        b.hover(function () {
                            a.fn.toolTipOver = true
                        }, function () {
                            a.fn.toolTipOver = false;
                            j()
                        })
                    }
                } else {
                    if (e.activation == "focus") {
                        i.focus(function () {
                            k()
                        }).blur(function () {
                            j()
                        })
                    } else {
                        if (e.activation == "click") {
                            i.click(function () {
                                k();
                                return false
                            }).hover(function () {},
                                function () {
                                    if (!e.keepAlive) {
                                        j()
                                    }
                                });
                            if (e.keepAlive) {
                                b.hover(function () {}, function () {
                                    j()
                                })
                            }
                        }
                    }
                }

                function k() {
                    e.enter.call(this);
                    d.html(l);
                    b.hide().removeAttr("class").css("margin", "0");
                    f.removeAttr("style");
                    var y = parseInt(i.offset()["top"]);
                    var p = parseInt(i.offset()["left"]);
                    var v = parseInt(i.outerWidth());
                    var A = parseInt(i.outerHeight());
                    var x = b.outerWidth();
                    var s = b.outerHeight();
                    var w = Math.round((v - x) / 2);
                    var o = Math.round((A - s) / 2);
                    var n = Math.round(p + w);
                    var m = Math.round(y + A + e.edgeOffset);
                    var t = "";
                    var C = "";
                    var u = Math.round(x - 12) / 2;
                    if (e.defaultPosition == "bottom") {
                        t = "_bottom"
                    } else {
                        if (e.defaultPosition == "top") {
                            t = "_top"
                        } else {
                            if (e.defaultPosition == "left") {
                                t = "_left"
                            } else {
                                if (e.defaultPosition == "right") {
                                    t = "_right"
                                }
                            }
                        }
                    }
                    var r = (w + p) < parseInt(a(window).scrollLeft());
                    var q = (x + p) > parseInt(a(window).width());
                    if ((r && w < 0) || (t == "_right" && !q) || (t == "_left" && p < (x + e.edgeOffset + 5))) {
                        t = "_right";
                        C = Math.round(s - 13) / 2;
                        u = -6;
                        n = Math.round(p + v + e.edgeOffset);
                        m = Math.round(y + o)
                    } else {
                        if ((q && w < 0) || (t == "_left" && !r)) {
                            t = "_left";
                            C = Math.round(s - 13) / 2;
                            u = Math.round(x);
                            n = Math.round(p - (x + e.edgeOffset + 5));
                            m = Math.round(y + o)
                        }
                    }
                    var z = (y + A + e.edgeOffset + s + 8) > parseInt(a(window).height() + a(window).scrollTop());
                    var B = ((y + A) - (e.edgeOffset + s + 8)) < 0;
                    if (z || (t == "_bottom" && z) || (t == "_top" && !B)) {
                        if (t == "_top" || t == "_bottom") {
                            t = "_top"
                        } else {
                            t = t + "_top"
                        }
                        C = s;
                        m = Math.round(y - (s + 5 + e.edgeOffset))
                    } else {
                        if (B | (t == "_top" && B) || (t == "_bottom" && !z)) {
                            if (t == "_top" || t == "_bottom") {
                                t = "_bottom"
                            } else {
                                t = t + "_bottom"
                            }
                            C = -6;
                            m = Math.round(y + A + e.edgeOffset)
                        }
                    }if (t == "_right_top" || t == "_left_top") {
                        m = m + 5
                    } else {
                        if (t == "_right_bottom" || t == "_left_bottom") {
                            m = m - 5
                        }
                    }if (t == "_left_top" || t == "_left_bottom") {
                        n = n + 5
                    }
                    f.css({
                        "margin-left": u + "px",
                        "margin-top": C + "px"
                    });
                    b.css({
                        "margin-left": n + "px",
                        "margin-top": m + "px"
                    }).attr("class", "tip" + t);
                    if (h) {
                        clearTimeout(h)
                    }
                    h = setTimeout(function () {
                        b.stop(true, true).fadeIn(e.fadeIn)
                    }, e.delay)
                }

                function j() {
                    e.exit.call(this);
                    if (h) {
                        clearTimeout(h)
                    }
                    b.fadeOut(e.fadeOut)
                }
            }
        })
    }
})(jQuery);


/*! MsgBox - jQuery plugin 
 * Copyright 2011, Halil Ä°brahim Kalyoncu
 * License: BSD
 * Modified by Oliver Kopp, 2012
 * Modified by Romel Perez, 2013
 **/
(function () {
    jQuery.msgBox = function (f) {
    	var overflow;
        var z = window.top ? window.top : window;
        var m = "/eisi/images/Estandar/Mensajes/";
        var d = false;
        var C = typeof f;
        var t = {
            content: (C == "string" ? f : ""),
            title: "Alerta",
            type: "alert",
            autoClose: false,
            timeOut: 0,
            showButtons: true,
            buttons: [{
                value: "Ok",
                click: function(){}
            }],
            success: function (G) {},
            beforeShow: function () {},
            afterShow: function () {},
            beforeClose: function () {},
            afterClose: function () {},
            opacity: 0.3
        };
        var i = $("*:focus");
        f = C == "string" ? t : f;
        if (f.type != null) {
            switch (f.type) {
            case "alert":
                f.title = f.title == null ? "Alerta" : f.title;
                break;
            case "info":
                f.title = f.title == null ? "Informaci&oacute;n" : f.title;
                break;
            case "error":
                f.title = f.title == null ? "Error" : f.title;
                break;
            case "confirm":
                f.title = f.title == null ? "Confirmaci&oacute;n" : f.title;
                f.buttons = f.buttons == null ? [{
                    value: "S&iacute;",
                    click: function(){}
                }, {
                    value: "No",
                    click: function(){}
                }, {
                    value: "Cancelar",
                    click: function(){}
                }] : f.buttons;
                break;
            default:
                x = "alert.png"
            }
        }
        f.timeOut = f.timeOut == null ? (f.content == null ? 500 : f.content.length * 70) : f.timeOut;
        f = $.extend(t, f);
        if (f.autoClose) {
            setTimeout(u, f.timeOut)
        }
        var x = "";
        f.btype = "";
        switch (f.type) {
        case "alert":
            x = "alert.png";
            f.btype = "naranja";
            break;
        case "info":
            x = "info.png";
            f.btype = "celeste";
            break;
        case "error":
            x = "error.png";
            f.btype = "rojo";
            break;
        case "confirm":
            x = "confirm.png";
            f.btype = "verde";
            break;
        default:
            x = "alert.png";
            f.btype = "naranja"
        }
        var n = "msgBox" + new Date().getTime();
        var F = n;
        var s = n + "Content";
        var o = n + "Image";
        var y = n + "Buttons";
        var q = n + "BackGround";
        var B = $("");
        $.map(f.buttons, function(v, i){
        	B = B.add($("<button>", {
        		'css': {
        			'font-weight': 'bold',
        			'font-size': '14px'
        		},
        		'class': 'msgButton boton '+ f.btype,
        		'html': v.value,
        		'click': v.click
        	}));
        });
        var v = $("<div>", {'id': q, 'class': 'msgBoxBackGround'});
        var p = $("<div>", {'class': 'msgBoxTitle', 'html': f.title});
        var j = $("<div>", {
        	'id': o,
        	'class': 'msgBoxContainer',
        	'html': $("<div>", {
        		'class': 'msgBoxImage',
        		'html': '<img src="' + m + x + '"/>'
    		}).add("<div>", {
    			'id': s,
    			'class': 'msgBoxContent',
    			'html': '<p><span>' + f.content + '</span></p>'
    		})
        });
        var e = $("<div>", {'id': y, 'class': 'msgBoxButtons', 'html': B});
        var a = $("<div>", {'class': 'msgBoxInputs'});
        var l;
        var h;
        var b;
        var k;
        var c;
        z.$("body").append(v).append($("<div>", {
        	'id': F,
        	'class': 'msgBox',
        	'html': p.add($("<div>", {
        		'html': j.add( (f.showButtons ? e : "") )
        	}))
        }));
        l = z.$("#" + F);
        h = z.$("#" + s);
        b = z.$("#" + o);
        k = z.$("#" + y);
        c = z.$("#" + q);
        var A = [],
            w, g;

        function D() {
            var H = l.width();
            var G = l.height();
            if (typeof z.innerWidth != "undefined") {
                A = [z.innerWidth, z.innerHeight]
            } else {
                if (typeof z.document.documentElement != "undefined" && typeof z.document.documentElement.clientWidth != "undefined" && z.document.documentElement.clientWidth != 0) {
                    A = [z.document.documentElement.clientWidth, z.document.documentElement.clientHeight]
                } else {
                    A = [z.document.getElementsByTagName("body")[0].clientWidth, z.document.getElementsByTagName("body")[0].clientHeight]
                }
            }
            w = A[1] / 2 - G / 2;
            g = A[0] / 2 - H / 2;
            if (G >= A[1]) {
                w = 0
            }
            if (H >= A[0]) {
                g = 0
            }
            l.css({
                top: w,
                left: g
            });
            c.css({
                width: A[0]
            })
        }
        D();
        $(window).on("resize", D);

        function E() {
            if (d) {
                return
            }
            l.css({
                opacity: 0,
                top: w - 50,
                left: g
            });
            c.css({
                opacity: f.opacity
            });
            $(k).find("button").focus();
            f.beforeShow();
            c.css({
                width: A[0],
                height: r()
            });
            $(F + "," + q).fadeIn(0);
            l.animate({
                opacity: 1,
                top: w,
                left: g
            }, 200);
        	overflow = z.$('body').css('overflow');
			z.$('body').css('overflow', 'hidden');
            setTimeout(f.afterShow, 200);
            d = true
        }

        function u() {
            if (!d) {
                return
            }
            i.focus();
            f.beforeClose();
            l.animate({
                opacity: 0,
                top: w - 50,
                left: g
            }, 200);
            c.fadeOut(300);
            l.remove();
            c.remove();
            z.$('body').css('overflow', overflow);
            f.afterClose();
            d = false
        }

        function r() {
            var G = z.document;
            return Math.max(Math.max(G.body.scrollHeight, G.documentElement.scrollHeight), Math.max(G.body.offsetHeight, G.documentElement.offsetHeight), Math.max(G.body.clientHeight, G.documentElement.clientHeight))
        }
        z.$("button.msgButton").on("click", function (G) {
            G.preventDefault();
            f.success($(this).html());
            u()
        });
        c.on("click", function (G) {
            if (!f.showButtons || f.autoClose) {
                u()
            } else {
                l.fadeOut(200).fadeIn(200)
            }
        });
        E()
    }
    // Override
	alert = function(t, c){
	    var config = {"content": t};
	    if( typeof c == "object" )
	    	$.extend( config, c );
	    $.msgBox(config);
	};
}());


/*! EModal jQuery Plugin
 * Version 0.5 - Updated: Sepember 20, 2013
 * Created by Duvan Jamid Vargas, @DuvanJamid and Romel Perez; @prhonedev
 * This jQuery plug-in is licensed under the MIT:
 * http://www.opensource.org/licenses/mit-license.php
 **/
(function($){
    eModal = function(data){

		// Configuration
    	var WIN = window.top;
		var EMODAL = {};

		EMODAL.config = $.extend({
		    container: null,
		    url: '',
		    title: 'EModal Title',
		    emodalWidth: 600,
		    emodalContentHeight: 300,
		    delay: 100,
		    fadeIn: 500,
		    fadeOut: 500,
		    onEscKeyClose: true,
		    onOpen: function(){},
		    onClose: function(){},
		    buttons: [
		        {
		            btnId: 'emodal_hide',
		            btnClass: 'emodal_hide',  // emodal_hide, clase que se utiliza para cerrar
		            btnText: 'Cerrar',
		            btnColor: 'rojo',  // verde | rojo | azul | azuloscuro | naranja | celeste | negro 
		            btnPosition: 'right',  // right | left | center
		            btnClick: function(){}
		        }
		    ]
		}, data);
		EMODAL.container = typeof(EMODAL.config.container) == 'string' ? $('#'+ EMODAL.config.container) : EMODAL.config.container;
		EMODAL.url = EMODAL.config.url == '' ? false : true;

		// Create or Recreate the emodal structure
		EMODAL.structure = function(){
			var config = EMODAL.config;

			// Initialization
            if(WIN.eModalElement)
            	WIN.eModalElement.remove();

            var emodal_hold = $('<div/>', {
                id: 'emodal_hold',
                'class': 'emodal_hold hide'
            });
            var emodal = $('<div/>', {
                id: 'emodal',
                'class': 'emodal hide'
            });
            var emodal_header_elements = $('<button/>', {
                id: 'emodal_close',
                'class': 'emodal_close emodal_hide',
                type: 'button',
        		html: '&times;',
        		title: 'Presione Esc para cerrar',
        		toolTip: {
            		defaultPosition: 'bottom'
        		}
            }).add('<h3/>', {
                id: 'emodal_title',
                'class': 'emodal_title'
            });
            var emodal_header = $('<div/>', {
                id: 'emodal_header',
                'class': 'emodal_header',
                html: emodal_header_elements
            });
            var emodal_footer = $('<div/>', {
                id: 'emodal_footer',
                'class': 'emodal_footer'
            });
            if(EMODAL.url){
                var emodal_content = $('<iframe/>', {
                    id: 'emodal_content',
                    'class': 'emodal_content emodal_content_url'
                });
            }else{
                var emodal_content = $('<div/>', {
                    id: 'emodal_content',
                    'class': 'emodal_content'
                });
            }

            emodal.html(emodal_header).append(emodal_content).append(emodal_footer);
            WIN.$("body").after(emodal_hold.html(emodal));

			// Save cache
            EMODAL.emodal = WIN.eModalElement = emodal_hold;


			// Apply configuration and chache variables
			emodal_header.find("#emodal_title").html(config.title);
	        emodal.css('width', config.emodalWidth);
	        emodal_content.css('height', config.emodalContentHeight);
	        if(EMODAL.url){
	            emodal_content.attr('src', config.url);
	        }else{
	            emodal_content.html(EMODAL.container.html());
	        }
	        emodal_footer.empty();
	        $.each(config.buttons, function(i, item) {
	            item.btnPosition = item.btnPosition == 'center' ? 'none' : item.btnPosition;
	            var boton = $('<button/>', {
	                id: item.btnId,
	                'class': 'boton '+ item.btnClass +' '+ item.btnColor,
	                text: item.btnText,
	                css: {
	                    'float': item.btnPosition
	                },
	                'click': item.btnClick
	            });
	            emodal_footer.append(boton);
	        });


	        // Others functionalities
	        emodal.find('.emodal_hide').on('click', EMODAL.hide);
	        if(config.onEscKeyClose){
	            $(document).on('keydown', function(e){
	                if(e.which == 27)
	                    EMODAL.hide();
	            });
	        }
		};

		// Fit the eModal centered on window
        EMODAL.autoPosition = function(){
            var emodal = EMODAL.emodal.find('#emodal');
            var dim = Elise.win.dims();
            var _width = emodal.outerWidth()/2;
            _width = _width > (dim.width/2) ? -(dim.width/2)+20 : -_width;
            var _height = dim.height/2 - emodal.outerHeight()/2;
            _height = _height < 10 ? 10 : _height;
            emodal.css({
                'margin-left': _width,
                'margin-top': _height
            });
        };

        // Structure and show the eModal
        EMODAL.show = function(){
    		if(!EMODAL.showed){
	        	EMODAL.overflow = WIN.$('body').css('overflow');
				WIN.$('body').css('overflow', 'hidden');
	        	setTimeout(function(){
	        		EMODAL.structure();
		        	EMODAL.emodal.fadeIn(EMODAL.config.fadeIn);
		        	EMODAL.autoPosition();
	        		EMODAL.config.onOpen();
	        		EMODAL.showed = true;
	        	}, EMODAL.config.delay);
    		}
        };

        // Hide the eModal
        EMODAL.hide = function(){
    		if(EMODAL.showed){
	        	setTimeout(function(){
		        	EMODAL.emodal.fadeOut(EMODAL.config.fadeOut);
	        		EMODAL.config.onClose();
	        		EMODAL.showed = false;
					WIN.$('body').css('overflow', EMODAL.overflow);
	        	}, EMODAL.config.delay);
    		}
        };

        // Start
        $(WIN).on('resize', function(){
            if(!EMODAL.emodal.is(":visible"))
                return;
            EMODAL.autoPosition();
        });
        EMODAL.showed = false;
        EMODAL.show();
        
        return EMODAL;

    };
})(jQuery);


/*! iCheck v0.9.1
 * http://git.io/uhUPMA
 * (c) 2013 Damir Foy, http://damirfoy.com
 * MIT Licensed
 **/
(function ($) {

    // Cached vars
    var _iCheck = 'iCheck',
        _iCheckHelper = _iCheck + '-helper',
        _checkbox = 'checkbox',
        _radio = 'radio',
        _checked = 'checked',
        _unchecked = 'un' + _checked,
        _disabled = 'disabled',
        _determinate = 'determinate',
        _indeterminate = 'in' + _determinate,
        _update = 'update',
        _type = 'type',
        _click = 'click',
        _touch = 'touchbegin.i touchend.i',
        _add = 'addClass',
        _remove = 'removeClass',
        _callback = 'trigger',
        _label = 'label',
        _cursor = 'cursor',
        _mobile = /ipad|iphone|ipod|android|blackberry|windows phone|opera mini|silk/i.test(navigator.userAgent);

    // Plugin init
    $.fn[_iCheck] = function (options, fire) {

        // Walker
        var handle = ':' + _checkbox + ', :' + _radio,
            stack = $(),
            walker = function (object) {
                object.each(function () {
                    var self = $(this);

                    if (self.is(handle)) {
                        stack = stack.add(self);
                    } else {
                        stack = stack.add(self.find(handle));
                    };
                });
            };

        // Check if we should operate with some method
        if (/^(check|uncheck|toggle|indeterminate|determinate|disable|enable|update|destroy)$/i.test(options)) {

            // Normalize method's name
            options = options.toLowerCase();

            // Find checkboxes and radio buttons
            walker(this);

            return stack.each(function () {
                if (options == 'destroy') {
                    tidy(this, 'ifDestroyed');
                } else {
                    operate($(this), true, options);
                };

                // Fire method's callback
                if ($.isFunction(fire)) {
                    fire();
                };
            });

            // Customization
        } else if (typeof options == 'object' || !options) {

            // Check if any options were passed
            var settings = $.extend({
			    checkboxClass: 'icheckbox_minimal-blue',
			    radioClass: 'iradio_minimal-blue',
                checkedClass: _checked,
                disabledClass: _disabled,
                indeterminateClass: _indeterminate,
                labelHover: true
            }, options),

                selector = settings.handle,
                hoverClass = settings.hoverClass || 'hover',
                focusClass = settings.focusClass || 'focus',
                activeClass = settings.activeClass || 'active',
                labelHover = !! settings.labelHover,
                labelHoverClass = settings.labelHoverClass || 'hover',

                // Setup clickable area
                area = ('' + settings.increaseArea).replace('%', '') | 0;

            // Selector limit
            if (selector == _checkbox || selector == _radio) {
                handle = ':' + selector;
            };

            // Clickable area limit
            if (area < -50) {
                area = -50;
            };

            // Walk around the selector
            walker(this);

            return stack.each(function () {

                // If already customized
                tidy(this);

                var self = $(this),
                    node = this,
                    id = node.id,

                    // Layer styles
                    offset = -area + '%',
                    size = 100 + (area * 2) + '%',
                    layer = {
                        position: 'absolute',
                        top: offset,
                        left: offset,
                        display: 'block',
                        width: size,
                        height: size,
                        margin: 0,
                        padding: 0,
                        background: '#fff',
                        border: 0,
                        opacity: 0
                    },

                    // Choose how to hide input
                    hide = _mobile ? {
                        position: 'absolute',
                        visibility: 'hidden'
                    } : area ? layer : {
                        position: 'absolute',
                        opacity: 0
                    },

                    // Get proper class
                    className = node[_type] == _checkbox ? settings.checkboxClass || 'i' + _checkbox : settings.radioClass || 'i' + _radio,

                    // Find assigned labels
                    label = $(_label + '[for="' + id + '"]').add(self.closest(_label)),

                    // Wrap input
                    parent = self.wrap('<div class="' + className + '"/>')[_callback]('ifCreated').parent().append(settings.insert),

                    // Layer addition
                    helper = $('<ins class="' + _iCheckHelper + '"/>').css(layer).appendTo(parent);

                // Finalize customization
                self.data(_iCheck, {
                    o: settings,
                    s: self.attr('style')
                }).css(hide);!! settings.inheritClass && parent[_add](node.className);!! settings.inheritID && id && parent.attr('id', _iCheck + '-' + id);
                parent.css('position') == 'static' && parent.css('position', 'relative');
                operate(self, true, _update);

                // Label events
                if (label.length) {
                    label.on(_click + '.i mouseenter.i mouseleave.i ' + _touch, function (event) {
                        var type = event[_type],
                            item = $(this);

                        // Do nothing if input is disabled
                        if (!node[_disabled]) {

                            // Click
                            if (type == _click) {
                                operate(self, false, true);

                                // Hover state
                            } else if (labelHover) {

                                // mouseleave|touchend
                                if (/ve|nd/.test(type)) {
                                    parent[_remove](hoverClass);
                                    item[_remove](labelHoverClass);
                                } else {
                                    parent[_add](hoverClass);
                                    item[_add](labelHoverClass);
                                };
                            };

                            if (_mobile) {
                                event.stopPropagation();
                            } else {
                                return false;
                            };
                        };
                    });
                };

                // Input events
                self.on(_click + '.i focus.i blur.i keyup.i keydown.i keypress.i', function (event) {
                    var type = event[_type],
                        key = event.keyCode;

                    // Click
                    if (type == _click) {
                        return false;

                        // Keydown
                    } else if (type == 'keydown' && key == 32) {
                        if (!(node[_type] == _radio && node[_checked])) {
                            if (node[_checked]) {
                                off(self, _checked);
                            } else {
                                on(self, _checked);
                            };
                        };

                        return false;

                        // Keyup
                    } else if (type == 'keyup' && node[_type] == _radio) {
                        !node[_checked] && on(self, _checked);

                        // Focus/blur
                    } else if (/us|ur/.test(type)) {
                        parent[type == 'blur' ? _remove : _add](focusClass);
                    };
                });

                // Helper events
                helper.on(_click + ' mousedown mouseup mouseover mouseout ' + _touch, function (event) {
                    var type = event[_type],

                        // mousedown|mouseup
                        toggle = /wn|up/.test(type) ? activeClass : hoverClass;

                    // Do nothing if input is disabled
                    if (!node[_disabled]) {

                        // Click
                        if (type == _click) {
                            operate(self, false, true);

                            // Active and hover states
                        } else {

                            // State is on
                            if (/wn|er|in/.test(type)) {

                                // mousedown|mouseover|touchbegin
                                parent[_add](toggle);

                                // State is off
                            } else {
                                parent[_remove](toggle + ' ' + activeClass);
                            };

                            // Label hover
                            if (label.length && labelHover && toggle == hoverClass) {

                                // mouseout|touchend
                                label[/ut|nd/.test(type) ? _remove : _add](labelHoverClass);
                            };
                        };

                        if (_mobile) {
                            event.stopPropagation();
                        } else {
                            return false;
                        };
                    };
                });
            });
        } else {
            return this;
        };
    };

    // Do something with inputs
    function operate(input, direct, method) {
        var node = input[0];
        state = /er/.test(method) ? _indeterminate : /bl/.test(method) ? _disabled : _checked,
        active = method == _update ? {
            checked: node[_checked],
            disabled: node[_disabled],
            indeterminate: input.attr(_indeterminate) == 'true' || input.attr(_determinate) == 'false'
        } : node[state];

        // Check, disable or indeterminate
        if (/^(ch|di|in)/.test(method) && !active) {
            on(input, state);

            // Uncheck, enable or determinate
        } else if (/^(un|en|de)/.test(method) && active) {
            off(input, state);

            // Update
        } else if (method == _update) {

            // Handle states
            for (var state in active) {
                if (active[state]) {
                    on(input, state, true);
                } else {
                    off(input, state, true);
                };
            };

        } else if (!direct || method == 'toggle') {

            // Helper or label was clicked
            if (!direct) {
                input[_callback]('ifClicked');
            };

            // Toggle checked state
            if (active) {
                if (node[_type] !== _radio) {
                    off(input, state);
                };
            } else {
                on(input, state);
            };
        };
    };

    // Add checked, disabled or indeterminate state
    function on(input, state, keep) {
        var node = input[0],
            parent = input.parent(),
            checked = state == _checked,
            indeterminate = state == _indeterminate,
            callback = indeterminate ? _determinate : checked ? _unchecked : 'enabled',
            regular = option(node, callback + capitalize(node[_type])),
            specific = option(node, state + capitalize(node[_type]));

        // Prevent unnecessary actions
        if (node[state] !== true) {

            // Toggle assigned radio buttons
            if (!keep && state == _checked && node[_type] == _radio && node.name) {
                var form = input.closest('form'),
                    inputs = 'input[name="' + node.name + '"]';

                inputs = form.length ? form.find(inputs) : $(inputs);

                inputs.each(function () {
                    if (this !== node && $.data(this, _iCheck)) {
                        off($(this), state);
                    };
                });
            };

            // Indeterminate state
            if (indeterminate) {

                // Add indeterminate state
                node[state] = true;

                // Remove checked state
                if (node[_checked]) {
                    off(input, _checked, 'force');
                };

                // Checked or disabled state
            } else {

                // Add checked or disabled state
                if (!keep) {
                    node[state] = true;
                };

                // Remove indeterminate state
                if (checked && node[_indeterminate]) {
                    off(input, _indeterminate, false);
                };
            };

            // Trigger callbacks
            callbacks(input, checked, state, keep);
        };

        // Add proper cursor
        if (node[_disabled] && !! option(node, _cursor, true)) {
            parent.find('.' + _iCheckHelper).css(_cursor, 'default');
        };

        // Add state class
        parent[_add](specific || option(node, state));

        // Remove regular state class
        parent[_remove](regular || option(node, callback) || '');
    };

    // Remove checked, disabled or indeterminate state
    function off(input, state, keep) {
        var node = input[0],
            parent = input.parent(),
            checked = state == _checked,
            indeterminate = state == _indeterminate,
            callback = indeterminate ? _determinate : checked ? _unchecked : 'enabled',
            regular = option(node, callback + capitalize(node[_type])),
            specific = option(node, state + capitalize(node[_type]));

        // Prevent unnecessary actions
        if (node[state] !== false) {

            // Toggle state
            if (indeterminate || !keep || keep == 'force') {
                node[state] = false;
            };

            // Trigger callbacks
            callbacks(input, checked, callback, keep);
        };

        // Add proper cursor
        if (!node[_disabled] && !! option(node, _cursor, true)) {
            parent.find('.' + _iCheckHelper).css(_cursor, 'pointer');
        };

        // Remove state class
        parent[_remove](specific || option(node, state) || '');

        // Add regular state class
        parent[_add](regular || option(node, callback));
    };

    // Remove all traces
    function tidy(node, callback) {
        if ($.data(node, _iCheck)) {
            var input = $(node);

            // Remove everything except input
            input.parent().html(input.attr('style', $.data(node, _iCheck).s || '')[_callback](callback || ''));

            // Unbind events
            input.off('.i').unwrap();
            $(_label + '[for="' + node.id + '"]').add(input.closest(_label)).off('.i');
        };
    };

    // Get some option
    function option(node, state, regular) {
        if ($.data(node, _iCheck)) {
            return $.data(node, _iCheck).o[state + (regular ? '' : 'Class')];
        };
    };

    // Capitalize some string
    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    // Executable handlers
    function callbacks(input, checked, callback, keep) {
        if (!keep) {
            if (checked) {
                input[_callback]('ifToggled');
            };

            input[_callback]('ifChanged')[_callback]('if' + capitalize(callback));
        };
    };
})(jQuery);


/*! Elise Library
 * Configurations and Interfaces
 * Main Functionalities
 * Created by Romel Perez
 * September 2013
 **/
// Resources
function utf8_encode(a){if(a===null||typeof a==="undefined"){return""}var i=(a+"");var j="",b,e,c=0;b=e=0;c=i.length;for(var d=0;d<c;d++){var h=i.charCodeAt(d);var g=null;if(h<128){e++}else{if(h>127&&h<2048){g=String.fromCharCode((h>>6)|192,(h&63)|128)}else{if(h&63488!=55296){g=String.fromCharCode((h>>12)|224,((h>>6)&63)|128,(h&63)|128)}else{if(h&64512!=55296){throw new RangeError("Unmatched trail surrogate at "+d)}var f=i.charCodeAt(++d);if(f&64512!=56320){throw new RangeError("Unmatched lead surrogate at "+(d-1))}h=((h&1023)<<10)+(f&1023)+65536;g=String.fromCharCode((h>>18)|240,((h>>12)&63)|128,((h>>6)&63)|128,(h&63)|128)}}}if(g!==null){if(e>b){j+=i.slice(b,e)}j+=g;b=e=d+1}}if(e>b){j+=i.slice(b,c)}return j};
function utf8_decode(a){var d=[],f=0,h=0,g=0,e=0,c=0,b=0;a+="";while(f<a.length){g=a.charCodeAt(f);if(g<=191){d[h++]=String.fromCharCode(g);f++}else{if(g<=223){e=a.charCodeAt(f+1);d[h++]=String.fromCharCode(((g&31)<<6)|(e&63));f+=2}else{if(g<=239){e=a.charCodeAt(f+1);c=a.charCodeAt(f+2);d[h++]=String.fromCharCode(((g&15)<<12)|((e&63)<<6)|(c&63));f+=3}else{e=a.charCodeAt(f+1);c=a.charCodeAt(f+2);b=a.charCodeAt(f+3);g=((g&7)<<18)|((e&63)<<12)|((c&63)<<6)|(b&63);g-=65536;d[h++]=String.fromCharCode(55296|((g>>10)&1023));d[h++]=String.fromCharCode(56320|(g&1023));f+=4}}}}return d.join("")};
function replaceAll(text,busca,reemplaza){while(text.toString().indexOf(busca)!=-1){text=text.toString().replace(busca,reemplaza)}return text};
// Tablesorter Interface
jQuery.fn.tbst = jQuery.fn.tablesorter;
jQuery.fn.tablesorter = function(args){
	jQuery(this).each(function(){
		if( jQuery(this).find("tbody tr").length >= 1 )
			jQuery(this).tbst(args);
	});
}
// CKEditor
jQuery.fn.ckeditor = function(t, c){
	if( typeof(CKEDITOR) == "undefined" )
		return;
    if( t == "contenido" ){
        if( c && typeof c == "string" )
            CKEDITOR.instances[ $(this).attr("id") ].setData( c );
        else
            return CKEDITOR.instances[ $(this).attr("id") ].getData();
        return this;
    }
    else if( t == "text" ){
    	var content = CKEDITOR.instances[ $(this).attr("id") ].getData();
    	elem = document.createElement("div");
    	elem.innerHTML = content;
    	return elem.textContent;
    }
    else if( t == "isEmpty" ){
    	var content = CKEDITOR.instances[ $(this).attr("id") ].getData();
    	elem = document.createElement("div");
    	elem.innerHTML = content;
    	// If there are 2 or more characters
    	var re = new RegExp("[a-zA-Z0-9]{2,}");
    	return !re.test(elem.textContent);
    }
    else if( t == "focus" ){
    	CKEDITOR.instances[ $(this).attr("id") ].fire("beforeFocus");
    }
    $(this).each(function(){
        var config = {};
        c = ( c && typeof(c) == "object" ) ? c : {};
        if( t == "vacio" )       $.extend( config, ckeditor.editorConfigEmpty, c );
        else if( t == "full" )   $.extend( config, ckeditor.editorConfigFull, c );
        else if( t == "imagen" ) $.extend( config, ckeditor.editorConfigImg, c );
        else                     $.extend( config, ckeditor.editorConfigNormal, c );
        var editor = CKEDITOR.replace( $(this)[0], config );
        // Focus when its loaded
        if(config.focus){
			editor.on('instanceReady', function(){
			    editor.fire("beforeFocus");
			});
        }
    });
    return this;
};
(function($){$(document).on("ready",function(){
    
    // Boton Toggle
    $(".boton.boton-toggle,.btn.boton-toggle").on("click", function(){
        $(this).toggleClass("active");
    });

    // Apilables Toggle
    $("ul.nav-stacked li").on("click", function(){
        // Elementos
        var t = $(this),
            a = t.find("a"),
            l = t.parent().find("li");
        
        // Activar y desactivar
        l.removeClass("active");
        t.addClass("active");
        
        // Determinar enlace
        if( a.attr("href") == "#" ) return false;
        else return true;
    });
    
    // Pagination variables
    var pagf = $(".pagination li:first").data("pagid", "first");
    var pagl = $(".pagination li:last").data("pagid", "last");
    
    // Pagination Toggle
    $(".pagination li, .pagination li").not(":first, :last").on("click", function(){
        // Elementos
        var t = $(this),
            a = t.find("a"),
            c = t.parent().find("li"),
            l = c.slice( 1, t.parent().find("li").length-1 );
        
        // Desactivar/Activar .active
        l.removeClass("active");
        c.removeClass("disabled");
        t.addClass("active");
        
        // Determinar inicial y final
        if( t.prev().data("pagid") == "first" ) t.prev().addClass("disabled");
        else if( t.next().data("pagid") == "last" ) t.next().addClass("disabled");
        
        // Determinar enlace
        if( a.attr("href") == "#" ) return false;
        else return true;
    });

    // Pagination "back"
    $(".pagination li:first").on("click", function(){
        var t = $(this);
        
        if( !pagf.hasClass("disabled") )
            t.parent().find("li.active").prev().click();
        
        if( t.find("a").attr("href") == "#" ) return false;
        else return true;
    });

    // Pagination "forward"
    $(".pagination li:last").on("click", function(){
        var t = $(this);
        
        if( !pagl.hasClass("disabled") )
            t.parent().find("li.active").next().click();
        
        if( t.find("a").attr("href") == "#" ) return false;
        else return true;               
    });

});}(jQuery));
/* Core Object */
Elise = {};
Elise.init = function(){
	$(document).ready(function(){
		var self, value;
		// Validators
		var val = function($input, validator){
			$input.on('keyup', function(){
				if(validator($input.val()))
					$input.removeClass('invalid').addClass('valid');
				else
					$input.removeClass('valid').addClass('invalid');
			});
		}
		$('input[type=text]').each(function(){
			self = $(this);
			value = self.data('val');
			if(value == undefined  ||  value == '')
				return;
			// Email
			if(value == 'email')
				val(self, Elise.val.email);
			// Number
			else if(value == 'number')
				val(self, Elise.val.number);
			// Account
			else if(value  &&  value.indexOf('account') >= 0){
				var account = value.replace('account','').replace('(','').replace(')','');
				var starts = account.split(',')[0] ? account.split(',')[0] : Elise.val.accountInit;
				var ends = account.split(',')[1] ? account.split(',')[1] : Elise.val.accountEnds;
				val(self, function(text){
					return Elise.val.account(text, starts, ends);
				});
			}
			// Text
			else if(value == 'text')
				val(self, Elise.val.text);
			// Words
			else if(value == 'words')
				val(self, Elise.val.words);
		});
		// iCkeck
		$('input[type=checkbox], input[type=radio]').each(function(){
			if( $(this).data('visual') == 'yes' )
				$(this).iCheck()
				.on('ifClicked', function(){$(this).trigger('click')})
				.on('ifChecked', function(){$(this).trigger('change')})
				.on('ifUnchecked', function(){$(this).trigger('change')});
		});
	});
};
Elise.init();
Elise.val = {

	// dot, comma, whitespace, letters, numbers
	textSecure: "., áéíóúabcdefghijklmnñopqrstuvwxyz0123456789",
	wordsSecure: "., áéíóúabcdefghijklmnñopqrstuvwxyz",

	email: function(text){
		if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(text)) return true;
		return false;
	},

	number: function(text){
		return $.isNumeric(text);
	},

	accountInit: 6,
	accountEnds: 15,
	account: function(text, starts, ends){
		starts = starts ? starts : Elise.val.accountInit;
		ends = ends ? ends : Elise.val.accountEnds;
		var re = new RegExp("^[0-9a-zA-Z\*]{"+ starts +","+ ends +"}$");
		if(re.test(text)) return true;
		return false;
	},

	text: function(text){
		for(var i=0; i<text.length; i++)
			if(utf8_decode(Elise.val.textSecure).indexOf(text.charAt(i).toLowerCase()) == -1)
				return false;
		return true;
	},

	words: function(text){
		for(var i=0; i<text.length; i++)
			if(utf8_decode(Elise.val.wordsSecure).indexOf(text.charAt(i).toLowerCase()) == -1)
				return false;
		return true;
	},

	filename: function(text){
		var text = text.toLowerCase();
		text = replaceAll(text,utf8_decode("á"),"a");
		text = replaceAll(text,utf8_decode("é"),"e");
		text = replaceAll(text,utf8_decode("í"),"i");
		text = replaceAll(text,utf8_decode("ó"),"o");
		text = replaceAll(text,utf8_decode("ú"),"u");
		text = replaceAll(text,utf8_decode("á"),"a");
		text = replaceAll(text,utf8_decode("ñ"),"n");
		text = replaceAll(text," ", "_");
		text = replaceAll(text,"'", "");
		text = replaceAll(text,utf8_decode("´"), "");
		text = replaceAll(text,",", "");
		text = replaceAll(text,utf8_decode("¨"), "");
		text = replaceAll(text,":", "");
		text = replaceAll(text,";", "");
		return text;
	}

};
Elise.win = {

	// Reset the height of the iframe by its content height
	// @level = { top | top2 | self }
	fitIframe: function(iframe, level, min, plus){
		if(level == undefined  ||  level == 'self')
			level = window;
		else if(level == 'top')
			level = window.parent;
		else if(level == 'top2')
			level = window.parent.parent;

		if(typeof(iframe) == "string")
			iframe = level.document.getElementById(iframe);
		min = Elise.val.number(min) ? min : 300;
		plus = Elise.val.number(plus) ? plus : 0;
		$(iframe).height('auto');

		var win = {
			scroll: $(window.top).scrollTop(),  // Actual window scroll
			height: Elise.win.contentHeight(iframe),  // Content height in the iframe
			res: 0  // Total height to apply
		};
		
		win.res = win.height > min ? win.height : min;

		$(iframe).add($(iframe).parent('.centro')).height(win.res + plus);

		$(window.top).scrollTop(win.scroll);
	},

	// Get the content height of an element, like a iframe
	contentHeight: function(obj){
		var height = 0;
		if(obj.Document && obj.Document.body.scrollWidth){
			height = obj.contentWindow.document.body.scrollHeight;
		}else if(obj.contentDocument && obj.contentDocument.body.scrollWidth){
			height = obj.contentDocument.body.scrollHeight;
		}else if(obj.contentDocument && obj.contentDocument.body.offsetWidth){
			height = obj.contentDocument.body.offsetWidthHeight;
		}
		return height;
	},

	// Get the useable window size like a JSON object
	dims: function(){
		var dim = {
			width: 0,
			height: 0
		};
		if(typeof window.top.innerWidth != "undefined"){
			dim.width = window.top.innerWidth;
			dim.height = window.top.innerHeight;
		}
		else if(typeof window.top.document.documentElement != "undefined" && typeof window.top.document.documentElement.clientWidth != 'undefined' && window.top.document.documentElement.clientWidth != 0){
			dim.width = window.top.document.documentElement.clientWidth;
			dim.height = window.top.document.documentElement.clientHeight;
		}
		else{
			dim.width = window.top.document.getElementsByTagName("body")[0].clientWidth;
			dim.height = window.top.document.getElementsByTagName("body")[0].clientHeight;
		}
		return dim;
	}

};
Elise.popup = function(config){
	var props = '';

	// Name
	config.name = config.name ? config.name : '_blank';

	// Dimensions
	config.width = config.width ? config.width : 900;
	config.height = config.height ? config.height : 500;

	// Position
	if(config.position === 'normal'){
		config.left = config.top = 0;
	}else if(config.position === 'top'){
		config.left = screen.availWidth / 2 - config.width / 2;
		config.top = 0;
	}else if(config.position === 'full'){
		config.left = config.top = 0;
		config.width = screen.availWidth;
		config.height = screen.availHeight;
	}else{
		config.left = screen.availWidth / 2 - config.width / 2;
		config.top = screen.availHeight / 2 - config.height / 2;
	}

	// Parse data
	props += 'width='+ config.width;
	props += ',height='+ config.height;
	props += ',left='+ config.left;
	props += ',top='+ config.top;
	props += ',scrollbars=yes';

	// Return the new window object
	return window.open(config.url, config.name, props);
};


