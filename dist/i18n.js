import {contentEnglish} from './i18n-content.js';
const uiEnglish = {
 '曲线数据来源':'Curve data source','视角中心（mm）：':'View center (mm): ','视角：水平 ':'View: azimuth ','°，仰角 ':'°, elevation ','°，相机距离 ':'°, camera distance ',
 '跳到主内容':'Skip to main content','方向键旋转，Shift + 方向键平移，+ / − 缩放，Home 恢复视角。':'Arrow keys rotate. Shift + arrow keys pan. + / − zoom. Home resets the view.','旋转视角':'Rotate view','平移视角':'Pan view','缩放视角':'Zoom view','旋转':'Rotate','平移':'Pan','缩放':'Zoom','向左旋转':'Rotate left','向右旋转':'Rotate right','向上旋转':'Rotate up','向下旋转':'Rotate down','向左平移':'Pan left','向右平移':'Pan right','向上平移':'Pan up','向下平移':'Pan down','放大':'Zoom in','缩小':'Zoom out','恢复视角':'Reset view',
 '查看方式':'View mode','点选部件':'Select a component',
 '电池装配台':'Assembly workbench','资料库':'Library','方案对照':'Compare','我的记录':'My records',
 '电池材料与结构':'Battery materials & structure','选择材料，查看结构，读懂实测记录。':'Choose materials, inspect the structure and explore measured results.',
 '选择体系':'System','材料配置':'Materials','三维结构':'3D structure','测量与评估':'Measurement & assessment',
 '选择电池体系':'Choose a cell system','封装与三维结构':'Package & 3D structure','选择兼容材料，查看它在结构中的位置。':'Choose compatible materials and locate them in the structure.',
 '查看封装、部件与连接方式。':'Explore the package, components and connections.',
 '录入同一试样的测量，或用教学示例熟悉计算。':'Enter measurements from one specimen, or explore the worked example.',
 '当前选材':'Selected materials','封装与外形':'Package & dimensions','测量与计算':'Measure & calculate',
 '结构载入中':'Loading structure','结构载入中…':'Loading structure…','正在载入结构…':'Loading structure…',
 '拖动旋转 · 点选部件':'Drag to rotate · Select a component','完整外形':'Whole cell','展开结构':'Exploded view','能量路径':'Energy pathway',
 '返回选材':'Back to materials','视角与部件控制':'View & component controls','隐藏外壳':'Hide enclosure','自动旋转':'Auto rotate',
 '恢复完整结构':'Reset structure','逐层查看':'Layer view','展开':'Explode','部件目录':'Components',
 '方案与结构依据':'Configuration & references','模型层厚按观察需要放大，外形为设计尺寸，非加工图。':'Layer thicknesses are enlarged for inspection. Dimensions describe the design; this is not a manufacturing drawing.',
 '结果读数':'Readings','记为方案 A':'Save as A','比较当前方案':'Compare current setup','耐久与曲线':'Durability & curves','安全检查':'Safety checks',
 '读一条循环曲线':'Read a cycling curve','按数据覆盖范围解读':'Interpret within the measured range','哪里可能出问题':'Potential failure points',
 '文献与产品证据':'Papers & product evidence','Battery Lab / 材料与结构':'Battery Lab / Materials & structure','导出参数与证据':'Export parameters & evidence',
 '全部体系':'All systems','材料层':'Material layers','正极':'Cathode','负极':'Anode','电解质':'Electrolyte','吸光层':'Absorber','接触结构':'Contacts','功能层':'Functional layer',
 '结构示意 · 可点选与导览':'Structure model · Select parts to explore','结构待载入':'Structure pending','模型载入后可开始部件导览。':'Component tour becomes available once the model loads.',
 '点上面的层名，看它在哪里、做什么。':'Select a layer above to explore its location and function.','上一步':'Back','配置材料':'Configure materials','查看结构':'View structure','录入与评估':'Measure & assess','导出我的方案':'Export my setup',
 '关闭':'Close','Battery Lab 首页':'Battery Lab home','探索步骤':'Exploration steps','电池三维结构查看器':'Interactive 3D battery viewer',
 '装配分解程度':'Exploded-view amount','逐层查看进度':'Layer-view progress','评估内容':'Assessment sections'
};
Object.assign(uiEnglish,{
 "实物参考": "Physical reference",
 "同时切换配对材料": "Paired materials will also change",
 "与封装": " and package",
 "当前配对不可用": "Unavailable with this pairing",
 "已选": "Selected",
 "没有找到“": "No results for “",
 "”。试试材料名称或缩写。": "”. Try a material name or abbreviation.",
 "定位模型中的这一层": "Locate this layer in the model",
 "材料依据": "Material references",
 "当前配对：": "Current pairing: ",
 "搜索名称或缩写": "Search name or abbreviation",
 "当前配对不能使用这项材料。请查看材料依据。": "This material does not fit the current pairing. Check its references.",
 "同时配对：": "Paired with: ",
 "无电解质": "No electrolyte",
 "对应功能层已高亮。": "The corresponding layer is highlighted.",
 "原图与出处": "Original image & source",
 "未输入": "Not entered",
 "当前页面的测量草稿": "Measurement drafts in this session",
 "每组记录绑定材料、界面、封装与尺寸。更换材料时保留旧记录；刷新页面前请导出保存。": "Each record is tied to its materials, interface, package and dimensions. Changing materials preserves previous records. Export before refreshing.",
 "面积": "Area",
 "电流": "Current",
 "循环数据": "Cycling data",
 "无循环记录": "No cycling data",
 "返回这组方案与记录": "Return to this setup & record",
 "还没有录入实测数据。教学示例不会出现在这里。": "No measurements entered yet. Worked examples are not saved here.",
 "未知体系": "Unknown cell system",
 "正在查看：": "Viewing: ",
 "人工界面层": "Artificial interphase",
 "界面依据": "Interphase references",
 "当前研究配对不支持此封装。": "This research pairing does not support this package.",
 "调整外形尺寸": "Adjust outer dimensions",
 "直径": "Diameter",
 "宽": "Width",
 "厚度": "Thickness",
 "高 / 长度": "Height / length",
 "尺寸改变外形比例，不能据此推算容量。": "Dimensions change the model proportions; they do not predict capacity.",
 "教学示例": "Worked example",
 "实测输入": "My measurements",
 "教学示例 · 不是真实性能": "Worked example · Not measured performance",
 "面积与电流密度": "Area & current density",
 "拖动试样角标改面积，也可使用下面的滑杆。": "Drag the specimen handle to change its area, or use the slider below.",
 "有效面积": "Effective area",
 "工作电流": "Operating current",
 "本例的其他输入": "Other inputs in this example",
 "工作点电压": "Operating-point voltage",
 "容量": "Capacity",
 "平均电压": "Mean voltage",
 "完整电池质量": "Complete-cell mass",
 "辐照度": "Irradiance",
 "示例只演示计算，不进入实测记录。": "This example demonstrates the calculation and is not saved as measured data.",
 "先输入同一工作点的三项测量。": "Start with three measurements from the same operating point.",
 "受光面积": "Illuminated area",
 "容量、质量与平均电压": "Capacity, mass & mean voltage",
 "补充测试温度": "Add test temperature",
 "实测容量": "Measured capacity",
 "平均放电电压": "Mean discharge voltage",
 "测试温度": "Test temperature",
 "计算依据": "Calculation basis",
 "电流密度 j = I / A；工作点功率 P = U × I。容量乘平均放电电压得到能量近似值。光伏只有最大功率点测量才能给出最大效率。": "Current density j = I / A; operating-point power P = U × I. Capacity multiplied by mean discharge voltage approximates energy. Maximum photovoltaic efficiency requires a measurement at the maximum power point.",
 "体系": "System",
 "结构依据": "Structure references",
 "工作点电压须为正数": "Operating-point voltage must be positive.",
 "用户测量 · 未核验": "User measurements · Unverified",
 "电流密度": "Current density",
 "电流 ÷ 有效面积": "Current ÷ effective area",
 "工作点功率": "Operating-point power",
 "工作点电压 × 电流": "Operating-point voltage × current",
 "工作点光电效率": "Operating-point PV efficiency",
 "输出功率 ÷ 同时入射功率": "Output power ÷ incident power at the same instant",
 "能量近似 / 比能量": "Estimated energy / specific energy",
 "保持率": "Retention",
 "循环寿命需要实测曲线": "Cycle life requires measured cycling data",
 "储存表现需要对应记录": "Storage performance requires supporting records",
 "运行耐久需要时间序列": "Operating durability requires time-series data",
 "安全性需要对应测试证据。": "Safety requires relevant test evidence.",
 "教学数值不进入实测记录、对照或导出。": "Example values are excluded from measurement records, comparisons and exports.",
 "仅计算已录入的量，来源尚未独立核验。": "Only entered values are calculated. Their source has not been independently verified.",
 "软包结构概念图，非制造步骤": "Pouch-cell concept illustration, not a manufacturing procedure",
 "单晶硅电池实物，出处见资料库": "Monocrystalline silicon cell; source in the library",
 "DOE GPHS 热源模块实物参考": "DOE GPHS heat-source module photograph",
 "封装外形示意": "Package outline illustration",
 "材料怎样配合": "How the materials work together",
 "封装的作用": "What the package does",
 "吸光层产生电荷，接触与传输层把电荷引出。钝化层和封装影响损失与耐久。": "The absorber generates charge; contacts and transport layers extract it. Passivation and packaging affect losses and durability.",
 "氧侧与燃料侧发生电化学反应，电解质传导离子。气体供给与密封需要同时检查。": "Electrochemical reactions occur at the oxygen and fuel electrodes, while the electrolyte conducts ions. Gas supply and sealing must be checked together.",
 "能量源与转换组件承担不同作用。输出和防护需要对应型号的资料。": "The energy source and converter serve different roles. Output and protection require records for the specific device model.",
 "电极参与反应，功能层承担传输或隔离。换材料后，完整试样的性能仍需在同一测试条件下测量。": "Electrodes participate in reactions; functional layers provide transport or separation. After a material change, test the complete specimen under the same conditions.",
 "外壳提供保护，连接部件引出电流，密封层隔绝环境。调整外形尺寸只改变模型比例。": "The enclosure protects the cell, connectors carry current and seals isolate it from the environment. Changing outer dimensions only changes model proportions.",
 "测量概念图，非实验记录": "Measurement concept illustration, not an experimental record",
 "单晶硅电池实物参考": "Monocrystalline silicon cell photograph",
 "当前器件的封装示意": "Package illustration for the current device",
 "测量条件与结果": "Test conditions & results",
 "面积、辐照度、电压与电流应来自同一光照和工作点。单个工作点的效率不能当作最大效率。": "Area, irradiance, voltage and current must refer to the same illumination and operating point. Efficiency at one operating point is not maximum efficiency.",
 "记录气体组成、工作点和运行时间。缺少燃料输入记录时，无法计算燃料利用效率。": "Record gas composition, operating point and run time. Fuel utilization efficiency cannot be calculated without fuel-input records.",
 "输出与耐久需要对应型号的完整记录。转换材料的身份不能替代器件测试。": "Output and durability require complete records for the device model. Identifying the converter material does not replace device testing.",
 "容量和平均电压给出能量近似值。储存表现还需要温度与时间记录。": "Capacity and mean voltage approximate energy. Storage performance also requires temperature and time records.",
 "容量保持率只描述已测范围；工作点电压与平均放电电压用于不同计算。": "Capacity retention describes the measured range only. Operating-point voltage and mean discharge voltage serve different calculations.",
 "结构导览": "Component tour",
 "上一层": "Previous layer",
 "下一层": "Next layer",
 "恢复全貌": "Reset view",
 "当前模型未独立展示这一层，请查看材料依据。": "This layer is not shown separately in the current model. Check its material references.",
 "测试环境插图 · 无实际测试记录": "Test-environment illustration · No test records",
 "当前封装示意 · 测试记录待补充": "Package illustration · Test records needed",
 "当前没有足够测试证据判断安全性。": "There is not enough test evidence to assess safety.",
 "查看部位": "Locate in model",
 "需要哪些记录？": "Which records are needed?",
 "已加入待验证清单 · 移除": "Planned for validation · Remove",
 "加入待验证清单": "Add to validation plan",
 "当前体系的风险依据": "Risk references for this system",
 "电从哪里走？": "Where does the energy flow?",
 "放电 / 电输出的定性路径。播放节奏用于讲解，不代表实际传输速度。": "A qualitative pathway for discharge or electrical output. Playback timing explains the sequence; it does not represent transport speed.",
 "播放讲解": "Play walkthrough",
 "下一段": "Next segment",
 "路径示意": "Pathway illustration",
 "暂停": "Pause",
 "全部 32 种体系": "All 32 cell systems",
 "按名称或材料搜索": "Search by name or material",
 "全部": "All",
 "没有匹配的体系，试试材料或电池名称。": "No matching systems. Try a material or cell name.",
 "耐久要记录什么？": "What should a durability record include?",
 "单次放电": "Single discharge",
 "同时记录电压、电流、时间和截止条件；储存测试另记环境与时间。": "Record voltage, current, time and cutoff conditions together. For storage tests, also record the environment and duration.",
 "光照与输出衰减": "Illumination & output degradation",
 "记录运行时间、光照、温度与同一工作点的输出。单点效率不是最大效率。": "Record run time, illumination, temperature and output at the same operating point. Single-point efficiency is not maximum efficiency.",
 "运行小时与输出衰减": "Operating hours & output degradation",
 "记录气体组成、工作点和启停条件。不同工况不能直接比较耐久。": "Record gas composition, operating point and startup/shutdown conditions. Durability cannot be compared directly across different conditions.",
 "器件时间与电输出": "Device age & electrical output",
 "以完整型号的时间—输出记录为准；不能用转换材料身份推断寿命。": "Use time–output records for the complete device model. The converter material alone cannot establish service life.",
 "同一试样": "Same specimen",
 "同一工况": "Same conditions",
 "时间与输出": "Time & output",
 "查看测试证据": "View test evidence",
 "保持率是相对首个测量点的容量比例，阈值交点只在已测范围内寻找。": "Retention is capacity relative to the first measured point. Threshold crossings are located only within the measured range.",
 "试读示例曲线": "Explore example curve",
 "录入我的曲线": "Enter my curve",
 "教学示例 · 虚构数值，仅演示读图": "Worked example · Synthetic values for reading the chart",
 "保持率阈值": "Retention threshold",
 "循环次数，容量（mAh）": "Cycle count, capacity (mAh)",
 "阈值": "Threshold",
 "导入 CSV": "Import CSV",
 "评估我的曲线": "Assess my curve",
 "清空": "Clear",
 "输入已修改，图中为上次评估结果；请重新评估。": "Input changed. The chart shows the previous assessment; assess it again.",
 "用户输入，来源未独立核验。": "User-entered data; source not independently verified.",
 "数据在当前浏览器处理。示例不会填进这里。": "Data is processed in this browser. Example values are not inserted here.",
 "用户实测": "User measurements",
 "容量保持率曲线": "Capacity-retention curve",
 "循环次数": "Cycle count",
 "测量点": "Measured point",
 "点一个测量点，读取容量与保持率。": "Select a point to read capacity and retention.",
 "测试范围内尚未达到": "Within the measured range, retention has not reached ",
 "首次向下交点约为": "first downward crossing is approximately ",
 "圈（相邻测量点线性内插）。": "cycles (linear interpolation between adjacent points).",
 "这组虚构数值仅帮助读图，不会保存成实测记录。": "These synthetic values illustrate how to read the chart and are not saved as measurements.",
 "仅报告实测范围，交点不自动等同于认证寿命。": "Only the measured range is reported. A crossing does not establish a certified service life.",
 "与当前方案的差异": "Differences from the current setup",
 "开始方案对照": "Start a comparison",
 "先记住当前材料和实测输入，再换一个材料或体系进行对照。教学示例不会保存。": "Save the current materials and measurements, then change a material or system to compare. Worked examples are excluded.",
 "记住当前方案 A": "Save current setup as A",
 "方案 A 已记住。更换材料后，比较当前方案。": "Setup A saved. Change a material, then compare the current setup.",
 "正极 / 吸光层": "Cathode / absorber",
 "负极 / 接触": "Anode / contact",
 "电解质 / 功能层": "Electrolyte / functional layer",
 "不适用": "Not applicable",
 "温度": "Temperature",
 "测试至": "Tested through ",
 "未录入": "Not entered",
 "方案 A / B": "Setups A / B",
 "比较项": "Parameter",
 "测量条件缺失或不同，暂不能直接比较性能。": "Measurement conditions are missing or differ; performance cannot be compared directly yet.",
 "已录入的基本工况相同，制备与完整试样条件仍需核对。": "The entered basic conditions match. Preparation and complete-specimen conditions still need checking.",
 "教学示例不在这张表中；用户输入尚未独立核验。": "Worked examples are excluded from this table. User-entered data has not been independently verified.",
 "无法导出：": "Cannot export: ",
 "文献与产品结果不作为自定义方案预测；用户输入未独立核验；结构是观察示意。": "Paper and product results do not predict custom setups. User input is unverified; the structure is an inspection model.",
 "原论文、厂家产品、结构参考和设计输入分别记录。": "Research papers, manufacturer products, structure references and design inputs are documented separately.",
 "真实图片版权": "Photograph credits",
 "原图": "Original image",
 "源图未调色，页面按框展示。": "Original image colours are preserved; images are fitted to the display frame.",
 "讲解插图": "Illustrations",
 "背景、软包结构、测量和防护箱图为生成的概念插图，不能作为实拍材料或实验记录。": "The background, pouch-cell structure, measurement and protection-chamber images are generated concept illustrations, not material photographs or experimental records.",
 "完整提示词": "Full image prompts",
 "先修正输入：": "Correct the input first: ",
 "已记住 A。换一个材料或体系，再比较当前方案。": "A saved. Change a material or system, then compare the current setup.",
 "CSV 请小于 1 MB": "Use a CSV smaller than 1 MB.",
 "导入期间方案已改变，本次导入已取消。": "The setup changed during import. This import was cancelled.",
 "阈值已修改，图中为上次评估结果；请重新评估。": "Threshold changed. The chart shows the previous assessment; assess it again.",
 "请启用浏览器硬件加速以查看三维模型。": "Enable browser hardware acceleration to view the 3D model.",
 "结构数据缺失": "Structure data is missing",
 "结构未载入：": "Structure could not load: ",
 "当前选材：": "Selected material: ",
 "仅二次电池适用": "Applicable to rechargeable cells only",
 "封装结构": "Package structure",
 "测量数据来源": "Measurement data source",
 "软包电池分层结构的概念插图": "Concept illustration of a layered pouch cell",
 "单晶硅太阳能电池单片实物照片": "Photograph of a monocrystalline silicon solar cell",
 "DOE GPHS 热源模块实物照片": "Photograph of a DOE GPHS heat-source module",
 "软包电池连接测量仪器的概念插图": "Concept illustration of a pouch cell connected to measurement instruments",
 "单晶硅太阳能电池实物": "Monocrystalline silicon solar cell photograph",
 "完整软包电池在关闭防护箱内的测试环境概念插图": "Concept illustration of a complete pouch cell in a closed protection chamber",
 "例如：太阳能、固态、镍氢": "Try solar, solid-state or nickel–metal hydride",
 "教学曲线保持率阈值": "Retention threshold for example curve",
 "粘贴两列实测数据": "Paste two columns of measured data",
 "选择曲线读数": "Select a curve reading",
 "试样视角": "Specimen view",
 "方形有效面积试样三维示意": "3D illustration of a square effective-area specimen",
 "拖动角标调整有效面积": "Drag the handle to adjust effective area",
 "受光面示意": "Illuminated-area model",
 "有效工作面示意": "Effective working-area model",
 "涂层试样示意": "Coated-specimen model",
 "斜视": "Angled view",
 "俯视": "Top view",
 "原面积": "Reference area",
 "拖动旋转": "Drag to rotate",
 "面积减半": "Halve area",
 "对比原面积": "Compare reference area",
 "恢复面积": "Reset area",
 "平均电流密度": "Mean current density",
 "拖动角标调整面积": "Drag the handle to adjust area",
 "平方厘米": "square centimetres",
 "电流为 0，两种面积下的密度均为 0。": "At zero current, current density is zero for both areas.",
 "同样的电流，当前密度是原面积下的": "At the same current, the density is ",
 "倍。": "times the density at the reference area.",
 "拖动角标改面积，读数为整个有效面的平均值。": "Drag the handle to change area. The reading is the mean over the effective area.",
 "搜索": "Search ",
 "材料候选": " material candidates",
 "的图片与出处": " image & source",
 "查看": "View ",
 "当前": "Current ",
 "材料": "Materials",
 "圈": " cycles",
 "点": " points",
 "已选择": "Selected ",
 "相对第": " relative to cycle ",
 "第": "Cycle ",
 "结构示意": "Structure model",
 "部件": " components",
 "步": " steps",
 "来源": " sources",
 "种": " systems",
 "计划": "Planned ",
 "项": " items"
});
let english={...contentEnglish,...uiEnglish},keys=Object.keys(english).sort((a,b)=>b.length-a.length);
let locale='zh';
try{if(globalThis.localStorage?.getItem('battery-lab-language')==='en')locale='en';}catch{}
export const getLocale=()=>locale;
export function setLocale(next){if(!['zh','en'].includes(next)||next===locale)return;locale=next;try{globalThis.localStorage?.setItem('battery-lab-language',locale);}catch{}refresh?.();document.dispatchEvent(new CustomEvent('languagechange',{detail:{locale}}));}
export function registerTranslations(entries){english={...english,...entries,...uiEnglish};keys=Object.keys(english).sort((a,b)=>b.length-a.length);refresh?.();}
export function translate(value,target=locale){
 const text=String(value??'');if(target!=='en'||!/[\u3400-\u9fff]/.test(text))return text;
 const trimmed=text.trim();const dynamic=dynamicTranslation(trimmed,target);if(dynamic!==null)return text.replace(trimmed,dynamic);if(english[trimmed])return text.replace(trimmed,english[trimmed]);
 let result=text;
 // Keys describe authored copy only; input values and source identifiers are never translated.
 const placeholders=[];
 for(const key of keys){if(!result.includes(key))continue;const token='\u0001'+placeholders.length+'\u0002';placeholders.push(english[key]);result=result.split(key).join(token);}
 if(!placeholders.length)return text;
 return result.replace(/\u0001(\d+)\u0002/g,(_,i)=>placeholders[+i]).replace(/，/g,', ').replace(/；/g,'; ').replace(/。/g,'. ').replace(/：/g,': ').replace(/、/g,', ').replace(/“/g,'“').replace(/”/g,'”').trimEnd();
}
function dynamicTranslation(text,target){
 let m;
 if((m=text.match(/^教学示例(有效面积|工作电流)$/)))return 'Worked example: '+translate(m[1],target).toLowerCase();
 if((m=text.match(/^(教学示例|用户实测)容量保持率曲线$/)))return translate(m[1],target)+': capacity-retention curve';
 if((m=text.match(/^搜索(.+)材料$/)))return 'Search '+translate(m[1],target).toLowerCase()+' materials';
 if((m=text.match(/^(.+)材料候选$/)))return translate(m[1],target)+' material candidates';
 if((m=text.match(/^第 (\d+) \/ 4 步 \/ (.+)$/)))return 'Step '+m[1]+' / 4 · '+translate(m[2],target);
 if((m=text.match(/^(\d+) 种候选$/)))return m[1]+' candidate'+(m[1]==='1'?'':'s');
 if((m=text.match(/^(\d+) 种$/)))return m[1]+' system'+(m[1]==='1'?'':'s');
 if((m=text.match(/^(\d+) 个来源$/)))return m[1]+' source'+(m[1]==='1'?'':'s');
 if((m=text.match(/^计划 (\d+) \/ (\d+) 项$/)))return 'Planned '+m[1]+' / '+m[2];
 if((m=text.match(/^结构示意 · (\d+) 部件$/)))return 'Structure model · '+m[1]+' components';
 if((m=text.match(/^第 (.+) 圈相对第 (.+) 圈$/)))return 'Cycle '+m[1]+' relative to cycle '+m[2];
 if((m=text.match(/^(.+)% 首次向下交点约为 (.+) 圈（相邻测量点线性内插）。$/)))return 'First downward crossing of '+m[1]+'%: approximately '+m[2]+' cycles (linear interpolation between adjacent points).';
 if((m=text.match(/^测试范围内尚未达到 (.+)% 阈值。$/)))return 'The '+m[1]+'% threshold has not been reached within the measured range.';
 if((m=text.match(/^(.+) 已选。(.+)$/)))return translate(m[1],target)+' selected. '+translate(m[2],target);
 if((m=text.match(/^当前选材：(.+)$/)))return 'Selected material: '+translate(m[1],target);
 if((m=text.match(/^当前(.+)：(.+)$/)))return 'Current '+translate(m[1],target).toLowerCase()+': '+translate(m[2],target);
 if((m=text.match(/^第 (.+) 行需要两列：cycle,capacity_mAh$/)))return 'Row '+m[1]+' needs two columns: cycle,capacity_mAh';
 return null;
}
let refresh;
export function initializeLocalization(host){
 const records=new WeakMap(),attributes=['aria-label','aria-valuetext','title','alt','placeholder'];
 const excluded='script,style,textarea,[data-i18n-skip],.language-switch';
 function text(node){
  if(!node.parentElement||node.parentElement.closest(excluded))return;
  const last=records.get(node),source=last&&node.data===last.rendered?last.source:node.data,rendered=translate(source);
  records.set(node,{source,rendered});if(node.data!==rendered)node.data=rendered;
 }
 function attrs(el){
  if(el.closest('script,style,[data-i18n-skip],.language-switch'))return;
  let record=records.get(el);if(!record){record={};records.set(el,record);}
  for(const name of attributes){if(!el.hasAttribute(name))continue;const current=el.getAttribute(name),last=record[name],source=last&&current===last.rendered?last.source:current,rendered=translate(source);record[name]={source,rendered};if(current!==rendered)el.setAttribute(name,rendered);}
 }
 function scan(node){
  if(node.nodeType===3){text(node);return;}if(node.nodeType!==1)return;
  attrs(node);const walker=document.createTreeWalker(node,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT);
  while(walker.nextNode()){const next=walker.currentNode;next.nodeType===3?text(next):attrs(next);}
 }
 refresh=()=>{document.documentElement.lang=locale==='en'?'en':'zh-CN';const description=document.querySelector('meta[name=description]');if(description)description.content=locale==='en'?'Explore solar, primary, rechargeable, fuel and nuclear cells: materials, 3D structure, measured performance and traceable references.':'探索太阳能、一次、二次、燃料与核电池：选材、三维结构、实测性能和可追溯文献。';document.title=locale==='en'?'Battery Lab · Battery assembly workbench':'Battery Lab · 电池组装实验室';host.querySelectorAll('[data-locale]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.locale===locale)));scan(host);};
 const observer=new MutationObserver(changes=>{for(const change of changes){if(change.type==='childList')change.addedNodes.forEach(scan);else if(change.type==='characterData')text(change.target);else attrs(change.target);}});
 observer.observe(host,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:attributes});
 host.querySelectorAll('[data-locale]').forEach(button=>button.addEventListener('click',()=>{setLocale(button.dataset.locale);}));
 refresh();return ()=>observer.disconnect();
}
