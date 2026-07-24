/**
 * Generic CRUD page used by every module.
 * Handles list view + add/edit modal matching original InfixEdu style.
 */
import React, { useState, useEffect } from 'react';
import { PageHeader, WhiteCard, DataTable, Badge, ActionBtn, FormGroup, Alert } from './UI';
import api from '../utils/api';

export default function GenericCrudPage({
  title, breadcrumbs = [], apiPath,
  columns, formFields, defaultData = {},
  addLabel = 'Add New', searchPlaceholder = 'Search...',
  mockData = [],
}) {
  const [data, setData]       = useState(mockData);
  const [search, setSearch]   = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]  = useState(null);
  const [form, setForm]        = useState(defaultData);
  const [alert, setAlert]      = useState(null);
  const [loading, setLoading]  = useState(false);

  useEffect(() => {
    if (apiPath) {
      api.get(apiPath).then(r => setData(r.data?.data || r.data || [])).catch(() => {});
    }
  }, [apiPath]);

  const filtered = data.filter(row =>
    Object.values(row).some(v => String(v).toLowerCase().includes(search.toLowerCase()))
  );

  const openAdd  = () => { setEditing(null); setForm(defaultData); setShowForm(true); };
  const openEdit = (row) => { setEditing(row); setForm({ ...row }); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditing(null); };

  const handleDelete = (row) => {
    if (!window.confirm(`Delete this record?`)) return;
    if (apiPath) {
      setLoading(true);
      api.delete(`${apiPath}/${row.id}`)
        .then(() => {
          setData(prev => prev.filter(r => r.id !== row.id));
          setAlert({ type: 'success', msg: 'Record deleted successfully.' });
          setTimeout(() => setAlert(null), 3000);
        })
        .catch((err) => {
          console.error("Delete failed:", err);
          setAlert({ type: 'danger', msg: 'Failed to delete record. Please check database connectivity.' });
          setTimeout(() => setAlert(null), 5000);
        })
        .finally(() => setLoading(false));
    } else {
      setData(prev => prev.filter(r => r.id !== row.id));
      setAlert({ type: 'success', msg: 'Record deleted successfully.' });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (apiPath) {
      const apiCall = editing
        ? api.put(`${apiPath}/${editing.id}`, form)
        : api.post(apiPath, form);

      apiCall
        .then((r) => {
          const responseData = r.data?.data || r.data || {};
          const newRecord = { ...form, ...responseData };
          if (editing) {
            setData(prev => prev.map(r => r.id === editing.id ? newRecord : r));
          } else {
            setData(prev => [newRecord, ...prev]);
          }
          setAlert({ type: 'success', msg: `Record ${editing ? 'updated' : 'created'} successfully.` });
          setTimeout(() => setAlert(null), 3000);
          closeForm();
        })
        .catch((err) => {
          console.error("Save failed:", err);
          setAlert({ type: 'danger', msg: `Failed to save record. Check connection.` });
          setTimeout(() => setAlert(null), 5000);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      const newRecord = { ...form, id: editing?.id || Date.now() };
      if (editing) {
        setData(prev => prev.map(r => r.id === editing.id ? newRecord : r));
      } else {
        setData(prev => [newRecord, ...prev]);
      }
      setAlert({ type: 'success', msg: `Record ${editing ? 'updated' : 'created'} successfully.` });
      setTimeout(() => setAlert(null), 3000);
      setLoading(false);
      closeForm();
    }
  };

  // Build full columns with edit/delete actions
  const allCols = [
    { label: '#', render: (r, i) => i + 1 },
    ...columns,
    {
      label: 'Action',
      render: (row) => (
        <>
          <ActionBtn type="view"   icon="ti-eye"    title="View"   onClick={() => {}} />
          <ActionBtn type="edit"   icon="ti-pencil" title="Edit"   onClick={() => openEdit(row)} />
          <ActionBtn type="delete" icon="ti-trash"  title="Delete" onClick={() => handleDelete(row)} />
        </>
      )
    },
  ];

  return (
    <>
      <PageHeader
        title={title}
        breadcrumbs={breadcrumbs}
        actions={
          <button className="primary_btn" onClick={openAdd}>
            <span className="ti-plus" style={{ marginRight: 6 }} />{addLabel}
          </button>
        }
      />

      <WhiteCard bodyPadding={false}>
        {/* Toolbar */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <span className="ti-search" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#aaa', fontSize: 13 }} />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '8px 12px 8px 34px', border: '1px solid #ddd', borderRadius: 4, fontFamily: 'inherit', fontSize: 13 }}
            />
          </div>
          <button className="btn-secondary-outline" onClick={() => setSearch('')}><span className="ti-reload" /> Reset</button>
        </div>

        {/* Alert */}
        {alert && (
          <div style={{ padding: '0 24px 0' }}>
            <Alert type={alert.type} msg={alert.msg} onClose={() => setAlert(null)} />
          </div>
        )}

        {/* Table */}
        <div style={{ padding: '0 24px 24px' }}>
          <DataTable columns={allCols} data={filtered} />
          <div className="pagination-wrap">
            <span>Showing {Math.min(filtered.length, 10)} of {filtered.length} entries</span>
            <div className="pagination">
              <button className="page-btn active">1</button>
              <button className="page-btn">2</button>
              <button className="page-btn">›</button>
            </div>
          </div>
        </div>
      </WhiteCard>

      {/* Add/Edit Modal */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, padding: 20
        }}>
          <div style={{ background: '#fff', borderRadius: 8, width: '100%', maxWidth: 600, maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ fontWeight: 700, fontSize: 16 }}>{editing ? `Edit ${title}` : `Add ${title}`}</h4>
              <button onClick={closeForm} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#aaa' }}>×</button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: 24 }}>
              <div className="row">
                {formFields.map(f => (
                  <div key={f.key} className={f.fullWidth ? 'col-12' : 'col-6'}>
                    <FormGroup label={f.label} required={f.required}>
                      {f.type === 'select' ? (
                        <select
                          className="form-control"
                          value={form[f.key] || ''}
                          onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                          required={f.required}
                        >
                          <option value="">-- Select {f.label} --</option>
                          {f.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      ) : f.type === 'textarea' ? (
                        <textarea
                          className="form-control"
                          rows={3}
                          value={form[f.key] || ''}
                          onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                          placeholder={f.placeholder}
                        />
                      ) : (
                        <input
                          type={f.type || 'text'}
                          className="form-control"
                          value={form[f.key] || ''}
                          onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                          placeholder={f.placeholder}
                          required={f.required}
                        />
                      )}
                    </FormGroup>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" className="btn-secondary-outline" onClick={closeForm}>Cancel</button>
                <button type="submit" className="primary_btn" disabled={loading}>
                  {loading ? 'Saving...' : (editing ? 'Update' : 'Save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
