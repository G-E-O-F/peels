!function(t){function n(e){if(i[e])return i[e].exports;var r=i[e]={exports:{},id:e,loaded:!1};return t[e].call(r.exports,r,r.exports,n),r.loaded=!0,r.exports}var i={};return n.m=t,n.c=i,n.p="",n(0)}([function(t,n,i){"use strict";function e(t){if(t&&t.__esModule)return t;var n={};if(null!=t)for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&(n[i]=t[i]);return n["default"]=t,n}function r(t){return t&&t.__esModule?t:{"default":t}}function o(t){return Math.max(Math.min(t,255),0)}var a=i(7),s=r(a),u=i(19),c=e(u);onmessage=function(t){var n=t.data||{},i=new s["default"](n),e=c[n.coloration]?c[n.coloration]:c["default"];"useRGB"===n.coloration&&n.imageData?i.fromRaster(n.imageData,n.imageWidth,n.imageHeight,4,function(t,n,i){this.data={r:o(t),g:o(n),b:o(i)}},function(){i.toCG({colorFn:e,type:n.geometryType||"fields"},function(t,n){postMessage(n)})}):i.toCG({colorFn:e,type:n.geometryType||"fields"},function(t,n){postMessage(n)})}},function(t,n,i){(function(t,e){function r(t,n){this._id=t,this._clearFn=n}var o=i(5).nextTick,a=Function.prototype.apply,s=Array.prototype.slice,u={},c=0;n.setTimeout=function(){return new r(a.call(setTimeout,window,arguments),clearTimeout)},n.setInterval=function(){return new r(a.call(setInterval,window,arguments),clearInterval)},n.clearTimeout=n.clearInterval=function(t){t.close()},r.prototype.unref=r.prototype.ref=function(){},r.prototype.close=function(){this._clearFn.call(window,this._id)},n.enroll=function(t,n){clearTimeout(t._idleTimeoutId),t._idleTimeout=n},n.unenroll=function(t){clearTimeout(t._idleTimeoutId),t._idleTimeout=-1},n._unrefActive=n.active=function(t){clearTimeout(t._idleTimeoutId);var n=t._idleTimeout;n>=0&&(t._idleTimeoutId=setTimeout(function(){t._onTimeout&&t._onTimeout()},n))},n.setImmediate="function"==typeof t?t:function(t){var i=c++,e=arguments.length<2?!1:s.call(arguments,1);return u[i]=!0,o(function(){u[i]&&(e?t.apply(null,e):t.call(null),n.clearImmediate(i))}),i},n.clearImmediate="function"==typeof e?e:function(t){delete u[t]}}).call(n,i(1).setImmediate,i(1).clearImmediate)},function(t,n){"use strict";function i(t,n){return e>=t?new Uint16Array(n):r>=t?new Uint32Array(n):(console.warn("Indices are too large for a typed array buffer."),new Array(n))}var e=(parseInt("11111111",2),parseInt("1111111111111111",2)),r=parseInt("11111111111111111111111111111111",2);t.exports=i},function(t,n,i){"use strict";function e(){for(var t=this._Fields.length,n=l(t-1,3*(2*t-4)),i=0;t>i;i+=1){var e=this._Fields[i];if(i>1){var r=e._adjacentFields[0]._i,o=e._adjacentFields[1]._i,a=e._adjacentFields[2]._i,s=2*i-4,u=2*i-3;n[3*s+0]=o,n[3*s+1]=r,n[3*s+2]=i,n[3*u+0]=a,n[3*u+1]=o,n[3*u+2]=i}}return n}function r(){for(var t=this._interfieldTriangles.length/3,n=new Float64Array(2*t),i=0;t>i;i+=1)c(n,2*i,this._positions[2*this._Fields[this._interfieldTriangles[3*i+0]]._i+0],this._positions[2*this._Fields[this._interfieldTriangles[3*i+0]]._i+1],this._positions[2*this._Fields[this._interfieldTriangles[3*i+1]]._i+0],this._positions[2*this._Fields[this._interfieldTriangles[3*i+1]]._i+1],this._positions[2*this._Fields[this._interfieldTriangles[3*i+2]]._i+0],this._positions[2*this._Fields[this._interfieldTriangles[3*i+2]]._i+1]);return n}function o(t,n,i){var e=this._interfieldTriangles,r=2*t-4,o=2*t-3;return e[3*r+1]!==n&&e[3*r+1]!==i||e[3*r+0]!==n&&e[3*r+0]!==i?e[3*o+1]!==n&&e[3*o+1]!==i||e[3*o+0]!==n&&e[3*o+0]!==i?-1:o:r}function a(t,n,i){var e;if(e=o.call(this,t,n,i),e>=0)return e;if(e=o.call(this,n,t,i),e>=0)return e;if(e=o.call(this,i,t,n),e>=0)return e;throw new Error("Could not find triangle index for faces: "+t+", "+n+", "+i)}function s(){for(var t=this._Fields.length,n=l(this._interfieldTriangles.length/3,6*t),i=0;t>i;i+=1)for(var e=this._Fields[i],r=e._adjacentFields.length,o=0;r>o;o+=1){var s=e.adjacent(o)._i,u=e.adjacent((o+1)%r)._i;n[6*i+o]=a.call(this,e._i,s,u)}return n}function u(){this._interfieldTriangles||(this._interfieldTriangles=e.call(this)),this._interfieldCentroids||(this._interfieldCentroids=r.call(this)),this._interfieldIndices||(this._interfieldIndices=s.call(this))}var c=i(4).centroid,l=i(2);t.exports=u},function(t,n){"use strict";function i(t,n,i,e){return 2*f(_(v(p((t-i)/2),2)+d(t)*d(i)*v(p((n-e)/2),2)))}function e(t,n){var e,r=t[0],o=t[1],a=n[0],s=n[1],u=i(r,o,a,s),f={};return e=p(s-o)<0?l((p(a)-p(r)*d(u))/(p(u)*d(r))):2*c-l((p(a)-p(r)*d(u))/(p(u)*d(r))),f.d=u,f.a=e,f}function r(t,n){var i=Math.cos(n.φ)*Math.cos(n.λ-t.λ),e=Math.cos(n.φ)*Math.sin(n.λ-t.λ);return{"φ":h(p(t.φ)+p(n.φ),_((d(t.φ)+i)*(d(t.φ)+i)+e*e)),"λ":t.λ+h(e,d(t.φ)+i)}}function o(t,n,e,r,o,a){for(var s=1;o>s;s+=1){var u=s/o,c=i(t,n,e,r),l=p((1-u)*c)/p(c),f=p(u*c)/p(c),y=l*d(t)*d(n)+f*d(e)*d(r),g=l*d(t)*p(n)+f*d(e)*p(r),m=l*p(t)+f*p(e),F=h(m,_(v(y,2)+v(g,2))),x=h(g,y);a[2*(s-1)+0]=F,a[2*(s-1)+1]=x}}function a(t,n){for(var i=(arguments.length-2)/2,e=0,r=0,o=0,a=0;i>a;a+=1){var s=arguments.length<=2*a+0+2?void 0:arguments[2*a+0+2],u=arguments.length<=2*a+1+2?void 0:arguments[2*a+1+2];e+=d(s)*d(u),r+=d(s)*p(u),o+=p(s)}var c=e/i,l=r/i,v=o/i,y=_(c*c+l*l+v*v),g=f(v/y),m=h(l,c);t[n+0]=g,t[n+1]=m}function s(){var t=this._divisions,n=2*t-1,i=new Float64Array(2*(t-1));this._positions=new Float64Array(2*(10*t*t+2)),this._Fields[0]._setPosition(c/2,0),this._Fields[1]._setPosition(c/-2,0);for(var e=0;u>e;e+=1){var r=2*e/5*c,a=2*e/5*c+c/5;this.get(e,t-1,0)._setPosition(c/2-y,r),this.get(e,n,0)._setPosition(c/-2+y,a)}if(t-1>0)for(var s=0;u>s;s+=1){var l=(s+4)%5,f=0,h=1,d=this.get(s,t-1,0)._i,p=this.get(l,t-1,0)._i,_=this.get(s,n,0)._i,v=this.get(l,n,0)._i;o(this._positions[2*f+0],this._positions[2*f+1],this._positions[2*d+0],this._positions[2*d+1],t,i);for(var g=1;t>g;g+=1)this.get(s,g-1,0)._setPosition(i[2*(g-1)+0],i[2*(g-1)+1]);o(this._positions[2*d+0],this._positions[2*d+1],this._positions[2*p+0],this._positions[2*p+1],t,i);for(var m=1;t>m;m+=1)this.get(s,t-1-m,m)._setPosition(i[2*(m-1)+0],i[2*(m-1)+1]);o(this._positions[2*d+0],this._positions[2*d+1],this._positions[2*v+0],this._positions[2*v+1],t,i);for(var F=1;t>F;F+=1)this.get(s,t-1,F)._setPosition(i[2*(F-1)+0],i[2*(F-1)+1]);o(this._positions[2*d+0],this._positions[2*d+1],this._positions[2*_+0],this._positions[2*_+1],t,i);for(var x=1;t>x;x+=1)this.get(s,t-1+x,0)._setPosition(i[2*(x-1)+0],i[2*(x-1)+1]);o(this._positions[2*_+0],this._positions[2*_+1],this._positions[2*v+0],this._positions[2*v+1],t,i);for(var w=1;t>w;w+=1)this.get(s,n-w,w)._setPosition(i[2*(w-1)+0],i[2*(w-1)+1]);o(this._positions[2*_+0],this._positions[2*_+1],this._positions[2*h+0],this._positions[2*h+1],t,i);for(var j=1;t>j;j+=1)this.get(s,n,j)._setPosition(i[2*(j-1)+0],i[2*(j-1)+1])}if(t-2>0)for(var T=0;u>T;T+=1)for(var k=0;2*t>k;k+=1)if((k+1)%t>0){var b=t-(k+1)%t,M=b-1,A=t-1-b,I=this.get(T,k,0)._i,P=this.get(T,k,b)._i,O=this.get(T,k,t-1)._adjacentFields[2]._i;o(this._positions[2*I+0],this._positions[2*I+1],this._positions[2*P+0],this._positions[2*P+1],M+1,i);for(var S=1;b>S;S+=1)this.get(T,k,S)._setPosition(i[2*(S-1)+0],i[2*(S-1)+1]);o(this._positions[2*P+0],this._positions[2*P+1],this._positions[2*O+0],this._positions[2*O+1],A+1,i);for(var E=b+1;t>E;E+=1)this.get(T,k,E)._setPosition(i[2*(E-b-1)+0],i[2*(E-b-1)+1])}}var u=5,c=Math.PI,l=Math.acos,f=Math.asin,h=Math.atan2,d=Math.cos,p=Math.sin,_=Math.sqrt,v=Math.pow,y=l(_(5)/5);t.exports={populate:s,centroid:a,midpoint:r,interpolate:o,course:e,distance:i}},function(t,n){function i(){c=!1,a.length?u=a.concat(u):l=-1,u.length&&e()}function e(){if(!c){var t=setTimeout(i);c=!0;for(var n=u.length;n;){for(a=u,u=[];++l<n;)a&&a[l].run();l=-1,n=u.length}a=null,c=!1,clearTimeout(t)}}function r(t,n){this.fun=t,this.array=n}function o(){}var a,s=t.exports={},u=[],c=!1,l=-1;s.nextTick=function(t){var n=new Array(arguments.length-1);if(arguments.length>1)for(var i=1;i<arguments.length;i++)n[i-1]=arguments[i];u.push(new r(t,n)),1!==u.length||c||setTimeout(e,0)},r.prototype.run=function(){this.fun.apply(null,this.array)},s.title="browser",s.browser=!0,s.env={},s.argv=[],s.version="",s.versions={},s.on=o,s.addListener=o,s.once=o,s.off=o,s.removeListener=o,s.removeAllListeners=o,s.emit=o,s.binding=function(t){throw new Error("process.binding is not supported")},s.cwd=function(){return"/"},s.chdir=function(t){throw new Error("process.chdir is not supported")},s.umask=function(){return 0}},function(t,n,i){var e,r;(function(i,o){/*!
	 * async
	 * https://github.com/caolan/async
	 *
	 * Copyright 2010-2014 Caolan McMahon
	 * Released under the MIT license
	 */
!function(){function a(t){var n=!1;return function(){if(n)throw new Error("Callback was already called.");n=!0,t.apply(s,arguments)}}var s,u,c={};s=this,null!=s&&(u=s.async),c.noConflict=function(){return s.async=u,c};var l=Object.prototype.toString,f=Array.isArray||function(t){return"[object Array]"===l.call(t)},h=function(t,n){for(var i=0;i<t.length;i+=1)n(t[i],i,t)},d=function(t,n){if(t.map)return t.map(n);var i=[];return h(t,function(t,e,r){i.push(n(t,e,r))}),i},p=function(t,n,i){return t.reduce?t.reduce(n,i):(h(t,function(t,e,r){i=n(i,t,e,r)}),i)},_=function(t){if(Object.keys)return Object.keys(t);var n=[];for(var i in t)t.hasOwnProperty(i)&&n.push(i);return n};"undefined"!=typeof i&&i.nextTick?(c.nextTick=i.nextTick,"undefined"!=typeof o?c.setImmediate=function(t){o(t)}:c.setImmediate=c.nextTick):"function"==typeof o?(c.nextTick=function(t){o(t)},c.setImmediate=c.nextTick):(c.nextTick=function(t){setTimeout(t,0)},c.setImmediate=c.nextTick),c.each=function(t,n,i){function e(n){n?(i(n),i=function(){}):(r+=1,r>=t.length&&i())}if(i=i||function(){},!t.length)return i();var r=0;h(t,function(t){n(t,a(e))})},c.forEach=c.each,c.eachSeries=function(t,n,i){if(i=i||function(){},!t.length)return i();var e=0,r=function(){n(t[e],function(n){n?(i(n),i=function(){}):(e+=1,e>=t.length?i():r())})};r()},c.forEachSeries=c.eachSeries,c.eachLimit=function(t,n,i,e){var r=v(n);r.apply(null,[t,i,e])},c.forEachLimit=c.eachLimit;var v=function(t){return function(n,i,e){if(e=e||function(){},!n.length||0>=t)return e();var r=0,o=0,a=0;!function s(){if(r>=n.length)return e();for(;t>a&&o<n.length;)o+=1,a+=1,i(n[o-1],function(t){t?(e(t),e=function(){}):(r+=1,a-=1,r>=n.length?e():s())})}()}},y=function(t){return function(){var n=Array.prototype.slice.call(arguments);return t.apply(null,[c.each].concat(n))}},g=function(t,n){return function(){var i=Array.prototype.slice.call(arguments);return n.apply(null,[v(t)].concat(i))}},m=function(t){return function(){var n=Array.prototype.slice.call(arguments);return t.apply(null,[c.eachSeries].concat(n))}},F=function(t,n,i,e){if(n=d(n,function(t,n){return{index:n,value:t}}),e){var r=[];t(n,function(t,n){i(t.value,function(i,e){r[t.index]=e,n(i)})},function(t){e(t,r)})}else t(n,function(t,n){i(t.value,function(t){n(t)})})};c.map=y(F),c.mapSeries=m(F),c.mapLimit=function(t,n,i,e){return x(n)(t,i,e)};var x=function(t){return g(t,F)};c.reduce=function(t,n,i,e){c.eachSeries(t,function(t,e){i(n,t,function(t,i){n=i,e(t)})},function(t){e(t,n)})},c.inject=c.reduce,c.foldl=c.reduce,c.reduceRight=function(t,n,i,e){var r=d(t,function(t){return t}).reverse();c.reduce(r,n,i,e)},c.foldr=c.reduceRight;var w=function(t,n,i,e){var r=[];n=d(n,function(t,n){return{index:n,value:t}}),t(n,function(t,n){i(t.value,function(i){i&&r.push(t),n()})},function(t){e(d(r.sort(function(t,n){return t.index-n.index}),function(t){return t.value}))})};c.filter=y(w),c.filterSeries=m(w),c.select=c.filter,c.selectSeries=c.filterSeries;var j=function(t,n,i,e){var r=[];n=d(n,function(t,n){return{index:n,value:t}}),t(n,function(t,n){i(t.value,function(i){i||r.push(t),n()})},function(t){e(d(r.sort(function(t,n){return t.index-n.index}),function(t){return t.value}))})};c.reject=y(j),c.rejectSeries=m(j);var T=function(t,n,i,e){t(n,function(t,n){i(t,function(i){i?(e(t),e=function(){}):n()})},function(t){e()})};c.detect=y(T),c.detectSeries=m(T),c.some=function(t,n,i){c.each(t,function(t,e){n(t,function(t){t&&(i(!0),i=function(){}),e()})},function(t){i(!1)})},c.any=c.some,c.every=function(t,n,i){c.each(t,function(t,e){n(t,function(t){t||(i(!1),i=function(){}),e()})},function(t){i(!0)})},c.all=c.every,c.sortBy=function(t,n,i){c.map(t,function(t,i){n(t,function(n,e){n?i(n):i(null,{value:t,criteria:e})})},function(t,n){if(t)return i(t);var e=function(t,n){var i=t.criteria,e=n.criteria;return e>i?-1:i>e?1:0};i(null,d(n.sort(e),function(t){return t.value}))})},c.auto=function(t,n){n=n||function(){};var i=_(t),e=i.length;if(!e)return n();var r={},o=[],a=function(t){o.unshift(t)},s=function(t){for(var n=0;n<o.length;n+=1)if(o[n]===t)return void o.splice(n,1)},u=function(){e--,h(o.slice(0),function(t){t()})};a(function(){if(!e){var t=n;n=function(){},t(null,r)}}),h(i,function(i){var e=f(t[i])?t[i]:[t[i]],o=function(t){var e=Array.prototype.slice.call(arguments,1);if(e.length<=1&&(e=e[0]),t){var o={};h(_(r),function(t){o[t]=r[t]}),o[i]=e,n(t,o),n=function(){}}else r[i]=e,c.setImmediate(u)},l=e.slice(0,Math.abs(e.length-1))||[],d=function(){return p(l,function(t,n){return t&&r.hasOwnProperty(n)},!0)&&!r.hasOwnProperty(i)};if(d())e[e.length-1](o,r);else{var v=function(){d()&&(s(v),e[e.length-1](o,r))};a(v)}})},c.retry=function(t,n,i){var e=5,r=[];"function"==typeof t&&(i=n,n=t,t=e),t=parseInt(t,10)||e;var o=function(e,o){for(var a=function(t,n){return function(i){t(function(t,e){i(!t||n,{err:t,result:e})},o)}};t;)r.push(a(n,!(t-=1)));c.series(r,function(t,n){n=n[n.length-1],(e||i)(n.err,n.result)})};return i?o():o},c.waterfall=function(t,n){if(n=n||function(){},!f(t)){var i=new Error("First argument to waterfall must be an array of functions");return n(i)}if(!t.length)return n();var e=function(t){return function(i){if(i)n.apply(null,arguments),n=function(){};else{var r=Array.prototype.slice.call(arguments,1),o=t.next();o?r.push(e(o)):r.push(n),c.setImmediate(function(){t.apply(null,r)})}}};e(c.iterator(t))()};var k=function(t,n,i){if(i=i||function(){},f(n))t.map(n,function(t,n){t&&t(function(t){var i=Array.prototype.slice.call(arguments,1);i.length<=1&&(i=i[0]),n.call(null,t,i)})},i);else{var e={};t.each(_(n),function(t,i){n[t](function(n){var r=Array.prototype.slice.call(arguments,1);r.length<=1&&(r=r[0]),e[t]=r,i(n)})},function(t){i(t,e)})}};c.parallel=function(t,n){k({map:c.map,each:c.each},t,n)},c.parallelLimit=function(t,n,i){k({map:x(n),each:v(n)},t,i)},c.series=function(t,n){if(n=n||function(){},f(t))c.mapSeries(t,function(t,n){t&&t(function(t){var i=Array.prototype.slice.call(arguments,1);i.length<=1&&(i=i[0]),n.call(null,t,i)})},n);else{var i={};c.eachSeries(_(t),function(n,e){t[n](function(t){var r=Array.prototype.slice.call(arguments,1);r.length<=1&&(r=r[0]),i[n]=r,e(t)})},function(t){n(t,i)})}},c.iterator=function(t){var n=function(i){var e=function(){return t.length&&t[i].apply(null,arguments),e.next()};return e.next=function(){return i<t.length-1?n(i+1):null},e};return n(0)},c.apply=function(t){var n=Array.prototype.slice.call(arguments,1);return function(){return t.apply(null,n.concat(Array.prototype.slice.call(arguments)))}};var b=function(t,n,i,e){var r=[];t(n,function(t,n){i(t,function(t,i){r=r.concat(i||[]),n(t)})},function(t){e(t,r)})};c.concat=y(b),c.concatSeries=m(b),c.whilst=function(t,n,i){t()?n(function(e){return e?i(e):void c.whilst(t,n,i)}):i()},c.doWhilst=function(t,n,i){t(function(e){if(e)return i(e);var r=Array.prototype.slice.call(arguments,1);n.apply(null,r)?c.doWhilst(t,n,i):i()})},c.until=function(t,n,i){t()?i():n(function(e){return e?i(e):void c.until(t,n,i)})},c.doUntil=function(t,n,i){t(function(e){if(e)return i(e);var r=Array.prototype.slice.call(arguments,1);n.apply(null,r)?i():c.doUntil(t,n,i)})},c.queue=function(t,n){function i(t,n,i,e){return t.started||(t.started=!0),f(n)||(n=[n]),0==n.length?c.setImmediate(function(){t.drain&&t.drain()}):void h(n,function(n){var r={data:n,callback:"function"==typeof e?e:null};i?t.tasks.unshift(r):t.tasks.push(r),t.saturated&&t.tasks.length===t.concurrency&&t.saturated(),c.setImmediate(t.process)})}void 0===n&&(n=1);var e=0,r={tasks:[],concurrency:n,saturated:null,empty:null,drain:null,started:!1,paused:!1,push:function(t,n){i(r,t,!1,n)},kill:function(){r.drain=null,r.tasks=[]},unshift:function(t,n){i(r,t,!0,n)},process:function(){if(!r.paused&&e<r.concurrency&&r.tasks.length){var n=r.tasks.shift();r.empty&&0===r.tasks.length&&r.empty(),e+=1;var i=function(){e-=1,n.callback&&n.callback.apply(n,arguments),r.drain&&r.tasks.length+e===0&&r.drain(),r.process()},o=a(i);t(n.data,o)}},length:function(){return r.tasks.length},running:function(){return e},idle:function(){return r.tasks.length+e===0},pause:function(){r.paused!==!0&&(r.paused=!0)},resume:function(){if(r.paused!==!1){r.paused=!1;for(var t=1;t<=r.concurrency;t++)c.setImmediate(r.process)}}};return r},c.priorityQueue=function(t,n){function i(t,n){return t.priority-n.priority}function e(t,n,i){for(var e=-1,r=t.length-1;r>e;){var o=e+(r-e+1>>>1);i(n,t[o])>=0?e=o:r=o-1}return e}function r(t,n,r,o){return t.started||(t.started=!0),f(n)||(n=[n]),0==n.length?c.setImmediate(function(){t.drain&&t.drain()}):void h(n,function(n){var a={data:n,priority:r,callback:"function"==typeof o?o:null};t.tasks.splice(e(t.tasks,a,i)+1,0,a),t.saturated&&t.tasks.length===t.concurrency&&t.saturated(),c.setImmediate(t.process)})}var o=c.queue(t,n);return o.push=function(t,n,i){r(o,t,n,i)},delete o.unshift,o},c.cargo=function(t,n){var i=!1,e=[],r={tasks:e,payload:n,saturated:null,empty:null,drain:null,drained:!0,push:function(t,i){f(t)||(t=[t]),h(t,function(t){e.push({data:t,callback:"function"==typeof i?i:null}),r.drained=!1,r.saturated&&e.length===n&&r.saturated()}),c.setImmediate(r.process)},process:function o(){if(!i){if(0===e.length)return r.drain&&!r.drained&&r.drain(),void(r.drained=!0);var a="number"==typeof n?e.splice(0,n):e.splice(0,e.length),s=d(a,function(t){return t.data});r.empty&&r.empty(),i=!0,t(s,function(){i=!1;var t=arguments;h(a,function(n){n.callback&&n.callback.apply(null,t)}),o()})}},length:function(){return e.length},running:function(){return i}};return r};var M=function(t){return function(n){var i=Array.prototype.slice.call(arguments,1);n.apply(null,i.concat([function(n){var i=Array.prototype.slice.call(arguments,1);"undefined"!=typeof console&&(n?console.error&&console.error(n):console[t]&&h(i,function(n){console[t](n)}))}]))}};c.log=M("log"),c.dir=M("dir"),c.memoize=function(t,n){var i={},e={};n=n||function(t){return t};var r=function(){var r=Array.prototype.slice.call(arguments),o=r.pop(),a=n.apply(null,r);a in i?c.nextTick(function(){o.apply(null,i[a])}):a in e?e[a].push(o):(e[a]=[o],t.apply(null,r.concat([function(){i[a]=arguments;var t=e[a];delete e[a];for(var n=0,r=t.length;r>n;n++)t[n].apply(null,arguments)}])))};return r.memo=i,r.unmemoized=t,r},c.unmemoize=function(t){return function(){return(t.unmemoized||t).apply(null,arguments)}},c.times=function(t,n,i){for(var e=[],r=0;t>r;r++)e.push(r);return c.map(e,n,i)},c.timesSeries=function(t,n,i){for(var e=[],r=0;t>r;r++)e.push(r);return c.mapSeries(e,n,i)},c.seq=function(){var t=arguments;return function(){var n=this,i=Array.prototype.slice.call(arguments),e=i.pop();c.reduce(t,i,function(t,i,e){i.apply(n,t.concat([function(){var t=arguments[0],n=Array.prototype.slice.call(arguments,1);e(t,n)}]))},function(t,i){e.apply(n,[t].concat(i))})}},c.compose=function(){return c.seq.apply(null,Array.prototype.reverse.call(arguments))};var A=function(t,n){var i=function(){var i=this,e=Array.prototype.slice.call(arguments),r=e.pop();return t(n,function(t,n){t.apply(i,e.concat([n]))},r)};if(arguments.length>2){var e=Array.prototype.slice.call(arguments,2);return i.apply(this,e)}return i};c.applyEach=y(A),c.applyEachSeries=m(A),c.forever=function(t,n){function i(e){if(e){if(n)return n(e);throw e}t(i)}i()},"undefined"!=typeof t&&t.exports?t.exports=c:(e=[],r=function(){return c}.apply(n,e),!(void 0!==r&&(t.exports=r)))}()}).call(n,i(5),i(1).setImmediate)},function(t,n,i){"use strict";t.exports=i(11)},function(t,n){"use strict";t.exports=function(t,n){if(2>t)return null;var i=t-2,e=2*n,r=n,o=Math.floor(i/(e*r)),a=Math.floor((i-o*e*r)/r),s=i-o*e*r-a*r;return[o,a,s]}},function(t,n,i){"use strict";function e(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}var r=function(){function t(t,n){for(var i=0;i<n.length;i++){var e=n[i];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(t,e.key,e)}}return function(n,i,e){return i&&t(n.prototype,i),e&&t(n,e),n}}(),o=i(8),a=function(){function t(n,i,r){e(this,t),this._parent=n,this._i=i,this._data={},this._adjacentFields=null,this._data.current=r||{}}return r(t,[{key:"_setPosition",value:function(t,n){this._parent._positions[2*this._i]=t,this._parent._positions[2*this._i+1]=n}},{key:"adjacent",value:function(t){return this._adjacentFields[t]}},{key:"adjacents",value:function(){return this._adjacentFields}},{key:"_sxy",get:function(){return o(this._i,this._parent._divisions)}},{key:"data",get:function(){return this._parent._iteration&&this._data.hasOwnProperty(this._parent._iteration.previous)&&(this._data.current=this._data[this._parent._iteration.previous],delete this._data[this._parent._iteration.previous]),this._data.current},set:function(t){this._parent._iteration?this._data[this._parent._iteration.current]=t:this._data.current=t}},{key:"position",get:function(){return this._parent._positions.subarray(2*this._i,2*this._i+2)}}]),t}();t.exports=a},function(t,n,i){"use strict";function e(){for(var t=this._parent._interfieldIndices,n=this._parent._interfieldCentroids,i=this._i,e=-(1/0),r=1/0,o=-(1/0),a=1/0,s=this._parent._positions[2*i+1],u=[],c=0;c<this._adjacentFields.length;c+=1){var h=n[2*t[6*i+c]+0],d=n[2*t[6*i+c]+1];e=Math.max(e,h),r=Math.min(r,h),o=Math.max(o,d),a=Math.min(a,d),u.push([d,h])}if(0===i&&(e=l/2),1===i&&(r=l/-2),2>i)a=-l,o=l,u=[[a,e],[o,e],[o,r],[a,r]];else if(o>0&&0>a&&(l/-2>s||s>l/2)){o=-(1/0),a=1/0;for(var p=0;p<u.length;p+=1)u[p][0]<0&&(u[p][0]+=f),o=Math.max(o,u[p][0]),a=Math.min(a,u[p][0])}return{"min_φ":r,"max_φ":e,"min_λ":a,"max_λ":o,vertices:u}}function r(t,n,i,e){for(var r=f/i,o=l/e,a=Math.floor(n.min_λ/r+i/2),u=Math.ceil(n.max_λ/r+i/2),c=Math.floor(n.min_φ/o+e/2),h=Math.ceil(n.max_φ/o+e/2),d=a;u>=d;d+=1)for(var p=c;h>=p;p+=1)t.write(d%i,p,s([d*r-l,p*o-l/2],n.vertices));return{min_x:a,max_x:u,min_y:c,max_y:h}}function o(t,n,i){var e=0,r=t._w;return t.get((n+0)%r,i+0)&&e++,t.get((n+0)%r,i+1)&&e++,t.get((n+1)%r,i+0)&&e++,t.get((n+1)%r,i+1)&&e++,e}function a(t,n,i,a,s,l){var f=this;c.call(f);var h=new u(n,i);f._Fields.forEach(function(u){for(var c=e.call(u),l=r(h,c,n,i),f=[],d=0,p=0;a>p;p+=1)f[p]=0;for(var _=l.min_x;_<l.max_x;_+=1)for(var v=l.min_y;v<l.max_y;v+=1){for(var y=o(h,_,v)/4,g=0;a>g;g+=1)f[g]+=t[(i-v-1)*n*a+(n-_-1)*a+g]*y;d+=y}s.apply(u,f.map(function(t){return t/d})),h.clear(l.max_x-l.min_x,l.max_y-l.min_y,l.min_x,l.min_y)}),l()}var s=i(20),u=i(17).Bitmap,c=i(3),l=Math.PI,f=2*Math.PI;t.exports=a},function(t,n,i){"use strict";function e(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}var r=function(){function t(t,n){for(var i=0;i<n.length;i++){var e=n[i];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(t,e.key,e)}}return function(n,i,e){return i&&t(n.prototype,i),e&&t(n,e),n}}(),o=5,a={divisions:8},s=i(13),u=i(4).populate,c=i(9),l=function(){function t(n){e(this,t);var i=n||{},r={};if(i.data){if(!this.validate(i.data))throw new Error("Invalid data provided.");r=i.data}var l=this._divisions=Math.max(r.divisions||i.divisions||a.divisions,1),f=2*o*l*l+2;this._Fields=[];for(var h=0;f>h;h+=1)this._Fields[h]=new c(this,h,r.fields?r.fields[h]:void 0);this._Fields.forEach(s),u.call(this)}return r(t,[{key:"get",value:function(t,n,i){return this._Fields[t*this._divisions*this._divisions*2+n*this._divisions+i+2]}},{key:"_NORTH",get:function(){return this._Fields[0]}},{key:"_SOUTH",get:function(){return this._Fields[1]}}]),t}();l.prototype.fromRaster=i(10),l.prototype.serialize=i(14),l.prototype.validate=i(16),l.prototype.iterate=i(12),l.prototype.toCG=i(15),t.exports=l},function(t,n,i){"use strict";var e=i(6),r=0;t.exports=function(t,n){var i=this,o=arguments;this._iteration?this._iteration.current=r:this._iteration={current:r};var a=function(n,i){t.call(n,i)};e.each(this._Fields,a,function(){i._iteration.previous=r,i._iteration.current=null,r+=1,n.apply(null,o)})}},function(t,n){"use strict";var i=5;t.exports=function(t){var n=t._parent,e=n._divisions,r=t._sxy,o=t._i<2||0===r[2]&&(r[1]+1)%e===0,a=2*e-1,s=e-1;if(0===t._i)t._adjacentFields=[n.get(0,0,0),n.get(1,0,0),n.get(2,0,0),n.get(3,0,0),n.get(4,0,0)];else if(1===t._i)t._adjacentFields=[n.get(0,a,s),n.get(1,a,s),n.get(2,a,s),n.get(3,a,s),n.get(4,a,s)];else{var u=(r[0]+1+i)%i,c=(r[0]-1+i)%i,l=r[0],f=r[1],h=r[2];t._adjacentFields=[],f>0?t._adjacentFields[0]=n.get(l,f-1,h):0===h?t._adjacentFields[0]=n._NORTH:t._adjacentFields[0]=n.get(c,h-1,0),0===f?t._adjacentFields[1]=n.get(c,h,0):h===s?f>e?t._adjacentFields[1]=n.get(c,a,f-e):t._adjacentFields[1]=n.get(c,f+e-1,0):t._adjacentFields[1]=n.get(l,f-1,h+1),s>h?t._adjacentFields[2]=n.get(l,f,h+1):f===a&&h===s?t._adjacentFields[2]=n._SOUTH:f>=e?t._adjacentFields[2]=n.get(c,a,f-e+1):t._adjacentFields[2]=n.get(c,f+e,0),o?f===e-1?(t._adjacentFields[3]=n.get(l,f+1,0),t._adjacentFields[4]=n.get(u,0,s)):f===a&&(t._adjacentFields[3]=n.get(u,e,s),t._adjacentFields[4]=n.get(u,e-1,s)):(f===a?t._adjacentFields[3]=n.get(u,h+e,s):t._adjacentFields[3]=n.get(l,f+1,h),f===a?t._adjacentFields[4]=n.get(u,h+e-1,s):0===h?e>f?t._adjacentFields[4]=n.get(u,0,f+1):t._adjacentFields[4]=n.get(u,f-e+1,s):t._adjacentFields[4]=n.get(l,f+1,h-1),h>0?t._adjacentFields[5]=n.get(l,f,h-1):0===h&&(e>f?t._adjacentFields[5]=n.get(u,0,f):t._adjacentFields[5]=n.get(u,f-e,s)))}}},function(t,n){"use strict";function i(t){return t.data?JSON.parse(JSON.stringify(t.data)):{}}t.exports=function(){var t={};return t.fields=[],t.divisions=this._divisions,this._Fields.forEach(function(n,e){t.fields[e]=i(n)}),t}},function(t,n,i){"use strict";function e(t,n,i){for(var e=t._Fields.length,r=new Float32Array(3*e),o=t._interfieldTriangles,a=new Float32Array(3*o.length),s=0;s<t._Fields.length;s+=1){var l=t._Fields[s],f=t._positions[2*s+0],h=t._positions[2*s+1],d=n.colorFn.call(l);r[3*s+0]=u(f)*u(h),r[3*s+2]=u(f)*c(h),r[3*s+1]=c(f),a[3*s+0]=d.r,a[3*s+1]=d.g,a[3*s+2]=d.b}var p=r.slice(0);i&&i.call(null,null,{positions:r,normals:p,indices:o,colors:a})}function r(t,n,i){for(var e=[0,2,1,0,4,2,4,3,2],r=[0,2,1,0,3,2,0,5,3,5,4,3],o=[1,2,0,2,4,0,2,3,4],a=t._interfieldTriangles,l=a.length/3,f=t._Fields.length,h=6*f-12,d=4*f-12,p=s(h,f),_=new Float32Array(3*l),v=s(h,3*d),y=new Float32Array(3*h),g=new Float32Array(3*h),m=new Float32Array(3*h),F=0;l>F;F+=1){var x=t._interfieldCentroids[2*F+0],w=t._interfieldCentroids[2*F+1];_[3*F+0]=u(x)*u(w),_[3*F+2]=u(x)*c(w),_[3*F+1]=c(x)}for(var j=0,T=0,k=0;f>k;k+=1){var b=t._Fields[k],M=b._adjacentFields.length,A=n.colorFn.call(b),I=t._positions[2*k+0],P=t._positions[2*k+1],O=[];p[k]=j;for(var S=0;M>S;S+=1){var E=j+S,C=t._interfieldIndices[6*k+S];O.push(C),y[3*E+0]=_[3*C+0],y[3*E+1]=_[3*C+1],y[3*E+2]=_[3*C+2],m[3*E+0]=A.r,m[3*E+1]=A.g,m[3*E+2]=A.b,g[3*E+0]=u(I)*u(P),g[3*E+2]=u(I)*c(P),g[3*E+1]=c(I)}var L=void 0;L=1===k?o:5===M?e:r;for(var R=0;R<L.length;R+=1){var U=T+R;v[U]=j+L[R]}j+=M,T+=L.length}i.call(null,null,{positions:y,indices:v,normals:g,colors:m})}function o(t,n){switch(a.call(this),t.type){case"poly-per-field":return r(this,t,n);case"vertex-per-field":default:return e(this,t,n)}}var a=i(3),s=i(2),u=Math.cos,c=Math.sin;t.exports=o},function(t,n){"use strict";function i(t){return"Object"===t.constructor.name}var e=5;t.exports=function(t){if(t.hasOwnProperty("fields")&&t.hasOwnProperty("divisions")){var n=t.divisions;if("Number"===n.constructor.name&&n>0&&"Array"===t.fields.constructor.name&&t.fields.length===n*n*2*e+2){for(var r=0;r<t.fields.length;r+=1)if(!i(t.fields[r]))return!1;return!0}return!1}return!1}},function(t,n,i){"use strict";t.exports={Bitmap:i(18)}},function(t,n){"use strict";function i(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}var e=function(){function t(t,n){for(var i=0;i<n.length;i++){var e=n[i];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(t,e.key,e)}}return function(n,i,e){return i&&t(n.prototype,i),e&&t(n,e),n}}(),r=function(){function t(n,e){i(this,t),this._bits=new Uint8Array(Math.ceil(n*e/8)),this._w=n,this._h=e}return e(t,[{key:"clear",value:function(t,n,i,e){for(var r=i||0,o=e||0,a=Math.min(t,this._w-r),s=Math.min(n,this._h-o),u=r;a>u;u+=1)for(var c=o;s>c;c+=1)this.write(u,c,!1);return this}},{key:"write",value:function(t,n,i){return i?this._bits[Math.floor((t*this._h+n)/8)]|=1<<(t*this._h+n)%8:this._bits[Math.floor((t*this._h+n)/8)]&=~(1<<(t*this._h+n)%8),this}},{key:"get",value:function(t,n){return!!(this._bits[Math.floor((t*this._h+n)/8)]>>(t*this._h+n)%8&1)}}]),t}();t.exports=r},function(t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n["default"]=function(){return{r:235*i,g:246*i,b:247*i}};var i=1/225;n.highlightIcosahedron=function(){var t=this._parent._divisions,n=this._sxy,e=this._i<2||(n[1]+n[2]+1)%t===0||(n[1]+1)%t===0||0===n[2];return e?{r:134*i,g:171*i,b:165*i}:{r:0*i,g:108*i,b:127*i}},n.useRGB=function(){return{r:i*this.data.r,g:i*this.data.g,b:i*this.data.b}}},function(t,n){t.exports=function(t,n){for(var i=t[0],e=t[1],r=!1,o=0,a=n.length-1;o<n.length;a=o++){var s=n[o][0],u=n[o][1],c=n[a][0],l=n[a][1],f=u>e!=l>e&&(c-s)*(e-u)/(l-u)+s>i;f&&(r=!r)}return r}}]);