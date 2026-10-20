// Compact English clauses derived from AGENTS/STYLE and the configured IDs.
// These are new prompt compositions, not approved image-generation results.
export const labels = {
  iphone17:'iPhone 17', macbookpro14:'MacBook Pro 14″', pair:'Mac + iPhone', environment:'環境のみ',
  single:'端末1台', 'side-by-side':'左右に並べる', 'depth-staggered':'前後に配置', 'environment-only':'端末なし',
  grounded:'床置き・接地', 'on-block':'ブロック上', hover:'床上浮遊', suspended:'空中浮遊・床なし',
  upright:'立てる', 'flat-face-up':'寝かせる・画面上向き', 'tilted-supported':'支えに傾ける', 'suspended-angled':'浮かせる',
  'open-display':'開いた状態', 'open-suspended':'開いた状態で浮遊',
  'frontal-centered':'正面・中央', 'three-quarter-left':'左斜め', 'three-quarter-right':'右斜め', 'low-view':'低い視点',
  'subtle-tilt-left':'左に小さくロール', 'subtle-tilt-right':'右に小さくロール', 'asymmetric-negative-space':'左寄せ・右に余白',
  'near-floor-hover':'床に近い浮遊', 'graphic-planes':'建築の目地を見せる', 'display-on-block':'展示ブロック・正面寄り',
  'iphone-oblique-floor':'床に寝かせる・斜め上40〜50°', 'iphone-oblique-block':'台に寝かせる・斜め上40〜55°',
  'iphone-tilted-supported':'台で傾ける・画面に合わせる', 'iphone-tilted-floor':'壁で支える・画面に合わせる',
  'iphone-suspended-angled':'浮遊・旋回15°／ロール10°', 'empty-stage':'空間全体', 'floor-plane-emphasis':'床面主体・80〜85%',
  'microcement-seamless':'マイクロセメント', 'fiber-cement-panels':'繊維セメント', 'diatomaceous-plaster':'珪藻土プラスター',
  'board-formed-concrete':'型枠コンクリート', 'slate-layer':'チャコールスレート', 'brushed-steel':'ヘアライン金属',
  'smoked-glass':'スモークガラス', 'plaster-corner':'プラスターの角', 'graphite-gradient':'グラファイト階調',
  'fine-concrete':'細粒コンクリート', 'mineral-white':'オフホワイト鉱物壁', 'dark-fiber-cement':'ダーク繊維セメント',
  'suspended-mineral-planes':'浮遊用・縦の鉱物壁', 'carrara-marble-wall-floor':'白系大理石',
  'graphite-marble-wall-floor':'グラファイト大理石', 'carrara-marble-wide-block':'白系大理石のワイドブロック',
  'broad-softbox':'正面の大きな拡散光', 'left-grazing':'左からの柔らかい斜光', 'right-grazing':'右からの柔らかい斜光',
  'soft-overhead':'上からの拡散光', 'top-left-daylight':'左上からの自然光', 'top-right-daylight':'右上からの自然光',
  'low-key':'ローキー', 'high-key':'ハイキー', space:'空間全体', 'vertical-wall':'壁面主体',
  'wall-floor-junction':'壁と床の接合', 'wall-floor-corner':'壁の角と床', 'vertical-wall-and-floor':'ガラス・壁・床', 'horizontal-floor':'床面主体'
};
export const defaults = {subject:'iphone17', layout:'single', spatial:'grounded', pose:'upright', surface:'space', composition:'frontal-centered', environment:'microcement-seamless', lighting:'broad-softbox'};
const material = {
  'microcement-seamless':'Seamless matte microcement with fine mineral grain and nearly invisible joints.',
  'fiber-cement-panels':'Pale fiber-cement panels with fine fibers and one crisp construction seam.',
  'diatomaceous-plaster':'Matte diatomaceous-earth plaster with delicate trowel marks and a quiet corner.',
  'board-formed-concrete':'Dark matte concrete with subtle straight formwork seams.',
  'slate-layer':'Charcoal slate with restrained linear layered grain.',
  'brushed-steel':'Brushed stainless steel with quiet horizontal grain and restrained reflections.',
  'smoked-glass':'Integrated smoked-gray glass with genuine translucency, faint reflections and optical depth.',
  'plaster-corner':'Pale polished plaster planes meeting at a precise right-angle corner.',
  'graphite-gradient':'Near-seamless matte graphite with very subtle tonal falloff.',
  'fine-concrete':'Finely sandblasted pale concrete with minute pores and subtle joints.',
  'mineral-white':'Off-white mineral render with minute imperfections and fog-gray tones.',
  'dark-fiber-cement':'Charcoal fiber-cement planes with fine fibers and subdued tonal separation.',
  'suspended-mineral-planes':'Two vertical matte mineral planes, subtle joints and gentle tonal depth.',
  'carrara-marble-wall-floor':'Honed pale Carrara marble with thin natural gray veins and continuous slab-scale joints.',
  'graphite-marble-wall-floor':'Honed graphite marble with sparse thin pale veins and restrained satin reflections.',
  'carrara-marble-wide-block':'Honed pale Carrara marble; delicate veins continue across the broad block top and sides.'
};
const light = {
  'broad-softbox':'Broad frontal diffused softbox, gentle gradients and delicate soft shadows.',
  'left-grazing':'Soft left grazing light reveals microtexture with restrained feathered shadows.',
  'right-grazing':'Soft right grazing light reveals microtexture with restrained feathered shadows.',
  'soft-overhead':'Large diffused overhead light, gentle tonal gradients, no hard beams.',
  'top-left-daylight':'Soft top-left daylight, broad penumbra and restrained reflections.',
  'top-right-daylight':'Soft top-right daylight, broad penumbra and restrained reflections.',
  'low-key':'Soft low-key studio light; all material boundaries remain legible.',
  'high-key':'Airy high-key diffusion; preserve contours against pale neutral architecture.'
};
const camera = {
  'frontal-centered':'Centered, symmetric near-eye-level camera with generous horizontal negative space.',
  'three-quarter-left':'Left three-quarter camera, restrained 12–18-degree yaw, intact silhouettes.',
  'three-quarter-right':'Right three-quarter camera, restrained 12–18-degree yaw, intact silhouettes.',
  'low-view':'Modestly low frontal camera, undistorted silhouette and entire screen visible.',
  'subtle-tilt-left':'Front-facing camera; restrained 10-degree counter-clockwise roll.',
  'subtle-tilt-right':'Front-facing camera; restrained 10-degree clockwise roll.',
  'asymmetric-negative-space':'Front-facing camera; left-weighted placement within central 40%, generous right negative space.',
  'near-floor-hover':'Near-floor camera facing the entire screen; faint separated shadow below.',
  'graphic-planes':'Frontal camera; centered subject against one coherent orthogonal architectural seam.',
  'display-on-block':'Near-eye-level frontal camera; show the supporting mineral block.',
  'iphone-oblique-floor':'Oblique camera 40–50 degrees above the floor; all screen corners visible.',
  'iphone-oblique-block':'Oblique camera 40–55 degrees above the block; all screen corners visible.',
  'iphone-tilted-supported':'Raised front-three-quarter camera aligned to the leaning screen; all corners visible.',
  'iphone-tilted-floor':'Raised front-three-quarter camera aligned to the leaning screen; all corners visible.',
  'iphone-suspended-angled':'Front-facing camera; 15-degree yaw and 10-degree roll, all screen corners visible.',
  'empty-stage':'One architectural camera view; spacious uncluttered central negative space.',
  'floor-plane-emphasis':'Low oblique architectural camera; floor fills 80–85%, distant wall only a narrow band.'
};

export function validateCatalog(p, devices) {
  for (const [group, clauses] of [['environments',material],['lighting',light],['compositions',camera]]) {
    for (const row of p[group]) if (!clauses[row.id]) throw Error(`未対応の設定: ${group}/${row.id}`);
  }
  for (const id of ['iphone17','macbookpro14']) if (!devices[id]?.physical_mm) throw Error(`端末設定がありません: ${id}`);
  for(const [group,known] of [['spatial_modes',['grounded','hover','suspended','on-block']],['device_layouts',['single','side-by-side','depth-staggered','environment-only']]]){
    if(p[group].some(x=>!known.includes(x.id))||known.some(id=>!p[group].some(x=>x.id===id)))throw Error(`実装との照合が必要です: ${group}`);
  }
  for(const [id,known] of [['iphone17',['upright','flat-face-up','tilted-supported','suspended-angled']],['macbookpro14',['open-display','open-suspended']]]){
    if(p.device_pose_rules[id]?.map(x=>x.id).sort().join('|')!==known.sort().join('|'))throw Error(`姿勢の照合が必要です: ${id}`);
  }
}

export function choices(s, p) {
  const env = s.subject === 'environment';
  let poses = env ? [] : s.subject === 'macbookpro14' ? [s.spatial === 'suspended' ? 'open-suspended':'open-display']
    : s.spatial === 'suspended' ? ['suspended-angled'] : s.spatial === 'hover' || s.subject === 'pair' ? ['upright']
    : ['upright','flat-face-up','tilted-supported'];
  let compositions;
  if (env) compositions = s.surface === 'horizontal-floor' ? ['floor-plane-emphasis'] : ['empty-stage'];
  else if (s.pose === 'flat-face-up') compositions = [s.spatial === 'on-block' ? 'iphone-oblique-block':'iphone-oblique-floor'];
  else if (s.pose === 'tilted-supported') compositions = [s.spatial === 'on-block' ? 'iphone-tilted-supported':'iphone-tilted-floor'];
  else {
    compositions = ['frontal-centered','three-quarter-left','three-quarter-right','asymmetric-negative-space','graphic-planes'];
    if (s.spatial === 'on-block') compositions.unshift('display-on-block');
    if (s.spatial === 'hover' && s.subject === 'iphone17') compositions.unshift('near-floor-hover');
    if (s.spatial === 'suspended') compositions.push('subtle-tilt-left','subtle-tilt-right');
    if (s.spatial === 'suspended' && s.subject === 'iphone17') compositions.unshift('iphone-suspended-angled');
    if (s.spatial === 'grounded' && s.subject === 'iphone17') compositions.push('low-view');
  }
  return {
    subject:['iphone17','macbookpro14','pair','environment'],
    layout:env ? ['environment-only'] : s.subject === 'pair' ? ['side-by-side','depth-staggered'] : ['single'],
    spatial:p.spatial_modes.map(x=>x.id).filter(id=>!env || id!=='hover'), pose:poses, composition:compositions,
    surface:!env||s.spatial==='on-block'?['space']:s.spatial==='suspended'?['space','vertical-wall']:['space','vertical-wall','wall-floor-junction','wall-floor-corner','vertical-wall-and-floor','horizontal-floor'],
    environment:p.environments.map(x=>x.id).filter(id => (id!=='suspended-mineral-planes'||s.spatial==='suspended') && (id!=='carrara-marble-wide-block'||s.spatial==='on-block') && (s.surface!=='vertical-wall-and-floor'||id==='smoked-glass') && (s.spatial!=='on-block'||!['fiber-cement-panels','dark-fiber-cement'].includes(id))),
    lighting:p.lighting.map(x=>x.id)
  };
}

export function normalize(input, p) {
  const s = {...defaults,...input};
  const changes = [];
  for (const key of ['subject','spatial','layout','pose','surface','composition','environment','lighting']) {
    const allowed=choices(s,p)[key];
    const value=allowed.includes(s[key]) ? s[key] : allowed[0] ?? null;
    if(value!==s[key]) changes.push({key,from:s[key],to:value});
    s[key]=value;
  }
  return {state:s,changes};
}

export function fromPreset(row) {
  return {subject:row.devices.length===0?'environment':row.devices.length===2?'pair':row.devices[0],
    layout:row.layout_id,spatial:row.spatial_mode_id,pose:row.pose_id??row.poses?.iphone17??null,
    surface:row.surface_type??'space',composition:row.composition_id,environment:row.environment_id,lighting:row.lighting_id};
}

export function assemble(s,p,devices) {
  for(const [key,allowed] of Object.entries(choices(s,p))) {
    if (allowed.length ? !allowed.includes(s[key]) : s[key]!==null) throw Error(`組み合わせを確認してください: ${key}`);
  }
  const env=s.subject==='environment', pair=s.subject==='pair';
  const ids=env?[]:pair?['macbookpro14','iphone17']:[s.subject];
  const iphone=devices.iphone17.physical_mm, mac=devices.macbookpro14.physical_mm;
  const fragments=[{label:'写真の共通条件',text:'ONE standalone photorealistic product photograph. ONE camera view. Horizontal 16:9.'}];
  let subject=env?'NO products or devices. Architecture only, not a macro texture swatch. Preserve actual construction scale and coherent material junctions. No screens, electronic silhouettes or product shadows.':pair?'Exactly two devices: one MacBook Pro 14-inch and one standard iPhone 17.':s.subject==='iphone17'?'Exactly one black standard iPhone 17, NOT Pro.':'Exactly one open MacBook Pro 14-inch.';
  if(ids.includes('iphone17')) subject+=` iPhone: black flat frame, ${iphone.height}×${iphone.width}×${iphone.depth}mm body, 6.3-inch display, slim bezel, centered Dynamic Island.`;
  if(ids.includes('macbookpro14')) subject+=` Open aluminum MacBook, ${mac.width}×${mac.depth}mm footprint, camera notch; keyboard and trackpad visible.`;
  if(!env) subject+=' Entire displays unobstructed, featureless pure white; accurate proportions.';
  fragments.push({label:'対象・筐体・画面',text:subject});
  let pose='';
  if(!env && s.subject!=='macbookpro14') {
    pose=s.pose==='flat-face-up'?'Phone lies completely flat, face up.':s.pose==='tilted-supported'?'Phone leans back 20 degrees against an integrated mineral support.':s.pose==='upright'?'Phone upright.':'Phone floats unsupported, display facing camera.';
  }
  if(pair)pose+=(s.layout==='side-by-side'?' Mac left, phone right; realistic relative scale, no overlap.':' Mac behind, phone foreground; realistic scale, neither screen nor keyboard obscured.');
  if(pose)fragments.push({label:'姿勢・並び方',text:pose.trim()});
  let space;
  if(s.spatial==='suspended')space=(env?'Floorless half-gray architecture, two vertical planes.':'Devices float weightlessly in floorless half-gray architecture, two vertical planes.')+' NO floor, horizon, floor-wall seam, ground shadow, platform or supports.';
  else if(s.spatial==='on-block') space=env?'Empty half-gray architectural stage with one broad 80–140cm-wide mineral monolith and continuous floor.':s.pose==='flat-face-up'?'Rest on one broad 80–140cm-wide mineral monolith, natural contact shadows.':s.pose==='tilted-supported'?'Rest on one broad mineral block with an integrated backrest, stable contact and gentle shadows.':'Rest on functional mineral exhibition blocks, stable contact and gentle shadows.';
  else if(s.spatial==='hover')space='Hover slightly above a visible mineral floor; faint separated shadows, no supports.';
  else space=env?({
    'vertical-wall':'Empty half-gray vertical wall panels; only a slim distant floor band.',
    'wall-floor-corner':'Two empty half-gray walls meet a continuous mineral floor at a coherent corner.',
    'vertical-wall-and-floor':'Empty integrated glass partition, mineral wall and matching floor, coherent construction joints.'
  }[s.surface]??'Empty half-gray architectural wall and continuous mineral floor, physically coherent junctions.'):'Rest directly on a continuous mineral floor, natural contact shadows; no plinths.';
  if(s.pose==='tilted-supported'&&s.spatial==='grounded')space+=' Bottom edge contacts floor, upper back touches wall.';
  fragments.push({label:'配置・建築空間',text:space},{label:'構図・カメラ',text:camera[s.composition]},
    {label:'素材',text:material[s.environment]},{label:'照明',text:light[s.lighting]});
  fragments.push({label:'除外条件',text:'Restrained half-gray tones, no wood, desks, furniture, props, people, logos, text, UI, collage or multiple views.'});
  const prompt=fragments.map(x=>x.text).join(' ');
  const contract={devices:ids,layout_id:s.layout,spatial_mode_id:s.spatial,composition_id:s.composition,environment_id:s.environment,lighting_id:s.lighting};
  if(ids.length===1)contract.pose_id=s.pose;
  if(pair)contract.poses={macbookpro14:s.spatial==='suspended'?'open-suspended':'open-display',iphone17:s.pose};
  if(env&&s.surface!=='space')contract.surface_type=s.surface;
  return {prompt,fragments,contract,words:prompt.split(/\s+/).length};
}
