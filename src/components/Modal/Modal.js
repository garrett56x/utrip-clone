import React from "react";
// @ts-ignore
import styles from "./Modal.module.scss";

export default function Modal({ children, show, toggle, title }) {
  if (!children || !show) return null;
  return (
    <div className={styles.modal}>
      <div className={styles.header}>
        {title}
        <button
          className={styles.cancel}
          onClick={() => toggle(false)}
          aria-label="Cancel"
        >
          Cancel
        </button>
      </div>
      <div className={styles.content}>{children}</div>
      <div className={styles.footer}>
        <button
          className={styles.apply}
          onClick={() => toggle(false)}
          aria-label="Apply"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
