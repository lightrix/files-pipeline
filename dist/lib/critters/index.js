import l from"critters";import c from"../../options/lib/callbacks.js";import p from"../parse.js";import{fileURLToPath as f}from"url";import m from"../apply-to.js";import{deepmerge as r}from"deepmerge-ts";const u=r(c,{failed:async t=>`Error: Cannot inline file ${t} !`,fulfilled:async t=>`\x1B[32mSuccessfully inlined a total of ${t.files} ${t.type.toUpperCase()} ${t.files===1?"file":"files"}.\x1B[39m`,accomplished:!1});var w=async(t,i,s=2)=>{const o=m(t,e=>e instanceof URL?f(e):e),n=new l(r(i.critters,{path:o instanceof Map?o.keys().next().value:o,logLevel:(()=>{switch(s){case 0:return"silent";case 1:return"silent";case 2:return"info";default:return"info"}})()}));for(const e in i)if(Object.prototype.hasOwnProperty.call(i,e)){if(!i[e])continue;switch(e){case"critters":{await p(t,"**/*.html",s,"html",i?.exclude,()=>({...u,wrote:a=>n.process(a)}));break}default:break}}};export{w as default};
