import { Session } from "@/domain/entity/Session";
import { SessionRepository } from "@/domain/repository/SessionRepository";

export class InMemorySessionRepository implements SessionRepository {
  items: Session[];

  constructor() {
    this.items = [];
  }
  async fetchPage(page: number): Promise<Session[]> {
    return this.items.slice((page - 1) * 20, page * 20);
  }
  async update(session: Session): Promise<void> {
    const sessionIndex = this.items.findIndex(item=>item.getId()===session.getId())
    this.items.slice(sessionIndex,1)
  }

  async findById(sessionId: string): Promise<Session | undefined> {
    return this.items.find((item) => item.getId() === sessionId);
  }
  async delete(session: Session): Promise<void> {
    this.items = this.items.filter((item) => item.getId() !== session.getId());
  }

  async create(session: Session): Promise<void> {
    this.items.push(session);
  }
}
