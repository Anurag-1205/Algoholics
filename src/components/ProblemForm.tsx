import React, { useState } from 'react';
import { Plus, Link as LinkIcon, Tag } from 'lucide-react';

interface ProblemFormProps {
  onAddProblem: (title: string, link: string, category: string) => void;
}

export const ProblemForm: React.FC<ProblemFormProps> = ({ onAddProblem }) => {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (title.trim() && link.trim() && category.trim()) {
      setIsSubmitting(true);
      
      try {
        await onAddProblem(title.trim(), link.trim(), category.trim());
        setTitle('');
        setLink('');
        setCategory('');
        setError('');
      } catch (err: any) {
        // Handle specific duplicate error messages
        if (err.message.includes('title')) {
          setError(`A problem with the title "${title.trim()}" already exists. Please use a different title.`);
        } else if (err.message.includes('link')) {
          setError('A problem with this link already exists. Please use a different link.');
        } else if (err.message.includes('already exists')) {
          setError('This problem already exists. Please check the title and link.');
        } else {
          setError(err.message || 'Failed to add problem. Please try again.');
        }
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
               if (error) setError('');
             }}
            placeholder="e.g., Two Sum, Valid Parentheses"
             className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
               error ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
             }`}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={category}
               onChange={(e) => {
                 setCategory(e.target.value);
                 if (error) setError('');
               }}
              placeholder="e.g., Array, LinkedList, Greedy"
              list="categories"
               className={`w-full pl-10 pr-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                 error ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
               }`}
              required
            />
            <datalist id="categories">
              {commonCategories.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
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