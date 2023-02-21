import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import { Link, Route, useHistory } from "react-router-dom";
import { getUserBookings, removeBooking } from '../../store/bookings'
import { getAllSpots } from "../../store/spots";
import OpenModalButton from '../OpenModalButton';
import EditReviewForm from '../EditReviewForm';
import './UserBookings.css'
import EditBookingForm from "../EditBooking";
import { useModal } from '../../context/Modal';

const UserBookings = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const ulRef = useRef();
  const [showMenu, setShowMenu] = useState(false);

  const { closeModal } = useModal();

  const today = new Date()

  const month = ["January", "February", "March", "April", "May", "June", "July", "Augst", "September", "October", "November", "December"]

  useEffect(() => {
    dispatch(getUserBookings())
    dispatch(getAllSpots());
  }, [dispatch, showMenu]);

  const bookingsObj = useSelector(state => state.bookings.userBookings)
  const bookings = Object.values(bookingsObj)
  // console.log('reviews',reviews)
  const spotsObj = useSelector((state) => state.spots.allSpots);
  const spots = Object.values(spotsObj);

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
  
  if(!bookingsObj || !spotsObj) return null
  
  return (
    <div>
      <div className='all-spots'>
        <h2 className='yourreviews'>Your Bookings</h2>
        <div className="your-reviews">
          {bookings.length ? (
            bookings.map(booking => {

              let date1 = new Date(booking.startDate)
              // let sd = newStartDate.toJSON().slice(0,10)
              let date2 = new Date(booking.endDate)
              // let ed = newStartDate.toJSON().slice(0,10)
              return (
                <div key={booking.id}>
                  <Link to={`/spots/${booking.Spot.id}`}>
                    <div>
                      <div
                        className="preview-image"
                        style={{
                          backgroundImage: `url('${booking.Spot.previewImage}')` }}></div>
                      <div className="spots-details2">
                        <div className="spots-details-top">
                          <div className="manage-spotname">{booking.Spot.name}</div>
                          <div className="manage-place">
                            {booking.Spot.city}, {booking.Spot.state}
                          </div>
                        </div>
                          <div><span className='price'>Check In: {month[new Date(booking.startDate).getMonth()]} {new Date(booking.startDate).getDate()}, {new Date(booking.startDate).getFullYear()}</span> </div>
                          <div className='reviewtext-holder'><span className='reviewtext'>Check Out: {month[new Date(booking.endDate).getMonth()]} {new Date(booking.endDate).getDate()}, {new Date(booking.endDate).getFullYear()}</span></div>

                        </div>
                    </div>
                  </Link>

                  <div className="manage-button-holder">
                              <div className="manage-buttons">
                                <div className='bottom-button'>
                                
                                <OpenModalButton 
                        modalComponent={<EditBookingForm bookingId={booking.id} bookingData={booking}/>}
                        buttonText='Edit Reservation'
                        onButtonClick={closeMenu}
                        className='edit-rev-button'/>

                            {date1 > today ? <button
                                  className="delrev-button"
                                    onClick={async (e) => {
                                      e.preventDefault();
                                      const deleted = await dispatch(
                                        removeBooking(booking.id)
                                      );
                                      if (deleted) {
                                        history.push(`/manage-bookings`);
                                      }
                                    }}
                                  >
                                    Delete Booking
                                  </button> : <div id="no-delete" disabled>Cannot delete if Check In has passed</div>}
                                  </div>
                              </div>
                            </div>
                  </div>
                // </div>
              );
            })
          ) : (
            <div>You have no bookings at this time.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserBookings;
