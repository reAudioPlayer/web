import{F as I}from"./FullShelf.3e44c631.js";import{_ as w,o as r,c as n,a as i,t as u,f,r as h,h as k,b as d,w as g,F as m,d as v}from"./index.4ec1183c.js";import{C as N}from"./CollectionHeader.5fc18026.js";const B={name:"ReleaseItem",methods:{redirect(){this.$refs.addAlbum.showModal=!0}},props:{cover:String,title:String,artist:String,href:String,releaseDate:String}},C={class:"wrapper"},R=["src"],b={key:0,class:"note"};function x(l,s,e,o,a,c){return r(),n("div",C,[i("div",{class:"item",onClick:s[0]||(s[0]=(..._)=>c.redirect&&c.redirect(..._))},[i("img",{src:e.cover},null,8,R),i("h4",null,u(e.title),1),i("p",null,u(e.artist),1),e.releaseDate?(r(),n("p",b,"Released on "+u(e.releaseDate),1)):f("",!0)])])}var A=w(B,[["render",x],["__scopeId","data-v-9940d4e4"]]);const O={name:"ReleaseItemBig",methods:{redirect(){this.$refs.addAlbum.showModal=!0}},props:{cover:String,title:String,artist:String,href:String,releaseDate:String}},F={class:"itemBig"},$=["src"],j={class:"wrapper"},M={key:0,class:"note"};function T(l,s,e,o,a,c){return r(),n("div",F,[i("div",{class:"item",onClick:s[0]||(s[0]=(..._)=>c.redirect&&c.redirect(..._))},[i("img",{src:e.cover},null,8,$),i("div",j,[i("h4",null,u(e.title),1),i("p",null,u(e.artist),1),e.releaseDate?(r(),n("p",M,"Released on "+u(e.releaseDate),1)):f("",!0)])])])}var H=w(O,[["render",T],["__scopeId","data-v-6b1e6eed"]]);const J={components:{CollectionHeader:N,FullShelf:I,Item:A,ItemBig:H},name:"Releases",props:{authorised:Boolean,userData:Object},data(){return{outSoon:[],outNow:[],outAlready:[]}},methods:{load(l){const s=new Date;for(const e of l){const o=new Date(e.releaseDate);s<o?this.outSoon.push(e):s.getMonth()==o.getMonth()&&s.getDate()==o.getDate()&&s.getFullYear()==o.getFullYear()?this.outNow.push(e):this.outAlready.push(e)}}},mounted(){var s,e;const l="apollo.releaseCache";if(window.localStorage.getItem(l))this.load(JSON.parse(window.localStorage.getItem(l)));else if(window.location.hash)fetch("/spotify/releaseRadar",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({accessToken:window.location.hash.split("=")[1]})}).then(o=>o.json()).then(o=>{window.localStorage.setItem(l,JSON.stringify(o)),window.setTimeout(()=>window.localStorage.removeItem(l),30*60*1e3),this.load(o)});else if(((s=this.userData.data)==null?void 0:s.spotifyApiId)&&((e=this.userData.data)==null?void 0:e.spotifyApiSecret)){const o=window.location.href,a="user-follow-read playlist-modify-public";window.location.href=`https://accounts.spotify.com/authorize?client_id=${this.userData.data.spotifyApiId}&redirect_uri=${o.replace("#","%23")}&scope=${a}&response_type=token&state=123`}}},V={class:"padding-20"},Y={class:"releases"};function z(l,s,e,o,a,c){const _=h("CollectionHeader"),y=h("item-big"),p=h("full-shelf"),D=h("ItemBig"),S=h("Item");return r(),n("div",V,[k(_),i("div",Y,[a.outSoon.length?(r(),d(p,{key:0,heading:"Out Soon"},{default:g(()=>[(r(!0),n(m,null,v(a.outSoon,t=>(r(),d(y,{key:t.url,releaseDate:t.releaseDate,cover:t.cover,href:t.url,artist:t.artists.join(", "),title:t.title},null,8,["releaseDate","cover","href","artist","title"]))),128))]),_:1})):f("",!0),a.outNow.length?(r(),d(p,{key:1,heading:"Out Now"},{default:g(()=>[(r(!0),n(m,null,v(a.outNow,t=>(r(),d(D,{key:t.url,releaseDate:t.releaseDate,cover:t.cover,href:t.url,artist:t.artists.join(", "),title:t.title},null,8,["releaseDate","cover","href","artist","title"]))),128))]),_:1})):f("",!0),a.outAlready.length?(r(),d(p,{key:2,heading:"Releases"},{default:g(()=>[(r(!0),n(m,null,v(a.outAlready,t=>(r(),d(S,{key:t.url,releaseDate:t.releaseDate,cover:t.cover,href:t.url,artist:t.artists.join(", "),title:t.title},null,8,["releaseDate","cover","href","artist","title"]))),128))]),_:1})):f("",!0)])])}var U=w(J,[["render",z],["__scopeId","data-v-acf25fe4"]]);export{U as default};
