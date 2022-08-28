import React from 'react'

import StarRatings from 'react-star-ratings'

const ReviewCard = (props) => {
    const { review } = props;
    const { student_name, rating, comment } = review

    return (
        <div className='card mb-3' style={{ maxWidth: '40em', margin:'0.5em' }}>
            <div className="row g-0">
                <div className="col-md-8">
                    <div className="card-body">
                        <h5 className="card-title">{student_name}</h5>
                        <StarRatings rating={rating} starRatedColor='gold' starDimension='1em' starSpacing='0.1em' />
                        <p className="card-text"> {comment} </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewCard;