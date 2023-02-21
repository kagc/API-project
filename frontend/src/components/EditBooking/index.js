import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import OpenModalButton from '../OpenModalButton';
import ReviewsBySpot from "../ReviewsBySpot";
import { useModal } from '../../context/Modal';
import { getAllReviews } from "../../store/reviews";
import { getOneSpot } from "../../store/spots";
import { getAllBookings, getOneBooking, modBooking } from "../../store/bookings";

const EditBookingForm = ({bookingId}) => {
    let { spotId } = useParams()
    const dispatch = useDispatch()
    // const ulRef = useRef();
    const history = useHistory()

    const allBookingsObj = useSelector(state => state.bookings.allBookings)
    const allBookings = Object.values(allBookingsObj)
    
    const user = useSelector(state => state.session)

    // const oneBookingObj = useSelector(state => state.bookings.oneBooking)
    // const oneBooking = Object.values(oneBookingObj)
    // console.log("ONEBOOKING", oneBooking)
    let today = new Date()

    let newStart
    let tempStart
    let newEnd
    let tempEnd
    let initDiffTime
    let initDiffDays
    
    let oneBooking
    if(allBookings.length > 0){
        oneBooking = allBookings.filter(aBooking => aBooking.id === bookingId)
    }
    // console.log("editform reloaded", oneBooking[0].id)

    let minStart
    let minEnd

    if(oneBooking.length === 1){
        newStart = new Date(oneBooking[0].startDate)
        tempStart = newStart.toJSON().slice(0,10)
        // console.log("tempstart", tempStart)
        newEnd = new Date(oneBooking[0].endDate)
        tempEnd = newEnd.toJSON().slice(0,10)
        initDiffTime = newEnd.getTime() - newStart.getTime()
        initDiffDays = initDiffTime / (1000 * 60 * 60 * 24)

        if(newStart < today){
            minStart = today.toJSON().slice(0,10)
        }
    }
    
    const [editStartDate, setEditStartDate] = useState(tempStart)
    const [numNights, setNumNights] = useState(initDiffDays)
    const [editEndDate, setEditEndDate] = useState(tempEnd)

    const [errors, setErrors] = useState([]);

    // console.log("OOOOOOO", editStartDate)

    useEffect(() => {
        dispatch(getAllReviews(spotId))
        .then(res => {
            if(!res) alert('oh no')
        })
        
        dispatch(getOneSpot(spotId))
        .then(res => {
            if(!res) {
                history.push('/page-not-found')
            }
        })

        dispatch(getAllBookings(spotId))
        // dispatch(getOneBooking(bookingId))
    }, [dispatch, spotId, bookingId])

    const reviewsObj = useSelector(state => state.reviews.allReviews)
    const reviews = Object.values(reviewsObj)
    const spot = useSelector(state => state.spots.singleSpot)

    const handleSubmit = async (e) => {
        e.preventDefault()

        const editedBooking = {
            // spotId,
            startDate: editStartDate,
            endDate: editEndDate,
            // userId: user.user.id
        }

        setErrors([]);
        // console.log("THIS IS A NEW BOOKING",newBooking)
        // return console.log("it;s edited",editedBooking)
        const madeBooking = await dispatch(modBooking(editedBooking, bookingId))
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
    if(!spot || !spot.SpotImages || !reviewsObj || !reviews || !user || !allBookingsObj 
        // || !oneBookingObj
        ) return null

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
<form onSubmit={handleSubmit}>
 <div className='reserve-box'>
    {/* <hr></hr> */}

{/* ---------------------------------CREATE BOOKING------------------------------- */}
    <label>Check-In</label>
    <input
    className="b-input-line"
    placeholder='CHECK-IN'
    value={editStartDate}
    type="date"
    name="startDate"
    min={tempStart > today ? tempStart : minStart}
    onChange={(e) => {
        setEditStartDate(e.target.value)
        let date1 = new Date(e.target.value);
        let date2 = new Date(editEndDate);
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
    value={editEndDate}
    type="date"
    name="endDate"
    min={tempEnd}
    onChange={(e) => {
        
        setEditEndDate(e.target.value)
        
        let date1 = new Date(editStartDate);
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
                        {user.user !== null ? (!numNights > 0 ? <div className="min-not-met">Stay must be one night or longer</div> : <button className='reserve-button'>Update Reservation</button>) : <div id="no-delete">Login/Signup to book</div>}
                        
                       

                       </div>
                       <div className="charged-text"><span>You won't be charged yet.</span></div>
                       <ul className='errorlist'>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
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
                </div>
    )
}

export default EditBookingForm;