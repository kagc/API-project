import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import OpenModalButton from "../OpenModalButton";
import CreateSpot from "../CreateSpot";
import * as sessionActions from "../../store/session";
import { Link, Route, useHistory } from "react-router-dom";
import { getUserSpots, nukeSpot } from "../../store/spots";
import EditSpot from "../EditSpot";
import "./ManageListingsPage.css";
import errImage from '../../images/placeholder-house.jpg'

const ManageListingsPage = () => {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const history = useHistory();
  const [newSrc, setNewSrc] = useState('')

  const spotsObj = useSelector((state) => state.spots.userSpots);
  const spots = Object.values(spotsObj);
  // console.log('spotsOb', spotsObj)

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

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  useEffect(() => {
    dispatch(getUserSpots());
  }, [dispatch]);

  // const deleteSpot = async (e) => {
  //     e.preventDefault();
  //     await dispatch((nukeSpot(spotId)))
  //     history.push('/')
  // }

  return (
    <div>
      {/* <div className='create-spot-button'>
            <Route path='/'> 
            <OpenModalButton
                buttonText="Become a Host"
                onButtonClick={closeMenu}
                modalComponent={<CreateSpot />} 
                className='create-spot-button'/>
                </Route>
                </div> */}

      <div className='all-spots'>
        <h2 className='yourspots'>Your Spots</h2>
        <div className="your-spots">
          {spots.length ? (
            spots.map((spot) => {
              // console.log(spot.id, spot.previewImage)
              return (
                <div key={spot.id}>
                  <Link to={`/spots/${spot.id}`}>
                    <div className="spot-card">
                      <div
                        className="preview-image"
                        // style={{
                        //   backgroundImage: `url('${spot.previewImage}')`,
                        // }}
                      >
                        <img
                          className="previewer-image"
                          onError={(e) => {
                            if (e.target.src !== errImage) {
                              setNewSrc(errImage);
                              e.target.src = errImage;
                            }
                          }}
                          src={`${spot.previewImage}`}
                        ></img>
                      </div>
                      <div className="spots-details2">
                        <div className="spots-details-top">
                          <div className="manage-spotname">{spot.name}</div>
                          <div className="manage-place">
                            {spot.city}, {spot.state}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <div className="manage-button-holder">
                    <div className="manage-buttons">
                      {/* <Route path={`/${spot.id}`}>  */}
                      <OpenModalButton
                        buttonText="Modify Spot"
                        onButtonClick={closeMenu}
                        modalComponent={<EditSpot spot={spot} />}
                      />
                      {/* </Route> */}
                    </div>

                    <div className="bottom-button">
                      <button
                        onClick={async (e) => {
                          e.preventDefault();
                          const deleted = await dispatch(nukeSpot(spot.id));
                          if (deleted) history.push("/manage-listings");
                        }}
                      >
                        Delete Spot
                      </button>
                    </div>

                    {/* </div>
                        </div>
                    </Link> */}
                  </div>
                </div>
              );
            })
          ) : (
            <div>You have no listed spots at this time.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageListingsPage;
