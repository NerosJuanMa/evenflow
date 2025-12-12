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
const URL_API = "http://localhost:3000/api";

async function loadEvents() {
  try {
    const res = await fetch(`${URL_API}/eventos`);
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
        <button data-id="${ev.id}" class="quienesvan-btn">Quienes van</button>
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
    const res = await fetch(`${URL_API}/eventos`, {
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
      const res = await fetch(`${URL_API}/usuarios/${id}/inscripciones`, {
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

// Delegate Quienes Van button
document.addEventListener('click', async (e) => {
    // 1. Asegúrate de que el botón coincida y que tenga el atributo dataset
    if (e.target && e.target.matches('.quienesvan-btn')) {
        
        const id = e.target.dataset.id;

        // Comprobación de seguridad: Si no hay ID, salir
        if (!id) {
             console.error("Error: el botón no tiene el atributo data-evento_id.");
             return; 
        }

        try {
           const res = await fetch(`${URL_API}/usuarios/${id}/inscripciones`, {
                method: "GET"
            });
            
            // 1. Verificar si la respuesta fue exitosa (código 200-299)
            if (res.ok) {
                // 2. Opcional: Procesar la respuesta del servidor (ej. un JSON con la lista)
                const datos = await res.json(); 
                
                // Muestra el resultado (en lugar de solo "alguno hay apuntado")
                console.log("Usuarios apuntados:", datos);
                alert(`¡Consulta exitosa! Van ${datos.length} personas (Ver consola para la lista)`);
                
            } else {
                // 3. Captura códigos de estado HTTP fallidos (400, 500, etc.)
                console.error("Fallo del servidor (Status:", res.status, res.statusText, ")");
                alert(`Error ${res.status}: Nadie apuntado o problema de conexión al servidor.`);
            }

        } catch (err) {
            // 4. Captura errores de red (servidor no responde, problema CORS, etc.)
            console.error("Error de red o CORS:", err);
            alert("Error de conexión (la API no está disponible o problemas de red).");
        }
    }
});

loadEvents();
