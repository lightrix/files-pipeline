import n from"./../../options/lib/compress/index.js";var s=async(t,i={})=>{const f=t.options.input.file.split(".").pop();if(!f)return;const p={avci:"avif",avcs:"avif",avifs:"avif",heic:"heif",heics:"heif",heifs:"heif",jfif:"jpeg",jif:"jpeg",jpe:"jpeg",jpg:"jpeg"},e=typeof p[f]<"u"?p[f]:typeof i[f]<"u"?f:!1;if(["avif","gif","heif","jpeg","png","raw","tiff","webp"].includes(e)&&typeof i[e]<"u"&&i[e]!==!1)return await t[e](i[e]!==!0?i[e]:n.img).toBuffer()};export{s as default};