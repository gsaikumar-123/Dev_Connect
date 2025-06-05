import React from 'react';

const UserCard = ({ user }) => {
  if (!user) return null;

  const { firstName, lastName, about, photoUrl, age, gender, skills } = user;

  console.log(user);

  return (
    <div className="card bg-base-300 w-96 shadow-sm">
      <figure>
        <img src={photoUrl} alt="User" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{firstName + " " + lastName}</h2>
        {age && gender && <p>{age + "," + gender}</p>}
        {about && <p>{about}</p>}
        {skills.length>0 && (
          <p>{skills.join(", ")}</p>
        )}
        <div className="card-actions justify-between">
          <button className="btn btn-secondary">Ignore</button>
          <button className="btn btn-primary">Interested</button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
