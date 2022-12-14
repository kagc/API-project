import './ReviewsBySpot.css'
import { getAllReviews } from '../../store/reviews'
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, Route, useParams, Link } from 'react-router-dom';


function ReviewsBySpot({spot}) {
    const { spotId } = useParams()
    const dispatch = useDispatch()

    const reviewsObj = useSelector(state => state.reviews.allReviews)
    const reviews = Object.values(reviewsObj)
    // console.log('reviews', reviews)
    console.log('spot', spot.avgRating)

    useEffect(() => {
        dispatch((getAllReviews(spot.id)))
    },[ dispatch])

    return (
        <div>
            <div>
            <i className="fa-solid fa-star"></i>{spot.avgRating}·{spot.numReviews} reviews
            </div>
            {reviews.map(review => {
                return (
                    <div key={review.id}>

                        {review.User.firstName}

                        <div>
                            {review.review}
                        </div>

                        <div>

                        </div>
                    </div>
                    
                )
            })}
        </div>
    )
}

export default ReviewsBySpot