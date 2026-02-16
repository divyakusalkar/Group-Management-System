import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import { groupApi } from '../services/api';

const EditGroup = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState('');
  const [originalName, setOriginalName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await groupApi.getGroupById(id);
        const group = response.data.data;
        setGroupName(group.groupName);
        setOriginalName(group.groupName);
      } catch (error) {
        toast.error('Failed to load group details.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [id, navigate]);

  const validate = () => {
    if (!groupName.trim()) {
      setError('Group name is required.');
      return false;
    }
    if (groupName.trim().length > 255) {
      setError('Group name must not exceed 255 characters.');
      return false;
    }
    if (groupName.trim() === originalName) {
      setError('Please enter a different group name to update.');
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
      await groupApi.updateGroup(id, { groupName: groupName.trim() });
      toast.success(`Group updated to "${groupName.trim()}" successfully!`);
      navigate('/'); // Redirect to dashboard after updating
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || 'Failed to update group. Please try again.';
      toast.error(errorMsg);
      if (error.response?.status === 409) {
        setError(`Group with name "${groupName.trim()}" already exists.`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>Update Group Name</h1>
        <Link to="/" className="btn btn-secondary">
          <FiArrowLeft /> Back to Dashboard
        </Link>
      </div>

      <div className="card" style={{ maxWidth: '600px' }}>
        <div
          style={{
            background: '#f0f4ff',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            color: '#4338ca',
          }}
        >
          Editing group: <strong>{originalName}</strong>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="groupName">New Group Name *</label>
            <input
              type="text"
              id="groupName"
              placeholder="Enter new group name"
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
              {submitting ? 'Updating...' : 'Update Group'}
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

export default EditGroup;
