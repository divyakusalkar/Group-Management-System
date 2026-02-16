import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiToggleLeft,
  FiToggleRight,
  FiSearch,
  FiInbox,
} from 'react-icons/fi';
import { groupApi } from '../services/api';
import ConfirmModal from '../components/ConfirmModal';

const Dashboard = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    groupId: null,
    groupName: '',
  });

  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);
      const response = await groupApi.getAllGroups();
      setGroups(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch groups. Please try again.');
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const handleDelete = (groupId, groupName) => {
    setDeleteModal({ isOpen: true, groupId, groupName });
  };

  const confirmDelete = async () => {
    try {
      await groupApi.deleteGroup(deleteModal.groupId);
      toast.success(`Group "${deleteModal.groupName}" has been deactivated successfully.`);
      setDeleteModal({ isOpen: false, groupId: null, groupName: '' });
      fetchGroups();
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || 'Failed to delete group. Please try again.';
      toast.error(errorMsg);
    }
  };

  const handleToggleStatus = async (groupId, groupName, currentStatus) => {
    try {
      await groupApi.toggleGroupStatus(groupId);
      const action = currentStatus ? 'deactivated' : 'activated';
      toast.success(`Group "${groupName}" has been ${action} successfully.`);
      fetchGroups();
    } catch (error) {
      toast.error('Failed to update group status. Please try again.');
    }
  };

  const filteredGroups = groups.filter((group) =>
    group.groupName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <h1>Group Management Dashboard</h1>
        <Link to="/add-group" className="btn btn-primary">
          <FiPlus /> Add New Group
        </Link>
      </div>

      {/* Search Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.5rem' }}>
        <div style={{ position: 'relative' }}>
          <FiSearch
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af',
              fontSize: '1.125rem',
            }}
          />
          <input
            type="text"
            placeholder="Search groups by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 2.5rem',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '0.9375rem',
              outline: 'none',
              fontFamily: 'inherit',
              transition: 'border-color 0.2s ease',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#667eea')}
            onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
          />
        </div>
      </div>

      {/* Groups Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <FiInbox />
            </div>
            <h3>
              {searchTerm ? 'No groups match your search' : 'No groups found'}
            </h3>
            <p>
              {searchTerm
                ? 'Try a different search term.'
                : 'Get started by adding your first group.'}
            </p>
            {!searchTerm && (
              <Link
                to="/add-group"
                className="btn btn-primary"
                style={{ marginTop: '1rem' }}
              >
                <FiPlus /> Add Group
              </Link>
            )}
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Group ID</th>
                  <th>Group Name</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGroups.map((group, index) => (
                  <tr key={group.groupId}>
                    <td>{index + 1}</td>
                    <td>
                      <strong>{group.groupId}</strong>
                    </td>
                    <td>{group.groupName}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          group.isActive ? 'active' : 'inactive'
                        }`}
                      >
                        <span className="status-dot"></span>
                        {group.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{formatDate(group.createdAt)}</td>
                    <td>{formatDate(group.updatedAt)}</td>
                    <td>
                      <div className="actions-cell">
                        <Link
                          to={`/edit-group/${group.groupId}`}
                          className="btn btn-icon btn-primary"
                          title="Edit Group"
                        >
                          <FiEdit2 />
                        </Link>
                        <button
                          className={`btn btn-icon ${
                            group.isActive ? 'btn-warning' : 'btn-success'
                          }`}
                          onClick={() =>
                            handleToggleStatus(
                              group.groupId,
                              group.groupName,
                              group.isActive
                            )
                          }
                          title={
                            group.isActive
                              ? 'Deactivate Group'
                              : 'Activate Group'
                          }
                        >
                          {group.isActive ? <FiToggleRight /> : <FiToggleLeft />}
                        </button>
                        {group.isActive && (
                          <button
                            className="btn btn-icon btn-danger"
                            onClick={() =>
                              handleDelete(group.groupId, group.groupName)
                            }
                            title="Delete Group"
                          >
                            <FiTrash2 />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stats Bar */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          marginTop: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        <div
          className="card"
          style={{
            flex: 1,
            minWidth: '180px',
            textAlign: 'center',
            padding: '1.25rem',
          }}
        >
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#667eea' }}>
            {groups.length}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Groups</div>
        </div>
        <div
          className="card"
          style={{
            flex: 1,
            minWidth: '180px',
            textAlign: 'center',
            padding: '1.25rem',
          }}
        >
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#22c55e' }}>
            {groups.filter((g) => g.isActive).length}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Active Groups</div>
        </div>
        <div
          className="card"
          style={{
            flex: 1,
            minWidth: '180px',
            textAlign: 'center',
            padding: '1.25rem',
          }}
        >
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ef4444' }}>
            {groups.filter((g) => !g.isActive).length}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Inactive Groups
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Group"
        message={`Are you sure you want to deactivate the group "${deleteModal.groupName}"? This will set the group as inactive.`}
        onConfirm={confirmDelete}
        onCancel={() =>
          setDeleteModal({ isOpen: false, groupId: null, groupName: '' })
        }
      />
    </div>
  );
};

export default Dashboard;
