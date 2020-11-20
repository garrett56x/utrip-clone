import React from "react";
import ReactSlider from "react-slider";
import { usePreferences } from "../../../context/preferences-context";
// @ts-ignore
import styles from "./Slider.module.scss";
import colors from "../../../styles/categoryColors";

export default function Slider({ category, label }) {
  const [preferencesState, preferencesDispatch] = usePreferences();
  const sliderVal = preferencesState.sliders[category];

  const handleChange = (value) => {
    preferencesDispatch({
      type: "moveSlider",
      category,
      value,
    });
  };

  return (
    <div className={styles.sliderWrapper}>
      <label className={styles.label}>{label}</label>
      <ReactSlider
        className={styles.slider}
        thumbClassName={styles.sliderThumb}
        trackClassName={styles.sliderTrack}
        min={1}
        max={10}
        defaultValue={sliderVal}
        onChange={handleChange}
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
