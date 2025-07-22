import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, Calendar} from 'lucide-react';
import { Member, Submission, Problem } from '../types';

interface LeaderboardProps {
  members: Member[];
  currentMember: Member | null;
  submissions: Submission[];
  problems: Problem[];
}

interface LeaderboardEntry {
  member: Member;
  solvedCount: number;
  totalProblems: number;
  completionPercentage: number;
  lastSolvedDate: string | null;
  rank: number;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  members,
  currentMember,
  submissions,
  problems,
}) => {
  const [displayCount, setDisplayCount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate leaderboard data
  const leaderboardData = useMemo(() => {
    const entries: LeaderboardEntry[] = members.map((member) => {
      const memberSubmissions = submissions.filter(s => s.memberId === member.id);
      const solvedSubmissions = memberSubmissions.filter(s => s.isSolved);
      const solvedCount = solvedSubmissions.length;
      const totalProblems = problems.length;
      const completionPercentage = totalProblems > 0 ? (solvedCount / totalProblems) * 100 : 0;
      
      // Find the most recent solved problem
      const lastSolvedSubmission = solvedSubmissions
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
      
      const lastSolvedDate = lastSolvedSubmission ? lastSolvedSubmission.updatedAt : null;

      return {
        member,
        solvedCount,
        totalProblems,
        completionPercentage,
        lastSolvedDate,
        rank: 0, // Will be set after sorting
      };
    });

    // Sort by solved count (descending), then by last solved date (more recent first), then by member creation date (older first)
    entries.sort((a, b) => {
      if (a.solvedCount !== b.solvedCount) {
        return b.solvedCount - a.solvedCount;
      }
      
      // If solved counts are equal, sort by member creation date (older first)
      if (a.lastSolvedDate && b.lastSolvedDate) {
        return new Date(a.lastSolvedDate).getTime() - new Date(b.lastSolvedDate).getTime();
      }
      if (a.lastSolvedDate && !b.lastSolvedDate) return -1;
      if (!a.lastSolvedDate && b.lastSolvedDate) return 1;
      
      // If both have no solved problems, sort by member creation date (older first)
      return new Date(a.member.createdAt).getTime() - new Date(b.member.createdAt).getTime();
    });

    // Assign ranks
    entries.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    return entries;
  }, [members, submissions, problems]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (isLoading || displayCount >= leaderboardData.length) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Load more when user is 200px from bottom
      if (scrollTop + windowHeight >= documentHeight - 200) {
        setIsLoading(true);
        
        // Simulate loading delay for smooth UX
        setTimeout(() => {
          setDisplayCount(prev => Math.min(prev + 10, leaderboardData.length));
          setIsLoading(false);
        }, 300);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [displayCount, leaderboardData.length, isLoading]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <span className="text-sm font-bold text-gray-500 dark:text-gray-400">#1</span>;
      case 2:
        return <span className="text-sm font-bold text-gray-500 dark:text-gray-400">#2</span>;
      case 3:
        return <span className="text-sm font-bold text-gray-500 dark:text-gray-400">#3</span>;
      default:
        return <span className="text-sm font-bold text-gray-500 dark:text-gray-400">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    
    const solvedDate = new Date(dateString);
    const now = new Date();
    
    // Get dates without time for comparison
    const solvedDateOnly = new Date(solvedDate.getFullYear(), solvedDate.getMonth(), solvedDate.getDate());
    const todayDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    
    if (solvedDateOnly.getTime() === todayDateOnly.getTime()) {
      return 'Today';
    } else if (solvedDateOnly.getTime() === yesterdayDateOnly.getTime()) {
      return 'Yesterday';
    } else {
      return solvedDate.toLocaleDateString();
    }
  };

  const displayedEntries = leaderboardData.slice(0, displayCount);

  if (leaderboardData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
        <Trophy className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4 opacity-50" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Members Yet</h3>
        <p className="text-gray-600 dark:text-gray-400">Join the group to see the leaderboard!</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <Trophy className="h-6 w-6 text-white" />
          <h2 className="text-xl font-bold text-white">Leaderboard</h2>
          <span className="bg-white/20 text-white px-2 py-1 rounded-full text-sm">
            {members.length} members
          </span>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-600 max-h-80 overflow-y-auto">
        {displayedEntries.map((entry, index) => {
          const isCurrentMember = currentMember?.id === entry.member.id;

          return (
            <div
              key={entry.member.id}
              className={`p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
                isCurrentMember 
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' 
                  : ''
              }`}
            >
              <div className="flex items-center justify-between">
                {/* Left side - Rank and Member Info */}
                <div className="flex items-center gap-4">
                  {/* Rank Badge */}
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full ${getRankBadgeColor(entry.rank)}`}>
                    {getRankIcon(entry.rank)}
                  </div>
                  
                  {/* Member Info */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {entry.member.name}
                      </span>
                      {isCurrentMember && (
                        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs font-medium">
                          You
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4 text-yellow-400" />
                        <span>{entry.solvedCount} / {entry.totalProblems} solved</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Last: {formatDate(entry.lastSolvedDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side - Progress and Stats */}
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    {entry.completionPercentage.toFixed(1)}%
                  </div>
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${entry.completionPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="p-4 text-center">
          <div className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span>Loading more members...</span>
          </div>
        </div>
      )}

      {/* End of list indicator */}
      {displayCount >= leaderboardData.length && leaderboardData.length > 10 && (
        <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
          You've reached the end of the leaderboard
        </div>
      )}
    </div>
  );
};