'use strict';
const {React, h, mount, Shell, Button, Input, Select, Slider, Popover} = CounterplayUI;
const {useState, useEffect, useRef} = React;
const bytes = text => new TextEncoder().encode(text).length;
const validTag = tag => /^[A-Za-z0-9]{4}$/.test(tag);
const uniqueID = () => 'custom-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2,9);
function validLibrary(value) {
  return value?.version === 1 && Array.isArray(value.samples) && value.samples.length > 0 && value.samples.length <= 500 &&
    value.samples.every(item => typeof item.id === 'string' && item.id.length <= 128 && typeof item.title === 'string' &&
      item.title.length <= 120 && typeof item.text === 'string' && Array.from(item.text).length <= 8192 && bytes(item.text) <= 32000) &&
    new Set(value.samples.map(item => item.id)).size === value.samples.length;
}
const featureNames = {kern:'Kerning',liga:'Standard ligatures',clig:'Contextual ligatures',dlig:'Discretionary ligatures',hlig:'Historical ligatures',calt:'Contextual alternates',salt:'Stylistic alternates',aalt:'All alternates',smcp:'Small capitals',c2sc:'Capitals to small caps',pcap:'Petite capitals',c2pc:'Capitals to petite caps',case:'Case-sensitive forms',cpsp:'Capital spacing',lnum:'Lining figures',onum:'Oldstyle figures',pnum:'Proportional figures',tnum:'Tabular figures',frac:'Fractions',afrc:'Alternative fractions',ordn:'Ordinals',zero:'Slashed zero',sups:'Superscripts',subs:'Subscripts',sinf:'Scientific inferiors',numr:'Numerators',dnom:'Denominators',swsh:'Swashes',cswh:'Contextual swashes',titl:'Titling alternates',locl:'Localized forms',mark:'Mark positioning',mkmk:'Mark-to-mark positioning',rlig:'Required ligatures',rclt:'Required contextual alternates',ccmp:'Glyph composition',curs:'Cursive positioning'};
const featureTitle = tag => featureNames[tag] || (/^ss\d\d$/.test(tag) ? 'Stylistic set '+Number(tag.slice(2)) : /^cv\d\d$/.test(tag) ? 'Character variant '+Number(tag.slice(2)) : tag);
const featureChoices = [{value:'auto',label:'Default'},{value:'1',label:'On'},{value:'0',label:'Off'},{value:'custom',label:'Value…'}];
const languages = [['','Automatic'],['en','English'],['it','Italian'],['fr','French'],['de','German'],['es','Spanish'],['pt','Portuguese'],['tr','Turkish'],['ar','Arabic'],['he','Hebrew'],['hi','Hindi'],['ja','Japanese'],['zh','Chinese'],['ko','Korean']].map(([value,label])=>({value,label}));
const directions = [['auto','Automatic'],['ltr','Left to right'],['rtl','Right to left']].map(([value,label])=>({value,label}));
function FeatureControl({tag,value,onChange}) {
  const [custom,setCustom] = useState(value > 1);
  useEffect(()=>setCustom(value > 1),[value]);
  return h('div',{className:'feature-row'},
    h('div',{className:'feature-name'},h('span',null,featureTitle(tag)),h('code',null,tag)),
    h('div',{className:'feature-value'},h(Select,{label:featureTitle(tag),items:featureChoices,value:custom?'custom':value === undefined?'auto':String(value),onValueChange:next=>{
      setCustom(next==='custom'); if(next!=='custom')onChange(next==='auto'?undefined:Number(next));
    }}),custom&&h(Input,{type:'number',min:0,max:65535,'aria-label':featureTitle(tag)+' value',defaultValue:value??1,onChange:event=>{
      const next=Number(event.target.value);if(event.target.value!==''&&Number.isInteger(next)&&next>=0&&next<=65535)onChange(next);
    }})));
}
function App() {
  const [library,setLibrary]=useState(null),[summary,setSummary]=useState(null),[master,setMaster]=useState('');
  const [textsOpen,setTextsOpen]=useState(false),[featuresOpen,setFeaturesOpen]=useState(false),[editing,setEditing]=useState(false);
  const [saveStatus,setSaveStatus]=useState('Loading your library…'),[saveError,setSaveError]=useState(false),[error,setError]=useState('');
  const [rendered,setRendered]=useState(null),[busy,setBusy]=useState(false),[fontFamily,setFontFamily]=useState('system-ui');
  const [width,setWidth]=useState(800),[refresh,setRefresh]=useState(0),[removed,setRemoved]=useState(null),[sizeDraft,setSizeDraft]=useState('40');
  const viewport=useRef(null),editor=useRef(null),alive=useRef(true),savePending=useRef(null),saving=useRef(false);
  const renderPending=useRef(null),rendering=useRef(false),requestID=useRef(0),fontCache=useRef(null),refreshSeen=useRef(0);
  const selected=library?.samples.find(item=>item.id===library.selectedID);
  const available=rendered?.availableFeatures || [];
  const featureCount=available.filter(tag=>library?.features[tag]!==undefined).length;
  const patch = changes => setLibrary(previous=>previous?{...previous,...changes}:previous);
  function updateSample(changes) {
    if(!library)return;
    if(changes.text!==undefined&&(Array.from(changes.text).length>8192||bytes(changes.text)>32000)){setError('Use at most 8,192 characters and 32 KB.');return;}
    setError('');setLibrary(previous=>({...previous,samples:previous.samples.map(item=>item.id===previous.selectedID?{...item,...changes}:item)}));
  }
  async function save() {
    if(saving.current)return;saving.current=true;
    try {
      await counterplay.ui.setEdited(true);
      do {
        while(savePending.current){const value=savePending.current;savePending.current=null;await counterplay.storage.set('text-library',value);}
        await counterplay.ui.setEdited(false);
        if(savePending.current)await counterplay.ui.setEdited(true);
      } while(savePending.current);
      if(alive.current){setSaveStatus('Saved on this Mac');setSaveError(false);}
    } catch(e){if(alive.current){setSaveStatus('Not saved: '+e.message);setSaveError(true);}}
    finally{saving.current=false;}
  }
  useEffect(()=>{alive.current=true;return()=>{alive.current=false;if(fontCache.current?.face)document.fonts.delete(fontCache.current.face);};},[]);
  useEffect(()=>{
    (async()=>{
      try {
        const saved=await counterplay.storage.get('text-library');
        if(saved!==null&&!validLibrary(saved))throw new Error('Saved library is invalid; it has been preserved.');
        const samples=(saved?.samples||FONT_PREVIEW_SAMPLES).map(item=>({...item}));
        const features=Object.fromEntries(Object.entries(saved?.features||{}).filter(([tag,value])=>validTag(tag)&&Number.isInteger(value)&&value>=0&&value<=65535).slice(0,128));
        if(alive.current)setLibrary({version:1,samples,selectedID:samples.some(item=>item.id===saved?.selectedID)?saved.selectedID:samples[0].id,
          spacingDefaults:1,lineHeight:saved?.spacingDefaults===1&&Number.isFinite(saved?.lineHeight)&&saved.lineHeight>=0.8&&saved.lineHeight<=3?saved.lineHeight:1.15,
          letterSpacing:saved?.spacingDefaults===1&&Number.isFinite(saved?.letterSpacing)&&saved.letterSpacing>=-0.1&&saved.letterSpacing<=0.5?saved.letterSpacing:0,
          size:Math.round(saved?.size>=8&&saved.size<=300?saved.size:40),features,
          language:languages.some(item=>item.value===saved?.language)?saved.language:'',direction:directions.some(item=>item.value===saved?.direction)?saved.direction:'auto'});
      } catch(e){setSaveStatus(e.message);setSaveError(true);}
    })();
    let sequence=0;
    async function updateFont(){const token=++sequence;try{const next=await counterplay.document.summary();if(alive.current&&sequence===token){setSummary(next);setMaster(previous=>next.masters.some(item=>item.id===previous)?previous:next.context.selectedMasterID);}}catch(e){if(alive.current)setError(e.message);}}
    updateFont();const off=counterplay.on('document.changed',updateFont);const offSelection=counterplay.on('selection.changed',updateFont);
    return()=>{off();offSelection();};
  },[]);
  useEffect(()=>{if(!library)return;savePending.current=library;setSaveStatus('Saving…');save();},[library]);
  useEffect(()=>{if(library)setSizeDraft(String(library.size));},[library?.size]);
  useEffect(()=>{
    const observer=new ResizeObserver(()=>setWidth(Math.min(2400,Math.max(240,Math.floor(viewport.current.clientWidth-12)))));
    if(viewport.current)observer.observe(viewport.current);return()=>observer.disconnect();
  },[]);
  async function drainRender(){
    if(rendering.current)return;rendering.current=true;setBusy(true);
    try{while(renderPending.current&&alive.current){
      const next=renderPending.current;renderPending.current=null;
      try {
        const cacheKey=JSON.stringify([next.generation,next.masterID]);
        if(fontCache.current?.key!==cacheKey||next.refresh){
          const compiled=await counterplay.font.compile({masterID:next.masterID,refresh:next.refresh});
          const family='Preview'+next.id;const face=await new FontFace(family,`url(${compiled.dataURL})`).load();
          if(!alive.current)break;
          if(fontCache.current?.face)document.fonts.delete(fontCache.current.face);
          document.fonts.add(face);fontCache.current={key:cacheKey,face,family};
        }
        const result=await counterplay.font.render({text:next.text,masterID:next.masterID,size:next.size,lineHeight:next.lineHeight,letterSpacing:next.letterSpacing,width:next.width,features:next.features,language:next.language,direction:next.direction});
        if(!alive.current||next.id!==requestID.current)continue;
        setRendered(result);setFontFamily(fontCache.current.family);setError('');
      }catch(e){if(alive.current&&next.id===requestID.current){setError(e.message);setRendered(null);}}
    }}finally{rendering.current=false;if(alive.current)setBusy(false);}
  }
  useEffect(()=>{
    if(!selected||!summary||!master)return;
    const id=++requestID.current;
    const timer=setTimeout(()=>{
      const needsRefresh=refresh!==refreshSeen.current;refreshSeen.current=refresh;
      renderPending.current={id,generation:summary.context.generation,masterID:master,text:selected.text,size:library.size,lineHeight:library.lineHeight,letterSpacing:library.letterSpacing,width,features:library.features,language:library.language,direction:library.direction,refresh:needsRefresh};drainRender();
    },75);
    return()=>clearTimeout(timer);
  },[selected?.text,summary,master,library?.size,library?.lineHeight,library?.letterSpacing,library?.features,library?.language,library?.direction,width,refresh]);
  function add(copy=false){
    if(!library||library.samples.length>=500)return;
    const item={id:uniqueID(),title:copy?(selected.title+' copy').slice(0,120):'My text',text:copy?selected.text:''};
    setLibrary({...library,samples:[item,...library.samples],selectedID:item.id});setTextsOpen(false);requestAnimationFrame(()=>editor.current?.focus());
  }
  function remove(){if(library.samples.length<=1)return;const index=library.samples.findIndex(item=>item.id===selected.id),samples=library.samples.filter(item=>item.id!==selected.id);setRemoved({index,item:selected});patch({samples,selectedID:samples[Math.min(index,samples.length-1)].id});}
  function undoRemove(){const samples=[...library.samples];samples.splice(removed.index,0,removed.item);patch({samples,selectedID:removed.item.id});setRemoved(null);}
  const texts=h(Popover,{title:'Text library',trigger:h(React.Fragment,null,'Texts',h('span',{className:'text-trigger-name'},selected?.title||'')),open:textsOpen,onOpenChange:setTextsOpen,className:'text-library'},
    h('div',{className:'text-library-head'},h('span',{className:'cp-muted'},(library?.samples.length||0)+' texts · click to apply'),h(Button,{onClick:()=>add(),disabled:!library||library.samples.length>=500},'Add text')),
    h('div',{className:'text-list','aria-label':'Text samples'},library?.samples.map(item=>h(Button,{key:item.id,className:'text-sample','aria-pressed':item.id===selected.id,onClick:()=>{patch({selectedID:item.id});setTextsOpen(false);setEditing(false);}},h('strong',null,item.title||'Untitled text'),h('span',null,item.text||'Write your own sample…')))),
    selected&&h('div',{className:'text-library-actions'},h('label',{className:'cp-input-label'},'Sample name',h(Input,{'aria-label':'Sample name',value:selected.title,maxLength:120,onChange:event=>updateSample({title:event.target.value})})),h('div',{className:'cp-row'},h(Button,{onClick:()=>add(true),disabled:library.samples.length>=500},'Duplicate'),h(Button,{onClick:remove,disabled:library.samples.length<=1,variant:'destructive'},'Remove text'),removed&&h(Button,{onClick:undoRemove},'Undo removal'))));
  const priority=['kern','liga','clig','calt','dlig','smcp','c2sc','onum','lnum','tnum','pnum','frac','zero'];
  const ordered=[...available].sort((a,b)=>(priority.includes(a)?priority.indexOf(a):99)-(priority.includes(b)?priority.indexOf(b):99)||a.localeCompare(b));
  const features=h(Popover,{title:'OpenType features',trigger:h(React.Fragment,null,'Features',featureCount>0&&h('span',{className:'feature-count'},featureCount)),open:featuresOpen,onOpenChange:setFeaturesOpen,side:'top',className:'features-popover'},
    h('p',{className:'cp-muted'},available.length?`${available.length} features in this font. Default keeps automatic shaping.`:'No OpenType features in this font.'),
    h('div',{className:'feature-list'},ordered.map(tag=>h(FeatureControl,{key:tag,value:library?.features[tag],tag,onChange:value=>{
      const next={...library.features};if(value===undefined)delete next[tag];else next[tag]=value;
      if(Object.keys(next).length>128){setError('Use up to 128 feature overrides. Reset features to start again.');return;}patch({features:next});
    }}))),h('div',{className:'feature-bottom'},h(Select,{label:'Shaping language',items:languages,value:library?.language||'',onValueChange:language=>patch({language})}),h(Select,{label:'Text direction',items:directions,value:library?.direction||'auto',onValueChange:direction=>patch({direction})}),h(Button,{onClick:()=>patch({features:{},language:'',direction:'auto'})},'Reset')));
  const header=h(React.Fragment,null,h('div',{className:'preview-title'},h('h1',{className:'cp-heading'},summary?.familyName||'Font Preview'),h('p',{className:'cp-muted'},summary?summary.glyphCount+' glyphs · live font preview':'Preparing the current font…')),
    h('div',{className:'preview-header-controls'},summary&&h(Select,{label:'Preview master',items:summary.masters.map(item=>({value:item.id,label:item.name})),value:master,onValueChange:setMaster}),texts));
  const spacingControl=(key,label,min,max,step,unit)=>h('label',{className:'preview-spacing'},h('span',{className:'cp-muted'},label),h(Slider,{label,min,max,step,value:library?.[key]??(key==='lineHeight'?1.15:0),disabled:!library,onValueChange:value=>patch({[key]:value})}),h(Input,{type:'number',min,max,step,'aria-label':label+' value',value:library?.[key]??0,disabled:!library,onChange:event=>{const value=Number(event.target.value);if(event.target.value!==''&&Number.isFinite(value)&&value>=min&&value<=max)patch({[key]:value});}}),h('span',{className:'cp-muted'},unit));
  const footer=h('div' ,{className:'preview-footer'},h('div',{className:'preview-size'},h('span',{className:'preview-size-small','aria-hidden':true},'A'),h(Slider,{label:'Font size',min:8,max:300,step:1,value:library?.size||40,disabled:!library,onValueChange:size=>patch({size})}),h('span',{className:'preview-size-large','aria-hidden':true},'A'),h(Input,{type:'number',min:8,max:300,value:sizeDraft,'aria-label':'Preview size',disabled:!library,onChange:event=>{setSizeDraft(event.target.value);const size=Number(event.target.value);if(Number.isInteger(size)&&size>=8&&size<=300)patch({size});},onBlur:()=>{const size=Math.min(300,Math.max(8,Math.round(Number(sizeDraft)||40)));setSizeDraft(String(size));patch({size});}}),h('span',{className:'cp-muted'},'pt')),
    spacingControl('lineHeight','Line height',0.8,3,0.05,'×'),spacingControl('letterSpacing','Tracking',-0.1,0.5,0.005,'em'),h('div',{className:'preview-footer-actions'},features,h(Button,{onClick:()=>{if(saveError&&library){savePending.current=library;save();}setRefresh(value=>value+1);},disabled:!summary},'Refresh')));
  const status=error||(busy?'Updating preview…':rendered?.missingGlyphs?rendered.missingGlyphs+' missing glyphs in this font':'Current font · unsaved edits included');
  const textEditor=selected&&h('div',{className:'preview-edit-area'},h('textarea',{
    ref:editor,className:'preview-editor','aria-label':'Preview text',value:selected.text,maxLength:8192,spellCheck:false,readOnly:fontFamily==='system-ui',placeholder:'Write your sample text…',dir:library.direction,lang:library.language||undefined,
    style:{fontFamily:`"${fontFamily}"`,fontSize:library.size+'px',lineHeight:library.lineHeight,letterSpacing:library.letterSpacing+'em',fontFeatureSettings:Object.entries(library.features).map(([tag,value])=>`"${tag}" ${value}`).join(',')||'normal'},
    onFocus:()=>setEditing(true),onChange:event=>updateSample({text:event.target.value}),onBlur:()=>setEditing(false),
    onKeyDown:event=>{if(event.key==='Escape'){event.preventDefault();event.currentTarget.blur();}}
  }));
  return h(Shell,{header,footer},h('div',{className:'preview-workspace'},
    h('div',{className:'preview-status'},h('span',{className:error?'cp-error':'',role:'status'},status),
      h('span',{className:saveError?'cp-error':'cp-muted',role:'status'},saveStatus),h('span',{className:'preview-edit-notice'},editing?'Editing sample · click outside to finish':'Click the text to edit')),
    h('section',{ref:viewport,'aria-label':'Font preview'},textEditor||h('p',{className:'preview-empty'},'Loading…'))
  ));
}
mount(document.getElementById('app'),h(App));
