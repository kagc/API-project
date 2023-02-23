import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import './Search.css'
import { Link, useHistory, useParams, useLocation } from "react-router-dom";
import { getAllSpots } from "../../store/spots";

const SearchResults = () => {
  const params = useParams()
    const dispatch = useDispatch()
    const history = useHistory()
    let { pathname } = useLocation()
    const [ isLoaded, setIsLoaded ] = useState(false)
    
    const [newSrc, setNewSrc] = useState('')

    let { searchTerm, min, max } = params
    const [searchCriteria, setSearchCriteria ] = useState(searchTerm)

    const allSpotsObj = useSelector(state => state.spots.allSpots)
    const spots = Object.values(allSpotsObj)

    useEffect(() => {
      dispatch(getAllSpots())
      .then(() => setIsLoaded(true))
    }, [dispatch])

    let results = []
    let currentIndex = 0
    // if (category === 'all') {
        if(spots.length) {
            spots.forEach((spot) => {
              if(spot.city.toLowerCase().includes(searchTerm.toLowerCase())){
                results.push(spot)
              }
                // delete project.creator.email
                // delete project.creator.id
                // delete project.steps
                // for (let key in project) { 
                //     // ignore these columns
                //     if (key !== 'creatorId' && key !== 'coverImageUrl' && key !== 'id' && key !== 'created_at'
                //     // only search through title, cat, username for now
                //     && key !== 'intro' && key !== 'supplies'
                //     ){
                //         // searches username only
                //         if(typeof project[key] === 'object'){
                //             if(project[key].username !== undefined && project[key].username.toLowerCase().includes(searchTerm.toLowerCase())){
                //                 results.push(projectsDupe[currentIndex])
                //             }
                //         }
                        
                //         if(project[key].toString().toLowerCase().includes(searchTerm.toLowerCase())) {
                //             results.push(projectsDupe[currentIndex])
                //         }
                //     }
                // }
                currentIndex++
            })
        // }
    }

  return isLoaded && (
    <div className='all-spots'>
            {results.length && (results.map(spot => {
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
                        style={{ backgroundImage: `url('${spot.previewImage}')` }}></div>
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

export default SearchResults;