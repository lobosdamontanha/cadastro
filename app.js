const { PDFDocument, StandardFonts, rgb } = PDFLib;
const $=id=>document.getElementById(id);
let page=0;
const pages=[...document.querySelectorAll(".page")];
function showPage(n){page=Math.max(0,Math.min(2,n));pages.forEach((p,i)=>p.classList.toggle("hidden",i!==page));document.querySelectorAll(".step").forEach((s,i)=>s.classList.toggle("active",i===page));$("prev").disabled=page===0;$("next").classList.toggle("hidden",page===2);$("generate").classList.toggle("hidden",page!==2);window.scrollTo({top:0,behavior:"smooth"})}
$("next").onclick=()=>{if(page===0 && !$("nome").value.trim()){alert("Informe o nome completo.");return}showPage(page+1)}
$("prev").onclick=()=>showPage(page-1);
$("tipo").onchange=()=>{$("responsavelBox").classList.toggle("hidden",$("tipo").value==="adulto")};

const val=id=>$(id)?.value?.trim()||"";
const checked=id=>$(id)?.checked||false;
const dateBR=id=>{let v=val(id); if(!v)return ""; let [y,m,d]=v.split("-"); return d+"/"+m+"/"+y};
const f=async()=>PDFDocument.create();
async function loadTemplate(name){const b=await fetch("modelos/"+name).then(r=>r.arrayBuffer());return PDFDocument.load(b)}
async function font(){return PDFDocument.create().then(d=>d.embedFont(StandardFonts.Helvetica))}
function text(page,font,text,x,y,size=8,maxWidth=0){
 if(!text)return; let s=size; if(maxWidth){while(s>5 && font.widthOfTextAtSize(text,s)>maxWidth)s-=.25}
 page.drawText(text,{x,y,size:s,font,color:rgb(0.08,0.08,0.08)});
}
function center(page,font,text,y,size=8){if(!text)return;let w=font.widthOfTextAtSize(text,size);text(page,font,text,(595-w)/2,y,size)}
function box(page,x,y,w,h){page.drawRectangle({x,y,width:w,height:h,borderWidth:0.8,borderColor:rgb(.2,.2,.2)})}
function mark(page,x,y){page.drawText("X",{x,y,size:8,font:helv,color:rgb(.05,.25,.12)})}
let helv;
async function baseFont(){if(!helv)helv=await font();return helv}

function fitText(page,font,value,x,y,maxWidth,size=8){
  if(!value)return;
  let s=size;
  while(s>4.5 && font.widthOfTextAtSize(String(value),s)>maxWidth)s-=0.25;
  page.drawText(String(value),{x,y,size:s,font,color:rgb(0.08,0.08,0.08)});
}
function markBox(page,x,y){
  page.drawText("X",{x,y,size:7.5,font:helv,color:rgb(0.08,0.28,0.12)});
}
function yes(id){return ["Sim","sim","true","1"].includes(val(id))}
function dateOrEmpty(id){return dateBR(id)}

function fillRegistration(doc,font){
 const p=doc.getPage(0);
 const T=(id,x,y,w,s=8)=>fitText(p,font,val(id),x,y,w,s);
 const D=(id,x,y,w,s=8)=>fitText(p,font,dateOrEmpty(id),x,y,w,s);

 // A4: 595.28 x 841.89 pt. Coordinates calibrated against the supplied blank form.
 T("nome",18,728,375,8);
 T("sexo",421,701,105,7);
 T("apelido",18,679,230,8); T("estadoCivil",256,679,245,8);
 T("ufNasc",18,654,75,8); T("cidadeNasc",122,654,250,8); D("dataNasc",455,654,105,8);
 T("escolaridade",18,629,125,8); T("corRaca",160,629,100,8); T("endereco",270,629,235,8); T("numero",520,629,45,8);
 T("complemento",18,604,185,8); T("bairro",220,604,180,8); T("cidade",405,604,165,8);
 T("uf",18,579,55,8); T("cep",100,579,85,8); T("telResid",185,579,120,8); T("telCel",307,579,120,8); T("profissao",430,579,135,8);
 T("estrangeiro",18,554,70,8); T("paisNasc",115,554,270,8);
 T("email",18,529,245,8); T("localTrabalho",355,529,220,8);
 T("rg",18,504,185,8); T("orgaoRG",220,504,125,8); T("cpf",355,504,120,8); T("clubeServico",485,504,55,8); T("religiao",545,504,40,7);

 if($("tipo").value==="jovem"){
   T("respNome",18,459,370,8); T("respSexo",405,459,80,7); T("parentesco",500,459,85,7);
   T("respEstrangeiro",18,434,70,8); T("respPaisNasc",115,434,275,8); T("respEstadoCivil",435,434,145,8);
   T("respCidadeNasc",18,409,385,8); T("respUfNasc",405,409,70,8); D("respDataNasc",490,409,90,8);
   T("respEscolaridade",18,384,180,8); T("respCorRaca",205,384,100,8); T("respEndereco",310,384,200,8); T("respNumero",520,384,45,8);
   T("respComplemento",18,359,180,8); T("respBairro",220,359,180,8); T("respCidade",405,359,165,8);
   T("respUf",18,334,55,8); T("respCep",100,334,85,8); T("respTelResid",185,334,115,8); T("respTelCel",305,334,115,8); T("respProfissao",425,334,140,8);
   T("respEmail",18,309,250,8); T("respLocalTrabalho",275,309,290,8);
   T("respRg",18,284,180,8); T("respOrgaoRG",205,284,175,8); T("respCpf",390,284,190,8);
 }

 // Signature/date area.
 D("dataNasc",72,113,70,7);
 T("nome",210,91,160,7);
 T("respNome",390,91,175,7);
}

function fillMedical(doc,font){
 const p=doc.getPage(0), q=doc.getPage(1);
 const T=(pg,id,x,y,w,s=6.7)=>fitText(pg,font,val(id),x,y,w,s);
 const D=(pg,id,x,y,w,s=6.7)=>fitText(pg,font,dateOrEmpty(id),x,y,w,s);

 // Page 1 — identification.
 T(p,"nome",36,738,115,7.2); T(p,"registro",185,738,75,7.2); D(p,"dataNasc",295,738,75,7.2); T(p,"sexo",405,738,75,7);
 T(p,"altura",60,713,60,7); T(p,"peso",190,713,60,7); T(p,"tipoSang",320,713,60,7); T(p,"rh",450,713,60,7);

 // Emergency section: print the selected answers as text, so nothing depends on checkbox coordinates.
 T(p,"emergencia",36,665,520,6.5); T(p,"emergTel",470,644,80,6.5);
 T(p,"permiteMedicacao",36,625,180,6.5); T(p,"autonomiaMedicacao",240,625,180,6.5); T(p,"avisar",430,625,120,6.5);

 // Health plan.
 T(p,"convenio",35,558,95,7); T(p,"plano",145,558,105,7); T(p,"docPlano",270,558,125,7);
 T(p,"medico",410,558,110,7); T(p,"medicoTel",525,558,65,7);

 // General information.
 T(p,"sabeNadar",35,490,80,6.7); T(p,"sonambulo",310,490,80,6.7);
 T(p,"impFisicoTxt",35,468,250,6.5); T(p,"restrAlimTxt",310,468,250,6.5);

 // Allergies — compact text lines.
 T(p,"alergInseto",35,425,235,6.5); T(p,"alergPlantas",310,425,235,6.5);
 T(p,"alergAcaros",35,399,235,6.5); T(p,"alergFungos",310,399,235,6.5);
 T(p,"alergMed",35,373,235,6.5); T(p,"alergOutro",310,373,235,6.5); T(p,"alergAlim",35,347,235,6.5);

 // Auxiliary equipment.
 T(p,"oculos",35,286,100,6.5); T(p,"lentes",310,286,100,6.5);
 T(p,"apDent",35,262,100,6.5); T(p,"sonda",310,262,100,6.5);
 T(p,"marcapasso",35,238,100,6.5); T(p,"audicao",310,238,100,6.5);
 T(p,"bomba",35,214,100,6.5); T(p,"auxOutro",310,214,235,6.5);

 // Physical health.
 const phys=[["asma",35,160],["rinite",185,160],["hipertensao",335,160],["diabetes",455,160],
 ["convulsoes",35,138],["dermat",185,138],["cardiacos",335,138],["reumato",455,138],
 ["hemato",35,116],["outrosProbTxt",185,116],["acompMedTxt",35,94]];
 phys.forEach(([id,x,y])=>T(p,id,x,y,id.includes("Txt")?350:115,6.2));

 // Page 2 — disabilities, medication, mental health, behaviour.
 const def=[["defFisica",35,798],["defVisual",220,798],["defAuditiva",405,798],
 ["defIntelectual",35,775],["autismo",220,775]];
 def.forEach(([id,x,y])=>T(q,id,x,y,145,6.5));
 T(q,"defTxt",35,748,520,6.5);

 for(let n=1;n<=5;n++){
   const y=700-(n-1)*34;
   T(q,"med"+n,35,y,160,6.3); T(q,"uso"+n,215,y,140,6.3); T(q,"info"+n,365,y,190,6.3);
 }
 T(q,"transtorno",35,525,245,6.5); T(q,"medTranstorno",300,525,245,6.5);
 T(q,"psicologo",35,498,245,6.5); T(q,"medicoAcomp",300,498,245,6.5);
 T(q,"outroProf",35,471,510,6.5);
 T(q,"agrideSi",35,415,245,6.5); T(q,"agrideOutros",300,415,245,6.5);
 T(q,"agitacao",35,388,245,6.5); T(q,"desobediencia",300,388,245,6.5);
 T(q,"fugas",35,361,245,6.5); T(q,"autodestrutivo",300,361,245,6.5);
 T(q,"ansiedade",35,334,245,6.5); T(q,"comunicacao",300,334,245,6.5);
 T(q,"alimentar",35,307,245,6.5); T(q,"sono",300,307,245,6.5);
 T(q,"observacoes",35,170,510,7);
 T(q,"saudeMentalTxt",35,445,510,6.5); T(q,"comportTxt",35,280,510,6.5);
 fitText(q,font,new Date().toLocaleDateString("pt-BR"),90,88,80,6.5);
}

function fillImage(doc,font){
 const p=doc.getPage(0), q=doc.getPage(1);
 fitText(p,font,val("imgNome")||val("nome"),120,640,360,8.5);
 fitText(p,font,dateBR("imgData")||dateBR("dataNasc"),235,615,110,8);
 fitText(p,font,val("imgCpf")||val("cpf"),55,590,170,8);
 fitText(p,font,val("imgRg")||val("rg"),330,590,170,8);
 fitText(p,font,val("imgResp")||val("respNome"),165,562,365,8);
 fitText(p,font,val("imgRespCpf")||val("respCpf"),55,537,170,8);
 fitText(p,font,val("imgRespRg")||val("respRg"),330,537,170,8);
 fitText(q,font,val("imgLocalData")||"Nova Trento - SC",125,258,400,8);
}

async function generate(){
 if($("tipo").value==="adulto"){
   const ok=confirm("A autorização de uso de imagem fornecida é específica para criança e adolescente. Para adulto, o documento não será considerado adequado. Deseja mesmo assim gerar os três PDFs com essa ressalva?");
   if(!ok)return;
 }
 const font=await baseFont();
 const reg=await loadTemplate("ficha_registro.pdf"); fillRegistration(reg,font);
 const med=await loadTemplate("ficha_medica.pdf"); fillMedical(med,font);
 const img=await loadTemplate("autorizacao_imagem.pdf"); fillImage(img,font);
 const docs=[["01-Ficha-Registro",reg],["02-Ficha-Medica",med],["03-Autorizacao-Imagem",img]];
 const safe=(val("nome")||"Cadastro-GELM").replace(/[^\p{L}\p{N} _-]/gu,"").replace(/\s+/g,"_");
 for(const [name,doc] of docs){const bytes=await doc.save();download(bytes,`${name}_${safe}.pdf`)}
 // Combined packet
 const packet=await PDFDocument.create();
 for(const [,doc] of docs){const copied=await packet.copyPages(doc,doc.getPageIndices());copied.forEach(p=>packet.addPage(p))}
 const bytes=await packet.save();download(bytes,`Cadastro_Completo_GELM_${safe}.pdf`);
 alert("Pronto! Foram gerados os 3 documentos e um PDF único com o cadastro completo.");
}
function download(bytes,name){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([bytes],{type:"application/pdf"}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),3000)}
$("generate").onclick=generate;
["nome","dataNasc","cpf","rg","respNome","respCpf","respRg"].forEach(id=>$(id)?.addEventListener("input",()=>{
 $("imgNome").value=val("nome");$("imgData").value=$("dataNasc").value;$("imgCpf").value=val("cpf");$("imgRg").value=val("rg");$("imgResp").value=val("respNome");$("imgRespCpf").value=val("respCpf");$("imgRespRg").value=val("respRg");
}));
showPage(0);