// Scroll reveals belong to large reading groups. Controls always respond immediately.
export function createScrollReveals(root){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),waiting=new Set(),running=new Map();let seen=new WeakSet(),viewKey=null;
 const layersSelector='.stage-lead,.families,.profile-heading,.profile-list,.material-tabs,.material-current,.material-search-row,.material-choices,.packaging-options,.dimension-details,.measurement-tabs,#density-visual,.modelpanel,.metricpanel';
 const selector=layersSelector+',.curvepanel,.safetypanel,.lesson,.evidence-drawer';
 const observer='IntersectionObserver' in window?new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting)reveal(entry.target);},{rootMargin:'0px 0px -5% 0px',threshold:.03}):null;
 function reveal(element){waiting.delete(element);observer?.unobserve(element);seen.add(element);element.classList.remove('reveal-waiting');element.classList.add('reveal-arrived');}
 function cancel(element){const animation=running.get(element);if(animation){animation.cancel();running.delete(element);}}
 function enter(element,delay){
  if(reduced.matches||typeof element.animate!=='function')return;
  cancel(element);const animation=element.animate([{opacity:.15,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:780,delay,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'});running.set(element,animation);animation.finished.then(()=>running.delete(element)).catch(()=>{});
 }
 function refresh(key,force=false){
  const changed=force||key!==viewKey;if(changed){viewKey=key;seen=new WeakSet();for(const [el] of running)cancel(el);for(const el of waiting){observer?.unobserve(el);el.classList.remove('reveal-waiting');}waiting.clear();root.querySelectorAll('.reveal-arrived').forEach(el=>el.classList.remove('reveal-arrived'));}
  if(changed&&!reduced.matches){
   const layers=[...root.querySelectorAll(layersSelector)].filter(el=>{const r=el.getBoundingClientRect();return r.height&&r.top<innerHeight&&r.bottom>0;});
   layers.forEach((el,i)=>enter(el,Math.min(i*55,275)));
  }
  root.querySelectorAll(selector).forEach(element=>{
   if(seen.has(element)||waiting.has(element))return;const r=element.getBoundingClientRect();if(!r.height)return;
   if(reduced.matches||!observer||r.top<innerHeight*.94){seen.add(element);return;}
   waiting.add(element);element.classList.add('reveal-waiting');observer.observe(element);
  });
 }
 root.addEventListener('focusin',event=>{if(event.target.id==='stage-title')return;for(const element of waiting)if(element.contains(event.target))reveal(element);for(const [element] of running)if(element.contains(event.target))cancel(element);});
 reduced.addEventListener('change',()=>{if(reduced.matches){for(const element of [...waiting])reveal(element);for(const [element] of running)cancel(element);}});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)for(const [element] of running)cancel(element);else refresh(viewKey);});
 return refresh;
}

// Reflection follows the cursor; the sheet and its controls remain stationary.
export function createSurfaceReflections(root){
 const reduced=matchMedia('(prefers-reduced-motion:reduce)'),fine=matchMedia('(hover:hover) and (pointer:fine)'),selector='.viewarea,#density-visual,.metricpanel,.modal';
 let frame=0,last=null,point=null;
 function clear(){if(frame)cancelAnimationFrame(frame);frame=0;if(last){last.style.removeProperty('--glass-x');last.style.removeProperty('--glass-y');last.style.removeProperty('--glass-lit');}last=null;}
 root.addEventListener('pointermove',event=>{
  if(reduced.matches||!fine.matches)return;
  const target=event.target.closest(selector);if(!target){clear();return;}
  if(last&&last!==target)clear();last=target;point={x:event.clientX,y:event.clientY};if(frame)return;
  frame=requestAnimationFrame(()=>{frame=0;if(!last?.isConnected||!point)return;const r=last.getBoundingClientRect();last.style.setProperty('--glass-x',(100*(point.x-r.left)/r.width).toFixed(1)+'%');last.style.setProperty('--glass-y',(100*(point.y-r.top)/r.height).toFixed(1)+'%');last.style.setProperty('--glass-lit','1');});
 },{passive:true});
 root.addEventListener('pointerleave',clear);document.addEventListener('visibilitychange',()=>{if(document.hidden)clear();});reduced.addEventListener('change',clear);fine.addEventListener('change',clear);
}
