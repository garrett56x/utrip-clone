import React, { useEffect, useState, useRef } from "react";
import {
  useParams,
  useRouteMatch,
  useHistory,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import { StickyContainer, Sticky } from "react-sticky";
import useWindowDimensions from "../../hooks/windowDimensions";
// @ts-ignore
import destinations from "../../data/destinations";
// @ts-ignore
import items from "../../data/items";
// @ts-ignore
import styles from "./Destination.module.scss";
import ItemGrid from "../../components/ItemGrid/ItemGrid";
import ItemDetails from "../../components/ItemDetails/ItemDetails";
import Map from "../../components/Map/Map";

const scrollToRefObject = (ref) =>
  window.scrollTo({
    top: ref.current.offsetTop,
    behavior: "smooth",
  });

export default function Destination() {
  const [showMap, setShowMap] = useState(false);
  const { destinationSlug } = useParams();
  const history = useHistory();
  const { width } = useWindowDimensions();
  const destination = destinations.filter(
    (destination) => destination.slug === destinationSlug
  )[0];

  const columns = width >= 1200 ? 4 : 3;
  let { path, url } = useRouteMatch();

  useEffect(() => {
    // TODO: Figure out why react-router-dom is scrolling to position of previous page
    window.scrollTo(0, 0);
  }, []);

  const mapButtonRef = useRef(null);
  const executeScroll = () => scrollToRefObject(mapButtonRef);
  const onMapClick = () => {
    if (width >= 800) {
      setShowMap(!showMap);
    } else {
      if (showMap) {
        setShowMap(!showMap);
        history.push(`${url}`);
      } else {
        setShowMap(!showMap);
        history.push(`${url}/map`);
        executeScroll();
      }
    }
  };

  return (
    <div>
      <div
        className={styles.hero}
        style={{ backgroundImage: `url(${destination.image})` }}
      >
        <h1 className={styles.heroTitle}>{destination.city}</h1>
      </div>
      <div className={styles.navigationWrapper}>
        <div className={styles.navigation}>
          <Link to={url}>
            <button
              className={`${styles.navButton} ${
                useRouteMatch({ path: url, exact: true }) ? styles.active : ""
              }`}
              aria-label="Things to Do"
            >
              Things to Do
            </button>
          </Link>
          <Link to={`${url}/favorites`}>
            <button
              className={`${styles.navButton} ${
                useRouteMatch({ path: url + "/favorites", exact: true })
                  ? styles.active
                  : ""
              }`}
              aria-label="Your Favorites"
            >
              Your Favorites
            </button>
          </Link>
          <button
            className={`${styles.navButton} ${styles.mapToggle} ${
              showMap ? styles.active : ""
            }`}
            onClick={onMapClick}
            ref={mapButtonRef}
            aria-label="Map"
          >
            X Map
          </button>
        </div>
      </div>
      <div className={styles.contentWrapper}>
        <Switch>
          <StickyContainer
            className={`${styles.itemsWrapper} ${
              showMap ? styles.openMap : ""
            }`}
          >
            <Route exact path={path}>
              <ItemGrid
                items={items}
                columns={columns}
                showMap={showMap}
                favorites={false}
              />
            </Route>
            <Route exact path={`${path}/favorites`}>
              <ItemGrid
                items={[]}
                columns={columns}
                showMap={showMap}
                favorites={true}
              />
            </Route>
            {showMap && width >= 800 ? (
              <Sticky>
                {({ style }) => (
                  <div style={{ ...style }}>
                    <MapWrapper items={items} />
                  </div>
                )}
              </Sticky>
            ) : null}
          </StickyContainer>
          <Route exact path={`${path}/map`}>
            <MapWrapper items={items} />
          </Route>
          <Route path={`${path}/:itemSlug`}>
            <div className={styles.itemDetailsWrapper}>
              <ItemDetails />
            </div>
          </Route>
        </Switch>
      </div>
    </div>
  );
}

function MapWrapper({ items }) {
  return (
    <div className={styles.mapWrapper}>
      <Map items={items} />
    </div>
  );
}
