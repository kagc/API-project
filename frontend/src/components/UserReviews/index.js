import './UserReviews.css'
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import { Link, Route, useHistory } from "react-router-dom";
import { getAllReviews, getUsersReviews, tossReview } from "../../store/reviews";
import { getAllSpots } from "../../store/spots";
import OpenModalButton from '../OpenModalButton';
import EditReviewForm from '../EditReviewForm';

const UserReviews = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const ulRef = useRef();
    const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    dispatch(getUsersReviews());
    dispatch(getAllReviews())
    dispatch(getAllSpots());
  }, [dispatch, showMenu]);

  const reviewsObj = useSelector((state) => state.reviews.userReviews);
  const reviews = Object.values(reviewsObj);
  // console.log('reviews',reviews)
  const spotsObj = useSelector((state) => state.spots.allSpots);
  const spots = Object.values(spotsObj);
  // console.log('spots', Object.values(spots))
  // reviews.forEach(review => {
  //     if(Object.values(spots).id === review.spotId) console.log('!!!!', review)
  // })
  // console.log('reviews', reviews)

  // let reviewsList = [];
  // let spotList = [];
  // spots.forEach((spot) => {
  //   reviews.forEach((review) => {
  //     if (spot.id === review.spotId) {
  //       reviewsList.push(review);
  //       spotList.push(spot);
  //     }
  //   });
  // });

  // let currReviews
  //   let tempReview
  //   let tempStars
    // if(reviewsObj) {
    //   currReviews = Object.values(reviewsObj)
    // }
    // let reviewId
    // const [ reviewId, setReviewId ] = useState("")
    // console.log(reviewId)

    // const thisReview = reviews.filter(review => review.id === reviewId)
    // if(thisReview.length > 0) {
    //     tempReview = thisReview[0].review
    //     tempStars  = thisReview[0].stars
    // }
    // const [review, setReview] = useState(tempReview)
    // const [stars, setStars] = useState(`${tempStars}`)
    // const [errors, setErrors] = useState([]);

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
  if(!reviewsObj || !spotsObj) return null
  
  return (
    <div>
      <div className='all-spots'>
        <h2 className='yourreviews'>Your Reviews</h2>
        <div className="your-reviews">
          {reviews.length ? (
            reviews.map(review => {
              return (
                <div key={review.id}>
                  <Link to={`/spots/${review.Spot.id}`}>
                    <div>
                      <div
                        className="preview-image"
                        style={{
                          backgroundImage: `url('${review.Spot.previewImage}')` }}></div>
                      <div className="spots-details2">
                        <div className="spots-details-top">
                          <div className="manage-spotname">{review.Spot.name}</div>
                          <div className="manage-place">
                            {review.Spot.city}, {review.Spot.state}
                          </div>
                        </div>
                          <div><span className='price'><i className="fa-solid fa-star"></i>{review.stars}</span> </div>
                          <div className='reviewtext-holder'><span className='reviewtext'>{review.review}</span></div>

                        </div>
                    </div>
                  </Link>

                  <div className="manage-button-holder">
                              <div className="manage-buttons">
                                <div className='bottom-button'>
                                
                                <OpenModalButton 
                        modalComponent={<EditReviewForm reviewId={review.id} reviewData={review}/>}
                        buttonText='Edit Review'
                        onButtonClick={closeMenu}
                        className='edit-rev-button'/>

                                  <button
                                  className="delrev-button"
                                    onClick={async (e) => {
                                      e.preventDefault();
                                      const deleted = await dispatch(
                                        tossReview(review.id)
                                      );
                                      if (deleted) {
                                        history.push(`/manage-reviews`);
                                      }
                                    }}
                                  >
                                    Delete Review
                                  </button>
                                  </div>
                              </div>
                            </div>
                  </div>
                // </div>
              );
            })
          ) : (
            <div>You have no reviews at this time.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserReviews;
