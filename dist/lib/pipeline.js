import i from"../options/index.js";import s from"./deepmerge.js";import p from"./files.js";class n{options;paths=new Set;constructor(t={}){this.options=t,this.mergeDefaultOptions(i)}mergeDefaultOptions(t){for(const o in this.options)Object.prototype.hasOwnProperty.call(t,o)&&this.options[o]===!0&&(this.options[o]=t[o]);if(this.options=s(t,this.options),typeof this.options.path<"u")if(this.options.path instanceof Array||this.options.path instanceof Set)for(const o of this.options.path)this.paths.add(o);else this.paths.add(this.options.path)}async process(){for(const t of this.paths)await(await(await(await new p(this.options.logger).in(t)).by(this.options.files)).not(this.options.exclude)).pipeline(this.options.pipeline);return this}}export{n as default};
