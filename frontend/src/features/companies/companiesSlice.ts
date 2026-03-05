import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface CompaniesState {
  selectedIds: string[];
  isFormModalOpen: boolean;
  editingCompanyId: string | null;
  isDeleteConfirmOpen: boolean;
}

const initialState: CompaniesState = {
  selectedIds: [],
  isFormModalOpen: false,
  editingCompanyId: null,
  isDeleteConfirmOpen: false,
};

const companiesSlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    toggleSelection(state, action: PayloadAction<string>) {
      const idx = state.selectedIds.indexOf(action.payload);
      if (idx === -1) {
        state.selectedIds.push(action.payload);
      } else {
        state.selectedIds.splice(idx, 1);
      }
    },
    selectAll(state, action: PayloadAction<string[]>) {
      state.selectedIds = action.payload;
    },
    clearSelection(state) {
      state.selectedIds = [];
    },
    openCreateModal(state) {
      state.isFormModalOpen = true;
      state.editingCompanyId = null;
    },
    openEditModal(state, action: PayloadAction<string>) {
      state.isFormModalOpen = true;
      state.editingCompanyId = action.payload;
    },
    closeFormModal(state) {
      state.isFormModalOpen = false;
      state.editingCompanyId = null;
    },
    openDeleteConfirm(state) {
      state.isDeleteConfirmOpen = true;
    },
    closeDeleteConfirm(state) {
      state.isDeleteConfirmOpen = false;
    },
  },
});

export const {
  toggleSelection,
  selectAll,
  clearSelection,
  openCreateModal,
  openEditModal,
  closeFormModal,
  openDeleteConfirm,
  closeDeleteConfirm,
} = companiesSlice.actions;

export default companiesSlice.reducer;
