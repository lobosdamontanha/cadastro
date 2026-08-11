pdfjsLib.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
const $=id=>document.getElementById(id), root=document.documentElement;
const model={reg:["modelos/ficha_registro.pdf",1],med:["modelos/ficha_medica.pdf",2],img:["modelos/autorizacao_imagem.pdf",2]};
let current="reg", page=1, pdfDoc=null, edit=false, drag=null;
const defaults={};

function v(id){return ($(id)?.value||"").trim()}
function d(id){let x=v(id);if(!x)return"";let [a,b,c]=x.split("-");return `${c}/${b}/${a}`}
function save(){const o={};document.querySelectorAll("input,textarea").forEach(e=>o[e.id]=e.value);o.layout=JSON.parse(localStorage.getItem("gelmLayout")||"{}");localStorage.setItem("gelmData",JSON.stringify(o))}
function load(){const o=JSON.parse(localStorage.getItem("gelmData")||"{}");Object.entries(o).forEach(([k,val])=>{if(k!=="layout"&&$(k))$(k).value=val});if(o.imgNome==="")$("imgNome").value=v("nome");if(o.imgResp==="")$("imgResp").value=v("respNome")}
function layoutKey(){return `${current}-${page}`}
function layouts(){return JSON.parse(localStorage.getItem("gelmLayout")||"{}")}
function setLayouts(o){localStorage.setItem("gelmLayout",JSON.stringify(o))}
function def(id,x,y,w=22){return {x,y,w}}
function setupDefaults(){
 // Percent coordinates relative to the original PDF page. They are intentionally editable like Canva.
 const r={};
 const put=(id,x,y,w)=>r[id]=def(id,x,y,w);
 put("nome",3,12,60);put("sexo",70,14,18);put("apelido",3,19,38);put("estadoCivil",43,19,40);put("ufNasc",3,25,12);put("cidadeNasc",20,25,35);put("dataNasc",77,25,18);
 put("escolaridade",3,31,20);put("corRaca",27,31,18);put("endereco",46,31,38);put("numero",87,31,8);put("complemento",3,37,28);put("bairro",36,37,27);put("cidade",67,37,28);
 put("uf",3,43,9);put("cep",14,43,15);put("telResid",31,43,20);put("telCel",52,43,20);put("profissao",74,43,22);put("estrangeiro",3,49,13);put("paisNasc",18,49,40);put("email",3,55,38);put("localTrabalho",43,55,45);put("rg",3,61,28);put("orgaoRG",32,61,20);put("cpf",54,61,20);put("clubeServico",76,61,10);put("religiao",88,61,9);
 const rr={respNome:[3,73,60],respSexo:[70,73,15],parentesco:[86,73,12],respEstrangeiro:[3,79,14],respPaisNasc:[18,79,40],respEstadoCivil:[61,79,28],respCidadeNasc:[3,85,50],respUfNasc:[55,85,10],respDataNasc:[67,85,20],respEscolaridade:[3,91,28],respCorRaca:[32,91,17],respEndereco:[51,91,35],respNumero:[88,91,8],respComplemento:[3,97,28],respBairro:[33,97,27],respCidade:[62,97,31],respUf:[3,103,9],respCep:[14,103,15],respTelResid:[31,103,20],respTelCel:[52,103,20],respProfissao:[74,103,22],respEmail:[3,109,40],respLocalTrabalho:[45,109,50],respRg:[3,115,30],respOrgaoRG:[35,115,25],respCpf:[62,115,30]};
    Object.entries(rr).forEach(([id,a])=>put(id,...a));
    defaults.reg=[r];
    const m1={};
    const pm=(id,x,y,w)=>m1[id]=def(id,x,y,w);
    pm("nome",4,11,28);pm("registro",31,11,16);pm("dataNasc",50,11,14);pm("sexo",69,11,12);pm("altura",5,16,12);pm("peso",25,16,12);pm("tipoSang",46,16,14);pm("rh",70,16,12);
    pm("emergencia",5,24,78);pm("avisar",70,24,25);pm("emergTel",82,27,15);pm("permiteMedicacao",5,30,35);pm("autonomiaMedicacao",45,30,35);
    pm("convenio",5,40,17);pm("plano",23,40,18);pm("docPlano",42,40,20);pm("medico",64,40,18);pm("medicoTel",84,40,13);
    [["sabeNadar",5,47,18],["sonambulo",50,47,18],["impFisico",5,51,40],["restrAlim",51,51,40],["alergInseto",5,59,40],["alergPlantas",51,59,40],["alergAcaros",5,63,40],["alergFungos",51,63,40],["alergMed",5,67,40],["alergOutro",51,67,40],["alergAlim",5,71,40],["oculos",5,78,20],["lentes",50,78,20],["apDent",5,81,20],["sonda",50,81,20],["marcapasso",5,84,20],["audicao",50,84,20],["bomba",5,87,20],["auxOutro",50,87,40],["asma",5,93,18],["rinite",25,93,18],["hipertensao",45,93,18],["diabetes",65,93,18],["convulsoes",5,96,18],["dermat",25,96,18],["cardiacos",45,96,18],["reumato",65,96,18],["hemato",5,99,18],["outrosProb",25,99,35],["acompMed",5,102,55]].forEach(a=>pm(...a));
    const m2={};const pm2=(id,x,y,w)=>m2[id]=def(id,x,y,w);
    [["defFisica",5,5,25],["defVisual",32,5,25],["defAuditiva",62,5,25],["defIntelectual",5,10,25],["autismo",32,10,25],["transtorno",5,36,40],["medTranstorno",50,36,40],["psicologo",5,40,40],["medicoAcomp",50,40,40],["outroProf",5,44,80],["agrideSi",5,51,40],["agrideOutros",50,51,40],["agitacao",5,55,40],["desobediencia",50,55,40],["fugas",5,59,40],["autodestrutivo",50,59,40],["ansiedade",5,63,40],["comunicacao",50,63,40],["alimentar",5,67,40],["sono",50,67,40],["observacoes",5,78,88]].forEach(a=>pm2(...a));
    defaults.med=[m1,m2];
    const i1={};const pi=(id,x,y,w)=>i1[id]=def(id,x,y,w);pi("imgNome",20,24,65);pi("imgData",35,28,20);pi("imgCpf",8,32,30);pi("imgRg",55,32,30);pi("imgResp",25,36,65);pi("imgRespCpf",8,40,30);pi("imgRespRg",55,40,30);const i2={};const pi2=(id,x,y,w)=>i2[id]=def(id,x,y,w);pi2("imgLocalData",20,70,65);defaults.img=[i1,i2];
}
setupDefaults();
function fieldsFor(){return current==="reg"?Object.keys(defaults.reg[0]):defaults[current][page-1]?Object.keys(defaults[current][page-1]):[]}
function getLayout(){const all=layouts(), key=layoutKey();if(!all[key]){all[key]=defaults[current][page-1]||{};setLayouts(all)}return all[key]}
function valueFor(id){if(id==="nome")return v("nome");if(id==="dataNasc")return d("dataNasc");if(id==="respDataNasc")return d("respDataNasc");if(id==="imgData")return d("imgData");return v(id)}
async function render(){
 if(current==="reg")page=1;
 const file=model[current][0];pdfDoc=await pdfjsLib.getDocument(file).promise;
 const pg=await pdfDoc.getPage(page);
 const wrap=$("canvasWrap"), canvas=$("pageCanvas"), maxW=Math.min(wrap.clientWidth-30,760), base=pg.getViewport({scale:1}), scale=maxW/base.width, vp=pg.getViewport({scale});
 canvas.width=vp.width;canvas.height=vp.height;await pg.render({canvasContext:canvas.getContext("2d"),viewport:vp}).promise;
 wrap.style.setProperty("--cw",canvas.width+"px");wrap.style.setProperty("--ch",canvas.height+"px");
 $("pageInfo").textContent=`${current.toUpperCase()} — página ${page}/${pdfDoc.numPages}`;
 drawFields(canvas.width,canvas.height);
}
function drawFields(w,h){
 const layer=$("fieldsLayer");layer.innerHTML="";layer.classList.toggle("editing",edit);
 const lay=getLayout();
 fieldsFor().forEach(id=>{
   const p=lay[id];if(!p)return;
   const el=document.createElement("div");el.className="field";el.dataset.id=id;el.textContent=valueFor(id)||`{${id}}`;
   el.style.left=(p.x*w/100)+"px";el.style.top=(p.y*h/100)+"px";el.style.width=(p.w*w/100)+"px";el.style.fontSize=Math.max(7,w/90)+"px";
   el.onpointerdown=e=>{if(!edit)return;drag={id,el,startX:e.clientX,startY:e.clientY,origX:p.x,origY:p.y,w,h};el.setPointerCapture(e.pointerId)};
   el.onpointermove=e=>{if(!drag||drag.id!==id)return;const dx=(e.clientX-drag.startX)/w*100,dy=(e.clientY-drag.startY)/h*100;const all=layouts();all[layoutKey()][id].x=Math.max(0,Math.min(98,drag.origX+dx));all[layoutKey()][id].y=Math.max(0,Math.min(99,drag.origY+dy));setLayouts(all);el.style.left=(all[layoutKey()][id].x*w/100)+"px";el.style.top=(all[layoutKey()][id].y*h/100)+"px"};
   el.onpointerup=()=>drag=null;layer.appendChild(el);
 });
}
$("toggleEdit").onclick=()=>{edit=!edit;$("canvasWrap").classList.toggle("editing",edit);drawFields($("pageCanvas").width,$("pageCanvas").height);$("toggleEdit").textContent=edit?"✓ Ajustando campos":"🎨 Ajustar campos"};
document.querySelectorAll(".steps button").forEach(b=>b.onclick=()=>{const n=+b.dataset.step;current=n===1?"reg":n===2?"med":"img";page=1;document.querySelectorAll(".panel").forEach(x=>x.classList.add("hidden"));$(`p${n}`).classList.remove("hidden");render()});
$("prev").onclick=()=>{if(page>1){page--;render()}};$("next").onclick=()=>{if(pdfDoc&&page<pdfDoc.numPages){page++;render()}};
document.querySelectorAll("input,textarea").forEach(e=>e.addEventListener("input",()=>{save();drawFields($("pageCanvas").width,$("pageCanvas").height)}));
$("saveData").onclick=()=>{save();alert("Dados e posições salvos neste navegador.")};
$("clearData").onclick=()=>{if(confirm("Apagar todos os dados e posições?")){localStorage.clear();location.reload()}};

async function makePdf(kind){
 const bytes=await fetch(model[kind][0]).then(r=>r.arrayBuffer());
 const pdf=await PDFLib.PDFDocument.load(bytes);
 const pages=pdf.getPages();const all=layouts();const font=await pdf.embedFont(PDFLib.StandardFonts.Helvetica);
 const form=kind==="reg"?defaults.reg:defaults[kind];
 for(let pi=0;pi<pages.length;pi++){
   const lay=all[`${kind}-${pi+1}`]||form[pi]||{};const pg=pages[pi], {width,height}=pg.getSize();
   Object.keys(lay).forEach(id=>{
     const txt=valueFor(id);if(!txt)return;
     const p=lay[id];const x=p.x/100*width,y=height-(p.y/100*height)-8;
     let size=8;while(size>5&&font.widthOfTextAtSize(txt,size)>p.w/100*width)size-=.25;
     pg.drawText(txt,{x,y,size,font,color:PDFLib.rgb(.05,.05,.05),maxWidth:p.w/100*width});
   });
 }
 return pdf.save();
}
$("generate").onclick=async()=>{
 save();const result=$("result");result.innerHTML="Gerando...";
 try{
   const types=["reg","med"];if(v("tipo")==="jovem")types.push("img");
   for(const k of types){const b=await makePdf(k),a=document.createElement("a");a.href=URL.createObjectURL(new Blob([b],{type:"application/pdf"}));a.download=`${k==="reg"?"01-Ficha-Registro":k==="med"?"02-Ficha-Medica":"03-Autorizacao-Imagem"}_${v("nome")||"GELM"}.pdf`;a.click()}
   result.innerHTML="<div class='notice'>✓ PDFs gerados. As posições que você ajustou no modo Canva foram utilizadas.</div>"
 }catch(e){console.error(e);result.innerHTML="<div class='notice'>Erro: "+e.message+"</div>"}
};
load();render();
