// frontend/src/components/Navigation/index.js
import React, { useState, useEffect, useRef } from "react";
import { NavLink, Link, Route, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import OpenModalButton from '../OpenModalButton';
import CreateSpot from '../CreateSpot';


function Navigation({ isLoaded }){

  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const history = useHistory()

  const sessionUser = useSelector(state => state.session.user);
  console.log(sessionUser)

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
    <ul className='navbar'>
      <li>
        <NavLink exact to="/" className='home-button'><span>
          <i className="fa-solid fa-box"></i></span><span>Sparebnb</span></NavLink>


      </li>
{sessionUser !== null &&
            (<div className='create-holder'>
              <div className='create-spot-button'>
            <Route path='/'> 
            <OpenModalButton
                buttonText="Sparebnb your home"
                onButtonClick={closeMenu}
                modalComponent={<CreateSpot />}/>
                </Route>
                </div>
            </div>
            )
                }

      {isLoaded && (
        <li>
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;