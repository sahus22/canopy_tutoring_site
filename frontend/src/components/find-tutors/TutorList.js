import React from 'react'

import TutorInfoCard from '../widgets/TutorInfoCard'

import './TutorList.css'

// fuzzy match on the name field
function nameFilter(tutor, filterText) {
    if (!filterText)
        return true;

    return tutor.name.toLowerCase().includes(filterText.toLowerCase());
}

// check for exact matches on subject name
// in practice this should come from a drop down
function subjectFilter(tutor, filterText) {
    if (!filterText)
        return true;

    const subjectList = tutor.tutor_details.subjects.map((subject) => subject.subject);
    return subjectList.some((subject) => subject.toLowerCase() === filterText.toLowerCase());
}

// if only favorite tutors is true, return true iff the given tutor is in the user's favorites list
function favoriteFilter(tutor, user, onlyFavoriteTutors){
    if (!onlyFavoriteTutors)
        return true;
    
    return (user.favorite_tutors || []).includes(tutor._id)
}

const TutorList = (props) => {
    const { tutors, nameFilterText, subjectFilterText, onlyFavoriteTutors, updateRenderTutorDetails, updateTutorDetails, user, setUser } = props;

    const filteredTutors = tutors
        .filter((tutor) => nameFilter(tutor, nameFilterText))
        .filter((tutor) => subjectFilter(tutor, subjectFilterText))
        .filter((tutor) => favoriteFilter(tutor, user, onlyFavoriteTutors));

    const tutorCards = filteredTutors.map((tutor, index) => {
        return (
            <TutorInfoCard
                key={index}
                tutor={tutor}
                updateRenderTutorDetails={updateRenderTutorDetails}
                updateTutorDetails={updateTutorDetails}
                user={user}
                setUser={setUser}
            />
        )
    });

    return (
        <div className='cards'>
            {tutorCards}
        </div>
    );
}

export default TutorList;