import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import ReactPlayer from "react-player";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import useContentStore from "../Store/Content.js";
import { original_image_Url, small_image_base_Url } from "../Utils/constant.js";

import Navbar from "../Components/Navbar.jsx";
import WatchPageSkeleton from "../Components/Skeletons/WatchPageSkeleton.jsx";

const WatchPage = () => {
  const { id } = useParams();

  const [trailers, setTrailers] = useState([]);
  const [currentTrailersId, setCurrentTrailersId] = useState(0);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState(null);
  const [similarContent, setSimilarContent] = useState([]);
  const { contentType } = useContentStore();

  const sliderRef = useRef();

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

  const formatReleaseDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // for fetching trailers
  useEffect(() => {
    const getTrailers = async () => {
      try {
        const response = await axios(`/api/${contentType}/trailer/${id}`);

        setTrailers(response.data.trailers);
      } catch (error) {
        setTrailers([]);
        console.log(
          `Error occurred while fetching the trailers:`,
          error.message
        );
      }
    };

    getTrailers();
  }, [contentType, id]);

  //for fetching similar content
  useEffect(() => {
    const getSimilarContent = async () => {
      try {
        const response = await axios(`/api/${contentType}/similar/${id}`);
        setSimilarContent(response.data.content);
      } catch (error) {
        setSimilarContent([]);
        console.log(
          `Error occurred while fetching similar content:`,
          error.message
        );
      }
    };
    getSimilarContent();
  }, [contentType, id]);

  // getting the movie details
  useEffect(() => {
    const getContentDetails = async () => {
      try {
        const response = await axios(`/api/${contentType}/details/${id}`);
        setContent(response.data.content);
      } catch (error) {
        setContent(null);
        console.log(
          `Error occurred while fetching the movie details:`,
          error.message
        );
      } finally {
        setLoading(false);
      }
    };
    getContentDetails();
  }, [contentType, id]);

  const handlePrev = () => {
    if (currentTrailersId > 0) setCurrentTrailersId(currentTrailersId - 1);
  };

  const handleNext = () => {
    if (currentTrailersId < trailers.length - 1)
      setCurrentTrailersId(currentTrailersId + 1);
  };

  if (loading) {
    return (
      <>
        <div className="min-h-screen bg-black p-10">
          <WatchPageSkeleton />
        </div>
      </>
    );
  }

  if (!content) {
    return (
      <>
        <div className="bg-black text-white h-screen">
          <div className="max-w-6xl mx-auto">
            <Navbar />
            <div className="text-center mx-auto px-4 py-8 h-full mt-40">
              <h2 className="text-2xl sm:text-5xl font-bold text-balance">
                Content not found 🥲
              </h2>
            </div>
          </div>
        </div>
      </>
    );
  }
  return (
    <div className="bg-black min-h-screen text-white">
      <div className="mx-auto container px-4 py-8 h-full">
        <Navbar />
        {trailers.length > 0 && (
          <div className="flex justify-between items-center mb-4">
            <button
              className={`bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded ${
                currentTrailersId === 0 ? "opacity-50 cursor-not-allowed " : ""
              }`}
              onClick={handlePrev}
              disabled={currentTrailersId === 0}
            >
              <ChevronLeft size={24} />
            </button>

            <button
              className={`bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded ${
                currentTrailersId === trailers.length - 1
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={handleNext}
              disabled={currentTrailersId === trailers.length - 1}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}
        <div className="aspect-video mb-8 p-2 sm:px-10 md:px-32">
          {trailers.length > 0 && (
            <ReactPlayer
              controls={true}
              width={"100%"}
              height={"70vh"}
              className="mx-auto overflow-hidden rounded-lg"
              url={`https://www.youtube.com/watch?v=${trailers[currentTrailersId].key}`}
            />
          )}

          {trailers.length === 0 && (
            <h2 className="text-xl text-center mt-5 align-middle">
              No trailers available for{" "}
              <span className="font-bold text-red-500">
                {content?.title || content?.name}
              </span>
              🥲
            </h2>
          )}
        </div>

        {/* movies details */}

        <div
          className="flex flex-col md:flex-row items-center justify-between gap-20 
				max-w-6xl mx-auto"
        >
          <div className="mb-4 md:mb-0">
            <h2 className="text-5xl font-bold text-balance">
              {content?.title || content?.name}
            </h2>
            <p className="mt-2 text-lg">
              {formatReleaseDate(
                content?.release_date || content?.first_air_date
              )}{" "}
              {content?.adult ? (
                <span className="text-red-600">18+</span>
              ) : (
                <span className="text-green-600">PG-13</span>
              )}
            </p>{" "}
            <p className="mt-4 text-lg">{content?.overview}</p>
          </div>
          <img
            src={original_image_Url + content?.poster_path}
            alt="Poster image"
            className="max-h-[600px] rounded-md"
          />
        </div>

        {similarContent.length > 0 && (
          <div className="mt-12 max-w-5xl mx-auto relative">
            <h3 className="mb-4 text-2xl font-bold">Similar Movies/TvShows </h3>
            <div
              className="flex overflow-x-scroll gap-4 pb-4 group element"
              ref={sliderRef}
            >
              {similarContent.map((content) => {
                if (content?.poster_path === null) return null;
                return (
                  <Link
                    key={content?.id}
                    to={`/watch/${content?.id}`}
                    className="w-52 flex-none"
                  >
                    <img
                      src={small_image_base_Url + content?.poster_path}
                      alt="poster path"
                      className="w-full h-auto rounded-sm "
                    />
                    <h4 className="mt-2 text-lg font-semibold">
                      {content?.title || content?.name}
                    </h4>
                  </Link>
                );
              })}

              <button
                onClick={scrollLeft}
                className="absolute top-1/2 -translate-y-1/2 left-2 w-10 h-10 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer bg-red-600 text-white rounded-full flex justify-center items-center"
              >
                <ChevronsLeft size={24} />
              </button>
              <button
                onClick={scrollRight}
                className="absolute top-1/2 -translate-y-1/2 right-2 w-10 h-10 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer bg-red-600 text-white rounded-full flex justify-center items-center"
              >
                <ChevronsRight size={24} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchPage;
