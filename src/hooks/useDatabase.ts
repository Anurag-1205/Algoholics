import { useState, useEffect } from 'react';
import { Member, Problem, Submission } from '../types';
import {
  getMembers,
  getProblems,
  getSubmissions,
  createMember,
  createProblem,
  upsertSubmission,
  deleteMember,
  deleteProblem,
} from '../services/database';
import { supabase } from '../lib/supabase';

export const useDatabase = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to filter valid submissions
  const filterValidSubmissions = (submissions: Submission[], members: Member[]) => {
    return submissions.filter(submission => 
      members.some(member => member.id === submission.memberId)
    );
  };

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [membersData, problemsData, submissionsData] = await Promise.all([
          getMembers(),
          getProblems(),
          getSubmissions(),
        ]);
        
        setMembers(membersData);
        setProblems(problemsData);
        // Filter submissions to only include those from existing members
        setSubmissions(filterValidSubmissions(submissionsData, membersData));
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data from database');
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Set up real-time subscriptions
    const membersSubscription = supabase
      .channel('members-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, async () => {
        try {
          const [newMembers, newSubmissions] = await Promise.all([
            getMembers(),
            getSubmissions()
          ]);
          setMembers(newMembers);
          // Always filter submissions when members change
          setSubmissions(filterValidSubmissions(newSubmissions, newMembers));
        } catch (err) {
          console.error('Error syncing members:', err);
        }
      })
      .subscribe();

    const problemsSubscription = supabase
      .channel('problems-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'problems' }, async () => {
        try {
          const [newProblems, newSubmissions] = await Promise.all([
            getProblems(),
            getSubmissions()
          ]);
          setProblems(newProblems);
          // Filter submissions for valid problems and members
          setSubmissions(prevSubmissions => {
            const validSubmissions = newSubmissions.filter(submission =>
              newProblems.some(problem => problem.id === submission.problemId) &&
              members.some(member => member.id === submission.memberId)
            );
            return validSubmissions;
          });
        } catch (err) {
          console.error('Error syncing problems:', err);
        }
      })
      .subscribe();

    const submissionsSubscription = supabase
      .channel('submissions-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'submissions' }, async () => {
        try {
          const newSubmissions = await getSubmissions();
          // Always filter submissions to ensure they're valid
          setSubmissions(prevSubmissions => filterValidSubmissions(newSubmissions, members));
        } catch (err) {
          console.error('Error syncing submissions:', err);
        }
      })
      .subscribe();

    return () => {
      membersSubscription.unsubscribe();
      problemsSubscription.unsubscribe();
      submissionsSubscription.unsubscribe();
    };
  }, []);

  // Update submissions when members change
  useEffect(() => {
    setSubmissions(prevSubmissions => filterValidSubmissions(prevSubmissions, members));
  }, [members]);

  // Member operations
  const addMember = async (name: string, pin: string): Promise<Member> => {
    try {
      const newMember = await createMember(name, pin);
      setMembers(prev => [...prev, newMember]);
      return newMember;
    } catch (err) {
      console.error('Error creating member:', err);
      throw new Error('Failed to create member');
    }
  };

  const removeMember = async (memberId: string): Promise<void> => {
    try {
      await deleteMember(memberId);
      // Update local state immediately
      setMembers(prev => prev.filter(m => m.id !== memberId));
      setSubmissions(prev => prev.filter(s => s.memberId !== memberId));
    } catch (err) {
      console.error('Error deleting member:', err);
      throw new Error('Failed to delete member');
    }
  };

  // Problem operations
  const addProblem = async (title: string, link: string, category: string, createdById: string | null = null): Promise<Problem> => {
    try {
      const newProblem = await createProblem(title, link, category, createdById);
      setProblems(prev => [...prev, newProblem]);
      return newProblem;
    } catch (err) {
      console.error('Error creating problem:', err);
      throw new Error('Failed to create problem');
    }
  };

  const removeProblem = async (problemId: string): Promise<void> => {
    try {
      await deleteProblem(problemId);
      // Update local state immediately
      setProblems(prev => prev.filter(p => p.id !== problemId));
      setSubmissions(prev => prev.filter(s => s.problemId !== problemId));
    } catch (err) {
      console.error('Error deleting problem:', err);
      throw new Error('Failed to delete problem');
    }
  };

  // Submission operations
  const updateSubmission = async (
    memberId: string,
    problemId: string,
    isSolved: boolean,
    solution: string,
    notes: string
  ): Promise<void> => {
    try {
      console.log('Updating submission:', { memberId, problemId, isSolved, solution: solution.length, notes: notes.length });
      
      const updatedSubmission = await upsertSubmission(memberId, problemId, isSolved, solution, notes);
      
      console.log('Submission updated successfully:', updatedSubmission);
      
      setSubmissions(prev => {
        const existingIndex = prev.findIndex(
          s => s.memberId === memberId && s.problemId === problemId
        );
        
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = updatedSubmission;
          return updated;
        } else {
          return [...prev, updatedSubmission];
        }
      });
    } catch (err) {
      console.error('Error updating submission:', err);
      throw new Error('Failed to update submission');
    }
  };

  return {
    members,
    problems,
    submissions,
    loading,
    error,
    addMember,
    removeMember,
    addProblem,
    removeProblem,
    updateSubmission,
  };
};