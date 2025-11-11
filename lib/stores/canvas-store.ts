import { create } from "zustand";
import type { Board, Block } from "@/lib/types/board";

interface CanvasState {
  currentBoard: Board | null;
  blocks: Block[];
  selectedBlockId: string | null;
  showDropArea: boolean;

  // Actions
  setCurrentBoard: (board: Board | null) => void;
  addBlock: (block: Block) => void;
  removeBlock: (blockId: string) => void;
  updateBlock: (blockId: string, updates: Partial<Block>) => void;
  selectBlock: (blockId: string | null) => void;
  setShowDropArea: (show: boolean) => void;
  reset: () => void;
}

const initialState = {
  currentBoard: null,
  blocks: [],
  selectedBlockId: null,
  showDropArea: true,
};

export const useCanvasStore = create<CanvasState>((set) => ({
  ...initialState,

  setCurrentBoard: (board) =>
    set({
      currentBoard: board,
      blocks: board?.blocks || [],
      showDropArea: true, // Immer verfügbar
    }),

  addBlock: (block) =>
    set((state) => {
      const newBlocks = [...state.blocks, block];
      return {
        blocks: newBlocks,
        showDropArea: true, // Immer verfügbar
      };
    }),

  removeBlock: (blockId) =>
    set((state) => {
      const newBlocks = state.blocks.filter((b) => b.id !== blockId);
      return {
        blocks: newBlocks,
        selectedBlockId:
          state.selectedBlockId === blockId ? null : state.selectedBlockId,
        showDropArea: true, // Immer verfügbar
      };
    }),

  updateBlock: (blockId, updates) =>
    set((state) => ({
      blocks: state.blocks.map((b) =>
        b.id === blockId ? { ...b, ...updates } : b
      ),
    })),

  selectBlock: (blockId) => set({ selectedBlockId: blockId }),

  setShowDropArea: (show) => set({ showDropArea: show }),

  reset: () => set(initialState),
}));
