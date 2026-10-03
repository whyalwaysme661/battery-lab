import {getLocale, translate} from './i18n.js';
import {getProfile, materials, sources} from './catalog.js';
import {chargePathSteps} from './analysis.js';

const b = (zh, en) => ({zh, en});
const STAGE_MS = 6500;
const xml = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
let instance = 0;
const sourceById = id => sources.find(source => source.id === id);
const textOf = value => typeof value === 'string' ? translate(value) : value?.[getLocale()] ?? value?.zh ?? '';
const step = (zh, en, zhBody, enBody, formula = '') => ({title:b(zh,en), body:b(zhBody,enBody), formula});

/** Locale-independent, source-bound qualitative mechanism; no DOM or state mutation. */
export function pathwaySpec(config = {}) {
  const profile = getProfile(config.profile);
  if (!profile) throw new RangeError('Unknown pathway profile: ' + config.profile);
  const selected = {
    anode: config.anode || profile.anodes[0] || '',
    cathode: config.cathode || profile.cathodes[0] || '',
    electrolyte: config.electrolyte || profile.electrolytes[0] || ''
  };
  const spec = {
    profile:profile.id, family:profile.family, kind:'electrochemical',
    carrier:'ions', direction:'ion-balance', electronDirection:'left-to-right',
    materials:selected, internalStage:1, electronStage:2, productStage:3,
    firstSide:'left', sourceIds:[...new Set([...profile.sources, ...Object.values(selected).map(id=>materials[id]?.source).filter(Boolean)])],
    leftLabel:b('负极','Anode'), rightLabel:b('正极','Cathode'),
    middleLabel:b('电解质','Electrolyte'), carrierLabel:b('离子传导','Ionic conduction'),
    equationSide:'left', equations:[], steps:[]
  };
  if (profile.family === 'fuel') {
    Object.assign(spec, {kind:'fuel', leftLabel:b('燃料侧','Fuel side'), rightLabel:b('氧侧','Oxygen side')});
    const proton = profile.id === 'pem' || profile.id === 'pafc';
    spec.carrier = proton ? 'H⁺' : profile.id === 'sofc' ? 'O²⁻' : profile.id === 'afc' ? 'OH⁻' : 'CO₃²⁻';
    spec.direction = proton ? 'left-to-right' : 'right-to-left';
    spec.carrierLabel = b(spec.carrier + ' 内路',spec.carrier + ' inside');
    spec.middleLabel = profile.id === 'pem' ? b('质子交换膜','Proton membrane')
      : profile.id === 'pafc' ? b('固定化磷酸','Immobilized acid')
      : profile.id === 'sofc' ? b('氧离子导电陶瓷','Oxide-ion ceramic')
      : profile.id === 'afc' ? b('碱性电解质','Alkaline electrolyte')
      : b('熔融碳酸盐','Molten carbonate');
    if (proton) {
      const medium = profile.id === 'pafc' ? b('固定在基体中的磷酸','phosphoric acid immobilized in a matrix') : b('质子交换聚合物膜','the proton-exchange polymer membrane');
      spec.steps = [
        step('氢在燃料侧分开','Hydrogen reacts at the fuel side','氢分子在催化电极上发生氧化，形成质子并释放电子。两种带电粒子接下来走不同的路。','Hydrogen is oxidized at the catalyst, producing protons and releasing electrons. The two charge carriers then take separate routes.','H₂ → 2H⁺ + 2e⁻'),
        step('质子穿过电解质','Protons cross the electrolyte','H⁺ 通过'+medium.zh+'从燃料侧到氧侧。电解质传导离子，并阻止电子直接穿过内部。','H⁺ travels from the fuel side to the oxygen side through '+medium.en+'. The electrolyte conducts ions and blocks a direct electronic path.','H⁺  →'),
        step('电子经过负载','Electrons pass through the load','电子沿金属接触和外部导线，从燃料侧流向氧侧；通过负载时向外输出电能。','Electrons move through metal contacts and the external wire from the fuel side to the oxygen side, delivering electrical energy to the load.','e⁻  →'),
        step('氧侧生成水','Water forms at the oxygen side','氧气与到达的质子、电子在氧侧反应，生成水。持续供氢、供氧，才能维持电输出。','Oxygen reacts with the arriving protons and electrons to form water. A continuing supply of hydrogen and oxygen sustains the electrical output.','O₂ + 4H⁺ + 4e⁻ → 2H₂O')
      ];
      spec.equations = [spec.steps[0].formula, '', '', spec.steps[3].formula];
    } else if (profile.id === 'sofc') {
      Object.assign(spec,{firstSide:'right',electronStage:3,productStage:2});
      spec.steps = [
        step('氧侧接收电子','Oxygen takes up electrons','氧分子在氧电极接收外电路提供的电子，形成 O²⁻。这里展示所选氧离子导电 SOFC 的工作路径。','At the oxygen electrode, oxygen takes up electrons from the external circuit and forms O²⁻. This is the oxide-ion-conducting SOFC pathway.','O₂ + 4e⁻ → 2O²⁻'),
        step('氧离子穿过陶瓷','Oxide ions cross the ceramic','O²⁻ 从氧侧向燃料侧迁移，穿过所选陶瓷电解质。具体 YSZ、GDC 或带阻挡层的组合以选材来源为准。','O²⁻ migrates from the oxygen side to the fuel side through the selected ceramic electrolyte. The chosen YSZ, GDC or barrier-layer stack follows its material source.','←  O²⁻'),
        step('氢与氧离子反应','Hydrogen reacts with oxide ions','在此氢燃料示意中，H₂ 与到达的 O²⁻ 反应生成水，并向燃料电极释放电子。','In this hydrogen-fueled example, H₂ reacts with arriving O²⁻ to produce water and release electrons at the fuel electrode.','H₂ + O²⁻ → H₂O + 2e⁻'),
        step('电子回到氧侧','Electrons return to the oxygen side','电子经外部导线和负载从燃料侧流向氧侧。内部氧离子与外部电子的路径方向相反。','Electrons flow through the external wire and load from the fuel side to the oxygen side. The internal oxide-ion path runs in the opposite direction.','e⁻  →')
      ];
      spec.equations = [spec.steps[0].formula,'',spec.steps[2].formula,''];
    } else if (profile.id === 'afc') {
      spec.steps = [
        step('氢在碱性电极氧化','Hydrogen is oxidized','氢在燃料侧与 OH⁻ 反应，生成水并释放电子。碱性燃料电池的内部载流子是 OH⁻。','Hydrogen reacts with OH⁻ at the fuel side, forming water and releasing electrons. OH⁻ carries charge internally in this alkaline fuel cell.','H₂ + 2OH⁻ → 2H₂O + 2e⁻'),
        step('氢氧根从氧侧迁移','Hydroxide moves from the oxygen side','氧气在氧侧与水、电子反应生成 OH⁻；OH⁻ 再通过碱性电解质向燃料侧移动。','Oxygen reacts with water and electrons at the oxygen side to form OH⁻. Hydroxide then moves through the alkaline electrolyte toward the fuel side.','O₂ + 2H₂O + 4e⁻ → 4OH⁻'),
        step('电子经过外部负载','Electrons pass through the load','电子从燃料电极流经导线和负载，再到达氧电极。电子的外部路径与 OH⁻ 的内部路径相反。','Electrons flow from the fuel electrode through the wire and load to the oxygen electrode, opposite to the internal OH⁻ path.','e⁻  →'),
        step('水参与两侧反应','Water participates at both electrodes','燃料侧生成水，氧侧消耗水并再生 OH⁻。整体反应把氢和氧转化为水，同时输出电能。','Water is produced at the fuel side and consumed at the oxygen side as OH⁻ is regenerated. Overall, hydrogen and oxygen form water while delivering electricity.','2H₂ + O₂ → 2H₂O')
      ];
      spec.equations = [spec.steps[0].formula,spec.steps[1].formula,'',spec.steps[3].formula];
    } else {
      Object.assign(spec,{firstSide:'right',electronStage:3,productStage:2});
      spec.steps = [
        step('氧侧形成碳酸根','Carbonate forms at the oxygen side','氧侧的 O₂、CO₂ 与电子反应，形成 CO₃²⁻。CO₂ 是该电池离子传递循环的一部分。','At the oxygen side, O₂ and CO₂ react with electrons to form CO₃²⁻. CO₂ participates in this cell’s ion-transfer cycle.','O₂ + 2CO₂ + 4e⁻ → 2CO₃²⁻'),
        step('碳酸根通过电解质','Carbonate crosses the electrolyte','CO₃²⁻ 经基体中固定的熔融碳酸盐，从氧侧迁移到燃料侧。','CO₃²⁻ travels through molten carbonate held in a matrix, from the oxygen side to the fuel side.','←  CO₃²⁻'),
        step('燃料侧生成水和二氧化碳','Water and CO₂ form at the fuel side','这里以氢燃料说明：H₂ 与 CO₃²⁻ 反应，生成 H₂O 和 CO₂，同时释放电子。','Using hydrogen as the example fuel, H₂ reacts with CO₃²⁻ to produce H₂O and CO₂ while releasing electrons.','H₂ + CO₃²⁻ → H₂O + CO₂ + 2e⁻'),
        step('电子经负载返回氧侧','Electrons return through the load','电子沿外部导线从燃料侧流向氧侧，并在负载上输出电能。供气系统还需维持氧侧的 CO₂ 供应。','Electrons flow from the fuel side to the oxygen side through the external load. The gas system must also maintain the CO₂ supply at the oxygen side.','e⁻  →')
      ];
      spec.equations = [spec.steps[0].formula,'',spec.steps[2].formula,''];
    }
  } else if (profile.family === 'solar' || profile.id === 'betavoltaic') {
    const solar = profile.family === 'solar', organic = profile.id === 'solar_organic';
    Object.assign(spec,{kind:solar?'photovoltaic':'betavoltaic',carrier:'electron-hole',direction:'selective-separation',electronStage:3,productStage:3,organic});
    spec.leftLabel = b('电子接触','Electron contact');
    spec.rightLabel = b('空穴接触','Hole contact');
    spec.middleLabel = solar ? b('吸光层','Absorber') : b('半导体','Semiconductor');
    spec.carrierLabel = b('电子 / 空穴','Electrons / holes');
    spec.steps = solar ? [
      step('光被吸收','Light is absorbed','入射光子把能量交给吸光层。能否被吸收取决于光子能量和所选材料。','Incoming photons transfer energy to the absorber. Absorption depends on the photon energy and the selected material.','hν'),
      step(organic?'先形成束缚电荷对':'产生电子与空穴',organic?'Bound charge pairs form first':'Electrons and holes are generated',organic?'有机吸光层通常先产生束缚的电子—空穴对（激子）。图中相连的两点表示尚未分离的电荷。':'吸收的光能激发电子，同时留下空穴。电子与空穴是半导体中的两类载流子。',organic?'Organic absorbers usually first produce bound electron–hole pairs, called excitons. The connected pair represents charges that have not yet separated.':'Absorbed light excites electrons and leaves holes. Electrons and holes are the two carrier types in the semiconductor.',organic?'exciton':'e⁻ + h⁺'),
      step('分离并选择性收集电荷','Separate and selectively collect charge',organic?'给体 / 受体界面帮助激子分离；匹配的选择性接触分别收集电子和空穴。这里不把有机器件画成硅 PN 结。':'器件结区、内部电场或选择性接触促使两类载流子分开，并分别被收集；具体结构随器件材料而变。',organic?'The donor–acceptor interface helps separate excitons. Matched selective contacts collect electrons and holes separately.':'Junctions, internal fields or selective contacts separate the carriers and collect them at different contacts. The exact structure depends on the device.','e⁻  /  h⁺'),
      step('外部负载获得电功率','The external load receives power','接通外部回路后，电子通过导线与负载。吸光、分离和收集在工作中的器件里持续发生。','With an external circuit connected, electrons pass through the wire and load. Absorption, separation and collection continue in an operating device.','e⁻  →')
    ] : [
      step('衰变释放能量','Decay releases energy','密封放射源的 β 衰变释放能量。此处仅表示能量转换关系，不涉及核源制备或操作。','Beta decay in a contained source releases energy. The diagram shows the energy-conversion relationship.','β'),
      step('半导体产生电荷对','Charge pairs form in the semiconductor','沉积在半导体中的衰变能产生电子—空穴对。它们是半导体中的载流子，不是把核源画成化学负极。','Decay energy deposited in the semiconductor generates electron–hole pairs. These are semiconductor charge carriers.','e⁻ + h⁺'),
      step('结区分离电荷','The junction separates charge','半导体结区的内部电场帮助分离电子和空穴，接触电极收集电荷。','The internal field in the semiconductor junction helps separate electrons and holes. Contacts collect the charges.','e⁻  /  h⁺'),
      step('电荷经外回路输出','Charge flows through the load','接通负载后，所收集的电荷形成电输出。图中不推算器件功率、效率或运行寿命。','Collected charge produces electrical output through the connected load. No device power, efficiency or operating life is inferred here.','e⁻  →')
    ];
  } else if (profile.id === 'rtg') {
    Object.assign(spec,{kind:'thermoelectric',carrier:'heat',direction:'hot-to-cold',electronStage:3,productStage:3,carrierLabel:b('热流','Heat flow')});
    spec.steps = [
      step('衰变持续释放能量','Decay continuously releases energy','密封同位素热源通过自然衰变释放能量。这是热电转换的能量起点。','A contained radioisotope heat source releases energy through natural decay. This supplies the energy for thermoelectric conversion.',''),
      step('能量转化为热','Energy becomes heat','热源及其包容结构吸收衰变能，形成热量；热量传向热电组件的热端。','Decay energy is absorbed in the heat source and its containment, producing heat that flows toward the hot side of the converter.',''),
      step('温差驱动热电转换','A temperature difference drives conversion','热电组件跨接热端与冷端，利用温差产生电势差。这里没有离子穿过电解质的过程。','Thermoelectric elements span a hot side and a cold side. Their temperature difference produces a voltage.','ΔT'),
      step('输出电能并散出余热','Electricity is delivered; waste heat leaves','负载接入后获得电输出；未转化为电能的热量经外壳和散热结构向环境散出。','A connected load receives electrical output. Heat that is not converted to electricity leaves through the housing and heat-rejection structure.','')
    ];
  } else {
    const sodium = profile.id.startsWith('sodium');
    const lithium = ['liion','liion_hv','solid','solid_halide','thinbattery','gel','lithiumprimary','primary_cfx','primary_fes2'].includes(profile.id);
    if (sodium || lithium) {
      spec.carrier = sodium ? 'Na⁺' : 'Li⁺';
      spec.direction = 'left-to-right';
      spec.carrierLabel = b(spec.carrier+' 内路',spec.carrier+' inside');
    }
    const ion = spec.carrier;
    spec.steps = [
      step('负极发生氧化','Oxidation occurs at the anode','放电时，负极发生氧化并向外部电路释放电子。可移动的电荷与材料中的氧化还原反应相互配合。','During discharge, oxidation at the anode releases electrons into the external circuit. Mobile charge and electrode redox reactions work together.',''),
      step(spec.direction==='ion-balance'?'电解质维持内部电荷平衡':'离子走内部路径',spec.direction==='ion-balance'?'The electrolyte maintains charge balance':'Ions follow the internal route',spec.direction==='ion-balance'?'电解质中的离子传导连接两侧反应。正、负离子与水的参与方式取决于所选化学体系；图中的双向箭头不指定单一离子的净迁移方向。':ion+' 在放电时由负极侧迁移至正极侧。电解质让离子通过，同时避免两极通过内部形成电子短路。',spec.direction==='ion-balance'?'Ionic conduction connects the electrode reactions. The roles of ions and water depend on the chemistry; the two arrows do not assign a net direction to one specific ion.':ion+' moves from the anode side toward the cathode side during discharge. The electrolyte permits ionic transport while preventing an internal electronic short circuit.',spec.direction==='ion-balance'?'':ion+'  →'),
      step('电子走外部路径','Electrons follow the external route','电子从负极经金属接触、导线与负载到达正极。负载由这条外部回路获得电能。','Electrons travel from the anode through metal contacts, wires and the load to the cathode. The external circuit supplies electrical energy to the load.','e⁻  →'),
      step('正极接收电子并反应','The cathode accepts electrons and reacts',profile.family==='primary'?'正极参与还原反应，生成对应放电产物。一次电池不能据此按可充电电池操作。':'正极接收电子，发生还原及与体系相应的嵌入或转化反应；本图只讲放电方向。',profile.family==='primary'?'The cathode is reduced and forms the discharge products of this chemistry. This does not imply that a primary cell is rechargeable.':'The cathode accepts electrons and undergoes reduction, with insertion or conversion appropriate to the chemistry. This view shows discharge only.','')
    ];
    if (profile.id === 'leadacid') {
      spec.carrierLabel = b('硫酸参与反应','Sulfuric-acid chemistry');
      spec.steps[0] = step('铅负极发生氧化','The lead anode is oxidized','放电时，Pb 负极与硫酸体系中的离子反应，形成 PbSO₄ 并释放电子。','During discharge, the Pb anode reacts with ions in the sulfuric-acid electrolyte, forming PbSO₄ and releasing electrons.');
      spec.steps[1].body = b('硫酸参与两侧电极反应，离子传导维持内部电荷平衡。富液、AGM 和胶体的固定方式不同，但不能把硫酸画成锂盐电解质。','Sulfuric acid participates in both electrode reactions, while ionic conduction maintains charge balance. Flooded, AGM and gel designs hold the acid differently.');
      spec.steps[3] = step('两侧形成硫酸铅','Lead sulfate forms at both electrodes','PbO₂ 正极被还原；两极都形成 PbSO₄，硫酸被消耗并生成水。','The PbO₂ cathode is reduced. Both electrodes form PbSO₄ as sulfuric acid is consumed and water is produced.','Pb + PbO₂ + 2H₂SO₄ → 2PbSO₄ + 2H₂O');
    } else if (profile.id === 'nimh') {
      spec.carrierLabel = b('OH⁻ / 水参与','OH⁻ / water');
      spec.steps[0] = step('储氢合金释放电子','The hydride electrode releases electrons','储氢合金中的氢在负极参与氧化，与 OH⁻ 反应生成水并释放电子。','Hydrogen in the metal-hydride anode is oxidized, reacting with OH⁻ to form water and release electrons.','MH + OH⁻ → M + H₂O + e⁻');
      spec.steps[3] = step('镍电极发生还原','The nickel electrode is reduced','NiOOH 正极接收电子，与水反应生成 Ni(OH)₂ 和 OH⁻。OH⁻ / 水把两侧反应联系起来。','NiOOH accepts electrons and reacts with water to form Ni(OH)₂ and OH⁻. Hydroxide and water participate in the paired electrode reactions.','NiOOH + H₂O + e⁻ → Ni(OH)₂ + OH⁻');
    } else if (profile.id === 'nizn') {
      spec.carrierLabel = b('OH⁻ / 水参与','OH⁻ / water');
      spec.steps[0] = step('锌负极发生氧化','The zinc anode is oxidized','锌负极在碱性电解质中氧化并释放电子；锌酸根与 ZnO 的参与随电极状态而变。','The zinc anode is oxidized in alkaline electrolyte and releases electrons. Zincate and ZnO participation depends on the electrode state.','');
      spec.steps[3] = step('镍正极发生还原','The nickel cathode is reduced','NiOOH 接收电子，与水反应生成 Ni(OH)₂ 和 OH⁻。','NiOOH accepts electrons and reacts with water to form Ni(OH)₂ and OH⁻.','NiOOH + H₂O + e⁻ → Ni(OH)₂ + OH⁻');
    } else if (profile.id === 'aqueouszn') {
      spec.carrierLabel = b('水系离子平衡','Aqueous ion balance');
      spec.steps[0] = step('锌负极释放电子','The zinc anode releases electrons','放电时，锌负极发生氧化，向外部电路释放电子。','During discharge, the zinc anode is oxidized and releases electrons into the external circuit.','Zn → Zn²⁺ + 2e⁻');
      spec.steps[1].body = b('水系电解质维持内部电荷传递。Zn²⁺、H⁺、共存盐及水的具体作用需按当前材料配方核对，不在这里指定唯一迁移机制。','The aqueous electrolyte maintains internal charge transfer. The roles of Zn²⁺, H⁺, co-salts and water must be checked against the selected formulation; no single migration mechanism is assigned here.');
      spec.steps[3].body = b('所选正极参与还原反应。MnO₂、钒氧化物及其他研究材料的储电机制不同，应回到当前配对的原始研究核对。','The selected cathode undergoes reduction. MnO₂, vanadium oxides and other research materials use different storage mechanisms; consult the original study for the selected pairing.');
    }
  }
  spec.steps = spec.steps.map((entry,i)=>({...entry, index:i}));
  return spec;
}

function drawing(spec, uid) {
  const labels = [], tracks = [];
  let serial = 0;
  const label = (x,y,copy,cls='',anchor='middle') => {
    const id = 'l'+serial++;
    labels.push({id,copy});
    return '<text data-label="'+id+'" x="'+x+'" y="'+y+'" text-anchor="'+anchor+'" class="pl-label '+cls+'"></text>';
  };
  const stage = (index, content, cls='') => '<g class="pl-stage '+cls+'" data-stage="'+index+'">'+content+'</g>';
  const slab = (x,y,w,h,fill='plate',side=18) =>
    '<path d="M '+x+' '+y+' l '+side+' -13 h '+w+' l -'+side+' 13 Z" fill="url(#'+uid+'-rim)" stroke="#bcbcbc" stroke-opacity=".3"/>'+
    '<path d="M '+(x+w)+' '+y+' l '+side+' -13 v '+h+' l -'+side+' 13 Z" fill="#25282a" stroke="#7a8183" stroke-opacity=".45"/>'+
    '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="2" fill="url(#'+uid+'-'+fill+')" stroke="#abb4b6" stroke-opacity=".48"/>';
  const path = (id,d,type,start,symbol,count=3,seconds=3.2,reverse=false) => {
    tracks.push({id,d,type,start,symbol,count,seconds,reverse});
    return stage(start,'<path id="'+uid+'-'+id+'" class="pl-route pl-route-'+type+'" d="'+d+'" marker-end="url(#'+uid+'-'+type+'-arrow)"/><g data-particles="'+id+'"></g>');
  };
  const molecule = (x,y,type) => {
    if(type==='H₂O') return '<g transform="translate('+x+' '+y+')"><path d="M -15 11 L 0 0 L 15 11" class="pl-bond"/><circle r="9" class="pl-atom-o"/><circle cx="-15" cy="11" r="6" class="pl-atom-h"/><circle cx="15" cy="11" r="6" class="pl-atom-h"/><text y="43" text-anchor="middle" class="pl-species">H₂O</text></g>';
    if(type==='CO₂') return '<g transform="translate('+x+' '+y+')"><path d="M -17 0 H 17" class="pl-bond"/><circle r="8" fill="#85898b"/><circle cx="-17" r="8" class="pl-atom-o"/><circle cx="17" r="8" class="pl-atom-o"/><text y="35" text-anchor="middle" class="pl-species">CO₂</text></g>';
    return '<g transform="translate('+x+' '+y+')"><path d="M -9 0 H 9" class="pl-bond"/><circle cx="-9" r="10" class="'+(type==='H₂'?'pl-atom-h':'pl-atom-o')+'"/><circle cx="9" r="10" class="'+(type==='H₂'?'pl-atom-h':'pl-atom-o')+'"/><text y="36" text-anchor="middle" class="pl-species">'+type+'</text></g>';
  };
  const load = (y,start,left=310,right=595) => stage(start,
    '<path class="pl-wire-shadow" d="M '+left+' 203 V '+y+' H '+right+' V 203"/>'+
    '<path class="pl-wire" d="M '+left+' 203 V '+y+' H '+right+' V 203"/>'+
    '<g class="pl-load"><rect x="419" y="'+(y-20)+'" width="68" height="40" rx="3"/><path d="M 430 '+y+' l 6 -8 9 16 9 -16 9 16 8 -16 6 8"/></g>'+
    label(453,y-34,b('外部负载','External load'),'pl-load-label'));
  const defs = '<defs>'+
    '<linearGradient id="'+uid+'-plate" x2="1" y2=".6"><stop stop-color="#515658"/><stop offset=".24" stop-color="#24282a"/><stop offset="1" stop-color="#131617"/></linearGradient>'+
    '<linearGradient id="'+uid+'-rim" x2="0" y2="1"><stop stop-color="#8c9395" stop-opacity=".6"/><stop offset="1" stop-color="#252a2c"/></linearGradient>'+
    '<linearGradient id="'+uid+'-membrane" x2="1" y2=".15"><stop stop-color="#90b3b5" stop-opacity=".3"/><stop offset=".45" stop-color="#9bbfc0" stop-opacity=".06"/><stop offset="1" stop-color="#bfd5d5" stop-opacity=".36"/></linearGradient>'+
    '<linearGradient id="'+uid+'-absorber" x2="1" y2="1"><stop stop-color="#494e52"/><stop offset=".48" stop-color="#202326"/><stop offset="1" stop-color="#42494c"/></linearGradient>'+
    '<pattern id="'+uid+'-pores" width="19" height="21" patternUnits="userSpaceOnUse"><circle cx="6" cy="6" r="3.4" fill="#080a0a" stroke="#8c999c" stroke-opacity=".22"/><circle cx="16" cy="15" r="2.6" fill="#0e1011"/><path d="M 0 15 L 6 19 M 12 0 L 17 4" stroke="#929a9b" stroke-opacity=".16"/></pattern>'+
    '<pattern id="'+uid+'-crystal" width="41" height="35" patternUnits="userSpaceOnUse"><path d="M 0 8 L 23 0 L 41 16 L 18 35 Z M 23 0 L 18 35" fill="none" stroke="#a3acad" stroke-opacity=".24"/></pattern>'+
    ['ion','electron','energy','hole'].map(type=>'<marker id="'+uid+'-'+type+'-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 1 1 L 9 5 L 1 9" fill="none" class="pl-arrow-'+type+'" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></marker>').join('')+
    '</defs>';
  let content = '';
  if (spec.kind==='fuel' || spec.kind==='electrochemical') {
    const firstRight = spec.firstSide==='right', leftStart=firstRight?1:0, rightStart=firstRight?0:1;
    const plate = (x,start,copy,role) => stage(start,
      slab(x,194,74,168)+
      '<rect x="'+(x+1)+'" y="195" width="72" height="166" fill="url(#'+uid+'-pores)"/>'+
      '<rect x="'+(x+(role==='anode'?58:7))+'" y="194" width="9" height="168" class="pl-catalyst"/>'+
      '<path d="M '+(x+28)+' 194 V 170 h 21 v 24" class="pl-tab"/>'+
      label(x+37,400,copy), 'pl-electrode-'+role);
    content += plate(273,leftStart,spec.leftLabel,'anode');
    content += stage(1,slab(384,194,129,168,'membrane')+
      '<path d="M 403 204 v 147 M 424 204 v 147 M 446 204 v 147 M 469 204 v 147 M 491 204 v 147" class="pl-membrane-strand"/>'+
      label(449,441,spec.middleLabel,'pl-material-label')+
      '<path d="M 449 367 v 43" class="pl-leader"/>');
    content += plate(558,rightStart,spec.rightLabel,'cathode');
    content += load(91,spec.electronStage);
    content += path('electrons','M310 193 V91 H595 V193','electron',spec.electronStage,'e⁻',4,5);
    content += stage(spec.electronStage,label(598,143,b('e⁻ 外路','e⁻ outside'),'pl-electron-label','start'));
    if(spec.direction==='ion-balance') {
      content += path('ions-forward','M347 253 H558','ion',1,'+',2,3.6);
      content += path('ions-back','M558 303 H347','ion',1,'−',2,3.6);
      content += stage(1,label(449,225,b('离子传导','Ionic conduction'),'pl-ion-label'));
    } else {
      const reverse=spec.direction==='right-to-left';
      content += path('ions',reverse?'M558 278 H347':'M347 278 H558','ion',1,spec.carrier,spec.carrier.length>3?2:3,3.8);
      content += stage(1,label(449,236,spec.carrierLabel,'pl-ion-label'));
    }
    if(spec.kind==='fuel') {
      const rightFeed = firstRight ? 0 : spec.profile==='afc' ? 1 : 3;
      const leftFeed = firstRight ? 2 : 0;
      content += stage(leftFeed,molecule(198,230,'H₂')+'<path d="M224 240 H266" class="pl-feed" marker-end="url(#'+uid+'-energy-arrow)"/>');
      content += stage(rightFeed,molecule(713,230,'O₂')+'<path d="M687 240 H642" class="pl-feed" marker-end="url(#'+uid+'-energy-arrow)"/>');
      content += path('hydrogen-feed','M222 241 L288 271','energy',leftFeed,'H₂',1,2.7);
      content += path('oxygen-feed','M687 241 L620 271','energy',rightFeed,'O₂',1,3.1);
      if(spec.profile==='mcfc') content+=stage(0,molecule(713,319,'CO₂'));
      if(spec.profile==='afc') content+=stage(1,molecule(713,322,'H₂O'));
      if(firstRight || spec.profile==='afc') {
        content += stage(spec.productStage,molecule(192,337,'H₂O')+'<path d="M269 315 L224 329" class="pl-feed" marker-end="url(#'+uid+'-energy-arrow)"/>');
        if(spec.profile==='mcfc') content+=stage(2,molecule(194,422,'CO₂'));
      } else {
        content += stage(3,molecule(713,333,'H₂O')+'<path d="M645 313 L686 327" class="pl-feed" marker-end="url(#'+uid+'-energy-arrow)"/>');
      }
      if(spec.carrier==='H⁺') content+=stage(0,
        '<circle cx="307" cy="247" r="18" class="pl-particle-ion"/><text x="307" y="253" text-anchor="middle" class="pl-particle-text">'+(spec.carrier==='H⁺'?'H⁺':'e⁻')+'</text>'+
        '<circle cx="307" cy="310" r="17" class="pl-particle-electron"/><text x="307" y="316" text-anchor="middle" class="pl-particle-text">e⁻</text>','pl-initial-reaction');
    } else {
      content += stage(0,label(206,276,b('氧化','Oxidation'),'pl-reaction-label')+
        '<path d="M231 284 H265" class="pl-feed" marker-end="url(#'+uid+'-energy-arrow)"/>');
      content += stage(3,label(701,276,b('还原','Reduction'),'pl-reaction-label')+
        '<path d="M642 284 H670" class="pl-feed" marker-end="url(#'+uid+'-energy-arrow)"/>');
      content += stage(3,Array.from({length:6},(_,i)=>'<circle cx="'+(574+(i%2)*25)+'" cy="'+(222+Math.floor(i/2)*46)+'" r="8" class="pl-stored-ion"/>').join(''));
    }
  } else if(spec.kind==='photovoltaic' || spec.kind==='betavoltaic') {
    const solar=spec.kind==='photovoltaic';
    content += stage(solar?0:1,slab(304,205,309,140,'absorber')+
      '<rect x="305" y="206" width="307" height="138" fill="url(#'+uid+'-crystal)"/>'+
      label(458,393,spec.middleLabel));
    if(solar) {
      content += stage(0,label(216,133,b('入射光','Incident light'),'pl-energy-label'));
      content += path('photon-a','M188 158 L324 239','energy',0,'hν',2,2.9);
      content += path('photon-b','M266 138 L400 220','energy',0,'hν',2,3.2);
    } else {
      content += stage(0,slab(171,218,73,122)+
        '<rect x="180" y="229" width="55" height="99" rx="23" fill="#777876" fill-opacity=".2" stroke="#a8aaa7" stroke-opacity=".55"/>'+
        '<text x="207" y="288" text-anchor="middle" class="pl-source-symbol">β</text>'+
        label(207,393,b('密封源','Contained source')));
      content += path('decay-energy','M247 276 H355','energy',1,'β',2,3.5);
    }
    const pairs = [[396,260],[476,296],[552,255]];
    content += stage(1,pairs.map(([x,y])=>
      '<g class="pl-charge-pair"><path d="M '+(x-14)+' '+y+' H '+(x+14)+'" class="pl-pair-link"/>'+
      '<circle cx="'+(x-16)+'" cy="'+y+'" r="14" class="pl-particle-electron"/><text x="'+(x-16)+'" y="'+(y+5)+'" text-anchor="middle" class="pl-particle-text">e⁻</text>'+
      '<circle cx="'+(x+18)+'" cy="'+y+'" r="14" class="pl-particle-hole"/><text x="'+(x+18)+'" y="'+(y+5)+'" text-anchor="middle" class="pl-particle-text">h⁺</text></g>').join(''));
    content += stage(2,slab(304,184,309,14,'membrane')+slab(304,351,309,14,'rim')+
      label(697,190,b('e⁻ 接触','e⁻ contact'),'pl-contact-label')+
      label(697,362,b('h⁺ 接触','h⁺ contact'),'pl-contact-label'));
    if(spec.organic) content+=stage(2,'<path d="M444 211 q24 22 0 44 t0 44 t0 44" class="pl-interface"/>'+label(703,286,b('给 / 受体界面','D / A interface'),'pl-contact-label'));
    else if(!solar) content+=stage(2,'<rect x="446" y="208" width="29" height="136" class="pl-junction"/>'+label(700,286,b('结区','Junction'),'pl-contact-label'));
    content += path('separate-e','M400 263 Q365 234 345 192','electron',2,'e⁻',2,3);
    content += path('separate-h','M516 289 Q550 320 568 354','hole',2,'h⁺',2,3);
    content += stage(3,'<path class="pl-wire-shadow" d="M304 191 H282 V85 H676 V358 H613"/><path class="pl-wire" d="M304 191 H282 V85 H676 V358 H613"/>'+
      '<g class="pl-load"><rect x="433" y="65" width="72" height="40" rx="3"/><path d="M444 85 l6 -8 9 16 9 -16 9 16 8 -16 6 8"/></g>'+label(469,44,b('外部负载','External load'),'pl-load-label'));
    content += path('electrons','M304 191 H282 V85 H676 V358 H613','electron',3,'e⁻',4,6);
  } else {
    content += stage(0,slab(224,178,90,190)+
      '<rect x="237" y="192" width="62" height="159" rx="30" fill="#93908b" fill-opacity=".16" stroke="#b4b2ab" stroke-opacity=".6"/>'+
      '<path d="M251 210 V331 M270 210 V331 M287 210 V331" class="pl-source-lines"/>'+
      label(269,412,b('密封热源','Contained heat source')));
    content += stage(1,slab(405,178,22,190,'rim')+label(416,152,b('热端','Hot side'),'pl-temperature'));
    content += path('heat','M316 275 H402','energy',1,'Q',3,3.8);
    content += stage(1,label(357,244,b('热','Heat'),'pl-energy-label'));
    content += stage(2,slab(565,178,22,190,'rim')+
      Array.from({length:4},(_,i)=>{
        const y=190+i*43;
        return '<path d="M427 '+y+' H565 V'+(y+28)+' H427 Z" fill="url(#'+uid+'-absorber)" stroke="#8a9696" stroke-opacity=".55"/>'+
          '<path d="M443 '+(y+3)+' V'+(y+25)+' M463 '+(y+3)+' V'+(y+25)+' M484 '+(y+3)+' V'+(y+25)+' M505 '+(y+3)+' V'+(y+25)+' M526 '+(y+3)+' V'+(y+25)+' M547 '+(y+3)+' V'+(y+25)+'" class="pl-thermo-detail"/>';
      }).join('')+label(576,152,b('冷端','Cold side'),'pl-temperature')+label(496,412,b('热电组件','Thermoelectric elements'))+
      '<path d="M427 275 H565" class="pl-heat-through" marker-end="url(#'+uid+'-energy-arrow)"/>');
    content += stage(3,slab(616,185,22,176,'rim')+
      Array.from({length:6},(_,i)=>'<path d="M639 '+(190+i*28)+' l36 -9 v10 l-36 9 Z" fill="#515759" stroke="#a4acad" stroke-opacity=".45"/>').join('')+
      label(651,412,b('散热结构','Heat rejection')));
    content += path('waste-heat','M678 269 H738','energy',3,'Q',2,3);
    content += stage(3,'<path d="M441 189 V82 H548 V189" class="pl-wire-shadow"/><path d="M441 189 V82 H548 V189" class="pl-wire"/>'+
      '<g class="pl-load"><rect x="467" y="62" width="54" height="40" rx="3"/><path d="M475 82 l6 -8 9 16 9 -16 9 16 6 -8"/></g>'+label(494,40,b('外部负载','External load'),'pl-load-label'));
    content += path('electrons','M441 189 V82 H548 V189','electron',3,'e⁻',3,4.5);
  }
  return {
    html:'<svg class="pl-diagram" viewBox="120 0 660 470" role="img" aria-labelledby="'+uid+'-title '+uid+'-desc"><title id="'+uid+'-title"></title><desc id="'+uid+'-desc"></desc>'+defs+content+'</svg>',
    labels,tracks
  };
}

/** Mount one paused four-part lesson. Each instance owns and releases its listeners and RAF. */
export function createPathwayLesson(mount, {config, steps, onStep} = {}) {
  if(!mount || typeof mount.replaceChildren!=='function') throw new TypeError('A mount element is required.');
  const spec=pathwaySpec(config), sourceSteps=Array.isArray(steps)&&steps.length===4?steps:chargePathSteps(config);
  const uid='pathway-'+(++instance), graph=drawing(spec,uid);
  let index=0, elapsed=0, running=false, destroyed=false, frame=0, lastTime=null, phase=0;
  const reveals=new Set();
  const media=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)');
  let reduced=Boolean(media?.matches);
  const root=document.createElement('section');
  root.className='pathway-lesson';
  root.setAttribute('data-i18n-skip','');
  root.dataset.kind=spec.kind;
  root.dataset.profile=spec.profile;
  root.innerHTML='<div class="pl-stage-wrap">'+graph.html+'</div>'+
    '<div class="pl-reading" aria-live="polite" aria-atomic="true">'+
      '<div class="pl-reading-top"><span class="pl-step-count"></span><span class="pl-state"></span></div>'+
      '<h3 class="pl-title"></h3><p class="pl-explanation"></p><p class="pl-equation" dir="ltr"></p>'+
    '</div>'+
    '<div class="pl-timeline" role="group">'+[0,1,2,3].map(i=>'<button type="button" class="pl-segment" data-jump="'+i+'"><span class="pl-segment-line"><span></span></span><span class="pl-segment-number">0'+(i+1)+'</span></button>').join('')+'</div>'+
    '<div class="pl-controls"><button type="button" data-action="previous"></button><button type="button" class="pl-play" data-action="play"></button><button type="button" data-action="next"></button><button type="button" class="pl-restart" data-action="restart"></button></div>'+
    '<p class="pl-note"></p><details class="pl-references"><summary></summary><p class="pl-materials"></p><ul></ul></details>';
  mount.replaceChildren(root);
  const find=selector=>root.querySelector(selector);
  const title=find('.pl-title'), description=find('.pl-explanation'), equation=find('.pl-equation');
  const count=find('.pl-step-count'), status=find('.pl-state'), note=find('.pl-note');
  const previous=find('[data-action="previous"]'), play=find('[data-action="play"]'), next=find('[data-action="next"]'), restart=find('[data-action="restart"]');
  const segments=[...root.querySelectorAll('.pl-segment')];
  const stages=[...root.querySelectorAll('[data-stage]')];
  const paths=graph.tracks.map(track=>{
    const element=find('#'+uid+'-'+track.id), group=find('[data-particles="'+track.id+'"]');
    const length=element.getTotalLength();
    // Cache geometry once: animation never measures layout or path length per frame.
    const samples=Array.from({length:121},(_,i)=>element.getPointAtLength(length*i/120));
    const particles=Array.from({length:track.count},(_,i)=>{
      const particle=document.createElementNS('http://www.w3.org/2000/svg','g');
      const radius=track.symbol.length>3?24:track.symbol.length>2?20:16;
      particle.innerHTML=['H₂','O₂'].includes(track.symbol)
        ? '<path d="M-7 0 H7" class="pl-bond"/><circle cx="-7" r="7" class="'+(track.symbol==='H₂'?'pl-atom-h':'pl-atom-o')+'"/><circle cx="7" r="7" class="'+(track.symbol==='H₂'?'pl-atom-h':'pl-atom-o')+'"/>'
        : '<circle r="'+radius+'" class="pl-particle-'+track.type+'"/><text text-anchor="middle" y="5" class="pl-particle-text">'+xml(track.symbol)+'</text>';
      group.append(particle);
      return particle;
    });
    return {...track,samples,particles};
  });
  const translateTitle=i=>textOf(spec.steps[i].title);
  const setButton=(button,zh,en)=>{button.textContent=getLocale()==='en'?en:zh;};
  function updateProgress() {
    segments.forEach((button,i)=>{
      const fraction=i<index?1:i===index?elapsed/STAGE_MS:0;
      button.querySelector('.pl-segment-line > span').style.transform='scaleX('+fraction+')';
      button.dataset.current=String(i===index);
      button.dataset.visited=String(i<index);
      if(i===index)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');
    });
  }
  function renderParticles() {
    paths.forEach(track=>{
      if(track.start>index)return;
      track.particles.forEach((particle,i)=>{
        const position=((phase/(track.seconds*1000))+i/track.count+.16)%1;
        const sample=position*120, low=Math.floor(sample), high=Math.min(120,low+1), amount=sample-low;
        const a=track.samples[low], z=track.samples[high];
        particle.setAttribute('transform','translate('+(a.x+(z.x-a.x)*amount).toFixed(2)+' '+(a.y+(z.y-a.y)*amount).toFixed(2)+')');
      });
    });
  }
  function updateControls() {
    const focused=document.activeElement;
    previous.disabled=index===0;
    next.disabled=index===3;
    play.disabled=reduced || (index===3&&elapsed>=STAGE_MS);
    setButton(previous,'上一段','Previous');
    setButton(next,'下一段','Next');
    setButton(restart,'重新讲解','Restart');
    setButton(play,reduced?'手动分段':running?'暂停':index===3&&elapsed>=STAGE_MS?'讲解结束':'播放讲解',reduced?'Manual steps':running?'Pause':index===3&&elapsed>=STAGE_MS?'Finished':'Play lesson');
    play.setAttribute('aria-pressed',String(running));
    status.textContent=reduced?textOf(b('手动阅读','Manual reading')):running?textOf(b('播放中 · 每段 6.5 秒','Playing · 6.5 s per part')):index===3&&elapsed>=STAGE_MS?textOf(b('讲解结束','Lesson complete')):textOf(b('已暂停','Paused'));
    root.dataset.playing=String(running);
    // At an endpoint, move from the newly disabled control to the current part.
    if(root.contains(focused)&&focused.disabled)segments[index].focus({preventScroll:true});
  }
  function renderText() {
    root.lang=getLocale()==='en'?'en':'zh-CN';
    root.setAttribute('aria-label',textOf(b('电输出原理分段讲解','A step-by-step lesson in electrical output')));
    graph.labels.forEach(({id,copy})=>{find('[data-label="'+id+'"]').textContent=textOf(copy);});
    find('#'+uid+'-title').textContent=textOf(b('当前阶段的机制剖面','Mechanism cutaway for the current part'));
    find('#'+uid+'-desc').textContent=translateTitle(index)+'. '+textOf(spec.steps[index].body);
    title.textContent=translateTitle(index);
    description.textContent=textOf(spec.steps[index].body);
    equation.textContent=spec.steps[index].formula;
    equation.hidden=!spec.steps[index].formula;
    count.textContent=getLocale()==='en'?'Part '+(index+1)+' / 4':'第 '+(index+1)+' / 4 段';
    find('.pl-timeline').setAttribute('aria-label',textOf(b('讲解进度，可选择阶段','Lesson progress; choose a part')));
    segments.forEach((button,i)=>button.setAttribute('aria-label',getLocale()==='en'?'Go to part '+(i+1):'跳到第 '+(i+1)+' 段'));
    note.textContent=reduced?textOf(b('已减少动态效果，请手动切段。分段用于理解；实际过程同时进行，图中尺度与速度不代表实测。','Reduced motion is on; use the step controls. Parts explain concurrent processes; scale and speed are illustrative.')):textOf(b('分段用于理解；实际过程同时进行，图中尺度与速度不代表实测。','Parts explain concurrent processes; scale and speed are illustrative.'));
    find('.pl-references summary').textContent=textOf(b('所选材料与原理依据','Selected materials & mechanism references'));
    const materialIds=Object.values(spec.materials).filter(Boolean);
    find('.pl-materials').textContent=materialIds.map(id=>translate(materials[id]?.label||id)).join(' / ');
    const referenceIds=spec.kind==='fuel'?['doefuel','doeparts',...spec.sourceIds]:
      spec.kind==='photovoltaic'?['solar','solarstructure',...spec.sourceIds]:spec.sourceIds;
    const refs=[...new Set(referenceIds)].map(sourceById).filter(Boolean).slice(0,5);
    const list=find('.pl-references ul');
    list.replaceChildren(...refs.map(source=>{
      const item=document.createElement('li'),a=document.createElement('a');
      a.href=source.url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=translate(source.title);item.append(a);return item;
    }));
    updateControls();
  }
  function showStage(notify=true) {
    const arriving=[];
    stages.forEach(group=>{
      const visible=Number(group.dataset.stage)<=index;
      if(visible&&group.style.display==='none')arriving.push(group);
      group.style.display=visible?'':'none';
      group.setAttribute('aria-hidden',String(!visible));
    });
    // Once extraction is shown, pairs are replaced by the separate transport paths.
    root.querySelectorAll('.pl-charge-pair').forEach(pair=>pair.style.opacity=index>=2?'.28':'1');
    root.querySelectorAll('.pl-initial-reaction').forEach(group=>group.style.opacity=index>=1?'.25':'1');
    root.dataset.stage=String(index);
    root.dataset.roles=(sourceSteps[index]?.roles||[]).join(' ');
    renderText();
    updateProgress();
    renderParticles();
    if(!reduced)arriving.forEach((group,i)=>{
      if(typeof group.animate!=='function')return;
      const opacity=Number(group.style.opacity||1);
      const animation=group.animate([{opacity:0},{opacity}],{duration:650,delay:Math.min(i*45,180),easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'});
      reveals.add(animation);
      animation.finished.then(()=>reveals.delete(animation),()=>reveals.delete(animation));
    });
    if(notify&&!destroyed&&typeof onStep==='function')onStep(index);
  }
  function pause() {
    if(destroyed)return;
    running=false;
    if(frame)cancelAnimationFrame(frame);
    frame=0;lastTime=null;
    reveals.forEach(animation=>animation.cancel());
    reveals.clear();
    updateControls();
  }
  function tick(now) {
    frame=0;
    if(destroyed||!running)return;
    if(document.hidden){pause();return;}
    const delta=lastTime===null?0:Math.min(1000,Math.max(0,now-lastTime));
    lastTime=now;elapsed+=delta;phase+=delta;
    if(elapsed>=STAGE_MS) {
      if(index<3){index++;elapsed=0;showStage();}
      else{elapsed=STAGE_MS;updateProgress();renderParticles();pause();return;}
    }
    if(destroyed||!running)return;
    renderParticles();
    updateProgress();
    frame=requestAnimationFrame(tick);
  }
  function start() {
    if(destroyed||reduced||document.hidden||(index===3&&elapsed>=STAGE_MS))return;
    running=true;lastTime=null;updateControls();
    if(!frame)frame=requestAnimationFrame(tick);
  }
  function go(nextIndex) {
    if(destroyed)return;
    pause();
    index=Math.max(0,Math.min(3,nextIndex));elapsed=0;
    showStage();
  }
  function click(event) {
    const button=event.target.closest('button');
    if(!button||!root.contains(button)||button.disabled)return;
    if(button.hasAttribute('data-jump')){go(Number(button.dataset.jump));return;}
    switch(button.dataset.action){
      case 'previous':go(index-1);break;
      case 'next':go(index+1);break;
      case 'play':running?pause():start();break;
      case 'restart':phase=0;go(0);break;
    }
  }
  function visibility(){if(document.hidden)pause();}
  function language(){if(!destroyed)renderText();}
  function preference(event){if(destroyed)return;reduced=event.matches;pause();renderText();renderParticles();}
  root.addEventListener('click',click);
  document.addEventListener('visibilitychange',visibility);
  document.addEventListener('languagechange',language);
  if(media?.addEventListener)media.addEventListener('change',preference);
  else media?.addListener?.(preference);
  showStage();
  return {
    pause,
    destroy(){
      if(destroyed)return;
      pause();destroyed=true;
      root.removeEventListener('click',click);
      document.removeEventListener('visibilitychange',visibility);
      document.removeEventListener('languagechange',language);
      if(media?.removeEventListener)media.removeEventListener('change',preference);
      else media?.removeListener?.(preference);
      paths.forEach(track=>{track.particles.length=0;track.samples.length=0;});
      root.remove();
    }
  };
}

