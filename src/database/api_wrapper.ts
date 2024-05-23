import { desc, eq } from "drizzle-orm";
import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { SQLiteTableWithColumns } from "drizzle-orm/sqlite-core";
import { consumeModification } from "./hooks";
import { TableRecord } from "./table_types";
import { randomId, timestamp } from "./utils";

export class APIWrapper <TableSpec extends TableRecord<{}>, T extends SQLiteTableWithColumns<TableRecord<any>>> {

    public constructor (
        protected db: BetterSQLite3Database<TableRecord<any>>,
        protected table: T,
        protected table_name: string
    ) {}

    public reference(id: string) {
        return `${this.table_name}::${id}`
    }

    public newId() {
        return `${this.table_name}::${randomId()}`
    }

    public async list() {
        return this.db.select().from(this.table).orderBy(desc(this.table.creationDate))
    }

    public async get(id: string) {
        const result = await this.db
            .select()
            .from(this.table)
            .where(eq(this.table.id, id))
            .orderBy(desc(this.table.creationDate))
        return result[0] as TableSpec
    }

    public async delete (id: string) {
        const deleted = await this.db.delete(this.table)
            .where(eq(this.table.id, id))
            .execute()
        consumeModification(this.table_name as any, id)
        return deleted
    }

    public async update (args: Partial<TableSpec> & { id: string }) {
        if (await this.get(args.id) == null) {
            return
        }
        const modified = await this.db.update(this.table)
            .set({
                ...args
            })
            .where(eq(this.table.id, args.id))
            .returning()
            .execute()
        const result = (modified as any)[0]
        consumeModification(this.table_name as any, result.id)
        return result as TableSpec
    }

    public async create (args: Partial<TableSpec>) {
        const created = await this.db.insert(this.table)
            .values({
                id: this.newId(),
                creationDate: timestamp(),
                modifiedDate: timestamp(),
                version: 0,
                ...args,
            })
            .returning()
            .execute()
        const result = (created as any)[0]
        consumeModification(this.table_name as any, result.id)
        return result as TableSpec
    }

    public async purge () {
        const rows = await this.list()
        await this.db.delete(this.table).execute()
        rows.forEach(row => {
            consumeModification(this.table_name as any, row.id)
        })
    }

}
