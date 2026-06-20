const PROXY_URL = "https://nvidia-api-proxy.chapermann.workers.dev/";
const MODEL = "deepseek-ai/deepseek-v4-pro";

const beds = [
  ...Array.from({ length: 11 }, (_, index) => ({
    id: `vermelha-${index + 1}`,
    label: `Vermelha ${index + 1}`,
    fullLabel: `Leito Vermelha ${index + 1}`,
    unit: "Sala Vermelha",
    order: index + 1,
    input: "",
    summary: "",
    updatedAt: "",
  })),
  ...Array.from({ length: 6 }, (_, index) => ({
    id: `trauma-${index + 1}`,
    label: `Trauma ${index + 1}`,
    fullLabel: `Leito Retaguarda do Trauma ${index + 1}`,
    unit: "Retaguarda do Trauma",
    order: 11 + index + 1,
    input: "",
    summary: "",
    updatedAt: "",
  })),
];

let selectedBedId = beds[0].id;

const els = {
  redBeds: document.querySelector("#redBeds"),
  traumaBeds: document.querySelector("#traumaBeds"),
  redCount: document.querySelector("#redCount"),
  traumaCount: document.querySelector("#traumaCount"),
  selectedUnit: document.querySelector("#selectedUnit"),
  selectedBed: document.querySelector("#selectedBed"),
  bedStatus: document.querySelector("#bedStatus"),
  clinicalInput: document.querySelector("#clinicalInput"),
  generateSummary: document.querySelector("#generateSummary"),
  clearBed: document.querySelector("#clearBed"),
  handoffOutput: document.querySelector("#handoffOutput"),
  copyAll: document.querySelector("#copyAll"),
  downloadTxt: document.querySelector("#downloadTxt"),
  shiftTime: document.querySelector("#shiftTime"),
  message: document.querySelector("#message"),
};

function formatDateTime(date = new Date()) {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatDisplayDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function getSelectedBed() {
  return beds.find((bed) => bed.id === selectedBedId);
}

function renderBeds() {
  els.redBeds.innerHTML = "";
  els.traumaBeds.innerHTML = "";

  beds.forEach((bed) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `bed-button${bed.summary ? " done" : ""}${bed.id === selectedBedId ? " active" : ""}`;
    button.textContent = bed.label;
    button.setAttribute("aria-pressed", String(bed.id === selectedBedId));
    button.setAttribute("aria-label", `${bed.fullLabel}, ${bed.summary ? "com dados" : "sem dados"}`);
    button.addEventListener("click", () => selectBed(bed.id));

    if (bed.unit === "Sala Vermelha") {
      els.redBeds.appendChild(button);
    } else {
      els.traumaBeds.appendChild(button);
    }
  });

  const redDone = beds.filter((bed) => bed.unit === "Sala Vermelha" && bed.summary).length;
  const traumaDone = beds.filter((bed) => bed.unit === "Retaguarda do Trauma" && bed.summary).length;
  els.redCount.textContent = `${redDone}/11`;
  els.traumaCount.textContent = `${traumaDone}/6`;
}

function renderSelectedBed() {
  const bed = getSelectedBed();
  els.selectedUnit.textContent = bed.unit;
  els.selectedBed.textContent = bed.fullLabel;
  els.clinicalInput.value = bed.input;
  els.bedStatus.textContent = bed.summary ? "Com dados" : "Sem dados";
  els.bedStatus.className = `status-pill ${bed.summary ? "done" : "pending"}`;
}

function buildHandoffText() {
  const generatedBeds = beds.filter((bed) => bed.summary);
  const shiftLabel = formatDisplayDate(els.shiftTime.value);
  const header = `PASSAGEM DE PLANTAO - ${shiftLabel || "sem data definida"}`;

  if (!generatedBeds.length) {
    return `${header}\n\nNenhuma passagem gerada.`;
  }

  return [
    header,
    "",
    ...generatedBeds.flatMap((bed) => [
      `${bed.fullLabel} - ${bed.unit}`,
      `Gerado em: ${formatDisplayDate(bed.updatedAt)}`,
      bed.summary,
      "",
    ]),
  ].join("\n").trim();
}

function renderOutput() {
  els.handoffOutput.value = buildHandoffText();
}

function renderAll() {
  renderBeds();
  renderSelectedBed();
  renderOutput();
}

function selectBed(id) {
  const current = getSelectedBed();
  current.input = els.clinicalInput.value;
  selectedBedId = id;
  clearMessage();
  renderAll();
}

function setMessage(text, type = "") {
  els.message.textContent = text;
  els.message.className = `message ${type}`.trim();
}

function clearMessage() {
  setMessage("");
}

function obviousIdentifierRedaction(text) {
  return text
    .replace(/\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g, "[CPF removido]")
    .replace(/\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/g, "[CNPJ removido]")
    .replace(/\b\d{15}\b/g, "[CNS removido]")
    .replace(/\b\d{7,12}\b/g, "[numero removido]")
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[email removido]")
    .replace(/\+?\d{2,3}\s?\(?\d{2}\)?\s?\d{4,5}-?\d{4}/g, "[telefone removido]");
}

function buildPrompt(bed, clinicalText) {
  return `Voce e um assistente de organizacao de passagem de plantao medico. Nao armazene, memorize, reproduza ou solicite dados sensiveis, nomes, documentos, enderecos, telefones, numeros de prontuario, nomes de medicos ou nomes de equipe.

Tarefa: transformar a evolucao medica inserida em uma passagem objetiva entre plantonistas, em portugues formal, com no maximo 50 palavras.

Regras obrigatorias:
- Use o leito informado: ${bed.fullLabel}.
- Se nao houver peso descrito, assuma 75 kg apenas como referencia interna; nao escreva o peso presumido se ele nao for clinicamente necessario.
- Se houver peso descrito, use o peso informado.
- Assuma sexo e dados biometricos somente quando estiverem informados.
- Se houver criterios de alta de UTI ou Sala Vermelha, escreva que preenche criterios de alta medica para enfermaria.
- Nao use emoji, giria, maneirismo ou abreviacoes nao classicas.
- Nao sugira condutas novas.
- Informe intercorrencias, pendencias, pontos de atencao e condutas ja definidas.
- Reforce a necessidade de definicao de condutas quando elas estiverem ausentes ou indefinidas.
- Texto final deve ser simples, copiavel e colavel em editor TXT.

Modelo de conteudo a contemplar quando houver dados:
Identificacao nao nominativa; dias internado; motivo da internacao; modo ventilatorio; estabilidade hemodinamica; pontos de atencao; o que precisa ser feito imediatamente; pendencias; rotina definida; dieta zero, cirurgia, sangue ou urgencias; definicao de investimento medico, reanimacao e limites de cuidado.

Evolucao medica:
${clinicalText}`;
}

async function callNvidiaProxy(prompt) {
  const payload = {
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
    top_p: 0.95,
    max_tokens: 600,
    extra_body: { chat_template_kwargs: { thinking: false } },
    stream: false,
  };

  let response = await postCompletion(PROXY_URL, payload);

  if ([404, 405].includes(response.status)) {
    response = await postCompletion(`${PROXY_URL.replace(/\/$/, "")}/v1/chat/completions`, payload);
  }

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Falha no proxy: ${response.status}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content || data?.content || data?.text;

  if (!content) {
    throw new Error("Resposta sem texto.");
  }

  return content.trim();
}

function postCompletion(url, payload) {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

async function generateSummary() {
  const bed = getSelectedBed();
  const clinicalText = obviousIdentifierRedaction(els.clinicalInput.value.trim());

  if (!clinicalText) {
    setMessage("Cole a evolucao medica antes de gerar a passagem.", "error");
    return;
  }

  bed.input = els.clinicalInput.value;
  els.generateSummary.disabled = true;
  setMessage("Gerando passagem...");

  try {
    const prompt = buildPrompt(bed, clinicalText);
    bed.summary = await callNvidiaProxy(prompt);
    bed.updatedAt = new Date().toISOString();
    setMessage("Passagem gerada.", "success");
    renderAll();
  } catch (error) {
    setMessage(`Nao foi possivel gerar a passagem. ${error.message}`, "error");
  } finally {
    els.generateSummary.disabled = false;
  }
}

function clearSelectedBed() {
  const bed = getSelectedBed();
  bed.input = "";
  bed.summary = "";
  bed.updatedAt = "";
  clearMessage();
  renderAll();
}

async function copyAll() {
  try {
    await navigator.clipboard.writeText(els.handoffOutput.value);
    setMessage("Texto copiado.", "success");
  } catch (error) {
    els.handoffOutput.select();
    setMessage("Selecione e copie o texto.", "error");
  }
}

function downloadTxt() {
  const text = buildHandoffText();
  const shiftLabel = (els.shiftTime.value || formatDateTime()).replace("T", "_").replace(":", "-");
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `passagem-plantao-${shiftLabel}.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
}

els.shiftTime.value = formatDateTime();
els.clinicalInput.addEventListener("input", () => {
  getSelectedBed().input = els.clinicalInput.value;
});
els.generateSummary.addEventListener("click", generateSummary);
els.clearBed.addEventListener("click", clearSelectedBed);
els.copyAll.addEventListener("click", copyAll);
els.downloadTxt.addEventListener("click", downloadTxt);
els.shiftTime.addEventListener("change", renderOutput);

renderAll();
