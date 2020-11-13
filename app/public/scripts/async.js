(function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t(e.async={})})(this,function(e){'use strict';function t(e,...t){return(...a)=>e(...t,...a)}function a(e){return function(...t){var a=t.pop();return e.call(this,t,a)}}function n(e){setTimeout(e,0)}function i(e){return(t,...a)=>e(()=>t(...a))}function r(e){return u(e)?function(...t){const a=t.pop(),n=e.apply(this,t);return s(n,a)}:a(function(t,a){var n;try{n=e.apply(this,t)}catch(t){return a(t)}return n&&"function"==typeof n.then?s(n,a):void a(null,n)})}function s(e,t){return e.then(e=>{l(t,null,e)},e=>{l(t,e&&e.message?e:new Error(e))})}function l(e,t,a){try{e(t,a)}catch(e){Ee(t=>{throw t},e)}}function u(e){return"AsyncFunction"===e[Symbol.toStringTag]}function c(e){return"AsyncGenerator"===e[Symbol.toStringTag]}function p(e){return"function"==typeof e[Symbol.asyncIterator]}function d(e){if("function"!=typeof e)throw new Error("expected a function");return u(e)?r(e):e}function o(e,t=e.length){if(!t)throw new Error("arity is undefined");return function(...a){return"function"==typeof a[t-1]?e.apply(this,a):new Promise((n,i)=>{a[t-1]=(e,...t)=>e?i(e):void n(1<t.length?t:t[0]),e.apply(this,a)})}}function h(e){return function(t,...a){const n=o(function(n){var i=this;return e(t,(e,t)=>{d(e).apply(i,a.concat(t))},n)});return n}}function f(e,t,a,n){t=t||[];var i=[],r=0,s=d(a);return e(t,(e,t,a)=>{var n=r++;s(e,(e,t)=>{i[n]=t,a(e)})},e=>{n(e,i)})}function y(e){return e&&"number"==typeof e.length&&0<=e.length&&0==e.length%1}function m(e){function t(...t){if(null!==e){var a=e;e=null,a.apply(this,t)}}return Object.assign(t,e),t}function g(e){return e[Symbol.iterator]&&e[Symbol.iterator]()}function k(e){var t=-1,a=e.length;return function(){return++t<a?{value:e[t],key:t}:null}}function v(e){var t=-1;return function(){var a=e.next();return a.done?null:(t++,{value:a.value,key:t})}}function S(e){var t=e?Object.keys(e):[],a=-1,n=t.length;return function(){var i=t[++a];return a<n?{value:e[i],key:i}:null}}function L(e){if(y(e))return k(e);var t=g(e);return t?v(t):S(e)}function x(e){return function(...t){if(null===e)throw new Error("Callback was already called.");var a=e;e=null,a.apply(this,t)}}function E(e,t,a,n){function i(){p>=t||c||l||(c=!0,e.next().then(({value:e,done:t})=>{if(!(u||l))return c=!1,t?(l=!0,void(0>=p&&n(null))):void(p++,a(e,d,r),d++,i())}).catch(s))}function r(e,t){return p-=1,u?void 0:e?s(e):!1===e?(l=!0,void(u=!0)):t===be||l&&0>=p?(l=!0,n(null)):void i()}function s(e){u||(c=!1,l=!0,n(e))}let l=!1,u=!1,c=!1,p=0,d=0;i()}function b(e,t,a){function n(e,t){!1===e&&(l=!0);!0===l||(e?a(e):(++r===s||t===be)&&a(null))}a=m(a);var i=0,r=0,{length:s}=e,l=!1;for(0===s&&a(null);i<s;i++)t(e[i],i,x(n))}function O(e,t,a){return _e(e,1/0,t,a)}function _(){function e(e,...n){return e?a(e):void t(1<n.length?n:n[0])}let t,a;return e[Fe]=new Promise((e,n)=>{t=e,a=n}),e}function M(e,t,a){function n(e,t){g.push(()=>l(e,t))}function i(){if(!h){if(0===g.length&&0===o)return a(null,p);for(;g.length&&o<t;){var e=g.shift();e()}}}function r(e,t){var a=y[e];a||(a=y[e]=[]),a.push(t)}function s(e){var t=y[e]||[];t.forEach(e=>e()),i()}function l(e,t){if(!f){var n=x((t,...n)=>{if(o--,!1===t)return void(h=!0);if(2>n.length&&([n]=n),t){var i={};if(Object.keys(p).forEach(e=>{i[e]=p[e]}),i[e]=n,f=!0,y=Object.create(null),h)return;a(t,i)}else p[e]=n,s(e)});o++;var i=d(t[t.length-1]);1<t.length?i(p,n):i(n)}}function u(t){var a=[];return Object.keys(e).forEach(n=>{const i=e[n];Array.isArray(i)&&0<=i.indexOf(t)&&a.push(n)}),a}"number"!=typeof t&&(a=t,t=null),a=m(a||_());var c=Object.keys(e).length;if(!c)return a(null);t||(t=c);var p={},o=0,h=!1,f=!1,y=Object.create(null),g=[],k=[],v={};return Object.keys(e).forEach(t=>{var a=e[t];if(!Array.isArray(a))return n(t,[a]),void k.push(t);var i=a.slice(0,a.length-1),s=i.length;return 0===s?(n(t,a),void k.push(t)):void(v[t]=s,i.forEach(l=>{if(!e[l])throw new Error("async.auto task `"+t+"` has a non-existent dependency `"+l+"` in "+i.join(", "));r(l,()=>{s--,0===s&&n(t,a)})}))}),function(){for(var e,t=0;k.length;)e=k.pop(),t++,u(e).forEach(e=>{0==--v[e]&&k.push(e)});if(t!==c)throw new Error("async.auto cannot execute tasks due to a recursive dependency")}(),i(),a[Fe]}function A(e){const t=e.toString().replace(ze,"");let a=t.match(Te);if(a||(a=t.match(Ce)),!a)throw new Error("could not parse args in autoInject\nSource:\n"+t);let[,n]=a;return n.replace(/\s/g,"").split(Pe).map(e=>e.replace(Re,"").trim())}function I(e,t){var a={};return Object.keys(e).forEach(t=>{function n(e,t){var a=i.map(t=>e[t]);a.push(t),d(r)(...a)}var i,r=e[t],s=u(r),l=!s&&1===r.length||s&&0===r.length;if(Array.isArray(r))i=[...r],r=i.pop(),a[t]=i.concat(0<i.length?n:r);else if(l)a[t]=r;else{if(i=A(r),0===r.length&&!s&&0===i.length)throw new Error("autoInject task functions require explicit parameters.");s||i.pop(),a[t]=i.concat(n)}}),M(a,t)}function j(e,t){e.length=1,e.head=e.tail=t}function w(e,t,a){function n(e,t){f[e].push(t)}function i(e,t){const a=(...n)=>{r(e,a),t(...n)};f[e].push(a)}function r(e,t){return e?t?void(f[e]=f[e].filter(e=>e!==t)):f[e]=[]:Object.keys(f).forEach(e=>f[e]=[])}function s(e,...t){f[e].forEach(e=>e(...t))}function l(e,t,a,n){function i(e,...t){return e?a?s(e):r():1>=t.length?r(t[0]):void r(t)}if(null!=n&&"function"!=typeof n)throw new Error("task callback must be a function");k.started=!0;var r,s,l={data:e,callback:a?i:n||i};if(t?k._tasks.unshift(l):k._tasks.push(l),y||(y=!0,Ee(()=>{y=!1,k.process()})),a||!n)return new Promise((e,t)=>{r=e,s=t})}function u(e){return function(t,...a){o-=1;for(var n=0,r=e.length;n<r;n++){var l=e[n],u=h.indexOf(l);0===u?h.shift():0<u&&h.splice(u,1),l.callback(t,...a),null!=t&&s("error",t,l.data)}o<=k.concurrency-k.buffer&&s("unsaturated"),k.idle()&&s("drain"),k.process()}}function c(e){return!!(0===e.length&&k.idle())&&(Ee(()=>s("drain")),!0)}if(null==t)t=1;else if(0===t)throw new RangeError("Concurrency must not be zero");var p=d(e),o=0,h=[];const f={error:[],drain:[],saturated:[],unsaturated:[],empty:[]};var y=!1;const m=e=>t=>t?void(r(e),n(e,t)):new Promise((t,a)=>{i(e,(e,n)=>e?a(e):void t(n))});var g=!1,k={_tasks:new Ne,*[Symbol.iterator](){yield*k._tasks[Symbol.iterator]()},concurrency:t,payload:a,buffer:t/4,started:!1,paused:!1,push(e,t){return Array.isArray(e)?c(e)?void 0:e.map(e=>l(e,!1,!1,t)):l(e,!1,!1,t)},pushAsync(e,t){return Array.isArray(e)?c(e)?void 0:e.map(e=>l(e,!1,!0,t)):l(e,!1,!0,t)},kill(){r(),k._tasks.empty()},unshift(e,t){return Array.isArray(e)?c(e)?void 0:e.map(e=>l(e,!0,!1,t)):l(e,!0,!1,t)},unshiftAsync(e,t){return Array.isArray(e)?c(e)?void 0:e.map(e=>l(e,!0,!0,t)):l(e,!0,!0,t)},remove(e){k._tasks.remove(e)},process(){var e=Math.min;if(!g){for(g=!0;!k.paused&&o<k.concurrency&&k._tasks.length;){var t=[],a=[],n=k._tasks.length;k.payload&&(n=e(n,k.payload));for(var r,c=0;c<n;c++)r=k._tasks.shift(),t.push(r),h.push(r),a.push(r.data);o+=1,0===k._tasks.length&&s("empty"),o===k.concurrency&&s("saturated");var d=x(u(t));p(a,d)}g=!1}},length(){return k._tasks.length},running(){return o},workersList(){return h},idle(){return 0===k._tasks.length+o},pause(){k.paused=!0},resume(){!1===k.paused||(k.paused=!1,Ee(k.process))}};return Object.defineProperties(k,{saturated:{writable:!1,value:m("saturated")},unsaturated:{writable:!1,value:m("unsaturated")},empty:{writable:!1,value:m("empty")},drain:{writable:!1,value:m("drain")},error:{writable:!1,value:m("error")}}),k}function B(e,t){return w(e,1,t)}function F(e,t,a){return w(e,t,a)}function T(...e){var t=e.map(d);return function(...e){var a=this,n=e[e.length-1];return"function"==typeof n?e.pop():n=_(),Ye(t,e,(e,t,n)=>{t.apply(a,e.concat((e,...t)=>{n(e,t)}))},(e,t)=>n(e,...t)),n[Fe]}}function C(...e){return T(...e.reverse())}function P(...e){return function(...t){var a=t.pop();return a(null,...e)}}function R(e,t){return(a,n,i,r)=>{var s,l=!1;const u=d(i);a(n,(a,n,i)=>{u(a,(n,r)=>n||!1===n?i(n):e(r)&&!s?(l=!0,s=t(!0,a),i(null,be)):void i())},e=>e?r(e):void r(null,l?s:t(!1)))}}function z(e){return(t,...a)=>d(t)(...a,(t,...a)=>{"object"==typeof console&&(t?console.error&&console.error(t):console[e]&&a.forEach(t=>console[e](t)))})}function N(e,t,a){const n=d(t);return Ke(e,(...e)=>{const t=e.pop();n(...e,(e,a)=>t(e,!a))},a)}function V(e){return(t,a,n)=>e(t,n)}function Y(e){return u(e)?e:function(...t){var a=t.pop(),n=!0;t.push((...e)=>{n?Ee(()=>a(...e)):a(...e)}),e.apply(this,t),n=!1}}function q(e,t,a,n){var r=Array(t.length);e(t,(e,t,n)=>{a(e,(e,a)=>{r[t]=!!a,n(e)})},e=>{if(e)return n(e);for(var a=[],s=0;s<t.length;s++)r[s]&&a.push(t[s]);n(null,a)})}function D(e,t,a,n){var i=[];e(t,(e,t,n)=>{a(e,(a,r)=>a?n(a):void(r&&i.push({index:t,value:e}),n(a)))},e=>e?n(e):void n(null,i.sort((e,t)=>e.index-t.index).map(e=>e.value)))}function Q(e,t,a,n){var i=y(t)?q:D;return i(e,t,d(a),n)}function U(e,t,a){return lt(e,1/0,t,a)}function G(e,t,a){return lt(e,1,t,a)}function W(e,t,a){return ct(e,1/0,t,a)}function H(e,t,a){return ct(e,1,t,a)}function J(e,t=e=>e){var n=Object.create(null),r=Object.create(null),s=d(e),l=a((e,a)=>{var u=t(...e);u in n?Ee(()=>a(null,...n[u])):u in r?r[u].push(a):(r[u]=[a],s(...e,(e,...t)=>{e||(n[u]=t);var a=r[u];delete r[u];for(var s=0,c=a.length;s<c;s++)a[s](e,...t)}))});return l.memo=n,l.unmemoized=e,l}function K(e,t){return dt(Me,e,t)}function X(e,t,a){return dt(Oe(t),e,a)}function Z(e,t){var a=d(e);return w((e,t)=>{a(e[0],t)},t,1)}function $(e){return(e<<1)+1}function ee(e){return(e+1>>1)-1}function te(e,t){return e.priority===t.priority?e.pushCount<t.pushCount:e.priority<t.priority}function ae(e,t){var a=Z(e,t);return a._tasks=new ot,a.push=function(e,t=0,n=()=>{}){if("function"!=typeof n)throw new Error("task callback must be a function");if(a.started=!0,Array.isArray(e)||(e=[e]),0===e.length&&a.idle())return Ee(()=>a.drain());for(var r,s=0,u=e.length;s<u;s++)r={data:e[s],priority:t,callback:n},a._tasks.push(r);Ee(a.process)},delete a.unshift,a}function ne(e,t,a,n){var i=[...e].reverse();return Ye(i,t,a,n)}function ie(e){var t=d(e);return a(function(e,a){return e.push((e,...t)=>{let n={};if(e&&(n.error=e),0<t.length){var i=t;1>=t.length&&([i]=t),n.value=i}a(null,n)}),t.apply(this,e)})}function re(e){var t;return Array.isArray(e)?t=e.map(ie):(t={},Object.keys(e).forEach(a=>{t[a]=ie.call(this,e[a])})),t}function se(e,t,a,n){const i=d(a);return Q(e,t,(e,t)=>{i(e,(e,a)=>{t(e,!a)})},n)}function le(e){return function(){return e}}function ue(e,t,a){function n(){r((e,...t)=>{!1===e||(e&&s++<i.times&&("function"!=typeof i.errorFilter||i.errorFilter(e))?setTimeout(n,i.intervalFunc(s-1)):a(e,...t))})}var i={times:gt,intervalFunc:le(kt)};if(3>arguments.length&&"function"==typeof e?(a=t||_(),t=e):(ce(i,e),a=a||_()),"function"!=typeof t)throw new Error("Invalid arguments for async.retry");var r=d(t),s=1;return n(),a[Fe]}function ce(e,a){if("object"==typeof a)e.times=+a.times||gt,e.intervalFunc="function"==typeof a.interval?a.interval:le(+a.interval||kt),e.errorFilter=a.errorFilter;else if("number"==typeof a||"string"==typeof a)e.times=+a||gt;else throw new Error("Invalid arguments for async.retry")}function pe(e,t){t||(t=e,e=null);let n=e&&e.arity||t.length;u(t)&&(n+=1);var i=d(t);return a((t,a)=>{function r(e){i(...t,e)}return(t.length<n-1||null==a)&&(t.push(a),a=_()),e?ue(e,r,a):ue(r,a),a[Fe]})}function de(e,t){return dt(je,e,t)}function oe(e,t,n){var i=d(e);return a((a,r)=>{var s,l=!1;a.push((...e)=>{l||(r(...e),clearTimeout(s))}),s=setTimeout(function(){var t=e.name||"anonymous",a=new Error("Callback function \""+t+"\" timed out.");a.code="ETIMEDOUT",n&&(a.info=n),l=!0,r(a)},t),i(...a)})}function he(e){for(var t=Array(e);e--;)t[e]=e;return t}function fe(e,t,a,n){var i=d(a);return qe(he(e),t,i,n)}function ye(e,t,a){return fe(e,1/0,t,a)}function me(e,t,a){return fe(e,1,t,a)}function ge(e,t,a,n){3>=arguments.length&&"function"==typeof t&&(n=a,a=t,t=Array.isArray(e)?[]:{}),n=m(n||_());var i=d(a);return Me(e,(e,a,n)=>{i(t,e,a,n)},e=>n(e,t)),n[Fe]}function ke(e){return(...t)=>(e.unmemoized||e)(...t)}function ve(e,t,a){const n=d(e);return bt(e=>n((t,a)=>e(t,!a)),t,a)}var Se,Le="function"==typeof setImmediate&&setImmediate,xe="object"==typeof process&&"function"==typeof process.nextTick;Se=Le?setImmediate:xe?process.nextTick:n;var Ee=i(Se);const be={};var Oe=e=>(t,a,n)=>{function i(e,t){if(!u)if(d-=1,e)l=!0,n(e);else if(!1===e)l=!0,u=!0;else{if(t===be||l&&0>=d)return l=!0,n(null);o||r()}}function r(){for(o=!0;d<e&&!l;){var t=s();if(null===t)return l=!0,void(0>=d&&n(null));d+=1,a(t.value,t.key,x(i))}o=!1}if(n=m(n),0>=e)throw new RangeError("concurrency limit cannot be less than 1");if(!t)return n(null);if(c(t))return E(t,e,a,n);if(p(t))return E(t[Symbol.asyncIterator](),e,a,n);var s=L(t),l=!1,u=!1,d=0,o=!1;r()},_e=o(function(e,t,a,n){return Oe(t)(e,d(a),n)},4),Me=o(function(e,t,a){var n=y(e)?b:O;return n(e,d(t),a)},3),Ae=o(function(e,t,a){return f(Me,e,t,a)},3),Ie=h(Ae),je=o(function(e,t,a){return _e(e,1,t,a)},3),we=o(function(e,t,a){return f(je,e,t,a)},3),Be=h(we);const Fe=Symbol("promiseCallback");var Te=/^(?:async\s+)?(?:function)?\s*\w*\s*\(\s*([^)]+)\s*\)(?:\s*{)/,Ce=/^(?:async\s+)?\(?\s*([^)=]+)\s*\)?(?:\s*=>)/,Pe=/,/,Re=/(=.+)?(\s*)$/,ze=/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;class Ne{constructor(){this.head=this.tail=null,this.length=0}removeLink(e){return e.prev?e.prev.next=e.next:this.head=e.next,e.next?e.next.prev=e.prev:this.tail=e.prev,e.prev=e.next=null,this.length-=1,e}empty(){for(;this.head;)this.shift();return this}insertAfter(e,t){t.prev=e,t.next=e.next,e.next?e.next.prev=t:this.tail=t,e.next=t,this.length+=1}insertBefore(e,t){t.prev=e.prev,t.next=e,e.prev?e.prev.next=t:this.head=t,e.prev=t,this.length+=1}unshift(e){this.head?this.insertBefore(this.head,e):j(this,e)}push(e){this.tail?this.insertAfter(this.tail,e):j(this,e)}shift(){return this.head&&this.removeLink(this.head)}pop(){return this.tail&&this.removeLink(this.tail)}toArray(){return[...this]}*[Symbol.iterator](){for(var e=this.head;e;)yield e.data,e=e.next}remove(e){for(var t=this.head;t;){var{next:a}=t;e(t)&&this.removeLink(t),t=a}return this}}var Ve,Ye=o(function(e,t,a,n){n=m(n);var r=d(a);return je(e,(e,a,n)=>{r(t,e,(e,a)=>{t=a,n(e)})},e=>n(e,t))},4),qe=o(function(e,t,a,n){return f(Oe(t),e,a,n)},4),De=o(function(e,t,a,n){var i=d(a);return qe(e,t,(e,t)=>{i(e,(e,...a)=>e?t(e):t(e,a))},(e,t)=>{for(var a=[],r=0;r<t.length;r++)t[r]&&(a=a.concat(...t[r]));return n(e,a)})},4),Qe=o(function(e,t,a){return De(e,1/0,t,a)},3),Ue=o(function(e,t,a){return De(e,1,t,a)},3),Ge=o(function(e,t,a){return R(e=>e,(e,t)=>t)(Me,e,t,a)},3),We=o(function(e,t,a,n){return R(e=>e,(e,t)=>t)(Oe(t),e,a,n)},4),He=o(function(e,t,a){return R(e=>e,(e,t)=>t)(Oe(1),e,t,a)},3),Je=z("dir"),Ke=o(function(e,t,a){function n(e,...t){return e?a(e):void(!1===e||(r=t,l(...t,i)))}function i(e,t){return e?a(e):!1===e?void 0:t?void s(n):a(null,...r)}a=x(a);var r,s=d(e),l=d(t);return i(null,!0)},3),Xe=o(function(e,t,a){return Me(e,V(d(t)),a)},3),Ze=o(function(e,t,a,n){return Oe(t)(e,V(d(a)),n)},4),$e=o(function(e,t,a){return Ze(e,1,t,a)},3),et=o(function(e,t,a){return R(e=>!e,e=>!e)(Me,e,t,a)},3),tt=o(function(e,t,a,n){return R(e=>!e,e=>!e)(Oe(t),e,a,n)},4),at=o(function(e,t,a){return R(e=>!e,e=>!e)(je,e,t,a)},3),nt=o(function(e,t,a){return Q(Me,e,t,a)},3),it=o(function(e,t,a,n){return Q(Oe(t),e,a,n)},4),rt=o(function(e,t,a){return Q(je,e,t,a)},3),st=o(function(e,t){function a(e){return e?n(e):void(!1===e||i(a))}var n=x(t),i=d(Y(e));return a()},2),lt=o(function(e,t,a,n){var i=d(a);return qe(e,t,(e,t)=>{i(e,(a,n)=>a?t(a):t(a,{key:n,val:e}))},(e,t)=>{for(var a={},{hasOwnProperty:r}=Object.prototype,s=0;s<t.length;s++)if(t[s]){var{key:l}=t[s],{val:u}=t[s];r.call(a,l)?a[l].push(u):a[l]=[u]}return n(e,a)})},4),ut=z("log"),ct=o(function(e,t,a,n){n=m(n);var i={},r=d(a);return Oe(t)(e,(e,t,a)=>{r(e,t,(e,n)=>e?a(e):void(i[t]=n,a(e)))},e=>n(e,i))},4);Ve=xe?process.nextTick:Le?setImmediate:n;var pt=i(Ve),dt=o((e,t,a)=>{var n=y(t)?[]:{};e(t,(e,t,a)=>{d(e)((e,...i)=>{2>i.length&&([i]=i),n[t]=i,a(e)})},e=>a(e,n))},3);class ot{constructor(){this.heap=[],this.pushCount=Number.MIN_SAFE_INTEGER}get length(){return this.heap.length}empty(){return this.heap=[],this}percUp(e){for(let a;0<e&&te(this.heap[e],this.heap[a=ee(e)]);){let n=this.heap[e];this.heap[e]=this.heap[a],this.heap[a]=n,e=a}}percDown(e){for(let a,n;(a=$(e))<this.heap.length&&(a+1<this.heap.length&&te(this.heap[a+1],this.heap[a])&&++a,!te(this.heap[e],this.heap[a]));)n=this.heap[e],this.heap[e]=this.heap[a],this.heap[a]=n,e=a}push(e){e.pushCount=++this.pushCount,this.heap.push(e),this.percUp(this.heap.length-1)}unshift(e){return this.heap.push(e)}shift(){let[e]=this.heap;return this.heap[0]=this.heap[this.heap.length-1],this.heap.pop(),this.percDown(0),e}toArray(){return[...this]}*[Symbol.iterator](){for(let e=0;e<this.heap.length;e++)yield this.heap[e].data}remove(e){let t=0;for(let a=0;a<this.heap.length;a++)e(this.heap[a])||(this.heap[t]=this.heap[a],t++);this.heap.splice(t);for(let t=ee(this.heap.length-1);0<=t;t--)this.percDown(t);return this}}var ht=o(function(e,t){if(t=m(t),!Array.isArray(e))return t(new TypeError("First argument to race must be an array of functions"));if(!e.length)return t();for(var a=0,n=e.length;a<n;a++)d(e[a])(t)},2),ft=o(function(e,t,a){return se(Me,e,t,a)},3),yt=o(function(e,t,a,n){return se(Oe(t),e,a,n)},4),mt=o(function(e,t,a){return se(je,e,t,a)},3);const gt=5,kt=0;var vt=o(function(e,t,a){return R(Boolean,e=>e)(Me,e,t,a)},3),St=o(function(e,t,a,n){return R(Boolean,e=>e)(Oe(t),e,a,n)},4),Lt=o(function(e,t,a){return R(Boolean,e=>e)(je,e,t,a)},3),xt=o(function(e,t,a){function n(e,t){var n=e.criteria,a=t.criteria;return n<a?-1:n>a?1:0}var i=d(t);return Ae(e,(e,t)=>{i(e,(a,n)=>a?t(a):void t(a,{value:e,criteria:n}))},(e,t)=>e?a(e):void a(null,t.sort(n).map(e=>e.value)))},3),Et=o(function(e,t){var a,n=null;return $e(e,(e,t)=>{d(e)((e,...i)=>!1===e?t(e):void(2>i.length?[a]=i:a=i,n=e,t(e?null:{})))},()=>t(n,a))}),bt=o(function(e,t,a){function n(e,...t){if(e)return a(e);l=t;!1===e||s(i)}function i(e,t){return e?a(e):!1===e?void 0:t?void r(n):a(null,...l)}a=x(a);var r=d(t),s=d(e),l=[];return s(i)},3),Ot=o(function(e,t){function a(t){var a=d(e[i++]);a(...t,x(n))}function n(n,...r){return!1===n?void 0:n||i===e.length?t(n,...r):void a(r)}if(t=m(t),!Array.isArray(e))return t(new Error("First argument to waterfall must be an array of functions"));if(!e.length)return t();var i=0;a([])});e.default={apply:t,applyEach:Ie,applyEachSeries:Be,asyncify:r,auto:M,autoInject:I,cargo:B,cargoQueue:F,compose:C,concat:Qe,concatLimit:De,concatSeries:Ue,constant:P,detect:Ge,detectLimit:We,detectSeries:He,dir:Je,doUntil:N,doWhilst:Ke,each:Xe,eachLimit:Ze,eachOf:Me,eachOfLimit:_e,eachOfSeries:je,eachSeries:$e,ensureAsync:Y,every:et,everyLimit:tt,everySeries:at,filter:nt,filterLimit:it,filterSeries:rt,forever:st,groupBy:U,groupByLimit:lt,groupBySeries:G,log:ut,map:Ae,mapLimit:qe,mapSeries:we,mapValues:W,mapValuesLimit:ct,mapValuesSeries:H,memoize:J,nextTick:pt,parallel:K,parallelLimit:X,priorityQueue:ae,queue:Z,race:ht,reduce:Ye,reduceRight:ne,reflect:ie,reflectAll:re,reject:ft,rejectLimit:yt,rejectSeries:mt,retry:ue,retryable:pe,seq:T,series:de,setImmediate:Ee,some:vt,someLimit:St,someSeries:Lt,sortBy:xt,timeout:oe,times:ye,timesLimit:fe,timesSeries:me,transform:ge,tryEach:Et,unmemoize:ke,until:ve,waterfall:Ot,whilst:bt,all:et,allLimit:tt,allSeries:at,any:vt,anyLimit:St,anySeries:Lt,find:Ge,findLimit:We,findSeries:He,flatMap:Qe,flatMapLimit:De,flatMapSeries:Ue,forEach:Xe,forEachSeries:$e,forEachLimit:Ze,forEachOf:Me,forEachOfSeries:je,forEachOfLimit:_e,inject:Ye,foldl:Ye,foldr:ne,select:nt,selectLimit:it,selectSeries:rt,wrapSync:r,during:bt,doDuring:Ke},e.apply=t,e.applyEach=Ie,e.applyEachSeries=Be,e.asyncify=r,e.auto=M,e.autoInject=I,e.cargo=B,e.cargoQueue=F,e.compose=C,e.concat=Qe,e.concatLimit=De,e.concatSeries=Ue,e.constant=P,e.detect=Ge,e.detectLimit=We,e.detectSeries=He,e.dir=Je,e.doUntil=N,e.doWhilst=Ke,e.each=Xe,e.eachLimit=Ze,e.eachOf=Me,e.eachOfLimit=_e,e.eachOfSeries=je,e.eachSeries=$e,e.ensureAsync=Y,e.every=et,e.everyLimit=tt,e.everySeries=at,e.filter=nt,e.filterLimit=it,e.filterSeries=rt,e.forever=st,e.groupBy=U,e.groupByLimit=lt,e.groupBySeries=G,e.log=ut,e.map=Ae,e.mapLimit=qe,e.mapSeries=we,e.mapValues=W,e.mapValuesLimit=ct,e.mapValuesSeries=H,e.memoize=J,e.nextTick=pt,e.parallel=K,e.parallelLimit=X,e.priorityQueue=ae,e.queue=Z,e.race=ht,e.reduce=Ye,e.reduceRight=ne,e.reflect=ie,e.reflectAll=re,e.reject=ft,e.rejectLimit=yt,e.rejectSeries=mt,e.retry=ue,e.retryable=pe,e.seq=T,e.series=de,e.setImmediate=Ee,e.some=vt,e.someLimit=St,e.someSeries=Lt,e.sortBy=xt,e.timeout=oe,e.times=ye,e.timesLimit=fe,e.timesSeries=me,e.transform=ge,e.tryEach=Et,e.unmemoize=ke,e.until=ve,e.waterfall=Ot,e.whilst=bt,e.all=et,e.allLimit=tt,e.allSeries=at,e.any=vt,e.anyLimit=St,e.anySeries=Lt,e.find=Ge,e.findLimit=We,e.findSeries=He,e.flatMap=Qe,e.flatMapLimit=De,e.flatMapSeries=Ue,e.forEach=Xe,e.forEachSeries=$e,e.forEachLimit=Ze,e.forEachOf=Me,e.forEachOfSeries=je,e.forEachOfLimit=_e,e.inject=Ye,e.foldl=Ye,e.foldr=ne,e.select=nt,e.selectLimit=it,e.selectSeries=rt,e.wrapSync=r,e.during=bt,e.doDuring=Ke,Object.defineProperty(e,"__esModule",{value:!0})});