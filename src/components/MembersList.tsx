import React from 'react';
import { Trophy, User } from 'lucide-react';
import { Member, Submission } from '../types';

interface MembersListProps {
  members: Member[];
  currentMember: Member | null;
  submissions: Submission[];
  problems: any[];
}

export const MembersList: React.FC<MembersListProps> = ({
  members,
  currentMember,
  submissions,
  problems,
}) => {
  const getSolvedCount = (memberId: string) => {
    return submissions.filter(s => s.memberId === memberId && s.isSolved).length;
  };

  const getProgress = (memberId: string) => {
    const solved = getSolvedCount(memberId);
    const total = problems.length;
    return total > 0 ? (solved / total) * 100 : 0;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <User className="h-5 w-5" />
        Members ({members.length})
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {members.map((member) => {
          const solvedCount = getSolvedCount(member.id);
          const progress = getProgress(member.id);
          const isCurrentMember = currentMember?.id === member.id;
          
          return (
            <div
              key={member.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                isCurrentMember
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900 dark:text-white">
                  {member.name}
                </span>
                {isCurrentMember && (
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                    You
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {solvedCount} / {problems.length} solved
                </span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};