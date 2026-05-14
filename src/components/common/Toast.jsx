// ============================================
// Toast Notification Component
// ============================================
// Displays success/error messages from AuthContext.
// Automatically fades out after 3.5 seconds.
// ============================================

import React from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';
import './Toast.css';

const Toast = ({ toast, onClose }) => {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className={`toast-notification ${toast.type} toast-enter`}>
      <div className="toast-icon">
        {isSuccess ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
      </div>
      <span className="toast-message">{toast.message}</span>
      <button className="toast-close" onClick={onClose}>
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
