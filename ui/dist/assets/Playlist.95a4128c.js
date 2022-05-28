import{_ as m,o as c,c as p,p as b,i as w,a as i,r as y,t as _,h,e as I,f as P,n as u,H as x,w as g,j as H,k as C,F as T,d as $,b as A}from"./index.4ec1183c.js";const D={name:"GridHeader"},v=e=>(b("data-v-50c56ea2"),e=e(),w(),e),L={class:"gridHeader"},B=v(()=>i("span",{class:"id"},"#",-1)),E=v(()=>i("span",{class:"title"},"Title",-1)),F=v(()=>i("span",{class:"album"},"Album",-1)),J=v(()=>i("span",{class:"clock material-symbols-rounded"},"schedule",-1)),V=[B,E,F,J];function U(e,t,s,r,l,a){return c(),p("div",L,V)}var k=m(D,[["render",U],["__scopeId","data-v-50c56ea2"]]);const W={name:"FixedPlaylistHeader",components:{GridHeader:k},props:{title:String}},z={class:"fixedPlaylistHeader"},G={class:"upperWrapper"};function R(e,t,s,r,l,a){const n=y("grid-header");return c(),p("div",z,[i("div",G,[i("span",{id:"loadPlaylist",onClick:t[0]||(t[0]=f=>this.$emit("loadPlaylist")),class:"material-symbols-rounded"},"play_circle_filled"),i("h3",null,_(s.title),1)]),h(n,{class:"padding-20 darkback"})])}var K=m(W,[["render",R],["__scopeId","data-v-3a0a219e"]]);const Q={name:"Marquee",mounted(){this.update(),window.addEventListener("resize",this.update)},data(){return{isMarquee:!1}},methods:{isTruncated(e){return e.scrollWidth>e.clientWidth},update(){this.isMarquee=!1,setTimeout(()=>{this.isMarquee=this.isTruncated(this.$refs.marquee)},10)}},props:{text:String},watch:{text(){this.update()}}},X={key:0,class:"replacer"},Y={key:0,class:"overlay"};function Z(e,t,s,r,l,a){return c(),p("div",{class:u(["marqueeWrapper",{marquee:l.isMarquee}])},[i("span",{ref:"marquee",class:u({marquee:l.isMarquee})},[I(_(s.text)+" ",1),l.isMarquee?(c(),p("span",X,_(s.text),1)):P("",!0)],2),l.isMarquee?(c(),p("div",Y)):P("",!0)],2)}var j=m(Q,[["render",Z],["__scopeId","data-v-bf0ff45e"]]);const ee=new x("reapOne.track",22),te=new x("reapOne.playlist",22),se={name:"PlaylistEntry",components:{Marquee:j},props:{index:Number,id:Number,source:String,artist:{type:String,default:"N/A"},cover:{type:String,default:"/assets/img/music_placeholder.png"},title:{type:String,default:"N/A"},album:{type:String,default:"N/A"},duration:{type:String,default:"N/A"},favourite:{type:Boolean,default:!1},playing:{type:Boolean,default:!1}},data(){return{highlighted:!1,favourited:this.favourite,isAutoPlaylist:this.$route.path=="/collection/tracks"}},computed:{trackId(){return ee.encode(this.id)}},methods:{getPlaylistId(){return te.decode(this.$route.params.id)},download(){this.$emit("download",this.index)},addToPlaylist(e){fetch("/api/add",{method:"POST",body:JSON.stringify({id:e,source:this.source})}).then(t=>{t.status==200&&this.$emit("requestUpdate")})},remove(){fetch("/api/remove",{method:"POST",body:JSON.stringify({playlistId:Number(this.getPlaylistId()),songId:this.id})}).then(e=>{e.status==200&&this.$emit("requestUpdate")})},update(){this.$refs.editSongPopup.showModal=!0},hideCtxMenu(){this.$refs.ctxMenu.hide()},showCtxMenu(e){console.log("show"),this.$refs.ctxMenu.show(e)},onselect(){this.highlighted=!this.highlighted,this.hideCtxMenu()},displayPlay(){const e=this.$refs.idOrPlay;e.innerHTML="play_arrow",e.classList.add("material-symbols-rounded")},displayId(){const e=this.$refs.idOrPlay;e.innerHTML=this.index+1,e.classList.remove("material-symbols-rounded")},playAt(){console.log(this.$route.path);const e={index:this.index};this.$route.path.includes("/playlist/")&&(e.playlistIndex=Number(this.getPlaylistId())),this.$route.path.includes("/collection/tracks")&&(e.type="collection"),fetch("/api/at",{method:"POST",body:JSON.stringify(e)})},setFavourite(){fetch("/api/updateSong",{method:"POST",body:JSON.stringify({id:this.id,favourite:this.favourited,album:this.album,artist:this.artist,title:this.title,duration:this.duration,cover:this.cover,source:this.source})})}},watch:{favourited(){this.setFavourite()},favourite(){console.log("mounted",this.title,this.favourite,this.favourited),this.favourited=this.favourite,this.highlighted=!1}}},ie={class:"track"},ae=["src"],le={class:"trackwrapper"},de={class:"duration"};function re(e,t,s,r,l,a){const n=y("Marquee"),f=y("router-link");return c(),p("div",{onDblclick:t[3]||(t[3]=()=>{a.playAt(),a.onselect()}),onClick:t[4]||(t[4]=(...o)=>a.onselect&&a.onselect(...o)),onMouseover:t[5]||(t[5]=(...o)=>a.displayPlay&&a.displayPlay(...o)),onMouseleave:t[6]||(t[6]=(...o)=>a.displayId&&a.displayId(...o)),class:u(["playlistEntry",{selected:l.highlighted}])},[i("span",{onClick:t[0]||(t[0]=(...o)=>a.playAt&&a.playAt(...o)),ref:"idOrPlay",class:u([{playing:s.playing},"id"])},_(s.index+1),3),i("div",ie,[i("img",{src:s.cover||"/assets/img/music_placeholder.png"},null,8,ae),i("div",le,[i("span",{class:u(["title",{playing:s.playing}])},[h(f,{class:"linkOnHover",to:`/track/${a.trackId}`},{default:g(()=>[h(n,{text:s.title},null,8,["text"])]),_:1},8,["to"])],2),i("span",{class:u(["artist",{playing:s.playing}])},[h(f,{class:"linkOnHover",to:`/search/${s.artist}`},{default:g(()=>[h(n,{text:s.artist},null,8,["text"])]),_:1},8,["to"])],2)])]),i("span",{class:u(["album",{playing:s.playing}])},[h(n,{text:s.album},null,8,["text"])],2),i("span",{onClick:t[1]||(t[1]=o=>l.favourited=!l.favourited),class:u(["favourite material-symbols-rounded",{showfavourite:l.favourited||l.highlighted,active:l.favourited}])},"favorite",2),i("span",de,_(s.duration),1),i("span",{onClick:t[2]||(t[2]=(...o)=>a.showCtxMenu&&a.showCtxMenu(...o)),class:u(["more material-symbols-rounded",{hidden:!l.highlighted}])},"more_horiz",2)],34)}var oe=m(se,[["render",re],["__scopeId","data-v-49d7bb1f"]]);const ne=new x("reapOne.playlist",22),ue={components:{PlaylistEntry:oe,FixedPlaylistHeader:K,GridHeader:k},name:"Playlist",props:{authorised:Boolean,userData:Object},data(){var l,a,n;if(this.updatePlaylist(),!this.getId()||!this.$route.path.includes("/playlist/"))return;const e=(n=(a=(l=this.userData)==null?void 0:l.data)==null?void 0:a.playlists)==null?void 0:n[Number(this.getId())];document.title=`${this.playlistName} - reAudioPlayer One`,console.log(e.songs);const t=e.songs,s=e.name,r=e.description;return{fixedHeaderHidden:!0,playlist:t,playlistName:s,playlistDescription:r}},methods:{getId(){return ne.decode(this.$route.params.id)},download(e){var s;const t=(s=this.playlist)==null?void 0:s[e];window.open("/api/download/"+t.id)},updatePlaylist(){var t,s,r;if(!this.getId()||!this.$route.path.includes("/playlist/"))return;const e=(r=(s=(t=this.userData)==null?void 0:t.data)==null?void 0:s.playlists)==null?void 0:r[Number(this.getId())];document.title=`${this.playlistName} - reAudioPlayer One`,console.log(e.songs),this.playlist=e.songs,this.playlistName=e.name,this.playlistDescription=e.description},onPlaylistRearrange(e){const t=e.moved;!t||fetch("/api/rearrange",{method:"POST",body:JSON.stringify({playlistIndex:Number(this.getId()),songOldIndex:t.oldIndex,songNewIndex:t.newIndex})})},headerVisibilityChanged(e){this.fixedHeaderHidden=e},updateData(e){var t;if(e.path=="player.song"){let s=((t=e==null?void 0:e.data)==null?void 0:t.title)||"N/A";for(const r of this.playlist)r.playing=r.title==s}},loadPlaylist(){fetch("/api/loadPlaylist",{method:"POST",body:JSON.stringify({id:Number(this.getId()),type:"playlist"})})}},watch:{$route(){this.updatePlaylist()}}},N=e=>(b("data-v-183e26e0"),e=e(),w(),e),ce={class:"playlist"},he=I("Playlist"),pe=N(()=>i("hr",null,null,-1)),ye={class:"padding-20"},_e={class:"grid"},fe=N(()=>i("hr",null,null,-1)),me={class:"playlistEntries"};function ve(e,t,s,r,l,a){const n=y("fixed-playlist-header"),f=y("h7"),o=y("grid-header"),S=y("playlist-entry"),M=H("observe-visibility");return c(),p("div",ce,[h(n,{onLoadPlaylist:a.loadPlaylist,ref:"fixedHeading",class:u({hidden:l.fixedHeaderHidden}),title:l.playlistName},null,8,["onLoadPlaylist","class","title"]),C((c(),p("div",{class:"padding-20 playlisteditor",onClick:t[0]||(t[0]=(...d)=>e.editPlaylist&&e.editPlaylist(...d))},[h(f,null,{default:g(()=>[he]),_:1}),i("h1",null,_(l.playlistName),1),i("h5",null,_(l.playlistDescription),1)])),[[M,a.headerVisibilityChanged]]),pe,i("div",ye,[i("span",{id:"loadPlaylist",onClick:t[1]||(t[1]=(...d)=>a.loadPlaylist&&a.loadPlaylist(...d)),class:"material-symbols-rounded"},"play_circle_filled"),i("span",{id:"addToPlaylist",onClick:t[2]||(t[2]=(...d)=>e.addToPlaylist&&e.addToPlaylist(...d)),class:"material-symbols-rounded"},"add_circle"),i("div",_e,[h(o),fe,i("div",me,[(c(!0),p(T,null,$(l.playlist,(d,O)=>(c(),A(S,{onDownload:a.download,key:O,onRequestUpdate:a.updatePlaylist,index:l.playlist.findIndex(q=>q.source==d.source),source:d.source,playing:d.playing,id:d.id,title:d.title,album:d.album,artist:d.artist,cover:d.cover,favourite:d.favourite,duration:d.duration},null,8,["onDownload","onRequestUpdate","index","source","playing","id","title","album","artist","cover","favourite","duration"]))),128))])])])])}var xe=m(ue,[["render",ve],["__scopeId","data-v-183e26e0"]]);export{xe as default};
