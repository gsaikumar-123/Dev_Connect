import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';

const UserProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(BASE_URL + '/user/' + id, { withCredentials: true });
        if (res.data.success) {
          setUser(res.data.data);
        } else {
          setError(res.data.message || 'Failed to load user');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching user');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) {
    return <div className="p-6 text-center text-secondary-lighter">Loading profile...</div>;
  }
  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }
  if (!user) {
    return <div className="p-6 text-center text-secondary-lighter">User not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 animate-fade-in">
      <div className="card-modern p-6 flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          <img
            src={user.photoUrl}
            alt={user.firstName + ' ' + user.lastName}
            className="w-32 h-32 rounded-full object-cover ring-2 ring-primary/20"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-secondary dark:text-gray-100 mb-2">
            {user.firstName} {user.lastName}{user.isSelf && ' (You)'}
          </h1>
          {user.age && user.gender && (
            <p className="text-secondary-lighter dark:text-gray-300 mb-2">{user.age} years • {user.gender}</p>
          )}
          {user.about && (
            <p className="text-secondary dark:text-gray-100 leading-relaxed mb-4 whitespace-pre-line">{user.about}</p>
          )}
          {user.skills && user.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {user.skills.map((skill, idx) => (
                <span key={idx} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
