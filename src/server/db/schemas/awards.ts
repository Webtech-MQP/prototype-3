import { createId } from "@paralleldrive/cuid2";
import { sql, relations } from "drizzle-orm";
import { createTable } from "../schema-util";
import { candidateProfiles } from "./profiles";

export const awards = createTable("award", (d) => ({
    id: d
        .text()
        .$defaultFn(() => createId())
        .primaryKey(),
    title: d.text({ length: 256 }).notNull(),
    description: d.text({ length: 1000 }),
    imageURL: d.text({ length: 255 }).notNull(),
    category: d.text({ length: 64 }), // e.g. 'achievement', 'participation'
    issuedAt: d.integer({ mode: "timestamp" }),
    issuerType: d.text({ enum: ["internal", "external"] }).default("internal"),
    issuerName: d.text({ length: 256 }), // e.g., "Microsoft", "Google", "Hackathon 2024"
    isActive: d.integer({ mode: "boolean" }).default(true),
    createdAt: d.integer({ mode: "timestamp" }).default(sql`(unixepoch())`),
}));

export const candidateAwards = createTable("candidate_award", (d) => ({
    id: d
        .text()
        .$defaultFn(() => createId())
        .primaryKey(),
    userId: d
        .text()
        .notNull()
        .references(() => candidateProfiles.userId, { onDelete: "cascade" }),
    awardId: d
        .text()
        .notNull()
        .references(() => awards.id, { onDelete: "cascade" }),
    earnedAt: d.integer({ mode: "timestamp" }).default(sql`(unixepoch())`),
    displayOrder: d.integer().default(0),
    isVisible: d.integer({ mode: "boolean" }).default(true),
}));

export const awardsRelations = relations(awards, ({ many }) => ({
    candidateAwards: many(candidateAwards),
}));

export const candidateAwardsRelations = relations(candidateAwards, ({ one }) => ({
    candidate: one(candidateProfiles, {
      fields: [candidateAwards.userId],
      references: [candidateProfiles.userId],
    }),
    award: one(awards, {
      fields: [candidateAwards.awardId],
      references: [awards.id],
    }),
  }),
);
