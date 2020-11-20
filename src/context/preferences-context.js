import React from "react";
// @ts-ignore
const PreferencesStateContext = React.createContext();
// @ts-ignore
const PreferencesDispatchContext = React.createContext();

function preferencesReducer(state, action) {
  switch (action.type) {
    case "moveSlider": {
      const updatedSliders = { ...state.sliders };
      updatedSliders[action.category] = action.value;

      return { ...state, sliders: updatedSliders };
    }
    case "toggleCategory": {
      const { category } = action;
      let updatedFilters = [...state.filters];
      if (updatedFilters.indexOf(category) >= 0) {
        updatedFilters.splice(updatedFilters.indexOf(category), 1);
      } else {
        updatedFilters.push(category);
      }

      // TODO: Find a more dynamic way of doing this
      if (updatedFilters.length === 7) {
        updatedFilters = [];
      }

      return { ...state, filters: updatedFilters };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}
function PreferencesProvider({ children }) {
  const [state, dispatch] = React.useReducer(preferencesReducer, {
    sliders: {
      history: 5,
      entertainment: 5,
      art: 5,
      nature: 5,
      relaxation: 5,
      shopping: 5,
      cuisine: 5,
      food: 5,
      nightlife: 5,
    },
    filters: [],
  });
  return (
    <PreferencesStateContext.Provider value={state}>
      <PreferencesDispatchContext.Provider value={dispatch}>
        {children}
      </PreferencesDispatchContext.Provider>
    </PreferencesStateContext.Provider>
  );
}

function usePreferencesState() {
  const context = React.useContext(PreferencesStateContext);
  if (context === undefined) {
    throw new Error(
      "usePreferencesState must be used within a PreferencesProvider"
    );
  }
  return context;
}
function usePreferencesDispatch() {
  const context = React.useContext(PreferencesDispatchContext);
  if (context === undefined) {
    throw new Error(
      "usePreferencesDispatch must be used within a PreferencesProvider"
    );
  }
  return context;
}

function usePreferences() {
  return [usePreferencesState(), usePreferencesDispatch()];
}

export { PreferencesProvider, usePreferences };
