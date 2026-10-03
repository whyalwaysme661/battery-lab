
export const verifiedOn='2026-10-03';
export const sources=[
{"id":"lmfp","title":"LMFP / graphite full cell","url":"https://pubs.acs.org/doi/10.1021/acs.energyfuels.4c06201","kind":"原始研究","locator":"材料与全电池","note":"LMFP 配方不可继承 LFP 默认性能。"},
{"id":"lnmo","title":"High-voltage LNMO / graphite","url":"https://www.nature.com/articles/ncomms12032","kind":"原始研究","locator":"Methods / electrolyte","note":"专用高浓度 LiFSI/DMC 模板，非普通电解液通用兼容。"},
{"id":"siox","title":"Shin-Etsu · SiO anode materials","url":"https://www.shinetsu.co.jp/jp/products/%E6%A9%9F%E8%83%BD%E6%9D%90%E6%96%99%E4%BA%8B%E6%A5%AD/anode-material-for-lithium-ion-batteries/","kind":"厂家材料资料","locator":"SiO","note":"与硅碳复合、块状单晶硅分开。"},
{"id":"naoxide","title":"Gradient O3 / hard carbon","url":"https://www.nature.com/articles/ncomms7865","kind":"原始研究","locator":"Materials","note":"具体 O3 层状正极研究模板。"},
{"id":"nap2","title":"P2 sodium layered oxide","url":"https://doi.org/10.1038/nmat3309","kind":"原始材料研究","locator":"Abstract","note":"P2 正极身份，不作为未经核验的全电池寿命来源。"},
{"id":"napba","title":"CATL · Sodium-ion cathodes","url":"https://www.catl.com/en/news/665.html","kind":"厂家材料说明","locator":"Prussian white / hard carbon","note":"含水、空位与钠库存仍需具体配方。"},
{"id":"nvpf","title":"NVPF / hard carbon full cell","url":"https://www.nature.com/articles/s41467-019-08359-y","kind":"原始研究","locator":"Materials","note":"与 NVP 电压和电解液条件不同。"},
{"id":"nfpp","title":"NFPP sodium cathode","url":"https://doi.org/10.1039/D4TA03554B","kind":"原始研究","locator":"Materials","note":"钠库存与预钠化条件属于完整试样。"},
{"id":"halide","title":"Li2ZrCl6 / Li-In solid-state cells","url":"https://www.nature.com/articles/s41467-021-24697-2","kind":"原始研究","locator":"Abstract / Methods","note":"卤化物模板使用 Li-In 负极，裸锂不能直接替代。"},
{"id":"lipon","title":"ORNL · LiPON thin-film structure","url":"https://www.ornl.gov/publication/deposition-and-confinement-li-metal-along-artificial-lipon-lipon-interface","kind":"国家实验室原始研究","locator":"Thin-film structure","note":"LiPON 使用薄膜结构，不按厚软包处理。"},
{"id":"gel","title":"PVDF-HFP/PAN/LLZTO gel","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC12111205/","kind":"原始研究全文","locator":"Materials","note":"含液相凝胶，不归类为无液相全固态。"},
{"id":"cfx","title":"Panasonic · Lithium chemistry","url":"https://energy.panasonic.com/na/business/products/lithium","kind":"厂家材料资料","locator":"BR / CR chemistry","note":"Li/CFx 与 Li/MnO2 分开。"},
{"id":"fes2","title":"Energizer · Li/FeS2 handbook","url":"https://data.energizer.com/pdfs/lithiuml91l92_appman.pdf","kind":"厂家技术手册","locator":"Construction","note":"一次 Li/FeS2 不提供可充电循环入口。"},
{"id":"carbonzinc","title":"Energizer · Carbon-zinc handbook","url":"https://data.energizer.com/pdfs/carbonzinc_appman.pdf","kind":"厂家技术手册","locator":"Construction","note":"锌壳、中心碳集流棒与糊状电解质，非碱性锌锰。"},
{"id":"aqzn","title":"Rechargeable aqueous Zn / MnO2","url":"https://www.nature.com/articles/nenergy201639","kind":"原始研究","locator":"Materials / Methods","note":"温和 ZnSO4 与碱性一次锌锰独立。"},
{"id":"nizn","title":"ZincFive · Nickel-zinc chemistry","url":"https://zincfive.com/our-chemistry/","kind":"厂家体系资料","locator":"Chemistry","note":"Ni/Zn 碱性体系，型号性能不能移植。"},
{"id":"solar","title":"DOE · Solar photovoltaic cell basics","url":"https://www.energy.gov/cmei/systems/solar-photovoltaic-cell-basics","kind":"政府技术资料","locator":"Silicon / CdTe / CIGS / III-V / OPV","note":"光伏按受光功率和工作点测量，不使用储能循环指标。"},
{"id":"solarstructure","title":"DOE · PV cell and module design","url":"https://www.energy.gov/cmei/systems/photovoltaic-cell-and-module-design","kind":"政府结构资料","locator":"Cell / encapsulation","note":"吸光层、接触、钝化与组件封装按独立器件设计。"},
{"id":"perovskite","title":"DOE · Perovskite solar cells","url":"https://www.energy.gov/cmei/systems/perovskite-solar-cells","kind":"政府材料资料","locator":"Metal-halide perovskites","note":"金属卤化物吸光层的稳定性依完整器件和环境。"},
{"id":"solarspace","title":"DOE · Space photovoltaics","url":"https://www.energy.gov/cmei/systems/space-photovoltaics-basics","kind":"政府技术资料","locator":"III-V / multijunction","note":"多结结构不把不同吸光材料随意当单结替换。"},
{"id":"agm","title":"GS Yuasa · GYX AGM PIS","url":"https://gyb.gs-yuasa.com/assets/data/PIS%E5%88%B6%E5%BE%A1%E5%BC%8F%E9%89%9B%E8%93%84%E9%9B%BB%E6%B1%A0_GYX%20AGM%20battery_GYB_%E8%8B%B1%E6%96%87.pdf","kind":"厂家产品信息","locator":"AGM","note":"硫酸吸附于玻纤隔板，区别于胶体固定化。"},
{id:'lead',title:'GS Yuasa · 铅酸牵引电池 PIS (2026-08-20)',url:'https://www.gs-yuasa.com/jp/products/traction_batteries/pdf/V_en.pdf',kind:'厂家产品信息',locator:'§3 / §7',note:'Pb、PbO₂、H₂SO₄、耐酸聚合物槽；短路、产气、酸液与铅接触风险。'},
{id:'leadgel',title:'GS Yuasa · SLC/SLE VRLA Construction',url:'https://www.gs-yuasa.com/en/products/pdf/VRLA_SLC_SLE.pdf',kind:'厂家结构图',locator:'Battery Construction',note:'胶体与玻纤隔板结构参考；本模型表示单体，未假定 6 单体串联。'},
{id:'lifsei',title:'Fluorinated hybrid SEI · Nature Communications (2020)',url:'https://www.nature.com/articles/s41467-019-13774-2',kind:'原始研究',locator:'Abstract / Fig.1',note:'LiF、Sn、Li–Sn 合金复合人工界面；不是纯 LiF 通用增益。'},
{id:'lbasei',title:'Langmuir–Blodgett artificial SEI · Nature Energy (2018)',url:'https://www.nature.com/articles/s41560-018-0237-6',kind:'原始研究',locator:'Abstract / Fig.1',note:'磷酸功能化还原氧化石墨烯在锂金属上的人工层；效果依完整试样。'},
{id:'garnet',title:'Tailored garnet interfaces · Nature Communications (2022)',url:'https://www.nature.com/articles/s41467-022-29531-x',kind:'原始研究',locator:'Abstract / Methods',note:'石榴石电解质需掺杂与界面处理，不默认裸锂接触即稳定。'},
{id:'sulfide',title:'Interface design · Nature (2023)',url:'https://www.nature.com/articles/s41586-023-06653-w',kind:'原始研究',locator:'Abstract',note:'Li₆PS₅Cl 与 Li/NMC811 需要两侧界面设计；不移植处理后性能至裸界面。'},
{id:'polymer',title:'PEO-based solid-state batteries · Nature Communications (2024)',url:'https://www.nature.com/articles/s41467-024-53094-8',kind:'原始研究',locator:'Abstract / Methods',note:'PEO 系列材料依据；温度、盐浓度与界面条件不可省略。'},

{id:'mu2024',title:'Mu et al. · Nano-Micro Letters (2024)',url:'https://doi.org/10.1007/s40820-023-01301-4',kind:'原论文全文 + 本地综述文献',locator:'§3.3 / Figs. 4–5',note:'Li/p-3DSE/LFP 全电池与 Li/p-3DSE/Li 对称电池分别记录；摘要 2600 cycles 与正文 2600 h 冲突。'},
{id:'doelib',title:'DOE · Lithium-ion Technology Strategy Assessment (2023)',url:'https://www.energy.gov/sites/default/files/2023-07/Technology%20Strategy%20Assessment%20-%20Lithium-ion_0.pdf',kind:'美国能源部技术报告',locator:'p.1 电极与电解质',note:'用于材料分类，不能将报告中的体系比较图作为任意选配的预测。'},
{id:'panli',title:'Panasonic · Lithium-ion Handbook',url:'https://eu.industrial.panasonic.com/sites/default/pidseu/files/downloads/files/panasonic_li-ion_handbook.pdf',kind:'厂家技术手册',locator:'圆柱结构 p.26',note:'圆柱卷芯、集流、绝缘、泄压结构参考；工程尺寸不由图示比例反推。'},
{id:'energizer',title:'Energizer · Alkaline Handbook',url:'https://data.energizer.com/pdfs/alkaline_appman.pdf',kind:'厂家技术手册',locator:'PDF pp.2–4 / Fig.4',note:'Zn / MnO₂ / KOH；同轴结构、泄压与温度资料。'},
{id:'egl',title:'Energizer · Battery Glossary',url:'https://data.energizer.com/battery-glossary-faq/',kind:'厂家术语资料',locator:'Air Cell / Silver Oxide',note:'锌空气与氧化银一次电池材料定义。'},
{id:'panprimary',title:'Panasonic · Lithium Technical Handbook (2025)',url:'https://energy.panasonic.com/dam/master/pdf/eu/material/Panasonic_Lithium_Handbook_2025.pdf',kind:'厂家技术手册',locator:'一次锂系列 / pp.66–67 可充电 VL 结构',note:'一次锂与可充电 VL 结构不可混用。'},
{id:'pannimh',title:'Panasonic · Ni-MH Handbook + 2026 PSDS',url:'https://energy.panasonic.com/dam/master/pdf/eu/material/Panasonic_Ni-MH_Batteries_Handbook.pdf',kind:'厂家技术手册',locator:'pp.14–15 结构与电化学',note:'Ni(OH)₂ / 吸氢合金 / 碱性水溶液；寿命依型号与测试条件。'},
{id:'nimhsafety',title:'Panasonic · Ni-MH Product Safety Data (2026)',url:'https://energy.panasonic.com/dam/master/pdf/en/psds/nickel-metal/2026/NHW-PSDS-EN.pdf',kind:'厂家产品安全数据',locator:'§3 成分 / Hazard',note:'过热、外短路与电解液接触风险；不是所选装配的认证。'},
{id:'doefuel',title:'DOE · Types of Fuel Cells',url:'https://www.energy.gov/cmei/fuels/types-fuel-cells',kind:'美国能源部技术资料',locator:'PEM / AFC / SOFC',note:'按电解质分类；PEM 铂催化碳电极、固态聚合物膜；SOFC 陶瓷电解质。'},
{id:'doeparts',title:'DOE · Parts of a Fuel Cell',url:'https://www.energy.gov/cmei/fuels/parts-fuel-cell',kind:'美国能源部技术资料',locator:'MEA / GDL / 双极板',note:'区分膜、催化层、气体扩散层与流场板。'},
{id:'netl',title:'DOE/NETL · Fuel Cell Handbook (7th ed.)',url:'https://netl.doe.gov/sites/default/files/netl-file/FCHandbook7.pdf',kind:'政府技术手册',locator:'Chapter 7 · SOFC',note:'Ni–YSZ 负极、LSM/LSCF 氧电极与 YSZ 陶瓷体系；属于结构与材料依据。'},
{id:'nasa',title:'NASA · Radioisotope Power Systems FAQ',url:'https://science.nasa.gov/planetary-science/programs/radioisotope-power-systems/faq/',kind:'NASA 官方资料',locator:'MMRTG / Beginning of mission',note:'约 110 W 是完整 MMRTG 的任务初期电功率，不能移植到自选核电池模型。'},
{id:'nasamodel',title:'NASA · MMRTG Pull-Apart',url:'https://science.nasa.gov/image-detail/mmrtg-pull-apart/',kind:'NASA 官方结构图片',locator:'分解图 / 3299×3022',note:'中央热源、热电转换、保温、外壳与散热鳍片；分解间距不代表工程间隙。'},
{id:'beta',title:'Betavoltaic transducers · theoretical study (2023)',url:'https://arxiv.org/abs/2308.09807',kind:'研究者原始预印本 · 理论研究',locator:'摘要与平面/三维器件比较',note:'Si、SiC、金刚石与 β 源概念研究，非量产产品验证，非实测功率来源。'},
{id:'catl2026',title:'CATL · Sodium-ion BESS (2026-06-22)',url:'https://www.catl.com/en/news/6861.html',kind:'厂家最新发布',locator:'TENER Sodium',note:'证明商业体系进展；厂家系统数据不当作自选单体性能。'},
{id:'na2024',title:'HC || NVP/C sodium-ion full cells (2024)',url:'https://arxiv.org/abs/2401.15420',kind:'研究者原始预印本',locator:'全电池电化学与材料',note:'硬碳/NVP 研究级证据；不外推到其他钠正极。'},
{id:'molicel',title:'Molicel · INR-21700-P45B',url:'https://www.molicel.com/inr-21700-p45b/',kind:'厂家规格与循环特征',locator:'产品规格 / Cycle Characteristics',note:'4.5 Ah、3.6 V 是 P45B 完整产品的典型规格；电流上限应结合温度与停止条件。'},
{id:'yang2026',title:'Yang et al. · Nature (2026-07-08)',url:'https://doi.org/10.1038/s41586-026-10732-z',kind:'原论文摘要 · 工况未充分核验',locator:'Abstract / Fig.4',note:'报告梯度溶剂化锂金属软包；摘要数据只作研究线索，缺完整测试条件时不能成为预测参数。'},
{id:'lgpouch',title:'LG Energy Solution · Pouch Assembly',url:'https://inside.lgensol.com/en/2023/07/infographics5-how-to-make-a-battery-step-2-cell-assembly-pouch-battery/',kind:'厂家装配结构参考',locator:'层压、叠片、极耳、冲坑、热封',note:'最终模型不保留制造阶段临时 gas pocket；图片仅用作结构参考。'},
{id:'samsung',title:'Samsung SDI · Prismatic Assembly (2026)',url:'https://news.samsungsdi.com/global/articleView?seq=310',kind:'厂家装配结构参考',locator:'入壳、集流、盖板与焊接',note:'图示间距和层厚不是公差或加工尺寸。'}
];
const m=(id,label,stage,source)=>({id,label,stage,source});
export const materials={
"lmfp":m("lmfp","磷酸锰铁锂 · LMFP","配方依 Mn:Fe 比","lmfp"),
"lnmo":m("lnmo","高压尖晶石 · LNMO","专用研究体系","lnmo"),
"siox":m("siox","SiOₓ 基复合负极","工业材料 / 配方限定","siox"),
"lifsi_dmc":m("lifsi_dmc","高浓度 LiFSI / DMC","LNMO 模板专用","lnmo"),
"na_o3":m("na_o3","O3 层状钠氧化物","研究配方","naoxide"),
"na_p2":m("na_p2","P2 型 Fe/Mn 层状钠氧化物","材料研究 / 钠库存待配平","nap2"),
"prussianwhite":m("prussianwhite","普鲁士白 · 富钠铁基 PBA","工业材料 / 配方依产品","napba"),
"nvpf":m("nvpf","氟磷酸钒钠 · NVPF/C","研究 / 产品依配方","nvpf"),
"nfpp":m("nfpp","铁基混合聚阴离子 · NFPP","研究配方","nfpp"),
"lzc":m("lzc","卤化物 · Li₂ZrCl₆","研究级 / Li–In 模板","halide"),
"liin":m("liin","Li–In 合金","固态研究负极","halide"),
"lipon":m("lipon","氧氮化磷酸锂 · LiPON","薄膜研究体系","lipon"),
"gel":m("gel","PVDF-HFP / PAN / LLZTO 凝胶","含液相 / 研究","gel"),
"cfx":m("cfx","氟化碳 · CFₓ","一次锂常用","cfx"),
"fes2":m("fes2","二硫化铁 · FeS₂","一次锂常用","fes2"),
"fes2electrolyte":m("fes2electrolyte","Li/FeS₂ 专用有机电解液","型号限定","fes2"),
"nh4zncl":m("nh4zncl","NH₄Cl / ZnCl₂ 糊状电解质","锌碳常用","carbonzinc"),
"znsulfate":m("znsulfate","ZnSO₄ 温和水系电解液","研究 / 配方限定","aqzn"),
"phosphoric":m("phosphoric","磷酸 / SiC 固定化基体","PAFC 体系","netl"),
"molten":m("molten","熔融碳酸盐 / LiAlO₂ 基体","MCFC 高温体系","netl"),
"nickelmetal":m("nickelmetal","Ni 燃料电极","MCFC 体系","netl"),
"nio":m("nio","NiO 氧电极","MCFC 体系","netl"),
"afccathode":m("afccathode","碱性适用多孔催化电极","AFC 专用","netl"),
"afcanode":m("afcanode","碱性燃料侧催化电极","AFC 专用","netl"),
"mono_si":m("mono_si","单晶硅 · c-Si","光伏工业常用","solar"),
"multi_si":m("multi_si","多晶硅 · mc-Si","光伏工业使用","solar"),
"amorphous_si":m("amorphous_si","非晶硅 · a-Si","薄膜光伏","solar"),
"cdte":m("cdte","碲化镉 · CdTe","工业薄膜光伏","solar"),
"cigs":m("cigs","铜铟镓硒 · CIGS","工业薄膜光伏","solar"),
"pv_perovskite":m("pv_perovskite","金属卤化物钙钛矿","光伏研究 / 商业验证","perovskite"),
"opv":m("opv","有机给受体吸光层","器件配方依研究","solar"),
"gaas":m("gaas","GaAs / III-V 结结构","高性能光伏","solarspace"),
"si_contact":m("si_contact","硅结 / 金属栅接触","晶硅参考结构","solarstructure"),
"tco_contact":m("tco_contact","透明导电氧化物 / 背接触","薄膜参考结构","solarstructure"),
"transport":m("transport","电子 / 空穴传输层","器件配方需匹配","perovskite"),
"organic_contact":m("organic_contact","有机器件选择性接触","配方需匹配","solar"),
"iiiv_contact":m("iiiv_contact","III-V 专用结与接触","器件结构限定","solarspace"),
"passivation":m("passivation","硅钝化 / 减反功能层","晶硅参考功能","solarstructure"),
"pv_buffer":m("pv_buffer","薄膜缓冲 / 窗口层","器件材料需匹配","solarstructure"),
pbo2:m('pbo2','二氧化铅 · PbO₂','工业常用','lead'),pb:m('pb','铅 · Pb','工业常用','lead'),acid:m('acid','硫酸水溶液 · 富液','工业常用','lead'),acidagm:m('acidagm','硫酸 / AGM 玻纤吸附','工业常用','agm'),acidgel:m('acidgel','硫酸 / 胶体固定','工业常用','leadgel'),
lfp:m('lfp','磷酸铁锂 · LFP','工业常用','doelib'),nmc811:m('nmc811','三元层状氧化物 · NMC811','工业常用','doelib'),nmc622:m('nmc622','三元层状氧化物 · NMC622','工业常用','doelib'),lco:m('lco','钴酸锂 · LCO','工业常用','doelib'),lmo:m('lmo','锰酸锂 · LMO','工业常用','doelib'),nca:m('nca','镍钴铝 · NCA','工业常用','doelib'),
graphite:m('graphite','石墨','工业常用','doelib'),silicon:m('silicon','硅碳复合负极','配方依产品','doelib'),lto:m('lto','钛酸锂 · LTO','工业使用','doelib'),lithium:m('lithium','锂金属','体系依结构','mu2024'),hardcarbon:m('hardcarbon','硬碳','钠离子使用','na2024'),nvp:m('nvp','磷酸钒钠 · NVP/C','研究/产品依配方','na2024'),
carbonate:m('carbonate','锂盐 / 碳酸酯液态电解液','工业常用','doelib'),p3dse:m('p3dse','PEGDA / LLZTO / LiTFSI · p-3DSE','研究级 3D 复合固态','mu2024'),llzto:m('llzto','LLZTO 石榴石氧化物','研究/验证级','garnet'),sulfide:m('sulfide','硫化物 · Li₆PS₅Cl','研究/验证级','sulfide'),polymer:m('polymer','PEO / 锂盐聚合物','温度与界面依配方','polymer'),sodiumliquid:m('sodiumliquid','钠盐 / 有机溶剂','配方依研究','na2024'),
mno2:m('mno2','二氧化锰 · MnO₂','工业常用','energizer'),zinc:m('zinc','锌 / 锌凝胶','工业常用','energizer'),koh:m('koh','KOH 碱性水溶液','工业常用','energizer'),silver:m('silver','氧化银 · Ag₂O','工业常用','egl'),air:m('air','催化碳空气电极','工业常用','egl'),primaryorganic:m('primaryorganic','一次锂专用有机电解液','型号限定','panprimary'),
nickel:m('nickel','氢氧化镍 · Ni(OH)₂','工业常用','pannimh'),alloy:m('alloy','吸氢合金 · AB₅ / AB₂','工业常用','pannimh'),
ptc:m('ptc','Pt/C 催化碳电极','PEM 常用','doefuel'),ptalloy:m('ptalloy','Pt 合金 / C 催化电极','型号依配方','doefuel'),pfsa:m('pfsa','质子交换聚合物膜','工业常用','doefuel'),niysz:m('niysz','Ni–YSZ 金属陶瓷','SOFC 常用','netl'),lsm:m('lsm','LSM 氧电极','高温 SOFC','netl'),lscf:m('lscf','LSCF 氧电极','界面依设计','netl'),ysz:m('ysz','YSZ 陶瓷电解质','SOFC 常用','netl'),
heat:m('heat','密封放射性同位素热源','专用核电源','nasa'),thermo:m('thermo','热电转换组件','MMRTG 概念参考','nasa'),beta63:m('beta63','⁶³Ni β 源 · 概念','研究级','beta'),si:m('si','Si 半导体结','研究级','beta'),sic:m('sic','SiC 半导体结','研究级','beta'),diamond:m('diamond','金刚石半导体结','研究级','beta')
};
export const families=[{id:'solar',label:'太阳能电池',hint:'光电转换',icon:'☀'},{id:'secondary',label:'二次电池',hint:'充放电循环',icon:'↻'},{id:'primary',label:'一次电池',hint:'单次放电',icon:'⊕'},{id:'fuel',label:'燃料电池',hint:'持续供燃料',icon:'≋'},{id:'nuclear',label:'核电池',hint:'衰变能转换',icon:'◎'}];
export const packaging={
"carbonzinc":{"label":"锌壳圆柱 · 碳棒集流","model":"carbonzinc","source":"carbonzinc","detail":"锌负极壳、糊状电解质、MnO₂ 复合正极与中心碳棒。"},
"thinbattery":{"label":"薄膜电池 · 基底密封","model":"thinbattery","source":"lipon","detail":"基底、集流、电极与 LiPON 薄膜层。"},
"afc":{"label":"碱性电堆 · 气体密封","model":"afc","source":"netl","detail":"碱液固定化层、双侧多孔电极与供气流场。"},
"pafc":{"label":"磷酸电堆 · 固定化基体","model":"pafc","source":"netl","detail":"磷酸 / SiC 基体与多孔电极，独立于 PFSA 膜。"},
"mcfc":{"label":"碳酸盐电堆 · 高温密封","model":"mcfc","source":"netl","detail":"Ni / 碳酸盐基体 / NiO 与高温连接体。"},
"solar":{"label":"晶硅单片 · 玻璃层压示意","model":"solar","source":"solarstructure","detail":"晶硅结、金属栅线、钝化、玻璃和背部保护。"},
"solarfilm":{"label":"薄膜器件 · 层压保护","model":"solarfilm","source":"solarstructure","detail":"透明接触、吸光层、功能层与背接触；具体层序依器件。"},
lead:{label:'耐酸槽 · 排气 / 阀控盖',model:'lead',source:'leadgel',detail:'单体正负极板、板栅、隔板、汇流排、端子和槽盖；封口按富液或阀控设计。'},
pouch:{label:'软包 · 铝塑膜热封',model:'pouch',source:'lgpouch',detail:'叠片电芯、正负极耳、铝塑膜封边。'},
prismatic:{label:'方壳 · 激光焊接盖板',model:'prismatic',source:'samsung',detail:'铝壳、集流连接、绝缘、端子、泄压与注液口。'},
cylindrical:{label:'圆柱 · 金属壳卷封',model:'cylindrical',source:'panli',detail:'卷绕结构、上下绝缘、封口垫圈与泄压组件。'},
coin:{label:'纽扣 · 金属盖压封',model:'coin',source:'panprimary',detail:'分离金属盖、绝缘密封环；内部材料依化学体系。'},
alkaline:{label:'圆柱 · 机械卷封与密封圈',model:'alkaline',source:'energizer',detail:'同轴 MnO₂ 环、隔膜、Zn 凝胶与黄铜集流针。'},
aircoin:{label:'空气纽扣 · 透气孔与密封环',model:'aircoin',source:'egl',detail:'保持空气入口，不采用无进气的全密闭模型。'},
stack:{label:'电堆 · 端板压紧与垫片密封',model:'pem',source:'doeparts',detail:'膜电极、流场板、气体通道、集流、密封垫片与压紧件。'},
ceramic:{label:'陶瓷单元 · 高温密封与连接体',model:'sofc',source:'netl',detail:'陶瓷层、气体通道、连接体与高温密封结构。'},
rtg:{label:'热电核电源 · 密封壳与散热鳍片',model:'rtg',source:'nasamodel',detail:'热源/热电转换/保温/散热示意，不包含核源加工细节。'},
beta:{label:'半导体核电池 · 气密器件封装',model:'beta',source:'beta',detail:'β 源与半导体结结构示意；封装不代表辐射屏蔽认证。'}
};
export const profiles=[
{"id":"liion_hv","family":"secondary","label":"高电压锂离子 · LNMO","cathodes":["lnmo"],"anodes":["graphite"],"electrolytes":["lifsi_dmc"],"packaging":["pouch","cylindrical","prismatic"],"sei":false,"sources":["lnmo"],"risk":"结构与配方需对应验证，不默认赋予寿命、安全或效率。"},
{"id":"sodium_oxide","family":"secondary","label":"钠离子 · 层状氧化物","cathodes":["na_o3","na_p2"],"anodes":["hardcarbon"],"electrolytes":["sodiumliquid"],"packaging":["pouch","prismatic","cylindrical"],"sei":false,"sources":["naoxide","nap2"],"risk":"结构与配方需对应验证，不默认赋予寿命、安全或效率。"},
{"id":"sodium_pba","family":"secondary","label":"钠离子 · 普鲁士白","cathodes":["prussianwhite"],"anodes":["hardcarbon"],"electrolytes":["sodiumliquid"],"packaging":["pouch","prismatic","cylindrical"],"sei":false,"sources":["napba"],"risk":"结构与配方需对应验证，不默认赋予寿命、安全或效率。"},
{"id":"solid_halide","family":"secondary","label":"固态 · 卤化物 / Li–In","cathodes":["nmc811"],"anodes":["liin"],"electrolytes":["lzc"],"packaging":["pouch","coin","prismatic"],"sei":false,"sources":["halide"],"risk":"结构与配方需对应验证，不默认赋予寿命、安全或效率。"},
{"id":"thinbattery","family":"secondary","label":"薄膜固态 · LiPON","cathodes":["lco"],"anodes":["lithium"],"electrolytes":["lipon"],"packaging":["thinbattery"],"sei":false,"sources":["lipon"],"risk":"结构与配方需对应验证，不默认赋予寿命、安全或效率。"},
{"id":"gel","family":"secondary","label":"凝胶锂金属 · 含液相","cathodes":["lfp"],"anodes":["lithium"],"electrolytes":["gel"],"packaging":["pouch","coin"],"sei":true,"sources":["gel"],"risk":"结构与配方需对应验证，不默认赋予寿命、安全或效率。"},
{"id":"primary_cfx","family":"primary","label":"一次锂 · Li / CFₓ","cathodes":["cfx"],"anodes":["lithium"],"electrolytes":["primaryorganic"],"packaging":["coin","cylindrical"],"sei":false,"sources":["cfx"],"risk":"结构与配方需对应验证，不默认赋予寿命、安全或效率。"},
{"id":"primary_fes2","family":"primary","label":"一次锂 · Li / FeS₂","cathodes":["fes2"],"anodes":["lithium"],"electrolytes":["fes2electrolyte"],"packaging":["cylindrical"],"sei":false,"sources":["fes2"],"risk":"结构与配方需对应验证，不默认赋予寿命、安全或效率。"},
{"id":"carbonzinc","family":"primary","label":"锌碳 / 氯化锌","cathodes":["mno2"],"anodes":["zinc"],"electrolytes":["nh4zncl"],"packaging":["carbonzinc"],"sei":false,"sources":["carbonzinc"],"risk":"结构与配方需对应验证，不默认赋予寿命、安全或效率。"},
{"id":"aqueouszn","family":"secondary","label":"温和水系 · Zn / MnO₂","cathodes":["mno2"],"anodes":["zinc"],"electrolytes":["znsulfate"],"packaging":["pouch","coin"],"sei":false,"sources":["aqzn"],"risk":"结构与配方需对应验证，不默认赋予寿命、安全或效率。"},
{"id":"nizn","family":"secondary","label":"镍锌","cathodes":["nickel"],"anodes":["zinc"],"electrolytes":["koh"],"packaging":["cylindrical","prismatic"],"sei":false,"sources":["nizn"],"risk":"结构与配方需对应验证，不默认赋予寿命、安全或效率。"},
{"id":"afc","family":"fuel","label":"碱性燃料 · AFC","cathodes":["afccathode"],"anodes":["afcanode"],"electrolytes":["koh"],"packaging":["afc"],"sei":false,"sources":["netl","doefuel"],"risk":"需记录 CO₂ 敏感性、碱液与供气密封。"},
{"id":"pafc","family":"fuel","label":"磷酸燃料 · PAFC","cathodes":["ptc"],"anodes":["ptc"],"electrolytes":["phosphoric"],"packaging":["pafc"],"sei":false,"sources":["netl","doefuel"],"risk":"结构与配方需对应验证，不默认赋予寿命、安全或效率。"},
{"id":"mcfc","family":"fuel","label":"熔融碳酸盐 · MCFC","cathodes":["nio"],"anodes":["nickelmetal"],"electrolytes":["molten"],"packaging":["mcfc"],"sei":false,"sources":["netl","doefuel"],"risk":"结构与配方需对应验证，不默认赋予寿命、安全或效率。"},
{"id":"solar_si","family":"solar","label":"晶硅太阳能电池","cathodes":["mono_si","multi_si"],"anodes":["si_contact"],"electrolytes":["passivation"],"packaging":["solar"],"sei":false,"sources":["solar","solarstructure"],"risk":"结构与配方需对应验证，不默认赋予寿命、安全或效率。"},
{"id":"solar_film","family":"solar","label":"薄膜太阳能电池","cathodes":["cdte","cigs","amorphous_si"],"anodes":["tco_contact"],"electrolytes":["pv_buffer"],"packaging":["solarfilm"],"sei":false,"sources":["solar","solarstructure"],"risk":"结构与配方需对应验证，不默认赋予寿命、安全或效率。"},
{"id":"solar_perovskite","family":"solar","label":"钙钛矿太阳能电池","cathodes":["pv_perovskite"],"anodes":["transport"],"electrolytes":[],"packaging":["solarfilm"],"sei":false,"sources":["perovskite","solarstructure"],"risk":"结构与配方需对应验证，不默认赋予寿命、安全或效率。"},
{"id":"solar_organic","family":"solar","label":"有机太阳能电池","cathodes":["opv"],"anodes":["organic_contact"],"electrolytes":[],"packaging":["solarfilm"],"sei":false,"sources":["solar","solarstructure"],"risk":"结构与配方需对应验证，不默认赋予寿命、安全或效率。"},
{"id":"solar_iiiv","family":"solar","label":"III-V 太阳能电池","cathodes":["gaas"],"anodes":["iiiv_contact"],"electrolytes":[],"packaging":["solarfilm"],"sei":false,"sources":["solarspace","solarstructure"],"risk":"结构与配方需对应验证，不默认赋予寿命、安全或效率。"},
{id:'leadacid',family:'secondary',label:'铅酸 · 富液 / AGM / 胶体',cathodes:['pbo2'],anodes:['pb'],electrolytes:['acid','acidagm','acidgel'],packaging:['lead'],sei:false,sources:['lead','leadgel'],risk:'酸液、铅接触、产气与短路；富液与阀控密封不能混用。'},
{id:'solid',family:'secondary',label:'全固态锂金属',cathodes:['lfp','nmc811'],anodes:['lithium'],electrolytes:['p3dse','llzto','sulfide','polymer'],packaging:['pouch','coin','prismatic'],sei:true,sources:['mu2024','doelib'],risk:'固态仍可能出现锂枝晶、接触丧失与界面反应；材料选择不能替代短路、热滥用和机械测试。'},
{id:'liion',family:'secondary',label:'锂离子',cathodes:['lfp','lmfp','nmc811','nmc622','nca','lco','lmo'],anodes:['graphite','silicon','siox','lto'],electrolytes:['carbonate'],packaging:['pouch','cylindrical','prismatic','coin'],sei:false,sources:['doelib','molicel'],risk:'有机电解液、过充、外短路和温升需要独立评估；泄压部件不等于安全认证。'},
{id:'sodium',family:'secondary',label:'钠离子 · 聚阴离子',cathodes:['nvp','nvpf','nfpp'],anodes:['hardcarbon'],electrolytes:['sodiumliquid'],packaging:['pouch','prismatic','cylindrical'],sei:true,sources:['na2024','catl2026'],risk:'该选项是硬碳/NVP 研究组合；CATL 的商业产品参数不移植至此模型。'},
{id:'nimh',family:'secondary',label:'镍氢',cathodes:['nickel'],anodes:['alloy'],electrolytes:['koh'],packaging:['cylindrical','prismatic'],sei:false,sources:['pannimh','nimhsafety'],risk:'过充与外短路可能产气、发热；检查密封、泄压和碱液接触风险。'},
{id:'alkaline',family:'primary',label:'碱性锌锰',cathodes:['mno2'],anodes:['zinc'],electrolytes:['koh'],packaging:['alkaline'],sei:false,sources:['energizer'],risk:'一次电池不评估充放电循环寿命；充电或短路可能造成产气与泄漏。'},
{id:'lithiumprimary',family:'primary',label:'一次锂 · Li / MnO₂',cathodes:['mno2'],anodes:['lithium'],electrolytes:['primaryorganic'],packaging:['coin','cylindrical'],sei:false,sources:['panprimary'],risk:'不可将一次 Li/MnO₂ 电池按可充电锂离子操作；性能应绑定具体型号与负载。'},
{id:'silver',family:'primary',label:'氧化银 / 锌',cathodes:['silver'],anodes:['zinc'],electrolytes:['koh'],packaging:['coin'],sei:false,sources:['egl'],risk:'一次体系；检查碱性电解液泄漏与纽扣封装绝缘。'},
{id:'zincair',family:'primary',label:'锌空气',cathodes:['air'],anodes:['zinc'],electrolytes:['koh'],packaging:['aircoin'],sei:false,sources:['egl'],risk:'性能取决于空气供应、湿度与电解液；透气孔必须保留。'},
{id:'pem',family:'fuel',label:'质子交换膜 · PEMFC',cathodes:['ptc','ptalloy'],anodes:['ptc'],electrolytes:['pfsa'],packaging:['stack'],sei:false,sources:['doefuel','doeparts'],risk:'评估气体泄漏、压差、水管理与 CO 中毒；膜电极耐久性通常使用小时与衰减率。'},
{id:'sofc',family:'fuel',label:'固体氧化物 · SOFC',cathodes:['lsm','lscf'],anodes:['niysz'],electrolytes:['ysz'],packaging:['ceramic'],sei:false,sources:['doefuel','netl'],risk:'高温热应力、热循环与气密性需要实际测试；不同陶瓷组合并非自动兼容。'},
{id:'rtg',family:'nuclear',label:'放射性同位素热电 · RTG',cathodes:['thermo'],anodes:['heat'],electrolytes:[],packaging:['rtg'],sei:false,sources:['nasa','nasamodel'],risk:'非电化学正负极体系；电功率、热管理、放射性包容性需要专用证据，本模型仅表示功能结构。'},
{id:'betavoltaic',family:'nuclear',label:'β 伏打半导体核电池',cathodes:['si','sic','diamond'],anodes:['beta63'],electrolytes:[],packaging:['beta'],sei:false,sources:['beta'],risk:'理论研究与产品宣传不能替代器件实测；源活度、转换效率与辐射安全无核验时不输出功率或安全等级。'}
];
export const seiOptions=[{id:'none',label:'不添加人工 SEI',note:'电化学运行中可能形成原生 SEI，模型未假定其成分。'},{id:'lif',label:'LiF / Sn 复合人工界面 · 研究',source:'lifsei',note:'有文献依据的锂金属界面设计；与 Mu 原试样不同，效果需重新测试。'},{id:'lbasei',label:'功能化 rGO 人工界面 · 研究',source:'lbasei',note:'磷酸功能化还原氧化石墨烯的锂金属设计；未移植文献增益。'}];
export const observations=[
{id:'mmrtg-power',profile:'rtg',source:'nasa',metric:'MMRTG 完整系统任务初期电功率',value:110,unit:'W',qualifier:'约 110 W · 完整 MMRTG',conditions:'NASA FAQ：beginning of mission，完整系统；不是本示意模型或自定义热源预测。',kind:'product',locator:'How much power would it supply?'},
{id:'mmrtg-life',profile:'rtg',source:'nasa',metric:'MMRTG 完整系统设计运行期',value:14,unit:'years',qualifier:'另有 3 年发射前储存设计期',conditions:'NASA FAQ：design life，完整系统；不等同于此模型已验证寿命或衰减曲线。',kind:'product',locator:'How long will an RPS continue to produce power?'},
{id:'sle500-capacity',profile:'leadacid',source:'leadgel',metric:'SLE-500 厂家额定容量',value:500,unit:'Ah',qualifier:'完整 SLE-500 单体 · 10HR / 25°C',conditions:'产品资料：额定电压 2 V、容量 500 Ah/10hr；定量值不移植至自定义极板或硫酸配方。',kind:'product',locator:'Specification / p.3'},

{id:'mu-lfp-cycle',profile:'solid',cathode:'lfp',anode:'lithium',electrolyte:'p3dse',source:'mu2024',metric:'全电池循环测试',value:600,unit:'cycles',qualifier:'600 圈后保留 89%',conditions:'Li/p-3DSE/LFP，1C；§3.3 / Fig.5e；这是已报告测试终点，不是衰减至 80% 的寿命预测。',kind:'full-cell',locator:'§3.3 / Fig.5e'},
{id:'mu-lfp-areal',profile:'solid',cathode:'lfp',anode:'lithium',electrolyte:'p3dse',source:'mu2024',metric:'全电池面容量',value:2.754,unit:'mAh/cm²',qualifier:'载量 20 mg/cm²',conditions:'Li/p-3DSE/LFP，0.5C；高载量系列 Fig.5g；不等同于 Fig.5e 循环测试样品。',kind:'full-cell',locator:'§3.3 / Fig.5g'},
{id:'mu-ccd',profile:'solid',anode:'lithium',electrolyte:'p3dse',source:'mu2024',metric:'对称电池临界电流密度',value:1.92,unit:'mA/cm²',qualifier:'Li/p-3DSE/Li 对称电池',conditions:'室温、阶梯增流测试，Fig.4a；不作为任意全电池的允许工作电流。',kind:'symmetric',locator:'§3.3 / Fig.4a'},
{id:'mu-hours',profile:'solid',anode:'lithium',electrolyte:'p3dse',source:'mu2024',metric:'对称电池稳定运行',value:2600,unit:'h',qualifier:'超过 2600 h · 0.5 mA/cm²',conditions:'正文 §3.3；摘要/结论用 cycles，存在单位冲突；仅保留正文小时指标，不输出 2600 圈寿命。',kind:'symmetric',locator:'§3.3 / Fig.4f',conflict:true},
{id:'p45b-capacity',profile:'liion',source:'molicel',metric:'P45B 完整产品典型容量',value:4.5,unit:'Ah',qualifier:'INR-21700-P45B 产品限定',conditions:'厂家产品页；不能移植至自选正负极或封装；型号、温度和电流条件需要单独核对。',kind:'product',locator:'Typical Capacity'}
];

// Research candidates use source-bound combinations, with atomic transitions.
const baselineOptions=new Map(profiles.map(p=>[p.id,{cathodes:[...p.cathodes],anodes:[...p.anodes],electrolytes:[...p.electrolytes]}]));
sources.push(...[{"id":"lifop","title":"Electrode materials and LiFOP electrolytes","url":"https://digitalcommons.uri.edu/chm_facpubs/736/","kind":"原始研究","locator":"Experimental / full cells","note":"MCMB/NMC111 与天然石墨/LFP；1.2 M LiPF₆、EC/EMC 3:7 体积比对照。"},{"id":"nmc532gen2","title":"Deciphering coulombic loss in lithium-ion batteries and beyond","url":"https://www.nature.com/articles/s41467-025-60833-y","kind":"原始研究","locator":"Methods / Gen2","note":"石墨/NMC532；1.2 M LiPF₆、EC/EMC 3:7 质量比，不与体积比配方合并。"},{"id":"hcms","title":"Ultramicroporous hard carbon spheres in carbonate electrolytes","url":"https://onlinelibrary.wiley.com/doi/10.1002/bte2.20220007","kind":"原始研究","locator":"Full-cell electrochemistry","note":"NVP/HCMS；1 M NaClO₄、EC/PC 1:1 体积比，活化与钠库存依原样品。"},{"id":"hcns","title":"Endogenous doping and hard-carbon interphase chemistry","url":"https://link.springer.com/article/10.1007/s40820-026-02124-9","kind":"原始研究","locator":"Experimental / full cells","note":"NVP/已活化 1300-FCA；1 M NaPF₆/diglyme，保留前驱体、活化与 N/P 配平条件。"},{"id":"znqd","title":"Self-repairing interphase in aqueous zinc batteries","url":"https://www.nature.com/articles/s41467-022-32955-0","kind":"原始研究","locator":"Methods / electrolyte","note":"V₂O₅/Zn/2 M ZnSO₄ + C₃N₄ 量子点；添加剂浓度是研究变量，不能省略。"},{"id":"nvo","title":"Aqueous zinc/sodium vanadate batteries","url":"https://www.nature.com/articles/s41467-018-04060-8","kind":"原始研究","locator":"Methods / full cells","note":"NaV₃O₈·1.5H₂O/Zn；1 M ZnSO₄ + 1 M Na₂SO₄。原文 FTIR 图有作者更正，详见更正来源。"},{"id":"nvocorrection","title":"Author Correction: zinc/sodium vanadate batteries","url":"https://www.nature.com/articles/s41467-024-50357-2","kind":"原始研究","locator":"2024 author correction","note":"原文 FTIR 曲线重复绘制问题；本网站不提取该图数据。"},{"id":"vhcf","title":"Dual-salt electrolyte for vanadium hexacyanoferrate Zn batteries","url":"https://www.sciencedirect.com/science/article/pii/S2352152X25035303","kind":"原始研究","locator":"Full cells / electrolyte","note":"VHCF/Zn；2 M ZnSO₄ + 1 M Na₂SO₄，与 NVO 的 1+1 M 配方不同。"},{"id":"pvtio2","title":"Mesoscopic MAPbI₃ solar cells","url":"https://www.nature.com/articles/srep00591","kind":"原始研究","locator":"Device architecture","note":"FTO/致密+介孔 TiO₂/MAPbI₃/Spiro-OMeTAD/Au；无液态电解质。"},{"id":"pvspray","title":"Fully Spray-Coated Triple-Cation Perovskite Solar Cells","url":"https://www.nature.com/articles/s41598-020-63674-5","kind":"原始研究","locator":"Results / device fabrication","note":"ITO/np-SnO₂/Cs₀.₀₅FA₀.₈₁MA₀.₁₄PbI₂.₅₅Br₀.₄₅/掺杂 Spiro-OMeTAD/Au。"},{"id":"pvptaa","title":"Transition dipoles in hole-transporting materials","url":"https://www.nature.com/articles/s41467-018-06998-1","kind":"原始研究","locator":"Methods / device architecture","note":"ITO/NiOₓ/掺杂 PTAA/MAPbI₃/PCBM/ZnO/Al；不能省去 NiOₓ。"},{"id":"gdcfuel","title":"Gadolinium-doped ceria-based solid oxide fuel cells","url":"https://www.nature.com/articles/ncomms5045","kind":"原始研究","locator":"Methods / single cells","note":"Ni–GDC/GDC10/BSCF–GDC 核壳纤维氧电极；原研究 H₂/空气，微结构与热处理限定。"},{"id":"gdcbarrier","title":"Infiltrated solid oxide electrochemical cell electrodes","url":"https://onlinelibrary.wiley.com/doi/full/10.1002/smll.202506595","kind":"原始研究","locator":"Experimental / single cells","note":"Ni–YSZ/YSZ/GDC/LSCF；GDC 是氧电极侧扩散阻挡层，不等于纯 GDC 电解质。"}]);
Object.assign(materials,{"nmc111":{"id":"nmc111","label":"三元层状正极 · NMC111","source":"lifop","note":"LiNi₁/₃Co₁/₃Mn₁/₃O₂。选用该研究的 MCMB 负极与碳酸酯对照电解液。","stage":"研究配对 / 条件限定"},"nmc532":{"id":"nmc532","label":"三元层状正极 · NMC532","source":"nmc532gen2","note":"LiNi₀.₅Mn₀.₃Co₀.₂O₂。与石墨及 Gen2 电解液组成研究配对。","stage":"研究配对 / 条件限定"},"graphite_natural":{"id":"graphite_natural","label":"天然石墨负极","source":"lifop","note":"该研究的天然石墨 / LFP 配对；颗粒与表面处理仍依具体材料。","stage":"研究配对 / 条件限定"},"mcmb":{"id":"mcmb","label":"中间相碳微球 · MCMB","source":"lifop","note":"球形石墨化碳路线；本目录采用 MCMB / NMC111 研究配对。","stage":"研究配对 / 条件限定"},"lipf6_ecemc_volume":{"id":"lipf6_ecemc_volume","label":"LiPF₆ / EC–EMC · 3:7 体积比","source":"lifop","note":"1.2 M LiPF₆，EC/EMC 3:7 体积比。区别于质量比配方。","stage":"研究配对 / 条件限定"},"lipf6_ecemc_mass":{"id":"lipf6_ecemc_mass","label":"Gen2 · LiPF₆ / EC–EMC 质量比","source":"nmc532gen2","note":"1.2 M LiPF₆，EC/EMC 3:7 质量比；限定 NMC532 / 石墨。","stage":"研究配对 / 条件限定"},"hc_sucrose_spheres":{"id":"hc_sucrose_spheres","label":"蔗糖衍生超微孔硬碳球 · HCMS","source":"hcms","note":"蔗糖来源的特定球形硬碳，配对 NVP 与 NaClO₄ 碳酸酯电解液。","stage":"研究配对 / 条件限定"},"hc_ns_1300fca":{"id":"hc_ns_1300fca","label":"N/S 掺杂硬碳 · 1300-FCA","source":"hcns","note":"果糖、L-半胱氨酸与过硫酸铵路线；全电池使用已活化负极，配对 NVP 与醚系电解液。","stage":"研究配对 / 条件限定"},"naclo4_ecpc":{"id":"naclo4_ecpc","label":"NaClO₄ / EC–PC","source":"hcms","note":"1 M NaClO₄，EC/PC 1:1 体积比；仅用于 HCMS / NVP 研究配对。","stage":"研究配对 / 条件限定"},"napf6_diglyme":{"id":"napf6_diglyme","label":"NaPF₆ / 二甘醚","source":"hcns","note":"1 M NaPF₆ / diglyme，限定已活化 1300-FCA / NVP 全电池。","stage":"研究配对 / 条件限定"},"v2o5_aqzn":{"id":"v2o5_aqzn","label":"五氧化二钒 · V₂O₅","source":"znqd","note":"温和水系锌研究正极；使用锌箔和含 C₃N₄ 量子点的 2 M ZnSO₄，添加剂浓度需随试样记录。","stage":"研究配对 / 条件限定"},"nvo_hydrate":{"id":"nvo_hydrate","label":"水合钒酸钠 · NaV₃O₈·1.5H₂O","source":"nvo","note":"水系锌中的层状钒酸盐，含钠不代表适用于钠离子电池。配对锌和 1+1 M 双盐水溶液。","stage":"研究配对 / 条件限定"},"vhcf_aqzn":{"id":"vhcf_aqzn","label":"钒基六氰合铁酸盐 · VHCF","source":"vhcf","note":"水系锌 PBA 研究路线，配对锌与 2+1 M 双盐；与钠体系普鲁士白分开。","stage":"研究配对 / 条件限定"},"znso4_c3n4qd":{"id":"znso4_c3n4qd","label":"ZnSO₄ / C₃N₄ 量子点","source":"znqd","note":"2 M ZnSO₄ 与 C₃N₄ 量子点添加剂；原文比较多种浓度，不能视为单一通用配方。","stage":"研究配对 / 条件限定"},"znna_sulfate_11":{"id":"znna_sulfate_11","label":"ZnSO₄ / Na₂SO₄ · 1+1 M","source":"nvo","note":"1 M ZnSO₄ + 1 M Na₂SO₄ 水溶液；限定 NaV₃O₈·1.5H₂O / 锌。","stage":"研究配对 / 条件限定"},"znna_sulfate_21":{"id":"znna_sulfate_21","label":"ZnSO₄ / Na₂SO₄ · 2+1 M","source":"vhcf","note":"2 M ZnSO₄ + 1 M Na₂SO₄ 水溶液；限定 VHCF / 锌。","stage":"研究配对 / 条件限定"},"pv_mapbi3":{"id":"pv_mapbi3","label":"甲胺铅碘钙钛矿 · MAPbI₃","source":"pvtio2","note":"CH₃NH₃PbI₃ 吸光层；可选该来源的 TiO₂/Spiro 或另一来源的 NiOₓ/PTAA+PCBM/ZnO 完整接触组。","stage":"研究配对 / 条件限定"},"pv_triple_spray":{"id":"pv_triple_spray","label":"三阳离子钙钛矿 · 喷涂配方","source":"pvspray","note":"Cs₀.₀₅FA₀.₈₁MA₀.₁₄PbI₂.₅₅Br₀.₄₅。器件层序为 ITO/SnO₂/吸光层/掺杂 Spiro/Au。","stage":"研究配对 / 条件限定"},"pv_tio2_spiro":{"id":"pv_tio2_spiro","label":"TiO₂ / Spiro-OMeTAD 接触组","source":"pvtio2","note":"FTO/致密+介孔 TiO₂/MAPbI₃/Spiro-OMeTAD/Au；n–i–p 研究器件。模型展示功能分区，未逐层复现工艺。","stage":"研究配对 / 条件限定"},"pv_sno2_spiro":{"id":"pv_sno2_spiro","label":"SnO₂ / Spiro-OMeTAD 接触组","source":"pvspray","note":"ITO/np-SnO₂/指定三阳离子吸光层/掺杂 Spiro/Au；n–i–p 喷涂研究器件。模型展示功能分区。","stage":"研究配对 / 条件限定"},"pv_niox_ptaa_pcbm_zno":{"id":"pv_niox_ptaa_pcbm_zno","label":"NiOₓ / PTAA + PCBM / ZnO 接触组","source":"pvptaa","note":"ITO/NiOₓ/掺杂 PTAA/MAPbI₃/PCBM/ZnO/Al；p–i–n 研究器件，NiOₓ 不可省略。模型不表示完整工艺层序。","stage":"研究配对 / 条件限定"},"gdc10":{"id":"gdc10","label":"钆掺杂氧化铈 · GDC10","source":"gdcfuel","note":"Gd₀.₁Ce₀.₉O₁.₉₅ 电解质；限定 Ni–GDC / BSCF–GDC 电极组，还原气氛中的电子导电需核验。","stage":"研究配对 / 条件限定"},"ni_gdc":{"id":"ni_gdc","label":"Ni–GDC 金属陶瓷燃料电极","source":"gdcfuel","note":"镍与 GDC 复合燃料侧，采用原研究 H₂/空气工况；不推定任意烃燃料适用性。","stage":"研究配对 / 条件限定"},"bscf_gdc_fiber":{"id":"bscf_gdc_fiber","label":"BSCF–GDC 核壳纤维氧电极","source":"gdcfuel","note":"Ba₀.₅Sr₀.₅Co₀.₈Fe₀.₂O₃−δ/GDC 核壳纤维；模型只示功能层，不表示纤维微结构。","stage":"研究配对 / 条件限定"},"ysz_gdc_barrier":{"id":"ysz_gdc_barrier","label":"YSZ 电解质 + GDC 阻挡层","source":"gdcbarrier","note":"Ni–YSZ/YSZ/GDC/LSCF 完整层组；GDC 位于氧电极界面。模型按电解质功能合并显示，未独立展示阻挡层厚度。","stage":"研究配对 / 条件限定"}});
materials.nvo_hydrate.relatedSources=['nvocorrection'];
const researchIds=new Set(["nmc111","nmc532","graphite_natural","mcmb","lipf6_ecemc_volume","lipf6_ecemc_mass","hc_sucrose_spheres","hc_ns_1300fca","naclo4_ecpc","napf6_diglyme","v2o5_aqzn","nvo_hydrate","vhcf_aqzn","znso4_c3n4qd","znna_sulfate_11","znna_sulfate_21","pv_mapbi3","pv_triple_spray","pv_tio2_spiro","pv_sno2_spiro","pv_niox_ptaa_pcbm_zno","gdc10","ni_gdc","bscf_gdc_fiber","ysz_gdc_barrier"]);
export const materialPairings=[{"profile":"liion","cathode":"nmc111","anode":"mcmb","electrolyte":"lipf6_ecemc_volume","packaging":null,"source":"lifop"},{"profile":"liion","cathode":"lfp","anode":"graphite_natural","electrolyte":"lipf6_ecemc_volume","packaging":null,"source":"lifop"},{"profile":"liion","cathode":"nmc532","anode":"graphite","electrolyte":"lipf6_ecemc_mass","packaging":null,"source":"nmc532gen2"},{"profile":"sodium","cathode":"nvp","anode":"hc_sucrose_spheres","electrolyte":"naclo4_ecpc","packaging":null,"source":"hcms"},{"profile":"sodium","cathode":"nvp","anode":"hc_ns_1300fca","electrolyte":"napf6_diglyme","packaging":null,"source":"hcns"},{"profile":"aqueouszn","cathode":"v2o5_aqzn","anode":"zinc","electrolyte":"znso4_c3n4qd","packaging":["coin"],"source":"znqd"},{"profile":"aqueouszn","cathode":"nvo_hydrate","anode":"zinc","electrolyte":"znna_sulfate_11","packaging":["coin","pouch"],"source":"nvo"},{"profile":"aqueouszn","cathode":"vhcf_aqzn","anode":"zinc","electrolyte":"znna_sulfate_21","packaging":["coin"],"source":"vhcf"},{"profile":"solar_perovskite","cathode":"pv_mapbi3","anode":"pv_tio2_spiro","electrolyte":"","packaging":null,"source":"pvtio2"},{"profile":"solar_perovskite","cathode":"pv_mapbi3","anode":"pv_niox_ptaa_pcbm_zno","electrolyte":"","packaging":null,"source":"pvptaa"},{"profile":"solar_perovskite","cathode":"pv_triple_spray","anode":"pv_sno2_spiro","electrolyte":"","packaging":null,"source":"pvspray"},{"profile":"sofc","cathode":"bscf_gdc_fiber","anode":"ni_gdc","electrolyte":"gdc10","packaging":null,"source":"gdcfuel"},{"profile":"sofc","cathode":"lscf","anode":"niysz","electrolyte":"ysz_gdc_barrier","packaging":null,"source":"gdcbarrier"}];
// Expanded material forms and source-bound device stacks.
sources.push(...[
  {
    "id": "nabob2025",
    "title": "Effect of additives on a NaBOB/TEP electrolyte in sodium-ion batteries",
    "url": "https://www.nature.com/articles/s42004-025-01515-0",
    "kind": "原始研究",
    "locator": "Methods / PW–HC pouch cells",
    "note": "普鲁士白/硬碳软包；比较 NaBOB/TEP 与 3 wt% PES 添加剂，保留温度和配平条件。"
  },
  {
    "id": "hnse2023",
    "title": "Boosting interfacial conduction of halide solid electrolytes",
    "url": "https://www.nature.com/articles/s41467-023-38037-z",
    "kind": "原始研究",
    "locator": "Methods / Fig.5",
    "note": "HNSE 复合正极、Li₆PS₅Cl 隔离层和 Li–In；原文使用受压实验电池，封装仅示意。"
  },
  {
    "id": "thinlmo1994",
    "title": "ORNL · Thin-film Li/LiPON/LiMn₂O₄ cells",
    "url": "https://www.osti.gov/servlets/purl/70788",
    "kind": "国家实验室原始研究",
    "locator": "CONF-9410309--4 / Cell fabrication",
    "note": "比较结晶与非晶锰酸锂薄膜；LiPON 与蒸镀锂负极组成薄膜器件。"
  },
  {
    "id": "silvermanual",
    "title": "Energizer · Silver Oxide Handbook",
    "url": "https://data.energizer.com/pdfs/silveroxide_appman.pdf",
    "kind": "厂家技术手册",
    "locator": "Chemistry / construction",
    "note": "Ag₂O/锌可采用 KOH 或 NaOH；正极包含导电组分。旧手册配方不作为无汞产品声明。"
  },
  {
    "id": "nimhalloys",
    "title": "Panasonic · Ni-MH battery electrode chemistry",
    "url": "https://energy.panasonic.com/dam/master/pdf/eu/material/Panasonic%20Ni-MH%20Batteries%20Handbook.pdf",
    "kind": "厂家技术手册",
    "locator": "Electrochemistry / negative electrode",
    "note": "区分稀土镍系 AB₅ 与钛镍系 AB₂ 储氢合金，不把单质镍原料视为合金成品。"
  },
  {
    "id": "zincairhandbook",
    "title": "Energizer · Zinc Air Prismatic Handbook",
    "url": "https://data.energizer.com/pdfs/zincairprismatichandbook.pdf",
    "kind": "厂家技术手册",
    "locator": "§1.1–1.2 / construction",
    "note": "说明薄碳空气电极与空气分配层；与助听器纽扣电池原理相通，不移植方形产品参数。"
  },
  {
    "id": "afcnasa",
    "title": "NASA · Hydrogen–oxygen fuel-cell electrode design",
    "url": "https://ntrs.nasa.gov/api/citations/19900006119/downloads/19900006119.pdf",
    "kind": "NASA 官方资料",
    "locator": "§5.5 / electrodes",
    "note": "历史设计采用 Raney 镍燃料电极与 Raney 银氧电极；属于设计材料依据。"
  },
  {
    "id": "fuelcomponents",
    "title": "DOE/NETL · Fuel Cell Handbook, component materials",
    "url": "https://www.govinfo.gov/content/pkg/GOVPUB-E-PURL-LPS115918/pdf/GOVPUB-E-PURL-LPS115918.pdf",
    "kind": "政府技术手册",
    "locator": "Ch.5 / Table 6-1",
    "note": "PAFC 的 Pt 黑与碳载 Pt/PTFE；MCFC 的 Ni–Cr、Ni–Al 和 Li/K、Li/Na 碳酸盐。手册年代与具体工况保留。"
  },
  {
    "id": "topcon2024",
    "title": "Highly passivated TOPCon bottom cells for perovskite/silicon tandems",
    "url": "https://www.nature.com/articles/s41467-024-52309-2",
    "kind": "原始研究",
    "locator": "Methods / TOPCon bottom-cell tests",
    "note": "采用原文独立测试的双面 TOPCon 硅底电池层组，不套用钙钛矿叠层效率。"
  },
  {
    "id": "cdsete2022",
    "title": "Polycrystalline Cd(Se,Te) cells with a front-junction composition gradient",
    "url": "https://www.nature.com/articles/s41467-022-35442-8",
    "kind": "原始研究",
    "locator": "Methods / Fig.2",
    "note": "氧化 CdS/CdSe 前驱层与 CdTe 形成梯度吸光层，配 CuSCN/Au 背接触。"
  },
  {
    "id": "pvfa2025",
    "title": "Fully chemical interface engineering for stable perovskite solar cells",
    "url": "https://www.nature.com/articles/s41467-025-63588-8",
    "kind": "原始研究",
    "locator": "Methods / Figs.3–4",
    "note": "FAPbI₃ 器件对比 SnO₂ 与 SnO₂-DTPA/Zol 界面；保留 PEAI 表面处理和掺杂 Spiro 层。"
  },
  {
    "id": "opv2022",
    "title": "Vertically optimized phase separation in thick organic solar cells",
    "url": "https://www.nature.com/articles/s41467-022-29803-6",
    "kind": "原始研究",
    "locator": "Methods / device fabrication",
    "note": "PM6:Y6 与 PM6:BTP-eC9 二元体系使用 PEDOT:PSS/PNDIT-F3N 接触组；不套用三元或逐层加工结果。"
  },
  {
    "id": "iiivnrel",
    "title": "NREL · Inverted monolithic GaInP/GaAs/InGaAs tandem solar cells",
    "url": "https://www1.eere.energy.gov/solar/review_meeting/pdfs/p_40_geisz_nrel.pdf",
    "kind": "国家实验室原始研究",
    "locator": "Technical approach / Fig.1",
    "note": "倒置三结通过 AlGaAs/GaAs 隧道结串联，包含变晶缓冲层与转移支撑。"
  },
  {
    "id": "leadtraction",
    "title": "GS Yuasa · Traction battery electrode construction",
    "url": "https://www.gs-yuasa.com/en/products/pdf/TRACTION_BATTERY_2017_FINAL.pdf",
    "kind": "厂家技术手册",
    "locator": "Tubular positive / flat negative",
    "note": "管式正极用耐酸套管约束活性物质，配平板负极和富液硫酸。"
  },
  {
    "id": "nadry2025",
    "title": "Integrating dry-processing and pre-sodiation for sodium-ion batteries",
    "url": "https://www.nature.com/articles/s41467-025-66492-3",
    "kind": "原始研究",
    "locator": "Methods / Fig.7",
    "note": "NVP/硬碳纽扣全电池；正极含牺牲草酸钠，使用 NaClO₄/EC–DEC/FEC，醚系半电池配方不混入。"
  },
  {
    "id": "rtgmaterials",
    "title": "NASA · Radioisotope Power Systems Reference Book",
    "url": "https://ntrs.nasa.gov/api/citations/20160001769/downloads/20160001769.pdf",
    "kind": "NASA 官方资料",
    "locator": "RTG thermoelectric technologies",
    "note": "区分 SiGe 与 PbTe/TAGS 热电材料的历史系统用途，不能互换后沿用 MMRTG 功率。"
  },
  {
    "id": "betamaterials",
    "title": "Optimal semiconductors for ³H and ⁶³Ni betavoltaics",
    "url": "https://www.nature.com/articles/s41598-019-47371-6",
    "kind": "原始研究",
    "locator": "Monte Carlo / theoretical comparison",
    "note": "GaAs、GaN 为理论半导体候选；该来源不能证明已制成器件的效率或功率。"
  },
  {
    "id": "naoxsupp",
    "title": "RAHC sodium oxide · original supplementary methods",
    "url": "https://media.springernature.com/original/springer-static/esm/art%3A10.1038%2Fncomms7865/MediaObjects/41467_2015_BFncomms7865_MOESM267_ESM.pdf",
    "kind": "原始研究补充资料",
    "locator": "Supplementary Methods / S1–S2",
    "note": "RAHC 与均匀成分对照配预钠化硬碳；0.5 M NaPF₆/EMS–FEC 98:2 体积比，纽扣结构。"
  },
  {
    "id": "znnp2022",
    "title": "Phase-transition tailored nanoporous zinc electrodes",
    "url": "https://www.nature.com/articles/s41467-022-30616-w",
    "kind": "原始研究",
    "locator": "Methods / Figs.2,3,5",
    "note": "NiOOH/纳米多孔锌与锌粉对照使用指定碱液；纽扣全电池与原位三电极照片的条件分开。"
  }
]);
const expandedMaterials={
  "graphite_pvdf_hv": {
    "id": "graphite_pvdf_hv",
    "label": "天然石墨 / PVDF 高压研究电极",
    "source": "lnmo",
    "stage": "原始研究 / 完整配对",
    "note": "天然石墨与 PVDF 90:10 质量比，涂覆铜箔；限定 LNMO 与 1:1.1 LiFSI/DMC 纽扣全电池。"
  },
  "lifsi_dmc_11": {
    "id": "lifsi_dmc_11",
    "label": "LiFSI / DMC · 1:1.1 摩尔比",
    "source": "lnmo",
    "stage": "原始研究 / 完整配对",
    "note": "盐与溶剂摩尔比 1:1.1；LiFSA 是原文对 LiFSI 的命名，不代表另一个盐。"
  },
  "na_rahc": {
    "id": "na_rahc",
    "label": "径向柱状梯度 O3 · RAHC",
    "source": "naoxsupp",
    "stage": "原始研究 / 完整配对",
    "note": "平均成分 NaNi₀.₆₀Co₀.₀₅Mn₀.₃₅O₂，内部至表面具有成分梯度；保留预钠化负极。"
  },
  "na_bulk_ncm": {
    "id": "na_bulk_ncm",
    "label": "均匀成分 O3 颗粒 · 对照",
    "source": "naoxsupp",
    "stage": "原始研究 / 完整配对",
    "note": "NaNi₀.₆₀Co₀.₀₅Mn₀.₃₅O₂ 均匀成分对照；与梯度柱状材料比较，不沿用其循环增益。"
  },
  "hc_presodiated_rahc": {
    "id": "hc_presodiated_rahc",
    "label": "预钠化硬碳 · RAHC 配对",
    "source": "naoxsupp",
    "stage": "原始研究 / 完整配对",
    "note": "原研究负极先补充钠库存，不能当作未经处理硬碳；补钠量和 N/P 配比属于完整试样。"
  },
  "na_ems": {
    "id": "na_ems",
    "label": "NaPF₆ / EMS–FEC · 98:2 体积比",
    "source": "naoxsupp",
    "stage": "原始研究 / 完整配对",
    "note": "0.5 M NaPF₆，甲磺酸乙酯 EMS 与 FEC 98:2 体积比；限定层状氧化物研究组。"
  },
  "nabob_tep": {
    "id": "nabob_tep",
    "label": "NaBOB / 磷酸三乙酯",
    "source": "nabob2025",
    "stage": "原始研究 / 完整配对",
    "note": "0.35 M NaBOB/TEP，无 PES 添加剂的研究对照；限定普鲁士白/硬碳软包。"
  },
  "nabob_tep_pes": {
    "id": "nabob_tep_pes",
    "label": "NaBOB / TEP + PES",
    "source": "nabob2025",
    "stage": "原始研究 / 完整配对",
    "note": "0.35 M NaBOB/TEP + 3 wt% PES；添加剂影响依温度与完整电极组，不自动赋予寿命增益。"
  },
  "hnse_lzc_lpscl": {
    "id": "hnse_lzc_lpscl",
    "label": "ZrO₂–Li₂ZrCl₆ / LPSCl 功能组",
    "source": "hnse2023",
    "stage": "原始研究 / 完整配对",
    "note": "正极复合相为 ZrO₂–2Li₂ZrCl₆，保留 Li₆PS₅Cl 隔离层与 Li–In 复合负极；原文受压电池。"
  },
  "hnse_lzcf_lpscl": {
    "id": "hnse_lzcf_lpscl",
    "label": "ZrO₂–Li₂ZrCl₅F / LPSCl 功能组",
    "source": "hnse2023",
    "stage": "原始研究 / 完整配对",
    "note": "氟取代 HNSE 正极复合相，搭配 LPSCl 隔离层与 Li–In；不是纯卤化物直接接触裸锂。"
  },
  "ncm88_single": {
    "id": "ncm88_single",
    "label": "单晶层状正极 · S-NCM88",
    "source": "hnse2023",
    "stage": "原始研究 / 完整配对",
    "note": "LiNi₀.₈₈Co₀.₁₁Mn₀.₀₁O₂；限定氟取代 HNSE/LPSCl/Li–In 原文材料组。"
  },
  "lmo_crystalline_film": {
    "id": "lmo_crystalline_film",
    "label": "结晶锰酸锂薄膜",
    "source": "thinlmo1994",
    "stage": "原始研究 / 完整配对",
    "note": "退火结晶的 LiMn₂O₄ 薄膜，与 LiPON/蒸镀锂组成器件；不是粉末涂布厚电极。"
  },
  "lmo_amorphous_film": {
    "id": "lmo_amorphous_film",
    "label": "非晶锰酸锂薄膜",
    "source": "thinlmo1994",
    "stage": "原始研究 / 完整配对",
    "note": "低温沉积的非晶锰酸锂膜；与结晶膜的相态和放电特征不同，不共享性能参数。"
  },
  "gel_pe_control": {
    "id": "gel_pe_control",
    "label": "PVDF-HFP / ETPTA 凝胶 · PE",
    "source": "gel",
    "stage": "原始研究 / 完整配对",
    "note": "原文无 PAN、无 LLZTO 的 PE 对照，含 LiClO₄；与 LFP/锂组成纽扣电池。"
  },
  "gel_ppe_control": {
    "id": "gel_ppe_control",
    "label": "PVDF-HFP / PAN 凝胶 · PPE",
    "source": "gel",
    "stage": "原始研究 / 完整配对",
    "note": "加入 PAN 的双聚合物对照，不含 LLZTO 填料；保留 ETPTA 交联与凝胶含液相属性。"
  },
  "cfx_coin_disc": {
    "id": "cfx_coin_disc",
    "label": "CFₓ 片状正极 · BR 纽扣结构",
    "source": "panprimary",
    "stage": "厂家结构 / 形态选项",
    "note": "BR 纽扣剖面的片状氟化碳电极；具体粘结剂与盐配方未披露，不能据此推算容量。"
  },
  "fes2_al_foil": {
    "id": "fes2_al_foil",
    "label": "FeS₂ / 铝箔卷绕电极",
    "source": "fes2",
    "stage": "厂家结构 / 形态选项",
    "note": "厂家结构中 FeS₂ 正极涂层由铝箔承载并卷绕；这是复合电极形态，不是块状黄铁矿。"
  },
  "zinc_alloy_can": {
    "id": "zinc_alloy_can",
    "label": "锌合金壳负极 · 锌碳",
    "source": "carbonzinc",
    "stage": "厂家结构 / 形态选项",
    "note": "高纯锌合金壳同时承担负极与容器功能；合金微量配方依厂家，不当作普通锌凝胶。"
  },
  "zncl2_paste": {
    "id": "zncl2_paste",
    "label": "氯化锌主导糊状电解质",
    "source": "carbonzinc",
    "stage": "厂家结构 / 形态选项",
    "note": "氯化锌型干电池路线，以 ZnCl₂ 为主，可含少量 NH₄Cl；区别于铵盐主导的 Leclanché 配方。"
  },
  "znso4_2m_control": {
    "id": "znso4_2m_control",
    "label": "2 M ZnSO₄ · 无量子点对照",
    "source": "znqd",
    "stage": "原始研究 / 完整配对",
    "note": "V₂O₅/锌纽扣研究的基准电解液，不含 C₃N₄ 量子点；不能沿用添加剂组的界面表现。"
  },
  "niooh_research": {
    "id": "niooh_research",
    "label": "NiOOH 充电态电极 · 镍锌研究",
    "source": "znnp2022",
    "stage": "原始研究 / 完整配对",
    "note": "原研究取自已充电 NiMH 电池的正极，采用过量正极；该试验不是实用整电池能量密度证明。"
  },
  "zn_nanoporous": {
    "id": "zn_nanoporous",
    "label": "纳米多孔锌 / 镀锡铜泡沫",
    "source": "znnp2022",
    "stage": "原始研究 / 完整配对",
    "note": "互连锌骨架支撑于镀锡铜泡沫；与商业锌粉对照具有不同孔隙和电子连通结构。"
  },
  "zn_powder_ptfe": {
    "id": "zn_powder_ptfe",
    "label": "锌粉 / PTFE · 泡沫载体对照",
    "source": "znnp2022",
    "stage": "原始研究 / 完整配对",
    "note": "商业锌粉与 PTFE 9:1 质量比涂覆同种载体；对照并不具有纳米多孔锌的循环表现。"
  },
  "koh_lioh_nizn": {
    "id": "koh_lioh_nizn",
    "label": "6 M KOH / 1 M LiOH · 镍锌",
    "source": "znnp2022",
    "stage": "原始研究 / 完整配对",
    "note": "原文 40% 放电深度试验还含负极侧 Ca(OH)₂ 添加条件；模型合并表示配方组，未预测寿命。"
  },
  "koh_zno_nizn": {
    "id": "koh_zno_nizn",
    "label": "9 M KOH / ZnO 饱和 · 镍锌",
    "source": "znnp2022",
    "stage": "原始研究 / 完整配对",
    "note": "原文纳米多孔锌的 60% 放电深度配方；与 6 M KOH/LiOH 试验分开。"
  },
  "raney_ag_afc": {
    "id": "raney_ag_afc",
    "label": "Raney 银多孔氧电极",
    "source": "afcnasa",
    "stage": "历史设计 / 结构参考",
    "note": "NASA 设计中的 Raney 银/镍支撑氧电极，配 Raney 镍和 KOH；不借用酸性燃料电池的铂配方。"
  },
  "raney_ni_afc": {
    "id": "raney_ni_afc",
    "label": "Raney 镍多孔燃料电极",
    "source": "afcnasa",
    "stage": "历史设计 / 结构参考",
    "note": "历史氢氧碱性燃料电池的多孔 Raney 镍路线；元素镍图片只可作为原料参照。"
  },
  "ptblack_ptfe_pafc": {
    "id": "ptblack_ptfe_pafc",
    "label": "Pt 黑 / PTFE 多孔电极",
    "source": "fuelcomponents",
    "stage": "历史设计 / 结构参考",
    "note": "手册记录的早期 PAFC 无碳载体 Pt 黑电极；保留磷酸体系，非当代低铂载量性能承诺。"
  },
  "ptc_ptfe_pafc": {
    "id": "ptc_ptfe_pafc",
    "label": "碳载 Pt / PTFE · PAFC",
    "source": "fuelcomponents",
    "stage": "手册材料 / 结构参考",
    "note": "碳载铂与 PTFE 构成多孔电极，配磷酸/SiC 基体；区别于 PEM 的离聚物催化层。"
  },
  "ni_cr_mcfc": {
    "id": "ni_cr_mcfc",
    "label": "Ni–Cr 多孔燃料电极",
    "source": "fuelcomponents",
    "stage": "手册材料 / 结构参考",
    "note": "MCFC 镍铬合金路线，用于保持高温多孔骨架；铬含量与稳定性依设计。"
  },
  "ni_al_mcfc": {
    "id": "ni_al_mcfc",
    "label": "Ni–Al 多孔燃料电极",
    "source": "fuelcomponents",
    "stage": "手册材料 / 结构参考",
    "note": "MCFC 镍铝路线，与 Ni–Cr 的高温形变和化学行为不同；不将镍原料图标为合金成品。"
  },
  "mcfc_lik": {
    "id": "mcfc_lik",
    "label": "Li₂CO₃ / K₂CO₃ · 62:38 mol%",
    "source": "fuelcomponents",
    "stage": "手册材料 / 结构参考",
    "note": "锂钾碳酸盐熔体固定于 LiAlO₂ 基体；62:38 是摩尔比例，不是质量比例。"
  },
  "mcfc_lina": {
    "id": "mcfc_lina",
    "label": "Li₂CO₃ / Na₂CO₃ · 60:40 mol%",
    "source": "fuelcomponents",
    "stage": "手册材料 / 结构参考",
    "note": "手册记录的锂钠熔融碳酸盐路线，保留 LiAlO₂ 基体；不与锂钾熔体共用工作参数。"
  },
  "si_topcon_contacts": {
    "id": "si_topcon_contacts",
    "label": "双面 TOPCon 多晶硅选择性接触",
    "source": "topcon2024",
    "stage": "原始研究 / 完整配对",
    "note": "n 型晶硅配前侧 p⁺、背侧 n⁺ 多晶硅，独立底电池含 ITO 与金属接触；不含钙钛矿顶电池。"
  },
  "si_tunnel_oxide": {
    "id": "si_tunnel_oxide",
    "label": "TOPCon 双面超薄 SiOₓ",
    "source": "topcon2024",
    "stage": "原始研究 / 完整配对",
    "note": "隧穿氧化层与掺杂多晶硅共同工作；原文工艺氢化层与最终工作区层序需区分。"
  },
  "cdsete_gradient": {
    "id": "cdsete_gradient",
    "label": "梯度 Cd(Se,Te) 吸光层",
    "source": "cdsete2022",
    "stage": "原始研究 / 完整配对",
    "note": "氧化 CdSe 与 CdTe 互扩散形成吸光层，前结包含 Cd(O,S,Se,Te) 区；不是纯 CdTe。"
  },
  "cdsete_contacts": {
    "id": "cdsete_contacts",
    "label": "FTO / CuSCN–Au 接触组",
    "source": "cdsete2022",
    "stage": "原始研究 / 完整配对",
    "note": "前侧 FTO 与后侧 CuSCN/Au 配指定梯度吸光层；冠军样品另含玻璃侧 MgF₂ 减反层。"
  },
  "cdos_window": {
    "id": "cdos_window",
    "label": "含氧 CdS 窗口 / 前结功能层",
    "source": "cdsete2022",
    "stage": "原始研究 / 完整配对",
    "note": "Cd(O,S) 前驱窗口与含氧 CdSe 路线共同形成前结；模型按功能分组，不逐层复现互扩散。"
  },
  "pv_fapbi3": {
    "id": "pv_fapbi3",
    "label": "甲脒铅碘钙钛矿 · FAPbI₃",
    "source": "pvfa2025",
    "stage": "原始研究 / 完整配对",
    "note": "与原文 SnO₂ 控制组或 DTPA/Zol 改性接触组配对，保留 PEAI 表面处理。"
  },
  "pv_sno2_spiro_control": {
    "id": "pv_sno2_spiro_control",
    "label": "SnO₂ / PEAI / Spiro 接触组 · 对照",
    "source": "pvfa2025",
    "stage": "原始研究 / 完整配对",
    "note": "FTO/SnO₂/FAPbI₃/PEAI/掺杂 Spiro/Au 控制组；不包含 DTPA/Zol 的改性增益。"
  },
  "pv_sno2_dtpa_zol_spiro": {
    "id": "pv_sno2_dtpa_zol_spiro",
    "label": "SnO₂-DTPA / Zol / Spiro 接触组",
    "source": "pvfa2025",
    "stage": "原始研究 / 完整配对",
    "note": "SnO₂ 内引入 DTPA 并在表面加入 Zol，搭配 FAPbI₃/PEAI/掺杂 Spiro/Au 完整器件。"
  },
  "opv_pm6_y6": {
    "id": "opv_pm6_y6",
    "label": "PM6:Y6 二元有机吸光层",
    "source": "opv2022",
    "stage": "原始研究 / 完整配对",
    "note": "非富勒烯给受体二元混合层，配原文 PEDOT:PSS/PNDIT-F3N 接触；厚度和添加剂依试样。"
  },
  "opv_pm6_btpec9": {
    "id": "opv_pm6_btpec9",
    "label": "PM6:BTP-eC9 二元有机吸光层",
    "source": "opv2022",
    "stage": "原始研究 / 完整配对",
    "note": "BTP-eC9 受体与 PM6 组成二元层；图中的三元和逐层加工对照不是同一个材料组。"
  },
  "opv_pedot_pndit_contacts": {
    "id": "opv_pedot_pndit_contacts",
    "label": "PEDOT:PSS / PNDIT-F3N 接触组",
    "source": "opv2022",
    "stage": "原始研究 / 完整配对",
    "note": "完整层序为 ITO/PEDOT:PSS/指定二元吸光层/PNDIT-F3N/Ag，无液态电解质。"
  },
  "iii_v_inverted_tandem": {
    "id": "iii_v_inverted_tandem",
    "label": "GaInP / GaAs / InGaAs 倒置三结",
    "source": "iiivnrel",
    "stage": "原始研究 / 完整配对",
    "note": "三个子结与变晶缓冲层作为整组吸光结构，不能当作单层 GaAs 替代后沿用效率。"
  },
  "tandem_iiiv_contacts": {
    "id": "tandem_iiiv_contacts",
    "label": "AlGaAs / GaAs 隧道结与接触",
    "source": "iiivnrel",
    "stage": "原始研究 / 完整配对",
    "note": "隧道结串联三个子电池，包含金属接触与转移支撑；模型合并显示功能层。"
  },
  "pbo2_tubular": {
    "id": "pbo2_tubular",
    "label": "管式 PbO₂ 正极 / 耐酸套管",
    "source": "leadtraction",
    "stage": "厂家结构 / 形态选项",
    "note": "活性物质由管状耐酸套管约束，区别于涂膏平板；限定富液牵引电池结构。"
  },
  "pb_pasted_flat": {
    "id": "pb_pasted_flat",
    "label": "涂膏平板铅负极",
    "source": "leadtraction",
    "stage": "厂家结构 / 形态选项",
    "note": "与管式正极搭配的平板负极；板栅、涂膏和活性铅共同构成电极，不等同于铅块。"
  },
  "fse_planar": {
    "id": "fse_planar",
    "label": "平面 PEGDA / LLZTO / LiTFSI · f-SE",
    "source": "mu2024",
    "stage": "原始研究 / 完整配对",
    "note": "原文 Li/f-SE/LFP 平面电解质对照，没有 p-3DSE 柱阵列；不继承柱状组观察值。"
  },
  "pegda_litfsi_unfilled": {
    "id": "pegda_litfsi_unfilled",
    "label": "无陶瓷填料 PEGDA / LiTFSI",
    "source": "mu2024",
    "stage": "原始研究 / 完整配对",
    "note": "原文 Poly(PEGDA)/LiTFSI/LFP 对照，移除 LLZTO 陶瓷骨架；仍保留锂金属负极。"
  },
  "nanosilicon_p84": {
    "id": "nanosilicon_p84",
    "label": "纳米硅 / P84 聚酰亚胺电极",
    "source": "nmc532gen2",
    "stage": "原始研究 / 完整配对",
    "note": "硅、C45 与 P84 80:10:10 质量比；配 NMC811 与指定局部高浓度电解液，不是通用硅碳产品。"
  },
  "lhce_dmc_tte": {
    "id": "lhce_dmc_tte",
    "label": "LiFSI / DMC / TTE · LHCE1",
    "source": "nmc532gen2",
    "stage": "原始研究 / 完整配对",
    "note": "盐/溶剂/稀释剂摩尔比 1:2.2:3，限定纳米硅/NMC811 研究组；不作为 LNMO 电解液。"
  },
  "lhce_tms_tte": {
    "id": "lhce_tms_tte",
    "label": "LiFSI / TMS / TTE · LHCE2",
    "source": "nmc532gen2",
    "stage": "原始研究 / 完整配对",
    "note": "盐/环丁砜/稀释剂摩尔比 1:3:3；与 DMC 路线具有不同溶剂化条件。"
  },
  "nvp_dry_oxalate": {
    "id": "nvp_dry_oxalate",
    "label": "干法 NVP / 草酸钠补钠电极",
    "source": "nadry2025",
    "stage": "原始研究 / 完整配对",
    "note": "NVP、碳纤维、PTFE 与牺牲草酸钠形成干法复合正极；原文全电池有首次活化产气过程。"
  },
  "hc_dry_ptfe": {
    "id": "hc_dry_ptfe",
    "label": "干法硬碳 / 碳纤维 / PTFE",
    "source": "nadry2025",
    "stage": "原始研究 / 完整配对",
    "note": "硬碳/VGCF/PTFE 95:3:2 质量比，配补钠 NVP；不能省略首次钠损失与活化条件。"
  },
  "naclo4_ecdec_fec": {
    "id": "naclo4_ecdec_fec",
    "label": "NaClO₄ / EC–DEC + 5% FEC",
    "source": "nadry2025",
    "stage": "原始研究 / 完整配对",
    "note": "1 M NaClO₄，EC/DEC 1:1 体积比并加 5% FEC；原文干法硬碳/NVP 全电池配方。"
  },
  "alloy_ab5": {
    "id": "alloy_ab5",
    "label": "AB₅ 稀土镍系储氢合金",
    "source": "nimhalloys",
    "stage": "手册材料 / 结构参考",
    "note": "以稀土元素和镍构成的 AB₅ 类储氢相；多元素替代依型号，不能只用镍块代表。"
  },
  "alloy_ab2": {
    "id": "alloy_ab2",
    "label": "AB₂ 钛镍系储氢合金",
    "source": "nimhalloys",
    "stage": "手册材料 / 结构参考",
    "note": "厂家手册区分的 AB₂ 储氢合金路线；与 AB₅ 的组成和吸氢行为不同，不共用容量假设。"
  },
  "emd_graphite_ring": {
    "id": "emd_graphite_ring",
    "label": "电解 MnO₂ / 石墨压环",
    "source": "energizer",
    "stage": "厂家结构 / 形态选项",
    "note": "电解二氧化锰与石墨形成环状复合正极，围绕隔膜与锌凝胶；不是天然锰矿块。"
  },
  "zinc_powder_gel": {
    "id": "zinc_powder_gel",
    "label": "高比表面积锌粉凝胶",
    "source": "energizer",
    "stage": "厂家结构 / 形态选项",
    "note": "锌粉分散于碱性凝胶形成负极；粉体粒度、合金化和胶凝剂依产品，不由外观预测性能。"
  },
  "mno2_wound_primary": {
    "id": "mno2_wound_primary",
    "label": "MnO₂ 卷绕正极 · CR 圆柱",
    "source": "panprimary",
    "stage": "厂家结构 / 形态选项",
    "note": "CR 圆柱手册中的卷绕电极形态，配锂金属和一次锂有机电解液；仍不可充电。"
  },
  "naoh_silver": {
    "id": "naoh_silver",
    "label": "NaOH 水溶液 · 银锌",
    "source": "silvermanual",
    "stage": "手册材料 / 结构参考",
    "note": "氧化银/锌纽扣中的 NaOH 路线，区别于 KOH；输出与内阻依电池型号及负载。"
  },
  "ag2o_graphite": {
    "id": "ag2o_graphite",
    "label": "Ag₂O / 石墨复合正极",
    "source": "silvermanual",
    "stage": "手册材料 / 结构参考",
    "note": "氧化银与石墨导电组分形成复合正极；该形态不代表纯金属银片。"
  },
  "air_carbon_diffusion": {
    "id": "air_carbon_diffusion",
    "label": "薄碳空气电极 / 空气分配层",
    "source": "zincairhandbook",
    "stage": "手册材料 / 结构参考",
    "note": "把催化碳与空气分配功能层作为电极组表示；纽扣外形只示共通工作原理，非方形产品复刻。"
  },
  "ptc_pfsa_layer": {
    "id": "ptc_pfsa_layer",
    "label": "Pt/C / PFSA 离聚物催化层",
    "source": "doeparts",
    "stage": "手册材料 / 结构参考",
    "note": "碳载 Pt 颗粒与质子导电离聚物形成催化层，膜与气体扩散层仍是独立部件。"
  },
  "ni_gdc_afl": {
    "id": "ni_gdc_afl",
    "label": "Ni–GDC 支撑 / 纳米功能层",
    "source": "gdcfuel",
    "stage": "原始研究 / 完整配对",
    "note": "多孔 Ni–GDC 支撑上增加纳米复合阳极功能层，搭配 GDC10 与 BSCF–GDC 核壳纤维。"
  },
  "te_sige": {
    "id": "te_sige",
    "label": "SiGe 热电偶材料组",
    "source": "rtgmaterials",
    "stage": "核电源材料 / 系统依赖",
    "note": "NASA 的 MHW/GPHS 历史 RTG 采用硅锗热电路线；这里只比较转换材料，不改核源或套用 MMRTG 功率。"
  },
  "te_pbte_tags": {
    "id": "te_pbte_tags",
    "label": "PbTe / TAGS 热电偶材料组",
    "source": "rtgmaterials",
    "stage": "核电源材料 / 系统依赖",
    "note": "铅碲与 TAGS 体系用于特定 RTG 架构；热端、冷端和封装设计必须一并验证。"
  },
  "beta_gaas": {
    "id": "beta_gaas",
    "label": "GaAs β 伏打半导体 · 理论",
    "source": "betamaterials",
    "stage": "理论候选 / 非实测器件",
    "note": "原文模拟评估的 ⁶³Ni 半导体候选；不证明现成器件功率、效率或辐射安全。"
  },
  "beta_gan": {
    "id": "beta_gan",
    "label": "GaN β 伏打半导体 · 理论",
    "source": "betamaterials",
    "stage": "理论候选 / 非实测器件",
    "note": "宽带隙 GaN 在原文理论比较中作为候选；结质量、几何和源耦合尚需具体器件证据。"
  }
};
Object.assign(materials,expandedMaterials);
for(const id of Object.keys(expandedMaterials))researchIds.add(id);
materialPairings.push(...[
  {
    "profile": "liion_hv",
    "cathode": "lnmo",
    "anode": "graphite_pvdf_hv",
    "electrolyte": "lifsi_dmc_11",
    "packaging": [
      "coin"
    ],
    "source": "lnmo"
  },
  {
    "profile": "sodium_oxide",
    "cathode": "na_rahc",
    "anode": "hc_presodiated_rahc",
    "electrolyte": "na_ems",
    "packaging": [
      "coin"
    ],
    "source": "naoxsupp"
  },
  {
    "profile": "sodium_oxide",
    "cathode": "na_bulk_ncm",
    "anode": "hc_presodiated_rahc",
    "electrolyte": "na_ems",
    "packaging": [
      "coin"
    ],
    "source": "naoxsupp"
  },
  {
    "profile": "sodium_pba",
    "cathode": "prussianwhite",
    "anode": "hardcarbon",
    "electrolyte": "nabob_tep",
    "packaging": [
      "pouch"
    ],
    "source": "nabob2025"
  },
  {
    "profile": "sodium_pba",
    "cathode": "prussianwhite",
    "anode": "hardcarbon",
    "electrolyte": "nabob_tep_pes",
    "packaging": [
      "pouch"
    ],
    "source": "nabob2025"
  },
  {
    "profile": "solid_halide",
    "cathode": "lco",
    "anode": "liin",
    "electrolyte": "hnse_lzc_lpscl",
    "packaging": null,
    "source": "hnse2023"
  },
  {
    "profile": "solid_halide",
    "cathode": "lco",
    "anode": "liin",
    "electrolyte": "hnse_lzcf_lpscl",
    "packaging": null,
    "source": "hnse2023"
  },
  {
    "profile": "solid_halide",
    "cathode": "ncm88_single",
    "anode": "liin",
    "electrolyte": "hnse_lzcf_lpscl",
    "packaging": null,
    "source": "hnse2023"
  },
  {
    "profile": "thinbattery",
    "cathode": "lmo_crystalline_film",
    "anode": "lithium",
    "electrolyte": "lipon",
    "packaging": [
      "thinbattery"
    ],
    "source": "thinlmo1994"
  },
  {
    "profile": "thinbattery",
    "cathode": "lmo_amorphous_film",
    "anode": "lithium",
    "electrolyte": "lipon",
    "packaging": [
      "thinbattery"
    ],
    "source": "thinlmo1994"
  },
  {
    "profile": "gel",
    "cathode": "lfp",
    "anode": "lithium",
    "electrolyte": "gel_pe_control",
    "packaging": [
      "coin"
    ],
    "source": "gel"
  },
  {
    "profile": "gel",
    "cathode": "lfp",
    "anode": "lithium",
    "electrolyte": "gel_ppe_control",
    "packaging": [
      "coin"
    ],
    "source": "gel"
  },
  {
    "profile": "primary_cfx",
    "cathode": "cfx_coin_disc",
    "anode": "lithium",
    "electrolyte": "primaryorganic",
    "packaging": [
      "coin"
    ],
    "source": "panprimary"
  },
  {
    "profile": "primary_fes2",
    "cathode": "fes2_al_foil",
    "anode": "lithium",
    "electrolyte": "fes2electrolyte",
    "packaging": [
      "cylindrical"
    ],
    "source": "fes2"
  },
  {
    "profile": "carbonzinc",
    "cathode": "mno2",
    "anode": "zinc_alloy_can",
    "electrolyte": "nh4zncl",
    "packaging": [
      "carbonzinc"
    ],
    "source": "carbonzinc"
  },
  {
    "profile": "carbonzinc",
    "cathode": "mno2",
    "anode": "zinc_alloy_can",
    "electrolyte": "zncl2_paste",
    "packaging": [
      "carbonzinc"
    ],
    "source": "carbonzinc"
  },
  {
    "profile": "aqueouszn",
    "cathode": "v2o5_aqzn",
    "anode": "zinc",
    "electrolyte": "znso4_2m_control",
    "packaging": [
      "coin"
    ],
    "source": "znqd"
  },
  {
    "profile": "nizn",
    "cathode": "niooh_research",
    "anode": "zn_nanoporous",
    "electrolyte": "koh_lioh_nizn",
    "packaging": [
      "coin"
    ],
    "source": "znnp2022"
  },
  {
    "profile": "nizn",
    "cathode": "niooh_research",
    "anode": "zn_powder_ptfe",
    "electrolyte": "koh_lioh_nizn",
    "packaging": [
      "coin"
    ],
    "source": "znnp2022"
  },
  {
    "profile": "nizn",
    "cathode": "niooh_research",
    "anode": "zn_nanoporous",
    "electrolyte": "koh_zno_nizn",
    "packaging": [
      "coin"
    ],
    "source": "znnp2022"
  },
  {
    "profile": "afc",
    "cathode": "raney_ag_afc",
    "anode": "raney_ni_afc",
    "electrolyte": "koh",
    "packaging": [
      "afc"
    ],
    "source": "afcnasa"
  },
  {
    "profile": "pafc",
    "cathode": "ptblack_ptfe_pafc",
    "anode": "ptblack_ptfe_pafc",
    "electrolyte": "phosphoric",
    "packaging": [
      "pafc"
    ],
    "source": "fuelcomponents"
  },
  {
    "profile": "pafc",
    "cathode": "ptc_ptfe_pafc",
    "anode": "ptc_ptfe_pafc",
    "electrolyte": "phosphoric",
    "packaging": [
      "pafc"
    ],
    "source": "fuelcomponents"
  },
  {
    "profile": "mcfc",
    "cathode": "nio",
    "anode": "ni_cr_mcfc",
    "electrolyte": "mcfc_lik",
    "packaging": [
      "mcfc"
    ],
    "source": "fuelcomponents"
  },
  {
    "profile": "mcfc",
    "cathode": "nio",
    "anode": "ni_cr_mcfc",
    "electrolyte": "mcfc_lina",
    "packaging": [
      "mcfc"
    ],
    "source": "fuelcomponents"
  },
  {
    "profile": "mcfc",
    "cathode": "nio",
    "anode": "ni_al_mcfc",
    "electrolyte": "mcfc_lik",
    "packaging": [
      "mcfc"
    ],
    "source": "fuelcomponents"
  },
  {
    "profile": "mcfc",
    "cathode": "nio",
    "anode": "ni_al_mcfc",
    "electrolyte": "mcfc_lina",
    "packaging": [
      "mcfc"
    ],
    "source": "fuelcomponents"
  },
  {
    "profile": "solar_si",
    "cathode": "mono_si",
    "anode": "si_topcon_contacts",
    "electrolyte": "si_tunnel_oxide",
    "packaging": [
      "solar"
    ],
    "source": "topcon2024"
  },
  {
    "profile": "solar_film",
    "cathode": "cdsete_gradient",
    "anode": "cdsete_contacts",
    "electrolyte": "cdos_window",
    "packaging": [
      "solarfilm"
    ],
    "source": "cdsete2022"
  },
  {
    "profile": "solar_perovskite",
    "cathode": "pv_fapbi3",
    "anode": "pv_sno2_spiro_control",
    "electrolyte": "",
    "packaging": [
      "solarfilm"
    ],
    "source": "pvfa2025"
  },
  {
    "profile": "solar_perovskite",
    "cathode": "pv_fapbi3",
    "anode": "pv_sno2_dtpa_zol_spiro",
    "electrolyte": "",
    "packaging": [
      "solarfilm"
    ],
    "source": "pvfa2025"
  },
  {
    "profile": "solar_organic",
    "cathode": "opv_pm6_y6",
    "anode": "opv_pedot_pndit_contacts",
    "electrolyte": "",
    "packaging": [
      "solarfilm"
    ],
    "source": "opv2022"
  },
  {
    "profile": "solar_organic",
    "cathode": "opv_pm6_btpec9",
    "anode": "opv_pedot_pndit_contacts",
    "electrolyte": "",
    "packaging": [
      "solarfilm"
    ],
    "source": "opv2022"
  },
  {
    "profile": "solar_iiiv",
    "cathode": "iii_v_inverted_tandem",
    "anode": "tandem_iiiv_contacts",
    "electrolyte": "",
    "packaging": [
      "solarfilm"
    ],
    "source": "iiivnrel"
  },
  {
    "profile": "leadacid",
    "cathode": "pbo2_tubular",
    "anode": "pb_pasted_flat",
    "electrolyte": "acid",
    "packaging": [
      "lead"
    ],
    "source": "leadtraction"
  },
  {
    "profile": "solid",
    "cathode": "lfp",
    "anode": "lithium",
    "electrolyte": "fse_planar",
    "packaging": null,
    "source": "mu2024"
  },
  {
    "profile": "solid",
    "cathode": "lfp",
    "anode": "lithium",
    "electrolyte": "pegda_litfsi_unfilled",
    "packaging": null,
    "source": "mu2024"
  },
  {
    "profile": "liion",
    "cathode": "nmc811",
    "anode": "nanosilicon_p84",
    "electrolyte": "lhce_dmc_tte",
    "packaging": [
      "coin"
    ],
    "source": "nmc532gen2"
  },
  {
    "profile": "liion",
    "cathode": "nmc811",
    "anode": "nanosilicon_p84",
    "electrolyte": "lhce_tms_tte",
    "packaging": [
      "coin"
    ],
    "source": "nmc532gen2"
  },
  {
    "profile": "sodium",
    "cathode": "nvp_dry_oxalate",
    "anode": "hc_dry_ptfe",
    "electrolyte": "naclo4_ecdec_fec",
    "packaging": [
      "coin"
    ],
    "source": "nadry2025"
  },
  {
    "profile": "nimh",
    "cathode": "nickel",
    "anode": "alloy_ab5",
    "electrolyte": "koh",
    "packaging": null,
    "source": "nimhalloys"
  },
  {
    "profile": "nimh",
    "cathode": "nickel",
    "anode": "alloy_ab2",
    "electrolyte": "koh",
    "packaging": null,
    "source": "nimhalloys"
  },
  {
    "profile": "alkaline",
    "cathode": "emd_graphite_ring",
    "anode": "zinc_powder_gel",
    "electrolyte": "koh",
    "packaging": [
      "alkaline"
    ],
    "source": "energizer"
  },
  {
    "profile": "lithiumprimary",
    "cathode": "mno2_wound_primary",
    "anode": "lithium",
    "electrolyte": "primaryorganic",
    "packaging": [
      "cylindrical"
    ],
    "source": "panprimary"
  },
  {
    "profile": "silver",
    "cathode": "ag2o_graphite",
    "anode": "zinc",
    "electrolyte": "koh",
    "packaging": [
      "coin"
    ],
    "source": "silvermanual"
  },
  {
    "profile": "silver",
    "cathode": "ag2o_graphite",
    "anode": "zinc",
    "electrolyte": "naoh_silver",
    "packaging": [
      "coin"
    ],
    "source": "silvermanual"
  },
  {
    "profile": "zincair",
    "cathode": "air_carbon_diffusion",
    "anode": "zinc",
    "electrolyte": "koh",
    "packaging": [
      "aircoin"
    ],
    "source": "zincairhandbook"
  },
  {
    "profile": "pem",
    "cathode": "ptc_pfsa_layer",
    "anode": "ptc_pfsa_layer",
    "electrolyte": "pfsa",
    "packaging": [
      "stack"
    ],
    "source": "doeparts"
  },
  {
    "profile": "sofc",
    "cathode": "bscf_gdc_fiber",
    "anode": "ni_gdc_afl",
    "electrolyte": "gdc10",
    "packaging": [
      "ceramic"
    ],
    "source": "gdcfuel"
  },
  {
    "profile": "rtg",
    "cathode": "te_sige",
    "anode": "heat",
    "electrolyte": "",
    "packaging": [
      "rtg"
    ],
    "source": "rtgmaterials"
  },
  {
    "profile": "rtg",
    "cathode": "te_pbte_tags",
    "anode": "heat",
    "electrolyte": "",
    "packaging": [
      "rtg"
    ],
    "source": "rtgmaterials"
  },
  {
    "profile": "betavoltaic",
    "cathode": "beta_gaas",
    "anode": "beta63",
    "electrolyte": "",
    "packaging": [
      "beta"
    ],
    "source": "betamaterials"
  },
  {
    "profile": "betavoltaic",
    "cathode": "beta_gan",
    "anode": "beta63",
    "electrolyte": "",
    "packaging": [
      "beta"
    ],
    "source": "betamaterials"
  }
]);
for(const id of ['nizn','liion_hv','sodium','sodium_oxide']){const p=profiles.find(p=>p.id===id);if(!p.packaging.includes('coin'))p.packaging.push('coin');}
for(const r of materialPairings){const p=profiles.find(p=>p.id===r.profile);for(const [key,list] of [['cathode','cathodes'],['anode','anodes'],['electrolyte','electrolytes']])if(r[key]&&!p[list].includes(r[key]))p[list].push(r[key]);}
profiles.find(p=>p.id==='aqueouszn').label='温和水系锌电池';
export function matchingPairing(c){return materialPairings.find(r=>r.profile===c.profile&&['cathode','anode','electrolyte'].every(k=>r[k]===c[k])&&(!r.packaging||r.packaging.includes(c.packaging)));}
export function configurationForMaterial(c,key,id){
 if(!['cathode','anode','electrolyte'].includes(key))return null;
 const direct={...c,[key]:id};if(direct.anode!=='lithium')direct.sei='none';if(!validateConfig(direct).errors.length)return direct;
 const baseline=baselineOptions.get(c.profile),fallback=[];
 for(const cathode of baseline.cathodes)for(const anode of baseline.anodes)for(const electrolyte of baseline.electrolytes.length?baseline.electrolytes:[''])fallback.push({cathode,anode,electrolyte});
 const options=[...materialPairings.filter(r=>r.profile===c.profile),...fallback].filter(r=>r[key]===id).sort((a,b)=>['cathode','anode','electrolyte'].filter(k=>b[k]===c[k]).length-['cathode','anode','electrolyte'].filter(k=>a[k]===c[k]).length);
 for(const r of options){const next={...c,cathode:r.cathode,anode:r.anode,electrolyte:r.electrolyte,packaging:r.packaging&&!r.packaging.includes(c.packaging)?r.packaging[0]:c.packaging,sei:r.anode==='lithium'?c.sei:'none'};if(!validateConfig(next).errors.length)return next;}
 return null;
}
export function getProfile(id){return profiles.find(p=>p.id===id);}
export function getSource(id){return sources.find(s=>s.id===id);}
export function relatedObservations(config){return observations.filter(o=>o.profile===config.profile&&(!o.cathode||o.cathode===config.cathode)&&(!o.anode||o.anode===config.anode)&&(!o.electrolyte||o.electrolyte===config.electrolyte));}
export function validateConfig(c){
 const errors=[];const warnings=[];if(!c||typeof c!=='object')return{errors:['缺少配置'],warnings};const p=getProfile(c.profile);
 if(!p)return{errors:['未知电池体系'],warnings};
 for(const [field,allowed] of [['cathode',p.cathodes],['anode',p.anodes],['electrolyte',p.electrolytes],['packaging',p.packaging]]){if(allowed.length&&!allowed.includes(c[field]))errors.push(field+' 与当前体系不兼容');if(!allowed.length&&c[field])errors.push('该体系不使用 '+field);}
 if(!p.sei&&c.sei!=='none')errors.push('该体系不适用所选 SEI');if(!seiOptions.some(s=>s.id===c.sei))errors.push('未知 SEI 选项');
 for(const k of ['width','height','depth']){if(!Number.isFinite(c[k])||c[k]<1||c[k]>1500)errors.push('设计尺寸须为 1–1500 mm');}
 if(c.sei!=='none'&&c.anode!=='lithium')errors.push('当前人工 SEI 选项不适用于此负极');
 if(['cathode','anode','electrolyte'].some(k=>researchIds.has(c[k]))&&!matchingPairing(c))errors.push('所选研究材料需要对应的整套配对与封装');
 warnings.push('结构候选不代表完整配方已验证；性能需要对应试样与测试条件。');
 if(c.profile==='liion'&&c.cathode==='lmfp'&&c.anode!=='graphite')errors.push('LMFP 模板当前仅匹配石墨负极');
 if(c.profile==='solid_halide'&&c.anode!=='liin')errors.push('该卤化物模板不可直接改为裸锂');
 if(c.profile==='sodium_oxide'&&c.cathode==='na_p2')warnings.push('P2 / 硬碳需要钠库存与补钠策略验证');
 if(p.family==='solar')warnings.push('吸光层与接触层是器件类别，具体掺杂、层序与界面需验证');
 if(c.electrolyte==='sulfide')warnings.push('硫化物需检查水分反应与电极侧分解，不默认与裸锂或裸高电压正极兼容。');
 if(c.sei!=='none')warnings.push('人工 SEI 不赋予自动寿命增益；模型中薄层加厚展示。');
 return{errors:[...new Set(errors)],warnings};
}
export function computePerformance(c){
 const numeric=['area','current','capacity','voltage','mass','irradiance','operatingVoltage'];for(const k of numeric){if(c[k]!==null&&c[k]!==undefined&&(!Number.isFinite(c[k])||c[k]<(k==='current'?0:0.000001)))throw new Error('无效测量输入：'+k);}
 if(c.temperature!==null&&c.temperature!==undefined&&(!Number.isFinite(c.temperature)||c.temperature < -273.15))throw new Error('温度不能低于绝对零度');
 if(getProfile(c.profile)?.family==='solar'&&c.current!==null&&c.voltage&&c.area&&c.irradiance&&c.current*c.voltage/1000>c.area/10000*c.irradiance)throw new Error('输出功率超过入射光功率，请检查面积、辐照度和工作点');
 return {currentDensity:c.area&&c.current!==null?c.current/c.area:null,energy:c.capacity&&c.voltage?c.capacity*c.voltage/1000:null,specificEnergy:c.capacity&&c.voltage&&c.mass?c.capacity*c.voltage/c.mass:null,cRate:c.capacity&&c.current!==null?c.current/c.capacity:null};
}
export const initial={family:'secondary',profile:'liion',cathode:'lfp',anode:'graphite',electrolyte:'carbonate',sei:'none',packaging:'pouch',width:60,height:90,depth:9,area:null,current:null,capacity:null,voltage:null,mass:null,temperature:null,irradiance:null,operatingVoltage:null,step:0};
