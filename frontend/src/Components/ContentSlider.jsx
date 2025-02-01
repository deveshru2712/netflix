import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { small_image_base_Url } from "../Utils/constant.js";

import useContentStore from "../store/Content";

import { ChevronsLeft, ChevronsRight } from "lucide-react";

const ContentSlider = ({ category }) => {
  const [content, setContent] = useState([]);
  const [arrows, setArrows] = useState(false);
  const { contentType } = useContentStore();

  const sliderRef = useRef(null);

  const formattedCategoryType =
    category.replaceAll("_", " ")[0].toUpperCase() +
    category.replaceAll("_", " ").slice(1);

  const formattedContentType = contentType === "movie" ? "Movies" : "Tv shows";

  useEffect(() => {
    const getContent = async () => {
      try {
        const response = await axios(`/api/${contentType}/${category}`);
        setContent(response.data.content);
      } catch (error) {
        console.log(
          `An error occurred while fetching the route:${error.message}`
        );
      }
    };
    getContent();
  }, [contentType, category]);

  // const scrollLeft = () => {
  //   if (sliderRef.current) {
  //     sliderRef.current.scrollBy({
  //       left: -sliderRef.current.offsetWidth,
  //       behavior: "smooth",
  //     });
  //   }
  // };

  // const scrollRight = () => {
  //   if (sliderRef.current) {
  //     sliderRef.current.scrollBy({
  //       left: sliderRef.current.offsetWidth,
  //       behavior: "smooth",
  //     });
  //   }
  // };

  {
    /** i really do not understand this scrolling shit*/
  }

  const scrollLeft = () => {
    if (sliderRef.current) {
      const startScroll = sliderRef.current.scrollLeft;
      const endScroll = startScroll - sliderRef.current.offsetWidth;
      const duration = 500; // duration in ms
      let startTime = null;

      const smoothScroll = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const scrollPosition = Math.max(
          startScroll - (startScroll - endScroll) * (progress / duration),
          endScroll
        );

        sliderRef.current.scrollLeft = scrollPosition;

        if (progress < duration) {
          requestAnimationFrame(smoothScroll);
        }
      };

      requestAnimationFrame(smoothScroll);
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      const startScroll = sliderRef.current.scrollLeft;
      const endScroll = startScroll + sliderRef.current.offsetWidth;
      const duration = 500; // duration in ms
      let startTime = null;

      const smoothScroll = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const scrollPosition = Math.min(
          startScroll + (endScroll - startScroll) * (progress / duration),
          endScroll
        );

        sliderRef.current.scrollLeft = scrollPosition;

        if (progress < duration) {
          requestAnimationFrame(smoothScroll);
        }
      };

      requestAnimationFrame(smoothScroll);
    }
  };

  return (
    <div
      onMouseEnter={() => setArrows(true)}
      onMouseLeave={() => setArrows(false)}
      className="text-white bg-black relative px-5 md:px-20"
    >
      <h2 className="text-2xl font-bold mb-4">
        {formattedCategoryType} {formattedContentType}
      </h2>
      <div className="flex space-x-4 overflow-x-scroll element" ref={sliderRef}>
        {content.map((item) => (
          <Link
            key={item.id}
            to={`/watch/${item.id}`}
            className="min-w-[250px] relative group"
          >
            <div className="rounded-lg overflow-hidden" key={item.id}>
              <img
                src={small_image_base_Url + item?.backdrop_path}
                alt="image"
                className="transition-transform duration-300 ease-in-out group-hover:scale-125"
              />
            </div>
            <p className="mt-2 text-center">{item?.title || item?.name}</p>
          </Link>
        ))}
      </div>
      {arrows && (
        <>
          <button
            onClick={scrollLeft}
            className="cursor-pointer absolute top-1/2 -translate-y-1/2 left-5 md:left-24 flex items-center justify-center
            size-12 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10"
          >
            <ChevronsLeft size={24} />
          </button>
          <button
            onClick={scrollRight}
            className="cursor-pointer absolute top-1/2 -translate-y-1/2 right-5 md:right-24 flex items-center justify-center
            size-12 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10"
          >
            <ChevronsRight size={24} />
          </button>
        </>
      )}
    </div>
  );
};

export default ContentSlider;
