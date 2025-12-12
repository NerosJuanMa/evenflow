// middlewares/permissions.middleware.js

export function canManageEvents(req, res, next) {
  const user = req.user; // viene del JWT

  if (!user) {
    return res.status(401).json({ error: "No autenticado" });
  }

  if (user.rol === "admin") {
    return next(); // Admin puede todo
  }

  return res.status(403).json({ error: "No tienes permiso para gestionar eventos" });
}

// Solo ve eventos propios o todos (según requieras)
export function canViewEvent(req, res, next) {
  const user = req.user;

  if (user.rol === "admin") return next();

  // Si quieres restringir algo, aquí se hace
  // Por ahora, todos pueden ver cualquier evento
  return next();
}
