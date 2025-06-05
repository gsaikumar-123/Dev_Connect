import React from 'react'

const UserCard = ({user}) => {
    const {firstName,lastName,about,photoUrl} = user;
  return (
    <div>
        <div className="card bg-base-300 w-96 shadow-sm">
        <figure>
            <img
            src={photoUrl}
            alt="User" />
        </figure>
        <div className="card-body">
            <h2 className="card-title">{firstName + " " + lastName}</h2>
            <p>{about}</p>
            <div className="card-actions justify-between">
                <button className='btn btn-secondary'>Ignore</button>
                <button className="btn btn-primary">Intrested</button>
            </div>
        </div>
        </div>
    </div>
  )
}

export default UserCard
