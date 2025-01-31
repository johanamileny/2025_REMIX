// filepath: /c:/Users/Usuario/Documents/Remix2025/remix_2025-nodo/remix.config.js
module.exports = {
    // Otras configuraciones de Remix
    routes: async (defineRoutes) => {
      return defineRoutes((route) => {
        route("/contacts/:contactId/delete", "routes/deletecontact.tsx");
        // Otras rutas
      });
    },
  };