import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import UserCard from './UserCard';

const SearchResults = () => {
  const { query } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (query) {
      searchUsers(query);
    }
  }, [query]);

  const searchUsers = async (searchQuery) => {
    setIsLoading(true);
    setError('');

    try {
      const res = await axios.get(`${BASE_URL}/user/search`, {
        params: { q: searchQuery },
        withCredentials: true
      });

      if (res.data.success) {
        setResults(res.data.data || []);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err.response?.data?.message || 'Search failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className='max-w-6xl mx-auto px-4 py-8 sm:py-12'>
        <div className="mb-8">
          <div className="skeleton h-10 w-64 mb-2"></div>
          <div className="skeleton h-6 w-48"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card-modern overflow-hidden">
              <div className="skeleton h-64 w-full rounded-none"></div>
              <div className="p-6 space-y-3">
                <div className="skeleton h-6 w-3/4"></div>
                <div className="skeleton h-4 w-1/2"></div>
                <div className="skeleton h-16 w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-6xl mx-auto px-4 py-8 sm:py-12'>
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-secondary-lighter hover:text-primary transition-colors mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        
        <h1 className='font-bold text-3xl sm:text-4xl text-secondary mb-2'>
          Search Results for "{query}"
        </h1>
        <p className="text-secondary-lighter text-sm sm:text-base">
          {results.length} {results.length === 1 ? 'developer' : 'developers'} found
        </p>
      </div>

      {error && (
        <div className="p-6 bg-red-50 border border-red-100 rounded-xl text-center mb-8">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      )}

      {!error && results.length === 0 && (
        <div className='flex flex-col items-center justify-center min-h-[calc(100vh-400px)] animate-fade-in'>
          <div className="text-center max-w-md">
            <div className="w-32 h-32 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className='font-bold text-3xl text-secondary mb-3'>No Results Found</h2>
            <p className='text-secondary-lighter text-lg leading-relaxed'>
              We couldn't find any developers matching "{query}". Try a different search term.
            </p>
          </div>
        </div>
      )}

      {!error && results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((user, index) => (
            <div 
              key={user._id} 
              style={{animationDelay: `${index * 50}ms`}} 
              className="animate-fade-in"
            >
              <UserCard user={user} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
