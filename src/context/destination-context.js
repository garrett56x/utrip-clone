import React from "react";
// @ts-ignore
const DestinationStateContext = React.createContext();
// @ts-ignore
const DestinationDispatchContext = React.createContext();
// @ts-ignore
import destinations from "../data/destinations";

function destinationReducer(state, action) {
  switch (action.type) {
    case "change": {
      const destination = destinations.filter(
        (destination) => destination.slug === action.slug
      )[0];

      return { ...state, destination };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}
function DestinationProvider({ children }) {
  const [state, dispatch] = React.useReducer(destinationReducer, {
    destination: {
      slug: "",
      city: "",
      state: "",
      country: "",
      image: "",
    },
  });
  return (
    <DestinationStateContext.Provider value={state}>
      <DestinationDispatchContext.Provider value={dispatch}>
        {children}
      </DestinationDispatchContext.Provider>
    </DestinationStateContext.Provider>
  );
}

function useDestinationState() {
  const context = React.useContext(DestinationStateContext);
  if (context === undefined) {
    throw new Error(
      "useDestinationState must be used within a DestinationProvider"
    );
  }
  return context;
}
function useDestinationDispatch() {
  const context = React.useContext(DestinationDispatchContext);
  if (context === undefined) {
    throw new Error(
      "useDestinationDispatch must be used within a DestinationProvider"
    );
  }
  return context;
}

function useDestination() {
  return [useDestinationState(), useDestinationDispatch()];
}

export { DestinationProvider, useDestination };
