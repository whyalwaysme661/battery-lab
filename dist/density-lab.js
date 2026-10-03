import {getLocale} from './i18n.js';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

const format=value=>new Intl.NumberFormat(getLocale()==='en'?'en-US':'zh-CN',{maximumFractionDigits:2}).format(value);

export function sampleReadout(area,current,referenceArea=100){
 if(!Number.isFinite(area)||area<=0||!Number.isFinite(current)||current<0||!Number.isFinite(referenceArea)||referenceArea<=0)throw new Error('试样面积和电流无效');
 return {side:Math.sqrt(area),density:current/area,referenceDensity:current/referenceArea,areaRatio:referenceArea/area};
}

export function clampSampleArea(value,min=10,max=200){
 if(!Number.isFinite(value))return min;
 return Math.max(min,Math.min(max,Math.round(value/5)*5));
}

function grainTexture(solar=false){
 const canvas=document.createElement('canvas');canvas.width=canvas.height=512;
 const ctx=canvas.getContext('2d'),pixels=ctx.createImageData(512,512);
 let seed=94731;
 for(let y=0;y<512;y++)for(let x=0;x<512;x++){
  seed=(Math.imul(seed,1664525)+1013904223)>>>0;
  const grain=(seed/4294967296-.5)*22+Math.sin(y*.83)*1.5,i=(y*512+x)*4;
  pixels.data[i]=solar?26+grain:62+grain;
  pixels.data[i+1]=solar?49+grain:64+grain;
  pixels.data[i+2]=solar?76+grain:66+grain;
  pixels.data[i+3]=255;
 }
 ctx.putImageData(pixels,0,0);
 if(solar){ctx.strokeStyle='rgba(195,206,214,.65)';ctx.lineWidth=1;for(let y=12;y<512;y+=12){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(512,y);ctx.stroke();}}
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;return texture;
}

function studioEnvironment(renderer){
 const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=512;
 const ctx=canvas.getContext('2d');ctx.fillStyle='#7f858a';ctx.fillRect(0,0,1024,512);
 const gradient=ctx.createLinearGradient(0,0,0,512);gradient.addColorStop(0,'#f6f7f8');gradient.addColorStop(.5,'#8e969c');gradient.addColorStop(1,'#555e66');ctx.fillStyle=gradient;ctx.fillRect(0,0,1024,512);
 ctx.fillStyle='#fdfdfd';ctx.fillRect(110,70,155,255);ctx.fillStyle='#dce2e6';ctx.fillRect(630,85,230,160);
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.mapping=THREE.EquirectangularReflectionMapping;
 const generator=new THREE.PMREMGenerator(renderer),target=generator.fromEquirectangular(texture);texture.dispose();generator.dispose();return target;
}

function slabGeometry(){
 const shape=new THREE.Shape(),r=.009;
 shape.moveTo(-.5+r,-.5);shape.lineTo(.5-r,-.5);shape.quadraticCurveTo(.5,-.5,.5,-.5+r);shape.lineTo(.5,.5-r);shape.quadraticCurveTo(.5,.5,.5-r,.5);shape.lineTo(-.5+r,.5);shape.quadraticCurveTo(-.5,.5,-.5,.5-r);shape.lineTo(-.5,-.5+r);shape.quadraticCurveTo(-.5,-.5,-.5+r,-.5);
 const geometry=new THREE.ExtrudeGeometry(shape,{depth:.052,bevelEnabled:true,bevelThickness:.009,bevelSize:.004,bevelSegments:2,steps:1,curveSegments:4});geometry.rotateX(-Math.PI/2);return geometry;
}

function rulerTexture(){
 const canvas=document.createElement('canvas');canvas.width=1200;canvas.height=140;
 const ctx=canvas.getContext('2d');ctx.fillStyle='#d5d9d9';ctx.fillRect(0,0,1200,140);
 ctx.strokeStyle='#697378';ctx.fillStyle='#49545b';ctx.font='24px Arial';ctx.textAlign='center';
 for(let i=0;i<=100;i++){const x=80+i*10.4;ctx.beginPath();ctx.moveTo(x,8);ctx.lineTo(x,i%10===0?55:i%5===0?40:25);ctx.stroke();if(i%10===0)ctx.fillText(String(i/10),x,95);}
 ctx.textAlign='left';ctx.fillText('cm',1130,95);const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;return texture;
}

export function createDensityLab(host,{family='secondary',minArea=10,referenceArea=100,onAreaChange}){
 const solar=family==='solar',title=solar?'受光面示意':['fuel','nuclear'].includes(family)?'有效工作面示意':'涂层试样示意';
 host.innerHTML='<div class="density-view-head"><strong>'+title+'</strong><div class="density-views" role="group" aria-label="试样视角"><button type="button" data-sample-view="angled" aria-pressed="true">斜视</button><button type="button" data-sample-view="top" aria-pressed="false">俯视</button></div></div><div class="density-stage"><canvas role="img" aria-label="方形有效面积试样三维示意"></canvas><span class="density-size"></span><span class="density-view-hint">拖动旋转</span><span class="density-reference-label" hidden>原面积 '+format(referenceArea)+' cm²</span><button type="button" class="density-resize" role="slider" aria-label="拖动角标调整有效面积" aria-valuemin="'+minArea+'" aria-valuemax="200" aria-valuenow="100" aria-valuetext="100 平方厘米"><span aria-hidden="true"></span></button></div><div class="density-actions"><button type="button" data-sample-action="half">面积减半</button><button type="button" data-sample-action="compare" aria-pressed="false">对比原面积</button><button type="button" data-sample-action="reset">恢复面积</button></div><div class="density-formula"><span><span>平均电流密度</span><span>j = I / A</span></span><strong><span class="density-value">10</span><em>mA/cm²</em></strong></div><p class="density-feedback" role="status"></p>';
 const stage=host.querySelector('.density-stage'),canvas=stage.querySelector('canvas'),handle=stage.querySelector('.density-resize'),size=stage.querySelector('.density-size'),hint=stage.querySelector('.density-view-hint');
 const comparison=host.querySelector('[data-sample-action="compare"]'),referenceLabel=stage.querySelector('.density-reference-label'),half=host.querySelector('[data-sample-action="half"]');
 let values={area:referenceArea,current:1000},compare=false,disposed=false,renderer=null,controls=null,environment=null,resizeStart=null;
 const cleanup=[],textures=[],scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(36,1,.1,150),corner=new THREE.Vector3(),pointer=new THREE.Vector2(),raycaster=new THREE.Raycaster(),workPlane=new THREE.Plane(new THREE.Vector3(0,1,0),-.18);
 let backing=null,coating=null,reference=null,busbars=[];
 const listen=(el,event,handler,options)=>{el.addEventListener(event,handler,options);cleanup.push(()=>el.removeEventListener(event,handler,options));};

 function placeHandle(){
  if(!renderer){handle.style.left='78%';handle.style.top='68%';return;}
  const side=Math.sqrt(values.area);corner.set(side/2,.18,side/2).project(camera);
  handle.style.left=Math.max(20,Math.min(stage.clientWidth-20,(corner.x+1)*stage.clientWidth/2))+'px';
  handle.style.top=Math.max(55,Math.min(stage.clientHeight-28,(1-corner.y)*stage.clientHeight/2))+'px';
 }
 function draw(){if(disposed)return;if(renderer)renderer.render(scene,camera);placeHandle();}
 function setView(view){
  if(view==='top'){camera.position.set(0,28,.001);camera.up.set(0,0,-1);}else{camera.position.set(12,17,20);camera.up.set(0,1,0);}
  camera.lookAt(0,0,0);if(controls){controls.target.set(0,0,0);controls.update();}
  host.querySelectorAll('[data-sample-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.sampleView===view)));
  draw();
 }
 function worldPoint(e){
  if(!renderer)return null;
  const box=canvas.getBoundingClientRect();pointer.set((e.clientX-box.left)/box.width*2-1,1-(e.clientY-box.top)/box.height*2);raycaster.setFromCamera(pointer,camera);return raycaster.ray.intersectPlane(workPlane,new THREE.Vector3());
 }
 function changeArea(area){onAreaChange(clampSampleArea(area,minArea));}

 try{
  renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  scene.background=new THREE.Color('#171717');environment=studioEnvironment(renderer);scene.environment=environment.texture;
  scene.add(new THREE.HemisphereLight(0xffffff,0xbfc5c7,1.15));
  const light=new THREE.DirectionalLight(0xffffff,2.1);light.position.set(-8,16,6);light.castShadow=true;light.shadow.mapSize.set(1024,1024);Object.assign(light.shadow.camera,{left:-15,right:15,top:15,bottom:-15,near:1,far:55});light.shadow.normalBias=.025;light.shadow.bias=-.0002;light.shadow.radius=3;scene.add(light);
  const fill=new THREE.DirectionalLight(0xdde6ed,.65);fill.position.set(8,5,-8);scene.add(fill);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(150,150),new THREE.MeshStandardMaterial({color:0x292929,roughness:.94}));floor.rotation.x=-Math.PI/2;floor.position.y=-.025;floor.receiveShadow=true;scene.add(floor);
  backing=new THREE.Mesh(slabGeometry(),new THREE.MeshStandardMaterial({color:solar?0xc8d1d7:0xb89b73,metalness:.92,roughness:.34}));backing.position.y=.04;backing.castShadow=true;backing.receiveShadow=true;scene.add(backing);
  const grain=grainTexture(solar);textures.push(grain);coating=new THREE.Mesh(slabGeometry(),new THREE.MeshStandardMaterial({map:grain,bumpMap:grain,bumpScale:.015,envMapIntensity:.6,roughness:solar?.36:.87,metalness:solar?.22:.09}));coating.position.y=.108;coating.castShadow=true;coating.receiveShadow=true;scene.add(coating);
  if(solar){for(const x of [-.3,0,.3]){const strip=new THREE.Mesh(new THREE.BoxGeometry(.07,.014,1),new THREE.MeshStandardMaterial({color:0xc6d0d8,roughness:.3,metalness:.85}));strip.position.set(x,.178,0);scene.add(strip);busbars.push({mesh:strip,fraction:x});}}
  const refSide=Math.sqrt(referenceArea),refGeometry=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-refSide/2,.21,-refSide/2),new THREE.Vector3(refSide/2,.21,-refSide/2),new THREE.Vector3(refSide/2,.21,refSide/2),new THREE.Vector3(-refSide/2,.21,refSide/2)]);
  reference=new THREE.LineLoop(refGeometry,new THREE.LineDashedMaterial({color:0xe3e3e3,dashSize:.32,gapSize:.17,transparent:true,opacity:.85,depthTest:false}));reference.computeLineDistances();reference.visible=false;reference.renderOrder=2;scene.add(reference);
  const rulerMap=rulerTexture();textures.push(rulerMap);const ruler=new THREE.Mesh(new THREE.PlaneGeometry(11.54,1.346),new THREE.MeshBasicMaterial({map:rulerMap,toneMapped:false,side:THREE.DoubleSide}));ruler.rotation.x=-Math.PI/2;ruler.position.set(0,.002,8.3);scene.add(ruler);
  controls=new OrbitControls(camera,canvas);controls.enableDamping=false;controls.enablePan=false;controls.enableZoom=false;controls.minPolarAngle=.08;controls.maxPolarAngle=1.23;controls.rotateSpeed=.65;
  controls.addEventListener('change',()=>{if(!resizeStart){host.querySelectorAll('[data-sample-view]').forEach(b=>b.setAttribute('aria-pressed','false'));}draw();});
  setView('angled');
 }catch{
  renderer?.dispose();renderer=null;canvas.hidden=true;stage.classList.add('density-fallback');stage.insertAdjacentHTML('beforeend','<div class="density-fallback-sheet" aria-hidden="true"></div>');hint.textContent='拖动角标调整面积';host.querySelector('.density-views').hidden=true;
 }
 const observer=new ResizeObserver(()=>{if(disposed)return;const width=stage.clientWidth,height=stage.clientHeight;if(renderer&&width&&height){renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();}draw();});observer.observe(stage);
 listen(host,'click',e=>{
  const button=e.target.closest('button');if(!button)return;
  if(button.dataset.sampleView)setView(button.dataset.sampleView);
  const action=button.dataset.sampleAction;
  if(action==='half')changeArea(values.area/2);
  if(action==='reset')changeArea(referenceArea);
  if(action==='compare'){compare=!compare;comparison.setAttribute('aria-pressed',String(compare));referenceLabel.hidden=!compare;if(reference)reference.visible=compare;update(values);}
 });
 listen(handle,'pointerdown',e=>{
  if(e.button!==0)return;e.preventDefault();e.stopPropagation();handle.focus({preventScroll:true});handle.setPointerCapture(e.pointerId);resizeStart={point:worldPoint(e),side:Math.sqrt(values.area),x:e.clientX,y:e.clientY};if(controls)controls.enabled=false;stage.classList.add('is-resizing');
 });
 listen(handle,'pointermove',e=>{
  if(!resizeStart)return;
  const point=worldPoint(e);let side;
  if(point&&resizeStart.point){const delta=point.clone().sub(resizeStart.point);side=resizeStart.side+delta.x+delta.z;}else{side=resizeStart.side+(e.clientX-resizeStart.x+e.clientY-resizeStart.y)*.04;}
  changeArea(Math.max(0,side)**2);
 });
 function endResize(e){if(!resizeStart)return;resizeStart=null;if(handle.hasPointerCapture(e.pointerId))handle.releasePointerCapture(e.pointerId);if(controls)controls.enabled=true;stage.classList.remove('is-resizing');draw();}
 listen(handle,'pointerup',endResize);listen(handle,'pointercancel',endResize);listen(handle,'lostpointercapture',endResize);
 listen(handle,'keydown',e=>{const actions={ArrowRight:values.area+5,ArrowUp:values.area+5,ArrowLeft:values.area-5,ArrowDown:values.area-5,Home:minArea,End:200};if(e.key in actions){e.preventDefault();changeArea(actions[e.key]);}});

 function update(next){
  if(disposed)return;values={...next};const data=sampleReadout(values.area,values.current,referenceArea),side=data.side;
  if(backing){backing.scale.set(side+.36,1,side+.36);coating.scale.set(side,1,side);for(const bar of busbars){bar.mesh.scale.z=side;bar.mesh.position.x=side*bar.fraction;}}
  else{const sheet=stage.querySelector('.density-fallback-sheet');sheet.style.width=sheet.style.height=90+side*7+'px';}
  size.textContent=format(side)+' × '+format(side)+' cm';
  handle.setAttribute('aria-valuenow',String(values.area));handle.setAttribute('aria-valuetext',format(values.area)+' 平方厘米');half.disabled=values.area<=minArea;
  host.querySelector('.density-value').textContent=format(data.density);
  host.querySelector('.density-feedback').textContent=compare?(values.current===0?'电流为 0，两种面积下的密度均为 0。':'同样的电流，当前密度是原面积下的 '+format(data.areaRatio)+' 倍。'):'拖动角标改面积，读数为整个有效面的平均值。';
  draw();
 }
 update(values);
 return {host,update,dispose(){if(disposed)return;disposed=true;observer.disconnect();cleanup.forEach(f=>f());controls?.dispose();scene.traverse(o=>{o.geometry?.dispose();if(o.material){for(const material of Array.isArray(o.material)?o.material:[o.material])material.dispose();}});textures.forEach(t=>t.dispose());environment?.dispose();renderer?.dispose();renderer?.forceContextLoss();}};
}
