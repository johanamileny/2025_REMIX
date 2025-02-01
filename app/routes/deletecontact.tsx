import { ActionFunction, redirect } from "@remix-run/node";
import { deleteContact, getContacts } from "~/data";


export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const id = formData.get("id");

  if (typeof id !== "string") {
    throw new Error("Invalid contact ID");
  }

  // Eliminar el contacto seleccionado
  await deleteContact(id);

  // Obtener la lista de contactos restantes
  const remainingContacts = await getContacts();

  // Determinar a dónde redirigir
  const nextContact = remainingContacts.length > 0 ? remainingContacts[0].id : null;

  // Si hay otro contacto, redirigir a su página; si no, ir a la lista de contactos
  return redirect(`${nextContact ? `/contacts/${nextContact}` : "/contacts"}?message=Contacto eliminado correctamente`);
};