import React from "react";
// @ts-ignore
const FavoritesStateContext = React.createContext();
// @ts-ignore
const FavoritesDispatchContext = React.createContext();

function favoritesReducer(state, action) {
  switch (action.type) {
    case "favorite": {
      const { itemSlug } = action;
      const newFavorites = [...state.favorites];
      const index = state.favorites.indexOf(itemSlug);

      if (index >= 0) {
        newFavorites.splice(index, 1);
      } else {
        newFavorites.push(itemSlug);
      }

      localStorage.setItem(
        `${state.destination}-favorites`,
        JSON.stringify(newFavorites)
      );

      return { ...state, favorites: newFavorites };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}
function FavoritesProvider({ children }) {
  const destination = "seattle-wa";
  const destinationFavorites =
    JSON.parse(localStorage.getItem(`${destination}-favorites`)) || [];
  const [state, dispatch] = React.useReducer(favoritesReducer, {
    destination: destination,
    favorites: destinationFavorites,
  });
  return (
    <FavoritesStateContext.Provider value={state}>
      <FavoritesDispatchContext.Provider value={dispatch}>
        {children}
      </FavoritesDispatchContext.Provider>
    </FavoritesStateContext.Provider>
  );
}

function useFavoritesState() {
  const context = React.useContext(FavoritesStateContext);
  if (context === undefined) {
    throw new Error(
      "useFavoritesState must be used within a FavoritesProvider"
    );
  }
  return context;
}
function useFavoritesDispatch() {
  const context = React.useContext(FavoritesDispatchContext);
  if (context === undefined) {
    throw new Error(
      "useFavoritesDispatch must be used within a FavoritesProvider"
    );
  }
  return context;
}

function useFavorites() {
  return [useFavoritesState(), useFavoritesDispatch()];
}

export { FavoritesProvider, useFavorites };
