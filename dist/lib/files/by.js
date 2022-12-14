import f from"fast-glob";var a=async(t,e)=>{if(!e)return t;for(const[r,s]of t.paths)for(const o of await f(e,{cwd:r,onlyFiles:!0}))t.results.set(`${s}${o}`,`${r}${o}`);return t};export{a as default};
