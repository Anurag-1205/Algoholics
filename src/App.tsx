import React, { useState, useEffect } from 'react';
import { Brain, Loader2, AlertCircle } from 'lucide-react';
import { Member, AppState } from './types';
import { MemberRegistration } from './components/MemberRegistration';
import { ProblemForm } from './components/ProblemForm';
import { MembersList } from './components/MembersList';
import { ProblemGrid } from './components/ProblemGrid';
import { ThemeToggle } from './components/ThemeToggle';
import { useDatabase } from './hooks/useDatabase';
import { loadState, saveState } from './utils/storage';

function App() {
  const {
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
  } = useDatabase();

  const [localState, setLocalState] = useState<Pick<AppState, 'currentMember' | 'authenticatedMemberId' | 'darkMode'>>(() => {
    const savedState = loadState();
    return {
      currentMember: savedState.currentMember || null,
      authenticatedMemberId: savedState.authenticatedMemberId || null,
      darkMode: savedState.darkMode || false,
    };
  });

  // Apply dark mode to document
  useEffect(() => {
    if (localState.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [localState.darkMode]);

  // Save local state to localStorage whenever it changes
  useEffect(() => {
    saveState({
      members: [],
      problems: [],
      submissions: [],
      ...localState,
    });
  }, [localState]);

  // Update current member if it was deleted
  useEffect(() => {
    if (localState.currentMember && !members.find(m => m.id === localState.currentMember!.id)) {
      setLocalState(prev => ({
        ...prev,
        currentMember: null,
        authenticatedMemberId: null,
      }));
    }
  }, [members, localState.currentMember]);

  const handleRegisterMember = async (name: string, pin: string) => {
    try {
      const newMember = await addMember(name, pin);
      setLocalState(prev => ({
        ...prev,
        currentMember: newMember,
        authenticatedMemberId: newMember.id,
      }));
    } catch (err) {
      console.error('Failed to register member:', err);
    }
  };

  const handleSelectMember = (member: Member, pin: string) => {
    if (pin === member.pin) {
      setLocalState(prev => ({
        ...prev,
        currentMember: member,
        authenticatedMemberId: member.id,
      }));
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    try {
      await removeMember(memberId);
      if (localState.currentMember?.id === memberId) {
        setLocalState(prev => ({
          ...prev,
          currentMember: null,
          authenticatedMemberId: null,
        }));
      }
    } catch (err) {
      console.error('Failed to delete member:', err);
    }
  };

  const handleAddProblem = async (title: string, link: string, category: string) => {
    try {
      await addProblem(title, link, category);
    } catch (err) {
      console.error('Failed to add problem:', err);
    }
  };

  const handleDeleteProblem = async (problemId: string) => {
    try {
      await removeProblem(problemId);
    } catch (err) {
      console.error('Failed to delete problem:', err);
    }
  };

  const handleUpdateSubmission = async (problemId: string, isSolved: boolean, solution: string, notes: string) => {
    if (!localState.currentMember || !localState.authenticatedMemberId || localState.currentMember.id !== localState.authenticatedMemberId) {
      return;
    }

    try {
      await updateSubmission(localState.currentMember.id, problemId, isSolved, solution, notes);
    } catch (err) {
      console.error('Failed to update submission:', err);
    }
  };

  const toggleDarkMode = () => {
    setLocalState(prev => ({
      ...prev,
      darkMode: !prev.darkMode,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Loading AlgoHolics...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Preparing your collaborative workspace
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Connection Error
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Unable to connect to the platform. Please check your connection and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900 dark:text-white">
                AlgoHolics
              </h1>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                Collaborative DSA Practice
              </span>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle darkMode={localState.darkMode} toggleDarkMode={toggleDarkMode} />
              <MemberRegistration
                members={members}
                currentMember={localState.currentMember}
                authenticatedMemberId={localState.authenticatedMemberId}
                onRegister={handleRegisterMember}
                onSelectMember={handleSelectMember}
                onDeleteMember={handleDeleteMember}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!localState.currentMember ? (
          <div className="text-center py-12">
            <Brain className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to AlgoHolics!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Join your study group to practice DSA problems together. Track your progress, 
              share solutions, and learn from each other in real-time.
            </p>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Get Started
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Enter your name and set a PIN in the top right to join the group and start practicing!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Members Overview */}
            <MembersList
              members={members}
              currentMember={localState.currentMember}
              submissions={submissions}
              problems={problems}
            />

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Left Panel - Add Problem Form */}
              <div className="lg:col-span-1">
                <ProblemForm onAddProblem={handleAddProblem} />
              </div>

              {/* Right Panel - Problem Grid */}
              <div className="lg:col-span-3">
                <ProblemGrid
                  problems={problems}
                  members={members}
                  submissions={submissions}
                  currentMember={localState.currentMember}
                  authenticatedMemberId={localState.authenticatedMemberId}
                  onUpdateSubmission={handleUpdateSubmission}
                  onDeleteProblem={handleDeleteProblem}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Brain className="h-4 w-4 mr-1" />
              AlgoHolics - Built for collaborative learning
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {problems.length} problems • {members.length} members
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;