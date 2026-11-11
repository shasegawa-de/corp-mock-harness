// Compact English clauses derived from AGENTS/STYLE and the configured IDs.
// These are new prompt compositions, not approved image-generation results.
export const labels = {
  iphone17:'iPhone 17', iphone17pro:'iPhone 17 Pro（反復のみ）', macbookpro14:'MacBook Pro 14″', pair:'Mac + iPhone', 'mac-pair':'Mac + Mac（2台）', environment:'環境のみ',
  single:'端末1台', 'side-by-side':'左右に並べる', 'depth-staggered':'前後に配置', 'environment-only':'端末なし', 'repeated-grid':'iPhone 6台・縦列整列（0％）', 'repeated-grid-half-offset':'iPhone 6台・縦列千鳥（長辺50％）',
  grounded:'床置き・接地', 'on-block':'ブロック上', hover:'床上浮遊', suspended:'空中浮遊・床なし', 'furniture-supported':'高級木製テーブル・台座',
  upright:'立てる', 'flat-face-up':'寝かせる・画面上向き', 'tilted-supported':'支えに傾ける', 'suspended-angled':'浮かせる',
  'open-display':'開いた状態', 'open-suspended':'開いた状態で浮遊',
  'frontal-centered':'正面・中央', 'three-quarter-left':'左斜め', 'three-quarter-right':'右斜め', 'low-view':'低い視点',
  'subtle-tilt-left':'左に小さくロール', 'subtle-tilt-right':'右に小さくロール', 'asymmetric-negative-space':'左寄せ・右に余白',
  'near-floor-hover':'床に近い浮遊', 'graphic-planes':'建築の目地を見せる', 'display-on-block':'展示ブロック・正面寄り',
  'iphone-oblique-floor':'床に寝かせる・斜め上40〜50°', 'iphone-oblique-block':'台に寝かせる・斜め上40〜55°',
  'iphone-tilted-supported':'台で傾ける・画面に合わせる', 'iphone-tilted-floor':'壁で支える・画面に合わせる',
  'iphone-suspended-angled':'浮遊・旋回15°／ロール10°', 'iphone-tile-diagonal':'iPhone反復・斜め俯瞰', 'iphone-tile-low-oblique':'iPhone反復・低い斜め視点', 'iphone-tile-steep-oblique':'iPhone反復・高い斜め俯瞰', 'iphone-tile-detail-closeup':'iPhone反復・ディテール接写', 'mac-elevated-three-quarter':'Mac・高めの斜め視点', 'mac-low-side-profile':'Mac・低い側面視点',
  'mac-chair-elevated':'厚い木製テーブル・斜め上', 'mac-chair-front':'高い木製台座・見上げ', 'empty-stage':'空間全体', 'floor-plane-emphasis':'床面主体・80〜85%',
  'microcement-seamless':'マイクロセメント', 'fiber-cement-panels':'繊維セメント', 'diatomaceous-plaster':'珪藻土プラスター',
  'board-formed-concrete':'型枠コンクリート', 'slate-layer':'チャコールスレート', 'brushed-steel':'ヘアライン金属',
  'smoked-glass':'スモークガラス', 'plaster-corner':'プラスターの角', 'graphite-gradient':'グラファイト階調',
  'fine-concrete':'細粒コンクリート', 'mineral-white':'オフホワイト鉱物壁', 'dark-fiber-cement':'ダーク繊維セメント',
  'suspended-mineral-planes':'浮遊用・縦の鉱物壁', 'carrara-marble-wall-floor':'白系大理石',
  'graphite-marble-wall-floor':'グラファイト大理石', 'carrara-marble-wide-block':'白系大理石のワイドブロック',
  'offwhite-seamless-studio':'白〜ライトグレーのシームレス空間', 'warm-grain-plaster':'ウォームグレー微細粒子', 'white-cyclorama':'白ホリゾント', 'walnut-support-studio':'無垢ウォルナット台・テーブル', 'warm-ivory-seamless':'ウォームアイボリー背景', 'pale-gray-seamless':'淡いニュートラルグレー背景', 'walnut-chair-interior':'ウォルナットチェアの室内',
  'broad-softbox':'正面の大きな拡散光', 'left-grazing':'左からの柔らかい斜光', 'right-grazing':'右からの柔らかい斜光',
  'soft-overhead':'上からの拡散光', 'top-left-daylight':'左上からの自然光', 'top-right-daylight':'右上からの自然光',
  'low-key':'ローキー', 'high-key':'ハイキー', 'window-cut-sun':'窓からの輪郭のある自然光', 'sculpted-window-light':'斜光・光の造形', space:'空間全体', 'vertical-wall':'壁面主体',
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
  'carrara-marble-wide-block':'Honed pale Carrara marble; delicate veins continue across the broad block top and sides.',
  'offwhite-seamless-studio':'Luminous off-white and pale fog-gray seamless studio, matte floor and clean backdrop, softly graded real spatial depth.',
  'walnut-chair-interior':'RETIRED. Do not use chairs.',
  'walnut-support-studio':'One thick premium solid WALNUT tabletop or monumental wooden exhibition BLOCK, stable broad horizontal top; NO chairs or props.',
  'warm-grain-plaster':'Warm off-white greige architectural plaster with fine real-size mineral grain and controlled depth, no artificial noise overlay.',
  'white-cyclorama':'Near-white seamless studio cyclorama (SHIROHORI) infinity cove, no floor-wall horizon or corners.',
  'warm-ivory-seamless':'One seamless warm-ivory matte studio surface, paper-smooth, no wall corner, grain or props.',
  'pale-gray-seamless':'One seamless clean pale-gray matte studio surface, natural contact shadows, no wall seams or props.'
};
const light = {
  'broad-softbox':'Broad frontal diffused softbox, gentle gradients and delicate soft shadows.',
  'left-grazing':'Soft left grazing light reveals microtexture with restrained feathered shadows.',
  'right-grazing':'Soft right grazing light reveals microtexture with restrained feathered shadows.',
  'soft-overhead':'Large diffused overhead light, gentle tonal gradients, no hard beams.',
  'top-left-daylight':'Soft top-left daylight, broad penumbra and restrained reflections.',
  'top-right-daylight':'Soft top-right daylight, broad penumbra and restrained reflections.',
  'low-key':'Soft low-key studio light; all material boundaries remain legible.',
  'high-key':'Airy high-key diffusion; preserve contours against pale neutral architecture.',
  'window-cut-sun':'Single-window directional warm sunlight on solid walnut and metal, with legible white display.',
  'sculpted-window-light':'One window source sculpts diagonal shadow shapes on warm fine-grain plaster, no glare on screen.'
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
  'floor-plane-emphasis':'Low oblique architectural camera; floor fills 80–85%, distant wall only a narrow band.',
  'mac-elevated-three-quarter':'Elevated 30–40-degree left three-quarter camera, both screen and full keyboard/trackpad readable, never overhead.',
  'mac-low-side-profile':'Low 15–22-degree side three-quarter camera retaining full screen, keyboard and trackpad, no nearly invisible keyboard.',
  'mac-chair-elevated':'Elevated 30–40-degree editorial camera over a thick solid-walnut tabletop; entire blank screen, keyboard and trackpad visible.',
  'mac-chair-front':'TRUE UPWARD LOW ANGLE: camera BELOW top of tall solid-walnut BLOCK, looking UP at laptop screen, seeing underside and strong physical contact; not a shallow side view.',
  'iphone-tile-diagonal':'One 40–50-degree oblique camera over six identical screen-up phones; honor 3 vertical columns and the selected 0%/50% vertical center-column offset.',
  'iphone-tile-low-oblique':'Low 24–32-degree oblique camera, six identical screen-up phones; honor 3 vertical columns and the selected 0%/50% vertical center-column offset.',
  'iphone-tile-steep-oblique':'High 58–68-degree oblique camera, six identical screen-up phones; honor 3 vertical columns and the selected 0%/50% vertical center-column offset.',
  'iphone-tile-detail-closeup':'Close-up elevated 48–58-degree diagonal-oblique view of thin accurate phones, dominant central handset, generous margins and peripheral crop; obey 3-column vertical stagger exactly.',
};

export function validateCatalog(p, devices) {
  for (const [group, clauses] of [['environments',material],['lighting',light],['compositions',camera]]) {
    for (const row of p[group]) if (!clauses[row.id]) throw Error(`未対応の設定: ${group}/${row.id}`);
  }
  for (const id of ['iphone17','iphone17pro','macbookpro14']) if (!devices[id]?.physical_mm) throw Error(`端末設定がありません: ${id}`);
  for(const row of p.showcase_presets){
    if(['repeated-grid','repeated-grid-half-offset'].includes(row.layout_id) && (row.devices.length!==6||!['iphone17','iphone17pro'].includes(row.devices[0])||!row.devices.every(x=>x===row.devices[0])||row.pose_id!=='flat-face-up'||row.spatial_mode_id!=='grounded'||!['iphone-tile-diagonal','iphone-tile-low-oblique','iphone-tile-steep-oblique','iphone-tile-detail-closeup'].includes(row.composition_id)))
      throw Error('iPhone反復パターン契約の不一致: '+row.id);
    if(row.devices.length>2 && !['repeated-grid','repeated-grid-half-offset'].includes(row.layout_id))throw Error('反復以外の多台数構成は未対応: '+row.id);
    if(row.spatial_mode_id==='furniture-supported' && (row.devices.length!==1||row.devices[0]!=='macbookpro14'||row.environment_id!=='walnut-support-studio'||row.layout_id!=='single'))
      throw Error('木製支持体はMac単体のみ: '+row.id);
    if(row.devices.length===2){
      const supported=JSON.stringify(row.devices)==='["macbookpro14","iphone17"]'
        ||JSON.stringify(row.devices)==='["macbookpro14","macbookpro14"]';
      if(!supported||!['side-by-side','depth-staggered'].includes(row.layout_id))
        throw Error('未対応の2台構成: '+row.id);
    }
  }
  for(const [group,known] of [['spatial_modes',['grounded','hover','suspended','on-block','furniture-supported']],['device_layouts',['single','side-by-side','depth-staggered','environment-only','repeated-grid','repeated-grid-half-offset']]]){
    if(p[group].some(x=>!known.includes(x.id))||known.some(id=>!p[group].some(x=>x.id===id)))throw Error(`実装との照合が必要です: ${group}`);
  }
  for(const [id,known] of [['iphone17',['upright','flat-face-up','tilted-supported','suspended-angled']],['macbookpro14',['open-display','open-suspended']]]){
    if(p.device_pose_rules[id]?.map(x=>x.id).sort().join('|')!==known.sort().join('|'))throw Error(`姿勢の照合が必要です: ${id}`);
  }
}

export function choices(s, p) {
  const env = s.subject === 'environment';
  const repeat = ['iphone17','iphone17pro'].includes(s.subject) && ['repeated-grid','repeated-grid-half-offset'].includes(s.layout);
  let poses = env ? [] : repeat ? ['flat-face-up'] : (s.subject === 'macbookpro14'||s.subject === 'mac-pair') ? [s.spatial === 'suspended' ? 'open-suspended':'open-display']
    : s.spatial === 'suspended' ? ['suspended-angled'] : s.spatial === 'hover' || s.subject === 'pair' ? ['upright']
    : ['upright','flat-face-up','tilted-supported'];
  let compositions;
  if (env) compositions = s.surface === 'horizontal-floor' ? ['floor-plane-emphasis'] : ['empty-stage'];
  else if (repeat) compositions=['iphone-tile-diagonal','iphone-tile-low-oblique','iphone-tile-steep-oblique','iphone-tile-detail-closeup'];
  else if (s.spatial === 'furniture-supported') compositions=['mac-chair-elevated','mac-chair-front'];
  else if (s.pose === 'flat-face-up') compositions = [s.spatial === 'on-block' ? 'iphone-oblique-block':'iphone-oblique-floor'];
  else if (s.pose === 'tilted-supported') compositions = [s.spatial === 'on-block' ? 'iphone-tilted-supported':'iphone-tilted-floor'];
  else {
    compositions = ['frontal-centered','three-quarter-left','three-quarter-right','asymmetric-negative-space','graphic-planes'];
    if (s.spatial === 'on-block') compositions.unshift('display-on-block');
    if (s.spatial === 'hover' && s.subject === 'iphone17') compositions.unshift('near-floor-hover');
    if (s.spatial === 'suspended') compositions.push('subtle-tilt-left','subtle-tilt-right');
    if (s.spatial === 'suspended' && s.subject === 'iphone17') compositions.unshift('iphone-suspended-angled');
    if (s.spatial === 'grounded' && s.subject === 'iphone17') compositions.push('low-view');
    if (s.subject === 'macbookpro14' && ['grounded','on-block'].includes(s.spatial))
      compositions.push('mac-elevated-three-quarter','mac-low-side-profile');
  }
  return {
    subject:['iphone17','iphone17pro','macbookpro14','pair','mac-pair','environment'],
    layout:env ? ['environment-only'] : ['pair','mac-pair'].includes(s.subject) ? ['side-by-side','depth-staggered'] : s.subject==='iphone17pro'?['repeated-grid','repeated-grid-half-offset']:s.subject==='iphone17'&&s.spatial==='grounded'?['single','repeated-grid','repeated-grid-half-offset']:['single'],
    spatial:p.spatial_modes.map(x=>x.id).filter(id=>(s.subject!=='iphone17pro'&&!repeat||id==='grounded')&&(!env||id!=='hover')&&(id!=='furniture-supported'||s.subject==='macbookpro14')), pose:poses, composition:compositions,
    surface:!env||s.spatial==='on-block'?['space']:s.spatial==='suspended'?['space','vertical-wall']:['space','vertical-wall','wall-floor-junction','wall-floor-corner','vertical-wall-and-floor','horizontal-floor'],
    environment:p.environments.map(x=>x.id).filter(id => (repeat ? ['warm-ivory-seamless','pale-gray-seamless','offwhite-seamless-studio'].includes(id) : !['warm-ivory-seamless','pale-gray-seamless'].includes(id)) && (s.spatial==='furniture-supported'?id==='walnut-support-studio':!['walnut-support-studio','walnut-chair-interior'].includes(id)) && (!['offwhite-seamless-studio','warm-grain-plaster','white-cyclorama'].includes(id)||s.spatial!=='suspended') && (id!=='suspended-mineral-planes'||s.spatial==='suspended') && (id!=='carrara-marble-wide-block'||s.spatial==='on-block') && (s.surface!=='vertical-wall-and-floor'||id==='smoked-glass') && (s.spatial!=='on-block'||!['fiber-cement-panels','dark-fiber-cement'].includes(id))),
    lighting:p.lighting.map(x=>x.id).filter(id=>repeat?['high-key','soft-overhead'].includes(id):s.spatial==='furniture-supported'?['window-cut-sun','top-left-daylight','soft-overhead'].includes(id):(id!=='window-cut-sun'&&(id!=='sculpted-window-light'||(s.subject==='macbookpro14'&&s.spatial==='grounded'))))
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
  return {subject:row.devices.length===0?'environment':row.devices.length===2?(row.devices.every(id=>id==='macbookpro14')?'mac-pair':'pair'):row.devices[0],
    layout:row.layout_id,spatial:row.spatial_mode_id,pose:row.pose_id??row.poses?.iphone17??null,
    surface:row.surface_type??'space',composition:row.composition_id,environment:row.environment_id,lighting:row.lighting_id};
}

export function assemble(s,p,devices) {
  for(const [key,allowed] of Object.entries(choices(s,p))) {
    if (allowed.length ? !allowed.includes(s[key]) : s[key]!==null) throw Error(`組み合わせを確認してください: ${key}`);
  }
  const env=s.subject==='environment', pair=s.subject==='pair',macPair=s.subject==='mac-pair';
  const repeat=['iphone17','iphone17pro'].includes(s.subject)&&['repeated-grid','repeated-grid-half-offset'].includes(s.layout);
  const ids=env?[]:repeat?Array(6).fill(s.subject):macPair?['macbookpro14','macbookpro14']:pair?['macbookpro14','iphone17']:[s.subject];
  const iphone=(s.subject==='iphone17pro'?devices.iphone17pro:devices.iphone17).physical_mm, mac=devices.macbookpro14.physical_mm;
  const fragments=[{label:'写真の共通条件',text:'ONE standalone photorealistic product photograph. ONE camera view. Horizontal 16:9.'}];
  let subject=env?'NO products or devices. Architecture only, not a macro texture swatch. Preserve actual construction scale and coherent material junctions. No screens, electronic silhouettes or product shadows.':pair?'Exactly two devices: one MacBook Pro 14-inch and one standard iPhone 17.':repeat?(s.subject==='iphone17pro'?'Exactly SIX identical iPhone 17 Pro handsets, NOT standard, repeated within one photograph.':'Exactly SIX identical black standard iPhone 17 handsets, NOT Pro, repeated within a single photograph.'):s.subject==='iphone17'?'Exactly one black standard iPhone 17, NOT Pro.':macPair?'Exactly TWO devices: two open 14-inch MacBook Pro laptops, no iPhone.':'Exactly one open MacBook Pro 14-inch.';
  if(ids.includes('iphone17')||ids.includes('iphone17pro')) subject+=` ${repeat?'Each iPhone':'iPhone'}: ${s.subject==='iphone17pro'?'silver aluminum unibody frame':'black flat frame'}, ${iphone.height}×${iphone.width}×${iphone.depth}mm body, 6.3-inch display, slim bezel, centered Dynamic Island.`;
  if(ids.includes('macbookpro14')) subject+=` ${macPair?'Each open aluminum MacBook':'Open aluminum MacBook'}, ${mac.width}×${mac.depth}mm footprint, camera notch; ${s.composition==='mac-chair-front'?'true low upward view from below wood block top, keyboard partly hidden by perspective':'keyboard and trackpad visible'}.`;
  if(repeat) subject+=' All centrally positioned displays entirely visible and featureless pure white; only outer phones may be intentionally cut by image edges. Matched real-world size.';
  else if(!env) subject+=' Entire displays unobstructed, featureless pure white; accurate proportions.';
  fragments.push({label:'対象・筐体・画面',text:subject});
  let pose='';
  if(repeat)pose=s.layout==='repeated-grid-half-offset'
    ?'Six SAME-MODEL phones FRONT-SCREEN UP, never rear-facing, in THREE VERTICAL COLUMNS of TWO. Each column has equal VERTICAL pitch and same device rotation. Shift CENTER COLUMN DOWN vertically EXACTLY HALF of ONE phone LONG BODY LENGTH (50%). Left and right columns align. No horizontal displacement of rows.'
    :'Six SAME-MODEL phones FRONT-SCREEN UP, never rear-facing, in THREE VERTICAL COLUMNS of TWO. Equal vertical pitch in every column, and all columns vertically ALIGNED (ZERO vertical offset, 0%). Keep horizontal column spacing consistent.';
  else if(!env && s.subject!=='macbookpro14' && !macPair) {
    pose=s.pose==='flat-face-up'?'Phone lies completely flat, face up.':s.pose==='tilted-supported'?'Phone leans back 20 degrees against an integrated mineral support.':s.pose==='upright'?'Phone upright.':'Phone floats unsupported, display facing camera.';
  }
  if(pair)pose+=(s.layout==='side-by-side'?' Mac left, phone right; realistic relative scale, no overlap.':' Mac behind, phone foreground; realistic scale, neither screen nor keyboard obscured.');
  if(macPair)pose+=(s.layout==='side-by-side'
    ?' Two open 14-inch MacBooks side-by-side, left and right, matched physical size, separate silhouettes. BOTH white screens, keyboards and trackpads completely visible.'
    :' Two open 14-inch MacBooks at different depths, matched physical size, no screen, keyboard or trackpad obstruction. No overlap.');
  if(pose)fragments.push({label:'姿勢・並び方',text:pose.trim()});
  let space;
  if(repeat)space='Six phones share one matte studio surface; consistent contact shadows, no furniture.';
  else if(s.spatial==='furniture-supported') space='One open MacBook rests fully on ONE solid walnut TABLE or tall solid WOOD BLOCK, with stable flat contact, believable material grain and NO chair.';
  else if(s.spatial==='suspended')space=(env?'Floorless half-gray architecture, two vertical planes.':'Devices float weightlessly in floorless half-gray architecture, two vertical planes.')+' NO floor, horizon, floor-wall seam, ground shadow, platform or supports.';
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
  fragments.push({label:'除外条件',text:repeat
    ?'Only six matching phones; no mixed devices, props, human hands, logos, UI, text, independent panels, collage or multiple views.'
    :s.spatial==='furniture-supported'
    ?'Only one substantial solid walnut support; NO chair, plants, people, props, logos, text, UI, collage or multiple views.'
    :'Restrained half-gray tones, no wood, desks, furniture, props, people, logos, text, UI, collage or multiple views.'});
  const prompt=fragments.map(x=>x.text).join(' ');
  const contract={devices:ids,layout_id:s.layout,spatial_mode_id:s.spatial,composition_id:s.composition,environment_id:s.environment,lighting_id:s.lighting};
  if(ids.length===1||repeat)contract.pose_id=s.pose;
  if(repeat){contract.column_vertical_offset_ratio=s.layout==='repeated-grid-half-offset'?0.5:0;contract.column_vertical_offset_reference='device_body_length';contract.column_vertical_offset_target='center';}
  if(pair)contract.poses={macbookpro14:s.spatial==='suspended'?'open-suspended':'open-display',iphone17:s.pose};
  if(macPair)contract.poses={left:s.pose,right:s.pose};
  if(env&&s.surface!=='space')contract.surface_type=s.surface;
  return {prompt,fragments,contract,words:prompt.split(/\s+/).length};
}
