# Migration `20200830111101-change-to-many-to-many-relationship`

This migration has been generated by sebastianrcnt at 8/30/2020, 8:11:01 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
PRAGMA foreign_keys=OFF;

DROP INDEX "Experiment_id_uindex"

DROP INDEX "User_email_uindex"

DROP INDEX "Result_id_uindex"

DROP INDEX "Project_id_uindex"

CREATE TABLE "_ExperimentToProject" (
"A" TEXT NOT NULL,
"B" TEXT NOT NULL,
FOREIGN KEY ("A") REFERENCES "Experiment"("id") ON DELETE CASCADE ON UPDATE CASCADE,

FOREIGN KEY ("B") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE
)

CREATE UNIQUE INDEX "_ExperimentToProject_AB_unique" ON "_ExperimentToProject"("A","B")

CREATE  INDEX "_ExperimentToProject_B_index" ON "_ExperimentToProject"("B")

PRAGMA foreign_keys=off;
DROP TABLE "ExperimentToProject";;
PRAGMA foreign_keys=on

CREATE TABLE "new_Result" (
"experimentId" TEXT ,
"projectId" TEXT ,
"json" TEXT  DEFAULT '{}',
"timestamp" TEXT ,
"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
"done" INTEGER NOT NULL DEFAULT 0,
FOREIGN KEY ("experimentId") REFERENCES "Experiment"("id") ON DELETE SET NULL ON UPDATE CASCADE,

FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE
)

INSERT INTO "new_Result" ("experimentId", "projectId", "json", "timestamp", "id", "done") SELECT "experimentId", "projectId", "json", "timestamp", "id", "done" FROM "Result"

PRAGMA foreign_keys=off;
DROP TABLE "Result";;
PRAGMA foreign_keys=on

ALTER TABLE "new_Result" RENAME TO "Result";

CREATE UNIQUE INDEX "Result.json_unique" ON "Result"("json")

PRAGMA foreign_key_check;

PRAGMA foreign_keys=ON;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20200830111101-change-to-many-to-many-relationship
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,53 @@
+generator client {
+  provider = "prisma-client-js"
+}
+
+datasource db {
+  provider = "sqlite"
+  url = "***"
+}
+
+model Experiment {
+  id          String    @default("unset") @id
+  userEmail   String?
+  name        String    @default("unset")
+  description String?
+  fileId      String    @default("unset")
+  fileName    String?
+  User        User?     @relation(fields: [userEmail], references: [email])
+  Result      Result[]
+  Projects    Project[]
+}
+
+model User {
+  email      String       @default("unset@monet.com") @id
+  name       String       @default("unset")
+  phone      String?
+  password   String?      @default("unset")
+  level      Int          @default(0)
+  Experiment Experiment[]
+  Project    Project[]
+}
+
+model Result {
+  experimentId String?
+  projectId    String?
+  json         String?     @default("{}") @unique
+  timestamp    String?
+  id           Int         @default(autoincrement()) @id
+  done         Int         @default(0)
+  Experiment   Experiment? @relation(fields: [experimentId], references: [id])
+  Project      Project?    @relation(fields: [projectId], references: [id])
+}
+
+model Project {
+  id          String       @default("unset") @id
+  description String?
+  agreement   String?
+  public      Int          @default(0)
+  userEmail   String?
+  name        String?
+  User        User?        @relation(fields: [userEmail], references: [email])
+  Result      Result[]
+  Experiments Experiment[]
+}
```

