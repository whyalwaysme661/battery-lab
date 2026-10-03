import {getProfile,packaging} from './catalog.js';
export const familyGuide={
 secondary:{title:'可以反复充放电',description:'从电极、电解质和界面看储能结构。寿命需要同一试样的循环记录。',order:['liion','solid','sodium','nimh','leadacid','aqueouszn'],roles:['anode','electrolyte','cathode','collector','seal','shell']},
 primary:{title:'一次放电的结构',description:'评价放电容量与储存表现，不套用充电循环。',order:['alkaline','lithiumprimary','silver','zincair','primary_fes2','carbonzinc'],roles:['anode','electrolyte','cathode','collector','seal','shell']},
 solar:{title:'把光变成电',description:'看吸光层、接触和封装。按光照条件与工作点读效率。',order:['solar_si','solar_film','solar_perovskite','solar_organic','solar_iiiv'],roles:['cathode','anode','collector','electrolyte','seal','shell']},
 fuel:{title:'持续供料，持续发电',description:'看电极、电解质与气体通道。耐久用运行小时和功率衰减记录。',order:['pem','sofc','afc','pafc','mcfc'],roles:['anode','electrolyte','cathode','collector','seal','shell']},
 nuclear:{title:'从衰变能到电输出',description:'探索热电与半导体转换原理，评估需专业机构的型号记录。',order:['rtg','betavoltaic'],roles:['heat','converter','cathode','anode','seal','shell']}
};
export function profileNote(p){return packaging[p.packaging[0]].label;}
export function roleInfo(p,role){
 const solar=p.family==='solar',fuel=p.family==='fuel',nuclear=p.family==='nuclear';
 const names={cathode:solar?'吸光层':fuel?'氧侧电极':nuclear?'转换组件':'正极',anode:solar?'接触与传输':fuel?'燃料侧电极':nuclear?'能量源':'负极',electrolyte:solar?'钝化与功能层':'电解质',shell:'外壳与盖板',collector:'集流与连接',copper:'集流与连接',seal:'绝缘与密封',sei:'人工界面层',heat:'能量源',converter:'转换组件'};
 const text={cathode:solar?'吸收光子并产生电荷，具体结与接触设计随器件改变。':fuel?'氧参与电极反应，传递的离子随电解质改变。':nuclear?'把热量或衰变能转换成电输出。':'放电时发生还原反应，容量还取决于载量和测试条件。',anode:solar?'收集电荷，不等同于储能电池的负极。':fuel?'燃料参与反应，电子经外电路参与电输出。':nuclear?'源包容性需完整器件证据。':'放电时发生氧化反应，材料与界面按体系选择。',electrolyte:solar?'用于表面、接触或窗口功能，不是电化学电解质。':'提供内路的离子传导。不同材料需要各自的界面条件。',shell:'保护内部结构；内部层厚是观察示意。',collector:'连接电极与外电路，承担电子收集。',copper:'连接电极与外电路；集流材料随体系改变。',seal:'维持隔离与密封，漏液、漏气或绝缘失效需对应测试。',sei:'人为引入的界面设计，不能直接继承原试样性能。',heat:'衰变能是电输出的来源；热电型先转为热。',converter:'热电或半导体组件完成转换，输出依具体器件证据。'};
 return {title:names[role]??'结构部件',text:text[role]??'用于观察结构关系，具体功能回到结构来源核对。'};
}
export function makeTeachingInput(family){
 const base={area:100,current:1000,voltage:3.2,operatingVoltage:3.2,capacity:1000,mass:20,temperature:25,irradiance:null};
 if(family==='solar')Object.assign(base,{voltage:2,operatingVoltage:null,capacity:null,mass:null,irradiance:1000});
 if(['fuel','nuclear'].includes(family))Object.assign(base,{current:100,voltage:1,operatingVoltage:null,capacity:null,mass:null});
 return base;
}
export function workingPower(config){const ordinary=['primary','secondary'].includes(getProfile(config.profile).family),v=ordinary?config.operatingVoltage:config.voltage;return Number.isFinite(v)&&Number.isFinite(config.current)?v*config.current/1000:null;}
export const teachingCurve=[{cycle:0,capacity:100},{cycle:100,capacity:94},{cycle:200,capacity:89},{cycle:300,capacity:84},{cycle:400,capacity:76}];
export function shapeSketch(p){
 const kind=packaging[p.packaging[0]].model;let art='<path d="M28 25h58v53H28z" fill="#c8cec4" stroke="#778d82"/><path d="M36 18h12v8H36m24-8h12v8H60" fill="#a96c41"/><path d="M36 34h42v35H36z" fill="#a6b7ab"/>';
 if(['solar','solarfilm','thinbattery'].includes(kind))art='<path d="M27 16h70l-10 66H17z" fill="#32545b" stroke="#809695"/><path d="M40 16L30 82m25-66L45 82m25-66L60 82m25-66L75 82M24 37h70M21 59h70" stroke="#b8c9c7"/>';
 if(['cylindrical','alkaline','carbonzinc','rtg'].includes(kind))art='<path d="M39 22v52c0 12 35 12 35 0V22" fill="#c8cdc4" stroke="#778e85"/><ellipse cx="56.5" cy="22" rx="17.5" ry="6" fill="#e5e7dc"/><path d="M48 14h17v7H48M40 47h34v27c0 12-34 12-34 0z" fill="#9b6240"/>';
 if(['coin','aircoin'].includes(kind))art='<path d="M25 48v17c0 16 64 16 64 0V48" fill="#b9c6bb" stroke="#77918a"/><ellipse cx="57" cy="48" rx="32" ry="13" fill="#edf0e8" stroke="#77918a"/><path d="M49 47h16m-8-8v16" stroke="#7c8f87"/>';
 if(['pem','sofc','afc','pafc','mcfc'].includes(kind))art='<path d="M22 23h66l12 9v45l-12 8H22L13 76V32z" fill="#aebdb6" stroke="#6e847d"/><path d="M26 32h58v44H26z" fill="#455a55"/><path d="M34 32v44m10-44v44m10-44v44m10-44v44m10-44v44" stroke="#c6d0c3" stroke-width="3"/>';if(kind==='beta')art='<path d="M31 30h52v44H31z" fill="#aab5a6" stroke="#6e847d"/><path d="M39 38h36v28H39z" fill="#436953"/><path d="M39 22v8m12-8v8m12-8v8m12-8v8M39 74v9m12-9v9m12-9v9m12-9v9" stroke="#a5754d" stroke-width="4"/>';return '<svg viewBox="0 0 114 100" aria-hidden="true">'+art+'</svg>';
}
