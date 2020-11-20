import React, { useEffect, useState } from "react";
import ReactSlider from "react-slider";
import { usePreferences } from "../../../context/preferences-context";
import useWindowDimensions from "../../../hooks/windowDimensions";
// @ts-ignore
import styles from "./Slider.module.scss";
import colors from "../../../styles/categoryColors";

export default function Slider({ category, label, filtering }) {
  const [preferencesState, preferencesDispatch] = usePreferences();
  const [active, setActive] = useState(true);
  const sliderVal = preferencesState.sliders[category];
  const { filters } = preferencesState;

  const { width } = useWindowDimensions();

  const handleChange = (value) => {
    preferencesDispatch({
      type: "moveSlider",
      category,
      value,
    });
  };

  useEffect(() => {
    if (filters.length && filters.indexOf(category) < 0) {
      setActive(false);
    } else {
      setActive(true);
    }
  }, [filters, category]);

  return (
    <div className={styles.sliderWrapper}>
      {width >= 800 ? (
        <button
          className={`${active ? "" : styles.inactive} ${styles.label}`}
          style={{ backgroundColor: colors[category] }}
          onClick={() => {
            preferencesDispatch({ type: "toggleCategory", category });
          }}
        >
          {label}
        </button>
      ) : (
        <p className={styles.label}>{label}</p>
      )}
      <ReactSlider
        className={`${filtering ? styles.inactive : ""} ${styles.slider}`}
        thumbClassName={styles.sliderThumb}
        trackClassName={styles.sliderTrack}
        min={1}
        max={10}
        defaultValue={sliderVal}
        onChange={handleChange}
        disabled={filtering}
        renderTrack={(props) => {
          props.style.background = colors[category];
          if (props.key.slice(-2) == "-1") {
            props.style.opacity = 0.4;
          }
          return <div {...props} />;
        }}
        renderThumb={(props) => {
          props.style.background = colors[category];
          return <div {...props} />;
        }}
      />
    </div>
  );
}
