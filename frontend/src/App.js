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
import UserBookings from "./components/UserBookings";
import Footer from "./components/Footer";
import SearchResults from "./components/Search";

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
          <Route path='/manage-bookings'>
            <UserBookings />
          </Route>
          <Route path='/search/city=:searchTerm' exact>
          <SearchResults />
        </Route>
        <Route path='/search/city=:searchTerm/min=:minNum' exact>
          <SearchResults />
        </Route>
        <Route path='/search/city=:searchTerm/max=:maxNum' exact>
          <SearchResults />
        </Route>
        <Route path='/search/city=:searchTerm/min=:minNum/max=:maxNum' exact>
          <SearchResults />
        </Route>

          {/* <Route path='/spots/:spotId'>
            Oops, that spot doesn't seem to be in the system.
          </Route> */}

          <Route>
            <PageNotFound />
          </Route>
        </Switch>
      )}
      <Footer />
    </>
  );
}

export default App;