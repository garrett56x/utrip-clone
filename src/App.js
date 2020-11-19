import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { FavoritesProvider } from "./context/favorites-context";
import Header from "./components/Header/Header";
import Discovery from "./containers/Discovery/Discovery";
import Destination from "./containers/Destination/Destination";
import "./App.scss";

export default function App() {
  return (
    <FavoritesProvider destination="seattle-wa">
      <Header />
      <Switch>
        <Route exact path="/" component={Discovery} />
        <Route path="/:destinationSlug" component={Destination} />
        <Redirect to="/" />
      </Switch>
    </FavoritesProvider>
  );
}
