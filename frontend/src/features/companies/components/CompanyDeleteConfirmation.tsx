import { type FC, useCallback } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useDeleteCompanyMutation, useBulkDeleteCompaniesMutation } from '../companiesApi';
import { closeDeleteConfirm, clearSelection } from '../companiesSlice';

const CompanyDeleteConfirmation: FC = () => {
  const dispatch = useAppDispatch();
  const { selectedIds } = useAppSelector((state) => state.companies);
  const isBulk = selectedIds.length > 1;

  const [deleteCompany, { isLoading: isDeletingSingle }] = useDeleteCompanyMutation();
  const [bulkDelete, { isLoading: isBulkDeleting }] = useBulkDeleteCompaniesMutation();
  const isDeleting = isDeletingSingle || isBulkDeleting;

  const handleClose = useCallback(() => {
    dispatch(closeDeleteConfirm());
  }, [dispatch]);

  const handleConfirm = useCallback(async () => {
    try {
      if (isBulk) {
        await bulkDelete(selectedIds).unwrap();
      } else if (selectedIds.length === 1) {
        await deleteCompany(selectedIds[0]).unwrap();
      }
      dispatch(clearSelection());
      dispatch(closeDeleteConfirm());
    } catch {
      // Error handling via RTK Query error state
    }
  }, [selectedIds, isBulk, deleteCompany, bulkDelete, dispatch]);

  return (
    <Modal show onHide={handleClose} centered data-testid="delete-confirm-modal">
      <Modal.Header closeButton>
        <Modal.Title>Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isBulk ? (
          <p>
            Are you sure you want to delete <strong>{selectedIds.length}</strong> selected
            companies? This action cannot be undone.
          </p>
        ) : (
          <p>Are you sure you want to delete this company? This action cannot be undone.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleClose} data-testid="cancel-delete-btn">
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={handleConfirm}
          disabled={isDeleting}
          data-testid="confirm-delete-btn"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CompanyDeleteConfirmation;
