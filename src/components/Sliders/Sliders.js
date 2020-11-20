import React, { useEffect, useState } from "react";
import Slider from "./Slider/Slider";
import { usePreferences } from "../../context/preferences-context";
// @ts-ignore
import styles from "./Sliders.module.scss";

export default function Sliders() {
  const [preferencesState] = usePreferences();
  const [filtering, setFiltering] = useState(false);

  const { filters } = preferencesState;

  useEffect(() => {
    if (filters.length) {
      setFiltering(true);
    } else {
      setFiltering(false);
    }
  }, [filters]);

  return (
    <div className={styles.sliders}>
      <Slider
        category="history"
        label="History &amp; Landmarks"
        filtering={filtering}
      />
      <Slider
        category="entertainment"
        label="Entertainment"
        filtering={filtering}
      />
      <Slider category="art" label="Arts" filtering={filtering} />
      <Slider
        category="nature"
        label="Nature &amp; Adventure"
        filtering={filtering}
      />
      <Slider category="relaxation" label="Relaxation" filtering={filtering} />
      <Slider category="shopping" label="Shopping" filtering={filtering} />
      <Slider
        category="cuisine"
        label="Food &amp; Drink"
        filtering={filtering}
      />
    </div>
  );
}
