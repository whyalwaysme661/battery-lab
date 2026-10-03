import {initializeLocalization,getLocale,translate,registerTranslations} from './i18n.js';
import {createScrollReveals,createSurfaceReflections} from './motion.js';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {createDensityLab,clampSampleArea} from './density-lab.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {families,profiles,materials,packaging,seiOptions,sources,initial,getProfile,getSource,relatedObservations,validateConfig,computePerformance,configurationForMaterial,matchingPairing} from './catalog.js';
import {fingerprint,parseCurve,analyzeCurve,safetyRows,sourceDifferences,configLabel,chargePathSteps} from './analysis.js';
import {createPathwayLesson} from './pathway-view.js';
import {materialImage,contextImage,imageType,localizedImage} from './imagery.js';
import {familyGuide,profileNote,roleInfo,makeTeachingInput,workingPower,teachingCurve,shapeSketch} from './experience.js';
const $=s=>document.querySelector(s),root=$('#app'),state={...initial,operatingVoltage:null};
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const mobileLayout=matchMedia('(max-width:720px)'),stackedLayout=matchMedia('(max-width:960px)'),reducedMotion=matchMedia('(prefers-reduced-motion:reduce)');
let viewingMaterialKey=null,activeMaterialKey='cathode',materialQuery='',densityLab=null;
const fmt=n=>Number.isFinite(n)?new Intl.NumberFormat(getLocale()==='en'?'en-US':'zh-CN',{maximumFractionDigits:3}).format(n):'—';
let measurementMode='example',teaching=makeTeachingInput(state.family),curveDemo=true,demoThreshold=80,tourIndex=-1,pathController=null,pathSnapshot=null;let importSeq=0;const drafts=new Map(),safetyPlans=new Map(),measurementRecords=new Map();let modelAssembly=null;let photoAssets=[],photoStatus='loading',curves=null,curveText='',curveThreshold=80,curveDraftThreshold=80,curveDirty=false,compareA=null,compareB=null,activeModel=null,modelParts=[],modelKey='',requestSeq=0,cutaway=true,isolatedRole=null,focusedRole=null,selectedPart=null;

function rememberFocus(element=document.activeElement){
 if(!element||element===document.body||element===document.documentElement)return null;
 const attributes=[...element.attributes].filter(a=>a.name.startsWith('data-')&&!a.name.startsWith('data-i18n'));
 const selector=element.id?'#'+CSS.escape(element.id):attributes.length?element.tagName.toLowerCase()+attributes.map(a=>'['+a.name+'="'+CSS.escape(a.value)+'"]').join(''):null;
 return {element,selector};
}
function restoreFocus(snapshot,fallback=false){
 const available=element=>element?.isConnected&&!element.disabled&&!element.closest('[hidden],[inert]')&&element.getClientRects().length;
 const candidates=[snapshot?.element,...(snapshot?.selector?document.querySelectorAll(snapshot.selector):[])];
 const target=candidates.find(available)||(fallback&&available($('#stage-title'))?$('#stage-title'):null);
 target?.focus({preventScroll:true});return target;
}
function restoreLostFocus(snapshot){
 if(snapshot&&(document.activeElement===document.body||!document.activeElement?.isConnected))restoreFocus(snapshot,true);
}

root.innerHTML='<main class="shell stage-0" id="lab-main"><header class="top"><a class="brand" href="#home" aria-label="Battery Lab 首页"><svg class="brandmark" viewBox="0 0 32 32" aria-hidden="true"><rect x="4" y="8" width="23" height="17" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M27 13h3v7h-3M12 11v11M19 11v11" fill="none" stroke="currentColor" stroke-width="2"/></svg><strong>Battery Lab</strong><span>电池装配台</span></a><div class="topnav"><button id="sources">资料库</button><button id="compare">方案对照</button><button id="records">我的记录</button><div class="language-switch" role="group" aria-label="Language"><button type="button" data-locale="zh" lang="zh-CN" aria-label="切换为中文" aria-pressed="true">中文</button><button type="button" data-locale="en" lang="en" aria-label="Switch to English" aria-pressed="false">EN</button></div></div></header><div class="intro"><p><strong>电池材料与结构</strong><span>选择材料，查看结构，读懂实测记录。</span></p></div><nav class="steps" aria-label="探索步骤">'+['选择体系','材料配置','三维结构','测量与评估'].map((x,i)=>'<button class="step" data-step="'+i+'"><span>0'+(i+1)+'</span>'+x+'</button>').join('')+'</nav><div class="stage-lead"><h1 id="stage-title" tabindex="-1"></h1><p id="stage-desc"></p><span id="mobile-context" hidden></span></div><div class="workspace"><section class="configpanel"><div class="panelhead"><h2 id="step-title"></h2><span id="step-index"></span></div><div class="panelbody" id="config"></div></section><section class="modelpanel"><div class="panelhead"><h2 id="model-heading" tabindex="-1">三维结构</h2><span id="model-badge">结构载入中</span></div><div class="mobile-model-context" id="mobile-model-context" hidden><strong id="mobile-material-label" role="status" aria-live="polite"></strong><button id="return-material">返回选材</button></div><div class="viewarea"><div class="viewoverlay"><strong id="model-title"></strong><span>拖动旋转 · 点选部件</span></div><canvas id="model-view" tabindex="0" aria-label="电池三维结构查看器" aria-describedby="camera-keyboard-help"></canvas><p id="camera-status" class="sr-only" role="status" aria-live="polite" aria-atomic="true"></p><div class="viewstatus" id="viewstatus" role="status">正在载入结构…</div></div><div class="viewmodes"><div class="structure-mode-switch" role="group" aria-label="查看方式"><button data-view="whole" aria-pressed="false">完整外形</button><button data-view="exploded" aria-pressed="true">展开结构</button></div><button id="path" class="structure-path"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5v14m0-7h8m0 0V5m0 7v7m0-14h6m-6 14h6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="5" cy="5" r="2" fill="currentColor"/><circle cx="19" cy="5" r="2" fill="currentColor"/><circle cx="19" cy="19" r="2" fill="currentColor"/></svg><span>能量路径</span></button></div><div id="structure-guide" class="structure-guide"></div><details class="advanced-view"><summary>视角与部件控制</summary><div class="camera-controls"><p id="camera-keyboard-help" class="camera-help">方向键旋转，Shift + 方向键平移，+ / − 缩放，Home 恢复视角。</p><div class="camera-control-group" role="group" aria-label="旋转视角"><span>旋转</span><div><button type="button" data-camera="left">向左旋转</button><button type="button" data-camera="right">向右旋转</button><button type="button" data-camera="up">向上旋转</button><button type="button" data-camera="down">向下旋转</button></div></div><div class="camera-control-group" role="group" aria-label="平移视角"><span>平移</span><div><button type="button" data-camera="pan-left">向左平移</button><button type="button" data-camera="pan-right">向右平移</button><button type="button" data-camera="pan-up">向上平移</button><button type="button" data-camera="pan-down">向下平移</button></div></div><div class="camera-control-group" role="group" aria-label="缩放视角"><span>缩放</span><div><button type="button" data-camera="in">放大</button><button type="button" data-camera="out">缩小</button><button type="button" data-camera="reset">恢复视角</button></div></div></div><div class="viewercontrols"><button id="cutaway" class="active" aria-pressed="true">隐藏外壳</button><button id="rotate" aria-pressed="false">自动旋转</button><button id="reset-camera">恢复完整结构</button><label>展开<input id="explode" type="range" min="0" max="100" value="55" aria-label="装配分解程度"></label></div><div class="assemblybar"><label>逐层查看<input id="assembly-progress" type="range" min="1" max="100" value="100" aria-label="逐层查看进度"></label><button id="parts">部件目录</button></div></details><div class="partcallout" id="part-info"></div><details class="model-details"><summary>方案与结构依据</summary><div id="config-summary"></div><p>模型层厚按观察需要放大，外形为设计尺寸，非加工图。</p></details></section><aside class="metricpanel"><div class="panelhead"><h2>结果读数</h2><span id="result-origin"></span></div><div class="panelbody" id="metrics"></div><div class="compare-actions"><button id="save-a">记为方案 A</button><button id="save-b">比较当前方案</button></div></aside></div><section class="lesson" id="lesson"></section><section class="assessment-section"><nav class="assessment-tabs" aria-label="评估内容"><a href="#durability-section">耐久与曲线</a><a href="#safety-section">安全检查</a></nav><div class="bottomgrid"><section class="curvepanel" id="durability-section"><div class="panelhead"><h2 id="durability-title">读一条循环曲线</h2><span>按数据覆盖范围解读</span></div><div class="panelbody" id="curve-panel"></div></section><section class="safetypanel" id="safety-section"><div class="panelhead"><h2>哪里可能出问题</h2><span id="plan-count"></span></div><div class="panelbody" id="checks"></div></section></div></section><details class="evidence-drawer"><summary>文献与产品证据 <span id="evidence-count"></span></summary><div id="evidence"></div></details><footer><span>Battery Lab / 材料与结构</span><button id="export-config">导出参数与证据</button></footer></main>';
initializeLocalization(document.body);
const refreshReveals=createScrollReveals(root);
const resultStack=document.createElement('div'),resultPanel=$('.metricpanel');
resultStack.className='results-stack';resultPanel.replaceWith(resultStack);resultStack.append(resultPanel,$('.assessment-section'));
function sourceLink(id){const s=getSource(id);return s?'<a href="'+s.url+'" target="_blank" rel="noopener noreferrer">'+escape(s.title)+'</a>':'';}
function photo(id){return localizedImage(materialImage(id,photoAssets),getLocale());}
const zoomMark='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6"/><path d="m15 15 5 5M10 7v6M7 10h6"/></svg>';
function imageCaption(a){return imageType(a)+' / '+(a.shortLabel||'图片');}
function waitingImage(){return '<span class="image-wait" role="status">'+(photoStatus==='error'?'图片未载入':'图片载入中…')+'</span>';}
function imageFigure(a,cls=''){a=localizedImage(a,getLocale());return a?.localUrl?'<figure class="image-figure '+cls+'"><button type="button" class="image-open '+a.kind+'" data-image-file="'+a.file+'" data-image-reference="'+Boolean(a.reference)+'" aria-label="查看图片与出处"><img data-asset-file="'+a.file+'" data-image-size="preview" src="'+(a.previewUrl||a.localUrl)+'" alt="'+escape(a.description)+'" width="'+a.width+'" height="'+a.height+'" loading="lazy" decoding="async"><span class="image-zoom-mark">'+zoomMark+'</span></button><figcaption>'+escape(imageCaption(a))+'</figcaption></figure>':'<figure class="image-figure '+cls+'">'+waitingImage()+'</figure>';}
const opt=(ids,current,kind)=>ids.map(id=>'<option value="'+id+'" '+(id===current?'selected':'')+'>'+escape(kind==='profile'?getProfile(id).label:kind==='packaging'?packaging[id].label:materials[id]?.label??id)+'</option>').join('');
function materialRoles(p){
 const pv=p.family==='solar',nuclear=p.family==='nuclear';
 return [{key:'cathode',label:pv?'吸光层':nuclear?'转换组件':p.family==='fuel'?'氧侧电极':'正极',ids:p.cathodes},{key:'anode',label:pv?'接触结构':nuclear?'能量源':p.family==='fuel'?'燃料侧电极':'负极',ids:p.anodes},...(p.electrolytes.length?[{key:'electrolyte',label:pv?'功能层':'电解质',ids:p.electrolytes}]:[])];
}
function materialCandidateConfig(key,id){return configurationForMaterial(state,key,id);}
function materialRows(p,key){
 const role=materialRoles(p).find(r=>r.key===key),query=materialQuery.trim().toLocaleLowerCase(),ids=role.ids.filter(id=>[materials[id].label,translate(materials[id].label,'en'),materials[id].stage,translate(materials[id].stage,'en'),materials[id].note??'',id].join(' ').toLocaleLowerCase().includes(query));
 return {count:ids.length,html:ids.map(id=>{
  const m=materials[id],a=photo(id),next=materialCandidateConfig(key,id),valid=Boolean(next),selected=state[key]===id,paired=next&&['cathode','anode','electrolyte','packaging'].some(k=>k!==key&&next[k]!==state[k]);
  return '<button type="button" class="material-choice '+(selected?'selected':'')+'" id="'+(selected?key:'choice-'+key+'-'+id)+'" data-choose="'+id+'" data-key="'+key+'" role="radio" aria-label="'+escape(m.label+(paired?'，同时切换配对材料':''))+'" aria-checked="'+selected+'" tabindex="'+(selected?'0':'-1')+'" '+(valid?'':'disabled')+'>'+(a?'<img data-asset-file="'+a.file+'" data-image-size="thumb" data-image-kind="'+a.kind+'" src="'+(a.thumbUrl||a.localUrl)+'" alt="'+escape(a.description)+'" width="72" height="68" loading="lazy" decoding="async">':waitingImage())+'<span class="material-choice-copy"><strong>'+escape(m.label)+'</strong><span>'+escape(m.stage)+(a?' / '+escape(imageType(a)):'')+'</span>'+(paired?'<span class="material-pair-note">同时切换配对材料'+(next.packaging!==state.packaging?'与封装':'')+'</span>':!valid?'<span class="material-pair-note">当前配对不可用</span>':'')+'</span><span class="choice-mark" aria-hidden="true">'+(selected?'已选':'')+'</span></button>';
 }).join('')||'<p class="material-empty">没有找到“'+'<span data-i18n-skip>'+escape(materialQuery)+'</span>'+ '”。试试材料名称或缩写。</p>'};
}
function materialWorkspace(p){
 const roles=materialRoles(p);if(!roles.some(r=>r.key===activeMaterialKey))activeMaterialKey=roles[0].key;
 const key=activeMaterialKey,role=roles.find(r=>r.key===key),m=materials[state[key]],a=photo(state[key]),info=roleInfo(p,roleForField(key)),rows=materialRows(p,key),pair=matchingPairing(state);
 return '<div class="material-tabs" role="tablist" aria-label="材料层">'+roles.map(r=>'<button type="button" role="tab" data-material-key="'+r.key+'" id="tab-'+r.key+'" aria-selected="'+(r.key===key)+'" aria-controls="material-browser" tabindex="'+(r.key===key?'0':'-1')+'"><strong>'+r.label+'</strong><span>'+escape(materials[state[r.key]].label)+'</span></button>').join('')+'</div><section id="material-browser" class="material-browser" role="tabpanel" aria-labelledby="tab-'+key+'"><div class="material-current '+(a?'has-photo':'')+'">'+(a?'<button type="button" class="material-current-image" data-photo="'+state[key]+'" aria-label="查看'+escape(m.label)+'的图片与出处"><img data-asset-file="'+a.file+'" data-image-size="thumb" data-image-kind="'+a.kind+'" src="'+(a.thumbUrl||a.localUrl)+'" alt="'+escape(a.description)+'" width="142" height="130" decoding="async"><span>'+escape(imageType(a))+'</span></button>':'')+'<div class="material-current-copy"><h2>'+escape(m.label)+'</h2><p>'+escape(m.note||info.text)+'</p><div class="material-current-actions"><button type="button" class="textbutton" data-inspect="'+key+'">定位模型中的这一层</button><details class="material-citation"><summary>材料依据</summary><p>'+escape(m.stage)+'</p>'+sourceLink(m.source)+(pair&&pair.source!==m.source?'<p>当前配对：'+sourceLink(pair.source)+'</p>':'')+(m.source==='nvo'?'<p>'+sourceLink('nvocorrection')+'</p>':'')+'</details></div></div></div><div class="material-search-row"><label for="material-search" class="sr-only">搜索'+role.label+'材料</label><input id="material-search" type="search" placeholder="搜索名称或缩写" value="'+escape(materialQuery)+'" autocomplete="off"><span id="material-result-count" role="status">'+rows.count+' 种候选</span></div><div class="material-choices" id="material-choices" role="radiogroup" aria-label="'+role.label+'材料候选">'+rows.html+'</div><p class="material-selection-status" id="material-selection-status" role="status">当前'+role.label+'：'+escape(m.label)+'</p></section>';
}
function chooseMaterial(key,id){
 if(state[key]===id){viewingMaterialKey=key;focusRole(roleForField(key));return;}
 const next=materialCandidateConfig(key,id);if(!next){toast('当前配对不能使用这项材料。请查看材料依据。');return;}
 const changes=['cathode','anode','electrolyte','packaging'].filter(k=>k!==key&&state[k]!==next[k]),packChanged=state.packaging!==next.packaging;
 saveMeasurements();importSeq++;Object.assign(state,next);if(packChanged)resetDimensions();restoreMeasurements();viewingMaterialKey=key;activeMaterialKey=key;render();applyMaterials();if(packChanged)loadSelectedModel().then(()=>focusRole(roleForField(key)));else focusRole(roleForField(key));$('#'+key)?.focus({preventScroll:true});
 const status=$('#material-selection-status');if(status)status.textContent=materials[id].label+' 已选。'+(changes.length?'同时配对：'+changes.map(k=>k==='packaging'?packaging[state[k]].label:materials[state[k]]?.label??'无电解质').join('、')+'。':'对应功能层已高亮。');
}
function imageAttribution(a){
 const link=(url,label)=>'<a href="'+escape(url)+'" target="_blank" rel="noopener noreferrer">'+escape(label)+'</a>';
 let credit;
 if(a.kind==='schematic')credit=(a.basedOn??[]).map(source=>link(source.url,source.title)).join(' / ')+' / '+link('/assets/materials/visual-notes.md','结构与配方依据');
 else if(a.kind==='generated')credit=link('/assets/illustrations.md','提示词与用途说明');
 else credit=escape(a.author)+' / '+link(a.licenseUrl,a.license)+' / '+link(a.pageUrl,'原文与图源')+(a.supplementUrl?' / '+link(a.supplementUrl,'补充材料'):'')+(a.licenseEvidenceUrl&&a.licenseEvidenceUrl!==a.pageUrl?' / '+link(a.licenseEvidenceUrl,'授权依据'):'');
 return '<div class="photo-attribution"><p>'+credit+'</p>'+(a.modifications?'<p>'+escape(a.modifications)+'</p>':'')+'</div>';
}
function showImage(a,id){
 if(!a)return;
 a=localizedImage(a,getLocale());
 const boundary=a.kind==='schematic'?'示意图依据文献绘制；颜色、形状与层厚经过简化，不代表实测显微图或性能。':a.kind==='generated'?'生成插图只表达形态或原理，不是实拍或实验结果。':a.reference?'此图展示配方中的原料或参考结构，不是这项完整材料或器件的实拍。':'';

 showModal(id?materials[id].label:a.shortLabel,(boundary?'<p>'+boundary+'</p>':'')+'<div class="photo-tools" role="group" aria-label="图片视图"><button data-image-view="fit" aria-pressed="true">适应窗口</button><button data-image-view="original" aria-pressed="false">查看原尺寸</button><a href="'+a.localUrl+'" target="_blank" rel="noopener noreferrer">打开材料图</a></div><figure class="photo-detail '+(a.kind==='schematic'?'schematic':'')+'"><div class="photo-viewport" tabindex="0" aria-label="图片查看区"><img data-asset-file="'+a.file+'" data-image-size="preview" src="'+(a.previewUrl||a.localUrl)+'" data-full-src="'+a.localUrl+'" alt="'+escape(a.description)+'" width="'+a.width+'" height="'+a.height+'"></div><figcaption>'+escape(a.description)+'</figcaption></figure>'+imageAttribution(a));
 document.querySelectorAll('.photo-tools [data-image-view]').forEach(b=>b.addEventListener('click',()=>{const image=$('.photo-viewport img'),viewport=image.parentElement,actual=b.dataset.imageView==='original';image.classList.toggle('original-size',actual);if(actual)image.src=image.dataset.fullSrc;viewport.scrollTo(0,0);document.querySelectorAll('.photo-tools [data-image-view]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));viewport.focus({preventScroll:true});}));
}
function showMaterialPhoto(id){showImage(photo(id),id);}
function field(label,key,ids){return '<div class="field"><label for="'+key+'">'+label+'</label><select id="'+key+'" data-field="'+key+'">'+opt(ids,state[key],key)+'</select></div>';}
function numberfield(label,key,unit,min=.000001){return '<div class="field"><label for="'+key+'">'+label+' <span>'+unit+'</span></label><input id="'+key+'" data-number="'+key+'" type="number" step="any" min="'+min+'" max="1000000000" value="'+(state[key]??'')+'" placeholder="未输入"></div>';}
const dims={pouch:[60,90,9],prismatic:[60,90,20],cylindrical:[18,65,18],alkaline:[14.5,50.5,14.5],coin:[20,20,3.2],aircoin:[12,12,5],pem:[70,70,18],sofc:[70,70,12],rtg:[70,100,70],beta:[20,20,6],lead:[70,90,50],solar:[125,125,5],solarfilm:[80,100,3],carbonzinc:[14.5,50.5,14.5],afc:[70,70,18],pafc:[70,70,18],mcfc:[70,70,18],thinbattery:[30,40,2]};
function resetDimensions(){[state.width,state.height,state.depth]=dims[packaging[state.packaging].model]??[60,90,9];}
const measuredKeys=['area','current','capacity','voltage','operatingVoltage','mass','temperature','irradiance'];
function saveMeasurements(){if(!measuredKeys.some(k=>state[k]!==null)||!state.profile){if(!curves&&!curveText.trim()&&!curveDirty&&curveDraftThreshold===80){measurementRecords.delete(fingerprint(state));return;}}const record={config:{...state},values:Object.fromEntries(measuredKeys.map(k=>[k,state[k]])),curves:curves?.map(p=>({...p}))??null,curveText,curveThreshold,curveDraftThreshold,curveDirty};measurementRecords.set(fingerprint(state),record);}
function restoreMeasurements(){const record=measurementRecords.get(fingerprint(state));for(const key of measuredKeys)state[key]=record?record.values[key]:null;curves=record?.curves?.map(p=>({...p}))??null;curveText=record?.curveText??'';curveThreshold=record?.curveThreshold??80;curveDraftThreshold=record?.curveDraftThreshold??curveThreshold;curveDirty=record?.curveDirty??false;}
function roleForField(key){return state.family==='nuclear'?({cathode:'converter',anode:'heat'}[key]??key):key;}
function showRecords(){saveMeasurements();const entries=[...measurementRecords.values()];showModal('当前页面的测量草稿','<p>每组记录绑定材料、界面、封装与尺寸。更换材料时保留旧记录；刷新页面前请导出保存。</p>'+(entries.length?entries.map((r,i)=>'<article><h3>'+escape(configLabel(r.config))+'</h3><p>'+[r.config.cathode,r.config.anode,r.config.electrolyte].filter(Boolean).map(id=>escape(materials[id].label)).join(' / ')+'</p><p>面积 '+fmt(r.values.area)+' cm² · 电流 '+fmt(r.values.current)+' mA · '+(r.curves?'循环数据 '+r.curves.length+' 点':'无循环记录')+'</p><button data-record="'+i+'">返回这组方案与记录</button></article>').join(''):'<p>还没有录入实测数据。教学示例不会出现在这里。</p>'));document.querySelectorAll('[data-record]').forEach(b=>b.onclick=()=>{saveMeasurements();const record=entries[+b.dataset.record];importSeq++;Object.assign(state,record.config,{step:3});restoreMeasurements();measurementMode='measured';curveDemo=false;teaching=makeTeachingInput(state.family);focusedRole=null;isolatedRole=null;stopPath();render();loadSelectedModel();closeModal();});}
function switchProfile(id){const p=getProfile(id);if(!p)throw new Error('未知体系');if(id===state.profile)return;saveMeasurements();importSeq++;stopPath();$('#part-info').textContent='';viewingMaterialKey=null;drafts.set(state.profile,{config:{...state},curves:curves?.map(x=>({...x}))??null,curveText,curveThreshold,measurementMode});const step=state.step,old=drafts.get(id);if(old){Object.assign(state,old.config,{step});curves=old.curves?.map(x=>({...x}))??null;curveText=old.curveText;curveThreshold=old.curveThreshold;measurementMode=old.measurementMode;}else{Object.assign(state,{family:p.family,profile:id,cathode:p.cathodes[0],anode:p.anodes[0],electrolyte:p.electrolytes[0]??'',packaging:p.packaging[0],sei:'none',area:null,current:null,capacity:null,voltage:null,operatingVoltage:null,mass:null,temperature:null,irradiance:null});curves=null;curveText='';resetDimensions();measurementMode='example';}teaching=makeTeachingInput(p.family);restoreMeasurements();curveDemo=measurementMode==='example';tourIndex=-1;isolatedRole=null;focusedRole=null;activeMaterialKey='cathode';materialQuery='';render();loadSelectedModel();}
function moveToMobile(target,focusTarget=target){
 if(!stackedLayout.matches||!target)return;
 focusTarget?.focus({preventScroll:true});
 target.scrollIntoView({behavior:reducedMotion.matches?'instant':'smooth',block:'start'});
}
function renderMobileContext(){
 const context='第 '+(state.step+1)+' / 4 步 / '+configLabel(state);
 if($('#mobile-context').textContent!==context)$('#mobile-context').textContent=context;
 const key=viewingMaterialKey,show=stackedLayout.matches&&state.step===1&&key&&materials[state[key]]&&focusedRole===roleForField(key);
 $('#mobile-model-context').hidden=!show;
 const label=show?'正在查看：'+roleInfo(getProfile(state.profile),roleForField(key)).title+' · '+materials[state[key]].label:'';
 if($('#mobile-material-label').textContent!==label)$('#mobile-material-label').textContent=label;
}
function inspectMaterial(key){
 viewingMaterialKey=key;
 if(!focusRole(roleForField(key)))return;
 renderMobileContext();
 moveToMobile($('.modelpanel'),$('#model-heading'));
}
function setStep(n){
 if(!Number.isInteger(n)||n<0||n>3)return;
 state.step=n;viewingMaterialKey=null;render();
 $('#stage-title').focus({preventScroll:true});
 (mobileLayout.matches?$('.stage-lead'):$('.steps')).scrollIntoView({behavior:reducedMotion.matches?'instant':'smooth',block:'start'});
}
function render(){
 const focus=rememberFocus();
 densityLab?.dispose();densityLab=null;
 const p=getProfile(state.profile),pv=p.family==='solar',ordinary=['primary','secondary'].includes(p.family),g=familyGuide[p.family];
 $('.shell').className='shell stage-'+state.step;$('#stage-title').textContent=['选择电池体系','材料配置','封装与三维结构','测量与评估'][state.step];$('#stage-desc').textContent=[g.description,'选择兼容材料，查看它在结构中的位置。','查看封装、部件与连接方式。','录入同一试样的测量，或用教学示例熟悉计算。'][state.step];
 $('#step-title').textContent=['选择电池体系','当前选材','封装与外形','测量与计算'][state.step];$('#step-index').textContent='0'+(state.step+1);
 document.querySelectorAll('.step').forEach(b=>{b.classList.toggle('active',+b.dataset.step===state.step);b.setAttribute('aria-current',+b.dataset.step===state.step?'step':'false');});
 let html='';
 if(state.step===0){const ids=[...g.order,...profiles.filter(x=>x.family===state.family&&!g.order.includes(x.id)).map(x=>x.id)],ps=ids.map(getProfile);html='<div class="families">'+families.map(f=>'<button class="family '+(state.family===f.id?'selected':'')+'" data-family="'+f.id+'" aria-pressed="'+(state.family===f.id)+'"><strong>'+f.label+'</strong><span>'+profiles.filter(p=>p.family===f.id).length+' 种</span></button>').join('')+'</div><div class="profile-heading"><h2>'+escape(g.title)+'</h2><button class="textbutton" id="all-profiles">全部体系</button></div><div class="profile-list">'+ps.map(x=>'<button class="profile-choice '+(state.profile===x.id?'selected':'')+'" data-profile="'+x.id+'" aria-pressed="'+(state.profile===x.id)+'"><span><strong>'+escape(x.label)+'</strong><span>'+escape(profileNote(x))+'</span></span></button>').join('')+'</div>';}
 if(state.step===1){html=materialWorkspace(p);if(p.sei&&state.anode==='lithium')html+='<div class="field"><label for="sei">人工界面层</label><select id="sei" data-field="sei">'+seiOptions.map(s=>'<option value="'+s.id+'" '+(state.sei===s.id?'selected':'')+'>'+s.label+'</option>').join('')+'</select><details><summary>界面依据</summary><p>'+escape(seiOptions.find(s=>s.id===state.sei).note)+' '+sourceLink(seiOptions.find(s=>s.id===state.sei).source)+'</p></details></div>';}
 if(state.step===2){const model=packaging[state.packaging].model,round=['cylindrical','alkaline','carbonzinc','coin','aircoin','rtg'].includes(model),flat=['coin','aircoin'].includes(model);html='<div class="packaging-options" role="group" aria-label="封装结构">'+p.packaging.map(id=>'<button data-packaging="'+id+'" '+(validateConfig({...state,packaging:id}).errors.length?'disabled':'')+' aria-pressed="'+(state.packaging===id)+'" class="'+(state.packaging===id?'selected':'')+'"><strong>'+escape(packaging[id].label.split(' · ')[0])+'</strong><span>'+escape(packaging[id].detail)+(validateConfig({...state,packaging:id}).errors.length?' 当前研究配对不支持此封装。':'')+'</span></button>').join('')+'</div><details class="dimension-details"><summary>调整外形尺寸</summary><div class="twocol">'+numberfield(round?'直径':'宽','width','mm',1)+(flat?numberfield('厚度','depth','mm',1):numberfield('高 / 长度','height','mm',1))+'</div>'+(!round?numberfield('厚度','depth','mm',1):'')+'<p>尺寸改变外形比例，不能据此推算容量。</p></details>';}
 if(state.step===3){html='<div class="measurement-tabs" role="group" aria-label="测量数据来源"><button data-mode="example" aria-pressed="'+(measurementMode==='example')+'" class="'+(measurementMode==='example'?'active':'')+'">教学示例</button><button data-mode="measured" aria-pressed="'+(measurementMode==='measured')+'" class="'+(measurementMode==='measured'?'active':'')+'">实测输入</button></div>';if(measurementMode==='example'){html+='<div class="teaching-label">教学示例 · 不是真实性能</div><h2 class="measurement-heading">面积与电流密度</h2><p class="description">拖动试样角标改面积，也可使用下面的滑杆。</p><div id="density-visual"></div>'+teachingField('有效面积','area','cm²',pv?50:10,200,5)+teachingField('工作电流','current','mA',0,2000,50)+'<details class="sample-details"><summary>本例的其他输入</summary><p>工作点电压 '+fmt(ordinary?teaching.operatingVoltage:teaching.voltage)+' V。'+(ordinary?'容量 '+teaching.capacity+' mAh；平均电压 '+teaching.voltage+' V；完整电池质量 '+teaching.mass+' g。':pv?'辐照度 '+teaching.irradiance+' W/m²。':'')+'</p></details><p class="example-note">示例只演示计算，不进入实测记录。</p>';}else{html='<div class="measurement-tabs" role="group" aria-label="测量数据来源"><button data-mode="example" aria-pressed="false">教学示例</button><button data-mode="measured" aria-pressed="true" class="active">实测输入</button></div><p class="description">先输入同一工作点的三项测量。</p><div class="twocol">'+numberfield(pv?'受光面积':'有效面积','area','cm²')+numberfield('工作电流','current','mA',0)+'</div>'+numberfield('工作点电压',ordinary?'operatingVoltage':'voltage','V')+(pv?numberfield('辐照度','irradiance','W/m²'):'')+'<details class="additional-measurements"><summary>'+(ordinary?'容量、质量与平均电压':'补充测试温度')+'</summary><div class="twocol">'+(ordinary?numberfield('实测容量','capacity','mAh')+numberfield('平均放电电压','voltage','V')+numberfield('完整电池质量','mass','g'):'')+numberfield('测试温度','temperature','°C',-273)+'</div></details><details><summary>计算依据</summary><p>电流密度 j = I / A；工作点功率 P = U × I。容量乘平均放电电压得到能量近似值。光伏只有最大功率点测量才能给出最大效率。</p></details>';}}
 html+='<p id="configuration-status" class="error" role="status">'+escape(validateConfig(state).errors.join('；'))+'</p>';html+='<div class="stepactions">'+(state.step>0?'<button data-go="'+(state.step-1)+'">上一步</button>':'')+(state.step<3?'<button class="primary" data-go="'+(state.step+1)+'">'+['配置材料','查看结构','录入与评估'][state.step]+'</button>':'<button data-export>导出我的方案</button>')+'</div>';
 $('#config').innerHTML=html;$('#model-title').textContent=configLabel(state);renderSummary();renderMetrics();renderChecks();renderEvidence();renderCurve();renderLesson();renderTour();applyMaterials();renderMobileContext();if(state.step===3&&measurementMode==='example')renderDensity();refreshReveals(state.step+':'+(state.step===0?state.family:state.step===3?measurementMode:''));restoreLostFocus(focus);
}
function renderSummary(){const p=getProfile(state.profile);$('#config-summary').innerHTML='<dl><dt>体系</dt><dd>'+escape(configLabel(state))+'</dd><dt>材料</dt><dd>'+[state.cathode,state.anode,state.electrolyte].filter(Boolean).map(id=>escape(materials[id].label)).join(' / ')+'</dd><dt>结构依据</dt><dd>'+sourceLink(packaging[state.packaging].source)+'</dd></dl>';}
function measurementConfig(){return measurementMode==='example'?{...state,...teaching}:state;}
function teachingField(label,key,unit,min,max,step){return '<label class="teaching-slider">'+label+'<strong><span data-demo-value="'+key+'">'+fmt(teaching[key])+'</span> '+unit+'</strong><input type="range" data-demo="'+key+'" min="'+min+'" max="'+max+'" step="'+step+'" value="'+teaching[key]+'" aria-label="教学示例'+label+'"></label>';}
function updateTeaching(key,value){
 teaching[key]=key==='area'?clampSampleArea(value,state.family==='solar'?50:10):Math.max(0,Math.min(2000,value));
 const input=document.querySelector('[data-demo="'+key+'"]'),label=document.querySelector('[data-demo-value="'+key+'"]');
 if(input)input.value=String(teaching[key]);if(label)label.textContent=fmt(teaching[key]);renderDensity();renderMetrics();
}
function renderDensity(){
 const host=$('#density-visual');if(!host)return;
 if(!densityLab||densityLab.host!==host){densityLab?.dispose();densityLab=createDensityLab(host,{family:state.family,minArea:state.family==='solar'?50:10,referenceArea:100,onAreaChange:area=>updateTeaching('area',area)});}
 densityLab.update({area:teaching.area,current:teaching.current});
}
function renderMetrics(){const p=getProfile(state.profile),config=measurementConfig();let c;try{c=computePerformance(config);if(config.operatingVoltage!==null&&(!Number.isFinite(config.operatingVoltage)||config.operatingVoltage<=0))throw new Error('工作点电压须为正数');}catch(e){$('#metrics').innerHTML='<p class="error">'+escape(e.message)+'</p>';return;}const example=measurementMode==='example',a=curves?analyzeCurve(curves,curveThreshold):null,P=workingPower(config);$('#result-origin').textContent=example?'教学示例':'用户测量 · 未核验';
 let html='<div class="stat"><label>电流密度</label><strong>'+fmt(c.currentDensity)+'<em> mA/cm²</em></strong><span>电流 ÷ 有效面积</span></div><div class="stat"><label>工作点功率</label><strong>'+fmt(P)+'<em> W</em></strong><span>工作点电压 × 电流</span></div>';
 if(p.family==='solar'){const efficiency=P!==null&&config.area&&config.irradiance?P/(config.area/10000*config.irradiance)*100:null;html+='<div class="stat"><label>工作点光电效率</label><strong>'+fmt(efficiency)+'<em> %</em></strong><span>输出功率 ÷ 同时入射功率</span></div>';}
 if(['primary','secondary'].includes(p.family))html+='<div class="stat"><label>能量近似 / 比能量</label><strong>'+fmt(c.energy)+'<em> Wh</em></strong><span>'+fmt(c.specificEnergy)+' Wh/kg · '+fmt(c.cRate)+' C</span></div>';
 if(!example)html+='<div class="result-gap"><strong>'+(p.family==='secondary'?(a&&!example?fmt(a.last.retention)+'% 保持率':'循环寿命需要实测曲线'):p.family==='primary'?'储存表现需要对应记录':'运行耐久需要时间序列')+'</strong><p>安全性需要对应测试证据。</p></div>';
 $('#metrics').innerHTML=html+(example?'<p class="example-note">教学数值不进入实测记录、对照或导出。</p>':'<p class="metric-note">仅计算已录入的量，来源尚未独立核验。</p>');
}
function renderLesson(){
 const p=getProfile(state.profile);let image=null,title='',text='';
 if(state.step===1||state.step===2){
  image=contextImage(state,state.step===1?'material':'structure',photoAssets);
  title=state.step===1?'材料怎样配合':p.family==='solar'?'接触层如何引出电荷':'封装的作用';
  text=state.step===1?(p.family==='solar'?'吸光层产生电荷，接触与传输层把电荷引出。钝化层和封装影响损失与耐久。':p.family==='fuel'?'氧侧与燃料侧发生电化学反应，电解质传导离子。气体供给与密封需要同时检查。':p.family==='nuclear'?'能量源与转换组件承担不同作用。输出和防护需要对应型号的资料。':'电极参与反应，功能层承担传输或隔离。换材料后，完整试样的性能仍需在同一测试条件下测量。'):p.family==='solar'?'图中突出当前接触与传输层。各层承担电荷选择与引出，层厚与颜色为示意。':'外壳提供保护，连接部件引出电流，密封层隔绝环境。调整外形尺寸只改变模型比例。';
 }else if(state.step===3){
  image=contextImage(state,'measurement',photoAssets);
  title='测量条件与结果';
  text=p.family==='solar'?'面积、辐照度、电压与电流应来自同一光照和工作点。单个工作点的效率不能当作最大效率。':p.family==='fuel'?'记录气体组成、工作点和运行时间。缺少燃料输入记录时，无法计算燃料利用效率。':p.family==='nuclear'?'输出与耐久需要对应型号的完整记录。转换材料的身份不能替代器件测试。':p.family==='primary'?'容量和平均电压给出能量近似值。储存表现还需要温度与时间记录。':'容量保持率只描述已测范围；工作点电压与平均放电电压用于不同计算。';
 }
 $('#lesson').innerHTML=state.step>0?imageFigure(image)+'<div class="lesson-copy"><h2>'+title+'</h2><p>'+text+'</p></div>':'';
}
function tourRoles(){const p=getProfile(state.profile),available=new Set(modelParts.filter(o=>o.userData.materialActive!==false).map(o=>o.userData.role));return [...new Set([...familyGuide[p.family].roles,...available])].filter(r=>available.has(r)&&!(r==='copper'&&available.has('collector')));}
function renderTour(){
 const p=getProfile(state.profile),roles=tourRoles(),guide=$('#structure-guide');
 if(!roles.length){guide.innerHTML='<p>模型载入后可开始部件导览。</p>';return;}
 tourIndex=Math.min(tourIndex,roles.length-1);const info=tourIndex>=0?roleInfo(p,roles[tourIndex]):null;
 const arrow=direction=>'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="'+(direction==='previous'?'M12 5l-5 5 5 5':'M8 5l5 5-5 5')+'" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
 guide.innerHTML='<h3 class="structure-choice-title" id="structure-choice-title">点选部件</h3><div class="role-chips" role="group" aria-labelledby="structure-choice-title">'+roles.map((r,i)=>'<button data-tour="'+i+'" class="'+(i===tourIndex?'active':'')+'" aria-pressed="'+(i===tourIndex)+'"><span class="role-indicator" aria-hidden="true"></span><span>'+escape(roleInfo(p,r).title)+'</span></button>').join('')+'</div>'+(info?'<div class="tour-copy"><div class="tour-readout" role="status" aria-live="polite" aria-atomic="true"><div class="tour-heading"><h3>'+escape(info.title)+'</h3><span class="tour-counter" aria-label="结构导览 '+(tourIndex+1)+' / '+roles.length+'">'+(tourIndex+1)+' / '+roles.length+'</span></div><p>'+escape(info.text)+'</p></div><div class="tour-actions"><div class="tour-navigation"><button data-tour="'+(tourIndex-1)+'" data-tour-nav="previous"'+(tourIndex===0?' disabled':'')+'>'+arrow('previous')+'<span>上一层</span></button><button data-tour="'+(tourIndex+1)+'" data-tour-nav="next"'+(tourIndex===roles.length-1?' disabled':'')+'><span>下一层</span>'+arrow('next')+'</button></div><button data-view="whole" class="tour-reset">恢复全貌</button></div></div>':'<p class="tour-hint">点上面的层名，看它在哪里、做什么。</p>');
}
function focusRole(role){if(!modelParts.some(o=>o.userData.role===role&&o.userData.materialActive!==false)){toast('当前模型未独立展示这一层，请查看材料依据。');return false;}isolatedRole=null;focusedRole=role;tourIndex=tourRoles().indexOf(role);if(role==='shell')cutaway=false;$('#assembly-progress').value=100;$('#cutaway').classList.toggle('active',cutaway);$('#cutaway').setAttribute('aria-pressed',cutaway);applyDisplay();renderTour();const o=modelParts.find(o=>o.userData.role===role&&o.visible);if(o)selectPart(o);renderMobileContext();return true;}
function restoreView(exploded=false){stopPath();focusedRole=null;isolatedRole=null;tourIndex=-1;selectedPart=null;cutaway=exploded;$('#explode').value=exploded?70:0;$('#assembly-progress').value=100;$('#cutaway').classList.toggle('active',cutaway);$('#cutaway').setAttribute('aria-pressed',cutaway);applyMaterials();fitModel();renderTour();$('#part-info').textContent='';viewingMaterialKey=null;renderMobileContext();}
function plan(){if(!safetyPlans.has(state.profile))safetyPlans.set(state.profile,new Set());return safetyPlans.get(state.profile);}
function renderChecks(){const focus=rememberFocus();try{const p=getProfile(state.profile),v=validateConfig(state),rs=safetyRows(state);$('#plan-count').textContent='计划 '+plan().size+' / '+rs.length+' 项';$('#checks').innerHTML=imageFigure(contextImage(state,'safety',photoAssets),'safety-figure')+'<p class="'+(v.errors.length?'error':'description')+'">'+(v.errors.length?escape(v.errors.join('；')):'当前没有足够测试证据判断安全性。')+'</p><div class="safetyrows">'+rs.map((r,i)=>'<article class="safety-item"><div class="safety-item-head"><h3>'+escape(r.mechanism)+'</h3><button data-risk="'+i+'" class="textbutton">查看部位</button></div><p>'+escape(r.trigger)+'</p><details><summary>需要哪些记录？</summary><p>'+escape(r.test)+'</p></details><button data-plan="'+i+'" aria-pressed="'+plan().has(i)+'" class="'+(plan().has(i)?'planned':'')+'">'+(plan().has(i)?'已加入待验证清单 · 移除':'加入待验证清单')+'</button></article>').join('')+'</div><details><summary>当前体系的风险依据</summary><p>'+escape(p.risk)+' '+sourceLink(p.sources[0])+'</p><p>'+escape(v.warnings.join(' '))+'</p></details>';}finally{restoreLostFocus(focus);}}
function stopPath(){
 const controller=pathController,snapshot=pathSnapshot;pathController=null;pathSnapshot=null;controller?.destroy();
 if(snapshot&&snapshot.profile===state.profile&&snapshot.modelKey===modelKey){
  focusedRole=snapshot.focusedRole;isolatedRole=snapshot.isolatedRole;tourIndex=snapshot.tourIndex;selectedPart=snapshot.selectedPart;cutaway=snapshot.cutaway;viewingMaterialKey=snapshot.viewingMaterialKey;
  $('#explode').value=snapshot.explode;$('#assembly-progress').value=snapshot.assemblyProgress;
  $('#cutaway').classList.toggle('active',cutaway);$('#cutaway').setAttribute('aria-pressed',cutaway);
  applyDisplay();if(selectedPart&&modelParts.includes(selectedPart))selectedPart.material.emissive?.setHex(0x493411);
  renderTour();renderMobileContext();$('#part-info').innerHTML=snapshot.partInfo;
 }
 if(controller)updateModelLoop();
}
function showPath(){
 const steps=chargePathSteps(state);
 showModal('电从哪里走？','<div id="pathway-lesson" data-i18n-skip></div>');
 $('#pathway-lesson').closest('.modal').classList.add('pathway-modal');
 pathSnapshot={profile:state.profile,modelKey,focusedRole:Array.isArray(focusedRole)?[...focusedRole]:focusedRole,isolatedRole,tourIndex,selectedPart,cutaway,viewingMaterialKey,explode:$('#explode').value,assemblyProgress:$('#assembly-progress').value,partInfo:$('#part-info').innerHTML};
 pathController=createPathwayLesson($('#pathway-lesson'),{config:{...state},steps,onStep(index){
  const roles=steps[index].roles.filter(role=>modelParts.some(part=>part.userData.role===role&&part.userData.materialActive!==false));
  focusedRole=roles;isolatedRole=null;if(roles.includes('shell'))cutaway=false;$('#assembly-progress').value=100;
  applyDisplay();tourIndex=roles.length===1?tourRoles().indexOf(roles[0]):-1;renderTour();renderMobileContext();$('#part-info').textContent=steps[index].text+' · 路径示意';
 }});
 updateModelLoop();
}
function showAllProfiles(){showModal('全部 32 种体系','<label class="catalog-search">按名称或材料搜索<input id="profile-search" type="search" placeholder="例如：太阳能、固态、镍氢"></label><div class="catalog-filters"><button data-filter="all" class="active">全部</button>'+families.map(f=>'<button data-filter="'+f.id+'">'+f.label+'</button>').join('')+'</div><div id="profile-catalog" class="profile-catalog"></div>');let filter='all';const draw=()=>{const query=$('#profile-search').value.toLowerCase(),ps=profiles.filter(p=>(filter==='all'||p.family===filter)&&(p.label+' '+translate(p.label,'en')+' '+p.id+' '+[...p.cathodes,...p.anodes,...p.electrolytes].map(id=>materials[id].label+' '+translate(materials[id].label,'en')).join(' ')).toLowerCase().includes(query));$('#profile-catalog').innerHTML=ps.map(p=>'<button data-catalog-profile="'+p.id+'">'+shapeSketch(p)+'<span><strong>'+escape(p.label)+'</strong><span>'+escape(profileNote(p))+'</span></span></button>').join('')||( '<p>没有匹配的体系，试试材料或电池名称。</p>');document.querySelectorAll('[data-catalog-profile]').forEach(b=>b.onclick=()=>{switchProfile(b.dataset.catalogProfile);closeModal();});};$('#profile-search').oninput=draw;document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{filter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>x.classList.toggle('active',x===b));draw();});draw();}
function renderCurve(){const focus=rememberFocus();try{const p=getProfile(state.profile);$('#durability-title').textContent=p.family==='secondary'?'读一条循环曲线':'耐久要记录什么？';if(p.family!=='secondary'){const topics={primary:['单次放电','同时记录电压、电流、时间和截止条件；储存测试另记环境与时间。'],solar:['光照与输出衰减','记录运行时间、光照、温度与同一工作点的输出。单点效率不是最大效率。'],fuel:['运行小时与输出衰减','记录气体组成、工作点和启停条件。不同工况不能直接比较耐久。'],nuclear:['器件时间与电输出','以完整型号的时间—输出记录为准；不能用转换材料身份推断寿命。']};const t=topics[p.family];$('#curve-panel').innerHTML='<div class="durability-story"><h3>'+t[0]+'</h3><p>'+t[1]+'</p><div class="record-flow"><span>同一试样</span><span>同一工况</span><span>时间与输出</span></div><button id="durability-evidence">查看测试证据</button></div>';return;}$('#curve-panel').innerHTML='<p class="description">保持率是相对首个测量点的容量比例，阈值交点只在已测范围内寻找。</p><div class="curve-modes" role="group" aria-label="曲线数据来源"><button id="curve-demo" aria-pressed="'+(curveDemo?'true':'false')+'" class="'+(curveDemo?'active':'')+'">试读示例曲线</button><button id="curve-own" aria-pressed="'+(!curveDemo?'true':'false')+'" class="'+(!curveDemo?'active':'')+'">录入我的曲线</button></div>'+(curveDemo?'<div class="teaching-label">教学示例 · 虚构数值，仅演示读图</div><label class="teaching-slider">保持率阈值<strong><span id="demo-threshold-value">'+demoThreshold+'</span>%</strong><input id="demo-threshold" type="range" min="50" max="95" value="'+demoThreshold+'" aria-label="教学曲线保持率阈值"></label>':'<div class="curve-input"><label for="curve-data">循环次数，容量（mAh）</label><textarea id="curve-data" placeholder="cycle,capacity_mAh&#10;粘贴两列实测数据">'+escape(curveText)+'</textarea><div class="curve-actions"><label>阈值 <input id="curve-threshold" type="number" value="'+curveDraftThreshold+'" min="1" max="99"> %</label><label class="file-label">导入 CSV<input id="curve-file" type="file" accept=".csv,.txt,text/csv,text/plain"></label><button class="primary" id="analyze-curve">评估我的曲线</button><button id="clear-curve">清空</button></div><p id="curve-message" role="status">'+(curveDirty?'输入已修改，图中为上次评估结果；请重新评估。':curves?'用户输入，来源未独立核验。':'数据在当前浏览器处理。示例不会填进这里。')+'</p></div>')+'<div id="curve-output"></div>';if(curveDemo)drawCurve(teachingCurve,demoThreshold,true);else if(curves)drawCurve(curves,curveThreshold,false);}finally{restoreLostFocus(focus);}}
function drawCurve(points=curves,threshold=curveThreshold,example=false){const focus=rememberFocus();try{const a=analyzeCurve(points,threshold),W=660,H=235,L=56,R=18,T=18,B=40,xmin=a.baseline.cycle,xmax=a.last.cycle,ymax=Math.max(105,...a.points.map(p=>p.retention))*1.03,ymin=Math.max(0,Math.min(threshold,...a.points.map(p=>p.retention))-10),x=c=>L+(c-xmin)/(xmax-xmin)*(W-L-R),y=v=>T+(ymax-v)/(ymax-ymin)*(H-T-B),ticks=[0,.25,.5,.75,1];const svg='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+(example?'教学示例':'用户实测')+'容量保持率曲线">'+ticks.map(t=>{const yy=ymin+(ymax-ymin)*t;return '<line x1="'+L+'" x2="'+(W-R)+'" y1="'+y(yy)+'" y2="'+y(yy)+'" stroke="#d5d4ce"/><text x="'+(L-8)+'" y="'+(y(yy)+5)+'" text-anchor="end">'+Math.round(yy)+'%</text>';}).join('')+'<line x1="'+L+'" x2="'+(W-R)+'" y1="'+y(threshold)+'" y2="'+y(threshold)+'" stroke="#766a58" stroke-dasharray="5 5"/><polyline fill="none" stroke="#315b73" stroke-width="3" points="'+a.points.map(p=>x(p.cycle)+','+y(p.retention)).join(' ')+'"/>'+a.points.map(p=>'<circle cx="'+x(p.cycle)+'" cy="'+y(p.retention)+'" r="4" fill="#315b73"><title>'+p.cycle+' 圈 · '+p.capacity+' mAh · '+fmt(p.retention)+'%</title></circle>').join('')+ticks.map(t=>'<text x="'+x(xmin+(xmax-xmin)*t)+'" y="'+(H-15)+'" text-anchor="middle">'+Math.round(xmin+(xmax-xmin)*t)+'</text>').join('')+'<text x="'+(W-R)+'" y="'+(H-1)+'" text-anchor="end">循环次数</text></svg>';$('#curve-output').innerHTML=svg+'<div class="curve-points" role="group" aria-label="选择曲线读数">'+(a.points.length<=8?a.points.map((p,i)=>'<button data-curve-point="'+i+'" aria-pressed="false">'+p.cycle+' 圈</button>').join(''):'<label for="curve-point-select">测量点</label><select id="curve-point-select">'+a.points.map((p,i)=>'<option value="'+i+'">第 '+p.cycle+' 圈 · '+p.capacity+' mAh</option>').join('')+'</select>')+'</div><p id="point-readout" class="point-readout" role="status" aria-live="polite" aria-atomic="true">点一个测量点，读取容量与保持率。</p><div class="curve-result"><strong>'+fmt(a.last.retention)+'%</strong><span>第 '+a.last.cycle+' 圈相对第 '+a.baseline.cycle+' 圈</span><p>'+(a.crossing===null?'测试范围内尚未达到 '+threshold+'% 阈值。':threshold+'% 首次向下交点约为 '+fmt(a.crossing)+' 圈（相邻测量点线性内插）。')+'</p></div><p class="description">'+(example?'这组虚构数值仅帮助读图，不会保存成实测记录。':'仅报告实测范围，交点不自动等同于认证寿命。')+'</p>';}finally{restoreLostFocus(focus);}}
function renderEvidence(){const p=getProfile(state.profile),rs=relatedObservations(state),ids=[...new Set([...p.sources,packaging[state.packaging].source,...[state.cathode,state.anode,state.electrolyte].filter(Boolean).flatMap(x=>[materials[x].source,...(materials[x].relatedSources??[])]),seiOptions.find(s=>s.id===state.sei)?.source].filter(Boolean))];$('#evidence-count').textContent=ids.length+' 个来源';$('#evidence').innerHTML=rs.map(o=>'<article><div class="evidence-value">'+escape(o.metric)+' <strong>'+o.value+' '+o.unit+'</strong></div><p>'+escape(o.qualifier)+' · '+escape(o.conditions)+'</p><details><summary>与当前方案的差异</summary><p>'+escape(sourceDifferences(state,o).join('；'))+'</p></details>'+sourceLink(o.source)+'</article>').join('')+ids.map(id=>{const s=getSource(id);return '<article><h3>'+sourceLink(id)+'</h3><p>'+escape(s.kind)+' · '+escape(s.locator)+'</p><p>'+escape(s.note)+'</p></article>';}).join('');}
let modalFocus=null,modalBackground=[];
function showModal(title,body){
 const previous=$('.modalback'),invoker=previous?.contains(document.activeElement)?modalFocus:rememberFocus();
 closeModal(false);
 modalFocus=invoker;
 const back=document.createElement('div');back.className='modalback';
 back.innerHTML='<section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button id="modal-close" aria-label="关闭">关闭</button><h2 id="modal-title">'+escape(title)+'</h2>'+body+'</section>';
 document.body.append(back);
 back.querySelector('#modal-close').onclick=()=>closeModal();
 back.onclick=e=>{if(e.target===back)closeModal();};
 back.querySelector('#modal-close').focus({preventScroll:true});
 modalBackground=[...document.body.children].filter(element=>element!==back).map(element=>({element,inert:element.inert}));
 modalBackground.forEach(({element})=>{element.inert=true;});
 back.addEventListener('keydown',e=>{
  if(e.key==='Escape'){e.preventDefault();e.stopPropagation();closeModal();return;}
  if(e.key!=='Tab')return;
  const items=[...back.querySelectorAll('button,input,a[href],select,textarea,summary,[tabindex]:not([tabindex="-1"])')].filter(x=>!x.disabled&&x.getClientRects().length&&![...back.querySelectorAll('details:not([open])')].some(detail=>detail.contains(x)&&!detail.querySelector(':scope > summary')?.contains(x)));
  const first=items[0],last=items.at(-1);
  if(!first){e.preventDefault();return;}
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
 });
}
function closeModal(returnFocus=true){
 const back=$('.modalback');if(!back)return;
 stopPath();back.remove();
 modalBackground.forEach(({element,inert})=>{if(element.isConnected)element.inert=inert;});
 modalBackground=[];
 const invoker=modalFocus;modalFocus=null;
 if(returnFocus)restoreFocus(invoker,true);
}
document.addEventListener('battery-lab-dismiss-modal',()=>closeModal(false));
function toast(t){const el=document.createElement('div');el.className='toast';el.setAttribute('role','status');el.textContent=t;document.body.append(el);setTimeout(()=>el.remove(),4500);}
function showCompare(){
 if(!compareA){showModal('开始方案对照','<p>先记住当前材料和实测输入，再换一个材料或体系进行对照。教学示例不会保存。</p><button id="compare-start" class="primary">记住当前方案 A</button>');$('#compare-start').onclick=()=>{try{computePerformance(state);}catch(e){toast(e.message);return;}compareA={config:{...state},curves:curves?.map(x=>({...x}))??null};closeModal();toast('方案 A 已记住。更换材料后，比较当前方案。');};return;}
 if(!compareB)compareB={config:{...state},curves:curves?.map(x=>({...x}))??null};
 const cs=[compareA,compareB],rows=[['体系',c=>configLabel(c.config)],['正极 / 吸光层',c=>materials[c.config.cathode].label],['负极 / 接触',c=>materials[c.config.anode].label],['电解质 / 功能层',c=>materials[c.config.electrolyte]?.label??'不适用'],['温度',c=>fmt(c.config.temperature)+' °C'],['有效面积',c=>fmt(c.config.area)+' cm²'],['工作电流',c=>fmt(c.config.current)+' mA'],['电流密度',c=>fmt(computePerformance(c.config).currentDensity)+' mA/cm²'],['工作点功率',c=>fmt(workingPower(c.config))+' W'],['循环数据',c=>c.curves?'测试至 '+c.curves.at(-1).cycle+' 圈':'未录入']];
 const conditions=['profile','area','current','temperature','irradiance'],matched=conditions.every(k=>cs[0].config[k]===cs[1].config[k])&&cs.every(c=>c.config.temperature!==null&&c.config.area!==null&&c.config.current!==null);
 showModal('方案 A / B','<div class="tablewrap"><table><thead><tr><th>比较项</th><th>A</th><th>B</th></tr></thead><tbody>'+rows.map(([k,fn])=>{const values=cs.map(fn),different=values[0]!==values[1];return '<tr class="'+(different?'difference':'')+'"><th>'+k+'</th>'+values.map(v=>'<td>'+escape(v)+'</td>').join('')+'</tr>';}).join('')+'</tbody></table></div><p>'+(!matched?'测量条件缺失或不同，暂不能直接比较性能。':'已录入的基本工况相同，制备与完整试样条件仍需核对。')+' 教学示例不在这张表中；用户输入尚未独立核验。</p>');
}
function downloadConfig(){saveMeasurements();try{computePerformance(state);}catch(error){toast('无法导出：'+error.message);return;}const ids=new Set([...getProfile(state.profile).sources,...[state.cathode,state.anode,state.electrolyte].filter(Boolean).flatMap(id=>[materials[id].source,...(materials[id].relatedSources??[])]),packaging[state.packaging].source]);const report={schema:'battery-lab-1',verifiedOn:'2026-10-03',config:{...state},calculation:computePerformance(state),safetyPlan:safetyRows(state).filter((_,i)=>plan().has(i)),safetyTestRecords:[],teachingDataIncluded:false,measurementDrafts:[...measurementRecords.values()],cycleData:curves,cycleDraft:{csv:curveText,threshold:curveDraftThreshold,pending:curveDirty},cycleEvaluation:curves?analyzeCurve(curves,curveThreshold):null,observations:relatedObservations(state),sources:sources.filter(s=>ids.has(s.id)),validation:validateConfig(state),note:'文献与产品结果不作为自定义方案预测；用户输入未独立核验；结构是观察示意。'};const u=URL.createObjectURL(new Blob([JSON.stringify(report,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=u;a.download='battery-configuration.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
root.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.step!==undefined||b.dataset.go!==undefined)setStep(+(b.dataset.step??b.dataset.go));
 if(b.dataset.family&&state.family!==b.dataset.family)switchProfile(familyGuide[b.dataset.family].order[0]);
 if(b.dataset.profile)switchProfile(b.dataset.profile);
 if(b.dataset.packaging){if(b.dataset.packaging===state.packaging)return;if(validateConfig({...state,packaging:b.dataset.packaging}).errors.length){toast('当前研究配对不支持此封装。');return;}saveMeasurements();importSeq++;state.packaging=b.dataset.packaging;resetDimensions();restoreMeasurements();render();loadSelectedModel();document.querySelector('[data-packaging="'+state.packaging+'"]')?.focus({preventScroll:true});}
 if(b.id==='all-profiles')showAllProfiles();if(b.id==='records')showRecords();
 if(b.dataset.materialKey){activeMaterialKey=b.dataset.materialKey;materialQuery='';render();focusRole(roleForField(activeMaterialKey));$('#tab-'+activeMaterialKey)?.focus({preventScroll:true});return;}
 if(b.dataset.choose){chooseMaterial(b.dataset.key,b.dataset.choose);return;}
 if(b.dataset.photo)showMaterialPhoto(b.dataset.photo);
 if(b.dataset.imageFile){const a=photoAssets.find(a=>a.file===b.dataset.imageFile);if(a)showImage({...a,reference:b.dataset.imageReference==='true'});}
 if(b.id==='reload-images')loadPhotoAssets();

 if(b.dataset.inspect)inspectMaterial(b.dataset.inspect);
 if(b.id==='return-material'&&viewingMaterialKey){const key=viewingMaterialKey;moveToMobile($('#material-browser'),$('#'+key)||$('#material-search'));}
 if(b.dataset.camera){adjustCamera(b.dataset.camera);return;}
 if(b.dataset.tour!==undefined){const index=+b.dataset.tour,role=tourRoles()[index],keepFocus=document.activeElement===b,nav=b.dataset.tourNav;if(role&&focusRole(role)&&keepFocus){const target=nav?$('#structure-guide [data-tour-nav="'+nav+'"]:not(:disabled)'):null;(target||$('#structure-guide .role-chips [data-tour="'+index+'"]'))?.focus({preventScroll:true});}}
 if(b.dataset.view){const fromTour=b.classList.contains('tour-reset');restoreView(b.dataset.view==='exploded');if(fromTour)$('#structure-guide .role-chips button')?.focus({preventScroll:true});}
 if(b.dataset.mode){importSeq++;measurementMode=b.dataset.mode;curveDemo=measurementMode==='example';render();document.querySelector('[data-mode="'+measurementMode+'"]')?.focus({preventScroll:true});}
 if(b.dataset.plan!==undefined){const i=+b.dataset.plan;if(plan().has(i))plan().delete(i);else plan().add(i);renderChecks();}
 if(b.dataset.risk!==undefined){const rs={secondary:['electrolyte','cathode','seal'],primary:['anode','seal','shell'],solar:['seal','collector','cathode'],fuel:['seal','electrolyte','cathode'],nuclear:['heat','converter','shell']};setStep(2);focusRole(rs[state.family][+b.dataset.risk]);$('.modelpanel').scrollIntoView({behavior:'smooth',block:'start'});}
 if(b.id==='sources')showModal('资料库','<p>原论文、厂家产品、结构参考和设计输入分别记录。</p>'+sources.map(s=>'<article><h3>'+sourceLink(s.id)+'</h3><p>'+escape(s.kind)+' · '+escape(s.locator)+'</p><p>'+escape(s.note)+'</p></article>').join('')+'<h3>图片来源与许可</h3>'+photoAssets.filter(a=>a.kind!=='generated').map(a=>'<article><h3>'+escape(a.shortLabel||a.file)+'</h3><p>'+escape(a.description)+'</p>'+imageAttribution(a)+'</article>').join('')+'<h3>生成插图</h3><p>形态与原理插图不是实拍材料或实验记录。<a href="/assets/illustrations.md" target="_blank" rel="noopener noreferrer">完整提示词与用途</a></p>'+photoAssets.filter(a=>a.kind==='generated').map(a=>'<article><h3>'+escape(a.shortLabel)+'</h3><p>'+escape(a.description)+'</p></article>').join(''));

 if(b.id==='export-config'||b.dataset.export!==undefined)downloadConfig();
 if(b.id==='cutaway'){cutaway=!cutaway;b.classList.toggle('active',cutaway);b.setAttribute('aria-pressed',cutaway);applyDisplay();}
 if(b.id==='rotate'){controls.autoRotate=!controls.autoRotate;b.classList.toggle('active',controls.autoRotate);b.setAttribute('aria-pressed',controls.autoRotate);}
 if(b.id==='reset-camera')restoreView(false);
 if(b.id==='parts')showParts();
 if(['path','lesson-path'].includes(b.id))showPath();
 if(b.id==='save-a'||b.id==='save-b'){const snapshot={config:{...state},curves:curves?.map(x=>({...x}))??null};try{computePerformance(snapshot.config);}catch(error){toast('先修正输入：'+error.message);return;}if(b.id==='save-a'){compareA=snapshot;toast('已记住 A。换一个材料或体系，再比较当前方案。');}else{compareB=snapshot;showCompare();}}
 if(b.id==='compare')showCompare();
 if(b.id==='durability-evidence'){$('.evidence-drawer').open=true;$('.evidence-drawer > summary').focus({preventScroll:true});$('.evidence-drawer').scrollIntoView({behavior:reducedMotion.matches?'instant':'smooth'});}
 if(b.id==='curve-demo'){curveDemo=true;renderCurve();}
 if(b.id==='curve-own'){curveDemo=false;renderCurve();}
 if(b.dataset.curvePoint!==undefined){const a=analyzeCurve(curveDemo?teachingCurve:curves,curveDemo?demoThreshold:curveThreshold),point=a.points[+b.dataset.curvePoint];$('#point-readout').textContent='第 '+point.cycle+' 圈 · 容量 '+point.capacity+' mAh · 保持率 '+fmt(point.retention)+'%';document.querySelectorAll('[data-curve-point]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b));});}
 if(b.id==='analyze-curve'){importSeq++;const text=$('#curve-data').value;try{const ps=parseCurve(text),t=Number($('#curve-threshold').value);analyzeCurve(ps,t);curves=ps;curveText=text;curveThreshold=t;curveDraftThreshold=t;curveDirty=false;saveMeasurements();renderCurve();renderMetrics();}catch(error){const msg=$('#curve-message');if(msg)msg.textContent=error.message;else toast(error.message);}}
 if(b.id==='clear-curve'){importSeq++;curves=null;curveText='';curveDirty=false;saveMeasurements();renderCurve();renderMetrics();}
});
root.addEventListener('keydown',e=>{
 const button=e.target.closest('button');if(!button)return;
 if(button.dataset.materialKey&&['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){
  const tabs=[...document.querySelectorAll('[data-material-key]')],index=tabs.indexOf(button),next=e.key==='Home'?0:e.key==='End'?tabs.length-1:(index+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;e.preventDefault();tabs[next].click();
 }
 if(button.dataset.choose&&['ArrowDown','ArrowUp','ArrowLeft','ArrowRight','Home','End'].includes(e.key)){
  const choices=[...document.querySelectorAll('.material-choice:not(:disabled)')],index=choices.indexOf(button),next=e.key==='Home'?0:e.key==='End'?choices.length-1:(index+(['ArrowDown','ArrowRight'].includes(e.key)?1:-1)+choices.length)%choices.length;e.preventDefault();chooseMaterial(button.dataset.key,choices[next].dataset.choose);$('#'+button.dataset.key)?.scrollIntoView({block:'nearest',inline:'nearest'});
 }
});
root.addEventListener('change',async e=>{
 const t=e.target;if(t.id==='curve-point-select'){const a=analyzeCurve(curveDemo?teachingCurve:curves,curveDemo?demoThreshold:curveThreshold),point=a.points[Number(t.value)];$('#point-readout').textContent='第 '+point.cycle+' 圈 · 容量 '+point.capacity+' mAh · 保持率 '+fmt(point.retention)+'%';return;}if(t.id==='curve-file'){const file=t.files?.[0];if(!file)return;if(file.size>1024*1024){$('#curve-message').textContent='CSV 请小于 1 MB';return;}const origin=fingerprint(state),originProfile=state.profile,seq=++importSeq;try{const text=await file.text();if(seq!==importSeq||originProfile!==state.profile||origin!==fingerprint(state)){toast('导入期间方案已改变，本次导入已取消。');return;}const ps=parseCurve(text);analyzeCurve(ps,curveDraftThreshold);curves=ps;curveText=text;curveThreshold=curveDraftThreshold;curveDirty=false;saveMeasurements();renderCurve();renderMetrics();}catch(error){const msg=$('#curve-message');if(msg)msg.textContent=error.message;else toast(error.message);}return;}
 if(t.dataset.field){const k=t.dataset.field;if(k==='profile'){switchProfile(t.value);return;}saveMeasurements();importSeq++;state[k]=t.value;if(k==='packaging')resetDimensions();if(k!=='sei')state.sei='none';restoreMeasurements();if(['cathode','anode','electrolyte'].includes(k)){viewingMaterialKey=k;activeMaterialKey=k;}render();if(k==='packaging')loadSelectedModel();else if(['cathode','anode','electrolyte'].includes(k))focusRole(roleForField(k));$('#'+k)?.focus({preventScroll:true});}
});
root.addEventListener('input',e=>{
 const t=e.target;if(t.id==='material-search'){materialQuery=t.value;const rows=materialRows(getProfile(state.profile),activeMaterialKey);$('#material-choices').innerHTML=rows.html;$('#material-result-count').textContent=rows.count+' 种候选';if(!$('#material-choices [tabindex="0"]'))$('#material-choices .material-choice:not(:disabled)')?.setAttribute('tabindex','0');return;}if(t.dataset.demo){updateTeaching(t.dataset.demo,Number(t.value));return;}
 if(t.id==='demo-threshold'){demoThreshold=Number(t.value);$('#demo-threshold-value').textContent=demoThreshold;drawCurve(teachingCurve,demoThreshold,true);return;}
 if(t.id==='curve-data'){curveText=t.value;curveDirty=true;importSeq++;saveMeasurements();$('#curve-message').textContent='输入已修改，图中为上次评估结果；请重新评估。';return;}if(t.id==='curve-threshold'){curveDraftThreshold=Number(t.value);curveDirty=true;importSeq++;saveMeasurements();$('#curve-message').textContent='阈值已修改，图中为上次评估结果；请重新评估。';return;}
 if(!t.dataset.number)return;const dimensions=['width','height','depth'].includes(t.dataset.number);if(dimensions){saveMeasurements();importSeq++;}state[t.dataset.number]=t.value===''?null:Number(t.value);if(dimensions){restoreMeasurements();resizeModel();renderChecks();$('#configuration-status').textContent=validateConfig(state).errors.join('；');}else{saveMeasurements();renderMetrics();}
});
const canvas=$('#model-view');let renderer;
try{renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;}catch{$('#viewstatus').textContent='请启用浏览器硬件加速以查看三维模型。';}
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(38,1,.00001,100),controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.autoRotateSpeed=.55;scene.add(new THREE.HemisphereLight(0xf5f5f2,0x303238,1.25));
for(const [pos,color,intensity] of [[[.3,.35,.4],0xffffff,2.4],[[-.3,.1,-.2],0xcdd2d1,1.25],[[0,-.3,.3],0xf4c39d,.55]]){const l=new THREE.DirectionalLight(color,intensity);l.position.set(...pos);scene.add(l);}
if(renderer){
 const studio=new THREE.Scene();studio.background=new THREE.Color(0x252525);
 for(const [position,size,power] of [[[0,3,0],[4,2],5],[[3,1,1],[2,4],3],[[-3,0,2],[2,3],1.8]]){const lightbox=new THREE.Mesh(new THREE.PlaneGeometry(...size),new THREE.MeshBasicMaterial({color:new THREE.Color(power,power,power),side:THREE.DoubleSide}));lightbox.position.set(...position);lightbox.lookAt(0,0,0);studio.add(lightbox);}
 const generator=new THREE.PMREMGenerator(renderer);scene.environment=generator.fromScene(studio,.08).texture;generator.dispose();studio.traverse(o=>{if(o.isMesh){o.geometry.dispose();o.material.dispose();}});
}
const grid=new THREE.GridHelper(.3,18,0x666968,0x474b4a);grid.position.y=-.09;grid.material.transparent=true;grid.material.opacity=.18;scene.add(grid);
const loader=new GLTFLoader();

function adjustCamera(action){
 if(!activeModel||root.hidden||root.inert||pathController)return;
 controls.autoRotate=false;$('#rotate').classList.remove('active');$('#rotate').setAttribute('aria-pressed','false');
 const offset=camera.position.clone().sub(controls.target),spherical=new THREE.Spherical().setFromVector3(offset);
 if(action==='reset')fitModel();
 else if(action.startsWith('pan-')){
  camera.updateMatrixWorld();
  const horizontal=new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,0),vertical=new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,1),distance=spherical.radius*.08;
  const movement=(action==='pan-left'||action==='pan-right'?horizontal:vertical).multiplyScalar(distance*(action==='pan-left'||action==='pan-down'?-1:1));
  camera.position.add(movement);controls.target.add(movement);
 }else{
  if(action==='left')spherical.theta-=Math.PI/12;
  if(action==='right')spherical.theta+=Math.PI/12;
  if(action==='up')spherical.phi-=Math.PI/18;
  if(action==='down')spherical.phi+=Math.PI/18;
  if(action==='in'||action==='out')spherical.radius=THREE.MathUtils.clamp(spherical.radius*(action==='in'?.82:1/.82),controls.minDistance,controls.maxDistance);
  spherical.phi=THREE.MathUtils.clamp(spherical.phi,Math.max(.06,controls.minPolarAngle),Math.min(Math.PI-.06,controls.maxPolarAngle));
  camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(spherical));
 }
 controls.update();
 const azimuth=fmt(THREE.MathUtils.radToDeg(controls.getAzimuthalAngle())),elevation=fmt(90-THREE.MathUtils.radToDeg(controls.getPolarAngle())),distance=fmt(camera.position.distanceTo(controls.target)*1000);
 if(action.startsWith('pan-')){const center=[controls.target.x,controls.target.y,controls.target.z].map(value=>fmt(value*1000)).join(', ');$('#camera-status').textContent=(getLocale()==='en'?'View center (mm): ':'视角中心（mm）：')+center;return;}
 $('#camera-status').textContent=getLocale()==='en'?'View: azimuth '+azimuth+'°, elevation '+elevation+'°, camera distance '+distance+' mm.':'视角：水平 '+azimuth+'°，仰角 '+elevation+'°，相机距离 '+distance+' mm。';
}
canvas.addEventListener('keydown',event=>{
 if(event.altKey||event.ctrlKey||event.metaKey)return;
 const arrows={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down'};
 let action=arrows[event.key];
 if(action&&event.shiftKey)action='pan-'+action;
 else if(['+','='].includes(event.key))action='in';
 else if(['-','−'].includes(event.key))action='out';
 else if(event.key==='Home')action='reset';
 if(action){event.preventDefault();adjustCamera(action);}
});

function fitModel(){
 if(!activeModel)return;
 activeModel.updateMatrixWorld(true);
 const box=new THREE.Box3();for(const part of modelParts)if(part.visible)box.expandByObject(part);
 if(box.isEmpty())box.setFromObject(activeModel);
 const center=box.getCenter(new THREE.Vector3()),size=box.getSize(new THREE.Vector3()),scale=Math.max(size.x,size.y,size.z)||.1;
 const upright=['cylindrical','alkaline','carbonzinc','rtg'].includes(packaging[state.packaging].model);
 const direction=new THREE.Vector3(...(upright?[.95,.55,1.3]:[1,1.3,1.65])).normalize(),right=new THREE.Vector3().crossVectors(camera.up,direction).normalize(),up=new THREE.Vector3().crossVectors(direction,right);
 const vertical=Math.tan(THREE.MathUtils.degToRad(camera.fov/2)),horizontal=vertical*camera.aspect;
 let distance=0;
 for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z]){
  const corner=new THREE.Vector3(x,y,z).sub(center),depth=corner.dot(direction);
  distance=Math.max(distance,Math.abs(corner.dot(right))/horizontal+depth,Math.abs(corner.dot(up))/vertical+depth);
 }
 camera.position.copy(center).addScaledVector(direction,Math.max(distance*1.16,scale));
 camera.near=scale/1000;camera.far=scale*100;camera.updateProjectionMatrix();
 controls.minDistance=scale*.35;controls.maxDistance=scale*12;controls.target.copy(center);controls.update();
 grid.position.y=box.min.y-scale*.12;
}
async function loadSelectedModel(){const key=state.profile+'-'+packaging[state.packaging].model;if(key===modelKey&&activeModel){applyMaterials();resizeModel();renderTour();return;}modelKey=key;$('#part-info').textContent='';const seq=++requestSeq;$('#viewstatus').textContent='结构载入中…';try{const gltf=await loader.loadAsync('/models/'+key+'.glb');if(seq!==requestSeq)return;let assembly;gltf.scene.traverse(o=>{if(o.userData.schema==='battery-lab-1')assembly=o;});if(!assembly)throw new Error('结构数据缺失');if(activeModel){scene.remove(activeModel);activeModel.traverse(o=>{if(o.isMesh){o.geometry.dispose();(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose());}});}activeModel=gltf.scene;modelAssembly=assembly;scene.add(activeModel);modelParts=[];activeModel.traverse(o=>{if(o.isMesh){o.userData.basePosition=o.position.clone();o.material=o.material.clone();o.material.side=THREE.DoubleSide;o.userData.originalOpacity=o.material.opacity;o.userData.originalColor=o.material.color.clone();o.userData.originalMetalness=o.material.metalness;modelParts.push(o);}});activeModel.rotation.x=0;isolatedRole=null;focusedRole=null;selectedPart=null;$('#assembly-progress').value=100;applyMaterials();resizeModel();$('#model-badge').textContent='结构示意 · '+modelParts.length+' 部件';$('#viewstatus').textContent='结构示意 · 可点选与导览';renderTour();}catch(e){if(seq===requestSeq){$('#viewstatus').textContent='结构未载入：'+e.message;$('#model-badge').textContent='结构待载入';}modelKey='';}}
function resizeModel(){if(!activeModel||validateConfig(state).errors.length)return;const a=modelAssembly,c=JSON.parse(a.userData.config_json),round=['cylindrical','alkaline','carbonzinc','rtg'].includes(c.model),coin=['coin','aircoin'].includes(c.model);a.scale.set(.001*state.width/c.width,.001*(round?state.height/c.height:state.depth/c.depth),.001*(round||coin?state.width/c.width:state.height/c.height));applyDisplay();fitModel();}
function applyMaterials(){const pv=getProfile(state.profile).family==='solar',selected=state.family==='nuclear'?{converter:state.cathode,heat:state.anode}:{cathode:state.cathode,anode:state.anode,electrolyte:state.electrolyte||(pv?state.anode:'')};for(const o of modelParts){const d=o.userData;if(d.originalColor)o.material.color.copy(d.originalColor);o.material.metalness=d.originalMetalness??0;if(pv){if(d.role==='cathode')o.material.color.setHex(0x0a151d);if(['electrolyte','seal'].includes(d.role)){o.material.transparent=true;o.material.opacity=.13;o.material.depthWrite=false;}}if(selected[d.role]){d.selected_material_id=selected[d.role];const id=selected[d.role];if(['anode','converter','heat'].includes(d.role)&&/^(lithium|liin|zinc|zn_|nickelmetal|ni_cr|ni_al|pb$|pb_pasted|si$|sic$|diamond$|beta_gan)/.test(id)){const metal=/^(lithium|liin|zinc|zn_|nickelmetal|ni_cr|ni_al|pb)/.test(id);o.material.color.setHex(metal?0x999d9a:0x555a58);o.material.metalness=metal?.72:.15;}}d.materialActive=!(o.name.includes('p3DSE_vertical')&&state.electrolyte!=='p3dse')&&!(d.role==='sei'&&state.sei==='none');}const active=new Set(modelParts.filter(o=>o.userData.materialActive!==false).map(o=>o.userData.role));if(typeof focusedRole==='string'&&!active.has(focusedRole)){focusedRole=null;tourIndex=-1;}if(Array.isArray(focusedRole))focusedRole=focusedRole.filter(r=>active.has(r));applyDisplay();}
function syncViewModes(){const expanded=+$('#explode').value>0;$('.structure-mode-switch [data-view="whole"]').setAttribute('aria-pressed',String(!expanded&&!cutaway));$('.structure-mode-switch [data-view="exploded"]').setAttribute('aria-pressed',String(expanded));}
function applyDisplay(){syncViewModes();if(!activeModel)return;const spacing=state.family==='fuel'?24:state.family==='solar'?18:10;const amount=+$('#explode').value/100,progress=+$('#assembly-progress').value/100,groups=[...new Set(modelParts.map(o=>Number(o.userData.explode_group)||0))].sort((a,b)=>a-b),limit=Math.ceil(groups.length*progress),pv=state.family==='solar';for(const o of modelParts){const d=o.userData,g=Number(d.explode_group)||0;o.position.copy(d.basePosition);o.position.add(new THREE.Vector3((d.explode_vector||[0,0,1])[0],(d.explode_vector||[0,0,1])[2],-(d.explode_vector||[0,0,1])[1]).multiplyScalar(g*amount*spacing));o.visible=d.materialActive!==false&&!(cutaway&&d.role==='shell')&&(!isolatedRole||d.role===isolatedRole)&&groups.indexOf(g)<limit;const base=pv&&['electrolyte','seal'].includes(d.role)?.13:(d.originalOpacity??1),dim=focusedRole&&(Array.isArray(focusedRole)?focusedRole.length&&!focusedRole.includes(d.role):d.role!==focusedRole);o.material.opacity=dim?Math.min(base,.14):base;o.material.transparent=o.material.opacity<1;o.material.depthWrite=o.material.opacity>=1;o.material.emissive?.setHex((Array.isArray(focusedRole)?focusedRole.includes(d.role):focusedRole===d.role)?0x352712:0);}}
function selectPart(o){selectedPart=o;const d=o.userData,m=materials[d.selected_material_id||d.material_id],info=roleInfo(getProfile(state.profile),d.role);o.material.emissive?.setHex(0x493411);$('#part-info').innerHTML=m?'<span>当前选材：'+escape(m.label)+'</span>'+sourceLink(m.source):'<strong>'+escape(d.part_label||info.title)+'</strong><p>'+escape(info.text)+'</p>'+sourceLink(packaging[state.packaging].source);}
function showParts(){const p=getProfile(state.profile),groups=[...new Set(modelParts.map(o=>o.userData.role))];showModal('部件目录','<div class="partbuttons"><button data-role="all">恢复完整结构</button>'+groups.map(r=>'<button data-role="'+r+'">'+escape(roleInfo(p,r).title)+' · '+modelParts.filter(o=>o.userData.role===r).length+'</button>').join('')+'</div>');document.querySelectorAll('[data-role]').forEach(b=>b.onclick=()=>{if(b.dataset.role==='all')restoreView(false);else focusRole(b.dataset.role);closeModal();});}
$('#explode').oninput=applyDisplay;$('#assembly-progress').oninput=applyDisplay;
let modelDown=null,modelDrag=false;canvas.addEventListener('pointerdown',e=>{modelDown={x:e.clientX,y:e.clientY};modelDrag=false;});canvas.addEventListener('pointermove',e=>{if(modelDown&&Math.hypot(e.clientX-modelDown.x,e.clientY-modelDown.y)>5)modelDrag=true;});canvas.addEventListener('pointerup',()=>{modelDown=null;});canvas.addEventListener('pointercancel',()=>{modelDown=null;modelDrag=true;});
const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();canvas.addEventListener('click',e=>{const r=canvas.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(modelParts.filter(o=>o.visible),false)[0];if(hit&&!modelDrag)selectPart(hit.object);});
new ResizeObserver(()=>{if(!renderer)return;const w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}).observe(canvas);function updateModelLoop(){if(renderer)renderer.setAnimationLoop(!root.hidden&&!document.hidden&&!pathController?()=>{controls.update();renderer.render(scene,camera);}:null);}updateModelLoop();document.addEventListener('visibilitychange',updateModelLoop);document.addEventListener('battery-lab-route',event=>{updateModelLoop();if(event.detail.active)refreshReveals(state.step+':'+(state.step===0?state.family:state.step===3?measurementMode:''),true);else stopPath();});
stackedLayout.addEventListener('change',()=>renderMobileContext());
mobileLayout.addEventListener('change',()=>{const focusedId=document.activeElement.id;render();if(focusedId)document.getElementById(focusedId)?.focus({preventScroll:true});});
function syncLocalizedImages(){
 const locale=getLocale();
 for(const img of document.querySelectorAll('img[data-asset-file]')){
  const original=photoAssets.find(a=>a.file===img.dataset.assetFile);if(!original)continue;
  const a=localizedImage(original,locale),size=img.classList.contains('original-size')?'local':img.dataset.imageSize;
  img.src=size==='thumb'?(a.thumbUrl||a.localUrl):size==='preview'?(a.previewUrl||a.localUrl):a.localUrl;
  if(img.hasAttribute('data-full-src')){img.dataset.fullSrc=a.localUrl;const link=document.querySelector('.photo-tools>a');if(link)link.href=a.localUrl;}
 }
}
document.addEventListener('languagechange',syncLocalizedImages);
async function loadPhotoAssets(){
 photoStatus='loading';
 try{const response=await fetch('/assets/materials/manifest.json');if(!response.ok)throw new Error('Image manifest unavailable');const d=await response.json();photoAssets=Array.isArray(d)?d:d.assets??[];if(!photoAssets.length)throw new Error('Empty image manifest');photoStatus='ready';const translations={'接触层如何引出电荷':'How contacts collect charge','图中突出当前接触与传输层。各层承担电荷选择与引出，层厚与颜色为示意。':'The image highlights the selected contact and transport layers. They select and collect charge; thicknesses and colors are schematic.','材料示意':'Material schematic','结构与配方依据':'Structure and formulation sources','示意图依据文献绘制；颜色、形状与层厚经过简化，不代表实测显微图或性能。':'This source-based schematic simplifies colors, shapes and layer thicknesses; it is not microscopy or a performance result.','生成插图':'Generated illustration','原料或文献参考':'Reference image','材料形貌':'Material morphology','结构资料图':'Technical diagram','实物照片':'Photograph','图片':'Image','图片载入中…':'Loading image…','图片未载入':'Image unavailable','查看图片与出处':'View image and source','生成插图只表达形态或原理，不是实拍或实验结果。':'Generated imagery explains form or principles; it is not documentary photography or experimental evidence.','此图展示配方中的原料或参考结构，不是这项完整材料或器件的实拍。':'This image shows a constituent or reference structure, rather than the complete selected material or device.','图片视图':'Image view','适应窗口':'Fit to window','查看原尺寸':'Original size','打开材料图':'Open material image','原文与图源':'Paper and image source','补充材料':'Supplementary materials','授权依据':'License evidence','图片查看区':'Image viewer','提示词与用途说明':'Prompts and intended use','图片来源与许可':'Image sources and licenses','完整提示词与用途':'Full prompts and intended use','形态与原理插图不是实拍材料或实验记录。':'Form and principle illustrations are not material photographs or experimental records.','图片加载失败。':'Images could not be loaded.','重新载入图片':'Reload images'};for(const a of photoAssets){if(a.shortLabelEn)translations[a.shortLabel]=a.shortLabelEn;if(a.descriptionEn)translations[a.description]=a.descriptionEn;if(a.modificationsEn)translations[a.modifications]=a.modificationsEn;}registerTranslations(translations);}
 catch{photoStatus='error';}
 const focus=rememberFocus(),selection=document.activeElement?.selectionStart;render();
 if(photoStatus==='error'){const notice=document.createElement('p');notice.className='image-load-error';notice.innerHTML='图片加载失败。 <button id="reload-images">重新载入图片</button>';$('#config').append(notice);}
 const target=restoreFocus(focus);if(target?.type==='search'&&Number.isInteger(selection))target.setSelectionRange(selection,selection);
}
document.addEventListener('error',event=>{const img=event.target;if(img?.tagName!=='IMG'||img.dataset.imageFallback)return;const src=img.getAttribute('src'),a=photoAssets.find(a=>a.thumbUrl===src||a.previewUrl===src);if(a){img.dataset.imageFallback='true';img.src=a.localUrl;}},true);
render();loadSelectedModel();loadPhotoAssets();

createSurfaceReflections(document.body);
const modelContext=document.modelContext??navigator.modelContext;
if(modelContext?.registerTool){modelContext.registerTool({name:'read_battery_configuration',description:'读取当前网站电池材料、结构、实测输入和证据。',annotations:{readOnlyHint:true,untrustedContentHint:true},inputSchema:{type:'object',properties:{},additionalProperties:false},execute:async()=>({content:[{type:'text',text:JSON.stringify({config:state,validation:validateConfig(state),calculation:computePerformance(state)})}]})});modelContext.registerTool({name:'select_battery_profile',description:'选择网站支持的电池体系；切换时保留当前页面中各体系的实测草稿。',annotations:{readOnlyHint:false,untrustedContentHint:false},inputSchema:{type:'object',properties:{profile:{type:'string',enum:profiles.map(p=>p.id)}},required:['profile']},execute:async({profile})=>{switchProfile(profile);return{content:[{type:'text',text:'已选择 '+getProfile(profile).label}]};}});modelContext.registerTool({name:'evaluate_cycle_data',description:'以用户两列实测数据评估容量保持率和实测范围内阈值交点，不外推。',annotations:{readOnlyHint:false,untrustedContentHint:true},inputSchema:{type:'object',properties:{csv:{type:'string'},threshold:{type:'number'}},required:['csv']},execute:async({csv,threshold=80})=>{if(getProfile(state.profile).family!=='secondary')throw new Error('仅二次电池适用');const ps=parseCurve(csv),a=analyzeCurve(ps,threshold);curves=ps;curveText=csv;curveThreshold=threshold;curveDraftThreshold=threshold;curveDirty=false;importSeq++;curveDemo=false;saveMeasurements();renderCurve();renderMetrics();return{content:[{type:'text',text:JSON.stringify(a)}]};}});}
window.batteryLab={getState:()=>({...state}),compute:computePerformance,validate:validateConfig,parseCurve,analyzeCurve};