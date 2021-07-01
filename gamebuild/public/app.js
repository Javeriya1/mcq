!function(e){function t(t){for(var i,o,r=t[0],c=t[1],l=t[2],d=0,m=[];d<r.length;d++)o=r[d],Object.prototype.hasOwnProperty.call(a,o)&&a[o]&&m.push(a[o][0]),a[o]=0;for(i in c)Object.prototype.hasOwnProperty.call(c,i)&&(e[i]=c[i]);for(h&&h(t);m.length;)m.shift()();return n.push.apply(n,l||[]),s()}function s(){for(var e,t=0;t<n.length;t++){for(var s=n[t],i=!0,r=1;r<s.length;r++){var c=s[r];0!==a[c]&&(i=!1)}i&&(n.splice(t--,1),e=o(o.s=s[0]))}return e}var i={},a={0:0},n=[];function o(t){if(i[t])return i[t].exports;var s=i[t]={i:t,l:!1,exports:{}};return e[t].call(s.exports,s,s.exports,o),s.l=!0,s.exports}o.m=e,o.c=i,o.d=function(e,t,s){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(o.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)o.d(s,i,function(t){return e[t]}.bind(null,i));return s},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="";var r=window.webpackJsonp=window.webpackJsonp||[],c=r.push.bind(r);r.push=t,r=r.slice();for(var l=0;l<r.length;l++)t(r[l]);var h=c;n.push([1,1]),s()}([,function(e,t,s){"use strict";s.r(t);var i=s(0),a=s.n(i);class n extends a.a.Scene{constructor(e){super("PlayScene"),this.config=e,this.fontSize=18,this.fontFamily="Arial",this.fontOptions={fontSize:this.fontSize+"px",fontFamily:""+this.fontFamily,fill:"#000"},this.json,this.startingPointX=90,this.optionStaringX=80,this.gapX=180,this.startingPointY=200,this.gapY=200,this.numOfItemsInRow=3,this.menuItems=[],this.textStart={x:0,y:0},this.gapBetweenText=42}preload(){this.load.json("data","assets/data/mcq.json"),this.load.image("logo","assets/logo.png"),this.load.image("spark","assets/blue.png"),this.load.on("filecomplete-json-data",((e,t,s)=>{this.load.image("background","assets/"+s.gameData.background),this.json=s,this.randomizeItems();for(let e=0;e<this.json.gameData.items.length;e++)this.load.image("items"+e,"assets/"+this.json.gameData.items[e].image);const i=this.json.gameData.items[0].choices.length;this.textStart.x=(i-1)*(.5*this.gapBetweenText)}))}randomizeItems(){if(1==this.json.gameData.isRandonmize){let e,t,s=0,i=this.json.gameData.items.length,a=this.json.gameData.items;for(;s<i;s++)e=Math.floor(Math.random()*i),t=a[s],a[s]=a[e],a[e]=t}}create(){this.background=this.add.image(0,0,"background").setOrigin(0).setScale(2),this.add.image(40,20,"logo").setOrigin(0).setScale(1.5),this.add.text(20,100,this.json.gameData.heading,this.fontOptions),this.particles=this.add.particles("spark"),this.particlesBackground=this.add.particles("spark").setDepth(1),this.createMenuItems()}createMenuItems(){for(let e=0;e<this.json.gameData.items.length;e++)this.createItem(this.json.gameData.items[e],e)}createItem(e,t){this.menuItems[t]={},this.menuItems[t].image=this.add.image(this.startingPointX+this.gapX*(t%this.numOfItemsInRow),this.startingPointY+this.gapY*Math.floor(t/this.numOfItemsInRow),"items"+t),this.menuItems[t].choices=[],this.menuItems[t].isComplete=!1;for(let s=0;s<e.choices.length;s++)this.textWithCircles(this.menuItems[t],s,e.choices);this.setupMenuItems(this.menuItems[t])}textWithCircles(e,t,s){let i={};i.text=s[t].choice,i.circle="",e.choices[t]=i,e.choices[t].text=this.add.text(e.image.x-this.textStart.x+this.gapBetweenText*t,e.image.y+40,e.choices[t].text,this.fontOptions).setAlign("center").setOrigin(.5),e.choices[t].circle=this.add.circle(e.choices[t].text.x,e.choices[t].text.y+20,6),e.choices[t].circle.setStrokeStyle(1,0).setOrigin(.5),e.choices[t].circle.setDataEnabled(),e.choices[t].circle.data.set("isMatch",!!s[t].isCorrect),e.choices[t].circle.data.set("isSelected",!1)}setupMenuItems(e){const t=e.choices;for(let s=0;s<t.length;s++){const i=t[s];i.circle.setInteractive(),i.circle.on("pointerover",(()=>{i.circle.setScale(1.3)})),i.circle.on("pointerout",(()=>{i.circle.setScale(1)})),i.circle.on("pointerdown",(()=>{const a=i.circle.data.get("isMatch");i.circle.data.get("isSelected")||(i.circle.data.values.isSelected=!0,1==a?(e.isComplete=!0,i.circle.setFillStyle(223245),this.clearOtherCircles(s,t),this.positionToCenter(s,t,e)):(i.circle.setFillStyle(12977178),this.makeNormalColor(s,t,e)),this.matchAllItems(e))}))}}clearOtherCircles(e,t){for(let s=0;s<t.length;s++)e!=s&&(t[s].text.destroy(),t[s].circle.destroy())}makeNormalColor(e,t,s){for(let s=0;s<t.length;s++)e!=s&&(t[s].circle.data.values.isSelected=!1,t[s].circle.setFillStyle(16777215,0));this.tweengForWrongMatch(s)}tweengForWrongMatch(e){const t=this.add.text(e.image.x,e.image.y-50,"Try again",this.fontOptions).setOrigin(.5);this.tweens.add({targets:t,ease:"Power1",alpha:0,duration:1e3,onComplete:()=>{t.destroy()}}),this.tweens.add({targets:e.image,scale:{from:1,to:1.1},ease:"Power0",duration:300,delay:0,repeat:0,yoyo:!0})}positionToCenter(e,t,s){for(let i=0;i<t.length;i++)if(e==i){this.tweens.add({targets:t[i].text,x:s.image.x,ease:"POWER1",duration:1e3,yoyo:!1,repeat:0}),this.tweens.add({targets:t[i].circle,x:s.image.x,ease:"POWER1",duration:1e3,yoyo:!1,repeat:0});const e=this.particles.createEmitter({on:!1,x:s.image.x,y:s.image.y,speed:{min:-20,max:50},lifespan:2e3,scale:{start:.1,end:0},blendMode:"ADD"});e.start(),this.time.delayedCall(2e3,(()=>{e.stop(),e.killAll()})),this.time.delayedCall(2e3,(()=>{t[i].circle.destroy()}))}}matchAllItems(){let e=!0;for(let t=0;t<this.menuItems.length;t++)0==this.menuItems[t].isComplete&&(e=!1);e&&this.time.delayedCall(1500,(()=>{const e=this.add.text(this.scale.width/2,this.scale.height/2-10,"YOU WON!",this.fontOptions).setOrigin(.5);this.add.rectangle(this.scale.width/2,this.scale.height/2-10,190,60,16032864);e.setDepth(1),this.tweens.add({targets:e,ease:"Power2",scale:2,duration:1500});const t=this.particlesBackground.createEmitter({on:!1,delay:1e3,x:this.background.x+250,y:this.background.y-50,angle:{min:-180,max:-360},speed:{min:180,max:360},quantity:6,lifespan:1e4,scale:{start:.1,end:0},blendMode:"ADD"});t.start(),this.time.delayedCall(5e3,(()=>{t.stop()}))}))}}const o={width:540,height:700},r=[n],c=e=>new e(o),l={type:a.a.AUTO,...o,pixelArt:!0,physics:{default:"arcade",arcade:{debug:!1}},scene:r.map(c)};new a.a.Game(l)}]);