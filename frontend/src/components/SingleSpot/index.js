import { Link, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';

function SingleSpot() {
    const { spotId } = useParams()

    const spot = useSelector(state => state.spots[spotId])
    console.log(spot)


    return (
        <div>
            <div>
                <h1>
                    {spot.name}
                </h1>
                <div><i class="fa-solid fa-star"></i>
                    <span>{spot.avgRating}</span>
                    <span>{spot.city}, {spot.state}, {spot.country}</span>
                </div>
            </div>

            <div className='img-container'>

            </div>
        </div>
    )
}

export default SingleSpot