import React, { useState } from 'react';
import { Check, Edit3, ExternalLink, Trash2, Lock, Tag, Filter } from 'lucide-react';
import { Problem, Member, Submission } from '../types';
import { SolutionModal } from './SolutionModal';

interface ProblemGridProps {
  problems: Problem[];
  members: Member[];
  submissions: Submission[];
  currentMember: Member | null;
  authenticatedMemberId: string | null;
  onUpdateSubmission: (problemId: string, isSolved: boolean, solution: string, notes: string) => void;
  onDeleteProblem: (problemId: string) => void;
}

export const ProblemGrid: React.FC<ProblemGridProps> = ({
  problems,
  members,
  submissions,
  currentMember,
  authenticatedMemberId,
  onUpdateSubmission,
  onDeleteProblem,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const getSubmission = (problemId: string, memberId: string) => {
    return submissions.find(s => s.problemId === problemId && s.memberId === memberId);
  };

  const getCellStatus = (problemId: string, memberId: string) => {
    const submission = getSubmission(problemId, memberId);
    if (!submission) return 'unsolved';
    if (submission.isSolved) {
      return currentMember?.id === memberId ? 'solved-by-me' : 'solved-by-other';
    }
    return 'attempted';
  };

  const getCellColor = (status: string) => {
    switch (status) {
      case 'solved-by-me':
        return 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700';
      case 'solved-by-other':
        return 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700';
      case 'attempted':
        return 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700';
      default:
        return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600';
    }
  };

  const handleCellClick = (problem: Problem) => {
    if (!currentMember || !authenticatedMemberId || currentMember.id !== authenticatedMemberId) {
      return;
    }
    setSelectedProblem(problem);
    setModalOpen(true);
  };

  const isRowComplete = (problemId: string) => {
    return members.every(member => {
      const submission = getSubmission(problemId, member.id);
      return submission?.isSolved;
    });
  };

  const isAuthenticated = currentMember && authenticatedMemberId === currentMember.id;

  // Get unique categories for filter
  const categories = Array.from(new Set(problems.map(p => p.category))).sort();
  
  // Filter problems by category
  const filteredProblems = selectedCategory 
    ? problems.filter(p => p.category === selectedCategory)
    : problems;

  const getCategoryColor = (category: string) => {
    const colors = [
      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
      'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    ];
    
    const hash = category.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  };

  if (problems.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
        <div className="text-gray-400 dark:text-gray-600 mb-4">
          <Edit3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No Problems Yet</h3>
          <p>Add your first DSA problem to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="border-b border-gray-200 dark:border-gray-600 p-4">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by category:</span>
              </div>
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedCategory === ''
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                All ({problems.length})
              </button>
              {categories.map((category) => {
                const count = problems.filter(p => p.category === category).length;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {category} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {!isAuthenticated && currentMember && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800 p-3">
            <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
              <Lock className="h-4 w-4" />
              <span className="text-sm">
                You need to authenticate with your PIN to edit solutions. You can still view others' solutions.
              </span>
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Problem
                </th>
                {members.map((member) => (
                  <th
                    key={member.id}
                    className={`px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${
                      currentMember?.id === member.id ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      {member.name}
                      {currentMember?.id === member.id && isAuthenticated && (
                        <Lock className="h-3 w-3 text-green-500" />
                      )}
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
              {filteredProblems.map((problem) => {
                const rowComplete = isRowComplete(problem.id);
                return (
                  <tr
                    key={problem.id}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      rowComplete ? 'bg-green-50 dark:bg-green-900/20' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {problem.title}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(problem.category)}`}>
                              <Tag className="h-3 w-3" />
                              {problem.category}
                            </span>
                            <a
                              href={problem.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                            >
                              <ExternalLink className="h-3 w-3" />
                              View Problem
                            </a>
                          </div>
                        </div>
                        {rowComplete && (
                          <div className="flex items-center text-green-600 dark:text-green-400">
                            <Check className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                    </td>
                    {members.map((member) => {
                      const status = getCellStatus(problem.id, member.id);
                      const submission = getSubmission(problem.id, member.id);
                      const isCurrentMemberCell = currentMember?.id === member.id;
                      const canEdit = isCurrentMemberCell && isAuthenticated;
                      
                      return (
                        <td key={member.id} className="px-4 py-4 text-center">
                          <button
                            onClick={() => handleCellClick(problem)}
                            disabled={!canEdit}
                            className={`w-12 h-12 rounded-lg border-2 transition-all relative ${
                              getCellColor(status)
                            } ${
                              canEdit
                                ? 'cursor-pointer hover:scale-105 hover:shadow-md'
                                : 'cursor-default'
                            }`}
                          >
                            {submission?.isSolved && (
                              <Check className="h-6 w-6 mx-auto text-green-600 dark:text-green-400" />
                            )}
                            {submission && !submission.isSolved && submission.solution && (
                              <Edit3 className="h-4 w-4 mx-auto text-yellow-600 dark:text-yellow-400" />
                            )}
                            {isCurrentMemberCell && !isAuthenticated && (
                              <Lock className="h-3 w-3 absolute top-0.5 right-0.5 text-gray-400" />
                            )}
                          </button>
                        </td>
                      );
                    })}
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => onDeleteProblem(problem.id)}
                        className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete problem"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && selectedProblem && currentMember && (
        <SolutionModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          problem={selectedProblem}
          currentMember={currentMember}
          authenticatedMemberId={authenticatedMemberId}
          submissions={submissions}
          members={members}
          onUpdateSubmission={onUpdateSubmission}
        />
      )}
    </>
  );
};