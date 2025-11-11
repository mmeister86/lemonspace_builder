import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createBoard,
  getBoard,
  updateBoard,
  deleteBoard,
  listBoards,
} from "../services/board-service";
import type { Board } from "@/lib/types/board";

/**
 * Lädt ein einzelnes Board
 */
export function useBoard(boardId: string | null) {
  return useQuery({
    queryKey: ["board", boardId],
    queryFn: () => getBoard(boardId!),
    enabled: !!boardId,
  });
}

/**
 * Lädt alle Boards eines Users
 */
export function useBoards(userId: string | null) {
  return useQuery({
    queryKey: ["boards", userId],
    queryFn: () => listBoards(userId!),
    enabled: !!userId,
  });
}

/**
 * Mutation für Board-Erstellung
 */
export function useCreateBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      boardData,
    }: {
      userId: string;
      boardData: Partial<Board>;
    }) => createBoard(userId, boardData),
    onSuccess: (data) => {
      // Invalidate boards list
      queryClient.invalidateQueries({ queryKey: ["boards", data.user_id] });
      // Set new board in cache
      queryClient.setQueryData(["board", data.id], data);
    },
  });
}

/**
 * Mutation für Board-Update
 */
export function useUpdateBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      boardId,
      boardData,
    }: {
      boardId: string;
      boardData: Partial<Board>;
    }) => updateBoard(boardId, boardData),
    onSuccess: (data) => {
      // Update board in cache
      queryClient.setQueryData(["board", data.id], data);
      // Invalidate boards list
      queryClient.invalidateQueries({ queryKey: ["boards", data.user_id] });
    },
  });
}

/**
 * Mutation für Board-Löschung
 */
export function useDeleteBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (boardId: string) => deleteBoard(boardId),
    onSuccess: (_, boardId) => {
      // Remove board from cache
      queryClient.removeQueries({ queryKey: ["board", boardId] });
      // Invalidate boards list (we need userId, but we can invalidate all)
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });
}
