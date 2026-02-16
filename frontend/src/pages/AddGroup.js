import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import { groupApi } from '../services/api';

const AddGroup = () => {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    if (!groupName.trim()) {
      setError('Group name is required.');
      return false;
    }
    if (groupName.trim().length > 255) {
      setError('Group name must not exceed 255 characters.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setSubmitting(true);
      await groupApi.createGroup({ groupName: groupName.trim() });
      toast.success(`Group "${groupName.trim()}" created successfully!`);
      navigate('/'); // Redirect to dashboard after adding
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || 'Failed to create group. Please try again.';
      toast.error(errorMsg);
      if (error.response?.status === 409) {
        setError(`Group with name "${groupName.trim()}" already exists.`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Add New Group</h1>
        <Link to="/" className="btn btn-secondary">
          <FiArrowLeft /> Back to Dashboard
        </Link>
      </div>

      <div className="card" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="groupName">Group Name *</label>
            <input
              type="text"
              id="groupName"
              placeholder="Enter group name (e.g., Persian Darbar)"
              value={groupName}
              onChange={(e) => {
                setGroupName(e.target.value);
                if (error) setError('');
              }}
              className={error ? 'error' : ''}
              autoFocus
              disabled={submitting}
            />
            {error && <div className="error-message">{error}</div>}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-success"
              disabled={submitting}
            >
              <FiSave />
              {submitting ? 'Saving...' : 'Save Group'}
            </button>
            <Link to="/" className="btn btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGroup;
