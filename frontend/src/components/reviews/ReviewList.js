import React from 'react'
import ReviewCard from './ReviewCard'

const ReviewList = (props) => {

    const [reviews, setReviews] = React.useState([])

    const {tutor} = props

    // load existing comments
    React.useEffect(() => {
        fetch(`/api/reviews/tutor/${tutor._id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then( response => response.json())
        .then( data => {
            if (data){
                setReviews(data)
            }
        })
    }, [tutor])

    const reviewCards = reviews.map( (review, index) => <ReviewCard key={index} review={review}/>)

    return <> {reviewCards} </>
}

export default ReviewList