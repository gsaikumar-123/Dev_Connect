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
        BASE_URL+"/profile",
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
    <div className="flex justify-center gap-10">
      <div className="card card-border bg-base-300 w-96">
        <div className="card-body">
          <h2 className="card-title font-bold">Edit Profile</h2>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">First Name:</legend>
            <input
              type="text"
              className="input"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Last Name:</legend>
            <input
              type="text"
              className="input"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
            />
          </fieldset>

          <div className="flex gap-4">
            <fieldset className="fieldset w-1/2">
              <legend className="fieldset-legend">Age:</legend>
              <input
                type="text"
                className="input w-full"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Age"
              />
            </fieldset>

            <fieldset className="fieldset w-1/2">
              <legend className="fieldset-legend">Gender:</legend>
              <select
                className="select select-bordered w-full"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Choose One</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </fieldset>
          </div>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Photo URL:</legend>
            <input
              type="text"
              className="input"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="Photo URL"
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">About:</legend>
            <input
              type="text"
              className="input"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="About"
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Skills:</legend>
            <input
              type="text"
              className="input"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="Skills"
            />
          </fieldset>

          <p className="text-red-500 text-sm text-center">{error}</p>

          <div className="card-actions justify-center">
            <button className="btn btn-primary" onClick={saveProfile}>
              Save Profile
            </button>
          </div>
        </div>
      </div>

      <UserCard
        user={{ firstName, lastName, about, photoUrl,skills,gender,age }}
      />

      {/* Toast Message */}
      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Profile saved successfully.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
