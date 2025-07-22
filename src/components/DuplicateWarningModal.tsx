import React from 'react';
import { X, AlertTriangle, Eye, Plus } from 'lucide-react';

interface DuplicateWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
  onViewExisting: () => void;
  duplicateType: 'exact' | 'similar';
  message: string;
  existingProblem: {
    id: string;
    title: string;
    link: string;
    category: string;
  };
  newProblemTitle: string;
}

export const DuplicateWarningModal: React.FC<DuplicateWarningModalProps> = ({
  isOpen,
  onClose,
  onProceed,
  onViewExisting,
  duplicateType,
  message,
  existingProblem,
  newProblemTitle,
}) => {
  if (!isOpen) return null;

  const isExactDuplicate = duplicateType === 'exact';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${
              isExactDuplicate 
                ? 'bg-red-100 dark:bg-red-900/30' 
                : 'bg-yellow-100 dark:bg-yellow-900/30'
            }`}>
              <AlertTriangle className={`h-5 w-5 ${
                isExactDuplicate 
                  ? 'text-red-600 dark:text-red-400' 
                  : 'text-yellow-600 dark:text-yellow-400'
              }`} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {isExactDuplicate ? 'Duplicate Problem Detected' : 'Similar Problem Found'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {message}
            </p>
          </div>

          {/* Problem Comparison */}
          <div className="space-y-3 mb-6">
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Existing Problem:
              </h4>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <div><strong>Title:</strong> {existingProblem.title}</div>
                <div><strong>Category:</strong> {existingProblem.category}</div>
                <div className="break-all"><strong>Link:</strong> {existingProblem.link}</div>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                New Problem:
              </h4>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <div><strong>Title:</strong> {newProblemTitle}</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onViewExisting}
              className="flex-1 px-4 py-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Eye className="h-4 w-4" />
              View Existing
            </button>
            
            {!isExactDuplicate && (
              <button
                onClick={onProceed}
                className="flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Anyway
              </button>
            )}
            
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};