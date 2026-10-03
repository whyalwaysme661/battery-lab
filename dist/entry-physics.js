// Deterministic layout and bounded spring physics, independent of rendering.
export function makeCellField(count,seed=371){
 let value=seed>>>0;const random=()=>{value=(value*1664525+1013904223)>>>0;return value/4294967296;};
 return Array.from({length:count},(_,i)=>{
  const angle=random()*Math.PI*2,band=random(),foreground=i%11===0;
  const radius=7.5+band*3.4;
  const x=foreground?(random()-.35)*34:7.5+Math.cos(angle)*radius;
  const y=foreground?(random()-.5)*22:Math.sin(angle)*5.8+(random()-.5)*2.8;
  const z=foreground?7+random()*5:Math.sin(angle+.8)*5+(random()-.5)*4;
  return {x,y,z,ox:0,oy:0,oz:0,vx:0,vy:0,vz:0,scale:foreground?.38+random()*.32:.1+random()*.15,rotation:random()*Math.PI*2,tilt:(random()-.5)*.9,phase:random()*Math.PI*2,color:random(),mass:.75+random()*.5};
 });
}
export function stepCell(cell,pointer,dt,time,moving=true){
 const step=Math.max(0,Math.min(dt,1/30));
 const drift=Math.sin(time*.18+cell.phase)*.13;
 let fx=0,fy=0,fz=0;
 if(pointer?.active){
  const depth=(32-cell.z)/32,px=pointer.x*depth+pointer.cameraX,py=pointer.y*depth+pointer.cameraY-pointer.groupY;
  const dx=cell.x+cell.ox-px,dy=cell.y+cell.oy+drift-py,distance=Math.hypot(dx,dy),radius=pointer.radius??3.3;
  if(distance<radius){const angle=distance>.001?Math.atan2(dy,dx):cell.phase,pressure=(1-distance/radius)**2;fx=Math.cos(angle)*pressure*105;fy=Math.sin(angle)*pressure*105;fz=pressure*16;}
 }
 const damping=Math.exp(-4.2*step),spring=8.5;
 cell.vx=(cell.vx+(fx/cell.mass-spring*cell.ox)*step)*damping;
 cell.vy=(cell.vy+(fy/cell.mass-spring*cell.oy)*step)*damping;
 cell.vz=(cell.vz+(fz/cell.mass-spring*cell.oz)*step)*damping;
 cell.ox+=cell.vx*step;cell.oy+=cell.vy*step;cell.oz+=cell.vz*step;
 return drift;
}
