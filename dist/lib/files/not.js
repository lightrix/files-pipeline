var t=async(o,s)=>{const i=new Set;if(typeof s<"u")if(s instanceof Array||s instanceof Set)for(const e of s)i.add(e);else i.add(s);for(const e of i){if(typeof e=="string")for(const f of o.results)(f[0].match(e)||f[1].match(e))&&o.results.delete(f[0]);if(typeof e=="function")for(const f of o.results)(e(f[0])||e(f[1]))&&o.results.delete(f[0])}return o};export{t as default};
