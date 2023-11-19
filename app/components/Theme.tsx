"use client";
import React, { useContext } from "react";
import styles from "./themetoggle.module.css";
import Image from "next/image";
import { ThemeContext, ThemeContextProps } from "@/app/context/ThemeContext";
import moon from "@/public/moon.png";
import sun from "@/public/sun.png";

const ThemeToggle: React.FC = () => {
  const { theme, toggle } = useContext(ThemeContext) as ThemeContextProps;

  return (
    <div
      className={styles.container}
      onClick={toggle}
      style={
        theme === "dark"
          ? { backgroundColor: "#fff" }
          : { backgroundColor: "#0f172a" }
      }
    >
      <Image
        className="pl-2 h-[20px] w-[20px] object-contain"
        src={moon}
        alt=""
      />
      <div
        className={styles.ball}
        style={
          theme === "dark"
            ? { left: 1, background: "#0f172a" }
            : { right: 1, background: "white" }
        }
      ></div>
      <Image
        className="pr-2 h-[20px] w-[20px] object-contain"
        src={sun}
        alt=""
      />
    </div>
  );
};

export default ThemeToggle;
