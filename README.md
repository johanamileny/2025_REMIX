# Welcome to Remix!

- [Remix Docs](https://remix.run/docs)

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/server`
- `build/client`
git add


###  Links
Los links en Remix permiten incluir archivos estáticos, como hojas de estilo (CSS), en tu aplicación. Utilizas el export links en los archivos de rutas para especificar los recursos que se deben cargar en el cliente:

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: "/styles/app.css" },
];

### Loaders
Los loaders son funciones asíncronas que se ejecutan en el servidor antes de renderizar una ruta. Se usan para cargar datos necesarios para una página o componente:

export const loader = async () => {
  const data = await fetchSomeData();
  return json(data);
};


### Rutas Dinámicas
En Remix, puedes definir rutas dinámicas utilizando un formato especial en el nombre del archivo de ruta. Por ejemplo, el archivo routes/contacts/$contactId.tsx define una ruta donde $contactId es dinámico y se reemplaza con el valor real proporcionado en la URL.

### Rutas Anidadas
Las rutas anidadas permiten dividir la UI en componentes reutilizables que comparten una estructura jerárquica. Esto se refleja en el diseño de tu carpeta de rutas. Por ejemplo:

routes/
  contacts/
    index.tsx
    $contactId.tsx


###  Componente Outlet
El componente Outlet es un marcador de posición que indica dónde se deben renderizar las subrutas anidadas dentro del componente principal de la ruta actual. Por ejemplo:

function ContactsLayout() {
  return (
    <div>
      <h1>Contacts</h1>
      <Outlet />
    </div>
  );
}
