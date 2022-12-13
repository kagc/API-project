import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import OpenModalButton from '../OpenModalButton';
import CreateSpot from '../CreateSpot';
import * as sessionActions from "../../store/session";
import { Link, Route } from 'react-router-dom'

const ManageListingsPage = () => {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();

    // const spotsObj = useSelector(state => {
    //     return state.spots[session.user.id]
    // })
    // console.log(spotsObj)
  
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
    
    return (
        <div>
            <div>
            <Route path='/'> 
            <OpenModalMenuItem
                itemText="Become a Host"
                onItemClick={closeMenu}
                modalComponent={<CreateSpot />} />
                </Route>
                </div>

            <div>
                <h2>Your Spots</h2>
                <div>

                </div>
            </div>
        </div>
    )
}

export default ManageListingsPage