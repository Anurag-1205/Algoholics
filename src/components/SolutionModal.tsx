import React, { useState, useEffect } from 'react';
import { X, Check, Eye, Edit3, Users, Lock } from 'lucide-react';
import { Problem, Member, Submission } from '../types';

interface SolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  problem: Problem;
  currentMember: Member;
  authenticatedMemberId: string | null;
  submissions: Submission[];
  members: Member[];
  onUpdateSubmission: (problemId: string, isSolved: boolean, solution: string, notes: string) => void;
}

export const SolutionModal: React.FC<SolutionModalProps> = ({
  isOpen,
  onClose,
  problem,
  currentMember,
  authenticatedMemberId,
  submissions,
  members,
  onUpdateSubmission,
}) => {
  const [activeTab, setActiveTab] = useState<'my-solution' | 'others-solutions'>('my-solution');
  const [isSolved, setIsSolved] = useState(false);
  const [solution, setSolution] = useState('');
  const [notes, setNotes] = useState('');

  const mySubmission = submissions.find(
    s => s.problemId === problem.id && s.memberId === currentMember.id
  );

  const othersSubmissions = submissions.filter(
    s => s.problemId === problem.id && s.memberId !== currentMember.id
  );

  const isAuthenticated = authenticatedMemberId === currentMember.id;

  useEffect(() => {
    if (mySubmission) {
      setIsSolved(mySubmission.isSolved);
      setSolution(mySubmission.solution);
      setNotes(mySubmission.notes);
    } else {
      setIsSolved(false);
      setSolution('');
      setNotes('');
    }
  }, [mySubmission]);

  const handleSave = () => {
    if (!isAuthenticated) return;
    onUpdateSubmission(problem.id, isSolved, solution, notes);
    onClose();
  };

  const getMemberName = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    return member ? member.name : 'Unknown';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {problem.title}
            </h2>
            <a
              href={problem.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm mt-1 inline-block"
            >
              View Problem →
            </a>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Authentication Warning */}
        {!isAuthenticated && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800 p-4">
            <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
              <Lock className="h-4 w-4" />
              <span className="text-sm">
                You need to authenticate with your PIN to edit your solution. You can view others' solutions below.
              </span>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-600">
          <button
            onClick={() => setActiveTab('my-solution')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === 'my-solution'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <Edit3 className="h-4 w-4 inline mr-2" />
            My Solution
            {!isAuthenticated && <Lock className="h-3 w-3 inline ml-1" />}
          </button>
          <button
            onClick={() => setActiveTab('others-solutions')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === 'others-solutions'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <Users className="h-4 w-4 inline mr-2" />
            Others' Solutions ({othersSubmissions.length})
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'my-solution' ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="solved-checkbox"
                  checked={isSolved}
                  onChange={(e) => setIsSolved(e.target.checked)}
                  disabled={!isAuthenticated}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50"
                />
                <label htmlFor="solved-checkbox" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mark as solved
                  {!isAuthenticated && <span className="text-gray-400 ml-1">(requires authentication)</span>}
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Solution
                </label>
                <textarea
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  placeholder={isAuthenticated ? "Paste your solution code here..." : "Authenticate to edit your solution"}
                  disabled={!isAuthenticated}
                  className="w-full h-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={isAuthenticated ? "Add your notes, thoughts, or approach..." : "Authenticate to edit your notes"}
                  disabled={!isAuthenticated}
                  className="w-full h-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {othersSubmissions.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No solutions from other members yet</p>
                </div>
              ) : (
                othersSubmissions.map((submission) => (
                  <div key={submission.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {getMemberName(submission.memberId)}
                        </span>
                        {submission.isSolved && (
                          <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                            <Check className="h-4 w-4" />
                            Solved
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(submission.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {submission.solution && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Solution:</h4>
                        <pre className="bg-gray-50 dark:bg-gray-900 p-3 rounded text-sm overflow-x-auto text-gray-800 dark:text-gray-200">
                          {submission.solution}
                        </pre>
                      </div>
                    )}
                    
                    {submission.notes && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes:</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded">
                          {submission.notes}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {activeTab === 'my-solution' && (
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-600">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {isAuthenticated ? 'Cancel' : 'Close'}
            </button>
            {isAuthenticated && (
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};