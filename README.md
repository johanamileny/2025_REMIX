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

   ### Action
Las funciones action en Remix son similares a los "loaders", pero se usan para manejar datos enviados por el cliente, generalmente a través de formularios. Se ejecutan en el servidor y permiten procesar datos antes de devolver una respuesta.

export const action = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name");

  // Procesa los datos aquí

  return json({ success: true });
};

### Loader
Las funciones loader son asíncronas y se ejecutan en el servidor antes de renderizar una ruta. Se usan para cargar datos necesarios para una página o componente

export const loader = async () => {
  const data = await fetchSomeData();
  return json(data);
};


### useLoaderData
El hook useLoaderData se usa para acceder a los datos cargados por un loader. Lo utilizas dentro de tus componentes para acceder a los datos cargados.


import { useLoaderData } from "remix";

export default function MyComponent() {
  const data = useLoaderData();
  return <div>{data.someProperty}</div>;
}

### useActionData
El hook useActionData se usa para acceder a los datos devueltos por una action. Esto es útil para manejar los resultados de formularios enviados.


import { useActionData } from "remix";

export default function MyForm() {
  const actionData = useActionData();

  return (
    <form method="post">
      <input type="text" name="name" />
      <button type="submit">Submit</button>
      {actionData && <p>{actionData.success ? "Success!" : "Failed"}</p>}
    </form>
  );
}


### Invariant
Invariant es una utilidad que se usa para verificar condiciones y lanzar errores si una condición no se cumple. Esto es útil para las validaciones en tu aplicación.


import invariant from "tiny-invariant";

function processData(data) {
  invariant(data.name, "Name is required");
  // Procesa los datos aquí
}


### Validaciones
Para hacer validaciones en Remix, puedes usar tanto loader como action para verificar datos y devolver mensajes de error. Aquí tienes un ejemplo básico de validación en una action:

import { json } from "remix";
import invariant from "tiny-invariant";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name");

  invariant(name, "Name is required");

  if (name.length < 3) {
    return json({ error: "Name must be at least 3 characters long" });
  }

  return json({ success: true });
};

}
