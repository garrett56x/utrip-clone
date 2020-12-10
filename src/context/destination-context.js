import React, { useEffect } from "react";
// @ts-ignore
const DestinationStateContext = React.createContext();
// @ts-ignore
const DestinationDispatchContext = React.createContext();

function destinationReducer(state, action) {
  switch (action.type) {
    case "SET_DESTINATION": {
      return { ...state, destination: action.destination };
    }

    case "SET_DESTINATIONS": {
      return { ...state, destinations: action.destinations };
    }

    case "SET_DESTINATION_ITEMS": {
      return { ...state, items: action.items };
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
    destinations: [],
    items: [],
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
