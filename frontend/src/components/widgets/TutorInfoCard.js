import React from 'react'

import StarRatings from 'react-star-ratings'
import ReactCountryFlag from 'react-country-flag';
import FavoriteTutorButton from './FavoriteTutorButton';

// import './TutorInfoCard.css'

const TutorInfoCard = (props) => {
    const { tutor, updateRenderTutorDetails, updateTutorDetails, user, setUser} = props;

    const fullName = tutor.name;
    const avgRating = tutor.tutor_details.average_rating;
    const location = tutor.tutor_details.location.state + ', ' + tutor.tutor_details.location.country_code;
    const profileImage = tutor.profile_image;

    function setTutorDetailsValues(){
        updateRenderTutorDetails(true)
        updateTutorDetails(tutor)
    }

    return (
        <div className='card mb-3' style={{ maxWidth: '40em', margin:'0.5em' }} onClick={setTutorDetailsValues}>
            <div className="row g-0">
                <div className="col-md-4">
                    <img src={profileImage} className="img-fluid rounded-start" alt="profile"/>
                </div>
                <div className="col-md-8">
                    <div className="card-body">
                        <h5 className="card-title">{fullName}</h5>
                        <StarRatings rating={avgRating || 0} starRatedColor='gold' starDimension='1em' starSpacing='0.1em' />
                        <FavoriteTutorButton tutor={tutor} user={user} setUser={setUser}/>
                        <p className="card-text"><ReactCountryFlag countryCode={tutor.tutor_details.location.country_code} svg style={{ width: '1em', height: '1em' }} /> {location}</p>
                        <p className="card-text"><small className="text-muted">{tutor.tutor_details.description}</small></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorInfoCard;