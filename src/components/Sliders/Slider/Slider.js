import React from "react";
import ReactSlider from "react-slider";
// @ts-ignore
import styles from "./Slider.module.scss";
import colors from "../../../styles/categoryColors";

export default function Slider({ category, label }) {
  return (
    <div className={styles.sliderWrapper}>
      <label className={styles.label}>{label}</label>
      <ReactSlider
        className={styles.slider}
        thumbClassName={styles.sliderThumb}
        trackClassName={styles.sliderTrack}
        min={1}
        max={10}
        defaultValue={5}
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
