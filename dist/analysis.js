import {getProfile,materials,packaging} from './catalog.js';
export const geometryKeys=['profile','cathode','anode','electrolyte','sei','packaging','width','height','depth'];
export function fingerprint(c){return JSON.stringify(geometryKeys.map(k=>c[k]));}
export function modelConfig(c){return {profile:c.profile,model:packaging[c.packaging].model,width:c.width,height:c.height,depth:c.depth,cathode:c.cathode,anode:c.anode,electrolyte:c.electrolyte,sei:c.sei};}
export function parseCurve(text){
 const rows=text.trim().split(/\r?\n/).filter(s=>s.trim());
 if(rows.length>5001)throw new Error('最多支持 5000 个数据点');
 if(!rows.length)throw new Error('请粘贴循环次数和实测容量');
 let start=/^[a-zA-Z\u4e00-\u9fff]/.test(rows[0].trim())?1:0;
 const points=rows.slice(start).map((line,i)=>{
  const values=line.trim().split(/[,;\t ]+/);if(values.length!==2)throw new Error('第 '+(i+start+1)+' 行需要两列：cycle,capacity_mAh');
  const [cycle,capacity]=values.map(Number);if(!Number.isSafeInteger(cycle)||cycle<0||!Number.isFinite(capacity)||capacity<=0)throw new Error('循环次数须为非负整数，容量须为正数');
  return {cycle,capacity};
 });
 if(points.length<2)throw new Error('至少需要两个实测数据点');
 if(points.some((p,i)=>i&&p.cycle<=points[i-1].cycle))throw new Error('循环次数须严格递增，不能重复');
 return points;
}
export function analyzeCurve(points,threshold=80){
 if(!Number.isFinite(threshold)||threshold<=0||threshold>=100)throw new Error('阈值须大于 0 且小于 100%');
 const normalized=points.map(p=>({...p,retention:p.capacity/points[0].capacity*100}));
 let crossing=null;
 for(let i=1;i<normalized.length;i++){const a=normalized[i-1],b=normalized[i];if(a.retention>threshold&&b.retention<=threshold){crossing=a.cycle+(a.retention-threshold)/(a.retention-b.retention)*(b.cycle-a.cycle);break;}}
 return{points:normalized,baseline:points[0],last:normalized.at(-1),threshold,crossing};
}
const tests={
 solar:[['环境耐久','湿热、紫外与封装破损','湿热、光照老化与气密记录'],['电气与接触','热斑、接触失效或绝缘损坏','绝缘、热斑与接触稳定性测试'],['材料与回收','含铅/镉器件或封装失效','按具体器件的材料和回收证据']],
 secondary:[['外 / 内短路','绝缘失效或枝晶穿透','短路与界面稳定性测试'],['热与电滥用','过充、外部加热、冷却不足','按具体型号与工况记录温升、产气与失效'],['密封与机械','振动、冲击、密封丧失','泄漏、机械与电极接触测试']],
 primary:[['误充与反接','给一次电池充电或串联反接','误用与负载工况验证'],['泄漏与短路','封口破坏、绝缘损坏','泄漏、短路与存储检查'],['储存性能','温度、湿度与自放电','型号限定的储存与放电测试']],
 fuel:[['气密与压差','燃料 / 氧气泄漏或交叉','密封与压差测试'],['热与水管理','高温梯度 / 膜干燥或积水','热循环或水管理测试'],['耐久与污染','启停、杂质或电极退化','运行小时、衰减率与气体组成记录']],
 nuclear:[['源包容性','封装或包容结构失效','专用核电源包容性证据'],['能量转换耐久','半导体损伤或热电组件退化','型号限定的功率衰减测试'],['热与辐射管理','温升或屏蔽不足','专业机构的热 / 辐射评估']]
};
export function safetyRows(c){return tests[getProfile(c.profile).family].map(([mechanism,trigger,test])=>({mechanism,trigger,test}));}
export function sourceDifferences(c,o){
 const diffs=['试样载量、压力、温度与制备流程未完成一一核对'];
 if(c.sei!=='none')diffs.push('当前增加人工界面，原 Mu 试样并非该涂层');
 if(o.kind==='product')diffs.push('厂家完整产品与当前自定义装配不同');
 if(o.kind==='symmetric')diffs.push('两侧均为锂的对称测试与当前全电池结构不同');
 return diffs;
}
export function configLabel(c){return getProfile(c.profile).label+' · '+packaging[c.packaging].label.split(' · ')[0];}
export function chargePath(c){
 const p=getProfile(c.profile);
 if(p.family==='solar')return['吸光层吸收光子','产生电子 / 空穴','选择性接触分离电荷','外电路输出电功率'];
 if(c.profile==='rtg')return['热源衰变','产生热量','热电转换','电输出 / 余热散出'];
 if(c.profile==='betavoltaic')return['β 衰变能','半导体电子空穴对','结区分离电荷','电输出'];
 if(c.profile==='sofc')return['氧侧 O₂ + e⁻','O²⁻ 穿过 YSZ → 燃料侧','燃料侧氧化反应','e⁻ 外电路 → 氧侧'];
 if(c.profile==='afc')return['燃料侧 H₂ 氧化','OH⁻ 内路：氧侧 → 燃料侧','e⁻ 外电路 → 氧侧','水生成与碱液循环'];
 if(c.profile==='mcfc')return['氧侧 O₂ / CO₂ 参与反应','CO₃²⁻ 内路 → 燃料侧','燃料侧消耗燃料、生成 CO₂ / 水','e⁻ 外电路 → 氧侧'];
 if(c.profile==='pafc')return['燃料侧 H₂ 氧化','H⁺ 通过固定化磷酸 → 氧侧','e⁻ 外电路 → 氧侧','氧侧生成水'];
 if(c.profile==='aqueouszn')return['Zn 负极电极反应','水系电解质维持内部电荷传递','电子经外电路参与电输出','MnO₂ 侧反应；具体离子机制需按配方核对'];
 if(c.profile==='nizn')return['Zn 负极氧化','OH⁻ / 水参与两侧反应','e⁻ 外电路 → 镍侧','镍正极还原'];
 if(c.profile==='pem')return['燃料侧 H₂ 氧化','H⁺ 穿膜 → 氧侧','e⁻ 外电路 → 氧侧','氧侧生成水'];
 if(c.profile==='leadacid')return['Pb 负极氧化','硫酸参与两侧反应','e⁻ 外电路 → PbO₂ 侧','两侧生成 PbSO₄'];
 if(c.profile==='nimh')return['合金负极释放氢','OH⁻ / 水参与反应','e⁻ 外电路 → 镍侧','正负极发生氧化还原'];
 if(p.family==='primary')return['负极氧化','电解质维持离子传导','e⁻ 外电路 → 正极','正极还原'];
 return['负极脱嵌 / 氧化',''+(c.profile.startsWith('sodium')?'Na⁺':'Li⁺')+' 内路 → 正极','e⁻ 外电路 → 正极','正极嵌入 / 还原'];
}

export function chargePathSteps(c){
 const profile=getProfile(c.profile),text=chargePath(c);
 let roles=[['anode'],['electrolyte'],['collector','copper'],['cathode']];
 if(profile.family==='solar')roles=[['cathode'],['cathode'],['anode'],['collector','anode']];
 if(c.profile==='rtg')roles=[['heat'],['heat'],['converter'],['converter','shell']];
 if(c.profile==='betavoltaic')roles=[['heat'],['converter'],['converter'],['collector','copper']];
 if(['sofc','mcfc'].includes(c.profile))roles=[['cathode'],['electrolyte'],['anode'],['collector','copper']];
 if(c.profile==='afc')roles=[['anode'],['electrolyte'],['collector','copper'],['electrolyte']];
 if(['leadacid','nimh'].includes(c.profile))roles=[['anode'],['electrolyte'],['collector','copper'],['anode','cathode']];
 return text.map((text,i)=>({text,roles:roles[i]}));
}
