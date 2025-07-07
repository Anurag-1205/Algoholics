import React, { useState } from 'react';
import { UserPlus, Users, Trash2, AlertTriangle, Lock } from 'lucide-react';
import { Member } from '../types';

interface MemberRegistrationProps {
  members: Member[];
  currentMember: Member | null;
  authenticatedMemberId: string | null;
  onRegister: (name: string, pin: string) => void;
  onSelectMember: (member: Member, pin: string) => void;
  onDeleteMember: (memberId: string) => void;
}

export const MemberRegistration: React.FC<MemberRegistrationProps> = ({
  members,
  currentMember,
  authenticatedMemberId,
  onRegister,
  onSelectMember,
  onDeleteMember,
}) => {
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedMemberForAuth, setSelectedMemberForAuth] = useState<Member | null>(null);
  const [authPin, setAuthPin] = useState('');
  const [authError, setAuthError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && pin.trim()) {
      onRegister(name.trim(), pin.trim());
      setName('');
      setPin('');
    }
  };

  const handleMemberSelect = (member: Member) => {
    if (member.id === currentMember?.id) {
      // Already selected, just close dropdown
      setShowDropdown(false);
      return;
    }
    
    setSelectedMemberForAuth(member);
    setAuthPin('');
    setAuthError('');
  };

  const handlePinAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMemberForAuth && authPin.trim()) {
      if (authPin.trim() === selectedMemberForAuth.pin) {
        onSelectMember(selectedMemberForAuth, authPin.trim());
        setSelectedMemberForAuth(null);
        setAuthPin('');
        setAuthError('');
        setShowDropdown(false);
      } else {
        setAuthError('Incorrect PIN. Please try again.');
      }
    }
  };

  const cancelAuth = () => {
    setSelectedMemberForAuth(null);
    setAuthPin('');
    setAuthError('');
  };

  const handleDeleteProfile = () => {
    if (currentMember) {
      onDeleteMember(currentMember.id);
      setShowDeleteConfirm(false);
      setShowDropdown(false);
    }
  };

  const isAuthenticated = currentMember && authenticatedMemberId === currentMember.id;

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            isAuthenticated 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <Users className="h-4 w-4" />
          {currentMember ? (
            <span className="flex items-center gap-1">
              {currentMember.name}
              {isAuthenticated && <Lock className="h-3 w-3" />}
            </span>
          ) : (
            'Select Member'
          )}
        </button>
        
        {showDropdown && (
          <div className="absolute top-full left-0 mt-1 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10">
            {/* PIN Authentication Form */}
            {selectedMemberForAuth && (
              <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2 mb-3">
                  <Lock className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Enter PIN for {selectedMemberForAuth.name}
                  </span>
                </div>
                <form onSubmit={handlePinAuth} className="space-y-3">
                  <input
                    type="password"
                    value={authPin}
                    onChange={(e) => setAuthPin(e.target.value)}
                    placeholder="Enter PIN"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                  />
                  {authError && (
                    <p className="text-xs text-red-600 dark:text-red-400">{authError}</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      Authenticate
                    </button>
                    <button
                      type="button"
                      onClick={cancelAuth}
                      className="flex-1 px-3 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Member List */}
            {!selectedMemberForAuth && (
              <div className="max-h-48 overflow-y-auto">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className={`flex items-center justify-between px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      currentMember?.id === member.id ? 'bg-blue-50 dark:bg-blue-900' : ''
                    }`}
                  >
                    <button
                      onClick={() => handleMemberSelect(member)}
                      className="flex-1 text-left text-gray-900 dark:text-white flex items-center gap-2"
                    >
                      {member.name}
                      {currentMember?.id === member.id && isAuthenticated && (
                        <Lock className="h-3 w-3 text-green-500" />
                      )}
                    </button>
                    {currentMember?.id === member.id && isAuthenticated && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteConfirm(true);
                        }}
                        className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        title="Delete my profile"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* Delete Confirmation */}
            {showDeleteConfirm && !selectedMemberForAuth && (
              <div className="border-t border-gray-200 dark:border-gray-600 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Delete Profile?
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  This will permanently delete your profile and all your solutions. This action cannot be undone.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleDeleteProfile}
                    className="flex-1 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="Set PIN"
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          Join
        </button>
      </form>
    </div>
  );
};