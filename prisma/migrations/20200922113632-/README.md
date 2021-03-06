# Migration `20200922113632-`

This migration has been generated by Sebastian Jeong at 9/22/2020, 8:36:32 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "Experiment" (
    "id" TEXT NOT NULL DEFAULT 'unset',
    "userEmail" TEXT,
    "name" TEXT NOT NULL DEFAULT 'unset',
    "description" TEXT,
    "fileId" TEXT NOT NULL DEFAULT 'unset',
    "fileName" TEXT,
    "json" TEXT DEFAULT '{}',
    "tags" TEXT,
    "coverFileId" TEXT,

    FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE SET NULL ON UPDATE CASCADE,
PRIMARY KEY ("id")
)

CREATE TABLE "User" (
    "email" TEXT NOT NULL DEFAULT 'unset@monet.com',
    "name" TEXT NOT NULL DEFAULT 'unset',
    "phone" TEXT,
    "password" TEXT DEFAULT 'unset',
    "level" INTEGER NOT NULL DEFAULT 0,
PRIMARY KEY ("email")
)

CREATE TABLE "Project" (
    "id" TEXT NOT NULL DEFAULT 'unset',
    "description" TEXT,
    "agreement" TEXT,
    "public" INTEGER NOT NULL DEFAULT 0,
    "userEmail" TEXT,
    "name" TEXT,
    "coverFileId" TEXT,

    FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE SET NULL ON UPDATE CASCADE,
PRIMARY KEY ("id")
)

CREATE TABLE "Result" (
    "experimentId" TEXT,
    "projectId" TEXT,
    "timestamp" TEXT,
    "id" TEXT NOT NULL DEFAULT 'unset',
    "done" INTEGER NOT NULL DEFAULT 0,
    "userEmail" TEXT,
    "json" TEXT DEFAULT '{}',

    FOREIGN KEY ("experimentId") REFERENCES "Experiment"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE SET NULL ON UPDATE CASCADE,
PRIMARY KEY ("id")
)

CREATE TABLE "_ExperimentToProject" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    FOREIGN KEY ("A") REFERENCES "Experiment"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE
)

CREATE UNIQUE INDEX "_ExperimentToProject_AB_unique" ON "_ExperimentToProject"("A", "B")

CREATE INDEX "_ExperimentToProject_B_index" ON "_ExperimentToProject"("B")
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200910055634-add-coverfile-id-to-experiment..20200922113632-
--- datamodel.dml
+++ datamodel.dml
@@ -2,10 +2,11 @@
   provider = "prisma-client-js"
 }
 datasource db {
-  provider = "postgresql"
-  url = "***"
+  provider        = "sqlite"
+  url = "***"
+  connectionLimit = 2
 }
 model Experiment {
   id          String    @default("unset") @id
```


