import React from 'react'

import StarRatings from 'react-star-ratings'

const ReviewForm = (props) => {
    const { tutor, user } = props

    const [authorized, setAuthorized] = React.useState(false)
    const [completed, setCompleted] = React.useState(false)

    const [review, setReview] = React.useState({
        student_id: user? user._id: null,
        student_name: user? user.name: null,
        tutor_id: tutor? tutor._id: null,
        tutor_name: tutor? tutor.name: null,
        rating: 0,
        comment: ''
    })

    function updateRating(rating){
        setReview({
            ...review,
            rating: rating
        })
    }

    function updateComment(comment){
        setReview({
            ...review,
            comment: comment
        })
    }

    // check authorization to edit this comment
    React.useEffect(() => {
        const auth = JSON.parse(localStorage.getItem('user'));
        // if the user is not logged in, they can't write a review
        if (!auth || !auth.user_id){
            return setAuthorized(false);
        }

        if (auth.user_id !== user._id){
            return setAuthorized(false);
        }

        // all checks passed
        setAuthorized(true);
    }, [user])

    // load the user's existing comment if one exists
    React.useEffect(() => {
        if (!authorized) return;
        
        fetch(`/api/reviews/tutor/${tutor._id}/student/${user._id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then( response => response.json())
        .then( data => {
            if (data){
                setReview(data)
            }
        })
    }, [user, tutor, authorized])

    const saveReview = (event) => {
        event.preventDefault()
        const auth = JSON.parse(localStorage.getItem('user'));
        fetch(`/api/reviews/`, {
            method: 'POST',
            body: JSON.stringify( review ),
            headers: {
                'content-type': 'application/json',
                'accepts': 'application/json',
                'x-access-token': auth.token
            }
        })
        .then( response => {
            if (!response.ok) throw new Error(response.status)

            setTimeout(() => {setCompleted(false)}, 5000)
         } )
        .then( () => {
            setCompleted(true)
        })
        .catch( err => {
            setCompleted(false)
            if (err.message === '401'){
                setAuthorized(false)
            }
        })
    }

    if (!authorized) return <></>

    let saveButton = <button className='btn btn-primary mb-2 mx-2' onClick={saveReview}>Save Review</button>
    if (completed){
        saveButton = <button className='btn btn-success mb-2 mx-2' onClick={saveReview}>Review Saved!</button>
    }

    return (
        
        <form>
            <div className='d-flex justify-content-center'>
                <textarea className='form-control mx-2 my-1'
                    rows='3'
                    style={{width: '90%'}}
                    value={review.comment} 
                    onChange={(event) => updateComment(event.target.value)}/>
            </div>
            <div className='d-flex justify-content-evenly'>
                <StarRatings 
                    rating={review.rating} 
                    starRatedColor='gold' 
                    starDimension='2em' 
                    starSpacing='0.1em' 
                    style={{margin: '1em'}}
                    isSelectable={true}
                    changeRating={updateRating}/>
                {saveButton}
            </div>
            
        </form>
    )
}

export default ReviewForm