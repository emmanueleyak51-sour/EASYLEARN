# Road to Campus — Firestore & Platform Security Specification (Phase 0 TDD)

## 1. Data & Platform Invariants
1. **Strict Owner Isolation (`/users/{userId}` and `/users/{userId}/sync/main`)**: Only an authenticated, email-verified user whose `request.auth.uid == userId` may write their profile or canonical `main` cloud sync document. No `list` queries on `/users` or `/users/{userId}/sync` are permitted.
2. **Canonical Sync Lock & Master Gate**: Only `docId == 'main'` is allowed under `/users/{userId}/sync/{docId}`, creating `/sync/main` requires the parent `/users/{userId}` document to exist (`exists(...)`), and `progress` top-level keys are strictly allowlisted (`hasOnly` exact 20 progress keys) to prevent shadow-field or storage-exhaustion abuse.
3. **No PII Leakage**: User emails, phone numbers, and tokens are never stored in `/duels`, `/duels/{duelId}/entries`, or `/leaderboard`. Public documents expose only display names and academic metrics.
4. **Referential & Score Integrity on Duels**: A `/duels/{duelId}/entries/{entryId}` submission requires parent `/duels/{duelId}` to exist (`exists(...)`), `entryId == request.auth.uid`, and `incoming().total == get(/databases/$(database)/documents/duels/$(duelId)).data.questionCount` so scholars cannot inflate question totals or submit multiple scores.
5. **Strict Enum, Regex & Size Bounds**: Every subject field (`activeSubj`, `subject`, `primarySubj`) must belong to the exact 12-subject allowlist (`isValidSubject`). `examDate` enforces strict `YYYY-MM-DD` ISO pattern. All IDs and duel seeds match `^[a-zA-Z0-9_\-]+$` and every string enforces `.size()` limits.
6. **Server Timestamp Integrity & Immortal Fields**: All `createdAt`, `updatedAt`, and `completedAt` fields must equal `request.time`. `createdAt`, `uid`, `creatorUid`, and `duelId` are immutable after creation.
7. **Terminal Immutability**: Duel definitions (`/duels/{duelId}`) and submitted duel entries (`/duels/{duelId}/entries/{entryId}`) cannot be updated after creation.
8. **Public Competition Split Collection (`/leaderboard/{userId}`)**: PII-free, owner-only writes with email verification, action-partitioned updates (Profile/Privacy Toggle vs Academic Standing Sync), `list` strictly gated by `resource.data.isPublic == true`, bounded 12-subject `subjectMastery` map (`size() <= 12`), and server-enforced academic score ceilings (`masteryIndex <= 1000`, `accuracyPct <= 100`, `bestCbtScore <= 400`).

## 2. The "Dirty Dozen" Adversarial Payloads (Must All Be Rejected)
1. **Unauthenticated Profile Read**: `GET /users/userA` with `auth == null` -> `PERMISSION_DENIED`.
2. **Cross-User Profile Read**: `GET /users/userA` as `userB` -> `PERMISSION_DENIED`.
3. **Cross-User / Junk-ID Sync Write**: `SET /users/userA/sync/main` as `userB` or `SET /users/userA/sync/junkDoc` as `userA` -> `PERMISSION_DENIED`.
4. **Shadow Ghost Field Injection**: `CREATE /users/userA`, `CREATE /users/userA/sync/main` (including shadow keys inside `progress`), or `CREATE /leaderboard/userA` with `isAdmin: true` -> `PERMISSION_DENIED`.
5. **Identity Spoofing**: `CREATE /users/userA` or `CREATE /leaderboard/userA` as `userA` with `uid: "userB"` -> `PERMISSION_DENIED`.
6. **Unverified Email Write**: `CREATE /users/userA` or `CREATE /leaderboard/userA` with `email_verified: false` -> `PERMISSION_DENIED`.
7. **Client-Forged Timestamp**: `CREATE /leaderboard/userA` with `createdAt: "2020-01-01"` instead of `request.time` -> `PERMISSION_DENIED`.
8. **Immutable Field Tampering**: `UPDATE /leaderboard/userA` or `/users/userA/sync/main` changing `createdAt` or `uid` -> `PERMISSION_DENIED`.
9. **Resource Poisoning / Invalid Subject / Bad Date**: `CREATE /duels/<200-char-id>`, `activeSubj: "hacking"`, or `examDate: "<script>"` -> `PERMISSION_DENIED`.
10. **Oversized Display Name / Campus Goal**: `CREATE /leaderboard/userA` with `campusGoal` length 200 or `displayName` length 500 -> `PERMISSION_DENIED`.
11. **Orphaned Duel Entry / Duel Total Spoofing / Private Leaderboard Scraping**: `CREATE /duels/nonexistent/entries/userA`, `CREATE /duels/duel10/entries/userA` with `total: 20` on a 10-question duel, or `LIST /leaderboard` without `isPublic == true` -> `PERMISSION_DENIED`.
12. **Score Tampering / Out-of-Bounds Leaderboard Inflation**: `UPDATE /duels/duel_1/entries/userA`, `CREATE /leaderboard/userA` with `masteryIndex: 9999` or `bestCbtScore: 999` -> `PERMISSION_DENIED`.
