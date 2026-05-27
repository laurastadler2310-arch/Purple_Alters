export type CustomField = {
  id: string;
  label: string;
  value: string;
};

export type Person = {
  id: string;
  ownerId: string;
  friendCode?: string;
  name: string;
  avatarUrl?: string;
  online: boolean;
  bio: string;
};

export type Alter = {
  id: string;
  ownerId: string;
  name: string;
  pronouns: string;
  color: string;
  role: string;
  bio: string;
  avatarUrl?: string;
  fields: CustomField[];
  friendIds: string[];
};

export type Message = {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
};

export type ChatThreads = Record<string, Message[]>;

export const initialAlters: Alter[] = [
  {
    id: "kai",
    ownerId: "demo",
    name: "Kai",
    pronouns: "they/he",
    color: "#8B5CF6",
    role: "Protector",
    bio: "Loves music, late-night drives, and keeping the system safe.",
    avatarUrl: "https://i.pravatar.cc/150?img=32",
    fields: [
      { id: "age", label: "Age", value: "27" },
      { id: "favorite", label: "Favorite music", value: "Synthwave" },
    ],
    friendIds: ["person-alex"],
  },
  {
    id: "ember",
    ownerId: "demo",
    name: "Ember",
    pronouns: "she/they",
    color: "#EF4444",
    role: "Creator",
    bio: "Curious, creative, and always ready to explore new ideas.",
    avatarUrl: "https://i.pravatar.cc/150?img=47",
    fields: [{ id: "age", label: "Age", value: "24" }],
    friendIds: ["person-alex"],
  },
  {
    id: "rowan",
    ownerId: "demo",
    name: "Rowan",
    pronouns: "he/him",
    color: "#10B981",
    role: "Guide",
    bio: "Calm, thoughtful, and focused on balance and long-term planning.",
    avatarUrl: "https://i.pravatar.cc/150?img=12",
    fields: [{ id: "age", label: "Age", value: "30" }],
    friendIds: [],
  },
];

export const initialPeople: Person[] = [
  {
    id: "person-alex",
    ownerId: "demo",
    name: "Alex",
    avatarUrl: "https://i.pravatar.cc/150?img=45",
    online: true,
    bio: "A friendly online person to connect with.",
  },
  {
    id: "person-sam",
    ownerId: "demo",
    name: "Sam",
    avatarUrl: "https://i.pravatar.cc/150?img=30",
    online: false,
    bio: "A remote friend who can be friended by alters.",
  },
];

export const getOtherAlters = (id: string, alters: Alter[]) => alters.filter((alter) => alter.id !== id);

export const getThreadKey = (idA: string, idB: string) => [idA, idB].sort().join("-");

export const initialChatThreads: ChatThreads = {
  "ember-kai": [
    {
      id: "1",
      sender: "kai",
      text: "Hey Ember, did you see the new system update?",
      timestamp: "08:12",
    },
    {
      id: "2",
      sender: "ember",
      text: "Yes! I want to try the new music routines tonight.",
      timestamp: "08:13",
    },
  ],
  "kai-rowan": [
    {
      id: "1",
      sender: "rowan",
      text: "We should plan the next week carefully.",
      timestamp: "10:08",
    },
    {
      id: "2",
      sender: "kai",
      text: "Agreed, I can help with the details.",
      timestamp: "10:11",
    },
  ],
  "ember-rowan": [
    {
      id: "1",
      sender: "ember",
      text: "Do you want to brainstorm a new goal?",
      timestamp: "14:22",
    },
    {
      id: "2",
      sender: "rowan",
      text: "Yes, something balanced and creative.",
      timestamp: "14:24",
    },
  ],
};
