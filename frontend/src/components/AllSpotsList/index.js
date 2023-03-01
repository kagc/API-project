import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, Route, useParams, Link } from 'react-router-dom';
import { getAllSpots } from '../../store/spots'
import './AllSpotsList.css'
import errImage from '../../images/placeholder-house.jpg'

function AllSpotsList() {
const dispatch = useDispatch()

const spotsObj = useSelector(state => state.spots.allSpots)
const spots = Object.values(spotsObj)
// console.log('spotsOb', spotsObj)
const [newSrc, setNewSrc] = useState('')

useEffect(() => {
    dispatch(getAllSpots())
}, [dispatch])

if(!spotsObj || !spots || spots.length === 0) return null

    return (
        <div className='all-spots'>
            {spots.length && (spots.map(spot => {
                // console.log('rating', spot.avgRating)

                let avgStars
                // if (!spot.avgRating || spot.avgRating === null) spot.avgRating = 0
                if (spot.avgRating > 0) avgStars = parseFloat(spot.avgRating.toPrecision(3))
               console.log('stars', spot.title, avgStars)
               if(avgStars === undefined) avgStars = 0
                return (
                    <Link key={spot.id} to={`/spots/${spot.id}`}>
                        <div>
                        <div 
                        className="preview-image"
                        // style={{ backgroundImage: `url('${spot.previewImage}')` }}
                        >

                                        <img 
                                        className="previewer-image" 
                                        onError={(e)=>{
                                            if(e.target.src !== errImage) {
                                            setNewSrc(errImage)
                                            e.target.src = errImage
                                            }
                                        }}
                                    src={`${spot.previewImage}`}></img>
                        </div>
                        <div className='spots-details'>
                            <div className='spots-details-top'>
                            <div className='place'>{spot.city}, {spot.state}</div>
                            <div><i className="fa-solid fa-star"></i> {avgStars}</div>
                            </div>

                            <div><span className='price'>${spot.price}</span> night</div>
                        </div>
                        </div>
                    </Link>
                )
            }))}
        </div>
    )
}

export default AllSpotsList