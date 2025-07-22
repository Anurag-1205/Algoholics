import { supabase } from '../lib/supabase';
import { Member, Problem, Submission } from '../types';

// Members
export const createMember = async (name: string, pin: string): Promise<Member> => {
  const { data, error } = await supabase
    .from('members')
    .insert({ name, pin })
    .select()
    .single();

  if (error) throw error;
  
  return {
    id: data.id,
    name: data.name,
    pin: data.pin,
    createdAt: data.created_at,
  };
};

export const getMembers = async (): Promise<Member[]> => {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;
  
  return data.map(member => ({
    id: member.id,
    name: member.name,
    pin: member.pin,
    createdAt: member.created_at,
  }));
};

export const deleteMember = async (memberId: string): Promise<void> => {
  // First delete all submissions by this member
  await supabase
    .from('submissions')
    .delete()
    .eq('member_id', memberId);

  // Then delete the member
  const { error } = await supabase
    .from('members')
    .delete()
    .eq('id', memberId);

  if (error) throw error;
};

// Problems
export const createProblem = async (title: string, link: string, category: string, createdById: string | null = null): Promise<Problem> => {
  const { data, error } = await supabase
    .from('problems')
    .insert({ title, link, category, created_by: createdById })
    .select()
    .single();

  if (error) {
    // Handle unique constraint violations
    if (error.code === '23505') {
      if (error.message.includes('title')) {
        throw new Error('A problem with this title already exists');
      } else {
        throw new Error('This problem already exists');
      }
    }
    throw error;
  }
  
  return {
    id: data.id,
    title: data.title,
    link: data.link,
    category: data.category,
    createdById: data.created_by,
    createdAt: data.created_at,
  };
};

export const getProblems = async (): Promise<Problem[]> => {
  const { data, error } = await supabase
    .from('problems')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;
  
  return data.map(problem => ({
    id: problem.id,
    title: problem.title,
    link: problem.link,
    category: problem.category,
    createdById: problem.created_by,
    createdAt: problem.created_at,
  }));
};

export const deleteProblem = async (problemId: string): Promise<void> => {
  // First delete all submissions for this problem
  await supabase
    .from('submissions')
    .delete()
    .eq('problem_id', problemId);

  // Then delete the problem
  const { error } = await supabase
    .from('problems')
    .delete()
    .eq('id', problemId);

  if (error) throw error;
};

// Submissions
export const upsertSubmission = async (
  memberId: string,
  problemId: string,
  isSolved: boolean,
  solution: string,
  notes: string
): Promise<Submission> => {
  // First, check if submission exists
  const { data: existingSubmission } = await supabase
    .from('submissions')
    .select('id')
    .eq('member_id', memberId)
    .eq('problem_id', problemId)
    .maybeSingle();

  let data, error;

  if (existingSubmission) {
    // Update existing submission
    const result = await supabase
      .from('submissions')
      .update({
        is_solved: isSolved,
        solution: solution || null,
        notes: notes || null,
        updated_at: new Date().toISOString(),
      })
      .eq('member_id', memberId)
      .eq('problem_id', problemId)
      .select()
      .single();
    
    data = result.data;
    error = result.error;
  } else {
    // Insert new submission
    const result = await supabase
      .from('submissions')
      .insert({
        member_id: memberId,
        problem_id: problemId,
        is_solved: isSolved,
        solution: solution || null,
        notes: notes || null,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    data = result.data;
    error = result.error;
  }

  if (error) {
    console.error('Submission error:', error);
    throw error;
  }
  
  return {
    id: data.id,
    memberId: data.member_id,
    problemId: data.problem_id,
    isSolved: data.is_solved,
    solution: data.solution || '',
    notes: data.notes || '',
    updatedAt: data.updated_at,
  };
};

export const getSubmissions = async (): Promise<Submission[]> => {
  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) throw error;
  
  return data.map(submission => ({
    id: submission.id,
    memberId: submission.member_id,
    problemId: submission.problem_id,
    isSolved: submission.is_solved,
    solution: submission.solution || '',
    notes: submission.notes || '',
    updatedAt: submission.updated_at,
  }));
};