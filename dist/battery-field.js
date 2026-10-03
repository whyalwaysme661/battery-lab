import * as THREE from 'three';
import {makeCellField,stepCell} from './entry-physics.js';
export function createBatteryField(canvas,host){
 const reduced=matchMedia('(prefers-reduced-motion:reduce)'),small=matchMedia('(max-width:720px)');
 let count=small.matches?390:1050;const cells=makeCellField(1050),pointer={active:false,x:0,y:0,cameraX:0,cameraY:0,groupY:0,radius:3.3};
 let renderer,raf=0,last=0,time=0,paused=false,disposed=false,exit=0;
 try{renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'low-power'});}catch{return fallback(canvas,host,reduced);}
 renderer.setPixelRatio(Math.min(devicePixelRatio,small.matches?1.4:1.7));renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;
 const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x000000,.017);
 const camera=new THREE.PerspectiveCamera(42,1,.1,100);camera.position.set(0,0,32);
 const group=new THREE.Group();scene.add(group);
 scene.add(new THREE.HemisphereLight(0xbee9ff,0x02050c,2.2));
 for(const [x,y,z,color,power] of [[-12,12,18,0xe2f5ff,4],[14,3,10,0x327dff,7],[5,-12,15,0x62d3ff,4]]){const light=new THREE.DirectionalLight(color,power);light.position.set(x,y,z);scene.add(light);}
 const bodyMaterial=new THREE.MeshStandardMaterial({color:0xffffff,metalness:.65,roughness:.32,emissive:0x083275,emissiveIntensity:.24});
 const capMaterial=new THREE.MeshStandardMaterial({color:0xbccedb,metalness:.8,roughness:.26});
 const glowMaterial=new THREE.MeshBasicMaterial({color:0x49bcff});
 const body=new THREE.InstancedMesh(new THREE.CylinderGeometry(.36,.36,1.4,12),bodyMaterial,cells.length);
 const caps=new THREE.InstancedMesh(new THREE.CylinderGeometry(.37,.37,.07,12),capMaterial,cells.length*2);
 const terminal=new THREE.InstancedMesh(new THREE.CylinderGeometry(.14,.14,.15,10),capMaterial,cells.length);
 const rim=new THREE.InstancedMesh(new THREE.TorusGeometry(.363,.018,4,12),glowMaterial,cells.length);
 const meshes=[body,caps,terminal,rim];for(const mesh of meshes){mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);mesh.frustumCulled=false;group.add(mesh);}
 const blue=new THREE.Color(0x277ef0),steel=new THREE.Color(0x6b94b8),ice=new THREE.Color(0x92c7e3),color=new THREE.Color();
 cells.forEach((cell,i)=>{color.copy(cell.color<.65?blue:cell.color<.88?steel:ice);body.setColorAt(i,color);});body.instanceColor.needsUpdate=true;
 const object=new THREE.Object3D(),local=new THREE.Matrix4(),matrix=new THREE.Matrix4(),ringLocal=new THREE.Matrix4().makeRotationX(Math.PI/2);ringLocal.setPosition(0,.59,0);
 function update(dt){
  for(let i=0;i<count;i++){
   const c=cells[i],drift=stepCell(c,pointer,dt,time,!paused&&!reduced.matches);
   const spread=1+exit*2.8;
   object.position.set((c.x+c.ox)*spread,c.y+c.oy+drift+(c.y<0?-1:1)*exit*7,c.z+c.oz+exit*9);
   object.rotation.set(.4+c.tilt+c.oy*.035,c.phase*.3,c.rotation+Math.sin(time*.12+c.phase)*(!paused&&!reduced.matches?.07:0)+c.ox*.07);
   object.scale.setScalar(c.scale);object.updateMatrix();body.setMatrixAt(i,object.matrix);
   for(let j=0;j<2;j++){local.makeTranslation(0,j?-.72:.72,0);matrix.multiplyMatrices(object.matrix,local);caps.setMatrixAt(i*2+j,matrix);}
   local.makeTranslation(0,.81,0);matrix.multiplyMatrices(object.matrix,local);terminal.setMatrixAt(i,matrix);
   matrix.multiplyMatrices(object.matrix,ringLocal);rim.setMatrixAt(i,matrix);
  }
  meshes.forEach(mesh=>mesh.instanceMatrix.needsUpdate=true);
 }
 function draw(now){raf=0;if(disposed||document.hidden)return;const dt=last?Math.min((now-last)/1000,1/30):1/60;last=now;
  if(!paused&&!reduced.matches)time+=dt;update(paused||reduced.matches?0:dt);renderer.render(scene,camera);
  if(!paused&&!reduced.matches)raf=requestAnimationFrame(draw);
 }
 function request(){if(!raf&&!disposed&&!document.hidden)raf=requestAnimationFrame(draw);}
 function resize(){const r=host.getBoundingClientRect();if(!r.width||!r.height)return;count=small.matches?390:1050;body.count=count;caps.count=count*2;terminal.count=count;rim.count=count;camera.aspect=r.width/r.height;camera.position.x=small.matches?7:0;group.position.y=small.matches?-3:0;camera.updateProjectionMatrix();renderer.setSize(r.width,r.height,false);pointer.cameraX=camera.position.x;pointer.cameraY=camera.position.y;pointer.groupY=group.position.y;request();}
 function move(e){if(paused||reduced.matches)return;if(e.target.closest('button,a')){leave();return;}const r=host.getBoundingClientRect(),halfHeight=Math.tan(42*Math.PI/360)*32;
  pointer.x=((e.clientX-r.left)/r.width*2-1)*halfHeight*camera.aspect;pointer.y=(1-(e.clientY-r.top)/r.height*2)*halfHeight;pointer.active=true;request();
 }
 function leave(){pointer.active=false;}
 function up(e){if(e.pointerType==='touch')leave();}
 function visibility(){if(document.hidden){cancelAnimationFrame(raf);raf=0;last=0;}else request();}
 function preference(){pointer.active=false;cancelAnimationFrame(raf);raf=0;last=0;request();}
 const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);
 host.addEventListener('pointermove',move,{passive:true});host.addEventListener('pointerdown',move,{passive:true});host.addEventListener('pointerleave',leave);host.addEventListener('pointercancel',leave);host.addEventListener('pointerup',up);
 document.addEventListener('visibilitychange',visibility);reduced.addEventListener('change',preference);small.addEventListener('change',resize);resize();
 return {setPaused(value){paused=value;pointer.active=false;last=0;cancelAnimationFrame(raf);raf=0;request();},setExit(value){exit=value;request();},dispose(){disposed=true;cancelAnimationFrame(raf);resizeObserver.disconnect();host.removeEventListener('pointermove',move);host.removeEventListener('pointerdown',move);host.removeEventListener('pointerleave',leave);host.removeEventListener('pointercancel',leave);host.removeEventListener('pointerup',up);document.removeEventListener('visibilitychange',visibility);reduced.removeEventListener('change',preference);small.removeEventListener('change',resize);meshes.forEach(mesh=>mesh.geometry.dispose());bodyMaterial.dispose();capMaterial.dispose();glowMaterial.dispose();renderer.dispose();renderer.forceContextLoss();}};
}
function fallback(canvas,host,reduced){
 const fresh=document.createElement('canvas');fresh.className=canvas.className;fresh.setAttribute('aria-hidden','true');canvas.replaceWith(fresh);const context=fresh.getContext('2d'),cells=makeCellField(170);let disposed=false;
 function draw(){if(disposed||!context)return;const r=host.getBoundingClientRect(),dpr=Math.min(devicePixelRatio,1.4);fresh.width=r.width*dpr;fresh.height=r.height*dpr;context.setTransform(dpr,0,0,dpr,0,0);context.clearRect(0,0,r.width,r.height);
  for(const c of cells){const x=r.width*(.48+c.x/40),y=r.height*(.5-c.y/23),size=c.scale*35+4;context.save();context.translate(x,y);context.rotate(c.rotation);context.fillStyle=c.color<.7?'#145cab':'#7898b5';context.fillRect(-size*.3,-size*.65,size*.6,size*1.3);context.fillStyle='#b3d6e9';context.fillRect(-size*.3,-size*.65,size*.6,2);context.fillRect(-size*.12,-size*.82,size*.24,size*.18);context.fillStyle='#49bcff';context.fillRect(-size*.3,size*.46,size*.6,1);context.restore();}}
 const observer=new ResizeObserver(draw);observer.observe(host);draw();return {static:true,setPaused(){},setExit(){},dispose(){disposed=true;observer.disconnect();}};
}
