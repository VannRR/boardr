/* eslint-disable react/react-in-jsx-scope */

import { ThemeSwitchButtonProps } from "../types";

export function ThemeSwitchButton(props: ThemeSwitchButtonProps) {
  const toggleDarkMode = () => {
    props.darkMode.value = !props.darkMode.value;
  };

  return (
    <>
      <button id="theme-switch" onClick={toggleDarkMode}>
        {(props.darkMode.value) ? 'Light Mode' : 'Dark Mode'}
      </button>
    </>
  );
}
