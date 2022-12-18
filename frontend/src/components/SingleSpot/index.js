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
            if(!res) {
                alert(`Sorry, couldn't seem to find that spot. Returning to Home page.`)
                history.push('/')
            }
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
    let avg = added/reviews.length
    let avgStars = parseFloat(avg.toPrecision(3))

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
                    <span title='Unable to retrieve map at this time' className='location'>{spot.city}, {spot.state}, {spot.country}</span>
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
                <div className='hostbox'>

                    <div className='left-hostbox'>
                        <h2 className='hostedby-text'>Spot hosted by {spot.Owner.firstName}</h2>
                <p className='subhostedby-text'>4 cats · 1 pillow · 1,000 cat hairs</p>
                    </div>
                    
                    <div className='host-icon'><i id='host-cat' className="fa-solid fa-cat"></i></div>
                
                </div>
                

<div className='extra-infobox'>
    <div className='extra-deets'>
    <i className="fa-solid fa-shield-cat"></i>
    <div className='more-deets'>
        <h4 className='bold-deet'>Accidental damage protection</h4>
        <span className='subdeet'>Because cats.</span>
    </div>
    </div>

    <div className='extra-deets'>
    <i class="fa-solid fa-paw"></i>
    <div className='more-deets'>
        <h4 className='bold-deet'>Pet-friendly</h4>
        <span className='subdeet'>Also because cats.</span>
    </div>
    </div>

    <div className='extra-deets'>
    <i class="fa-regular fa-calendar"></i>
    <div className='more-deets'>
        <h4 className='bold-deet'>Free cancellation for 48 hours.</h4>
        <span className='subdeet'>You'll miss out on the cats, though.</span>
    </div>
    </div>


</div>

<div className='extra-infobox'>
<img className='aircover' src='https://a0.muscache.com/im/pictures/54e427bb-9cb7-4a81-94cf-78f19156faad.jpg' ></img>
<span className='subdeet2'>Every booking includes a thick blanket to cover yourself with for when the cats have their scheduled 3AM zoomies through the air.</span>

</div>

                <div className='descr'>

<span className='descr2'>{spot.description}</span>
</div>

<div className='extra-infobox'>
<h2 className='where-sleep'>Where you'll sleep</h2>

<div className='sleepbox'>

    <div className='boxbox'><i class="fa-solid fa-box-open"></i>
    <span className='sleep-i'>Box</span>
    <span className='sleep-ii'>1 box</span></div>

    <div className='boxbox'><i class="fa-solid fa-bread-slice"></i>
    <span className='sleep-i'>Breadbed</span>
    <span className='sleep-ii'>1 bed, shaped like bread</span>
    </div>
</div>

</div>

<div className='extra-infobox'>
<h2 className='where-sleep'>What this place offers</h2>

<div className='ammenities'>

<i class="fa-solid fa-feather"></i> <span>Incredible feather toy</span>
</div>

</div>

            </div>
                <div className='another-div'>
                    <div className='floaty-box-holder'>
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


                        <div className='midholder'>

 <div className='reserve-box' title='Unable to make reservations at this time'>
    {/* <hr></hr> */}
    <h2></h2>
    {/* <h2></h2> */}
 </div>
                       <div className='reserve-button-div' title='Unable to make reservations at this time'>
                       <button className='cant-reserve'>Reserve Coming Soon</button>

                       </div>

                        </div>
                       
                       <div className='totalPrice'>
                        <span>Total before taxes</span> <span>${spot.price}</span>
                       </div>
                
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