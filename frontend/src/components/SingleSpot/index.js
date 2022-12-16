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

    //   if (user.user === null) return null
    if(!spot || !spot.SpotImages || !reviewsObj || !reviews || !user ) return null
    
    let added = 0
    let userReviewed
    if(reviews.length){reviews.forEach(review => {
        added += review.stars
        // console.log('rev', review.User.id)
        if(user.user !== null){

            if(user.user.id === review.User.id) userReviewed = review.User.id
        }
    })}
    let avgStars = added/reviews.length

    return (
        <div className='wholething'>
            <div className='content'>
            <div>
                <h1 className='name'>
                    {spot.name}
                </h1>
                <div className='infobar'><span><i className="fa-solid fa-star"></i>
                    {reviews.length === 0 ? '0' : avgStars}</span>
        ·
                    <span>
                        {/* <OpenModalButton 
                        modalComponent={<ReviewsBySpot spot={spot}/>}
                        buttonText={`${reviews.length} reviews`}
                        onButtonClick={closeMenu}
                        className='review-button'/> */}
                        {`${reviews.length} reviews`}
                    </span>
                    ·
                    <span className='location'>{spot.city}, {spot.state}, {spot.country}</span>
                </div>
            </div>

            <div className='img-container'>
                {spot.SpotImages.map(image => {
                    return (
                        <img className='img' key={image.id} src={`${image.url}`}></img>
                    )
                })}
            </div>
<div className='infos'>
            <div className='leftbox'>
                <h2>Spot hosted by {spot.Owner.firstName}</h2>

                <div className='descr'>

<span className='descr2'>{spot.description}</span>
</div>
            </div>

            <div>
                <div className='floaty-box'>
                    <div className='topline'>
                    <div>

                    <span className='floaty-box-price'><span className='floaty-price'>${spot.price}</span> night</span>
                    </div>

                    <div>

                    <span><i className="fa-solid fa-star"></i>{reviews.length === 0 ? '0' : avgStars}</span>
                    <span>·
                        {/* <OpenModalButton 
                        modalComponent={<ReviewsBySpot spot={spot}/>}
                        buttonText={`${reviews.length} reviews`}
                        onButtonClick={closeMenu}/> */}
                        {`${reviews.length} reviews`}
                        </span>
                        </div>
                       </div>
                       <div className='reserve-button-div'>
                       <button className='cant-reserve'>Reserve Coming Soon</button>

                       </div>
                       <div className='totalPrice'>
                        <span>Total before taxes</span> <span>${spot.price}</span>
                       </div>
                
                </div>
            </div>
</div>
           

            <div className='reviews-box'>
            
            <div>
                <ReviewsBySpot spot={spot} reviews={reviews}/>
            </div>

                  </div>
                        <div className='write-rev-button-holder'>
                       {user.user !== null && user.user.id !== userReviewed && ( <OpenModalButton 
                        modalComponent={<CreateReviewForm />}
                        buttonText='Write a Review'
                        onButtonClick={closeMenu}
                        className='write-rev-button'/>)}
                        </div>
            

            </div>
            
        </div>
    )
}

export default SingleSpot