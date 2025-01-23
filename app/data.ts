////////////////////////////////////////////////////////////////////////////////
// 🛑 Nothing in here has anything to do with Remix, it's just a fake database
////////////////////////////////////////////////////////////////////////////////

import { matchSorter } from "match-sorter";
// @ts-expect-error - no types, but it's a tiny function
import sortBy from "sort-by";
import invariant from "tiny-invariant";

type ContactMutation = {
  id?: string;
  first?: string;
  last?: string;
  avatar?: string;
  twitter?: string;
  notes?: string;
  favorite?: boolean;
};

export type ContactRecord = ContactMutation & {
  id: string;
  createdAt: string;
};

////////////////////////////////////////////////////////////////////////////////
// This is just a fake DB table. In a real app you'd be talking to a real db or
// fetching from an existing API.
const fakeContacts = {
  records: {} as Record<string, ContactRecord>,

  async getAll(): Promise<ContactRecord[]> {
    return Object.keys(fakeContacts.records)
      .map((key) => fakeContacts.records[key])
      .sort(sortBy("-createdAt", "last"));
  },

  async get(id: string): Promise<ContactRecord | null> {
    return fakeContacts.records[id] || null;
  },

  async create(values: ContactMutation): Promise<ContactRecord> {
    const id = values.id || Math.random().toString(36).substring(2, 9);
    const createdAt = new Date().toISOString();
    const newContact = { id, createdAt, ...values };
    fakeContacts.records[id] = newContact;
    return newContact;
  },

  async set(id: string, values: ContactMutation): Promise<ContactRecord> {
    const contact = await fakeContacts.get(id);
    invariant(contact, `No contact found for ${id}`);
    const updatedContact = { ...contact, ...values };
    fakeContacts.records[id] = updatedContact;
    return updatedContact;
  },

  destroy(id: string): null {
    delete fakeContacts.records[id];
    return null;
  },
};

////////////////////////////////////////////////////////////////////////////////
// Handful of helper functions to be called from route loaders and actions
export async function getContacts(query?: string | null) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  let contacts = await fakeContacts.getAll();
  if (query) {
    contacts = matchSorter(contacts, query, {
      keys: ["first", "last"],
    });
  }
  return contacts.sort(sortBy("last", "createdAt"));
}

export async function createEmptyContact() {
  const contact = await fakeContacts.create({});
  return contact;
}

export async function getContact(id: string) {
  return fakeContacts.get(id);
}

export async function updateContact(id: string, updates: ContactMutation) {
  const contact = await fakeContacts.get(id);
  if (!contact) {
    throw new Error(`No contact found for ${id}`);
  }
  await fakeContacts.set(id, { ...contact, ...updates });
  return contact;
}

export async function deleteContact(id: string) {
  fakeContacts.destroy(id);
}

[
  {
    avatar:
      "https://th.bing.com/th/id/R.165d74fa4531cfeaba1b2b22c5789193?rik=Ay7YspWiE%2bYyJQ&riu=http%3a%2f%2flos40es00.epimg.net%2flos40%2fimagenes%2f2018%2f09%2f18%2falbum%2f1537269862_114079_1537278075_portada_normal.jpg&ehk=V2DfcRls0Ugt5jpvbE3EefYaG%2fZsTKRU1X1V%2bsD1PQI%3d&risl=&pid=ImgRaw&r=0",
    first: "Selena",
    last: "Gomez",
    twitter: "310 123 4567",
  },
  {
    avatar:
      "https://th.bing.com/th/id/OIP.-7ocCad8CvORJTzUN1MMngHaEK?rs=1&pid=ImgDetMain",
    first: "Shakira",
    last: "",
    twitter: "320 987 6543",
  },
  {
    avatar:
      "https://i.ytimg.com/vi/IMpNCKfNFf4/maxresdefault.jpg",
    first: "Jenifer",
    last: "lopez",
    twitter: "300 654 3210",
  },
  {
    avatar:
      "https://i.ytimg.com/vi/kcmKw9Ubg3w/maxresdefault.jpg",
    first: "Rihana",
    last: "",
    twitter: "311 555 1234",
  },
  {
    avatar:
      "https://caracoltv.brightspotcdn.com/dims4/default/cf5893f/2147483647/strip/true/crop/950x488+0+71/resize/1440x740!/quality/90/?url=https:%2F%2Fcaracol-brightspot.s3-us-west-2.amazonaws.com%2Fassets%2Fcaracoltv%2F82012c2878467b77128462f487359b07.jpg",
    first: "justin",
    last: "Bieber",
    twitter: "315 777 8899",
  },
  {
    avatar:
      "https://media.gettyimages.com/id/1503483688/photo/beyonc%C3%A9-renaissance-world-tour-warsaw.jpg?b=1&s=594x594&w=0&k=20&c=EVbfuHgLduR-0Sda_Fy_44Th2PrtRI90exf4uHRnshc=",
    first: "Beyonce",
    last: "",
    twitter: "312 333 4455",
  },
  {
    avatar:
      "data:image/jpeg;base64,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",
    first: "Michael",
    last: "Jasckon",
    twitter: "322 666 1122",
  },
  {
    avatar:
      "https://www.semana.com/resizer/mz_7JaOJ8ujpaRbWxVgSJ1HQ5hg=/1280x720/smart/filters:format(jpg):quality(80)/cloudfront-us-east-1.images.arcpublishing.com/semana/U4QXWTQJ6NH7DITKWYRRA22X6M.jpg",
    first: "Karol",
    last: "G",
    twitter: "313 888 7766",
  },
  {
    avatar:
      "https://th.bing.com/th/id/OIP.bxyyP4BCEbY9Xg86GdKe1wHaE9?rs=1&pid=ImgDetMain",
    first: "Maluma",
    last: "",
    twitter: "301 444 5566$",
  },
  {
    avatar:
      "https://i.pinimg.com/736x/0f/5a/99/0f5a9927943909bde24f650c74882bcb.jpg",
    first: "Sebastian",
    last: "Yatra",
    twitter: "314 999 2233",
  },
]
  /*{
    avatar:
      "https://sessionize.com/image/c9d5-400o400o2-Sri5qnQmscaJXVB8m3VBgf.jpg",
    first: "Nevi",
    last: "Shah",
    twitter: "@nevikashah",
  },
  {
    avatar:
      "https://sessionize.com/image/2694-400o400o2-MYYTsnszbLKTzyqJV17w2q.png",
    first: "Andrew",
    last: "Petersen",
  },
  {
    avatar:
      "https://sessionize.com/image/907a-400o400o2-9TM2CCmvrw6ttmJiTw4Lz8.jpg",
    first: "Scott",
    last: "Smerchek",
    twitter: "@smerchek",
  },
  {
    avatar:
      "https://sessionize.com/image/08be-400o400o2-WtYGFFR1ZUJHL9tKyVBNPV.jpg",
    first: "Giovanni",
    last: "Benussi",
    twitter: "@giovannibenussi",
  },
  {
    avatar:
      "https://sessionize.com/image/f814-400o400o2-n2ua5nM9qwZA2hiGdr1T7N.jpg",
    first: "Igor",
    last: "Minar",
    twitter: "@IgorMinar",
  },
  {
    avatar:
      "https://sessionize.com/image/fb82-400o400o2-LbvwhTVMrYLDdN3z4iEFMp.jpeg",
    first: "Brandon",
    last: "Kish",
  },
  {
    avatar:
      "https://sessionize.com/image/fcda-400o400o2-XiYRtKK5Dvng5AeyC8PiUA.png",
    first: "Arisa",
    last: "Fukuzaki",
    twitter: "@arisa_dev",
  },
  {
    avatar:
      "https://sessionize.com/image/c8c3-400o400o2-PR5UsgApAVEADZRixV4H8e.jpeg",
    first: "Alexandra",
    last: "Spalato",
    twitter: "@alexadark",
  },
  {
    avatar:
      "https://sessionize.com/image/7594-400o400o2-hWtdCjbdFdLgE2vEXBJtyo.jpg",
    first: "Cat",
    last: "Johnson",
  },
  {
    avatar:
      "https://sessionize.com/image/5636-400o400o2-TWgi8vELMFoB3hB9uPw62d.jpg",
    first: "Ashley",
    last: "Narcisse",
    twitter: "@_darkfadr",
  },
  {
    avatar:
      "https://sessionize.com/image/6aeb-400o400o2-Q5tAiuzKGgzSje9ZsK3Yu5.JPG",
    first: "Edmund",
    last: "Hung",
    twitter: "@_edmundhung",
  },
  {
    avatar:
      "https://sessionize.com/image/30f1-400o400o2-wJBdJ6sFayjKmJycYKoHSe.jpg",
    first: "Clifford",
    last: "Fajardo",
    twitter: "@cliffordfajard0",
  },
  {
    avatar:
      "https://sessionize.com/image/6faa-400o400o2-amseBRDkdg7wSK5tjsFDiG.jpg",
    first: "Erick",
    last: "Tamayo",
    twitter: "@ericktamayo",
  },
  {
    avatar:
      "https://sessionize.com/image/feba-400o400o2-R4GE7eqegJNFf3cQ567obs.jpg",
    first: "Paul",
    last: "Bratslavsky",
    twitter: "@codingthirty",
  },
  {
    avatar:
      "https://sessionize.com/image/c315-400o400o2-spjM5A6VVfVNnQsuwvX3DY.jpg",
    first: "Pedro",
    last: "Cattori",
    twitter: "@pcattori",
  },
  {
    avatar:
      "https://sessionize.com/image/eec1-400o400o2-HkvWKLFqecmFxLwqR9KMRw.jpg",
    first: "Andre",
    last: "Landgraf",
    twitter: "@AndreLandgraf94",
  },
  {
    avatar:
      "https://sessionize.com/image/c73a-400o400o2-4MTaTq6ftC15hqwtqUJmTC.jpg",
    first: "Monica",
    last: "Powell",
    twitter: "@indigitalcolor",
  },
  {
    avatar:
      "https://sessionize.com/image/cef7-400o400o2-KBZUydbjfkfGACQmjbHEvX.jpeg",
    first: "Brian",
    last: "Lee",
    twitter: "@brian_dlee",
  },
  {
    avatar:
      "https://sessionize.com/image/f83b-400o400o2-Pyw3chmeHMxGsNoj3nQmWU.jpg",
    first: "Sean",
    last: "McQuaid",
    twitter: "@SeanMcQuaidCode",
  },
  {
    avatar:
      "https://sessionize.com/image/a9fc-400o400o2-JHBnWZRoxp7QX74Hdac7AZ.jpg",
    first: "Shane",
    last: "Walker",
    twitter: "@swalker326",
  },
  {
    avatar:
      "https://sessionize.com/image/6644-400o400o2-aHnGHb5Pdu3D32MbfrnQbj.jpg",
    first: "Jon",
    last: "Jensen",
    twitter: "@jenseng",
  },
  

]*/

.forEach((contact) => {
  fakeContacts.create({
    ...contact,
    id: `${contact.first.toLowerCase()}-${contact.last.toLocaleLowerCase()}`,
  });
});