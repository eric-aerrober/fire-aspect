import { text, integer } from "drizzle-orm/sqlite-core";

export type TableRecord<T> = T & {
    id: string;
    version: number;
    modifiedDate: string;
    creationDate: string;
};

export function DrizzleTableRecord<T>(def: T) {
    return {
        ...def,
        id: text('id').notNull(),
        modifiedDate: text('modifiedDate').notNull(),
        creationDate: text('creationDate').notNull(),
        version: integer('version').notNull().default(0),
    };
}