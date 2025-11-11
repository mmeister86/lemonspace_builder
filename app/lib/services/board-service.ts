import { databases, DATABASE_ID, BOARDS_COLLECTION_ID, ID } from "../appwrite";
import type {
  Board,
  BoardDocument,
  BoardDocumentData,
} from "@/lib/types/board";
import { Query } from "appwrite";

/**
 * Konvertiert Board zu BoardDocumentData (für AppWrite)
 * Gibt nur die Datenfelder zurück (ohne Document-Metadaten wie $id, $createdAt, etc.)
 */
function boardToDocument(board: Partial<Board>): Partial<BoardDocumentData> {
  return {
    user_id: board.user_id,
    title: board.title,
    slug: board.slug,
    grid_config: JSON.stringify(board.grid_config || { columns: 4, gap: 16 }),
    blocks: JSON.stringify(board.blocks || []),
    template_id: board.template_id,
    is_template: board.is_template,
    password_hash: board.password_hash,
    expires_at: board.expires_at,
    published_at: board.published_at,
  };
}

/**
 * Konvertiert BoardDocument zu Board (von AppWrite)
 */
function documentToBoard(doc: BoardDocument): Board {
  return {
    id: doc.$id,
    user_id: doc.user_id,
    title: doc.title,
    slug: doc.slug,
    grid_config: JSON.parse(doc.grid_config),
    blocks: JSON.parse(doc.blocks),
    template_id: doc.template_id,
    is_template: doc.is_template,
    password_hash: doc.password_hash,
    expires_at: doc.expires_at,
    created_at: doc.$createdAt,
    updated_at: doc.$updatedAt,
    published_at: doc.published_at,
  };
}

/**
 * Erstellt ein neues Board
 */
export async function createBoard(
  userId: string,
  boardData: Partial<Board>
): Promise<Board> {
  const documentId = boardData.id || ID.unique();
  const permissions = [`read("user:${userId}")`, `write("user:${userId}")`];

  const doc = await databases.createDocument<BoardDocument>(
    DATABASE_ID,
    BOARDS_COLLECTION_ID,
    documentId,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    boardToDocument({ ...boardData, user_id: userId }) as any,
    permissions
  );

  return documentToBoard(doc);
}

/**
 * Lädt ein Board anhand der ID
 */
export async function getBoard(boardId: string): Promise<Board> {
  const doc = await databases.getDocument<BoardDocument>(
    DATABASE_ID,
    BOARDS_COLLECTION_ID,
    boardId
  );

  return documentToBoard(doc);
}

/**
 * Aktualisiert ein Board
 */
export async function updateBoard(
  boardId: string,
  boardData: Partial<Board>
): Promise<Board> {
  const doc = await databases.updateDocument<BoardDocument>(
    DATABASE_ID,
    BOARDS_COLLECTION_ID,
    boardId,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    boardToDocument(boardData) as any
  );

  return documentToBoard(doc);
}

/**
 * Löscht ein Board
 */
export async function deleteBoard(boardId: string): Promise<void> {
  await databases.deleteDocument(DATABASE_ID, BOARDS_COLLECTION_ID, boardId);
}

/**
 * Lädt alle Boards eines Users
 */
export async function listBoards(userId: string): Promise<Board[]> {
  const response = await databases.listDocuments<BoardDocument>(
    DATABASE_ID,
    BOARDS_COLLECTION_ID,
    [Query.equal("user_id", userId)]
  );

  return response.documents.map(documentToBoard);
}
