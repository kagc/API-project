import './ReviewsBySpot.css'
import { getAllReviews } from '../../store/reviews'
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, Route, useParams, Link, useHistory } from 'react-router-dom';
import { tossReview } from '../../store/reviews'


function ReviewsBySpot({spot}) {
    const { spotId } = useParams()
    const dispatch = useDispatch()
    const history = useHistory()

    useEffect(() => {
        dispatch((getAllReviews(spot.id)))
    },[ dispatch])

    // const spot2 = useSelector(state => state.spots.singleSpot)

    const user = useSelector(state => state.session.user)
    const reviewsObj = useSelector(state => state.reviews.allReviews)
    const reviews = Object.values(reviewsObj)
    // const reviewsO = Object.values(reviews)
    // return console.log('reviews', reviews)
    // console.log('user', user.id)
    // console.log('review', reviewsObj[1].userId)

    if(!user) return null
    if(reviews === undefined) return null

    return (
        <div>
            <div>
            <i className="fa-solid fa-star"></i>{spot.avgRating}·{spot.numReviews} reviews
            </div>
            {reviews && reviews.map(review => {
                return (
                    <div key={review.id}>

                        {review.User.firstName}

                        <div>
                            {review.review}
                        </div>

                        <div>
                        {user.id === review.User.id && (<button onClick={ async (e) => {
            e.preventDefault();
            const deleted = await dispatch((tossReview(review.id)))
            if (deleted){
            history.push(`/spots/${review.spotId}`)
            }
        }}>Delete Review</button>)}
                        </div>
                    </div>
                    
                )
            })}
        </div>
    )
}

export default ReviewsBySpot