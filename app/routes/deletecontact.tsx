// filepath: /c:/Users/Usuario/Documents/Remix2025/remix_2025-nodo/app/routes/deletecontact.tsx
import { redirect, json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { updateContact, getContact, deleteContact } from "../data"; // Importa getContact y deleteContact

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.contactId, "Missing contactId param"); // Uso de invariant
  const contact = await getContact(params.contactId);
  if (!contact) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ contact });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  invariant(params.contactId, "Missing contactId param");
  const formData = await request.formData();
  const method = formData.get("_method");

  if (method === "delete") {
    await deleteContact(params.contactId);
    return redirect("/contacts");
  }

  const updates = Object.fromEntries(formData);
  await updateContact(params.contactId as string, updates);
  return redirect(`/contacts/${params.contactId}`);
};

export default function EditContact() {
  const { contact } = useLoaderData<typeof loader>();

  return (
    <div>
      <h2>Edit Contact</h2>
      <Form method="post">
        <label>
          First Name: <input name="first" defaultValue={contact.first} />
        </label>
        <label>
          Last Name: <input name="last" defaultValue={contact.last} />
        </label>
        <label>
          Twitter: <input name="twitter" defaultValue={contact.twitter} />
        </label>
        <label>
          Avatar URL: <input name="avatar" defaultValue={contact.avatar} />
        </label>
        <label>
          Notes: <textarea name="notes" defaultValue={contact.notes} />
        </label>
        <button type="submit">Save</button>
      </Form>

      <Form method="post" onSubmit={(event) => {
        const response = confirm("Please confirm you want to delete this record.");
        if (!response) {
          event.preventDefault();
        }
      }}>
        <input type="hidden" name="_method" value="delete" />
        <button type="submit">Delete</button>
      </Form>
    </div>
  );
}