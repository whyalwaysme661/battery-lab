import {readFile,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {materials,getSource} from '../dist/catalog.js';
const root=path.resolve(fileURLToPath(new URL('../dist/assets/materials/',import.meta.url)));
const specs=[];
const S=(id,type,title,zh,en,data={})=>specs.push({id,type,title,zh,en,...data});
const liquids=[
 ['carbonate','Li salt / carbonate','Li salt',['Carbonates'],null,'配方依具体来源','Formulation-specific'],
 ['sodiumliquid','Na salt / organic','Na salt',['Organic solvent'],null,'钠盐与有机溶剂','Sodium salt and organic solvent'],
 ['primaryorganic','Primary Li / organic','Li salt',['Organic solvent','Primary Li'],null,'一次锂专用配方，盐与比例依型号','Primary-lithium formulation; salt and ratios are model-specific'],
 ['fes2electrolyte','Li / FeS₂','Li salt',['Organic solvent','FeS₂'],null,'Li/FeS₂ 专用电解液，配方依型号','Li/FeS2 electrolyte; formulation is model-specific'],
 ['lipf6_ecemc_volume','LiPF₆ / EC / EMC','1.2 M LiPF₆',['EC','EMC'],[3,7],'3:7 · 体积比','3:7 · volume ratio'],
 ['lipf6_ecemc_mass','Gen2 / EC / EMC','1.2 M LiPF₆',['EC','EMC'],[3,7],'3:7 · 质量比','3:7 · mass ratio'],
 ['naclo4_ecpc','NaClO₄ / EC / PC','1 M NaClO₄',['EC','PC'],[1,1],'1:1 · 体积比','1:1 · volume ratio'],
 ['napf6_diglyme','NaPF₆ / diglyme','1 M NaPF₆',['Diglyme'],null,'二甘醚路线','Diglyme solvent route'],
 ['na_ems','NaPF₆ / EMS / FEC','0.5 M NaPF₆',['EMS','FEC'],[98,2],'98:2 · 体积比','98:2 · volume ratio'],
 ['nabob_tep','NaBOB / TEP','0.35 M NaBOB',['TEP'],null,'无 PES 的对照配方','Control formulation without PES'],
 ['nabob_tep_pes','NaBOB / TEP + PES','0.35 M NaBOB',['TEP','PES'],null,'PES · 3 wt%','PES · 3 wt%'],
 ['lhce_dmc_tte','LHCE1 / DMC','LiFSI',['LiFSI','DMC','TTE'],[1,2.2,3],'1:2.2:3 · 摩尔比','1:2.2:3 · molar ratio'],
 ['lhce_tms_tte','LHCE2 / TMS','LiFSI',['LiFSI','TMS','TTE'],[1,3,3],'1:3:3 · 摩尔比','1:3:3 · molar ratio'],
 ['naclo4_ecdec_fec','NaClO₄ / EC / DEC','1 M NaClO₄',['EC','DEC','FEC'],null,'EC:DEC 1:1 体积比 · 另加 5% FEC','EC:DEC 1:1 by volume · 5% FEC additive']
];
for(const [id,title,salt,components,values,zh,en] of liquids)S(id,'liquid',title,zh,en,{salt,components,values});
S('pfsa','polymer','PFSA / H⁺','磺酸基团与质子传导通道','Sulfonic-acid groups and proton-conducting channels',{mode:'pfsa',labels:['PFSA','SO₃⁻','H⁺']});
S('polymer','polymer','PEO / Li salt','聚醚链与锂离子配位','Polyether chains and lithium-ion coordination',{mode:'linear',labels:['PEO','O','Li⁺']});
S('fse_planar','polymer','f-SE / PEGDA / LLZTO','平面复合膜，保留 LLZTO 填料','Planar composite membrane retaining LLZTO filler',{mode:'filled',labels:['PEGDA','LLZTO','LiTFSI']});
S('pegda_litfsi_unfilled','polymer','PEGDA / LiTFSI','交联聚合物，无 LLZTO 陶瓷填料','Crosslinked polymer without LLZTO ceramic filler',{mode:'network',labels:['PEGDA','LiTFSI']});
S('gel_pe_control','polymer','PE / PVDF-HFP / ETPTA','交联凝胶对照，不含 PAN 与 LLZTO','Crosslinked gel control without PAN or LLZTO',{mode:'network',labels:['PVDF-HFP','ETPTA','LiClO₄']});
S('gel_ppe_control','polymer','PPE / PVDF-HFP / PAN','双聚合物凝胶，仍不含 LLZTO','Dual-polymer gel, still without LLZTO',{mode:'dual',labels:['PVDF-HFP','PAN','ETPTA','LiClO₄']});
for(const [id,title,zh,en,mode,labels] of [
 ['sulfide','Li₆PS₅Cl','硫化物电解质，含 P/S/Cl 的固态相','Sulfide electrolyte containing P/S/Cl solid phases','sulfide',['Li⁺','P / S','Cl']],
 ['lzc','Li₂ZrCl₆','氯化物电解质，与硫化物和氧化物区分','Chloride electrolyte, distinct from sulfides and oxides','halide',['Li⁺','Zr / Cl']],
 ['ysz','YSZ / O²⁻','氧化锆基陶瓷，氧离子与空位传输','Zirconia-based ceramic with oxide-ion/vacancy transport','oxide',['ZrO₂ + Y₂O₃','O²⁻']],
 ['gdc10','Gd₀.₁Ce₀.₉O₁.₉₅','钆掺杂氧化铈，与 YSZ 的母相不同','Gadolinium-doped ceria, with a different host phase from YSZ','oxide',['CeO₂ + Gd','O²⁻']]
])S(id,'solid',title,zh,en,{mode,labels});
S('hnse_lzcf_lpscl','stack','HNSE / LPSCl / Li–In','氟取代卤化物复合正极相，保留独立 LPSCl 隔离层','Fluorinated halide cathode-composite phase with a separate LPSCl separator',{layers:['S-NCM88 + ZrO₂–Li₂ZrCl₅F','Li₆PS₅Cl','Li–In'],active:[0,1]});
for(const [id,title,zh,en,mode] of [
 ['na_o3','O3 / Na layered oxide','O 型钠配位，三层堆垛的分类示意','O-type sodium coordination; three-layer stacking classification','O3'],
 ['na_p2','P2 / Na layered oxide','P 型钠配位，两层堆垛的分类示意','P-type sodium coordination; two-layer stacking classification','P2']
])S(id,'layered',title,zh,en,{mode});
S('nmc111','composition','NMC111 / Ni : Mn : Co','Ni:Mn:Co = 1:1:1 的组成区别','Composition distinction: Ni:Mn:Co = 1:1:1',{components:['Ni','Mn','Co'],values:[1,1,1]});
S('nmc532','composition','NMC532 / Ni : Mn : Co','Ni:Mn:Co = 5:3:2 的组成区别','Composition distinction: Ni:Mn:Co = 5:3:2',{components:['Ni','Mn','Co'],values:[5,3,2]});
S('ncm88_single','particle','S-NCM88 / single crystal','单晶颗粒与多晶团聚体区分','Single-crystal particles distinguished from polycrystalline aggregates',{mode:'single',labels:['Ni₀.₈₈Co₀.₁₁Mn₀.₀₁']});
S('na_rahc','particle','RAHC / radial gradient','径向柱状组织与中心至表面的成分梯度','Radially aligned columnar organization and a center-to-surface composition gradient',{mode:'radial',labels:['NaNi₀.₆₀Co₀.₀₅Mn₀.₃₅O₂']});
S('na_bulk_ncm','particle','O3 / homogeneous control','同平均组成，均匀成分的对照颗粒','A homogeneous-composition control with the same average composition',{mode:'bulk',labels:['NaNi₀.₆₀Co₀.₀₅Mn₀.₃₅O₂']});
S('prussianwhite','framework','Prussian white / Fe–CN–Fe','铁基氰桥框架，与层状氧化物区分','Iron-based cyanide-bridged framework, distinct from layered oxides',{labels:['Fe','C≡N','Fe'],mode:'cube'});
S('vhcf_aqzn','framework','VHCF / V–CN–Fe','钒基氰桥正极，属于水系锌研究配对','Vanadium-based cyanide-bridged cathode in an aqueous-zinc research pairing',{labels:['V','C≡N','Fe'],mode:'cube'});
S('nvpf','framework','NVPF / C','含氟磷酸盐框架与导电碳复合','Fluorophosphate framework combined with conducting carbon',{labels:['V','PO₄ / F','Na'],mode:'phosphate'});
S('lmo','framework','LiMn₂O₄ / spinel','尖晶石三维框架，与层状三元正极区分','Three-dimensional spinel framework, distinct from layered NMC cathodes',{labels:['Mn–O','Li⁺'],mode:'spinel'});
S('niooh_research','reaction','NiOOH / Ni(OH)₂','镍正极的充电态与放电态反应','Charged and discharged nickel-positive-electrode reaction',{left:'NiOOH + H₂O + e⁻',right:'Ni(OH)₂ + OH⁻'});
S('nvp_dry_oxalate','fibers','Dry NVP / Na₂C₂O₄','NVP、碳纤维、PTFE 与牺牲补钠组分','NVP, carbon fiber, PTFE and a sacrificial sodium-supplementation component',{labels:['NVP','Carbon fiber','PTFE','Na₂C₂O₄'],mode:'cathode'});
S('mcmb','particle','MCMB / graphite spheres','球形石墨化碳路线','Spherical graphitized-carbon route',{mode:'spheres',labels:['MCMB']});
S('hc_sucrose_spheres','particle','HCMS / hard carbon','球形硬碳与超微孔的定性示意','Qualitative illustration of spherical hard carbon and ultramicropores',{mode:'pores',labels:['HCMS']});
S('hc_presodiated_rahc','reaction','Hard carbon / pre-sodiation','补充钠库存的负极，与未经处理硬碳区分','A sodium-inventory-supplemented anode, distinguished from untreated hard carbon',{left:'Hard carbon + Na',right:'Pre-sodiated HC'});
S('hc_dry_ptfe','fibers','HC / VGCF / PTFE','95:3:2 质量比的干法复合负极','Dry-processed composite anode at a 95:3:2 mass ratio',{labels:['Hard carbon · 95','VGCF · 3','PTFE · 2'],mode:'anode'});
for(const [id,title,zh,en,labels] of [
 ['afccathode','AFC / oxygen electrode','碱性氧侧催化与气体传输','Alkaline oxygen-side catalysis and gas transport',['O₂','Catalyst','OH⁻']],
 ['afcanode','AFC / fuel electrode','碱性燃料侧氢反应，与氧侧区分','Alkaline fuel-side hydrogen reaction, distinguished from the oxygen side',['H₂','Catalyst','OH⁻']],
 ['air','Air electrode / carbon','空气中的氧参与催化碳电极反应','Oxygen from air participates in the catalytic carbon-electrode reaction',['Air / O₂','Carbon catalyst','Electrolyte']],
 ['air_carbon_diffusion','Air electrode / GDL','空气分配、催化与电解液接触分层','Separate air-distribution, catalysis and electrolyte-contact functions',['Air distribution','Catalytic carbon','Electrolyte contact']]
])S(id,'gas',title,zh,en,{labels});
for(const [id,title,count,zh,en] of [['alloy','AB₅ / AB₂',null,'两类储氢合金的组成分类','Composition classes of two hydrogen-storage-alloy families'],['alloy_ab5','AB₅',5,'A:B = 1:5 的合金类别','Alloy class with A:B = 1:5'],['alloy_ab2','AB₂',2,'A:B = 1:2 的合金类别','Alloy class with A:B = 1:2']])S(id,'alloy',title,zh,en,{count});
const stacks=[
 ['amorphous_si','a-Si:H / p–i–n',['p-a-Si:H','i-a-Si:H','n-a-Si:H'],[0,1,2],'非晶硅的 p–i–n 功能分层示意','Functional p–i–n layer grouping in amorphous silicon'],
 ['cdte','CdTe / absorber',['Window','CdTe','Back contact'],[1],'CdTe 为 II–VI 吸光半导体，不是非晶硅','CdTe is a II–VI absorber semiconductor, rather than amorphous silicon'],
 ['pv_perovskite','Perovskite / ABX₃',['Electron transport','ABX₃','Hole transport'],[1],'钙钛矿吸光相与载流子选择层','Perovskite absorber and carrier-selective layers'],
 ['si_contact','c-Si / metal grid',['Metal grid','c-Si junction','Back contact'],[0,2],'金属栅线引出电流，硅结位于内部','Metal grids collect current from the silicon junction'],
 ['tco_contact','TCO / transparent contact',['Light','TCO','Absorber','Back contact'],[1,3],'透明导电前接触与背接触分别承担引出功能','Transparent front and back contacts provide separate collection functions'],
 ['transport','Carrier-selective layers',['Electron transport','Absorber','Hole transport'],[0,2],'电子与空穴传输层具有不同选择性','Electron- and hole-transport layers have different selectivities'],
 ['organic_contact','OPV / selective contacts',['Front contact','Hole-selective','Organic absorber','Electron-selective','Back contact'],[1,3],'有机器件两侧的选择性接触','Carrier-selective contacts on either side of an organic absorber'],
 ['iiiv_contact','III–V / junction contacts',['Front contact','III–V junction','Back contact'],[0,2],'III–V 半导体结的接触功能，不指定未核验的掺杂层','Contact functions of a III–V junction without asserting unverified doped layers'],
 ['passivation','c-Si / passivation',['Antireflection','Passivation','c-Si'],[0,1],'减反与表面钝化是不同的功能','Antireflection and surface passivation serve different functions'],
 ['pv_buffer','Window / buffer',['TCO','Window','Buffer','Absorber'],[1,2],'窗口与缓冲层区别于吸光层和接触层','Window/buffer functions are distinct from absorber and contact functions'],
 ['lipon','LiPON / thin film',['Cathode','LiPON','Li'],[1],'LiPON 是薄膜离子隔离层，不是厚陶瓷压片','LiPON is a thin-film ion-conducting separator, rather than a thick ceramic pellet'],
 ['pv_mapbi3','MAPbI₃',['Selective contact','MAPbI₃','Selective contact'],[1],'CH₃NH₃PbI₃ 吸光相，不与 FAPbI₃ 混用','CH3NH3PbI3 absorber, distinguished from FAPbI3'],
 ['pv_niox_ptaa_pcbm_zno','MAPbI₃ / p–i–n',['ITO','NiOₓ / PTAA','MAPbI₃','PCBM / ZnO','Al'],[1,3],'NiOₓ/PTAA 与 PCBM/ZnO 是完整配对的两侧接触','NiOx/PTAA and PCBM/ZnO are the two contacts in a complete paired stack'],
 ['lmo_crystalline_film','Crystalline LMO / LiPON',['Crystalline LiMn₂O₄','LiPON','Li'],[0],'结晶锰酸锂沉积膜，与粉末涂布正极区分','A deposited crystalline LMO film, distinguished from a powder-coated cathode'],
 ['lmo_amorphous_film','Amorphous LMO / LiPON',['Amorphous LiMn₂O₄','LiPON','Li'],[0],'非晶锰酸锂沉积膜，不继承结晶膜性能','A deposited amorphous LMO film that does not inherit crystalline-film performance'],
 ['si_topcon_contacts','TOPCon / selective contacts',['ITO / metal','p⁺ poly-Si','SiOₓ','n-c-Si','SiOₓ','n⁺ poly-Si','ITO / metal'],[1,5],'前 p⁺ 与后 n⁺ 多晶硅接触，不含钙钛矿顶电池','Front p+ and rear n+ poly-Si contacts without a perovskite top cell'],
 ['si_tunnel_oxide','TOPCon / SiOₓ',['p⁺ poly-Si','SiOₓ','n-c-Si','SiOₓ','n⁺ poly-Si'],[1,3],'超薄 SiOₓ 与多晶硅共同构成选择性接触','Ultrathin SiOx and poly-Si jointly form selective contacts'],
 ['cdsete_contacts','Cd(Se,Te) / contacts',['FTO','Cd(Se,Te)','CuSCN','Au'],[0,2,3],'前侧 FTO 与后侧 CuSCN/Au 接触','Front FTO and rear CuSCN/Au contacts'],
 ['cdos_window','Cd(O,S) / precursor',['FTO','Cd(O,S)','CdSe:O precursor'],[1],'Cd(O,S) 是退火前的窗口前驱层，退火后形成互混区域','Cd(O,S) is a pre-anneal window precursor; annealing forms an intermixed region'],
 ['pv_sno2_spiro_control','FAPbI₃ / control contacts',['FTO','SnO₂','FAPbI₃','PEAI','Spiro','Au'],[1,3,4],'SnO₂/PEAI/Spiro 对照，不含 DTPA/Zol','SnO2/PEAI/Spiro control without DTPA/Zol'],
 ['opv_pedot_pndit_contacts','OPV / PEDOT:PSS / PNDIT-F3N',['ITO','PEDOT:PSS','Organic blend','PNDIT-F3N','Ag'],[1,3],'给受体混合层两侧的不同接触，不含液态电解质','Different contacts around a donor-acceptor blend, without liquid electrolyte'],
 ['iii_v_inverted_tandem','GaInP / GaAs / InGaAs',['GaInP','Tunnel junction','GaAs','Tunnel / buffer','InGaAs'],[0,2,4],'倒置三结与变晶缓冲层的功能分组','Functional grouping of an inverted triple junction and metamorphic buffer'],
 ['tandem_iiiv_contacts','III–V / tunnel contacts',['GaInP','AlGaAs / GaAs','GaAs','Tunnel / buffer','InGaAs','Metal contact'],[1,3,5],'串联子结的隧道结与外部金属接触承担不同连接功能','Tunnel junctions connect subcells in series; metal contacts connect externally']
];
for(const [id,title,layers,active,zh,en] of stacks)S(id,'stack',title,zh,en,{layers,active});
S('opv','blend','OPV / donor : acceptor','有机给体与受体的混合吸光层','Mixed organic donor and acceptor absorber',{labels:['Donor','Acceptor']});
S('opv_pm6_y6','blend','PM6 : Y6','PM6 给体与 Y6 非富勒烯受体的二元混合','Binary blend of PM6 donor and Y6 non-fullerene acceptor',{labels:['PM6','Y6']});
for(const [id,title,labels,zh,en] of [
 ['thermo','Thermoelectric converter',['p-type','n-type'],'热端至冷端的热电转换功能','Thermoelectric conversion between hot and cold ends'],
 ['te_sige','SiGe / thermocouples',['p-SiGe','n-SiGe'],'硅锗热电路线，不套用铅碲/TAGS 参数','Silicon-germanium thermoelectric route without PbTe/TAGS parameters'],
 ['te_pbte_tags','PbTe / TAGS',['TAGS','PbTe'],'TAGS 与铅碲组成的热电材料组','Thermoelectric material grouping of TAGS and lead telluride']
])S(id,'thermo',title,zh,en,{labels});
for(const [id,title,components,values,zh,en] of [
 ['molten','Carbonates / LiAlO₂',['Carbonates','LiAlO₂'],null,'熔体由多孔 LiAlO₂ 基体固定','Molten carbonate retained in a porous LiAlO2 matrix'],
 ['mcfc_lik','Li₂CO₃ : K₂CO₃',['Li₂CO₃','K₂CO₃'],[62,38],'62:38 mol% · LiAlO₂ 基体','62:38 mol% · LiAlO2 matrix'],
 ['mcfc_lina','Li₂CO₃ : Na₂CO₃',['Li₂CO₃','Na₂CO₃'],[60,40],'60:40 mol% · LiAlO₂ 基体','60:40 mol% · LiAlO2 matrix']
])S(id,'composition',title,zh,en,{components,values});
S('lsm','solid','LSM / oxygen electrode','锰基钙钛矿氧电极，与 LSCF 区分','Manganite-based perovskite oxygen electrode, distinguished from LSCF',{mode:'manganite',labels:['La / Sr','Mn / O']});
S('lscf','solid','LSCF / oxygen electrode','钴铁基混合导体，与 LSM 的组成不同','Cobalt-ferrite mixed conductor with a different composition from LSM',{mode:'mixed',labels:['La / Sr','Co / Fe / O']});
S('ysz_gdc_barrier','stack','SOFC / YSZ + GDC',['YSZ 电解质与独立 GDC 阻挡层'][0],'YSZ electrolyte and a separate GDC barrier layer',{layers:['Ni–YSZ','YSZ','GDC','LSCF'],active:[1,2]});
S('cfx','framework','CFₓ / carbon fluoride','碳与氟的组成示意，x 随产品与工艺变化','Carbon/fluorine composition schematic; x varies with product and processing',{labels:['C','F'],mode:'fluorocarbon'});
S('cfx_coin_disc','stack','BR coin / CFₓ disc','CFₓ 片状正极与锂负极组成纽扣结构','A disc-shaped CFx cathode and lithium anode in a coin-cell structure',{layers:['CFₓ composite disc','Separator / electrolyte','Li'],active:[0]});

// A raw ingredient photograph cannot distinguish a formulated electrode or a functional layer.
const ingredientOverrides=new Set();
const C=(id,type,title,zh,en,data={})=>{ingredientOverrides.add(id);S(id,type,title,zh,en,data);};
C('graphite_pvdf_hv','coating','Graphite / PVDF / Cu','天然石墨与 PVDF 90:10 质量比，承载于铜箔','Natural graphite and PVDF at 90:10 by mass, coated on copper foil',{labels:['Graphite · 90','PVDF · 10','Cu foil'],mode:'graphite'});
C('lifsi_dmc_11','liquid','LiFSI : DMC / 1:1.1','1:1.1 · 盐与溶剂摩尔比','1:1.1 · salt-to-solvent molar ratio',{salt:'LiFSI (LiFSA)',components:['LiFSI','DMC'],values:[1,1.1]});
C('fes2_al_foil','wound','Li / FeS₂ / Al','FeS₂ 复合涂层由铝箔承载，并与锂负极卷绕','FeS2 composite coating on aluminum foil wound with a lithium anode',{labels:['FeS₂ / Al','Separator','Li']});
C('mno2_wound_primary','wound','CR / MnO₂ / Li','卷绕正负极的 CR 圆柱结构，不是可充电电池','Wound positive and negative electrodes in a primary CR cylindrical cell',{labels:['MnO₂','Separator','Li']});
C('emd_graphite_ring','ring','EMD / graphite ring','环状 MnO₂/石墨正极围绕隔膜与锌凝胶','An annular MnO2/graphite cathode surrounds the separator and zinc gel',{labels:['MnO₂ + graphite','Separator','Zn gel']});
C('zinc_alloy_can','can','Zn alloy / container','锌合金壳同时作为负极和容器，合金配方依厂家','The zinc-alloy can serves as both anode and container; alloy composition is manufacturer-specific',{labels:['Zn alloy can','Paste / cathode']});
C('zinc_powder_gel','dispersion','Zn particles / alkaline gel','锌粉分散在碱性凝胶中，粒度与配比未在图中指定','Zinc particles dispersed in alkaline gel; particle size and proportions are not asserted',{labels:['Zn particles','Alkaline gel']});
for(const [id,title,salt,components,zh,en] of [
 ['znso4_c3n4qd','ZnSO₄ + C₃N₄ QDs','H₂O',['2 M ZnSO₄','C₃N₄ QDs'],'添加剂浓度是研究变量，不绘制假定配比','Additive concentration is a research variable; no assumed ratio'],
 ['znna_sulfate_11','Zn / Na sulfate / 1+1 M','H₂O',['1 M ZnSO₄','1 M Na₂SO₄'],'两种盐的浓度分别为 1 M，不是体积混合比','Each salt is 1 M; this is not a liquid-mixing volume ratio'],
 ['znna_sulfate_21','Zn / Na sulfate / 2+1 M','H₂O',['2 M ZnSO₄','1 M Na₂SO₄'],'盐浓度分别为 2 M 与 1 M，限定 VHCF 配对','Salt concentrations of 2 M and 1 M, limited to the VHCF pairing'],
 ['znso4_2m_control','ZnSO₄ / control','H₂O',['2 M ZnSO₄'],'不含 C₃N₄ 量子点的对照水溶液','Control aqueous solution without C3N4 quantum dots'],
 ['koh_lioh_nizn','KOH / LiOH','H₂O',['6 M KOH','1 M LiOH'],'负极侧另含 10 wt% Ca(OH)₂ 条件，见原文','Additional 10 wt% Ca(OH)2 on the anode side; see source'],
 ['koh_zno_nizn','KOH / ZnO saturated','H₂O',['9 M KOH','ZnO saturated'],'ZnO 饱和碱液，与 KOH/LiOH 配方分开','ZnO-saturated alkaline solution, separate from KOH/LiOH']
])C(id,'liquid',title,zh,en,{salt,components,values:null});
for(const [id,title,mode,labels,zh,en] of [
 ['raney_ni_afc','Raney Ni / porous','metal',['Raney Ni','Gas pores'],'多孔镍燃料电极，属于历史碱性燃料电池设计','Porous nickel fuel electrode from a historical alkaline-fuel-cell design'],
 ['nickelmetal','MCFC / porous Ni','metal',['Ni','Gas pores'],'多孔镍燃料电极的结构分类，不指定合金配比','Structural class of a porous nickel fuel electrode; no alloy ratio asserted'],
 ['ni_cr_mcfc','MCFC / Ni–Cr','alloy',['Ni–Cr','Gas pores'],'镍铬多孔骨架，孔隙与合金比例均为定性','Porous nickel-chromium framework; pores and alloy ratio are qualitative'],
 ['ni_al_mcfc','MCFC / Ni–Al','alloy',['Ni–Al','Gas pores'],'镍铝多孔骨架，与镍铬的合金成分不同','Porous nickel-aluminum framework with a different alloy component from Ni–Cr'],
 ['niysz','SOFC / Ni–YSZ','cermet',['Ni','YSZ','Gas pores'],'镍相与 YSZ 陶瓷相共同形成多孔金属陶瓷','Nickel and YSZ ceramic phases form a porous cermet'],
 ['ni_gdc','SOFC / Ni–GDC','cermet',['Ni','GDC','Gas pores'],'镍相与 GDC 陶瓷相，限定原研究氢气/空气工况','Nickel and GDC ceramic phases, within the source hydrogen/air conditions']
])C(id,'porous',title,zh,en,{mode,labels});
C('ni_gdc_afl','stack','Ni–GDC / support + AFL','多孔支撑和纳米复合阳极功能层分开表示','Porous support and nanocomposite anode functional layer shown separately',{layers:['Ni–GDC support','Ni–GDC AFL','GDC10','BSCF–GDC fiber'],active:[0,1]});
for(const [id,title,mode,labels,zh,en] of [
 ['ptc','Pt / C','supported',['Pt','Carbon support'],'铂颗粒分散于碳载体，不用块状铂代表复合电极','Platinum particles dispersed on carbon; bulk platinum is not the composite electrode'],
 ['ptblack_ptfe_pafc','PAFC / Pt black / PTFE','black',['Pt black','PTFE'],'无碳载体的 Pt 黑与 PTFE，属于历史 PAFC 设计','Unsupported platinum black with PTFE from historical PAFC design'],
 ['ptc_ptfe_pafc','PAFC / Pt–C / PTFE','ptfe',['Pt','Carbon support','PTFE'],'碳载铂与 PTFE，与无碳载体 Pt 黑区分','Carbon-supported platinum with PTFE, distinguished from unsupported Pt black'],
 ['ptalloy','Pt alloy / C','alloy',['Pt alloy','Carbon support'],'铂合金载于碳，第二金属与比例依具体配方','Carbon-supported platinum alloy; second metal and ratio are formulation-specific'],
 ['ptc_pfsa_layer','PEM / Pt–C / PFSA','ionomer',['Pt','Carbon support','PFSA ionomer'],'碳载铂与质子传导离聚物，膜与扩散层为独立部件','Carbon-supported platinum and proton-conducting ionomer; membrane and GDL remain separate']
])C(id,'catalyst',title,zh,en,{mode,labels});
C('phosphoric','matrix','PAFC / H₃PO₄ / SiC','多孔 SiC 基体固定磷酸，与半导体 SiC 原料区分','Phosphoric acid retained in porous SiC, distinguished from semiconductor SiC feedstock',{mode:'acid',labels:['SiC matrix','H₃PO₄']});
C('pv_sno2_spiro','stack','Spray-coated / selective contacts','喷涂 n–i–p 器件，np-SnO₂ 与掺杂 Spiro 位于吸光层两侧','Spray-coated n–i–p device with np-SnO2 and doped Spiro on opposite sides of the absorber',{layers:['ITO','np-SnO₂','Triple-cation absorber','Doped Spiro','Au'],active:[1,3]});
C('pbo2_tubular','tubular','PbO₂ / tubular positive','耐酸套管约束 PbO₂ 活性物质，内部含导电骨架','Acid-resistant gauntlets confine PbO2 active material around conducting spines',{labels:['Gauntlet','PbO₂','Conducting spine']});
C('pb_pasted_flat','grid','Pb / pasted flat negative','板栅与涂膏活性物质构成平板负极','Grid and pasted active material form a flat negative electrode',{labels:['Grid','Active Pb']});
C('acidagm','matrix','H₂SO₄ / AGM','硫酸吸附于玻璃纤维隔板，与胶体固定化区分','Sulfuric acid absorbed in a glass-fiber separator, distinguished from gel immobilization',{mode:'fiber',labels:['Glass fiber','H₂SO₄']});
C('acidgel','matrix','H₂SO₄ / gel','硫酸由胶体固定，网络仅表示固定化方式','Gel-immobilized sulfuric acid; the network illustrates retention only',{mode:'gel',labels:['Gel network','H₂SO₄']});
C('nanosilicon_p84','coating','Si / C45 / P84','80:10:10 质量比的复合电极，非晶硅晶片照片','Composite electrode at 80:10:10 by mass, rather than a silicon-wafer photograph',{mode:'silicon',labels:['Si · 80','C45 · 10','P84 · 10']});
C('ag2o_graphite','dispersion','Ag₂O / graphite','氧化银与石墨导电组分，不指定未核验配比','Silver oxide with conducting graphite; no unverified proportion asserted',{mode:'silver',labels:['Ag₂O','Graphite']});

const labelZh={'Li salt / carbonate':'锂盐 / 碳酸酯','Na salt / organic':'钠盐 / 有机溶剂','Primary Li / organic':'一次锂 / 有机电解液','Prussian white / Fe–CN–Fe':'普鲁士白 / Fe–CN–Fe','Hard carbon / pre-sodiation':'硬碳 / 预钠化','Dry NVP / Na₂C₂O₄':'干法 NVP / Na₂C₂O₄','AFC / oxygen electrode':'AFC / 氧侧电极','AFC / fuel electrode':'AFC / 燃料侧电极','Air electrode / carbon':'空气电极 / 催化碳','Air electrode / GDL':'空气电极 / 扩散层','c-Si / metal grid':'晶硅 / 金属栅','TCO / transparent contact':'TCO / 透明接触','Carrier-selective layers':'载流子选择层','c-Si / passivation':'晶硅 / 钝化','Window / buffer':'窗口层 / 缓冲层','LiPON / thin film':'LiPON / 薄膜','TOPCon / selective contacts':'TOPCon / 选择性接触','FAPbI₃ / control contacts':'FAPbI₃ / 对照接触','Cd(O,S) / precursor':'Cd(O,S) / 前驱层','III–V / tunnel contacts':'III–V / 隧道结接触','Thermoelectric converter':'热电转换组件','Carbonates / LiAlO₂':'碳酸盐 / LiAlO₂','LSM / oxygen electrode':'LSM / 氧电极','LSCF / oxygen electrode':'LSCF / 氧电极','BR coin / CFₓ disc':'BR 纽扣 / CFₓ 正极片','Crystalline LMO / LiPON':'晶态 LMO / LiPON','Amorphous LMO / LiPON':'非晶态 LMO / LiPON','Carbonates':'碳酸酯','Organic solvent':'有机溶剂','Primary Li':'一次锂','Li salt':'锂盐','Na salt':'钠盐','Metal grid':'金属栅','Back contact':'背接触','Front contact':'前接触','c-Si junction':'晶硅结','Light':'入射光','Absorber':'吸光层','Selective contact':'选择性接触','Electron transport':'电子传输层','Hole transport':'空穴传输层','Hole-selective':'空穴选择层','Electron-selective':'电子选择层','Organic absorber':'有机吸光层','III–V junction':'III–V 半导体结','Antireflection':'减反层','Passivation':'钝化层','Window':'窗口层','Buffer':'缓冲层','Cathode':'正极','Crystalline LiMn₂O₄':'晶态 LiMn₂O₄','Amorphous LiMn₂O₄':'非晶态 LiMn₂O₄','Organic blend':'有机混合层','Tunnel junction':'隧道结','Tunnel / buffer':'隧道结 / 缓冲层','Metal contact':'金属接触','CFₓ composite disc':'CFₓ 复合正极片','Separator / electrolyte':'隔离层 / 电解质','Carbon fiber':'碳纤维','Hard carbon · 95':'硬碳 · 95','Hard carbon + Na':'硬碳 + Na','Pre-sodiated HC':'预钠化硬碳','Air / O₂':'空气 / O₂','Catalyst':'催化层','Carbon catalyst':'催化碳','Electrolyte':'电解质','Air distribution':'空气分配','Catalytic carbon':'催化碳','Electrolyte contact':'电解液接触','Donor':'给体','Acceptor':'受体','p-type':'p 型','n-type':'n 型','CdSe:O precursor':'CdSe:O 前驱层'};
Object.assign(labelZh,{'Graphite · 90':'石墨 · 90','Cu foil':'铜箔','Separator':'隔膜','MnO₂ + graphite':'MnO₂ + 石墨','Zn gel':'锌凝胶','Zn alloy can':'锌合金壳','Paste / cathode':'电解质糊 / 正极','Zn particles':'锌颗粒','Alkaline gel':'碱性凝胶','ZnO saturated':'ZnO 饱和','Gas pores':'气体孔隙','Carbon support':'碳载体','Pt black':'Pt 黑','PFSA ionomer':'PFSA 离聚物','SiC matrix':'SiC 基体','Ni–GDC support':'Ni–GDC 支撑','Ni–GDC AFL':'Ni–GDC 功能层','BSCF–GDC fiber':'BSCF–GDC 纤维','Triple-cation absorber':'三阳离子吸光层','Doped Spiro':'掺杂 Spiro','Gauntlet':'耐酸套管','Conducting spine':'导电骨架','Grid':'板栅','Active Pb':'活性铅','Glass fiber':'玻璃纤维','Gel network':'胶体网络','Graphite':'石墨','Zn particles / alkaline gel':'锌颗粒 / 碱性凝胶','Graphite / PVDF / Cu':'石墨 / PVDF / 铜箔','Zn alloy / container':'锌合金壳 / 负极','EMD / graphite ring':'EMD / 石墨环','CR / MnO₂ / Li':'CR / MnO₂ / 锂','Raney Ni / porous':'Raney 镍 / 多孔','MCFC / porous Ni':'MCFC / 多孔镍','Ni–GDC / support + AFL':'Ni–GDC / 支撑与功能层','Spray-coated / selective contacts':'喷涂器件 / 选择性接触','PbO₂ / tubular positive':'PbO₂ / 管式正极','Pb / pasted flat negative':'铅 / 涂膏平板负极','H₂SO₄ / gel':'H₂SO₄ / 胶体','KOH / ZnO saturated':'KOH / ZnO 饱和','ZnSO₄ / control':'ZnSO₄ / 无添加剂对照','Zn / Na sulfate / 1+1 M':'锌 / 钠硫酸盐 · 1+1 M','Zn / Na sulfate / 2+1 M':'锌 / 钠硫酸盐 · 2+1 M'});
const L=(t,locale)=>locale==='en'?t:(labelZh[t]??t);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const colors=['#cfa478','#91b9a2','#88acbe','#b9a2c3','#c9c6bd','#a29b92'];
const fit=(s,size,width)=>Math.min(size,width/[...String(s)].reduce((sum,c)=>sum+(/[\u2E80-\u9FFF]/.test(c)?1:.61),0));
const text=(x,y,s,size=30,color='#e7e5df',anchor='start')=>`<text x="${x}" y="${y}" fill="${color}" font-size="${size}" text-anchor="${anchor}">${esc(s)}</text>`;
const line=(x1,y1,x2,y2,c='#666b6d',w=3,dash='')=>`<path d="M${x1},${y1} L${x2},${y2}" fill="none" stroke="${c}" stroke-width="${w}"${dash?` stroke-dasharray="${dash}"`:''}/>`;
const circle=(x,y,r,c,stroke='')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"${stroke?` stroke="${stroke}" stroke-width="3"`:''}/>`;
const rect=(x,y,w,h,c,rx=0)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${c}"/>`;
const poly=(p,c,stroke='')=>`<polygon points="${p}" fill="${c}"${stroke?` stroke="${stroke}" stroke-width="3"`:''}/>`;
function bar(components,values,y=235,locale='en'){
 let out='',x=90,total=(values??[]).reduce((a,b)=>a+b,0),w=780;
 if(values){components.forEach((s,i)=>{const v=w*values[i]/total;out+=rect(x,y,v-3,110,colors[i])+text(x+v/2,y+160,L(s,locale),32,colors[i],'middle');if(v>65)out+=text(x+v/2,y+68,String(values[i]),38,'#161717','middle');x+=v;});}
 else components.forEach((s,i)=>{const step=w/components.length;out+=circle(90+step*(i+.5),y+50,components.length>2?46:58,colors[i])+text(90+step*(i+.5),y+160,L(s,locale),30,colors[i],'middle');if(i)out+=text(90+step*i,y+60,'+',34,'#8a8d8d','middle');});
 return out;
}
function drawing(s,locale){let out='';

 if(s.type==='coating'){
  out+=poly('135,340 715,340 825,260 245,260','#b69e7e')+rect(135,340,580,35,'#7a644b');
  for(let r=0;r<4;r++)for(let c=0;c<12;c++){const x=190+c*46+r*20,y=277+r*18;out+=s.mode==='graphite'?poly(`${x},${y} ${x+28},${y-4} ${x+40},${y+8} ${x+8},${y+15}`,'#5f716c'):circle(x,y,10,'#6d8c89');if(s.mode==='silicon'&&c%4===0)out+=circle(x+10,y+8,4,'#d2b08c');}
  return out+text(480,485,s.labels.map(t=>L(t,locale)).join(' / '),30,'#dad7cc','middle')+text(480,540,locale==='en'?'Composite coating / not to scale':'复合涂层 / 非实际尺度',26,'#a6aaa7','middle');
 }
 if(s.type==='wound'){
  out+=circle(390,295,150,'#20282b');for(let r=148;r>30;r-=22){out+=circle(390,295,r,'none',colors[0])+circle(390,295,r-7,'none',colors[1])+circle(390,295,r-14,'none',colors[2]);}out+=circle(390,295,22,'#111314');
  s.labels.forEach((t,i)=>{out+=rect(615,210+i*77,30,15,colors[i])+text(670,226+i*77,L(t,locale),29);});return out+text(390,500,locale==='en'?'Wound electrode cross-section':'卷绕电极横截面',30,'#dad7cc','middle');
 }
 if(s.type==='ring'){
  out+=circle(390,295,151,'#718c80')+circle(390,295,101,'#d4c7af')+circle(390,295,88,'#485858');
  s.labels.forEach((t,i)=>{out+=rect(615,210+i*77,30,15,[colors[1],'#d4c7af','#485858'][i])+text(670,226+i*77,L(t,locale),fit(L(t,locale),29,270));});return out+text(390,500,locale==='en'?'Annular cathode cross-section':'环状正极横截面',30,'#dad7cc','middle');
 }
 if(s.type==='can')return rect(185,175,375,285,'#869491',16)+rect(210,175,325,260,'#293533',7)+rect(235,202,275,206,'#73685b',4)+line(545,325,640,325,colors[1])+text(663,338,L(s.labels[0],locale),fit(L(s.labels[0],locale),31,235))+text(480,520,L(s.labels[1],locale),30,'#dad7cc','middle');
 if(s.type==='dispersion'){
  out+=rect(110,185,740,245,s.mode==='silver'?'#283633':'#233030',10);for(let i=0;i<23;i++){const x=155+(i%8)*87,y=229+Math.floor(i/8)*76;out+=circle(x,y,17+(i%3)*4,colors[1]);if(s.mode==='silver')out+=poly(`${x+24},${y+22} ${x+54},${y+16} ${x+49},${y+30} ${x+28},${y+35}`,'#adb3a5');}
  return out+text(480,500,s.labels.map(t=>L(t,locale)).join(' / '),32,'#dad7cc','middle');
 }
 if(s.type==='porous'){
  for(let r=0;r<4;r++)for(let c=0;c<8;c++){const x=170+c*85,y=205+r*68;out+=line(x,y,x+90,y+25,colors[1],17)+line(x+30,y,x+8,y+65,colors[1],12);if(s.mode==='cermet')out+=circle(x+34,y+34,17,colors[0]);else if(s.mode==='alloy')out+=circle(x+15,y+9,5,colors[0]);}
  return out+text(480,535,s.labels.map(t=>L(t,locale)).join(' / '),32,'#dad7cc','middle');
 }
 if(s.type==='catalyst'){
  if(s.mode==='black'){for(let i=0;i<32;i++)out+=circle(170+(i%8)*80,210+Math.floor(i/8)*55,12+(i%3)*4,'#b7c4c1');}
  else for(let i=0;i<8;i++){const x=220+(i%4)*170,y=245+Math.floor(i/4)*125;out+=circle(x,y,48,'#35403f','#6b7f79');for(let j=0;j<8;j++){const a=j*Math.PI/4;out+=circle(x+Math.cos(a)*45,y+Math.sin(a)*45,6,s.mode==='alloy'&&j%2?colors[0]:'#c2d2cc');}}
  if(['black','ptfe','ionomer'].includes(s.mode))for(let i=0;i<3;i++)out+=`<path d="M130,${230+i*70} C330,${170+i*70} 565,${325+i*36} 820,${240+i*70}" fill="none" stroke="${s.mode==='ionomer'?colors[0]:colors[2]}" stroke-width="5"/>`;
  return out+text(480,535,s.labels.map(t=>L(t,locale)).join(' / '),32,'#dad7cc','middle');
 }
 if(s.type==='matrix'){
  out+=rect(110,180,740,255,'#243a38',8);
  if(s.mode==='fiber')for(let i=0;i<14;i++)out+=line(140+i*45,200,255+i*40,416,'#bbcdc4',4)+line(135+i*49,408,240+i*39,212,'#91afa1',3);
  else if(s.mode==='gel')for(let i=0;i<7;i++)out+=`<path d="M140,${200+i*30} C300,${140+i*40} 520,${340+i*10} 820,${205+i*30}" fill="none" stroke="#95aa9d" stroke-width="4"/>`;
  else for(let i=0;i<23;i++)out+=poly(`${155+(i%8)*88},${228+Math.floor(i/8)*75} ${182+(i%8)*88},${210+Math.floor(i/8)*75} ${201+(i%8)*88},${237+Math.floor(i/8)*75} ${170+(i%8)*88},${250+Math.floor(i/8)*75}`,'#81958c');
  return out+text(480,520,s.labels.map(t=>L(t,locale)).join(' / '),32,'#dad7cc','middle');
 }
 if(s.type==='tubular'){
  for(let i=0;i<4;i++){const x=170+i*138;out+=rect(x,235,95,200,'#c3baa6',10)+rect(x+12,235,71,190,'#637870',7)+rect(x+39,235,17,190,'#aaa69b')+circle(x+47,235,48,'#c3baa6')+circle(x+47,235,35,'#637870')+circle(x+47,235,9,'#aaa69b');}
  return out+text(480,520,s.labels.map(t=>L(t,locale)).join(' / '),30,'#dad7cc','middle');
 }
 if(s.type==='grid'){
  out+=rect(150,178,580,255,'#4d665b',7);for(let i=0;i<9;i++)out+=rect(150+i*71,178,12,255,'#a5b2aa');for(let i=0;i<5;i++)out+=rect(150,178+i*61,580,12,'#a5b2aa');out+=rect(590,140,85,39,'#a5b2aa');return out+text(480,520,s.labels.map(t=>L(t,locale)).join(' / '),32,'#dad7cc','middle');
 }

 if(s.type==='liquid')return text(90,178,L(s.salt,locale),36,colors[0])+bar(s.components,s.values,235,locale)+text(480,500,locale==='en'?s.en:s.zh,fit(locale==='en'?s.en:s.zh,30,830),'#dad7cc','middle');
 if(s.type==='composition')return bar(s.components,s.values,210,locale)+text(480,490,locale==='en'?s.en:s.zh,fit(locale==='en'?s.en:s.zh,30,830),'#dad7cc','middle');
 if(s.id==='cdos_window')return text(85,175,locale==='en'?'Before annealing':'退火前',32,colors[0])+rect(90,215,285,70,colors[2])+text(232,262,'Cd(O,S)',31,'#141717','middle')+rect(90,300,285,90,colors[1])+text(232,357,L('CdSe:O precursor',locale),26,'#141717','middle')+line(415,300,530,300,'#e4dfd5',4)+poly('530,300 510,285 510,315','#e4dfd5')+text(720,175,locale==='en'?'After annealing':'退火后',32,colors[1])+rect(580,215,285,175,'#456b5c')+text(720,288,'Cd(Se,Te)',32,'#e6e4dc','middle')+text(720,345,locale==='en'?'Intermixed region':'互混区域',28,'#e6e4dc','middle');
 if(s.type==='stack'){
  const n=s.layers.length,h=Math.min(56,330/n),x=90,w=450,dy=24;
  s.layers.forEach((rawLabel,i)=>{const label=L(rawLabel,locale);const y=165+i*h,c=s.active.includes(i)?colors[i%colors.length]:'#343a3c';out+=poly(`${x},${y} ${x+w},${y} ${x+w+48},${y-dy} ${x+48},${y-dy}`,c)+rect(x,y,w,h*.65,c)+poly(`${x+w},${y} ${x+w+48},${y-dy} ${x+w+48},${y-dy+h*.65} ${x+w},${y+h*.65}`,s.active.includes(i)?'#76695b':'#24292b')+line(x+w+60,y+8,635,y+8,c)+text(650,y+18,label,fit(label,28,270),s.active.includes(i)?'#e7e5df':'#919899');
   if(s.id==='lmo_crystalline_film'&&i===0)for(let j=0;j<12;j++)out+=line(115+j*31,y+3,120+j*31,y+h*.55,'#655e54',2);
   if(s.id==='lmo_amorphous_film'&&i===0)for(let j=0;j<12;j++)out+=circle(110+j*34,y+7+(j%3)*7,3,'#655e54');
  });return out;
 }
 if(s.type==='polymer'){
  for(let r=0;r<3;r++){let points=[];for(let j=0;j<8;j++){const x=110+j*98,y=220+r*75+(j%2?18:-18);points.push([x,y]);out+=circle(x,y,7,colors[r===1&&s.mode==='dual'?1:0]);if(j)out+=line(...points[j-1],x,y,colors[r===1&&s.mode==='dual'?1:0],4);if(s.mode==='pfsa'&&j%2===0)out+=line(x,y,x+15,y+40,colors[2])+circle(x+15,y+40,13,colors[2]);if(['filled','network','dual'].includes(s.mode)&&r<2&&j%3===1)out+=line(x,y,x+20,y+75,'#7d8c81',3);}}
  if(s.mode==='filled')for(let i=0;i<7;i++)out+=circle(150+i*102,270+(i%2)*95,21,'#91b9a2','#d5e5dc');
  for(let i=0;i<5;i++)out+=circle(170+i*144,255+(i%3)*40,12,s.mode==='pfsa'?colors[2]:colors[3]);
  return out+text(480,484,s.labels.map(t=>L(t,locale)).join(' / '),30,'#dad7cc','middle');
 }
 if(s.type==='solid'){
  for(let row=0;row<4;row++)for(let col=0;col<7;col++){const x=165+col*100,y=185+row*68;if(col<6)out+=line(x,y,x+100,y);if(row<3)out+=line(x,y,x,y+68);const vacancy=s.mode==='oxide'&&row===2&&col===3;out+=circle(x,y,vacancy?16:18,vacancy?'#111314':colors[(col+row+(s.mode==='mixed'?2:0))%2],vacancy?'#b0c2be':'');}
  return out+text(480,505,s.labels.map(t=>L(t,locale)).join(' / '),30,'#dad7cc','middle');
 }
 if(s.type==='layered'){
  const n=s.mode==='O3'?3:2;
  for(let i=0;i<n;i++){const y=195+i*100,offset=s.mode==='O3'?i*28:(i%2)*40;out+=poly(`${110+offset},${y} ${725+offset},${y} ${800+offset},${y-32} ${185+offset},${y-32}`,'#314d49','#66847b');for(let j=0;j<6;j++)out+=circle(185+j*105+offset,y+45,15,colors[0]);}
  return out+text(480,535,s.mode==='O3'?(locale==='en'?'Octahedral / 3 layers':'八面体配位 / 三层堆垛'):(locale==='en'?'Prismatic / 2 layers':'三棱柱配位 / 两层堆垛'),30,'#dad7cc','middle');
 }
 if(s.type==='particle'){
  if(['radial','bulk'].includes(s.mode)){out+=circle(480,305,135,'#314846','#91b9a2');for(let i=0;i<16;i++){const a=i*Math.PI/8;if(s.mode==='radial')out+=line(480+Math.cos(a)*38,305+Math.sin(a)*38,480+Math.cos(a)*128,305+Math.sin(a)*128,colors[i%2],10);else out+=line(480+Math.cos(a)*65,305+Math.sin(a)*65,480+Math.cos(a+.7)*125,305+Math.sin(a+.7)*125,'#667d76',5);}if(s.mode==='radial')out+=circle(480,305,42,colors[0]);}
  else if(s.mode==='single')out+=poly('360,215 470,155 605,210 625,345 505,435 365,375','#658073','#b5d0c2')+line(470,155,485,310,'#b5d0c2')+line(485,310,625,345,'#b5d0c2')+line(485,310,365,375,'#b5d0c2');
  else {for(let i=0;i<5;i++){const x=205+i*135,y=275+(i%2)*65;out+=circle(x,y,48,colors[1]);if(s.mode==='pores')for(let j=0;j<7;j++)out+=circle(x-25+(j%3)*23,y-20+Math.floor(j/3)*20,5,'#151919');else out+=line(x-35,y+5,x+35,y-5,'#547566',3);}}
  return out+text(480,510,s.labels.map(t=>L(t,locale)).join(' / '),30,'#dad7cc','middle');
 }
 if(s.type==='framework'){
  for(let r=0;r<3;r++)for(let col=0;col<6;col++){const x=200+col*110,y=215+r*85;if(col<5)out+=line(x,y,x+110,y,colors[1],5);if(r<2)out+=line(x,y,x,y+85,colors[1],5);if(s.mode==='spinel')out+=line(x,y,x+55,y+42,'#819aa2',3);if(s.mode==='phosphate')out+=poly(`${x},${y-19} ${x+20},${y+16} ${x-20},${y+16}`,colors[col%2]);else out+=circle(x,y,s.mode==='fluorocarbon'?12:18,colors[(r+col)%2]);}
  return out+text(480,505,s.labels.map(t=>L(t,locale)).join(' / '),30,'#dad7cc','middle');
 }
 if(s.type==='fibers'){
  for(let i=0;i<12;i++){const x=100+i*62;out+=line(x,190,x+85+(i%3)*20,405,colors[1],4)+line(x,395,x+100,220,'#c9b094',3);}for(let i=0;i<18;i++)out+=circle(140+(i%6)*130,225+Math.floor(i/6)*68,18,s.mode==='anode'?'#748983':colors[0]);return out+text(480,500,s.labels.map(t=>L(t,locale)).join(' / '),s.labels.join().length>45?26:30,'#dad7cc','middle');
 }
 if(s.type==='gas'){const labels=s.labels;for(let i=0;i<3;i++){out+=rect(150+i*230,190,160,210,colors[i]);for(let j=0;j<14;j++)out+=circle(177+i*230+(j%4)*35,218+Math.floor(j/4)*48,6,'#111a18');out+=text(230+i*230,465,L(labels[i],locale),29,colors[i],'middle');if(i<2)out+=line(325+i*230,290,365+i*230,290,'#e3dfd5',5)+poly(`${365+i*230},290 ${350+i*230},278 ${350+i*230},302`,'#e3dfd5');}return out;}
 if(s.type==='alloy'){const groups=s.count?[s.count]:[5,2];groups.forEach((count,index)=>{const cx=groups.length===1?480:270+index*420;out+=circle(cx,300,40,colors[0])+text(cx,311,'A',32,'#191b1b','middle');for(let i=0;i<count;i++){const a=2*Math.PI*i/count;out+=circle(cx+Math.cos(a)*95,300+Math.sin(a)*95,24,colors[1]);}out+=text(cx,495,'A:B = 1:'+count,32,'#dad7cc','middle');});return out;}
 if(s.type==='blend'){for(let r=0;r<5;r++)for(let c=0;c<9;c++){const x=180+c*75,y=185+r*46;out+=circle(x,y,22,colors[(c+2*r+(r%2))%3===0?0:1]);if(c<8)out+=line(x+20,y,x+55,y,colors[(c+r)%2],4);}return out+text(320,485,L(s.labels[0],locale),34,colors[0],'middle')+text(655,485,L(s.labels[1],locale),34,colors[1],'middle');}
 if(s.type==='thermo'){out+=rect(170,160,620,32,colors[0])+rect(170,390,620,32,colors[2]);for(let i=0;i<4;i++){out+=rect(220+i*135,192,70,198,colors[i%2])+text(255+i*135,292,i%2?'n':'p',32,'#151918','middle');}return out+text(480,135,'Tₕ',34,colors[0],'middle')+text(480,473,'T_c',34,colors[2],'middle')+text(480,540,s.labels.map(t=>L(t,locale)).join(' / '),30,'#dad7cc','middle');}
 if(s.type==='reaction')return text(480,240,L(s.left,locale),s.left.length>28?34:42,colors[0],'middle')+line(400,305,560,305,'#e5e1d9',5)+poly('560,305 540,290 540,320','#e5e1d9')+text(480,395,L(s.right,locale),s.right.length>28?34:42,colors[1],'middle');
 throw new Error('Unknown diagram type '+s.type);
}
function svg(s,locale){const d=locale==='en'?s.en:s.zh;return `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="600" viewBox="0 0 960 600" role="img"><title>${esc(s.title)}</title><desc>${esc(d)}. Qualitative source-based schematic; not a micrograph or a measured specimen.</desc><rect width="960" height="600" fill="#111314"/><g font-family="Arial, Microsoft YaHei, sans-serif">${text(65,80,L(s.title,locale),fit(L(s.title,locale),42,830))}${drawing(s,locale)}</g></svg>`;}
export async function generateDiagrams(){
 await mkdir(root,{recursive:true});const manifestPath=path.join(root,'manifest.json'),assets=JSON.parse(await readFile(manifestPath,'utf8'));
 for(const a of assets){a.materialIds=(a.materialIds??[]).filter(id=>!ingredientOverrides.has(id));if(a.referenceMaterialIds)a.referenceMaterialIds=a.referenceMaterialIds.filter(id=>!ingredientOverrides.has(id));}
 const ids=new Set(specs.map(s=>s.id));if(ids.size!==specs.length)throw new Error('Duplicate diagram specifications');
 const boundary='依据文献绘制的定性示意；颜色、形状、数量与层厚经过简化，不是实拍、显微表征或性能结果。';
 const boundaryEn='A qualitative source-based schematic. Colors, shapes, counts and layer thicknesses are simplified; this is not photography, microscopy or a performance result.';
 const notes=['# 材料结构与配方示意 / Material schematics','',boundary,boundaryEn,'','图中配比仅在原文明确给出时使用，并保留质量、体积、摩尔基准。未披露的配方不绘制假定比例。层序按功能分组，不作为制造图或实际厚度。',''];
 let written=0;
 for(const s of specs){if(!materials[s.id])throw new Error('Unknown material '+s.id);const source=getSource(materials[s.id].source);if(!source)throw new Error('Missing source '+s.id);
  notes.push('## '+s.id,'',s.title,'',s.zh,'',s.en,'',`依据 / Source: [${source.title}](${source.url})`,'');
  const hasOriginal=assets.some(a=>a.kind!=='generated'&&a.kind!=='schematic'&&[...(a.materialIds??[]),...(a.referenceMaterialIds??[])].includes(s.id));if(hasOriginal)continue;
  for(const a of assets)if(a.formMaterialIds)a.formMaterialIds=a.formMaterialIds.filter(id=>id!==s.id);
  const file='diagram-'+s.id+'.svg',fileEn='diagram-'+s.id+'.en.svg';await writeFile(path.join(root,file),svg(s,'zh'));await writeFile(path.join(root,fileEn),svg(s,'en'));
  const entry={file,kind:'schematic',materialIds:[],schematicMaterialIds:[s.id],diagramKey:s.id,width:960,height:600,shortLabel:s.zh,shortLabelEn:s.en,description:s.zh+'。'+boundary,descriptionEn:s.en+'. '+boundaryEn,pageUrl:'/assets/materials/visual-notes.md#'+s.id,basedOn:[{id:source.id,title:source.title,url:source.url},...(['na_o3','na_p2'].includes(s.id)?[{title:'P2 and O3 layered structures · Maughan et al. (2023)',url:'https://www.nature.com/articles/s43246-023-00337-8'}]:[])],localUrl:'/assets/materials/'+file,thumbUrl:'/assets/materials/'+file,previewUrl:'/assets/materials/'+file,localUrlEn:'/assets/materials/'+fileEn,thumbUrlEn:'/assets/materials/'+fileEn,previewUrlEn:'/assets/materials/'+fileEn};
  const index=assets.findIndex(a=>a.file===file);if(index>=0)assets[index]=entry;else assets.push(entry);written++;
 }
 await writeFile(manifestPath,JSON.stringify(assets,null,2)+'\n');await writeFile(path.join(root,'visual-notes.md'),notes.join('\n')+'\n');console.log('Material-specific diagrams: '+written+' / '+specs.length+' specifications');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))await generateDiagrams();