import{P as N,F as x,G as I,A as w,E as C}from"./AddSong.49724916.js";import{_ as S,H,r as d,j as k,o as u,c as p,i as c,n as A,k as O,g as E,a as r,w as M,t as _,F as T,e as V,p as B,b as F,d as L,f as R}from"./index.ce547255.js";const q=new H("reapOne.playlist",22),G={components:{PlaylistEntry:N,FixedPlaylistHeader:x,GridHeader:I,AddSong:w,EditPlaylist:C},name:"Playlist",props:{authorised:Boolean,userData:Object},data(){var a,e,n;if(this.updatePlaylist(),!this.getId()||!this.$route.path.includes("/playlist/"))return;const t=(n=(e=(a=this.userData)==null?void 0:a.data)==null?void 0:e.playlists)==null?void 0:n[Number(this.getId())],s=(t==null?void 0:t.songs)||[],i=(t==null?void 0:t.name)||"N/A",o=(t==null?void 0:t.description)||"";return document.title=`${i} - reAudioPlayer One`,{fixedHeaderHidden:!0,playlist:s,playlistName:i,playlistDescription:o}},methods:{getId(){return q.decode(this.$route.params.id)},download(t){var i;const s=(i=this.playlist)==null?void 0:i[t];window.open("/api/download/"+s.id)},updatePlaylist(){var s,i,o;if(!this.getId()||!this.$route.path.includes("/playlist/"))return;const t=(o=(i=(s=this.userData)==null?void 0:s.data)==null?void 0:i.playlists)==null?void 0:o[Number(this.getId())];this.playlist=(t==null?void 0:t.songs)||[],this.playlistName=(t==null?void 0:t.name)||"N/A",this.playlistDescription=(t==null?void 0:t.description)||"",document.title=`${this.playlistName} - reAudioPlayer One`},onPlaylistRearrange(t){const s=t.moved;!s||fetch("/api/rearrange",{method:"POST",body:JSON.stringify({playlistIndex:Number(this.getId()),songOldIndex:s.oldIndex,songNewIndex:s.newIndex})})},headerVisibilityChanged(t){this.fixedHeaderHidden=t},updateData(t){var s;if(t.path=="player.song"){let i=((s=t==null?void 0:t.data)==null?void 0:s.title)||"N/A";for(const o of this.playlist)o.playing=o.title==i}},loadPlaylist(){fetch("/api/loadPlaylist",{method:"POST",body:JSON.stringify({id:Number(this.getId()),type:"playlist"})})},addToPlaylist(){this.$refs.addSongPopup.showModal=!0},editPlaylist(){this.$refs.editPlaylistPopup.showModal=!0}},computed:{playlistCover(){var t,s;return console.log(this.playlist),(s=(t=this.playlist)==null?void 0:t[0])==null?void 0:s.cover},autogeneratedDescription(){var t,s,i;return`${(i=(s=(t=this.userData)==null?void 0:t.user)==null?void 0:s.userinfo)==null?void 0:i.name} \u2022 ${this.playlist.length} ${this.playlist.length==1?"song":"songs"} ${this.estimatedDuration}`},estimatedDuration(){let t=0,s=!1;if(!this.playlist.length)return"";for(const n of this.playlist){console.log(n.duration),s=s||n.duration=="-1:59";const y=n.duration=="-1:59"?"3:00":n.duration,[h,m]=y.split(":");t+=Number(h*60)+Number(m)}const i=t,o=Math.floor(i/60),a=Math.floor(o/60),e=s?", about ":", ";return a?e+`${a} hr ${o-a*60} min`:o?e+`${o} min ${i-o*60} sec`:e+t+" sec"}},watch:{$route(){this.updatePlaylist()},userData(){this.updatePlaylist()}}},f=t=>(B("data-v-e56dff2a"),t=t(),F(),t),J={class:"playlist"},U=["src"],z={class:"details"},K=R("Playlist"),Q={class:"muted description"},W={class:"mobileMenu showIfMobile"},X=f(()=>r("hr",null,null,-1)),Y={class:"padding-20"},Z={class:"grid"},$=f(()=>r("hr",null,null,-1)),j={class:"playlistEntries"};function tt(t,s,i,o,a,e){const n=d("AddSong"),y=d("EditPlaylist"),h=d("fixed-playlist-header"),m=d("h7"),g=d("grid-header"),P=d("playlist-entry"),v=k("observe-visibility");return u(),p("div",J,[c(n,{onClose:e.updatePlaylist,ref:"addSongPopup",userData:i.userData},null,8,["onClose","userData"]),c(y,{onClose:e.updatePlaylist,playlistName:a.playlistName,playlistDescription:a.playlistDescription,ref:"editPlaylistPopup",userData:i.userData},null,8,["onClose","playlistName","playlistDescription","userData"]),c(h,{onLoadPlaylist:e.loadPlaylist,ref:"fixedHeading",class:A({hidden:a.fixedHeaderHidden}),title:a.playlistName},null,8,["onLoadPlaylist","class","title"]),O((u(),p("div",{class:"padding-20 playlisteditor",onClick:s[0]||(s[0]=(...l)=>e.editPlaylist&&e.editPlaylist(...l))},[e.playlistCover?(u(),p("img",{key:0,class:"cover",src:e.playlistCover},null,8,U)):E("",!0),r("div",z,[c(m,null,{default:M(()=>[K]),_:1}),r("h1",null,_(a.playlistName),1),r("h5",null,_(a.playlistDescription),1),r("p",Q,_(e.autogeneratedDescription),1)])])),[[v,e.headerVisibilityChanged]]),r("div",W,[r("span",{onClick:s[1]||(s[1]=()=>t.$emit("toggleFullSidebar")),class:"material-symbols-rounded"},"menu")]),X,r("div",Y,[r("span",{id:"loadPlaylist",onClick:s[2]||(s[2]=(...l)=>e.loadPlaylist&&e.loadPlaylist(...l)),class:"material-symbols-rounded"},"play_circle_filled"),r("span",{id:"addToPlaylist",onClick:s[3]||(s[3]=(...l)=>e.addToPlaylist&&e.addToPlaylist(...l)),class:"material-symbols-rounded"},"add_circle"),r("div",Z,[c(g,{class:"hideIfMobile"}),$,r("div",j,[(u(!0),p(T,null,V(a.playlist,(l,D)=>(u(),L(P,{onDownload:e.download,key:D,onRequestUpdate:e.updatePlaylist,userData:i.userData,index:a.playlist.findIndex(b=>b.source==l.source),source:l.source,playing:l.playing,id:l.id,title:l.title,album:l.album,artist:l.artist,cover:l.cover,favourite:l.favourite,duration:l.duration},null,8,["onDownload","onRequestUpdate","userData","index","source","playing","id","title","album","artist","cover","favourite","duration"]))),128))])])])])}var it=S(G,[["render",tt],["__scopeId","data-v-e56dff2a"]]);export{it as default};