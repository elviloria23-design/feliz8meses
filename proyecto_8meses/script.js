// =========================================================
// CONFIGURACIÓN DE TEXTOS Y CARTA FINAL
// =========================================================
const GAME_DATA = {
  secretCode: "190326",
  letterTitle: "Felices 8 Meses, mi amor",
  letterParagraphs: [
    "Desde aquel 19 de marzo de 2026 en que te pedí que fueras mi novia, ese dia me sentia muy feliz porque porfin ya habiamos dado el siguiente paso a algo que sin darme cuenta se acabo transformando en lo mas lindo que tengo.",
    "Estos 8 meses me han enseñado que cuando dos personas se eligen de verdad, no hay distancia, pantalla ni reloj que pueda detener lo que construimos. Gracias por cada llamada hasta tarde, por nuestras risas jugando y por hacerme tan feliz cada día.",
    "Este es apenas el Capítulo 08 de muchas aventuras que vienen por delante. Te amo muchísimo y estoy inmensamente feliz de haber llegado hasta aquí contigo.",
    "y aun mas feliz porque apesar de todas esas cosas que estan de por medio seguimos eligiendos el uno al otro, espero estar toda mi vida al lado tuyo porque eres la persona que mas amo, y espero que lleguemos a tener una hermosa familia."
  ],
  signature: "Con todo mi amor, de parte de: tu noviecito hermoso.",
  lapseCards: [
    { emoji: "🎮", text: "¿Jugamos una última partida en línea juntos aunque ya sea madrugada?" },
    { emoji: "🎧", text: "¿Nos quedamos en llamada platicando y escuchando música hasta quedarnos dormidos?" },
    { emoji: "❤️", text: "¿Seguirías eligiéndome una y otra vez a pesar de los kilómetros de distancia?" },
    { emoji: "🌙", text: "Son las 2:00 a.m. y mañana hay que madrugar... ¿Nos quedamos 15 minutos más hablando?" },
    { emoji: "🚌", text: "Si tuvieras un boleto de bus ahora mismo para cruzar la distancia, ¿vendrías a verme sin pensarlo?" },
    { emoji: "🏆", text: "Perdimos la racha en el juego... ¿Echamos la revancha solo para terminar la noche ganando juntos?" },
    { emoji: "📱", text: "Tienes la batería del celular al 5%... ¿Te quedas en llamada hasta que se apague?" },
    { emoji: "💌", text: "¿Guardas nuestras fotos, audios y mensajes favoritos para volver a verlos cuando me extrañas?" },
    { emoji: "🌧️", text: "Está lloviendo afuera como en esta habitación... ¿Te gustaría estar aquí abrazados viendo la tormenta?" },
    { emoji: "⏰", text: "El reloj sigue avanzando hacia nuestro aniversario... ¿Construimos muchos capítulos más juntos?" },
    { emoji: "🎶", text: "Suena esa canción que siempre me recuerda a ti... ¿La escuchamos juntos en llamada?" },
    { emoji: "🗺️", text: "Si pudieras borrar todos los kilómetros del mapa con un solo clic, ¿lo harías ahora mismo?" },
    { emoji: "✨", text: "Han pasado 8 meses desde aquel 19 de marzo... ¿Aceptas seguir siendo mi persona favorita?" }
  ]
};

// Cargar textos de la carta al iniciar
document.getElementById("letter-title").textContent = GAME_DATA.letterTitle;
document.getElementById("letter-body-content").innerHTML = GAME_DATA.letterParagraphs.map(p => `<p style="margin-bottom: 10px;">${p}</p>`).join("");
document.getElementById("letter-signature").textContent = GAME_DATA.signature;


// ==========================================
// GENERADOR DE 25 GOTAS DE LLUVIA EN VENTANA
// ==========================================
const windowGlass = document.getElementById("window-glass");
for (let i = 0; i < 25; i++) {
  const drop = document.createElement("div");
  drop.classList.add("rain-drop");
  drop.style.left = Math.random() * 100 + "%";
  drop.style.animationDuration = (0.5 + Math.random() * 0.5) + "s";
  drop.style.animationDelay = (Math.random() * 2) + "s";
  windowGlass.appendChild(drop);
}


// ==========================================
// AUDIO AMBIENTAL: LLUVIA REALISTA, TRUENOS Y PIANO
// ==========================================
let audioCtx = null;
let isMuted = false;

function triggerThunderAndLightning() {
  if (isMuted || !audioCtx) return;

  // 1. Destello visual en la ventana y haz de luz entrando a la habitación
  const flash = document.getElementById("lightning-flash");
  const beam = document.getElementById("window-light-beam");

  flash.classList.remove("strike");
  if (beam) beam.classList.remove("strike");
  
  void flash.offsetWidth; // Reinicia la animación CSS
  
  flash.classList.add("strike");
  if (beam) beam.classList.add("strike");

  // 2. Sonido del trueno con impacto inicial y retumbo audible en móviles/PC
  setTimeout(() => {
    if (isMuted || !audioCtx) return;
    const duration = 3.8;
    const bufferSize = audioCtx.sampleRate * duration;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Mezclamos un poco más de ruido directo para darle el crujido del rayo
      data[i] = (lastOut + (0.08 * white)) / 1.08;
      lastOut = data[i];
      
      // Envolvente con un golpe fuerte al inicio y eco prolongado
      const env = Math.exp(-i / (audioCtx.sampleRate * 1.3));
      data[i] *= env * 4.5;
    }

    const thunderSource = audioCtx.createBufferSource();
    thunderSource.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 480; // Subido de 180 a 480Hz para que suene en bocinas de móvil/laptop

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.47, audioCtx.currentTime); // Impacto fuerte
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    thunderSource.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    thunderSource.start();
  }, 250);
}

function startAmbientAudio() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  
  // 1. Lluvia realista (Ruido Marrón cálido)
  const bufferSize = 3 * audioCtx.sampleRate;
  const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  
  let lastOut = 0.0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    output[i] = (lastOut + (0.02 * white)) / 1.02;
    lastOut = output[i];
    output[i] *= 3.0;
  }

  const brownNoise = audioCtx.createBufferSource();
  brownNoise.buffer = noiseBuffer;
  brownNoise.loop = true;

  const filter = audioCtx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 450;

  const rainGain = audioCtx.createGain();
  rainGain.gain.value = 0.99;

  brownNoise.connect(filter);
  filter.connect(rainGain);
  rainGain.connect(audioCtx.destination);
  brownNoise.start(0);

  // 2. Relámpagos y truenos periódicos
  setTimeout(triggerThunderAndLightning, 2500);
  setInterval(() => {
    if (Math.random() > 0.3) {
      triggerThunderAndLightning();
    }
  }, 9000);

  // 3. Notas de piano (Claras y con presencia sobre la lluvia)
  function playPianoNote() {
    if (isMuted || !audioCtx) return;
    const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
    const freq = notes[Math.floor(Math.random() * notes.length)];
    
    const osc = audioCtx.createOscillator();
    const oscHarmonic = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    oscHarmonic.type = "sine";
    oscHarmonic.frequency.setValueAtTime(freq * 2, audioCtx.currentTime);
    
    gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, audioCtx.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 2.8);
    
    osc.connect(gain);
    oscHarmonic.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    oscHarmonic.start();
    osc.stop(audioCtx.currentTime + 2.9);
    oscHarmonic.stop(audioCtx.currentTime + 2.9);
  }

  // Toca la primera nota al entrar y luego cada 3.2 segundos
  playPianoNote();
  setInterval(playPianoNote, 3200);
}

document.getElementById("btn-audio").addEventListener("click", () => {
  isMuted = !isMuted;
  document.getElementById("btn-audio").textContent = isMuted ? "🔇 Sonido: OFF" : "🔊 Sonido: ON";
});

document.getElementById("btn-start").addEventListener("click", () => {
  document.getElementById("intro-screen").classList.remove("active");
  startAmbientAudio();
});


// ==========================================
// SISTEMA DE DIÁLOGOS FLOTANTES
// ==========================================
let dialogTimeout = null;

function showDialog(text) {
  const box = document.getElementById("dialog-box");
  const textEl = document.getElementById("dialog-text");
  
  textEl.textContent = text;
  box.classList.add("active");
  
  if (dialogTimeout) clearTimeout(dialogTimeout);
  
  dialogTimeout = setTimeout(() => {
    box.classList.remove("active");
  }, 4000);
}


// ==========================================
// SISTEMA DE CLAVES EN ORDEN DE DESCUBRIMIENTO
// ==========================================
let discoveredClues = [];

function addClue(number) {
  if (!discoveredClues.includes(number)) {
    discoveredClues.push(number);
  }
  
  const displaySlots = [
    discoveredClues[0] || "?",
    discoveredClues[1] || "?",
    discoveredClues[2] || "?"
  ];
  
  document.getElementById("clue-display").textContent = displaySlots.join(" - ");
}


// ==========================================
// PISTAS E INTERACCIONES DE LA HABITACIÓN
// ==========================================
document.getElementById("obj-clock").addEventListener("click", () => {
  showDialog("Te acercas al reloj... En la madera está tallado el dibujo de un reloj de arena junto a otro reloj de arena (⏳+⏳), y sus agujas marcan las 12 y las 7.");
  addClue("19");
});

document.getElementById("obj-window").addEventListener("click", () => {
  showDialog("Te acercas a la ventana y en el marco ves tallados dos números... 03.");
  addClue("03");
});

document.getElementById("obj-frame").addEventListener("click", () => {
  showDialog("Inspeccionas el retrato colgado en la pared... Te fijas en la imagen y notas que son una linda pareja que se quiere muchísimo.");
});


// ==========================================
// MINIJUEGO ESTILO LAPSE
// ==========================================
let happiness = 50;
let cardIndex = 0;
const lapseModal = document.getElementById("lapse-modal");

document.getElementById("obj-desk").addEventListener("click", () => {
  lapseModal.classList.add("active");
  updateLapseUI();
});

document.getElementById("close-lapse").addEventListener("click", () => {
  lapseModal.classList.remove("active");
});

function updateLapseUI() {
  const currentCard = GAME_DATA.lapseCards[cardIndex % GAME_DATA.lapseCards.length];
  document.getElementById("card-emoji").textContent = currentCard.emoji;
  document.getElementById("card-text").textContent = currentCard.text;
  document.getElementById("happiness-fill").style.width = happiness + "%";
  document.getElementById("happiness-val").textContent = happiness + "%";
}

document.getElementById("btn-yes").addEventListener("click", () => {
  happiness += 10;
  checkLapseProgress();
});

document.getElementById("btn-no").addEventListener("click", () => {
  happiness -= 30;
  checkLapseProgress();
});

function checkLapseProgress() {
  happiness = Math.max(0, Math.min(100, happiness));
  if (happiness >= 100) {
    happiness = 100;
    updateLapseUI();
    showDialog("¡Felicidad al 100%! Al reverso de la última carta descubres el número clave: 26.");
    addClue("26");
    lapseModal.classList.remove("active");
  } else {
    cardIndex++;
    updateLapseUI();
  }
}


// ==========================================
// CANDADO NUMÉRICO Y PUERTA
// ==========================================
const lockModal = document.getElementById("lock-modal");
const digitInputs = document.querySelectorAll(".digit-input");

document.getElementById("obj-door").addEventListener("click", () => {
  lockModal.classList.add("active");
  digitInputs[0].focus();
});

document.getElementById("close-lock").addEventListener("click", () => {
  lockModal.classList.remove("active");
});

digitInputs.forEach((input, idx) => {
  input.addEventListener("input", () => {
    if (input.value.length === 1 && idx < digitInputs.length - 1) {
      digitInputs[idx + 1].focus();
    }
  });
});

document.getElementById("btn-unlock").addEventListener("click", () => {
  const enteredCode = Array.from(digitInputs).map(i => i.value).join("");
  if (enteredCode === GAME_DATA.secretCode) {
    lockModal.classList.remove("active");
    document.getElementById("ending-screen").classList.add("active");
  } else {
    document.getElementById("lock-error").textContent = "Código incorrecto. Revisa las pistas";
  }
});

document.querySelectorAll(".btn-gift").forEach(btn => {
  btn.addEventListener("click", () => {
    document.getElementById("ending-content").style.display = "none";
    document.getElementById("letter-box").style.display = "block";
  });
});