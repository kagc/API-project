// import './UserReviews.css'
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import { Link, Route, useHistory } from 'react-router-dom'
import { getUsersReviews, tossReview } from '../../store/reviews';
import { getAllSpots } from '../../store/spots';

const UserReviews = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    
        useEffect(() => {
            dispatch(getUsersReviews())
            dispatch(getAllSpots())
        }, [dispatch])

    const reviewsObj = useSelector(state => state.reviews.userReviews)
    const reviews = Object.values(reviewsObj)
    // console.log('reviews',reviews)
    const spotsObj = useSelector(state => state.spots.allSpots)
    const spots = Object.values(spotsObj)
    // console.log('spots', Object.values(spots))
    // reviews.forEach(review => {
    //     if(Object.values(spots).id === review.spotId) console.log('!!!!', review)
    // })
    let reviewsList = []
    let spotList = []
    spots.forEach(spot => {
        reviews.forEach(review => {
            if(spot.id === review.spotId) {
                reviewsList.push(review)
                spotList.push(spot)
            }
        })
    })
    // console.log('spotlist', spotList)
    // console.log('reviewList', reviewsList)


    // if(reviews.length === 0) return null
    return(
        <div>
            <div>
                <h2>Your Reviews</h2>
            </div>
            {
                spotList.map(spot => {

                    return (
                        <div key={spot.id}>
                            {/* {console.log(spot.id)} */}
                            <div 
                        className="preview-image"
                        style={{ backgroundImage: `url('${spot.previewImage}')` }}></div>


                            <div>{spot.name}</div>


                            <div>
                            {reviewsList.map(review => {
                                if(review.spotId === spot.id){
                                    return (
                                        <div>
                                            <span>

                                            <i className="fa-solid fa-star"></i>{review.stars}
                                            </span>
                                            <span>

                                            {review.review}
                                            </span>

                                            <div>
                        {(<button onClick={ async (e) => {
            e.preventDefault();
            const deleted = await dispatch((tossReview(review.id)))
            if (deleted){
                alert('Review deleted')
            history.push(`/manage-reviews`)
            }
        }}>Delete Review</button>)}
                        </div>
                                            </div>
                                    )
                                }
                            })}


                            </div>
                        </div>

                        
                    )
                }
            )}
        </div>
    )
}

export default UserReviews