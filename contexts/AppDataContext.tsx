import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
    Alter,
    type ChatThreads,
    type Message,
    type Person
} from "../constants/alters";
import { useAuth } from "./AuthContext";

type AppDataContextValue = {
  currentUserId: string | null;
  alters: Alter[];
  people: Person[];
  chatThreads: ChatThreads;
  addAlter: (alter: Omit<Alter, "ownerId">) => void;
  updateAlter: (alter: Alter) => void;
  toggleFriend: (alterId: string, personId: string) => void;
  addPerson: (person: Omit<Person, "ownerId">) => void;
  addFriendByCode: (friendCode: string) => Person | null;
  addMessage: (threadKey: string, message: Message) => void;
};

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const currentUserId = user?.id ?? null;
  const storageKey = currentUserId
    ? `@alters-app/data:${currentUserId}`
    : "@alters-app/data:guest";

  const [alters, setAlters] = useState<Alter[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [chatThreads, setChatThreads] = useState<ChatThreads>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!currentUserId) {
      setAlters([]);
      setPeople([]);
      setChatThreads({});
      setHydrated(true);
      return;
    }

    setHydrated(false);
    setAlters([]);
    setPeople([]);
    setChatThreads({});

    const loadSavedData = async () => {
      try {
        const raw = await AsyncStorage.getItem(storageKey);

        if (!raw) {
          setAlters([]);
          setPeople([]);
          setChatThreads({});
          setHydrated(true);
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
  }, [currentUserId, storageKey]);

  useEffect(() => {
    if (!hydrated || !currentUserId) return;

    const saveData = async () => {
      try {
        await AsyncStorage.setItem(
          storageKey,
          JSON.stringify({
            alters,
            people,
            chatThreads,
          })
        );
      } catch (error) {
        console.warn("Failed to save app data:", error);
      }
    };

    void saveData();
  }, [alters, people, chatThreads, hydrated, currentUserId, storageKey]);

  const addAlter = (alter: Omit<Alter, "ownerId">) => {
    if (!currentUserId) return;
    setAlters((current) => [
      ...current,
      {
        ...alter,
        ownerId: currentUserId,
      },
    ]);
  };

  const updateAlter = (alter: Alter) => {
    setAlters((current) =>
      current.map((item) =>
        item.id === alter.id ? alter : item
      )
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

  const addPerson = (person: Omit<Person, "ownerId">) => {
    if (!currentUserId) return;
    setPeople((current) => [
      ...current,
      {
        ...person,
        ownerId: currentUserId,
      },
    ]);
  };

  const addFriendByCode = (friendCode: string) => {
    if (!currentUserId) return null;

    const trimmedCode = friendCode.trim().toUpperCase();
    if (!trimmedCode) return null;

    const existing = people.find(
      (person) => person.friendCode?.toUpperCase() === trimmedCode
    );

    if (existing) {
      return existing;
    }

    const person: Person = {
      id: `friend-${trimmedCode}`,
      ownerId: currentUserId,
      friendCode: trimmedCode,
      name: `Friend ${trimmedCode}`,
      online: true,
      bio: "Friend added by code.",
    };

    setPeople((current) => [...current, person]);
    return person;
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
        currentUserId,
        alters,
        people,
        chatThreads,
        addAlter,
        updateAlter,
        toggleFriend,
        addPerson,
        addFriendByCode,
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
