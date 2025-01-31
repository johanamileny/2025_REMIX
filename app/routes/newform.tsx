import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useNavigate } from "@remix-run/react";
import { createContact } from "../data";
import type { ActionFunctionArgs } from "@remix-run/node";


// 📌 Acción para manejar la creación del contacto
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const first = formData.get("first")?.toString().trim();
  const last = formData.get("last")?.toString().trim();
  const avatar = formData.get("avatar")?.toString().trim();
  const twitter = formData.get("twitter")?.toString().trim();
  const notes = formData.get("notes")?.toString().trim();


  if (!first || !last) {
    return json({ error: "First and last name are required" }, { status: 400 });
  }


  const newContact = await createContact({ first, last, avatar, twitter, notes });
  return redirect(`/contacts/${newContact.id}`);

};

// 📌 Componente del formulario
export default function NewContactForm() {
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();

  return (
    <div>
      <h2>Create New Contact</h2>
      {actionData?.error && <p style={{ color: "red" }}>{actionData.error}</p>}

      <Form method="post">
        <label>
          First Name:
          <input type="text" name="first" required />
        </label>

        <label>
          Last Name:
          <input type="text" name="last" required />
        </label>

        <label>
          Avatar URL:
          <input type="text" name="avatar" placeholder="https://example.com/avatar.jpg" />
        </label>

        <label>
          Twitter:
          <input type="text" name="twitter" placeholder="@username" />
        </label>

        <label>
          Notes:
          <textarea name="notes" placeholder="Additional information..."></textarea>
        </label>

        <button type="submit">Save Contact</button>
        <button type="button" onClick={() => navigate(-1)}>Cancel</button>
      </Form>
    </div>
  );
}