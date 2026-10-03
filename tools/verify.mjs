import {auditImages} from './image-audit.mjs';
import {makeCellField,stepCell} from '../dist/entry-physics.js';
import {pathwaySpec} from '../dist/pathway-view.js';
import {translate,registerTranslations} from '../dist/i18n.js';
import assert from 'node:assert/strict';
import {readFile,readdir,stat} from 'node:fs/promises';
import {profiles,materials,packaging,sources,initial,validateConfig,computePerformance,observations,materialPairings,configurationForMaterial} from '../dist/catalog.js';
import {parseCurve,analyzeCurve,safetyRows,chargePath} from '../dist/analysis.js';
import {sampleReadout,clampSampleArea} from '../dist/density-lab.js';
for(const file of ['three.module.js','three.core.js','addons/controls/OrbitControls.js','addons/loaders/GLTFLoader.js','addons/utils/BufferGeometryUtils.js'])assert((await stat(new URL('../dist/vendor/'+file,import.meta.url))).size>1000);
const sourceIds=new Set(sources.map(s=>s.id));assert.equal(sourceIds.size,sources.length);
for(const m of Object.values(materials))assert(sourceIds.has(m.source),m.id);
for(const o of observations)assert(sourceIds.has(o.source));
let count=0,parts=0;
const used=new Set();
for(const p of profiles){
 for(const name of ['cathodes','anodes','electrolytes'])for(const id of p[name]){assert(materials[id],id);used.add(id);}
 assert(safetyRows({profile:p.id}).length);assert(chargePath({profile:p.id}).length);
 for(const pack of p.packaging){
  const file='../dist/models/'+p.id+'-'+packaging[pack].model+'.glb',b=await readFile(new URL(file,import.meta.url));
  assert.equal(b.subarray(0,4).toString(),'glTF');assert.equal(b.readUInt32LE(8),b.length);
  const j=JSON.parse(b.subarray(20,20+b.readUInt32LE(12)).toString()),a=j.nodes.find(n=>n.extras?.schema==='battery-lab-1');
  assert(a,'Missing assembly '+file);assert(j.images?.every(i=>Number.isInteger(i.bufferView)),'Unpacked surface image '+file);assert(j.materials?.some(m=>m.pbrMetallicRoughness?.metallicRoughnessTexture),'Missing exported PBR finish '+file);assert(j.meshes.every(m=>m.primitives.every(p=>p.attributes.TEXCOORD_0!==undefined)),'Missing UV coordinates '+file);assert(!j.nodes.some(n=>n.name==='Cube'),'Original user scene exported');
  const c=JSON.parse(a.extras.config_json);assert.equal(c.profile,p.id);assert.equal(c.model,packaging[pack].model);
  const config={...initial,...c,packaging:pack,family:p.family};assert.deepEqual(validateConfig(config).errors,[],p.id);
  const meshes=j.nodes.filter(n=>n.mesh!==undefined);assert(meshes.length>4);for(const n of meshes){assert(n.extras?.role);assert(n.extras.part_label);assert(!/[\u3400-\u9fff]/.test(translate(n.extras.part_label,'en')),'Untranslated model part '+n.extras.part_label);}
  if(p.id==='sofc')assert(!meshes.some(n=>n.name.includes('GDL')||n.name.includes('catalyst')));
  if(p.id==='solid')assert(meshes.some(n=>n.extras.role==='sei'));
  parts+=meshes.length;count++;
 }
}
// New source-bound materials must be reachable without making invalid mixed recipes.
for(const p of profiles){const base={...initial,profile:p.id,family:p.family,cathode:p.cathodes[0],anode:p.anodes[0],electrolyte:p.electrolytes[0]??'',packaging:p.packaging[0]};for(const [key,list] of [['cathode','cathodes'],['anode','anodes'],['electrolyte','electrolytes']])for(const id of p[list]){const next=configurationForMaterial(base,key,id);assert(next,p.id+': '+id);assert.equal(next[key],id);assert.deepEqual(validateConfig(next).errors,[]);}}
assert(validateConfig({...initial,cathode:'nmc111',anode:'graphite',electrolyte:'carbonate'}).errors.length);
const znTemplate={...initial,profile:'aqueouszn',cathode:'nvo_hydrate',anode:'zinc',electrolyte:'znna_sulfate_11'};
assert.deepEqual(validateConfig(znTemplate).errors,[]);
assert(validateConfig({...znTemplate,electrolyte:'znna_sulfate_21'}).errors.length);
const restrictedZn=configurationForMaterial(znTemplate,'cathode','v2o5_aqzn');assert.equal(restrictedZn.packaging,'coin');assert.deepEqual(validateConfig(restrictedZn).errors,[]);
assert(validateConfig({...restrictedZn,packaging:'pouch'}).errors.length);
const withInterface={...initial,profile:'solid',anode:'lithium',electrolyte:'p3dse',sei:'lif'};
assert.equal(configurationForMaterial(withInterface,'anode','lithium').sei,'lif');
assert.equal(configurationForMaterial(withInterface,'cathode','nmc811').sei,'lif');
for(const r of materialPairings)assert(sourceIds.has(r.source));
const originalSample=sampleReadout(100,1000),halfSample=sampleReadout(50,1000);
assert.equal(originalSample.side,10);assert.equal(originalSample.density,10);
assert.equal(halfSample.density,originalSample.density*2);assert.equal(halfSample.areaRatio,2);
assert.equal(halfSample.referenceDensity,originalSample.density);
assert.equal(sampleReadout(50,0).density,0);
assert.equal(clampSampleArea(-50),10);assert.equal(clampSampleArea(500),200);
assert.equal(clampSampleArea(48,50),50);assert.equal(clampSampleArea(102),100);
assert.throws(()=>sampleReadout(0,1000));assert.throws(()=>sampleReadout(50,-1));
assert.equal(computePerformance({...initial,area:2,current:20,capacity:1000,voltage:3.6,mass:20}).currentDensity,10);
assert.equal(computePerformance({...initial,area:2,current:20,capacity:1000,voltage:3.6,mass:20}).specificEnergy,180);
assert.equal(computePerformance(initial).energy,null);
assert.throws(()=>computePerformance({...initial,area:0}));
assert.throws(()=>computePerformance({...initial,temperature:-274}));
assert.throws(()=>computePerformance({...initial,profile:'solar_si',area:1,irradiance:1000,current:10000,voltage:2}));
assert(validateConfig({...initial,profile:'solid_halide',anode:'lithium'}).errors.length);
assert(validateConfig({...initial,cathode:'lmfp',anode:'silicon'}).errors.length);
const curve=parseCurve('cycle,capacity_mAh\n0,100\n100,90\n200,75'),result=analyzeCurve(curve,80);
assert(Math.abs(result.crossing-166.6666666667)<1e-6);assert.equal(result.last.retention,75);
assert.equal(analyzeCurve(parseCurve('0,100\n600,89'),80).crossing,null);
assert.throws(()=>parseCurve('0,100\n0,90'));assert.throws(()=>parseCurve('0,100\n1,-5'));assert.throws(()=>parseCurve('0,100\n2,90,5'));
assert.throws(()=>analyzeCurve(curve,100));
assert(chargePath({profile:'sodium_pba'}).some(x=>x.includes('Na⁺')));
assert(chargePath({profile:'afc'}).some(x=>x.includes('OH⁻')));
assert(chargePath({profile:'mcfc'}).some(x=>x.includes('CO₃²⁻')));
const photos=JSON.parse(await readFile(new URL('../dist/assets/materials/manifest.json',import.meta.url),'utf8'));
const imageReport=await auditImages();
const photoTranslations=Object.fromEntries(photos.flatMap(a=>[[a.shortLabel,a.shortLabelEn],[a.description,a.descriptionEn]]).filter(([key,value])=>key&&value));registerTranslations(photoTranslations);
assert.equal(translate(materials.lfp.label,'en'),'Lithium iron phosphate · LFP','Adding photo translations erased catalog translations');
for(const a of photos)if(a.descriptionEn)assert.equal(translate(a.description,'en'),a.descriptionEn);
// Locale changes affect authored labels only; scientific source data stays canonical.
for(const item of [...Object.values(materials),...profiles,...Object.values(packaging),...sources])for(const key of ['label','stage','note','risk','title','detail','locator','kind']){
 const value=item[key];if(typeof value==='string'&&/[\u3400-\u9fff]/.test(value)){assert(!/[\u3400-\u9fff]/.test(translate(value,'en')),key+': '+value);assert.equal(translate(value,'zh'),value);}
}
assert.equal(translate('当前选材：纳米多孔锌 / 镀锡铜泡沫','en'),'Selected material: Nanoporous zinc / tin-coated copper foam');
assert.equal(translate('1 种候选','en'),'1 candidate');assert.equal(translate('2 种候选','en'),'2 candidates');
assert.equal(translate('第 3 行需要两列：cycle,capacity_mAh','en'),'Row 3 needs two columns: cycle,capacity_mAh');
assert.equal(translate('NaV₃O₈·1.5H₂O','en'),'NaV₃O₈·1.5H₂O');
const html=await readFile(new URL('../dist/app.js',import.meta.url),'utf8');assert(!html.includes('Blender'));assert(!html.includes('/api/build'));
console.log(JSON.stringify({passed:true,families:5,profiles:profiles.length,materialEntries:Object.keys(materials).length,selectableMaterialEntries:used.size,models:count,modelParts:parts,sourceImages:imageReport.sourceAssets,generatedImages:imageReport.generatedAssets,illustratedMaterials:imageReport.selectableMaterials,sources:sources.length,observations:observations.length,checks:'source-bound material reachability, pair incompatibility, restricted packaging, SEI preservation, sample-area interaction bounds and inverse density, units, curve bounds, duplicate input, energy conservation, catalog, every GLB, source IDs, photo attribution, interface absence, bilingual catalog and dynamic validation'},null,2));
// Cursor forces stay local, and displaced cells return instead of escaping the scene.
const field=makeCellField(1050),sameField=makeCellField(1050);assert.deepEqual(field,sameField);assert.equal(field.length,1050);
const cell={...field[0],x:0,y:0,z:0,phase:0};const interaction={active:true,x:0,y:0,cameraX:0,cameraY:0,groupY:0,radius:3.3};
for(let i=0;i<60;i++)stepCell(cell,interaction,1/60,0,false);assert(cell.ox>.8);assert(Number.isFinite(cell.ox));
const far={...field[1],x:20,y:20,z:0};stepCell(far,interaction,1/60,0,false);assert.equal(far.ox,0);assert.equal(far.oy,0);
const frozen={...cell};stepCell(cell,interaction,0,0,false);assert.equal(cell.ox,frozen.ox);assert.equal(cell.oy,frozen.oy);
for(let i=0;i<600;i++)stepCell(cell,{...interaction,active:false},1/60,0,false);assert(Math.hypot(cell.ox,cell.oy,cell.oz)<.001);
for(let i=0;i<60;i++)stepCell(cell,interaction,10,0,false);assert(Number.isFinite(cell.ox));assert(Math.abs(cell.ox)<20);
for(const file of ['entry.js','entry.css','battery-field.js','entry-physics.js'])assert((await stat(new URL('../dist/'+file,import.meta.url))).size>500);
const homeHtml=await readFile(new URL('../dist/index.html',import.meta.url),'utf8');assert(homeHtml.includes('id="entry-screen"'));assert(homeHtml.includes('id="app" hidden inert'));assert(homeHtml.includes('src="/entry.js"'));assert(!homeHtml.includes('src="/app.js"'));
console.log('Entry checks passed: deterministic cell layout, local dispersal, stable spring return, frozen state, long-frame bounds, lazy workbench entry.');

// A principle lesson must follow the selected chemistry, rather than borrowing PEM or Li-ion paths.
for(const profile of profiles){
 const config={...initial,profile:profile.id,family:profile.family,anode:profile.anodes[0],cathode:profile.cathodes[0],electrolyte:profile.electrolytes[0]??''};
 const unchanged={...config},spec=pathwaySpec(config);
 assert.deepEqual(config,unchanged,'Lesson changed selected materials');
 assert.equal(spec.profile,profile.id);assert.equal(spec.family,profile.family);assert.equal(spec.steps.length,4);
 for(const part of spec.steps)for(const locale of ['zh','en']){assert(part.title[locale]?.length);assert(part.body[locale]?.length);}
 assert(spec.sourceIds.length);for(const id of spec.sourceIds)assert(sourceIds.has(id),id);
}
for(const [profile,carrier,direction] of [['pem','H⁺','left-to-right'],['pafc','H⁺','left-to-right'],['afc','OH⁻','right-to-left'],['sofc','O²⁻','right-to-left'],['mcfc','CO₃²⁻','right-to-left']]){
 const spec=pathwaySpec({profile});assert.equal(spec.kind,'fuel');assert.equal(spec.carrier,carrier);assert.equal(spec.direction,direction);assert.equal(spec.electronDirection,'left-to-right');
}
for(const profile of ['solar_si','solar_film','solar_perovskite','solar_organic','solar_iiiv']){const spec=pathwaySpec({profile});assert.equal(spec.kind,'photovoltaic');assert.equal(spec.direction,'selective-separation');assert.equal(spec.carrier,'electron-hole');}
assert.equal(pathwaySpec({profile:'solar_organic'}).organic,true);
assert.equal(pathwaySpec({profile:'rtg'}).kind,'thermoelectric');assert.equal(pathwaySpec({profile:'rtg'}).carrier,'heat');
assert.equal(pathwaySpec({profile:'betavoltaic'}).kind,'betavoltaic');assert.equal(pathwaySpec({profile:'betavoltaic'}).carrier,'electron-hole');
for(const profile of ['alkaline','leadacid','nimh','nizn','aqueouszn'])assert.equal(pathwaySpec({profile}).direction,'ion-balance',profile+' incorrectly assigns one ion direction');
assert.equal(pathwaySpec({profile:'sodium_pba'}).carrier,'Na⁺');assert.equal(pathwaySpec({profile:'liion'}).carrier,'Li⁺');
assert.throws(()=>pathwaySpec({profile:'unknown'}),RangeError);
for(const file of ['pathway-view.js','pathway.css'])assert((await stat(new URL('../dist/'+file,import.meta.url))).size>500);
assert(homeHtml.includes('href="/pathway.css"'));
console.log('Principle checks passed: all 32 profiles, bilingual stages, no configuration mutation, source IDs, carrier directions, organic PV, aqueous limits and distinct nuclear mechanisms.');
