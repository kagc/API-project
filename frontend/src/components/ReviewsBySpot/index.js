import './ReviewsBySpot.css'
import { getAllReviews } from '../../store/reviews'
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, Route, useParams, Link, useHistory } from 'react-router-dom';
import { tossReview } from '../../store/reviews'
import { getAllSpots, getOneSpot } from '../../store/spots';


function ReviewsBySpot({spot}) {
    const { spotId } = useParams()
    const dispatch = useDispatch()
    const history = useHistory()

    useEffect(() => {
        dispatch((getAllReviews(spot.id)))
        dispatch((getOneSpot(spot.id)))
    },[ dispatch])
    // console.log(spotId)

    // const spot = useSelector(state => state.spots.singleSpot)
    // console.log(spot)

    const user = useSelector(state => state.session.user)
    const reviewsObj = useSelector(state => state.reviews.allReviews)
    const reviews = Object.values(reviewsObj)
    // const reviewsO = Object.values(reviews)
    let added = 0
    if(reviews.length){reviews.forEach(review => {
        added += review.stars
        // console.log('added', added)
    })}
    let avgStars = added/reviews.length
    // console.log(avgStars)

    if(!user) return null
    if(reviews === undefined) return null

    return (
        <div>
            <div>
            <i className="fa-solid fa-star"></i>{reviews.length === 0 ? '0' : avgStars}·{reviews.length} reviews
            </div>
            {reviews.length ? reviews.map(review => {
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
            }) : (<div>This spot has no reviews.</div>)}
        </div>
    )
}

export default ReviewsBySpot