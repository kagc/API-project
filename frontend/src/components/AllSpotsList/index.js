import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, Route, useParams, Link } from 'react-router-dom';
import { getAllSpots } from '../../store/spots'
import './AllSpotsList.css'

function AllSpotsList() {
const dispatch = useDispatch()

const spotsObj = useSelector(state => state.spots.allSpots)
const spots = Object.values(spotsObj)
// console.log('spotsOb', spotsObj)

useEffect(() => {
    dispatch(getAllSpots())
}, [dispatch])

if(!spotsObj) return null

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
                        <div className='spots-details'>
                            <div className='spots-details-top'>
                            <div className='place'>{spot.city}, {spot.state}</div>
                            <div><i className="fa-solid fa-star"></i> {spot.avgRating === null ? '0' : parseFloat(spot.avgRating.toPrecision(3))}</div>
                            </div>

                            <div><span className='price'>${spot.price}</span> night</div>
                        </div>
                        </div>
                    </Link>
                )
            })}
        </div>
    )
}

export default AllSpotsList