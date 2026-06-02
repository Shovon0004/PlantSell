"use client";

import { useEffect } from "react";

export default function PageEffects() {
  useEffect(() => {
    const nav = document.getElementById("navbar");

    const handleScroll = () => {
      if (!nav) {
        return;
      }
      nav.classList.toggle("scrolled", window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll(
      "a, button, .cat-card, .product-card, .filter-tab"
    );

    const addHover = () => document.body.classList.add("hovering");
    const removeHover = () => document.body.classList.remove("hovering");

    elements.forEach((element) => {
      element.addEventListener("mouseenter", addHover);
      element.addEventListener("mouseleave", removeHover);
    });

    return () => {
      elements.forEach((element) => {
        element.removeEventListener("mouseenter", addHover);
        element.removeEventListener("mouseleave", removeHover);
      });
    };
  }, []);

  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            element.style.transitionDelay = `${index * 0.08}s`;
            element.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    reveals.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return null;
}
