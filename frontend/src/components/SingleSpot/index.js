import { Link, useParams, useHistory, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import React, { useState, useEffect, useRef } from 'react';
import { getOneSpot, nukeSpot } from '../../store/spots'
import OpenModalMenuItem from '../Navigation/'
import CreateReviewForm from '../CreateReviewForm';
import OpenModalButton from '../OpenModalButton';
import ReviewsBySpot from '../ReviewsBySpot';
import './SingleSpot.css'
import { getAllReviews, tossReview } from '../../store/reviews'

function SingleSpot() {
    let { spotId } = useParams()
    const dispatch = useDispatch()
    const [showMenu, setShowMenu] = useState(false);
    // const [alreadyReviewed, setAlreadyReviewed] = useState(false)
    const ulRef = useRef();
    const history = useHistory()

    useEffect(() => {
        dispatch(getAllReviews(spotId))
        .then(res => {
            if(!res) alert('oh no')
        })
        
        dispatch(getOneSpot(spotId))
        .then(res => {
            // console.log('res', res)
            if(!res) history.push('/')
        })

        // .catch(
        //     async (res) => {
        //         console.log(res)
        //         // if(!res.ok) console.log('dang')
        //         // const data = await res.json();
        //         // console.log(data)
        //     //   if (data && data.errors) console.log('no');
        //     }
        //   );
        // console.log('loaded', loadedSpot)
    }, [dispatch, spotId])

    const reviewsObj = useSelector(state => state.reviews.allReviews)
    const reviews = Object.values(reviewsObj)
    const spot = useSelector(state => state.spots.singleSpot)
    const user = useSelector(state => state.session)
    console.log('user', user)

    let added = 0
    let userReviewed
    if(reviews.length){reviews.forEach(review => {
        added += review.stars
        console.log('rev', review.User.id)
        if(user.user.id === review.User.id) userReviewed = review.User.id
    })}
    let avgStars = added/reviews.length
    // console.log(avgStars)

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


    if(!spot || !spot.SpotImages || !reviewsObj || !reviews || !user ) return null

    return (
        <div>
            <div>
                <h1>
                    {spot.name}
                </h1>
                <div><i className="fa-solid fa-star"></i>
                    <span>{reviews.length === 0 ? '0' : avgStars}</span>

                    <span>
                        <OpenModalButton 
                        modalComponent={<ReviewsBySpot spot={spot}/>}
                        buttonText={`${reviews.length} reviews`}
                        onButtonClick={closeMenu}/>
                    </span>
                        
                    <span>{spot.city}, {spot.state}, {spot.country}</span>
                </div>
            </div>

            <div className='img-container'>
                {spot.SpotImages.map(image => {
                    return (
                        <img className='img' key={image.id} src={`${image.url}`}></img>
                    )
                })}
            </div>

            <div>
                <h2>Spot hosted by {spot.Owner.firstName}</h2>
            </div>

            <div>
                <div>
                    <span>${spot.price}</span> <span>night</span>

                    <i className="fa-solid fa-star"></i>
                    <span>{reviews.length === 0 ? '0' : avgStars}</span>
                    <span><OpenModalButton 
                        modalComponent={<ReviewsBySpot spot={spot}/>}
                        buttonText={`${reviews.length} reviews`}
                        onButtonClick={closeMenu}/></span>

                </div>
            </div>

            <div className='descr'>
                <span>{spot.description}</span>
            </div>

            <div>
            {/* <div>
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
                        {user.user !== null && user.user.id === review.User.id && (<button onClick={async (e) => {
        e.preventDefault();
        const deleted = await dispatch((tossReview(review.id)))
        if (deleted){
        history.push(`/spots/${spotId}`)
        }
    }}>Delete Review</button>)}
                        </div>
                    </div>
                )
                
            })} */}
            <div>
                <ReviewsBySpot spot={spot} reviews={reviews}/>
            </div>

                    <div>
                       {user.user !== null && user.user.id !== userReviewed && ( <OpenModalButton 
                        modalComponent={<CreateReviewForm />}
                        buttonText='Write a Review'
                        onButtonClick={closeMenu}/>)}
                        </div>
            </div>
            
        </div>
    )
}

export default SingleSpot