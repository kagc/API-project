import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import AllSpotsList from "./components/AllSpotsList";
import SingleSpot from "./components/SingleSpot";
import CreateSpot from "./components/CreateSpot";
import ManageListingsPage from "./components/ManageListingsPage";
import UserReviews from "./components/UserReviews";
import PageNotFound from "./components/PageNotFound";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path='/'>
            <AllSpotsList />
          </Route>
          <Route exact path='/spots/:spotId'>
            <SingleSpot />
          </Route>
          <Route path='/manage-listings'>
            <ManageListingsPage />
          </Route>
          <Route path='/manage-reviews'>
            <UserReviews />
          </Route>

          {/* <Route path='/spots/:spotId'>
            Oops, that spot doesn't seem to be in the system.
          </Route> */}

          <Route>
            <PageNotFound />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;