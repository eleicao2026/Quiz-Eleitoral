const questions = [
  "Você é a favor de o Comando Vermelho e a milícia do RJ terem influência direta na presidência da República?",
  "Você concorda com a exploração do Brasil pelos EUA?",
  "Você é a favor de orgias com menores de idade refugiadas de guerra?",
  "Você é a favor de a Polícia Federal não investigar nenhum político corrupto?",
  "Você concorda com a perseguição à Igreja Católica?",
  "Você concorda com a perseguição ao direito de professar uma fé só porque alguém pensa diferente?",
  "Você concorda em vender estatais com desconto de 90% para estrangeiros?",
  "Você concorda com a livre exploração dos recursos naturais do Brasil por outros países?",
  "Você é a favor de crianças terem acesso a armas de fogo, podendo causar mortes acidentais?",
  "Você é a favor de Daniel Vorcaro, do Banco Master, ser inocentado?",
  "Você é a favor de políticos bancarem regalias eróticas a ministros do STF em troca de favores?",
  "Você concorda com a venda de empresas como a Petrobras, que gera empregos e lucro?",
  "Você concorda que um presidente seja eleito sem propostas?",
  "Você acha justo que o salário mínimo não tenha aumento acima da inflação?",
  "Você acha justo se aposentar só com 70 anos?",
  "Você acha justo o valor da aposentadoria não receber reajuste?",
  "Você acha justo o SUS não oferecer mais tratamentos e vacinação gratuitos?",
  "Você é a favor da diminuição de 90% do orçamento das universidades e institutos federais?",
  "Você é a favor da diminuição do orçamento da Farmácia Popular?"
];

const answers = Array(questions.length).fill(null);
let current = 0;

const quizEl = document.querySelector("#quiz");
const resultEl = document.querySelector("#result");
const questionText = document.querySelector("#question-text");
const answersEl = document.querySelector("#answers");
const progressLabel = document.querySelector("#progress-label");
const progressPercent = document.querySelector("#progress-percent");
const progressFill = document.querySelector("#progress-fill");
const backButton = document.querySelector("#back-button");
const nextButton = document.querySelector("#next-button");
const validation = document.querySelector("#validation");

function renderQuestion() {
  const total = questions.length;
  questionText.textContent = questions[current];
  progressLabel.textContent = `Pergunta ${current + 1} de ${total}`;
  const pct = Math.round(((current + 1) / total) * 100);
  progressPercent.textContent = `${pct}%`;
  progressFill.style.width = `${pct}%`;
  answersEl.replaceChildren();

  ["Sim", "Não", "Prefiro não responder"].forEach((label) => {
    const wrapper = document.createElement("label");
    wrapper.className = "answer-option";
    const input = document.createElement("input");
    input.type = "radio";
    input.name = `question-${current}`;
    input.value = label;
    input.checked = answers[current] === label;
    input.addEventListener("change", () => {
      answers[current] = label;
      validation.textContent = "";
    });
    const span = document.createElement("span");
    span.textContent = label;
    wrapper.append(input, span);
    answersEl.append(wrapper);
  });

  backButton.disabled = current === 0;
  nextButton.textContent = current === total - 1 ? "Ver resumo" : "Próxima";
  validation.textContent = "";
}


function showResult() {
  const yes = answers.filter(a => a === "Sim").length;
  const no = answers.filter(a => a === "Não").length;
  const skipped = answers.filter(
    a => a === "Prefiro não responder"
  ).length;

  document.querySelector("#yes-count").textContent = yes;
  document.querySelector("#no-count").textContent = no;

  let mensagem;

  if (yes > no) {
    mensagem = `Você respondeu "Sim" à maioria das perguntas: Isso quer dizer que alguẽm escolheu por vocë!`;
  } else if (no > yes) {
    mensagem = `Você respondeu "Não" à maioria das perguntas: Isso quer dizer que você está mais alinhado com as propostas e idéias do candidato Lula!`;
  } else {
    mensagem = `Você teve a mesma quantidade de respostas Sim e Não: ${yes} de cada.`;
  }

  if (skipped > 0) {
    mensagem += ` Você também optou por não responder ${skipped} pergunta(s).`;
  }

  document.querySelector("#result-intro").textContent = mensagem;

  const answered = Math.max(yes + no, 1);

  document.querySelector("#yes-bar").style.width =
    `${yes / answered * 100}%`;

  document.querySelector("#no-bar").style.width =
    `${no / answered * 100}%`;

  const list = document.querySelector("#answer-summary");
  list.replaceChildren();

  questions.forEach((question, i) => {
    const li = document.createElement("li");
    li.append(document.createTextNode(question));

    const response = document.createElement("strong");
    response.textContent = answers[i] || "Sem resposta";

    li.append(response);
    list.append(li);
  });

  quizEl.hidden = true;
  resultEl.hidden = false;

  window.scrollTo({ top: 0, behavior: "smooth" });
}


backButton.addEventListener("click", () => {
  if (current > 0) current--;
  renderQuestion();
});
nextButton.addEventListener("click", () => {
  if (!answers[current]) {
    validation.textContent = "Selecione uma resposta para continuar.";
    return;
  }
  if (current < questions.length - 1) {
    current++;
    renderQuestion();
  } else {
    showResult();
  }
});
document.querySelector("#review-button").addEventListener("click", () => {
  current = 0;
  resultEl.hidden = true;
  quizEl.hidden = false;
  renderQuestion();
  window.scrollTo({ top: 0, behavior: "smooth" });
});
document.querySelector("#restart-button").addEventListener("click", () => {
  answers.fill(null);
  current = 0;
  resultEl.hidden = true;
  quizEl.hidden = false;
  renderQuestion();
  window.scrollTo({ top: 0, behavior: "smooth" });
});
document.querySelector("#share-button").addEventListener("click", async () => {
  const status = document.querySelector("#share-status");
  const shareData = {
    title: document.title,
    text: "Responda a este questionário interativo.",
    url: window.location.href
  };
  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(window.location.href);
      status.textContent = "Link copiado. Agora você pode compartilhar!";
    } else {
      status.textContent = "Copie o endereço do site na barra do navegador para compartilhar.";
    }
  } catch (error) {
    if (error.name !== "AbortError") status.textContent = "Não foi possível abrir o compartilhamento neste navegador.";
  }
});

renderQuestion();
