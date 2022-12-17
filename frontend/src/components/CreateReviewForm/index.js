import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { makeReview } from "../../store/reviews";
import OpenModalButton from '../OpenModalButton';
import ReviewsBySpot from "../ReviewsBySpot";
import { useModal } from '../../context/Modal';
import './CreateReviewForm.css'

const CreateReviewForm = () => {
    const { spotId } = useParams()
    const dispatch = useDispatch()
    const history = useHistory()
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();

    const [review, setReview] = useState('')
    const [stars, setStars] = useState('1')
    const [errors, setErrors] = useState([]);

    const { closeModal } = useModal();

    const spot = useSelector(state => state.spots.singleSpot)

    const reviews = useSelector(state => state.reviews.allReviews)
    // console.log(spot.id)

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

        const newReview = {
            review,
            stars
        }
        setErrors([]);
        const madeReview = await dispatch(makeReview(spot.id, newReview))
        .catch(
            async (res) => {
                let errors = []
                const data = await res.json();
                // console.log(data.statusCode)
                errors.push(data.message)
              if (data && data.statusCode > 400) setErrors(errors);
            }
          );

        if (madeReview) {
            closeModal()
            return history.push(`/spots/${spot.id}`)
        }
    }

    if(!spot) return null

    return (
        <div className='reviewform-holder'>

<div className='reviewspot-line-holder'>

<h1 className='reviewspot-line'>What Did You Think?</h1>
</div>


<div className='welcome'> <h3 className='weclome-h3'>Give Your Rating</h3></div>


<div className='form-holder'>
 <form className='createreview-css' onSubmit={handleSubmit}>
            <ul className='errorlist'>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>

            <div className='starinput-holder'>
              <div className='stars-input'>
            <div className='eachstar'>
                 {/* <label> */}
        <input
        className='just-this-one-input'
          type="radio"
          value='1'
          name="star"
          default
          onChange={(e) => setStars(e.target.value)}
          checked={stars === '1'}
        />
        <div className='starcontainer'>
<i className="fa-solid fa-star"></i>
        </div>
        
      {/* </label> */}
            </div>

           <div className='eachstar'>  
      {/* <label> */}
        <input
          type="radio"
          value='2'
          name="star"
          onChange={(e) => setStars(e.target.value)}
          checked={stars === '2'}
        />
        <div className='starcontainer'>
          <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
        </div>
        
      {/* </label> */}
      </div>

      <div className='eachstar'>
      {/* <label> */}
        <input
          type="radio"
          value='3'
          name="star"
          onChange={(e) => setStars(e.target.value)}
          checked={stars === '3'}
        />
        <div className='starcontainer'>
          <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
        </div>
        
      {/* </label> */}
      </div>
      <div className='eachstar'>
      {/* <label> */}
        <input
          type="radio"
          value='4'
          name="star"
          onChange={(e) => setStars(e.target.value)}
          checked={stars === '4'}
        />
        <div className='starcontainer'>
          <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
        </div>
        
      {/* </label>
      <label> */}
      </div>

      <div className='eachstar'>
        <input
          type="radio"
          value='5'
          name="star"
          onChange={(e) => setStars(e.target.value)}
          checked={stars === '5'}
        />
        <div className='starcontainer'>
          <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
        </div>
        
      {/* </label> */}
      </div>
            </div>
              </div>
            

                <div>
                    <div className='welcome'>
                        <h3 className='weclome-h3'>Share your thoughts</h3>
                    </div>
                    <div className='input-holder1'>
                    <input type='text'
                    className='input-line4'
                    required
                    maxlength='255'
                    placeholder={`I stayed at ${spot.name}, and it was...`}
                    value={review}
                    onChange={(e) => setReview(e.target.value)}></input>
                </div>
                </div>
                <div>
                <button >Submit Your Review</button>
                
                {/* <OpenModalButton
                modalComponent={<ReviewsBySpot spot={spot}/>}
                buttonText={`Submit Your Review`}
                onButtonClick={closeMenu} /> */}
                </div>
            </form>
  </div>



           
        </div>
    )
}

export default CreateReviewForm;