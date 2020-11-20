import React from "react";
import { Link, useParams } from "react-router-dom";
import { useFavorites } from "../../context/favorites-context";
// @ts-ignore
import styles from "./ItemCard.module.scss";
import colors from "../../styles/categoryColors";
import { Favorite } from "@material-ui/icons";

export default function ItemCard({ item, size }) {
  let { destinationSlug } = useParams();
  const [favorites, favoritesDispatch] = useFavorites();
  const favorite = favorites.favorites.indexOf(item.slug) >= 0;

  const toggleFavorite = (e) => {
    e.preventDefault();
    favoritesDispatch({ type: "favorite", itemSlug: item.slug });
  };

  return (
    <Link
      to={`/${destinationSlug}/${item.slug}`}
      className={`${styles.itemCardWrapper} ${styles[size]}`}
      style={{ borderColor: colors[item.category] }}
      aria-label={item.name}
    >
      <div
        className={styles.itemCard}
        style={{ backgroundImage: `url(${item.image})` }}
      >
        <div className={styles.itemDetails}>
          <div className={styles.itemNameWrapper}>
            <Favorite
              className={`${styles.favorite} ${
                favorite ? styles.favorited : ""
              }`}
              onClick={toggleFavorite}
            />
            <span className={styles.itemName}>{item.name}</span>
          </div>
          <span className={styles.itemPhrase}>{item.phrase}</span>
        </div>
      </div>
    </Link>
  );
}
