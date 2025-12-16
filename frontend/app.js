const API = "http://localhost:3000";

let token = localStorage.getItem("token");
let userRol = localStorage.getItem("rol");
let eventosInscritos = [];

const authSection = document.getElementById("authSection");
const eventosSection = document.getElementById("eventosSection");
const adminSection = document.getElementById("adminSection");
const eventosGrid = document.getElementById("eventosGrid");
const authNav = document.getElementById("authNav");

/* ===== TOAST ===== */
function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.remove("hidden");
  setTimeout(() => t.classList.add("hidden"), 3000);
}

/* ===== AUTH UI ===== */
function updateUI() {
  if (token) {
    authSection.classList.add("hidden");
    eventosSection.classList.remove("hidden");
    authNav.innerHTML = `<button onclick="logout()">Cerrar sesión</button>`;
    if (userRol === "admin") adminSection.classList.remove("hidden");
    cargarEventos();
  } else {
    authSection.classList.remove("hidden");
    eventosSection.classList.add("hidden");
    adminSection.classList.add("hidden");
    authNav.innerHTML = "";
  }
}

/* ===== LOGIN ===== */
document.getElementById("loginForm").addEventListener("submit", async e => {
  e.preventDefault();
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      email: loginEmail.value,
      password: loginPassword.value
    })
  });
  const data = await res.json();
  token = data.token;
  userRol = data.rol;
  localStorage.setItem("token", token);
  localStorage.setItem("rol", userRol);
  toast("Bienvenido 👋");
  updateUI();
});

/* ===== REGISTER ===== */
document.getElementById("registerForm").addEventListener("submit", async e => {
  e.preventDefault();
  await fetch(`${API}/register`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      nombre: registerNombre.value,
      email: registerEmail.value,
      password: registerPassword.value
    })
  });
  toast("Usuario registrado");
});

/* ===== LOGOUT ===== */
function logout() {
  localStorage.clear();
  token = null;
  updateUI();
}

/* ===== EVENTOS ===== */
async function cargarEventos() {
  const res = await fetch(`${API}/eventos`);
  const eventos = await res.json();

  const resIns = await fetch(`${API}/mis-eventos`, {
    headers: {Authorization:`Bearer ${token}`}
  });
  eventosInscritos = await resIns.json();

  eventosGrid.innerHTML = "";
  eventos.forEach(ev => {
    const card = document.createElement("div");
    card.className = "event-card";

    const inscrito = eventosInscritos.includes(ev.id);

    card.innerHTML = `
      <h3>${ev.titulo}</h3>
      <p>${ev.descripcion}</p>
      ${inscrito
        ? `<div class="badge-inscrito">✔ Ya inscrito</div>`
        : `<button class="btn-inscribirse" onclick="inscribirse(${ev.id})">Inscribirse</button>`
      }
    `;
    eventosGrid.appendChild(card);
  });
}

/* ===== INSCRIBIR ===== */
async function inscribirse(id) {
  await fetch(`${API}/asistentes`, {
    method: "POST",
    headers: {
      "Content-Type":"application/json",
      Authorization:`Bearer ${token}`
    },
    body: JSON.stringify({evento_id:id})
  });
  toast("Inscripción realizada 🎉");
  cargarEventos();
}

/* ===== ADMIN ===== */
document.getElementById("eventoForm").addEventListener("submit", async e => {
  e.preventDefault();
  await fetch(`${API}/eventos`, {
    method: "POST",
    headers: {
      "Content-Type":"application/json",
      Authorization:`Bearer ${token}`
    },
    body: JSON.stringify({
      titulo: titulo.value,
      descripcion: descripcion.value,
      fecha: fecha.value,
      lugar: lugar.value,
      categoria: categoria.value
    })
  });
  toast("Evento creado");
  e.target.reset();
  cargarEventos();
});

updateUI();
