import { users, userProfiles, type User, type InsertUser, type UserProfile, type InsertUserProfile } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUserProfile(sessionId: string): Promise<UserProfile | undefined>;
  updateUserProfile(sessionId: string, data: Partial<UserProfile>): Promise<UserProfile>;
  createUserProfile(data: InsertUserProfile): Promise<UserProfile>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getUserProfile(sessionId: string): Promise<UserProfile | undefined> {
    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.sessionId, sessionId));
    return profile || undefined;
  }

  async updateUserProfile(sessionId: string, data: Partial<UserProfile>): Promise<UserProfile> {
    const [profile] = await db
      .update(userProfiles)
      .set({ 
        ...data, 
        lastUpdated: new Date() 
      })
      .where(eq(userProfiles.sessionId, sessionId))
      .returning();
    return profile;
  }

  async createUserProfile(data: InsertUserProfile): Promise<UserProfile> {
    const [profile] = await db
      .insert(userProfiles)
      .values(data)
      .returning();
    return profile;
  }
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private profiles: Map<string, UserProfile>;

  constructor() {
    this.users = new Map();
    this.profiles = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getUserProfile(sessionId: string): Promise<UserProfile | undefined> {
    return this.profiles.get(sessionId);
  }

  async updateUserProfile(sessionId: string, data: Partial<UserProfile>): Promise<UserProfile> {
    const existing = this.profiles.get(sessionId) || {
      id: randomUUID(),
      sessionId,
      name: null,
      location: null,
      job: null,
      hobbies: null,
      preferences: null,
      notes: null,
      lastUpdated: new Date(),
      createdAt: new Date(),
    };
    
    const updated = { ...existing, ...data, lastUpdated: new Date() };
    this.profiles.set(sessionId, updated);
    return updated;
  }

  async createUserProfile(data: InsertUserProfile): Promise<UserProfile> {
    const id = randomUUID();
    const profile: UserProfile = { 
      id,
      sessionId: data.sessionId,
      name: data.name || null,
      location: data.location || null,
      job: data.job || null,
      hobbies: data.hobbies || null,
      preferences: data.preferences || null,
      notes: data.notes || null,
      createdAt: new Date(),
      lastUpdated: new Date()
    };
    this.profiles.set(data.sessionId, profile);
    return profile;
  }
}

export const storage = new DatabaseStorage();
