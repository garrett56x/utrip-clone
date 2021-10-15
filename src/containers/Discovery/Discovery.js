import React, { useRef, useEffect, useState } from "react";
import Select from "react-select";
import { useDestination } from "../../context/destination-context";
import DestinationCard from "../../components/DestinationCard/DestinationCard";
// @ts-ignore
import styles from "./Discovery.module.scss";
import "./Select.scss";

const scrollToRefObject = (ref) =>
  window.scrollTo({
    top: ref.current.offsetTop,
    behavior: "smooth",
  });

export default function Discovery({ history }) {
  const [destinationState, destinationDispatch] = useDestination();
  const [destinations, setDestinations] = useState([]);
  const [options, setOptions] = useState([]);

  const destinationsRef = useRef(null);
  const executeScroll = () => scrollToRefObject(destinationsRef);

  const handleSelect = (e) => {
    history.push(e.value);
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_ENDPOINT}/destinations`)
      .then((response) => response.json())
      .then((data) => {
        destinationDispatch({ type: "SET_DESTINATIONS", destinations: data });
      });
  }, [destinationDispatch]);

  useEffect(() => {
    const { destinations } = destinationState;
    setDestinations(destinations);
    const optionsData = [];
    destinations.map((destination) => {
      optionsData.push({
        value: destination.slug,
        label: destination.city,
      });
    });
    setOptions(optionsData);
  }, [destinationState]);

  return (
    <div>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Experience the World</h1>
        <div className={styles.actions}>
          <Select
            className="destination-search-container"
            classNamePrefix="destination-search"
            options={options}
            onChange={handleSelect}
            placeholder="Enter a Destination"
            aria-label="Enter a Destination"
          />
          <span className={styles.actionSeparator}>or</span>
          <button
            className={styles.inspireButton}
            onClick={executeScroll}
            aria-label="Let Us Inspire You"
          >
            Let Us Inspire You
          </button>
        </div>
      </div>
      <div className={styles.destinations} ref={destinationsRef}>
        {destinations.map((destination, i) => {
          const size = (i + 1) % 4 >= 2 ? "large" : "small";
          return (
            <DestinationCard
              key={destination.slug}
              size={size}
              destination={destination}
            />
          );
        })}
      </div>
    </div>
  );
}
