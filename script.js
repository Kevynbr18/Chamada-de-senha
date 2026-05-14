// contador de senha
let contadorNormal = 0;
let contadorPreferencial = 0;

// elementos
const data = document.getElementById("data");
const hora = document.getElementById("hora");
const senhas = document.getElementById("senha");

const btnGerar = document.getElementById("btnGerar");
const btnPreferencial = document.getElementById("btnPreferencial");
const btnChamar = document.getElementById("btnChamar");
const guiche = document.getElementById("guiche");
const historico = document.getElementById("historico");



// som de chamada
const beep = new Audio("ElevenLabs_Subtle_bell_calendar_reminder_alert,_gentle_two-note.mp3");
beep.preload = "auto";

// ======================
// DATA E HORA
// ======================
function atualizarDataHora() {
    const agora = new Date();

    const dia = String(agora.getDate()).padStart(2, "0");
    const mes = String(agora.getMonth() + 1).padStart(2, "0");
    const ano = agora.getFullYear();

    const horas = String(agora.getHours()).padStart(2, "0");
    const minutos = String(agora.getMinutes()).padStart(2, "0");
    const segundos = String(agora.getSeconds()).padStart(2, "0");

    data.textContent = `${dia}/${mes}/${ano}`;
    hora.textContent = `${horas}:${minutos}:${segundos}`;
}

setInterval(atualizarDataHora, 1000);
atualizarDataHora();

// ======================
// SENHAS
// ======================
btnGerar.addEventListener("click", gerarNormal);
btnPreferencial.addEventListener("click", gerarPreferencial);

// gerar senha normal
function gerarNormal() {
    contadorNormal++;

    const senha = "A" + String(contadorNormal).padStart(3, "0");

    senhas.textContent = senha;
    senhas.className = ""; // limpa cor
}

// gerar senha preferencial
function gerarPreferencial() {
    contadorPreferencial++;

    const senha = "P" + String(contadorPreferencial).padStart(3, "0");

    senhas.textContent = senha;
    senhas.className = "preferencial"; // aplica cor vermelha
}

// ======================
// VOZ
// ======================
function falarSenha(texto) {
    speechSynthesis.cancel();

    const voz = new SpeechSynthesisUtterance(texto);
    voz.lang = "pt-BR";

    speechSynthesis.speak(voz);
}

// ======================
// SOM
// ======================
function tocarSom(callback) {
    beep.currentTime = 0;

    const playPromise = beep.play();

    if (playPromise) {
        playPromise
            .then(() => {
                beep.onended = callback;

                setTimeout(callback, 1200);
            })
            .catch(callback);
    } else {
        callback();
    }
}

// ======================
// HISTÓRICO
// ======================
function adicionarHistorico(texto) {
    const li = document.createElement("li");
    li.textContent = texto;

    historico.prepend(li);

    if (historico.children.length > 10) {
        historico.removeChild(historico.lastChild);
    }
}

// ======================
// CHAMAR SENHA
// ======================
btnChamar.addEventListener("click", () => {
    const senhaAtual = senhas.textContent;
    const numeroGuiche = guiche.value;

    if (senhaAtual === "---") {
        alert("Gere uma senha primeiro!");
        return;
    }

    const texto = `Senha ${senhaAtual}, dirigir-se ao guichê ${numeroGuiche}`;

    adicionarHistorico(`${senhaAtual} → Guichê ${numeroGuiche}`);

    tocarSom(() => {
        falarSenha(texto);
    });
});

const btnReset = document.getElementById("btnReset");

btnReset.addEventListener("click", zerarFila);

function zerarFila() {
    const confirmar = confirm("Tem certeza que deseja zerar a fila?");

    if (!confirmar) return;

    // zera contadores
    contadorNormal = 0;
    contadorPreferencial = 0;

    // limpa senha exibida
    senhas.textContent = "---";
    senhas.className = "";

    // limpa histórico
    historico.innerHTML = "";

    // cancela voz
    speechSynthesis.cancel();

    // opcional: reseta som
    beep.pause();
    beep.currentTime = 0;

    alert("Fila zerada com sucesso!");
}
