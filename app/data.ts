////////////////////////////////////////////////////////////////////////////////
// 🛑 Nothing in here has anything to do with Remix, it's just a fake database
////////////////////////////////////////////////////////////////////////////////

import { matchSorter } from "match-sorter"; // Librería para búsqueda eficiente
import sortBy from "sort-by"; // Ordena arrays de objetos basado en claves
import invariant from "tiny-invariant"; // Manejo de errores (verifica condiciones y lanza errores)

// Definimos la estructura del contacto
export type Contact = {
  id: string;       // ID único del contacto
  first: string;    // Nombre
  last: string;     // Apellido
  avatar?: string;  // URL de la imagen
  twitter?: string; // Número de contacto
  notes?: string;   // Notas adicionales
  favorite?: boolean; // ¿Es favorito?
  createdAt: string; // Fecha de creación
};

// Base de datos en memoria
const fakeContacts = {
  records: {} as Record<string, Contact>, // Almacenamos contactos en un objeto

  // Obtener todos los contactos, ordenados por fecha y apellido
  async getAll(): Promise<Contact[]> {
    return Object.values(this.records).sort(sortBy("-createdAt", "last"));
  },

  // Obtener un contacto por ID
  async get(id: string): Promise<Contact | null> {
    return this.records[id] || null;
  },

  // Crear un nuevo contacto con datos opcionales
  async create(values: Partial<Contact>): Promise<Contact> {
    const id = values.id || crypto.randomUUID(); // Generar un ID único
    const createdAt = new Date().toISOString(); // Fecha de creación

    // Crear un nuevo objeto con valores por defecto si no se proveen
    const newContact: Contact = {
      id,
      first: values.first || "Nuevo",
      last: values.last || "Contacto",
      avatar: values.avatar || "",
      twitter: values.twitter || "",
      notes: values.notes || "",
      favorite: values.favorite || false,
      createdAt,
    };

    this.records[id] = newContact; // Guardamos en la "base de datos"
    return newContact;
  },

  // Actualizar un contacto existente
  async update(id: string, values: Partial<Contact>): Promise<Contact> {
    const contact = await this.get(id);
    invariant(contact, `No contact found for ${id}`);  // Verifica si existe el contacto

    // Combina los datos existentes con los nuevos valores
    const updatedContact = { ...contact, ...values };
    this.records[id] = updatedContact;
    return updatedContact;
  },

  // Eliminar un contacto
  async delete(id: string): Promise<void> {
    delete this.records[id];
  },
};

// Función para obtener contactos con opción de búsqueda
export async function getContacts(query?: string | null) {
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulación de retraso

  let contacts = await fakeContacts.getAll();
  if (query) {
    contacts = matchSorter(contacts, query, { keys: ["first", "last"] });
  }
  return contacts.sort(sortBy("last", "createdAt"));
}

// Función para crear un contacto vacío
export async function createContact({ first, last, avatar, twitter, notes }: Omit<Contact, "id" | "createdAt">) {
  return fakeContacts.create({ first, last, avatar, twitter, notes });
}


// Función para obtener un contacto por ID
export async function getContact(id: string) {
  return fakeContacts.get(id);
}

// Función para actualizar un contacto por ID
export async function updateContact(id: string, updates: Partial<Contact>) {
  return fakeContacts.update(id, updates);
}

// Función para eliminar un contacto por ID
export async function deleteContact(id: string) {
  return fakeContacts.delete(id);
}

// Lista de contactos iniciales
const initialContacts: Partial<Contact>[] = [
  { id :"1", first: "Selena", last: "Gomez", avatar: "https://th.bing.com/th/id/R.165d74fa4531cfeaba1b2b22c5789193?rik=Ay7YspWiE%2bYyJQ&riu=http%3a%2f%2flos40es00.epimg.net%2flos40%2fimagenes%2f2018%2f09%2f18%2falbum%2f1537269862_114079_1537278075_portada_normal.jpg&ehk=V2DfcRls0Ugt5jpvbE3EefYaG%2fZsTKRU1X1V%2bsD1PQI%3d&risl=&pid=ImgRaw&r=0", twitter: "310 123 4567" },
  { id :"2", first: "Shakira", last: "", avatar: "https://th.bing.com/th/id/OIP.-7ocCad8CvORJTzUN1MMngHaEK?rs=1&pid=ImgDetMain", twitter: "320 987 6543" },
  { id :"3", first: "Jennifer", last: "Lopez", avatar: "https://i.ytimg.com/vi/IMpNCKfNFf4/maxresdefault.jpg", twitter: "300 654 3210" },
  { id :"4", first: "Rihanna", last: "", avatar: "https://i.ytimg.com/vi/kcmKw9Ubg3w/maxresdefault.jpg", twitter: "311 555 1234" },
  { id :"5", first: "Justin", last: "Bieber", avatar: "https://caracoltv.brightspotcdn.com/dims4/default/cf5893f/2147483647/strip/true/crop/950x488+0+71/resize/1440x740!/quality/90/?url=https:%2F%2Fcaracol-brightspot.s3-us-west-2.amazonaws.com%2Fassets%2Fcaracoltv%2F82012c2878467b77128462f487359b07.jpg", twitter: "315 777 8899" },
  { id :"6", first: "Beyonce", last: "", avatar: "https://media.gettyimages.com/id/1503483688/photo/beyonc%C3%A9-renaissance-world-tour-warsaw.jpg?b=1&s=594x594&w=0&k=20&c=EVbfuHgLduR-0Sda_Fy_44Th2PrtRI90exf4uHRnshc=", twitter: "312 333 4455" },
  { id :"7", first: "Karol", last: "G", avatar: "https://www.semana.com/resizer/mz_7JaOJ8ujpaRbWxVgSJ1HQ5hg=/1280x720/smart/filters:format(jpg):quality(80)/cloudfront-us-east-1.images.arcpublishing.com/semana/U4QXWTQJ6NH7DITKWYRRA22X6M.jpg", twitter: "313 888 7766" },
  { id :"8", first: "Maluma", last: "", avatar: "https://th.bing.com/th/id/OIP.bxyyP4BCEbY9Xg86GdKe1wHaE9?rs=1&pid=ImgDetMain", twitter: "301 444 5566" },
  { id :"9",first: "Sebastian", last: "Yatra", avatar: "https://i.pinimg.com/736x/0f/5a/99/0f5a9927943909bde24f650c74882bcb.jpg", twitter: "314 999 2233" },
];

// Cargar los datos iniciales en la base de datos
initialContacts.forEach((contact) => {
  fakeContacts.create({ ...contact });
});