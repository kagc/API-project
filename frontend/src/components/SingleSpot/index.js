import { Link, useParams, useHistory, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import React, { useState, useEffect, useRef } from 'react';
import { getOneSpot, nukeSpot } from '../../store/spots'
import OpenModalMenuItem from '../Navigation/'
import OpenModalButton from '../OpenModalButton';
import ReviewsBySpot from '../ReviewsBySpot';
import './SingleSpot.css'

function SingleSpot() {
    let { spotId } = useParams()
    const dispatch = useDispatch()
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();
    const history = useHistory()
    
    useEffect(() => {
        dispatch(getOneSpot(spotId))
    }, [dispatch, spotId])

    const spot = useSelector(state => state.spots.singleSpot[spotId])
    

    // const deleteSpot = async (e) => {
    //     e.preventDefault();
    //     await dispatch((nukeSpot(spotId)))
    //     history.push('/')
    // }
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


    if(!spot || !spot.SpotImages ) return null

    return (
        <div>
            <div>
                <h1>
                    {spot.name}
                </h1>
                <div><i className="fa-solid fa-star"></i>
                    <span>{spot.avgRating}</span>

                    <span>
                        <OpenModalButton 
                        modalComponent={<ReviewsBySpot spot={spot}/>}
                        buttonText={`${spot.numReviews} reviews`}
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
                    <span>{spot.avgRating}</span>
                    <span><OpenModalButton 
                        modalComponent={<ReviewsBySpot spot={spot}/>}
                        buttonText={`${spot.numReviews} reviews`}
                        onButtonClick={closeMenu}/></span>
                </div>
            </div>

            <div className='descr'>
                <span>{spot.description}</span>
            </div>

            {/* <div>
                <button onClick={deleteSpot}>Delete Spot</button>
            </div> */}
            
        </div>
    )
}

export default SingleSpot