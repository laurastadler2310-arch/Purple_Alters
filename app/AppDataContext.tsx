import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
    Alter,
    initialAlters,
    initialChatThreads,
    initialPeople,
    type ChatThreads,
    type Message,
    type Person,
} from "../constants/alters";

type AppDataContextValue = {
  alters: Alter[];
  people: Person[];
  chatThreads: ChatThreads;
  addAlter: (alter: Alter) => void;
  updateAlter: (alter: Alter) => void;
  toggleFriend: (alterId: string, personId: string) => void;
  addPerson: (person: Person) => void;
  addMessage: (threadKey: string, message: Message) => void;
};

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);
const STORAGE_KEY = "@alters-app/data";

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [alters, setAlters] = useState<Alter[]>(initialAlters);
  const [people, setPeople] = useState<Person[]>(initialPeople);
  const [chatThreads, setChatThreads] = useState<ChatThreads>(initialChatThreads);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) {
          return;
        }

        const parsed = JSON.parse(raw) as {
          alters?: Alter[];
          people?: Person[];
          chatThreads?: ChatThreads;
        };

        if (parsed.alters) setAlters(parsed.alters);
        if (parsed.people) setPeople(parsed.people);
        if (parsed.chatThreads) setChatThreads(parsed.chatThreads);
      } catch (error) {
        console.warn("Failed to load saved app data:", error);
      } finally {
        setHydrated(true);
      }
    };

    void loadSavedData();
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const saveData = async () => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ alters, people, chatThreads })
        );
      } catch (error) {
        console.warn("Failed to save app data:", error);
      }
    };

    void saveData();
  }, [alters, people, chatThreads, hydrated]);

  const addAlter = (alter: Alter) => {
    setAlters((current) => [...current, alter]);
  };

  const updateAlter = (alter: Alter) => {
    setAlters((current) =>
      current.map((item) => (item.id === alter.id ? alter : item))
    );
  };

  const toggleFriend = (alterId: string, personId: string) => {
    setAlters((current) =>
      current.map((item) => {
        if (item.id !== alterId) return item;
        const hasFriend = item.friendIds.includes(personId);
        return {
          ...item,
          friendIds: hasFriend
            ? item.friendIds.filter((id) => id !== personId)
            : [...item.friendIds, personId],
        };
      })
    );
  };

  const addPerson = (person: Person) => {
    setPeople((current) => [...current, person]);
  };

  const addMessage = (threadKey: string, message: Message) => {
    setChatThreads((current) => ({
      ...current,
      [threadKey]: [...(current[threadKey] ?? []), message],
    }));
  };

  return (
    <AppDataContext.Provider
      value={{
        alters,
        people,
        chatThreads,
        addAlter,
        updateAlter,
        toggleFriend,
        addPerson,
        addMessage,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const value = useContext(AppDataContext);
  if (!value) {
    throw new Error("useAppData must be used within AppDataProvider");
  }
  return value;
}
