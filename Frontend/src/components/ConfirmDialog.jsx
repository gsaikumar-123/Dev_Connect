import React from 'react';

const ConfirmDialog = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-secondary rounded-lg p-6 max-w-sm mx-4 shadow-lg">
        <p className="text-secondary dark:text-gray-100 mb-4">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="btn-secondary px-4 py-2"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn-primary px-4 py-2"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;