// routes/contacts.$contactId_.edit.tsx
import { Form, useLoaderData, redirect , json} from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { updateContact, getContact } from "../data"; // Importa getContact

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.contactId, "Missing contactId param"); // Uso de invariant
  const contact = await getContact(params.contactId);
  if (!contact) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ contact });
};

export const action = async ({ request, params }: LoaderFunctionArgs) => {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateContact(params.contactId as string, updates);
  return redirect(`/contacts/${params.contactId}`);
};

export default function EditContact() {
  const { contact } = useLoaderData<typeof loader>();

  return (
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
  );
}