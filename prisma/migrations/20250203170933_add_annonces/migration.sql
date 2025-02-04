-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Annonce" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "userName" TEXT NOT NULL,
    "niveau" TEXT NOT NULL,
    "dispo" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Annonce_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Annonce" ("createdAt", "dispo", "id", "message", "niveau", "userId", "userName") SELECT "createdAt", "dispo", "id", "message", "niveau", "userId", "userName" FROM "Annonce";
DROP TABLE "Annonce";
ALTER TABLE "new_Annonce" RENAME TO "Annonce";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
