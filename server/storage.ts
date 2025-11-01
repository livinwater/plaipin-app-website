import type {
  Companion,
  InsertCompanion,
  Item,
  InsertItem,
  InventoryItem,
  InsertInventoryItem,
  JournalEntry,
  InsertJournalEntry,
  Message,
  InsertMessage,
  SearchHistory,
  InsertSearchHistory
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getCompanion(id: string): Promise<Companion | undefined>;
  getDefaultCompanion(): Promise<Companion>;
  updateCompanion(id: string, updates: Partial<Companion>): Promise<Companion>;

  getItems(): Promise<Item[]>;
  getItem(id: string): Promise<Item | undefined>;

  getInventory(companionId: string): Promise<(InventoryItem & { item: Item })[]>;
  addToInventory(item: InsertInventoryItem): Promise<InventoryItem>;
  updateInventoryItem(id: string, updates: Partial<InventoryItem>): Promise<InventoryItem>;

  getJournalEntries(companionId: string): Promise<JournalEntry[]>;
  createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry>;

  getMessages(companionId: string, conversationWith?: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;

  getSearchHistory(limit?: number): Promise<SearchHistory[]>;
  createSearchHistory(search: InsertSearchHistory): Promise<SearchHistory>;
}

export class MemStorage implements IStorage {
  private companions: Map<string, Companion>;
  private items: Map<string, Item>;
  private inventory: Map<string, InventoryItem>;
  private journalEntries: Map<string, JournalEntry>;
  private messages: Map<string, Message>;
  private searchHistory: Map<string, SearchHistory>;
  private defaultCompanionId: string;

  constructor() {
    this.companions = new Map();
    this.items = new Map();
    this.inventory = new Map();
    this.journalEntries = new Map();
    this.messages = new Map();
    this.searchHistory = new Map();
    
    this.defaultCompanionId = randomUUID();
    const defaultCompanion: Companion = {
      id: this.defaultCompanionId,
      name: "Buddy",
      mood: "Happy",
      energy: 85,
      happiness: 92,
      level: 12,
    };
    this.companions.set(this.defaultCompanionId, defaultCompanion);
    
    this.initializeStore();
    this.initializeInventory();
    this.initializeJournal();
    this.initializeMessages();
  }

  private initializeStore() {
    const storeItems: Item[] = [
      { id: randomUUID(), name: "Rainbow Ball", price: 150, category: "Toys", color: "bg-gradient-to-br from-red-400 to-purple-400" },
      { id: randomUUID(), name: "Cozy Bed", price: 300, category: "Furniture", color: "bg-gradient-to-br from-blue-400 to-cyan-400" },
      { id: randomUUID(), name: "Party Hat", price: 100, category: "Accessories", color: "bg-gradient-to-br from-yellow-400 to-orange-400" },
      { id: randomUUID(), name: "Training Guide", price: 200, category: "Books", color: "bg-gradient-to-br from-green-400 to-emerald-400" },
      { id: randomUUID(), name: "Friendship Bracelet", price: 120, category: "Accessories", color: "bg-gradient-to-br from-pink-400 to-rose-400" },
      { id: randomUUID(), name: "Energy Drink", price: 80, category: "Consumables", color: "bg-gradient-to-br from-purple-400 to-indigo-400" },
    ];
    storeItems.forEach(item => this.items.set(item.id, item));
  }

  private initializeInventory() {
    const itemsArray = Array.from(this.items.values());
    if (itemsArray.length >= 3) {
      const invItem1: InventoryItem = {
        id: randomUUID(),
        companionId: this.defaultCompanionId,
        itemId: itemsArray[0].id,
        quantity: 2,
        equipped: 1,
      };
      const invItem2: InventoryItem = {
        id: randomUUID(),
        companionId: this.defaultCompanionId,
        itemId: itemsArray[1].id,
        quantity: 1,
        equipped: 1,
      };
      const invItem3: InventoryItem = {
        id: randomUUID(),
        companionId: this.defaultCompanionId,
        itemId: itemsArray[2].id,
        quantity: 3,
        equipped: 0,
      };
      this.inventory.set(invItem1.id, invItem1);
      this.inventory.set(invItem2.id, invItem2);
      this.inventory.set(invItem3.id, invItem3);
    }
  }

  private initializeJournal() {
    const entries: JournalEntry[] = [
      {
        id: randomUUID(),
        companionId: this.defaultCompanionId,
        title: "A wonderful day at the park",
        content: "Today Buddy and I went to the park. We met Luna and had so much fun playing together...",
        mood: "Happy",
        createdAt: new Date("2025-11-01"),
      },
      {
        id: randomUUID(),
        companionId: this.defaultCompanionId,
        title: "Halloween adventures",
        content: "What a fun Halloween! Buddy dressed up and we went trick-or-treating with friends...",
        mood: "Excited",
        createdAt: new Date("2025-10-31"),
      },
    ];
    entries.forEach(entry => this.journalEntries.set(entry.id, entry));
  }

  private initializeMessages() {
    const msgs: Message[] = [
      {
        id: randomUUID(),
        companionId: this.defaultCompanionId,
        conversationWith: "Luna",
        senderName: "Luna",
        text: "Hey Buddy! How are you today?",
        isOwn: 0,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        companionId: this.defaultCompanionId,
        conversationWith: "Luna",
        senderName: "Buddy",
        text: "I'm doing great! Just finished training.",
        isOwn: 1,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        companionId: this.defaultCompanionId,
        conversationWith: "Luna",
        senderName: "Luna",
        text: "Let's play together!",
        isOwn: 0,
        createdAt: new Date(),
      },
    ];
    msgs.forEach(msg => this.messages.set(msg.id, msg));
  }

  async getCompanion(id: string): Promise<Companion | undefined> {
    return this.companions.get(id);
  }

  async getDefaultCompanion(): Promise<Companion> {
    return this.companions.get(this.defaultCompanionId)!;
  }

  async updateCompanion(id: string, updates: Partial<Companion>): Promise<Companion> {
    const companion = this.companions.get(id);
    if (!companion) throw new Error("Companion not found");
    const updated = { ...companion, ...updates };
    this.companions.set(id, updated);
    return updated;
  }

  async getItems(): Promise<Item[]> {
    return Array.from(this.items.values());
  }

  async getItem(id: string): Promise<Item | undefined> {
    return this.items.get(id);
  }

  async getInventory(companionId: string): Promise<(InventoryItem & { item: Item })[]> {
    const invItems = Array.from(this.inventory.values())
      .filter(inv => inv.companionId === companionId);
    
    return invItems.map(inv => {
      const item = this.items.get(inv.itemId);
      if (!item) throw new Error("Item not found");
      return { ...inv, item };
    });
  }

  async addToInventory(insertItem: InsertInventoryItem): Promise<InventoryItem> {
    const existing = Array.from(this.inventory.values()).find(
      inv => inv.companionId === insertItem.companionId && inv.itemId === insertItem.itemId
    );
    
    if (existing) {
      existing.quantity += insertItem.quantity ?? 1;
      this.inventory.set(existing.id, existing);
      return existing;
    }
    
    const newItem: InventoryItem = {
      id: randomUUID(),
      companionId: insertItem.companionId,
      itemId: insertItem.itemId,
      quantity: insertItem.quantity ?? 1,
      equipped: insertItem.equipped ?? 0,
    };
    this.inventory.set(newItem.id, newItem);
    return newItem;
  }

  async updateInventoryItem(id: string, updates: Partial<InventoryItem>): Promise<InventoryItem> {
    const item = this.inventory.get(id);
    if (!item) throw new Error("Inventory item not found");
    const updated = { ...item, ...updates };
    this.inventory.set(id, updated);
    return updated;
  }

  async getJournalEntries(companionId: string): Promise<JournalEntry[]> {
    return Array.from(this.journalEntries.values())
      .filter(entry => entry.companionId === companionId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createJournalEntry(insertEntry: InsertJournalEntry): Promise<JournalEntry> {
    const entry: JournalEntry = {
      id: randomUUID(),
      ...insertEntry,
      createdAt: new Date(),
    };
    this.journalEntries.set(entry.id, entry);
    return entry;
  }

  async getMessages(companionId: string, conversationWith?: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(msg => 
        msg.companionId === companionId &&
        (!conversationWith || msg.conversationWith === conversationWith)
      )
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const message: Message = {
      id: randomUUID(),
      companionId: insertMessage.companionId,
      conversationWith: insertMessage.conversationWith,
      senderName: insertMessage.senderName,
      text: insertMessage.text,
      isOwn: insertMessage.isOwn ?? 0,
      createdAt: new Date(),
    };
    this.messages.set(message.id, message);
    return message;
  }

  async getSearchHistory(limit: number = 100): Promise<SearchHistory[]> {
    const entries = Array.from(this.searchHistory.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return entries.slice(0, limit);
  }

  async createSearchHistory(insertSearch: InsertSearchHistory): Promise<SearchHistory> {
    const search: SearchHistory = {
      id: randomUUID(),
      query: insertSearch.query,
      answer: insertSearch.answer,
      documents: insertSearch.documents || null,
      createdAt: new Date(),
    };
    this.searchHistory.set(search.id, search);
    return search;
  }
}

export const storage = new MemStorage();
