import React from "react";
import Slider from "./Slider/Slider";
// @ts-ignore
import styles from "./Sliders.module.scss";
import colors from "../../styles/categoryColors";

export default function Sliders() {
  return (
    <div className={styles.sliders}>
      <Slider category="history" label="History &amp; Landmarks" />
      <Slider category="entertainment" label="Entertainment" />
      <Slider category="nature" label="Nature &amp; Adventure" />
      <Slider category="relaxation" label="Relaxation" />
      <Slider category="shopping" label="Shopping" />
      <Slider category="cuisine" label="Food &amp; Drink" />
    </div>
  );
}
