// === CONFIG ===
    // const API_BASE = "http://localhost:3000/api";
    const URL_API = "http://localhost:3000/api";
// === VARIABLES ESTADO ===
    let estado = {
      usuario: null,    // 👤 {id: 1, nombre: "Juan", email: "juan@email.com"}
      token: null,      // 🔑 "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      eventos: [],
      carrito: {        // 🛒 {items: [{id:1, nombre:"evento", precio:10, cantidad:2}], total: 20}
        items: [],
        total: 0
      }
    };
// === STATE ===
        let currentUser = null;
        let eventos = [];


// =============================
// 🔐 SESIÓN: LOGIN / REGISTRO
// =============================

/**
 * guardarSesion() - Guarda datos del usuario logueado
 * 
 * @param {string} token - JWT token del backend
 * @param {Object} usuario - Datos del usuario {id, nombre, email}
 * 
 * ¿Qué hace?
 * 1. Guarda en memoria (variable estado)
 * 2. Guarda en localStorage (persistencia entre recargas)
 * 3. Registra en consola para debugging
 * 
 * ¿Por qué localStorage?
 * - Para que el usuario siga logueado al recargar la página
 * - Se mantiene hasta que cierre el navegador o borre datos
 */
function guardarSesion(token, usuario) {
  // Guardar en memoria (desaparece al recargar)
  estado.token = token;
  estado.usuario = usuario;

  // Guardar en localStorage (persiste al recargar)
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(usuario)); // JSON.stringify = objeto → texto

  console.log("💾 Sesión guardada para:", usuario.nombre);
}
/**
 * cerrarSesion() - Limpia toda la información del usuario
 * 
 * ¿Cuándo se ejecuta?
 * - Cuando el usuario hace click en "Cerrar sesión"
 * - Cuando hay un error de sesión corrupta
 * 
 * ¿Qué limpia?
 * - Estado en memoria
 * - localStorage
 * - Carrito de compras
 */
function cerrarSesion() {
  // Limpiar memoria
  estado.token = null;
  estado.usuario = null;
  estado.carrito = { items: [], total: 0 };

  // Limpiar localStorage
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("carrito");

  console.log("👋 Sesión cerrada");
  mostrarInterfaz(); // Actualizar la interfaz
}
/**
 * cargarSesionGuardada() - Restaura sesión al recargar página
 * 
 * ¿Cuándo se ejecuta?
 * - Al cargar la página
 * 
 * ¿Qué hace?
 * 1. Busca token y usuario en localStorage
 * 2. Si existen, los restaura en memoria
 * 3. Si hay error (datos corruptos), cierra sesión
 */
function cargarSesionGuardada() {
  const tokenGuardado = localStorage.getItem("token");
  const usuarioGuardado = localStorage.getItem("user");

  // Solo restaurar si AMBOS existen
  if (tokenGuardado && usuarioGuardado) {
    try {
      estado.token = tokenGuardado;
      estado.usuario = JSON.parse(usuarioGuardado); // JSON.parse = texto → objeto
      console.log("👤 Sesión restaurada:", estado.usuario.nombre);
    } catch (err) {
      // Si JSON.parse falla (datos corruptos)
      console.error("❌ Sesión corrupta, limpiando...", err);
      cerrarSesion();
    }
  }
}
/**
 * iniciarSesion() - Autentica usuario con email/password
 * 
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * 
 * ¿Cómo funciona?
 * 1. Envía POST a /api/auth/login con credenciales
 * 2. Si es correcto, guarda sesión y actualiza interfaz
 * 3. Si es incorrecto, muestra error al usuario
 */
async function iniciarSesion(email, password) {
  try {
    const respuesta = await fetch(`${URL_API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }) // Convertir objeto a JSON
    });

    const datos = await respuesta.json();
    console.log("📥 Respuesta login:", respuesta.status, datos);

    if (respuesta.ok) {
      // ✅ Login exitoso
      guardarSesion(datos.token, datos.usuario);
      mostrarInterfaz();
      alert(`Bienvenido, ${datos.usuario.nombre}`);
    } else {
      // ❌ Credenciales incorrectas
      alert(datos.message || "Error al iniciar sesión");
    }
  } catch (error) {
    // ❌ Error de conexión (servidor caído, sin internet, etc.)
    console.error("❌ Error login:", error);
    alert("No se pudo conectar con el servidor");
  }
}
/**
 * registrarUsuario() - Crea cuenta nueva y loguea automáticamente
 * 
 * @param {string} nombre - Nombre completo
 * @param {string} email - Email único
 * @param {string} password - Contraseña
 * 
 * ¿Qué hace?
 * 1. Envía datos a /api/auth/register
 * 2. El backend crea la cuenta Y devuelve token
 * 3. Automáticamente loguea al usuario
 */
async function registrarUsuario(nombre, email, password) {
  try {
    const respuesta = await fetch(`${URL_API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password })
    });

    const datos = await respuesta.json();
    console.log("📥 Respuesta registro:", respuesta.status, datos);

    if (respuesta.ok) {
      // ✅ Registro exitoso + auto-login
      guardarSesion(datos.token, datos.usuario);
      mostrarInterfaz();
      alert(`Cuenta creada. Bienvenido, ${datos.usuario.nombre}`);
    } else {
      // ❌ Error: email ya existe, datos inválidos, etc.
      alert(datos.message || "Error al registrarse");
    }
  } catch (error) {
    console.error("❌ Error registro:", error);
    alert("No se pudo conectar con el servidor");
  }
}

// =============================
// 🎛 INTERFAZ DE USUARIO. 
// (Mostrar/ocultar secciones según si el usuario esta logado o no: muestra los productos para comprar)
//Aqui ya hemos introducido cambios para mostrar una interfaz diferente cuando el usuario se loga
// =============================

/**
 * mostrarInterfaz() - El "director" de nuestro index
 * 
 * ¿Cuándo se ejecuta?
 * - Al cargar la página
 * - Después de login/logout
 * - Después de registro
 * 
 * ¿Qué hace?
 * - Decide qué mostrar según si hay usuario logueado
 * - Usuario NO logueado: formularios login/registro y productos como catalogo
 * - Usuario SÍ logueado: tienda privada + navegación
 */
function mostrarInterfaz() {
  // Buscar elementos del DOM
  const authSection   = document.getElementById("authSection");   // Formularios login/registro
  const authNav       = document.getElementById("authNav");       // Barra superior
  const tiendaSection = document.getElementById("tiendaSection"); // Tienda para usuarios logados 
  const productosMostrar   = document.getElementById("productosMostrar"); // Muestra productos para usuarios NO logados 
  
  const logueado = !!estado.usuario; // nace como null que es false pero no un boolean aqui lo que hace es convertirlo en un boolean

  // 📝 FORMULARIOS LOGIN/REGISTRO
  // Mostrar solo si NO está logueado
  if (authSection) {
    authSection.classList.toggle("hidden", logueado); // toggle = añadir/quitar clase
  }
  if (productosMostrar) {
        productosMostrar.classList.toggle("hidden", logueado);}

  // 🏪 TIENDA para usuarios logados sólo se mostrara si esta logged
  //hidden está definido en style y es una propiedad del contenedor
  if (tiendaSection) {
    tiendaSection.classList.toggle("hidden", !logueado); // !logged = no logado 
    //toggle es un método de classList que añade o quita una clase CSS a un elemento del DOM.
    //con dos parametros significa ejecuta ese estilo segun la condicion


    if (logueado) {
      // Si está logueado, cargar datos de la tienda
      cargarCarrito();        // Restaurar carrito desde localStorage
      cargarProductosTienda(); // Mostrar productos con botón "Comprar"
      
    }
  }

  // 🧭 NAVEGACIÓN SUPERIOR
  if (authNav) {
    if (logueado) {
      // Usuario logueado: mostrar nombre + botón salir
      authNav.innerHTML = `
        <span class="user-name">👤 ${estado.usuario.nombre}</span>
        <button id="logoutButton" class="btn btn-outline">Cerrar sesión</button>
      `;
      // Conectar el botón con la función
      document
        .getElementById("logoutButton")
        .addEventListener("click", cerrarSesion);
    } else {
      // Usuario NO logueado: mensaje informativo
      authNav.innerHTML = `<span>Inicia sesión para comprar</span>`;
       

    }
  }
}

/**
 * configurarEventosLogin() - Conecta formularios HTML con funciones JS
 * 
 * ¿Por qué esta función?
 * - Separar la lógica de los eventos del resto del código
 * - Hacer el código más organizado y legible
 * - Evitar repetir código de eventos
 * 
 * ¿Qué conecta?
 * - Formulario login → iniciarSesion()
 * - Formulario registro → registrarUsuario()
 * - Links "Regístrate" / "Inicia sesión" → cambiar formularios
 */
function configurarEventosLogin() {
  // Buscar elementos del DOM
  const loginForm    = document.getElementById("loginFormElement");
  const registerForm = document.getElementById("registerFormElement");
  const showRegister = document.getElementById("showRegister");
  const showLogin    = document.getElementById("showLogin");

  // 📝 FORMULARIO DE LOGIN
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault(); // Evitar que recargue la página
      
      // Obtener valores de los inputs
      const email    = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;
      
      await iniciarSesion(email, password);
      loginForm.reset(); // Limpiar formulario
    });
  }

  // 📝 FORMULARIO DE REGISTRO
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const nombre   = document.getElementById("registerNombre").value;
      const email    = document.getElementById("registerEmail").value;
      const password = document.getElementById("registerPassword").value;
      
      await registrarUsuario(nombre, email, password);
      registerForm.reset();
    });
  }

  // 🔗 LINK "REGÍSTRATE AQUÍ"
  if (showRegister) {
    showRegister.addEventListener("click", (e) => {
      e.preventDefault(); // Evitar que navegue
      
      // Ocultar login, mostrar registro
      document.getElementById("loginForm").classList.add("hidden");
      document.getElementById("registerForm").classList.remove("hidden");
    });
  }

  // 🔗 LINK "INICIA SESIÓN AQUÍ"
  if (showLogin) {
    showLogin.addEventListener("click", (e) => {
      e.preventDefault();
      
      // Ocultar registro, mostrar login
      document.getElementById("registerForm").classList.add("hidden");
      document.getElementById("loginForm").classList.remove("hidden");
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 App lista");

  // 📋 SECUENCIA DE INICIALIZACIÓN
  
  cargareventos();        // 1. Cargar productos públicos (siempre visible)
  cargarSesionGuardada();   // 2. Restaurar sesión si existía
  configurarEventosLogin(); // 3. Conectar formularios de login/registro
  mostrarInterfaz();        // 4. Mostrar interfaz según estado de login
});





// === HELPERS ===
        // function getToken() { return localStorage.getItem("eventflow_token"); }
        // function setToken(token) { localStorage.setItem("eventflow_token", token); }
        // function clearToken() { localStorage.removeItem("eventflow_token"); }

        // async function apiFetch(path, options = {}) {
        //     const token = getToken();
        //     const headers = { "Content-Type": "application/json" };
        //     if (token) headers["Authorization"] = `Bearer ${token}`;

        //     const res = await fetch(API_BASE + path, { ...options, headers });

        //     if (!res.ok) {
        //         const data = await res.json().catch(() => ({}));
        //         throw new Error(data.error || "Error del servidor");
        //     }
        //     if (res.status === 204) return null;
        //     return res.json();
        // }

        function showAlert(message, isError = false) {
            const alert = document.getElementById("alert");
            alert.textContent = message;
            alert.style.background = isError ? "#e53935" : "#3949ab";
            alert.classList.add("show");
            setTimeout(() => alert.classList.remove("show"), 4000);
        }

        function updateAuthUI() {
            document.getElementById("auth-section").style.display = currentUser ? "none" : "flex";
            document.getElementById("app-section").style.display = currentUser ? "block" : "none";
            document.getElementById("logout-btn").style.display = currentUser ? "inline-block" : "none";
            document.getElementById("user-role").textContent =
                currentUser ? `${currentUser.nombre} (${currentUser.rol.toUpperCase()})` : "";
        }

        // === USUARIO ACTUAL ===
        // async function cargarUsuarioActual() {
        //     if (!getToken()) {
        //         currentUser = null;
        //         updateAuthUI();
        //         return;
        //     }

        //     try {
        //         currentUser = await apiFetch("/api/usuarios/me");
        //         updateAuthUI();
        //         await cargarEventos();
        //     } catch (err) {
        //         clearToken();
        //         currentUser = null;
        //         updateAuthUI();
        //         showAlert("Sesión expirada", true);
        //     }
        // }

//         // === EVENTOS ===
//  async function cargareventos() {
//   try {
//     const respuesta = await fetch(`${URL_API}/eventos`);
//     const datos = await respuesta.json();

//     // Verificar que la petición fue exitosa Y que hay datos
//     if (respuesta.ok && datos.data) {
//       mostrareventos(datos.data); // datos.data = array de eventos
//     } else {
//       console.error("Error al cargar eventos");
//       showAlert(err.message, true);
//     }
//   } catch (error) {
//     console.error("Error de conexión:", error);
//     showAlert(err.message, true);
//   }
// }
        // async function cargarEventos() {
        //     try {
        //         eventos = await apiFetch("/api/eventos");
        //         renderEventos();
        //     } catch (err) {
        //         showAlert(err.message, true);
        //         document.getElementById("eventos-list").textContent = "Error al cargar eventos";
        //     }
//         // }
// function mostrareventos(lista) {
//   const contenedor = document.getElementById("eventos-list");
//   const esMio = currentUser && ev.creadorId === currentUser.id;
//   const soyAdmin = currentUser?.rol === "admin";
//   const estoyInscrito = currentUser && ev.asistentesIds?.includes(currentUser.id);
//   if (!contenedor) return; // Si no existe el elemento, salir
//     if (!eventos.length) {
//         contenedor.innerHTML = '<div style="padding:2rem;text-align:center;color:#666;">No hay eventos disponibles 😴</div>';
//         return;
//         }
// const actions = card.querySelector(".event-actions");

//   // Inscribirse/desinscribirse (solo si NO es mío)
//   if (currentUser && !esMio) {
//       const btn = document.createElement("button");
//       btn.className = `btn btn-small ${estoyInscrito ? "btn-secondary" : "btn-primary"}`;
//       btn.textContent = estoyInscrito ? "❌ Desinscribirse" : "✅ Inscribirse";
//       btn.onclick = () => toggleInscripcion(ev.id, estoyInscrito);
//       actions.appendChild(btn);
//       }
//   // Editar/Eliminar (mío O admin)
//   if (currentUser && (esMio || soyAdmin)) {
//       const editBtn = document.createElement("button");
//       editBtn.className = "btn btn-small btn-secondary";
//       editBtn.textContent = "✏️ Editar";
//       editBtn.onclick = () => rellenarFormulario(ev);
//       actions.appendChild(editBtn);
//       const delBtn = document.createElement("button");
//       delBtn.className = "btn btn-small btn-danger";
//       delBtn.textContent = "🗑️ Eliminar";
//       delBtn.onclick = () => eliminarEvento(ev.id);
//       actions.appendChild(delBtn);
//       }
//       contenedor.appendChild(card);

//       contenedor.innerHTML = "";
//   // .map() = "Por cada evento, crear este HTML"
//   contenedor.innerHTML = lista.map(evento => `
//     <div class="event-card">
//         <div class="event-header">
//             <div class="event-title">${evento.titulo}</div>
//             <div>
//               ${soyAdmin ? '<span class="badge badge-admin">ADMIN</span>' : ""}
//               ${esMio ? '<span class="badge badge-mine">MÍO</span>' : ""}
//               ${estoyInscrito ? '<span class="badge badge-inscrito">INSCRITO</span>' : ""}
//             </div>
//         </div>
//       <img src="./images/foto.png" class="product-image" alt="${evento.titulo}">
//       <h3>${evento.titulo}</h3>
//       <p class="event-meta">${evento.descripcion || ""}</p>
//       <p class="event-meta"><strong>${evento.fecha}€</strong></p>
//       <p class="event-meta">Lugar: ${evento.lugar}</p>
//       <div class="event-actions"></div>
//     </div>
//   `).join(""); // .join("") = unir todo sin separadores  
// }

// function renderEventos() {
//             const container = document.getElementById("eventos-list");
//             if (!eventos.length) {
//                 container.innerHTML = '<div style="padding:2rem;text-align:center;color:#666;">No hay eventos disponibles 😴</div>';
//                 return;
//             }

//             container.innerHTML = "";
//             eventos.forEach(ev => {
//                 const esMio = currentUser && ev.creadorId === currentUser.id;
//                 const soyAdmin = currentUser?.rol === "admin";
//                 const estoyInscrito = currentUser && ev.asistentesIds?.includes(currentUser.id);

//                 const card = document.createElement("div");
//                 card.className = "event-card";

//                 card.innerHTML = `
//           <div class="event-header">
//             <div class="event-title">${ev.titulo}</div>
//             <div>
//               ${soyAdmin ? '<span class="badge badge-admin">ADMIN</span>' : ""}
//               ${esMio ? '<span class="badge badge-mine">MÍO</span>' : ""}
//               ${estoyInscrito ? '<span class="badge badge-inscrito">INSCRITO</span>' : ""}
//             </div>
//           </div>
//           <div class="event-meta"><strong>📅 ${ev.fecha}</strong> - ${ev.lugar}</div>
//           <div class="event-meta">${ev.descripcion}</div>
//           <div class="event-actions"></div>
//         `;

//                 const actions = card.querySelector(".event-actions");

//                 // Inscribirse/desinscribirse (solo si NO es mío)
//                 if (currentUser && !esMio) {
//                     const btn = document.createElement("button");
//                     btn.className = `btn btn-small ${estoyInscrito ? "btn-secondary" : "btn-primary"}`;
//                     btn.textContent = estoyInscrito ? "❌ Desinscribirse" : "✅ Inscribirse";
//                     btn.onclick = () => toggleInscripcion(ev.id, estoyInscrito);
//                     actions.appendChild(btn);
//                 }

//                 // Editar/Eliminar (mío O admin)
//                 if (currentUser && (esMio || soyAdmin)) {
//                     const editBtn = document.createElement("button");
//                     editBtn.className = "btn btn-small btn-secondary";
//                     editBtn.textContent = "✏️ Editar";
//                     editBtn.onclick = () => rellenarFormulario(ev);
//                     actions.appendChild(editBtn);

//                     const delBtn = document.createElement("button");
//                     delBtn.className = "btn btn-small btn-danger";
//                     delBtn.textContent = "🗑️ Eliminar";
//                     delBtn.onclick = () => eliminarEvento(ev.id);
//                     actions.appendChild(delBtn);
//                 }

//                 container.appendChild(card);
//             });
//         }

async function toggleInscripcion(eventoId, yaInscrito) {
    try {
    await apiFetch(`/api/asistentes/eventos/${eventoId}/inscribirse`, {
      method: yaInscrito ? "DELETE" : "POST"
    });
    showAlert(yaInscrito ? "Desinscrito correctamente" : "¡Inscrito! 🎉");
    await cargarEventos();
    } catch (err) {
    showAlert(err.message, true);
    }
}

        function rellenarFormulario(ev) {
            document.getElementById("evento-id").value = ev.id;
            document.getElementById("evento-titulo").value = ev.titulo;
            document.getElementById("evento-descripcion").value = ev.descripcion;
            document.getElementById("evento-fecha").value = ev.fecha.split("T")[0];
            document.getElementById("evento-lugar").value = ev.lugar;
            document.getElementById("evento-cancelar").style.display = "inline-block";
        }

        async function eliminarEvento(id) {
            if (!confirm("¿Estás seguro de eliminar este evento?")) return;
            try {
                await apiFetch(`/eventos/${id}`, { method: "DELETE" });
                showAlert("Evento eliminado ✅");
                await cargarEventos();
            } catch (err) {
                showAlert(err.message, true);
            }
        }

        // === EVENT LISTENERS ===
        document.addEventListener("DOMContentLoaded", () => {
            // Login
            document.getElementById("login-form").onsubmit = async e => {
                e.preventDefault();
                try {
                    const data = await apiFetch("/api/auth/login", {
                        method: "POST",
                        body: JSON.stringify({
                            email: document.getElementById("login-email").value,
                            password: document.getElementById("login-password").value
                        })
                    });
                    setToken(data.token);
                    showAlert("¡Bienvenido! 🎉");
                    await cargarUsuarioActual();
                } catch (err) {
                    showAlert(err.message, true);
                }
            };

            // Register
            document.getElementById("register-form").onsubmit = async e => {
                e.preventDefault();
                try {
                    await apiFetch("/api/auth/register", {
                        method: "POST",
                        body: JSON.stringify({
                            nombre: document.getElementById("register-name").value,
                            email: document.getElementById("register-email").value,
                            password: document.getElementById("register-password").value
                        })
                    });
                    showAlert("¡Usuario creado! Ahora inicia sesión 👆");
                    document.getElementById("register-form").reset();
                } catch (err) {
                    showAlert(err.message, true);
                }
            };

            // Evento form
            document.getElementById("evento-form").onsubmit = async e => {
                e.preventDefault();
                const id = document.getElementById("evento-id").value;

                const data = {
                    titulo: document.getElementById("evento-titulo").value,
                    descripcion: document.getElementById("evento-descripcion").value,
                    fecha: document.getElementById("evento-fecha").value,
                    lugar: document.getElementById("evento-lugar").value,
                    categoria: document.getElementById("evento-categoria").value,
                    creador_id: currentUser.id  // 👈 AQUÍ se pone automáticamente según el usuario logueado
                };

                try {
                    if (id) {
                        await apiFetch(`/api/eventos/${id}`, {
                            method: "PUT",
                            body: JSON.stringify(data)
                        });
                        showAlert("Evento actualizado ✅");
                    } else {
                        await apiFetch("/api/eventos", {
                            method: "POST",
                            body: JSON.stringify(data)
                        });
                        showAlert("¡Nuevo evento creado! 🎉");
                    }

                    document.getElementById("evento-form").reset();
                    document.getElementById("evento-id").value = "";
                    document.getElementById("evento-cancelar").style.display = "none";
                    await cargarEventos();
                } catch (err) {
                    showAlert(err.message, true);
                }
            };


            document.getElementById("evento-cancelar").onclick = () => {
                document.getElementById("evento-form").reset();
                document.getElementById("evento-id").value = "";
                document.getElementById("evento-cancelar").style.display = "none";
            };

            document.getElementById("logout-btn").onclick = () => {
                clearToken();
                currentUser = null;
                updateAuthUI();
                showAlert("Sesión cerrada");
            };

            // Inicializar
            cargarUsuarioActual();
        });
