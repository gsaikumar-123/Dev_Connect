import { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  const defaultAbout = `Hey There I am ${user.firstName} ${user.lastName}. lets connect`;
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || defaultAbout);
  const [skills,setSkills] = useState(Array.isArray(user.skills) ? user.skills.join(', ') : user.skills || "");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);

  const saveProfile = async () => {
    setError("");
    setIsLoading(true);
    setIsSaved(false);

    // Validation
    if (!age || isNaN(age) || age > 100) {
      setError("Please enter a valid age less than 100.");
      setIsLoading(false);
      return;
    }
    if (!gender) {
      setError("Please select your gender.");
      setIsLoading(false);
      return;
    }
    const skillsArray = skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
    if (skillsArray.length < 2) {
      setError("Please enter at least 2 skills, separated by commas.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.patch(
        BASE_URL+"/profile/edit",
        { firstName, lastName, photoUrl, age: parseInt(age), gender, about, skills: skills.split(',').map(s => s.trim()).filter(s => s.length > 0) },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      setIsSaved(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to save profile. Please try again.";
      setError(msg);
    }
    finally{
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
      <div className="flex flex-col lg:flex-row gap-8 justify-center">
        {/* Edit Form */}
        <div className="card-modern p-6 sm:p-8 flex-1 max-w-xl animate-fade-in">
          <h2 className="text-2xl sm:text-3xl font-bold text-secondary mb-2 dark:text-gray-100">Edit Profile</h2>
          <p className="text-secondary-lighter mb-6 sm:mb-8 dark:text-gray-300">Update your personal information</p>

          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-secondary font-semibold mb-2 text-sm dark:text-gray-100">
                  First Name
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                />
              </div>

              <div>
                <label className="block text-secondary font-semibold mb-2 text-sm dark:text-gray-100">
                  Last Name
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-secondary font-semibold mb-2 text-sm dark:text-gray-100">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  className="input-field"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="25"
                />
              </div>

              <div>
                <label className="block text-secondary font-semibold mb-2 text-sm dark:text-gray-100">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  className="input-field"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-secondary font-semibold mb-2 text-sm dark:text-gray-100">
                Photo URL
              </label>
              <input
                type="text"
                className="input-field"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-secondary font-semibold text-sm dark:text-gray-100">
                  About
                </label>
                <span className="text-xs text-secondary-lighter dark:text-gray-300">
                  {about.length}/500
                </span>
              </div>
              <textarea
                className="input-field resize-none"
                rows="4"
                maxLength="500"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Tell us about yourself, your interests, and what you're looking for..."
              />
            </div>

            <div>
              <label className="block text-secondary font-semibold mb-2 text-sm dark:text-gray-100">
                Skills <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="input-field"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="React, Node.js, Python, JavaScript"
              />
              <p className="text-secondary-lighter text-xs mt-2 flex items-center gap-1 dark:text-gray-300">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Separate skills with commas (at least 2 required)
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-lg dark:bg-red-900/20 dark:border-red-800">
                <p className="text-red-600 text-sm font-medium text-center dark:text-red-400">{error}</p>
              </div>
            )}

            <button 
              className="btn-primary w-full flex items-center justify-center gap-2" 
              onClick={saveProfile}
              disabled={isLoading || !firstName || !lastName || !age || !gender || skills.split(',').map(s => s.trim()).filter(s => s.length > 0).length < 2}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin-slow h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : isSaved ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Saved!
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        {/* Preview Card */}
        <div className="flex-shrink-0 hidden lg:block">
          <div className="sticky top-24">
            <div className="flex items-center justify-center gap-2 mb-4">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <p className="text-secondary-lighter text-sm font-semibold text-center dark:text-gray-300">Live Preview</p>
            </div>
            <UserCard
              user={{ firstName, lastName, about, photoUrl, skills: skills.split(',').map(s => s.trim()).filter(s => s.length > 0), gender, age }}
            />
          </div>
        </div>
      </div>

      {/* Toast Message */}
      {showToast && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert bg-primary text-white border-none shadow-soft px-6 py-4 rounded-xl animate-fade-in flex items-center gap-3">
            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-semibold">Profile saved successfully!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
