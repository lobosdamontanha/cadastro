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

function fillRegistration(doc,font){
 const p=doc.getPage(0);
 // All coordinates are PDF points, origin bottom-left.
 text(p,font,val("nome"),18,731,8,365);
 text(p,font,val("sexo"),420,706,7,120);
 text(p,font,val("apelido"),18,686,8,235); text(p,font,val("estadoCivil"),255,686,8,250);
 text(p,font,val("ufNasc"),18,660,8,85); text(p,font,val("cidadeNasc"),125,660,8,260); text(p,font,dateBR("dataNasc"),455,660,8,100);
 text(p,font,val("escolaridade"),18,634,8,135); text(p,font,val("corRaca"),160,634,8,105); text(p,font,val("endereco"),270,634,8,420); text(p,font,val("numero"),520,634,8,45);
 text(p,font,val("complemento"),18,608,8,200); text(p,font,val("bairro"),215,608,8,190); text(p,font,val("cidade"),400,608,8,160);
 text(p,font,val("uf"),18,583,8,65); text(p,font,val("cep"),105,583,8,85); text(p,font,val("telResid"),180,583,8,125); text(p,font,val("telCel"),305,583,8,120); text(p,font,val("profissao"),430,583,8,135);
 text(p,font,val("estrangeiro"),18,557,8,65); text(p,font,val("paisNasc"),115,557,8,260);
 text(p,font,val("email"),18,532,8,240); text(p,font,val("localTrabalho"),260,532,8,270);
 text(p,font,val("rg"),18,506,8,130); text(p,font,val("orgaoRG"),180,506,8,130); text(p,font,val("cpf"),320,506,8,115); text(p,font,val("clubeServico"),430,506,8,90); text(p,font,val("religiao"),525,506,8,50);
 if($("tipo").value==="jovem"){
  text(p,font,val("respNome"),18,461,8,300); text(p,font,val("respSexo"),315,461,7,100); text(p,font,val("parentesco"),485,461,7,85);
  text(p,font,val("respEstrangeiro"),18,436,8,65); text(p,font,val("respPaisNasc"),105,436,8,260); text(p,font,val("respEstadoCivil"),430,436,8,120);
  text(p,font,val("respCidadeNasc"),18,411,8,300); text(p,font,val("respUfNasc"),430,411,8,80); text(p,font,dateBR("respDataNasc"),515,411,8,60);
  text(p,font,val("respEscolaridade"),18,385,8,180); text(p,font,val("respCorRaca"),205,385,8,100); text(p,font,val("respEndereco"),310,385,8,190); text(p,font,val("respNumero"),515,385,8,50);
  text(p,font,val("respComplemento"),18,360,8,180); text(p,font,val("respBairro"),205,360,8,180); text(p,font,val("respCidade"),390,360,8,170);
  text(p,font,val("respUf"),18,335,8,60); text(p,font,val("respCep"),90,335,8,90); text(p,font,val("respTelResid"),175,335,8,115); text(p,font,val("respTelCel"),300,335,8,115); text(p,font,val("respProfissao"),430,335,8,120);
  text(p,font,val("respEmail"),18,309,8,250); text(p,font,val("respLocalTrabalho"),275,309,8,270);
  text(p,font,val("respRg"),18,284,8,190); text(p,font,val("respOrgaoRG"),205,284,8,170); text(p,font,val("respCpf"),390,284,8,180);
 }
 text(p,font,dateBR("dataNasc"),80,126,8,65);
 text(p,font,val("nome"),220,101,8,160);
 text(p,font,val("respNome"),385,101,8,170);
}

function fillMedical(doc,font){
 const p1=doc.getPage(0), p2=doc.getPage(1);
 text(p1,font,val("nome"),55,738,8,115); text(p1,font,val("registro"),190,738,8,75); text(p1,font,dateBR("dataNasc"),300,738,8,75); text(p1,font,val("sexo"),410,738,7,85);
 text(p1,font,val("altura"),80,713,8,65); text(p1,font,val("peso"),205,713,8,65); text(p1,font,val("tipoSang"),335,713,8,70); text(p1,font,val("rh"),460,713,8,70);
 text(p1,font,val("emergTel"),470,644,8,75); text(p1,font,val("convenio"),35,558,7,95); text(p1,font,val("plano"),145,558,7,110); text(p1,font,val("docPlano"),270,558,7,125); text(p1,font,val("medico"),410,558,7,115); text(p1,font,val("medicoTel"),520,558,7,65);
 // checkbox marks: approximate centers of the printed boxes
 const checks1=[
 ["sabeNadar",24,489],["sonambulo",310,489],["impFisico",24,471],["restrAlim",310,471],
 ["alergInseto",24,412],["alergPlantas",310,412],["alergAcaros",24,385],["alergFungos",310,385],["alergMed",24,358],["alergOutro",310,358],["alergAlim",24,331],
 ["oculos",24,272],["lentes",310,272],["apDent",24,254],["sonda",310,254],["marcapasso",24,236],["audicao",310,236],["bomba",24,218],["auxOutro",310,218],
 ["asma",24,160],["rinite",190,160],["hipertensao",350,160],["diabetes",475,160],["convulsoes",24,141],["dermat",190,141],["cardiacos",350,141],["reumato",475,141],["hemato",24,122],["outrosProb",190,122],["acompMed",24,103],
 ];
 checks1.forEach(([id,x,y])=>{if(checked(id))mark(p1,x,y)});
 text(p1,font,val("impFisicoTxt"),55,452,7,250);text(p1,font,val("restrAlimTxt"),345,452,7,250);text(p1,font,val("alergiasTxt"),55,318,7,250);text(p1,font,val("auxOutroTxt"),345,205,7,250);
 text(p1,font,val("outrosProbTxt"),230,103,7,250);text(p1,font,val("acompMedTxt"),155,83,7,350);
 const c2=[["defFisica",24,804],["defVisual",230,804],["defAuditiva",430,804],["defIntelectual",24,800],["autismo",230,800]];
 c2.forEach(([id,x,y])=>{if(checked(id))mark(p2,x,y)});
 text(p2,font,val("defTxt"),55,783,7,500);
 const meds=[1,2,3,4,5]; meds.forEach((n,i)=>{let y=710-i*32;text(p2,font,val("med"+n),75,y,7,170);text(p2,font,val("uso"+n),235,y,7,170);text(p2,font,val("info"+n),390,y,7,170)});
 const mental=[["transtorno",24,530],["medTranstorno",300,530],["psicologo",24,503],["medicoAcomp",300,503],["outroProf",24,476],["agrideSi",24,417],["agrideOutros",310,417],["agitacao",24,390],["desobediencia",310,390],["fugas",24,363],["autodestrutivo",310,363],["ansiedade",24,336],["comunicacao",310,336],["alimentar",24,309],["sono",310,309]];
 mental.forEach(([id,x,y])=>{if(checked(id))mark(p2,x,y)});
 text(p2,font,val("saudeMentalTxt"),55,450,7,500);text(p2,font,val("comportTxt"),55,275,7,500);text(p2,font,val("observacoes"),55,175,7,500);
 text(p2,font,new Date().toLocaleDateString("pt-BR"),105,96,7,90);
}

function fillImage(doc,font){
 const p=doc.getPage(0);
 text(p,font,val("imgNome")||val("nome"),190,642,9,350);
 text(p,font,dateBR("imgData")||dateBR("dataNasc"),270,615,8,120);
 text(p,font,val("imgCpf")||val("cpf"),65,590,8,170); text(p,font,val("imgRg")||val("rg"),315,590,8,180);
 text(p,font,val("imgResp")||val("respNome"),255,563,8,300);
 text(p,font,val("imgRespCpf")||val("respCpf"),65,538,8,170); text(p,font,val("imgRespRg")||val("respRg"),315,538,8,180);
 const p2=doc.getPage(1); text(p2,font,val("imgLocalData")||"Nova Trento - SC",160,260,8,400);
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