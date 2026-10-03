import {getProfile,packaging} from './catalog.js';
// A specimen, a constituent/structure reference and a generated form are distinct.
export function materialImage(id,assets){
 const exact=assets.find(a=>a.materialIds?.includes(id));
 if(exact)return {...exact,relation:'specimen'};
 const reference=assets.find(a=>a.referenceMaterialIds?.includes(id));
 if(reference)return {...reference,relation:'reference',reference:true};
 const schematic=assets.find(a=>a.kind==='schematic'&&a.schematicMaterialIds?.includes(id));
 if(schematic)return {...schematic,relation:'schematic'};
 const form=assets.find(a=>a.kind==='generated'&&a.formMaterialIds?.includes(id));
 return form?{...form,relation:'form'}:null;
}
export function localizedImage(a,locale){
 if(!a||locale!=='en'||!a.localUrlEn)return a;
 return {...a,localUrl:a.localUrlEn,thumbUrl:a.thumbUrlEn??a.localUrlEn,previewUrl:a.previewUrlEn??a.localUrlEn};
}
export function imageType(a){
 if(a?.kind==='schematic')return '材料示意';
 if(a?.kind==='generated')return '生成插图';
 if(a?.reference)return '原料或文献参考';
 return a?.kind==='diagram'?'结构资料图':a?.kind==='research-figure'?'材料形貌':'实物照片';
}
export function contextImage(config,purpose,assets){
 if(!['material','structure','measurement','safety'].includes(purpose))throw new RangeError('Unknown image purpose');
 const p=getProfile(config.profile),model=packaging[config.packaging].model;
 const file=name=>assets.find(a=>a.file===name)??null;
 const reference=name=>{const a=file(name);return a?{...a,relation:'reference',reference:true}:null;};
 if(purpose==='material')return materialImage(config.cathode,assets);
 if(p.family==='solar'){
  if(purpose==='measurement')return reference('solar-reference-cell.jpg');
  return materialImage(config[purpose==='safety'?'electrolyte':'anode'],assets)??materialImage(config.cathode,assets);
 }
 if(p.family==='nuclear')return config.profile==='rtg'?(purpose==='measurement'?file('thermoelectric-module.png'):file('gphs.jpg')):file('beta-source-package.png');
 if(p.family==='fuel'){
  if(purpose==='safety')return materialImage(config.electrolyte,assets);
  if(config.profile==='sofc')return file('ceramic-fuel-cell.png');
  if(config.profile==='mcfc')return file('carbonate-matrix.png');
  return file('fuel-cell-assembly.png');
 }
 if(purpose==='measurement'&&model==='pouch')return file('performance-study.png');
 if(purpose==='safety'&&model==='pouch')return file('safety-study.png');
 if(model==='pouch')return file('assembly-study.png');
 if(['coin','aircoin'].includes(model))return reference('coin-cell.jpg');
 if(model==='cylindrical')return ['liion','liion_hv'].includes(p.id)?reference('cylindrical-cell.jpg'):file('cylindrical-case.png');
 if(['alkaline','carbonzinc'].includes(model))return file('cylindrical-case.png');
 if(model==='lead')return reference('lead-battery-cutaway.jpg');
 if(model==='thinbattery')return file('thin-film-cell.png');
 if(model==='prismatic')return file('prismatic-cell.png');
 return null;
}
