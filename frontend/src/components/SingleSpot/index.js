import { Link, useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { getOneSpot, nukeSpot } from '../../store/spots'
import './SingleSpot.css'

function SingleSpot() {
    let { spotId } = useParams()
    const dispatch = useDispatch()
    const history = useHistory()
    
    useEffect(() => {
        dispatch(getOneSpot(spotId))
    }, [dispatch, spotId])

    const spot = useSelector(state => state.spots.singleSpot[spotId])
    
    // console.log('detailsSpot', spot)
    // console.log('spotimg', spot.SpotImages)
    const deleteSpot = async (e) => {
        e.preventDefault();
        await dispatch((nukeSpot(spotId)))
        history.push('/')
    }



    if(!spot || !spot.SpotImages ) return null

    return (
        <div>
            <div>
                <h1>
                    {spot.name}
                </h1>
                <div><i className="fa-solid fa-star"></i>
                    <span>{spot.avgRating}</span>
                    <span>{spot.numReviews} reviews</span>
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
                    <span>{spot.numReviews} reviews</span>
                </div>
            </div>

            <div className='descr'>
                <span>{spot.description}</span>
            </div>

            <div>
                <button onClick={deleteSpot}>Delete Spot</button>
            </div>
        </div>
    )
}

export default SingleSpot