import { relations } from 'drizzle-orm';
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

// Scholar profile table keyed directly by Firebase Auth UID
export const users = pgTable('users', {
  uid: text('uid').primaryKey(),
  email: text('email').notNull(),
  displayName: text('display_name').notNull(),
  target: integer('target').notNull().default(70),
  xp: integer('xp').notNull().default(0),
  streakCount: integer('streak_count').notNull().default(0),
  activeSubj: text('active_subj').notNull().default('maths'),
  examType: text('exam_type'),
  examDate: text('exam_date'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Owner-only cross-device study state snapshot (1:1 with users)
export const scholarProgressSync = pgTable('scholar_progress_sync', {
  uid: text('uid')
    .primaryKey()
    .references(() => users.uid, { onDelete: 'cascade' }),
  progress: jsonb('progress').$type<Record<string, unknown>>().notNull(),
  schemaVersion: integer('schema_version').notNull().default(1),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Shared deterministic Peer Study Duels
export const peerDuels = pgTable(
  'peer_duels',
  {
    duelId: text('duel_id').primaryKey(),
    creatorUid: text('creator_uid')
      .notNull()
      .references(() => users.uid, { onDelete: 'cascade' }),
    creatorName: text('creator_name').notNull(),
    subject: text('subject').notNull(),
    title: text('title').notNull(),
    seed: text('seed').notNull(),
    questionCount: integer('question_count').notNull().default(10),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('peer_duels_creator_idx').on(table.creatorUid)]
);

// Immutable scholar score submissions per Peer Study Duel (1 entry per scholar per duel)
export const duelEntries = pgTable(
  'duel_entries',
  {
    id: serial('id').primaryKey(),
    duelId: text('duel_id')
      .notNull()
      .references(() => peerDuels.duelId, { onDelete: 'cascade' }),
    uid: text('uid')
      .notNull()
      .references(() => users.uid, { onDelete: 'cascade' }),
    displayName: text('display_name').notNull(),
    score: integer('score').notNull(),
    total: integer('total').notNull(),
    timeSeconds: integer('time_seconds').notNull(),
    completedAt: timestamp('completed_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('duel_entries_duel_uid_uniq').on(table.duelId, table.uid),
    index('duel_entries_duel_score_idx').on(table.duelId, table.score, table.timeSeconds),
  ]
);

// Publicly opt-in, PII-free National Scholars Leaderboard standings
export const leaderboardEntries = pgTable(
  'leaderboard_entries',
  {
    uid: text('uid')
      .primaryKey()
      .references(() => users.uid, { onDelete: 'cascade' }),
    displayName: text('display_name').notNull(),
    campusGoal: text('campus_goal').notNull().default('National Scholar'),
    primarySubj: text('primary_subj').notNull().default('maths'),
    isPublic: boolean('is_public').notNull().default(true),
    masteryIndex: integer('mastery_index').notNull().default(0),
    topicsPassed: integer('topics_passed').notNull().default(0),
    totalAnswered: integer('total_answered').notNull().default(0),
    accuracyPct: integer('accuracy_pct').notNull().default(0),
    bestCbtScore: integer('best_cbt_score').notNull().default(0),
    streakCount: integer('streak_count').notNull().default(0),
    duelsCompleted: integer('duels_completed').notNull().default(0),
    subjectMastery: jsonb('subject_mastery').$type<Record<string, number>>().notNull().default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('leaderboard_public_mastery_idx').on(table.isPublic, table.masteryIndex)]
);

export const usersRelations = relations(users, ({ one, many }) => ({
  progressSync: one(scholarProgressSync, {
    fields: [users.uid],
    references: [scholarProgressSync.uid],
  }),
  leaderboardEntry: one(leaderboardEntries, {
    fields: [users.uid],
    references: [leaderboardEntries.uid],
  }),
  createdDuels: many(peerDuels),
  duelEntries: many(duelEntries),
}));

export const peerDuelsRelations = relations(peerDuels, ({ one, many }) => ({
  creator: one(users, {
    fields: [peerDuels.creatorUid],
    references: [users.uid],
  }),
  entries: many(duelEntries),
}));

export const duelEntriesRelations = relations(duelEntries, ({ one }) => ({
  duel: one(peerDuels, {
    fields: [duelEntries.duelId],
    references: [peerDuels.duelId],
  }),
  scholar: one(users, {
    fields: [duelEntries.uid],
    references: [users.uid],
  }),
}));
