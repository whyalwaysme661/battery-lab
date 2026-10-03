import {readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(fileURLToPath(new URL('../',import.meta.url)));
const manifest=JSON.parse(await readFile(path.join(root,'dist/assets/materials/manifest.json'),'utf8'));
const sourceAssets=manifest.filter(a=>!['generated','schematic'].includes(a.kind));
const escapeCell=value=>String(value??'').replace(/\|/g,'\\|').replace(/\r?\n/g,' ');
const link=(url,label)=>`[${escapeCell(label)}](${url})`;
const lines=[
 '# Third-party notices / 第三方资源说明',
 '',
 'This file is generated from `dist/assets/materials/manifest.json` by `npm run credits`. Do not edit individual rows here; update the manifest and regenerate it.',
 '',
 '本清单从图片来源记录生成。根目录 MIT 许可证仅适用于本项目有权许可的代码与资产；以下第三方内容继续适用原许可证。',
 '',
 '## Three.js',
 '',
 '- Browser modules: `dist/vendor/`, Three.js r180, MIT.',
 '- Copyright © 2010–2025 three.js authors.',
 '- Full license: [dist/vendor/LICENSE](dist/vendor/LICENSE).',
 '- Upstream: https://github.com/mrdoob/three.js/tree/r180',
 '',
 '## Fonts / 字体',
 '',
 '- Noto Sans SC subset: SIL OFL 1.1. Original copyright and reserved font names: [NotoSansSC-OFL.txt](dist/assets/fonts/NotoSansSC-OFL.txt).',
 '- IBM Plex Sans subset: SIL OFL 1.1. Original copyright and reserved font names: [IBMPlexSans-OFL.txt](dist/assets/fonts/IBMPlexSans-OFL.txt).',
 '- Subsetting and family-name changes: [font notes](dist/assets/fonts/README.md). Keep these notices with redistributed font files.',
 '',
 '## Images / 图片',
 '',
 'Original authors retain their rights. The original image, its thumbnail and its preview share the applicable original license. Preserve the author, original source, license and modification information when reusing an image. CC BY-SA adaptations retain the applicable ShareAlike license; they are not relicensed by this project’s MIT file.',
 '',
 '原图、缩略图和预览图沿用相应来源许可。研究图可能裁取材料外观面板；保留比例尺与原始标注，未生成式重绘。未裁剪来源图的缩略图仅缩放并编码为 WebP。原料或文献参考不是所选完整配方的实拍。',
 '',
 'Public-domain labels describe the listed source’s designation and are not a guarantee about every jurisdiction or other rights. Follow the linked source notices.',
 '',
 `The manifest lists ${sourceAssets.length} third-party image assets.`,
 '',
 '| Local image / 本地图像 | Object / 对象 | Author / 作者 | License / 许可 | Source / 原始出处 | Changes / 修改 |',
 '| --- | --- | --- | --- | --- | --- |',
];
for(const a of sourceAssets){
 if(!a.author||!a.license||!a.licenseUrl||!a.pageUrl)throw new Error('Incomplete image credit: '+a.file);
 const source=link(a.pageUrl,'Source')+(a.supplementUrl?' · '+link(a.supplementUrl,'Supplement'):'')+(a.licenseEvidenceUrl&&a.licenseEvidenceUrl!==a.pageUrl?' · '+link(a.licenseEvidenceUrl,'License evidence'):'');
 const changes=a.modificationsEn??'Source appearance retained; resized WebP thumbnails and previews supplied.';
 lines.push(`| ${link('dist'+a.localUrl,a.file)} | ${escapeCell(a.shortLabelEn)} | ${escapeCell(a.author)} | ${link(a.licenseUrl,a.license)} | ${source} | ${escapeCell(changes)} |`);
}
lines.push('', 'Full original-image URLs, specimen identities, crop coordinates, bilingual captions and license evidence remain in the [image manifest](dist/assets/materials/manifest.json).', '', '## Project-made imagery / 项目示意与概念资产', '', 'The source-based material schematics, procedural model geometry and packed schematic surface maps are project-made assets covered by the root MIT license to the extent of the contributors’ rights. Their scientific references do not grant ownership of the original publications.', '', 'Generated concept imagery is supplied with the project under the same rights-limited MIT grant. Its prompts and purpose are recorded in [illustration notes](dist/assets/illustrations.md). Generated visuals are not documentary photographs, microscopy, or measured performance.', '', 'Do not remove the visual distinction between documentary sources, constituent/reference images, source-based schematics and generated concepts.', '');
const text=lines.join('\n'),target=path.join(root,'THIRD_PARTY_NOTICES.md');
if(process.argv.includes('--check')){
 if(await readFile(target,'utf8')!==text)throw new Error('Third-party notices are stale. Run npm run credits.');
 console.log(`Third-party notices verified: ${sourceAssets.length} credited image assets, Three.js and two font families.`);
}else{
 await writeFile(target,text,'utf8');console.log(`Third-party notices generated: ${sourceAssets.length} image assets.`);
}
