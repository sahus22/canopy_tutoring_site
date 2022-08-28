import React from 'react'
import FilterForm from './FilterForm';
import TutorDetails from './TutorDetails';

import TutorList from './TutorList'

const FindTutors = (props) => {

    const [tutors, setTutors] = React.useState([])
    const [user, setUser] = React.useState(null)
    const [nameFilterText, setNameFilterText] = React.useState('')
    const [selectedSubject, setSelectedSubject] = React.useState('')
    const [onlyFavoriteTutors, setOnlyFavoriteTutors] = React.useState(false)
    const [renderTutorDetails, setrenderTutorDetails] = React.useState(false)
    const [tutorDetails, settutorDetails] = React.useState([])


    React.useEffect(() => {
        const fetchTutorsJson = async () => {
            // fetch tutors from backend
            const tutorsJson = await fetch('/api/users/tutors', {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            const tutorsList = await tutorsJson.json();
            // update component state with new tutors list
            setTutors(tutorsList);
        }
        const fetchUser = async () => {
            // fetch user model
            const auth = JSON.parse(localStorage.getItem('user'));
            if(!auth || !auth.user_id){
                return;
            }

            const user_model = await fetch(`/api/users/${auth.user_id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'x-access-token': auth.token
                }
            });
            const user_json = await user_model.json();
            // update component state with user model
            setUser(user_json);
        }

        fetchUser().catch(console.error);
        fetchTutorsJson().catch(console.error);
    }, []);

    // make a set of all the subjects represented in the tutor objects
    const subjectList = [...new Set(tutors.map((tutor) => {
        return tutor.tutor_details.subjects.map((subject) => subject.subject)
    }).flat())]

    if (renderTutorDetails) {
        return (
            <TutorDetails
                tutor={tutorDetails}
                updateRenderTutorDetails={setrenderTutorDetails}
                user={user}
                setUser={setUser} />
        );
    }
    else {
        return (
            <React.Fragment>
                <FilterForm
                    filterText={nameFilterText}
                    updateFilterText={setNameFilterText}
                    selectedSubject={selectedSubject}
                    updateSelectedSubject={setSelectedSubject}
                    subjectList={subjectList}
                    onlyFavoriteTutors={onlyFavoriteTutors}
                    setOnlyFavoriteTutors={setOnlyFavoriteTutors} />
                <TutorList
                    tutors={tutors}
                    nameFilterText={nameFilterText}
                    subjectFilterText={selectedSubject}
                    onlyFavoriteTutors={onlyFavoriteTutors}
                    updateRenderTutorDetails={setrenderTutorDetails}
                    updateTutorDetails={settutorDetails}
                    user={user}
                    setUser={setUser} />
            </React.Fragment>
        );
    }
};

export default FindTutors;