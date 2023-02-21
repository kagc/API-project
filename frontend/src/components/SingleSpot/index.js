import { Link, useParams, useHistory, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import React, { useState, useEffect, useRef } from 'react';
import { getOneSpot, nukeSpot } from '../../store/spots'
import { getUserSpots } from '../../store/spots';
import OpenModalMenuItem from '../Navigation/'
import CreateReviewForm from '../CreateReviewForm';
import OpenModalButton from '../OpenModalButton';
import ReviewsBySpot from '../ReviewsBySpot';
import { createBooking, getAllBookings, getUserBookings } from '../../store/bookings';
// import CreateBookingForm from '../CreateBooking';
import { useModal } from '../../context/Modal';
import './SingleSpot.css'
import { getAllReviews, tossReview } from '../../store/reviews'
import UserBookings from '../UserBookings';
import EditBookingForm from '../EditBooking';

function SingleSpot() {
    let { spotId } = useParams()
    const dispatch = useDispatch()
    const [showMenu, setShowMenu] = useState(false);
    // const [alreadyReviewed, setAlreadyReviewed] = useState(false)
    const ulRef = useRef();
    const history = useHistory()

    Date.prototype.addDays = function(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
      }

    const tempDate = new Date()
    const tomorrow = tempDate.addDays(1)
    const tempTomorrow = tomorrow.toJSON().slice(0,10)
    
    const end = tomorrow.addDays(1)
    const tempEnd = end.toJSON().slice(0,10)
    
    
    const [startDate, setStartDate] = useState(tempTomorrow)
    const [limit, setLimit] = useState('')
    const [numNights, setNumNights] = useState(1)
    const [endDate, setEndDate] = useState(tempEnd)
    // console.log("end", endDate)
    
    const [errors, setErrors] = useState([]);
    useEffect(() => {
        dispatch(getAllReviews(spotId))
        .then(res => {
            if(!res) alert('oh no')
        })
        
        dispatch(getOneSpot(spotId))
        .then(res => {
            // console.log('res', res)
            if(!res) {
                // alert(`Sorry, couldn't seem to find that spot. Returning to Home page.`)
                history.push('/page-not-found')
            }
        })

        dispatch(getAllBookings(spotId))

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
    const allBookingsObj = useSelector(state => state.bookings.allBookings)
    const allBookings = Object.values(allBookingsObj)
    
    let userBooked
    // const [pastDate, setPastDate] = useState(false)
    let pastDate = false
    if(user.user !== null && allBookings.length > 0){
        userBooked = allBookings.filter(booking => booking.userId === user.user.id)
        let now = new Date()
        if(userBooked.length > 0){
            let bookingEnd = new Date(userBooked[0].endDate)
        // console.log("AAAAAAA", now, bookingEnd)
        if (bookingEnd > now){
            pastDate = true
        }
        }
        
    }
    // console.log("spot reloaded", userBooked[0].id)
    // console.log('AAAAAAA', userBooked)
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

      const handleSubmit = async (e) => {
        e.preventDefault()

        const newBooking = {
            spotId,
            startDate,
            endDate,
            userId: user.user.id
        }

        setErrors([]);
        // console.log("THIS IS A NEW BOOKING",newBooking)
        const madeBooking = await dispatch(createBooking(newBooking))
        .catch(
            async (res) => {
                let errors = []
                const data = await res.json()
                errors.push(data.message)
                if(data && data.statusCode > 400) setErrors(errors)
            }
        )

        if (madeBooking) {
            return history.push(`/manage-bookings`)
        }


      } 

    //   if (user.user === null) return null
    if(!spot || !spot.SpotImages || !reviewsObj || !reviews || !user || !allBookingsObj) return null
    
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
{/* ---------------------------------BOOKING------------------------------------- */}
            </div>
            {pastDate && userBooked !== null && userBooked.length > 0 ? 
            
            // <EditBookingForm bookingId={userBooked[0].id}/> 
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
    {/* {user.user !== null ? <div></div> : <div></div>} */}
<div><button onClick={(e) => {
    e.preventDefault()
    history.push(`/manage-bookings`)
}} id="booked-button">Booked! <br></br>Manage Reservation</button></div>
                        </div>

                        <div className="calc-box">
                            <div className="calc-equ">${spot.price} {numNights > 0 ? `x ${numNights} night${numNights === 1 ? '' : 's'}` : 'x 0 nights'}</div>
                            <div>${numNights > 0 ? spot.price*numNights : 0}</div>
                        </div>
                       
                       <div className='totalPrice'>
                        <span>Total before taxes</span> <span>${spot.price*numNights}</span>
                       </div>
                
                </div>
            </div>
            </div>

            : <div className='another-div'>
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
    {/* {user.user !== null ? <div></div> : <div></div>} */}
<form onSubmit={handleSubmit}>
 <div className='reserve-box'>
    {/* <hr></hr> */}

{/* ---------------------------------CREATE BOOKING------------------------------- */}
    <label>Check-In</label>
    <input
    className="b-input-line"
    placeholder='CHECK-IN'
    value={startDate}
    type="date"
    name="startDate"
    min={tempTomorrow}
    onChange={(e) => {
        setStartDate(e.target.value)
        let date1 = new Date(e.target.value);
        let date2 = new Date(endDate);
        let diffTime = date2.getTime() - date1.getTime()
        let diffDays = diffTime / (1000 * 60 * 60 * 24)
        
        // let oneDay = 24 * 60 * 60 * 1000
        // let splitStart = startDate.split('-')
        // let splitEnd = endDate.split('-')
        // console.log(splitStart)
        // let firstDate = new Date(splitStart[2], splitStart[0], splitStart[1])
        // let secondDate = new Date(splitEnd[2], splitEnd[0], splitEnd[1])
        // let diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay))

        if (date1 < date2){
            // console.log("AAAAA", diffTime, date1, date2)
            setNumNights(diffDays)
        } else {
            setNumNights(0)
        }
        // setLimit(startDate.addDays(1).toJSON().slice(0,10))
        }}>
    </input>

    <label>Checkout</label>
    <input
    placeholder='CHECKOUT'
    className="b-input-line2"
    value={endDate}
    type="date"
    name="endDate"
    min={tempEnd}
    onChange={(e) => {
        
        setEndDate(e.target.value)
        
        let date1 = new Date(startDate);
        let date2 = new Date(e.target.value);
        let diffTime = date2.getTime() - date1.getTime()
        let diffDays = diffTime / (1000 * 60 * 60 * 24)

        // let oneDay = 24 * 60 * 60 * 1000
        // let splitStart = startDate.split('-')
        // let splitEnd = endDate.split('-')
        // let firstDate = new Date(splitStart[2], splitStart[0], splitStart[1])
        // let secondDate = new Date(splitEnd[2], splitEnd[0], splitEnd[1])
        // let diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay))
        if (date1 < date2){
            // console.log("AAAAA", diffTime, date1,date2)
            setNumNights(diffDays)
        } else {
            setNumNights(0)
        }
        }}>
    </input>
    <h2></h2>
    {/* <h2></h2> */}
 </div>
                       <div className='reserve-button-div' 
                    //    title='Unable to make reservations at this time'
                       >
                        {user.user !== null ? (!numNights > 0 ? <div className="min-not-met">Stay must be one night or longer</div> : <button className='reserve-button'>Reserve Spot</button>) : <div id="no-delete">Login/Signup to book</div>}
                        
                       

                       </div>
                       <div className="charged-text"><span>You won't be charged yet.</span></div>
</form>
                        </div>

                        <div className="calc-box">
                            <div className="calc-equ">${spot.price} {numNights > 0 ? `x ${numNights} night${numNights === 1 ? '' : 's'}` : 'x 0 nights'}</div>
                            <div>${numNights > 0 ? spot.price*numNights : 0}</div>
                        </div>
                       
                       <div className='totalPrice'>
                        <span>Total before taxes</span> <span>${spot.price*numNights}</span>
                       </div>
                
                </div>
            </div>
                </div> }
                
            
</div>
           
{/* -----------------------------------REVIEWS--------------------------------- */}
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