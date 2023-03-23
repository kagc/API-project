import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import './Search.css'
import { Link, useHistory, useParams, useLocation } from "react-router-dom";
import { getAllSpots } from "../../store/spots";
import errImage from '../../images/placeholder-house.jpg'

const SearchResults = () => {
  const params = useParams()
    const dispatch = useDispatch()
    const history = useHistory()
    let { pathname } = useLocation()
    const [ isLoaded, setIsLoaded ] = useState(false)
    
    const [newSrc, setNewSrc] = useState('')

    let { searchTerm, minNum, maxNum } = params
    // console.log(searchTerm, minNum, maxNum)
    const [searchCriteria, setSearchCriteria ] = useState(searchTerm)

    const allSpotsObj = useSelector(state => state.spots.allSpots)
    const spots = Object.values(allSpotsObj)

    useEffect(() => {
      dispatch(getAllSpots())
      .then(() => setIsLoaded(true))
    }, [dispatch])

    let firstResults = []
    let results = []
    let currentIndex = 0
    // if (category === 'all') {
        if(spots.length) {
            spots.forEach((spot) => {
              if(spot.city.toLowerCase().includes(searchTerm.toLowerCase())){
                firstResults.push(spot)

                if(firstResults.length > 0 && maxNum === undefined && minNum !== undefined && minNum > 0){
                  firstResults.forEach((spot) => {
                    if(spot.price >= minNum){
                      results.push(spot)
                    }
                  })
                }

                  else if(firstResults.length > 0 && maxNum !== undefined && minNum === undefined && maxNum > 0){
                    firstResults.forEach((spot) => {
                      if(spot.price < maxNum){
                        results.push(spot)
                      }
                    })
                  }

                  else if(firstResults.length > 0 && maxNum !== undefined && minNum !== undefined && minNum > 0 && maxNum > minNum){
                    firstResults.forEach((spot) => {
                      if(spot.price >= minNum && spot.price < maxNum){
                        results.push(spot)
                      }
                    })
                  }

                  else if (firstResults.length > 0 && minNum === undefined && maxNum === undefined){
                    firstResults.forEach((spot) => {
                      results.push(spot)
                    })
                  }
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
    // console.log("results", results)
    let filteredResults = results.filter((result, index) => results.indexOf(result) === index);

  return isLoaded && (
    <div>
      <div className="search-criteria">
      {/* <div className="found">{results.length} Result{results.length === 1 ? null : 's'}</div> */}
        <div className="search-thing">City Keyword:<div className="search-val">{searchTerm}</div>
        </div>
        {minNum !== undefined ? <div className="search-thing">Minimum price per night:<div className="search-val">${minNum}</div>
        </div> : null}
        {maxNum !== undefined ? <div className="search-thing">Maximum price per night:<div className="search-val">${maxNum}</div>
        </div> : null}
        </div>
        <div className="found">{filteredResults.length} Result{filteredResults.length === 1 ? null : 's'}:</div>
    <div className='search-spots'>
            {filteredResults.length ? (filteredResults.map(spot => {
                // console.log('rating', spot.avgRating)

                let avgStars
                // if (!spot.avgRating || spot.avgRating === null) spot.avgRating = 0
                if (spot.avgRating > 0) avgStars = parseFloat(spot.avgRating.toPrecision(3))
              //  console.log('stars', spot.title, avgStars)
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
            })) : (<div className="no-results">Sorry, no results found.</div>)}
        </div>
        </div>
  )
}

export default SearchResults;