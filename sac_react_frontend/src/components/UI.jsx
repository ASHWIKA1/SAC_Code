import React from 'react';
import { useNavigate } from 'react-router-dom';

/** Breadcrumb + Page Title bar matching original InfixEdu layout */
export function PageHeader({ title, breadcrumbs = [], actions }) {
  return (
    <div className="breadcrumb-area">
      <div>
        <h4>{title}</h4>
        <nav className="breadcrumb">
          <a onClick={() => {}} style={{ cursor: 'pointer' }}>Home</a>
          {breadcrumbs.map((b, i) => (
            <React.Fragment key={i}>
              <span>›</span>
              {b.path ? <a style={{ cursor: 'pointer' }}>{b.label}</a> : <span>{b.label}</span>}
            </React.Fragment>
          ))}
        </nav>
      </div>
      {actions && <div style={{ display: 'flex', gap: 10 }}>{actions}</div>}
    </div>
  );
}

/** Standard white card panel */
export function WhiteCard({ title, actions, children, bodyPadding = true }) {
  return (
    <div className="white_card">
      {title && (
        <div className="white_card_header">
          <h4>{title}</h4>
          {actions && <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>{actions}</div>}
        </div>
      )}
      <div className={bodyPadding ? 'white_card_body' : ''}>{children}</div>
    </div>
  );
}

/** Standard data table */
export function DataTable({ columns, data, emptyMsg = 'No records found.' }) {
  return (
    <div className="table-responsive">
      <table className="data_table">
        <thead>
          <tr>{columns.map((c, i) => <th key={i}>{c.label}</th>)}</tr>
        </thead>
        <tbody>
          {data.length === 0
            ? <tr><td colSpan={columns.length} className="text-center" style={{ padding: 40, color: '#aaa' }}>{emptyMsg}</td></tr>
            : data.map((row, ri) => (
              <tr key={ri}>
                {columns.map((c, ci) => <td key={ci}>{c.render ? c.render(row, ri) : row[c.key]}</td>)}
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
}

/** Status badge */
export function Badge({ type = 'success', children }) {
  return <span className={`badge badge-${type}`}>{children}</span>;
}

/** Action icon buttons */
export function ActionBtn({ type, icon, title, onClick }) {
  return (
    <button className={`action-btn ${type}`} title={title} onClick={onClick}>
      <span className={icon} />
    </button>
  );
}

/** Stat card for dashboards */
export function StatCard({ value, label, icon, colorClass = 'purple' }) {
  return (
    <div className="stat_card">
      <div className={`stat_icon_wrap ${colorClass}`}>
        <span className={icon} style={{ fontSize: 22 }} />
      </div>
      <div className="stat_info">
        <div className="value">{value}</div>
        <div className="label">{label}</div>
      </div>
    </div>
  );
}

/** Form field wrapper */
export function FormGroup({ label, required, children }) {
  return (
    <div className="form-group">
      <label>{label}{required && <span style={{ color: '#ef5f5f' }}> *</span>}</label>
      {children}
    </div>
  );
}

/** Alert/toast message */
export function Alert({ type = 'success', msg, onClose }) {
  if (!msg) return null;
  return (
    <div className={`alert alert-${type}`}>
      <span className={type === 'success' ? 'ti-check' : 'ti-close'} />
      {msg}
      {onClose && <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>×</button>}
    </div>
  );
}
