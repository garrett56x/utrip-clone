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
import { useDestination } from "../../context/destination-context";
import { useFavorites } from "../../context/favorites-context";
import { usePreferences } from "../../context/preferences-context";
import useWindowDimensions from "../../hooks/windowDimensions";
import ItemGrid from "../../components/ItemGrid/ItemGrid";
import ItemDetails from "../../components/ItemDetails/ItemDetails";
import Map from "../../components/Map/Map";
import MobileFilters from "../../components/MobileFilters/MobileFilters";
import Modal from "../../components/Modal/Modal";
import Sliders from "../../components/Sliders/Sliders";
// @ts-ignore
import styles from "./Destination.module.scss";
import { Room, Tune } from "@material-ui/icons";

const scrollToRefObject = (ref) =>
  window.scrollTo({
    top: ref.current.offsetTop,
    behavior: "smooth",
  });

export default function Destination() {
  const [destinationState, destinationDispatch] = useDestination();
  const [favoritesState, favoritesDispatch] = useFavorites();
  const [preferencesState] = usePreferences();

  const [showMap, setShowMap] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  const { width } = useWindowDimensions();

  const { destination } = destinationState;
  const { favorites } = favoritesState;
  const { sliders, filters } = preferencesState;

  const columns = width >= 1200 ? 4 : 3;
  let { path, url } = useRouteMatch();

  const favoritesActive = useRouteMatch({
    path: url + "/favorites",
    exact: true,
  })
    ? true
    : false;
  let thingsToDoActive = true;
  if (favoritesActive) {
    thingsToDoActive = false;
  }

  useEffect(() => {
    setItems(destinationState.items);
    setFilteredItems(destinationState.items);
  }, [destinationState.items]);

  useEffect(() => {
    const searchedItems = items.filter((item) => {
      if (favoritesActive && favorites.indexOf(item.slug) < 0) {
        return false;
      }

      if (filters.length && filters.indexOf(item.category) < 0) {
        return false;
      }

      return item.name.toLowerCase().includes(search.toLowerCase());
    });

    setFilteredItems(searchedItems);
  }, [items, favorites, favoritesActive, search, filters]);

  // Randomizing order of items to fake sliders
  useEffect(() => {
    const shuffledItems = filteredItems.sort(function () {
      return 0.5 - Math.random();
    });

    setFilteredItems(shuffledItems);
  }, [sliders, filteredItems]);

  const { destinationSlug } = useParams();
  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_API_ENDPOINT}/destinations/${destinationSlug}`
    )
      .then((response) => response.json())
      .then((data) => {
        destinationDispatch({ type: "SET_DESTINATION", destination: data });
      });
    favoritesDispatch({ type: "fetch", destination: destinationSlug });
    fetch(
      `${process.env.REACT_APP_API_ENDPOINT}/destinationItems/${destinationSlug}`
    )
      .then((response) => response.json())
      .then((data) => {
        destinationDispatch({ type: "SET_DESTINATION_ITEMS", items: data });
      });
  }, [destinationSlug, destinationDispatch, favoritesDispatch]);

  return (
    <div>
      <Modal show={showModal} toggle={setShowModal} title="Interests">
        <Sliders />
      </Modal>
      <div
        className={styles.hero}
        style={{ backgroundImage: `url(${destination.image})` }}
      >
        <h1 className={styles.heroTitle}>{destination.city}</h1>
      </div>
      <div className={styles.navigationWrapper}>
        <div className={styles.navigation}>
          <MobileFilters
            width={width}
            searchFunction={(e) => setSearch(e.target.value)}
          />
          <div className={styles.navigationLeft}>
            <Link to={url}>
              <button
                className={`${styles.navButton} ${
                  thingsToDoActive ? styles.active : ""
                }`}
                aria-label="Things to Do"
              >
                Things to Do
              </button>
            </Link>
            <Link to={`${url}/favorites`}>
              <button
                className={`${styles.navButton} ${
                  favoritesActive ? styles.active : ""
                }`}
                aria-label="Your Favorites"
              >
                Your Favorites
              </button>
            </Link>
            {width >= 800 ? (
              <input
                type="search"
                placeholder="Search"
                aria-label="Search"
                className={styles.search}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            ) : null}
          </div>
          <div className={styles.buttonWrapper}>
            <button
              className={styles.interestsButton}
              onClick={() => setShowModal(true)}
            >
              <Tune className={styles.slidersIcon} />
              Interests
            </button>
            <MapToggle
              showMap={showMap}
              setShowMap={setShowMap}
              width={width}
            />
          </div>
        </div>
        {width >= 800 ? (
          <div className={styles.preferences}>
            <Sliders />
          </div>
        ) : null}
      </div>
      <div className={styles.contentWrapper}>
        <Switch>
          <Route exact path={[path, `${path}/favorites`]}>
            <StickyContainer
              className={`${styles.itemsWrapper} ${
                showMap ? styles.openMap : ""
              }`}
            >
              <ItemGrid
                items={filteredItems}
                columns={columns}
                showMap={showMap}
                favoritesGrid={favoritesActive}
              />
              {showMap && width >= 800 ? (
                <Sticky>
                  {({ style }) => (
                    <div style={{ ...style }}>
                      <MapWrapper items={filteredItems} />
                    </div>
                  )}
                </Sticky>
              ) : null}
            </StickyContainer>
          </Route>
          <Route exact path={`${path}/map`}>
            <MapWrapper items={filteredItems} />
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

function MapToggle({ showMap, setShowMap, width }) {
  const history = useHistory();
  let { url } = useRouteMatch();
  useEffect(() => {
    // TODO: Figure out why react-router-dom is scrolling to position of previous page
    window.scrollTo(0, 0);
  }, []);

  const mapRouteActive = useRouteMatch({ path: url + "/map", exact: true });
  const mapButtonRef = useRef(null);
  const executeScroll = () => scrollToRefObject(mapButtonRef);
  const onMapClick = () => {
    setShowMap(!showMap);
    if (mapRouteActive) {
      history.goBack();
    } else {
      executeScroll();
    }
  };

  if (width >= 800) {
    return (
      <button
        className={`${styles.navButton} ${styles.mapToggle} ${
          showMap ? styles.active : ""
        }`}
        onClick={() => setShowMap(!showMap)}
        aria-label="Map"
      >
        <Room style={{ fontSize: 12 }} /> Map
      </button>
    );
  }

  return (
    <Link to={`${url}/map`} className={styles.mapToggle}>
      <button
        className={`${styles.navButton} ${mapRouteActive ? styles.active : ""}`}
        onClick={onMapClick}
        ref={mapButtonRef}
        aria-label="Map"
      >
        <Room style={{ fontSize: 12 }} /> Map
      </button>
    </Link>
  );
}

function MapWrapper({ items }) {
  return (
    <div className={styles.mapWrapper}>
      <Map items={items} />
    </div>
  );
}
