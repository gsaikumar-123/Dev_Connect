import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { BASE_URL } from '../utils/constants';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState('');
  const searchRef = useRef(null);
  const debounceTimer = useRef(null);
  const navigate = useNavigate();
  const currentUser = useSelector(store => store.user);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchUsers = async (searchQuery) => {
    if (!searchQuery || searchQuery.trim().length === 0) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await axios.get(`${BASE_URL}/user/search`, {
        params: { q: searchQuery },
        withCredentials: true
      });

      if (res.data.success) {
        const list = (res.data.data || []).filter(u => !currentUser || u._id !== currentUser._id);
        setResults(list);
        setShowResults(true);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err.response?.data?.message || 'Search failed');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      searchUsers(value);
    }, 300);
  };

  const handleResultClick = (user) => {
    navigate('/user/' + user._id);
    setQuery('');
    setShowResults(false);
    setResults([]);
  };

  const handleViewAllResults = () => {
    if (query.trim()) {
      navigate(`/search/${encodeURIComponent(query.trim())}`);
      setQuery('');
      setShowResults(false);
      setResults([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      handleViewAllResults();
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    setError('');
  };

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg 
            className={`w-5 h-5 transition-colors ${isLoading ? 'text-primary animate-spin-slow' : 'text-secondary-lighter'}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            {isLoading ? (
              <>
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </>
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            )}
          </svg>
        </div>
        
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          onFocus={() => query && setShowResults(true)}
          placeholder="Search developers..."
          className="w-full pl-10 pr-10 py-2.5 bg-accent dark:bg-secondary border border-gray-200 dark:border-secondary-light rounded-lg text-secondary dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
          aria-label="Search users"
        />

        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-lighter hover:text-secondary transition-colors"
            aria-label="Clear search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-secondary rounded-xl shadow-soft border border-gray-100 dark:border-secondary-light max-h-96 overflow-y-auto z-50 animate-fade-in">
          {error && (
            <div className="p-4 text-center">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {!error && results.length === 0 && !isLoading && (
            <div className="p-6 text-center">
              <svg className="w-12 h-12 mx-auto mb-3 text-secondary-lighter" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-secondary-lighter text-sm">No users found</p>
              <p className="text-secondary-lighter text-xs mt-1">Try a different search term</p>
            </div>
          )}

          {!error && results.length > 0 && (
            <div className="py-2">
              <div className="px-4 py-2 border-b border-gray-100 dark:border-secondary-light">
                <p className="text-xs font-semibold text-secondary-lighter uppercase tracking-wide">
                  {results.length} {results.length === 1 ? 'result' : 'results'}
                </p>
              </div>
              
              {results.map((user) => (
                <button
                  key={user._id}
                  onClick={() => handleResultClick(user)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-accent dark:hover:bg-secondary-light transition-colors group"
                >
                  <img
                    src={user.photoUrl}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-transparent group-hover:ring-primary/20 transition-all"
                  />
                  
                  <div className="flex-1 text-left min-w-0">
                    <h4 className="text-secondary dark:text-gray-100 font-semibold truncate group-hover:text-primary transition-colors">
                      {user.firstName} {user.lastName}
                    </h4>
                    {user.age && user.gender && (
                      <p className="text-secondary-lighter dark:text-gray-300 text-sm">
                        {user.age} years • {user.gender}
                      </p>
                    )}
                    {user.skills && user.skills.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {user.skills.slice(0, 2).map((skill, idx) => (
                          <span key={idx} className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                            {skill}
                          </span>
                        ))}
                        {user.skills.length > 2 && (
                          <span className="text-xs text-secondary-lighter">
                            +{user.skills.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <svg className="w-5 h-5 text-secondary-lighter opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
              
                {/* View All Results Button */}
                {results.length >= 5 && (
                  <div className="px-4 py-3 border-t border-gray-100 dark:border-secondary-light">
                    <button
                      onClick={handleViewAllResults}
                      className="w-full text-center text-primary hover:text-primary-dark font-semibold py-2 hover:bg-primary/5 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      View All Results
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>
                )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
