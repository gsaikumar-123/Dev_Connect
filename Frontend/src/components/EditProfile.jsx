import { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [skills,setSkills] = useState(user.skills || "");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);

  const saveProfile = async () => {
    setError("");
    try {
      const res = await axios.patch(
        BASE_URL+"/profile/edit",
        { firstName, lastName, photoUrl, age, gender, about, skills },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      setError(err.response);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-8 justify-center">
        {/* Edit Form */}
        <div className="card-modern p-8 flex-1 max-w-xl">
          <h2 className="text-3xl font-bold text-secondary mb-2">Edit Profile</h2>
          <p className="text-secondary-lighter mb-8">Update your personal information</p>

          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-secondary font-semibold mb-2 text-sm">
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
                <label className="block text-secondary font-semibold mb-2 text-sm">
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
                <label className="block text-secondary font-semibold mb-2 text-sm">
                  Age
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="25"
                />
              </div>

              <div>
                <label className="block text-secondary font-semibold mb-2 text-sm">
                  Gender
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
              <label className="block text-secondary font-semibold mb-2 text-sm">
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
              <label className="block text-secondary font-semibold mb-2 text-sm">
                About
              </label>
              <textarea
                className="input-field resize-none"
                rows="3"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Tell us about yourself..."
              />
            </div>

            <div>
              <label className="block text-secondary font-semibold mb-2 text-sm">
                Skills
              </label>
              <input
                type="text"
                className="input-field"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="React, Node.js, Python"
              />
              <p className="text-secondary-lighter text-xs mt-1">Separate skills with commas</p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                <p className="text-red-600 text-sm font-medium text-center">{error}</p>
              </div>
            )}

            <button className="btn-primary w-full" onClick={saveProfile}>
              Save Changes
            </button>
          </div>
        </div>

        {/* Preview Card */}
        <div className="flex-shrink-0">
          <div className="sticky top-24">
            <p className="text-secondary-lighter text-sm font-semibold mb-4 text-center">Preview</p>
            <UserCard
              user={{ firstName, lastName, about, photoUrl, skills, gender, age }}
            />
          </div>
        </div>
      </div>

      {/* Toast Message */}
      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert bg-primary text-white border-none shadow-soft px-6 py-4 rounded-xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
