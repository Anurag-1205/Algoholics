import React, { useState } from 'react';
import { Plus, Link as LinkIcon, Tag, AlertTriangle, ExternalLink } from 'lucide-react';
import { Problem } from '../types';

interface ProblemFormProps {
  problems: Problem[];
  onAddProblem: (title: string, link: string, category: string) => void;
}

export const ProblemForm: React.FC<ProblemFormProps> = ({ problems, onAddProblem }) => {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [duplicateWarning, setDuplicateWarning] = useState<string>('');
  const [existingProblem, setExistingProblem] = useState<Problem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const commonCategories = [
    'Array',
    'String',
    'LinkedList',
    'Stack',
    'Queue',
    'Tree',
    'Graph',
    'Dynamic Programming',
    'Greedy',
    'Backtracking',
    'Binary Search',
    'Sorting',
    'Hash Table',
    'Two Pointers',
    'Sliding Window',
    'Math',
    'Bit Manipulation',
    'Heap',
    'Trie',
    'Union Find'
  ];

  // Check for duplicates when title changes
  const checkDuplicates = (titleValue: string) => {
    if (!titleValue.trim()) {
      setDuplicateWarning('');
      setExistingProblem(null);
      return;
    }

    const normalizedTitle = titleValue.toLowerCase().trim();
    const existing = problems.find(p => p.title.toLowerCase().trim() === normalizedTitle);
    
    if (existing) {
      setDuplicateWarning('A problem with this title already exists');
      setExistingProblem(existing);
    } else {
      setDuplicateWarning('');
      setExistingProblem(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (title.trim() && link.trim() && category.trim()) {
      // Check for exact duplicates before submitting
      const normalizedTitle = title.toLowerCase().trim();
      const existing = problems.find(p => p.title.toLowerCase().trim() === normalizedTitle);
      
      if (existing) {
        setError('A problem with this title already exists');
        return;
      }
      
      setIsSubmitting(true);
      
      try {
        await onAddProblem(title.trim(), link.trim(), category.trim());
        setTitle('');
        setLink('');
        setCategory('');
        setDuplicateWarning('');
        setExistingProblem(null);
        setError('');
      } catch (err: any) {
        setError(err.message || 'Failed to add problem. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 h-fit">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Plus className="h-5 w-5" />
        Add DSA Problem
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Problem Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              checkDuplicates(e.target.value);
              if (error) setError('');
            }}
            placeholder="e.g., Two Sum, Valid Parentheses"
            className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              error || duplicateWarning ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
            }`}
            required
          />
          {duplicateWarning && existingProblem && (
            <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                    {duplicateWarning}
                  </p>
                  <div className="mt-2 text-xs text-yellow-700 dark:text-yellow-300">
                    <div className="font-medium">Existing problem:</div>
                    <div className="mt-1">
                      <div><strong>Title:</strong> {existingProblem.title}</div>
                      <div><strong>Category:</strong> {existingProblem.category}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <strong>Link:</strong>
                        <a
                          href={existingProblem.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                        >
                          View Problem
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                if (error) setError('');
              }}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                error ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
              }`}
              required
            >
              <option value="">Select a category</option>
              {commonCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Problem Link
          </label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="url"
              value={link}
              onChange={(e) => {
                setLink(e.target.value);
                if (error) setError('');
              }}
              placeholder="https://leetcode.com/problems/..."
              className={`w-full pl-10 pr-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                error ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
              }`}
              required
            />
          </div>
        </div>
        
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${
            isSubmitting
              ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Add Problem
            </>
          )}
        </button>
      </form>
    </div>
  );
};