import React, { useState } from "react";
import { Plus, Link as LinkIcon, Tag } from "lucide-react";

interface ProblemFormProps {
  onAddProblem: (title: string, link: string, category: string) => void;
}

export const ProblemForm: React.FC<ProblemFormProps> = ({ onAddProblem }) => {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [category, setCategory] = useState("");

  const commonCategories = [
    "Array",
    "String",
    "LinkedList",
    "Stack",
    "Queue",
    "Tree",
    "Binary Tree",
    "Binary Search Tree",
    "Heap",
    "Trie",
    "Hashing",
    "Sorting",
    "Searching",
    "Recursion",
    "Backtracking",
    "Divide and Conquer",
    "Greedy",
    "Dynamic Programming",
    "Bit Manipulation",
    "Sliding Window",
    "Two Pointers",
    "Prefix Sum",
    "Math",
    "Number Theory",
    "Modular Arithmetic",
    "Probability",
    "Combinatorics",
    "Geometry",
    "Graphs",
    "Union Find",
    "Segment Tree",
    "Fenwick Tree",
    "Disjoint Set Union (DSU)",
    "Bitmask DP",
    "Game Theory",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && link.trim() && category.trim()) {
      onAddProblem(title.trim(), link.trim(), category.trim());
      setTitle("");
      setLink("");
      setCategory("");
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
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Two Sum, Valid Parentheses"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., Array, LinkedList, Greedy"
              list="categories"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://leetcode.com/problems/..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Problem
        </button>
      </form>
    </div>
  );
};
