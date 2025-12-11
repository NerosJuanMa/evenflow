// const API_URL = "http://localhost:3000/api/eventos";

// async function loadEvents() {
//   const res = await fetch(API_URL);
//   const events = await res.json();
//   const container = document.getElementById("events");
//   container.innerHTML = "";

//   events.forEach(ev => {
//     const card = document.createElement("div");
//     card.className = "event-card";
//     card.innerHTML = `
//       <h3>${ev.titulo}</h3>
//       <p>${ev.descripcion}</p>
//       <p><strong>Fecha:</strong> ${ev.fecha}</p>
//       <p><strong>Categoría:</strong> ${ev.categoria}</p>
//     `;
//     container.appendChild(card);
//   });
// }

// document.getElementById("eventForm").addEventListener("submit", async (e) => {
//   e.preventDefault();

//   const formData = new FormData(e.target);
//   const data = Object.fromEntries(formData.entries());

//   const res = await fetch(API_URL, {
//     method: "POST",
//     headers: {"Content-Type": "application/json"},
//     body: JSON.stringify(data)
//   });

//   if (res.ok) {
//     alert("Evento creado correctamente");
//     e.target.reset();
//     loadEvents();
//   }
// });

// loadEvents();


////////////////////////////////////
const API_URL = "http://localhost:3000/api/eventos";

async function loadEvents() {
  try {
    const res = await fetch(API_URL);
    const events = await res.json();
    const container = document.getElementById("events");
    container.innerHTML = "";

    events.forEach(ev => {
      const card = document.createElement("div");
      card.className = "event-card";
      card.innerHTML = `
        <h3>${ev.titulo}</h3>
        <p>${ev.descripcion || ''}</p>
        <p><strong>Fecha:</strong> ${new Date(ev.fecha).toLocaleString()}</p>
        <p><strong>Categoría:</strong> ${ev.categoria || ''}</p>
        <button data-id="${ev.id}" class="inscribir-btn">Inscribirse</button>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error("Error cargando eventos", err);
  }
}

document.getElementById("eventForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());
  // convert datetime-local to SQL format if needed
  if (data.fecha && data.fecha.includes('T')) {
    data.fecha = data.fecha.replace('T', ' ') + ':00';
  }
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    });
    if (res.ok) {
      alert("Evento creado correctamente");
      e.target.reset();
      loadEvents();
    } else {
      alert("Error creando evento");
    }
  } catch (err) {
    console.error(err);
    alert("Error creando evento");
  }
});

// Delegate inscribir button
document.addEventListener('click', async (e) => {
  if (e.target && e.target.matches('.inscribir-btn')) {
    const id = e.target.dataset.id;
    const nombre = prompt("Tu nombre:");
    const email = prompt("Tu email:");
    if (!nombre || !email) return alert("Nombre y email obligatorios");
    try {
      const res = await fetch(`${API_URL}/${id}/inscripciones`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ nombre, email })
      });
      if (res.ok) {
        alert("Inscripción registrada");
      } else {
        alert("Error en la inscripción");
      }
    } catch (err) {
      console.error(err);
      alert("Error en la inscripción");
    }
  }
});

loadEvents();
