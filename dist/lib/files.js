import i from"../options/index.js";import e from"./files/pipeline.js";import o from"./files/not.js";import p from"./files/by.js";import n from"./files/in.js";class c{pipeline=async(t=i.pipeline)=>await e(this,t);not=async t=>await o(this,t);by=async(t="**/*")=>await p(this,t);in=async(t="./")=>await n(this,t);pipe={files:0,debug:2,info:{},current:{inputPath:"",outputPath:"",fileSizeAfter:0,fileSizeBefore:0,buffer:""}};paths=new Map;results=new Map;constructor(t=2){this.pipe.debug=t}}export{c as default};
