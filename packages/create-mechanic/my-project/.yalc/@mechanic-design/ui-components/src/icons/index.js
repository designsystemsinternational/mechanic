import React from "react";

export const Invalid = ({ width = 12, height = 20, ...otherProps }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 12 20"
      fill="none"
      {...otherProps}
      xmlns="http://www.w3.org/2000/svg">
      <circle cx="6" cy="15.5" r="1.5" fill="currentColor" />
      <path
        d="M5 5C5 4.44772 5.44772 4 6 4V4C6.55228 4 7 4.44772 7 5V11C7 11.5523 6.55228 12 6 12V12C5.44772 12 5 11.5523 5 11V5Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const Dropdown = ({ width = 20, height = 20, open, ...otherProps }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      {...otherProps}
      xmlns="http://www.w3.org/2000/svg">
      {open ? (
        <path d="M10 7L16.9282 14.5L3.0718 14.5L10 7Z" fill="currentColor" />
      ) : (
        <path d="M10 15L3.0718 7.5L16.9282 7.5L10 15Z" fill="currentColor" />
      )}
    </svg>
  );
};

export const Add = ({ width = 20, height = 20, ...otherProps }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      {...otherProps}
      xmlns="http://www.w3.org/2000/svg">
      <rect x="9" y="4" width="2" height="12" fill="currentColor" />
      <rect x="16" y="9" width="2" height="12" transform="rotate(90 16 9)" fill="currentColor" />
    </svg>
  );
};
