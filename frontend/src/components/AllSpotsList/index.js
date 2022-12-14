import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, Route, useParams, Link } from 'react-router-dom';
import { getAllSpots } from '../../store/spots'
import './AllSpotsList.css'

function AllSpotsList() {
const dispatch = useDispatch()

const spotsObj = useSelector(state => state.spots.allSpots)
const spots = Object.values(spotsObj)
console.log('spotsOb', spotsObj)

useEffect(() => {
    dispatch(getAllSpots())
}, [dispatch])

    return (
        <div className='all-spots'>
            {spots.map(spot => {
                // console.log(spot.id, spot.previewImage)
                return (
                    <Link key={spot.id} to={`/spots/${spot.id}`}>
                        <div>
                        <div 
                        className="preview-image"
                        style={{ backgroundImage: `url('${spot.previewImage}')` }}></div>
                        <div>
                            <div>{spot.city}, {spot.state}</div>
                            <div>${spot.price} night</div>
                        </div>
                        </div>
                    </Link>
                )
            })}
        </div>
    )
}

export default AllSpotsList