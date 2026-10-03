import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {profiles,materials,packaging,initial,configurationForMaterial} from '../dist/catalog.js';
import {materialImage,contextImage,localizedImage} from '../dist/imagery.js';
const base=path.resolve(fileURLToPath(new URL('../dist/',import.meta.url)));
export async function auditImages(){
 const assets=JSON.parse(await readFile(path.join(base,'assets/materials/manifest.json'),'utf8'));
 const prompts=await readFile(path.join(base,'assets/illustrations.md'),'utf8');
 const used=new Set(profiles.flatMap(p=>[...p.cathodes,...p.anodes,...p.electrolytes]));
 const files=new Set(),identities=new Map();
 for(const a of assets){
  assert(!files.has(a.file),'Repeated asset '+a.file);files.add(a.file);
  assert(['photo','research-figure','diagram','generated','schematic'].includes(a.kind),a.file);
  assert(a.width>0&&a.height>0,'No dimensions '+a.file);
  assert(a.shortLabel&&a.description&&a.shortLabelEn&&a.descriptionEn,'Bilingual caption missing '+a.file);
  for(const field of ['materialIds','referenceMaterialIds','formMaterialIds','schematicMaterialIds'])for(const id of a[field]??[]){
   assert(materials[id],'Unknown material '+id);
   assert(!identities.has(id),'Conflicting image identity '+id);identities.set(id,a.file);
   if(field==='schematicMaterialIds')assert.equal(a.kind,'schematic');
   else if(field==='formMaterialIds')assert.equal(a.kind,'generated');
   else assert.notEqual(a.kind,'generated','Generated image claimed as source evidence');
  }
  if(a.kind==='generated'){
   assert.equal(a.materialIds.length,0);assert.equal(a.referenceMaterialIds?.length??0,0);
   assert(a.promptKey&&a.generator&&prompts.split(/\r?\n/).some(line=>line==='## '+a.promptKey||line.startsWith('## '+a.promptKey+' ')),'Missing generated provenance '+a.file);
   assert.equal(a.pageUrl,'/assets/illustrations.md');assert(!a.license&&!a.author,'Generated image assigned source-photo license');
  }else if(a.kind==='schematic'){
   assert.equal(a.materialIds.length,0);assert.equal(a.referenceMaterialIds?.length??0,0);
   assert(a.diagramKey&&a.schematicMaterialIds?.length,'Unscoped schematic '+a.file);
   assert(a.basedOn?.length&&a.basedOn.every(s=>s.title&&new URL(s.url).protocol==='https:'),'Schematic source missing '+a.file);
   assert(a.localUrlEn&&a.pageUrl.startsWith('/assets/materials/visual-notes.md'),'Localized schematic provenance missing '+a.file);
  }else{
   assert(a.author&&a.license&&a.licenseUrl&&a.pageUrl&&a.imageUrl,'Incomplete attribution '+a.file);
   for(const key of ['licenseUrl','pageUrl','imageUrl'])assert.equal(new URL(a[key]).protocol,'https:');
  }
  if(a.kind==='research-figure'){
   assert.equal(a.contentScope,'material-appearance','Research image must show material appearance '+a.file);
   assert.equal(new URL(a.licenseEvidenceUrl).protocol,'https:','Missing license evidence '+a.file);
   assert(a.verifiedOn&&a.modifications&&a.modificationsEn,'Missing review or modification credit '+a.file);
   assert(/^CC BY(?:-SA)? \d/.test(a.license),'Research image cannot be republished or cropped under this license '+a.file);
  }
  if(a.crop){
   const {sourceWidth,sourceHeight,box,panel,method,scaleBarPreserved}=a.crop;
   assert(sourceWidth>0&&sourceHeight>0&&Array.isArray(box)&&box.length===4&&box.every(Number.isInteger),'Invalid crop source '+a.file);
   const [left,top,right,bottom]=box;
   assert(left>=0&&top>=0&&right>left&&bottom>top&&right<=sourceWidth&&bottom<=sourceHeight,'Crop outside source '+a.file);
   assert.equal(a.width,right-left,'Crop width mismatch '+a.file);assert.equal(a.height,bottom-top,'Crop height mismatch '+a.file);
   assert(panel&&['crop','pdf-render-crop'].includes(method)&&scaleBarPreserved,'Incomplete crop provenance '+a.file);
  }
  for(const key of ['localUrl','thumbUrl','previewUrl',...(a.kind==='schematic'?['localUrlEn','thumbUrlEn','previewUrlEn']:[])]){
   assert(a[key]?.startsWith('/assets/'),'Missing local image '+a.file+': '+key);
   const target=path.resolve(base,'.'+a[key]);assert(target.startsWith(base+path.sep),'Image path escaped site');
   const b=await readFile(target);assert(b.length>100,'Empty image '+a.file);
   if(key==='localUrl'&&a.sha256)assert.equal(createHash('sha256').update(b).digest('hex'),a.sha256,'Image checksum mismatch '+a.file);
   const ext=path.extname(target).toLowerCase();
   if(ext==='.png')assert(b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),'Invalid PNG '+target);
   else if(ext==='.jpg'||ext==='.jpeg')assert(b[0]===255&&b[1]===216&&b[2]===255,'Invalid JPEG '+target);
   else if(ext==='.webp')assert(b.subarray(0,4).toString()==='RIFF'&&b.subarray(8,12).toString()==='WEBP','Invalid WebP '+target);
   else if(ext==='.svg'){assert.equal(a.kind,'schematic');const svg=b.toString('utf8');assert(svg.startsWith('<svg ')&&svg.includes('<title>')&&svg.includes('<desc>'),'Incomplete schematic '+target);assert(!/<script|<foreignObject|<image|onload=|href=/i.test(svg),'Unsafe schematic '+target);}
   else assert.fail('Unsupported image extension '+target);
  }
 }
 let specimens=0,references=0,forms=0,schematics=0,contexts=0;
 for(const id of used){const a=materialImage(id,assets);assert(a,'Unillustrated material '+id);if(a.relation==='specimen')specimens++;else if(a.relation==='reference')references++;else if(a.relation==='schematic'){schematics++;assert.equal(localizedImage(a,'en').localUrl,a.localUrlEn);assert.equal(localizedImage(a,'zh').localUrl,a.localUrl);}else forms++;}
 for(const p of profiles)for(const pack of p.packaging){
  const config={...initial,profile:p.id,family:p.family,cathode:p.cathodes[0],anode:p.anodes[0],electrolyte:p.electrolytes[0]??'',packaging:pack};
  for(const purpose of ['material','structure','measurement','safety']){
   const before={...config},a=contextImage(config,purpose,assets);assert.deepEqual(config,before,'Illustration changed recipe');assert(a?.localUrl,p.id+'/'+pack+'/'+purpose);await stat(path.resolve(base,'.'+a.localUrl));contexts++;
   if(purpose!=='material'){
    const model=packaging[pack].model;
    if(['alkaline','carbonzinc'].includes(model))assert.equal(a.file,'cylindrical-case.png');
    if(model==='aircoin')assert.equal(a.file,'coin-cell.jpg');
    if(a.file==='cylindrical-cell.jpg')assert(['liion','liion_hv'].includes(p.id),'Li-ion winding used for another chemistry');
    if(p.id==='sofc'&&purpose!=='safety')assert.equal(a.file,'ceramic-fuel-cell.png');
    if(p.id==='mcfc'&&purpose!=='safety')assert.equal(a.file,'carbonate-matrix.png');
   }
  }
  for(const [field,list] of [['cathode',p.cathodes],['anode',p.anodes],['electrolyte',p.electrolytes]])for(const id of list){const next=configurationForMaterial(config,field,id);assert(materialImage(next[field],assets),'Pairing loses imagery '+id);}
 }
 for(const [left,right] of [['lipf6_ecemc_volume','lipf6_ecemc_mass'],['na_rahc','na_bulk_ncm'],['gel_pe_control','gel_ppe_control'],['lmo_crystalline_film','lmo_amorphous_film'],['si_topcon_contacts','si_tunnel_oxide'],['nabob_tep','nabob_tep_pes'],['lhce_dmc_tte','lhce_tms_tte'],['mcfc_lik','mcfc_lina'],['alloy_ab5','alloy_ab2'],['zinc_alloy_can','zinc_powder_gel'],['fes2','fes2_al_foil'],['mno2','emd_graphite_ring'],['niysz','ni_gdc'],['ptblack_ptfe_pafc','ptc_ptfe_pafc'],['ptc_ptfe_pafc','ptc_pfsa_layer'],['acidagm','acidgel'],['znna_sulfate_11','znna_sulfate_21']]){const a=materialImage(left,assets),b=materialImage(right,assets);assert.notEqual(a.file,b.file,'Distinct materials share a generic image: '+left+'/'+right);}
 for(const id of ['si','sic','diamond','beta_gan'])assert.equal(materialImage(id,assets).relation,'reference','Raw crystal misidentified as fabricated junction');
 const report={passed:true,selectableMaterials:used.size,specimens,references,generatedForms:forms,schematics,missing:used.size-specimens-references-forms-schematics,sourceAssets:assets.filter(a=>!['generated','schematic'].includes(a.kind)).length,generatedAssets:assets.filter(a=>a.kind==='generated').length,contextMappings:contexts,assetFiles:new Set(assets.flatMap(a=>[a.localUrl,a.thumbUrl,a.previewUrl,a.localUrlEn].filter(Boolean))).size};
 console.log('Image coverage: '+JSON.stringify(report));return report;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))await auditImages();
