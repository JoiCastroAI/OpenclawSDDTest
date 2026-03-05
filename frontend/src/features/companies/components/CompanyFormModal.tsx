import { type FC, useCallback, useEffect, useState } from 'react';
import { Alert, Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  useCreateCompanyMutation,
  useGetCompanyQuery,
  useUpdateCompanyMutation,
} from '../companiesApi';
import { closeFormModal } from '../companiesSlice';
import type { CompanyCreate } from '../types';

interface FormData {
  name: string;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  revenue: string;
  expenses: string;
  employees: string;
  clients: string;
}

const EMPTY_FORM: FormData = {
  name: '',
  street: '',
  city: '',
  state: '',
  zip_code: '',
  country: '',
  revenue: '0',
  expenses: '0',
  employees: '0',
  clients: '0',
};

const CompanyFormModal: FC = () => {
  const dispatch = useAppDispatch();
  const { editingCompanyId } = useAppSelector((state) => state.companies);
  const isEdit = editingCompanyId !== null;

  const { data: existingCompany } = useGetCompanyQuery(editingCompanyId!, {
    skip: !isEdit,
  });

  const [createCompany, { isLoading: isCreating }] = useCreateCompanyMutation();
  const [updateCompany, { isLoading: isUpdating }] = useUpdateCompanyMutation();
  const isSubmitting = isCreating || isUpdating;

  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [validated, setValidated] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && existingCompany) {
      setFormData({
        name: existingCompany.name,
        street: existingCompany.street ?? '',
        city: existingCompany.city ?? '',
        state: existingCompany.state ?? '',
        zip_code: existingCompany.zipCode ?? '',
        country: existingCompany.country ?? '',
        revenue: String(existingCompany.revenue),
        expenses: String(existingCompany.expenses),
        employees: String(existingCompany.employees),
        clients: String(existingCompany.clients),
      });
    }
  }, [isEdit, existingCompany]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setServerError(null);
  }, []);

  const handleClose = useCallback(() => {
    dispatch(closeFormModal());
  }, [dispatch]);

  const profit = Number(formData.revenue) - Number(formData.expenses);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setValidated(true);

      const form = e.currentTarget;
      if (!form.checkValidity()) return;

      const payload: CompanyCreate = {
        name: formData.name,
        street: formData.street || null,
        city: formData.city || null,
        state: formData.state || null,
        zip_code: formData.zip_code || null,
        country: formData.country || null,
        revenue: Number(formData.revenue),
        expenses: Number(formData.expenses),
        employees: Number(formData.employees),
        clients: Number(formData.clients),
      };

      try {
        if (isEdit && editingCompanyId) {
          await updateCompany({ id: editingCompanyId, data: payload }).unwrap();
        } else {
          await createCompany(payload).unwrap();
        }
        handleClose();
      } catch (err: unknown) {
        const error = err as { status?: number };
        if (error?.status === 409) {
          setServerError('A company with this name already exists.');
        } else {
          setServerError('An unexpected error occurred. Please try again.');
        }
      }
    },
    [formData, isEdit, editingCompanyId, createCompany, updateCompany, handleClose],
  );

  return (
    <Modal show onHide={handleClose} size="lg" data-testid="company-form-modal">
      <Modal.Header closeButton>
        <Modal.Title>{isEdit ? 'Edit Company' : 'New Company'}</Modal.Title>
      </Modal.Header>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Body>
          {serverError && (
            <Alert variant="danger" data-testid="server-error">
              {serverError}
            </Alert>
          )}

          <h6 className="fw-medium mb-3">Basic Information</h6>
          <Form.Group className="mb-3">
            <Form.Label>
              Company Name <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. TechVision Solutions"
              required
              maxLength={255}
              data-testid="input-name"
            />
            <Form.Control.Feedback type="invalid">Name is required.</Form.Control.Feedback>
          </Form.Group>

          <h6 className="fw-medium mb-3">Address</h6>
          <Form.Group className="mb-3">
            <Form.Label>Street</Form.Label>
            <Form.Control
              name="street"
              value={formData.street}
              onChange={handleChange}
              placeholder="e.g. 123 Main Street"
            />
          </Form.Group>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>City</Form.Label>
                <Form.Control
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. San Francisco"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>State</Form.Label>
                <Form.Control
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="e.g. CA"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>ZIP Code</Form.Label>
                <Form.Control
                  name="zip_code"
                  value={formData.zip_code}
                  onChange={handleChange}
                  placeholder="e.g. 94102"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Country</Form.Label>
                <Form.Control
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="e.g. USA"
                />
              </Form.Group>
            </Col>
          </Row>

          <h6 className="fw-medium mb-3">Financial Data</h6>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Revenue ($)</Form.Label>
                <Form.Control
                  name="revenue"
                  type="number"
                  min={0}
                  value={formData.revenue}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Expenses ($)</Form.Label>
                <Form.Control
                  name="expenses"
                  type="number"
                  min={0}
                  value={formData.expenses}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <div className="bg-light rounded p-3 mb-3 d-flex justify-content-between">
            <span className="text-muted">Calculated profit:</span>
            <span className="text-success">
              ${(profit / 1_000_000).toFixed(2)}M
            </span>
          </div>

          <h6 className="fw-medium mb-3">Other Data</h6>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Number of Employees</Form.Label>
                <Form.Control
                  name="employees"
                  type="number"
                  min={0}
                  value={formData.employees}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Number of Clients</Form.Label>
                <Form.Control
                  name="clients"
                  type="number"
                  min={0}
                  value={formData.clients}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="success"
            type="submit"
            disabled={isSubmitting}
            data-testid="submit-btn"
          >
            {isSubmitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Company'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CompanyFormModal;
