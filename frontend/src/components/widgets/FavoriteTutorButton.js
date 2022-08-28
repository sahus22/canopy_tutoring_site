import React from 'react'
import { Heart, HeartFill } from 'react-bootstrap-icons'

const FavoriteTutorButton = (props) => {
    const {tutor, user, setUser} = props

    const [authorized, setAuthorized] = React.useState(false)

    React.useEffect(() => {
        const auth = JSON.parse(localStorage.getItem('user'));
        // the user is not logged in
        if (!auth || !auth.user_id){
            setAuthorized(false);
            return;
        }

        // the user is not the same as the one passed in
        if (auth.user_id !== user._id){
            setAuthorized(false);
            return;
        }

        // all checks passed
        setAuthorized(true);
    }, [user])

    const saveUser = (updated_user) => {
        const auth = JSON.parse(localStorage.getItem('user'));
        fetch(`/api/users/${auth.user_id}`, {
            method: 'PUT',
            body: JSON.stringify(updated_user || user),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-access-token': auth.token
            }
        })
        .then( response => {
            if (!response.ok) throw new Error(response.status)
         } )
        .catch( err => {
            if (err.message === '401'){
                setAuthorized(false)
            }
        })
    }

    const removeFavoriteTutor = (event) => {
        event.stopPropagation();
        let newFavoritesList = (user.favorite_tutors || []).filter(tutor_id => tutor_id !== tutor._id)
        const updated_user = {
            ...user,
            favorite_tutors: newFavoritesList
        }
        setUser(updated_user)
        saveUser(updated_user)
    }

    const addFavoriteTutor = (event) => {
        event.stopPropagation()
        let newFavoritesList = [...(user.favorite_tutors || []), tutor._id]
        const updated_user = {
            ...user,
            favorite_tutors: newFavoritesList
        }
        setUser(updated_user)
        saveUser(updated_user)
    }

    // invisible if not authorized
    if (!authorized){
        return <></>
    }

    // display filled heart if it is a favorite tutor; empty heart if not a favorite tutor
    if (user.favorite_tutors && user.favorite_tutors.includes(tutor._id)){
        return  <HeartFill onClick={removeFavoriteTutor} style={{color: 'red'}}/>
    } else {
        return <Heart onClick={addFavoriteTutor} />
    }
}

export default FavoriteTutorButton