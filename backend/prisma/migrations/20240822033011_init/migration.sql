-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female');

-- CreateTable
CREATE TABLE "private-messaging-user" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "profilePic" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "conversationIds" TEXT[],

    CONSTRAINT "private-messaging-user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "participantIds" TEXT[],
    "messageIds" TEXT[],

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Private-message-table" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Private-message-table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ConversationToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "private-messaging-user_username_key" ON "private-messaging-user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "_ConversationToUser_AB_unique" ON "_ConversationToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ConversationToUser_B_index" ON "_ConversationToUser"("B");

-- AddForeignKey
ALTER TABLE "Private-message-table" ADD CONSTRAINT "Private-message-table_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Private-message-table" ADD CONSTRAINT "Private-message-table_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "private-messaging-user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConversationToUser" ADD CONSTRAINT "_ConversationToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConversationToUser" ADD CONSTRAINT "_ConversationToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "private-messaging-user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
