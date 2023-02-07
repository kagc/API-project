import './ReviewsBySpot.css'
import { getAllReviews } from '../../store/reviews'
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, Route, useParams, Link, useHistory } from 'react-router-dom';
import { tossReview } from '../../store/reviews'
import { getAllSpots, getOneSpot } from '../../store/spots';
import EditReviewForm from '../EditReviewForm';
import OpenModalButton from '../OpenModalButton';


function ReviewsBySpot({spot}) {
    const { spotId } = useParams()
    const dispatch = useDispatch()
    const history = useHistory()
    const ulRef = useRef();
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        dispatch((getAllReviews(spot.id)))
        dispatch((getOneSpot(spot.id)))
    },[ dispatch])
    // console.log(spotId)

    // const spot = useSelector(state => state.spots.singleSpot)
    // console.log(spot)
    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
      };
    
      useEffect(() => {
        if (!showMenu) return;
    
        const closeMenu = (e) => {
          if (!ulRef.current.contains(e.target)) {
            setShowMenu(false);
          }
        };
    
        document.addEventListener('click', closeMenu);
    
        return () => document.removeEventListener("click", closeMenu);
      }, [showMenu]);
    
      const closeMenu = () => setShowMenu(false);

    const user = useSelector(state => state.session.user)
    const reviewsObj = useSelector(state => state.reviews.allReviews)
    const reviews = Object.values(reviewsObj)
    // const reviewsO = Object.values(reviews)
    let added = 0
    if(reviews.length){reviews.forEach(review => {
        added += review.stars
        // console.log('added', added)
    })}
    let avg = added/reviews.length
    let avgStars = parseFloat(avg.toPrecision(3))
    console.log('user', user)
    // console.log(avgStars)

    let thisReview

    // if(!user) return null
    if(reviews === undefined) return null

    return (
        <div className='reviews-holder'>
            <div className='reviews-bar'>
            <span className='space-text'>
                <i className="fa-solid fa-star"></i>{reviews.length === 0 ? '0' : avgStars}
                </span>
            ·
            <span className='space-text'>

            {reviews.length} reviews
            </span>
            </div>
            <div className='review-contents'>
               {reviews.length ? reviews.map(review => {
                return (
                    <div className='each-review' key={review.id}>
                        <div className='review-firstname'>
                        <i id='review-cat' className="fa-solid fa-cat"></i>
                        {review.User.firstName}
                        </div>

                        <div className='review-contents'>
                            {review.review}
                        </div>

                        <div className='delete-rev-button-holder'>
                        {user !== null && 
                        (user.id === review.User.id && (
                        <div>
                            <OpenModalButton 
                        modalComponent={<EditReviewForm reviewId={review.id}/>}
                        buttonText='Edit Review'
                        onButtonClick={closeMenu}
                        className='edit-rev-button'/>
                        <button className='delete-rev-button' onClick={ async (e) => {
            e.preventDefault();
            const deleted = await dispatch((tossReview(review.id)))
            if (deleted){
            history.push(`/spots/${review.spotId}`)
            }
        }}>Delete Review</button>
        </div>
        ))}
                        </div>
                    </div>
                    
                )
            }) : (<div className='no-reviews'>This spot has no reviews.</div>)}
        </div> 
            </div>
            
    )
}

export default ReviewsBySpot