import React, { useState } from "react";

import { Link } from "react-router-dom";
import { Play } from "lucide-react";

import Navbar from "../../Components/Navbar";
import ContentSlider from "../../Components/ContentSlider";

import useTrending from "../../Hooks/useTrending";

import {
  movie_category,
  original_image_Url,
  tv_category,
} from "../../Utils/Constant";

import useContentStore from "../../Store/ContentStore";

const HomeScreen = () => {
  const { trendingContent } = useTrending();
  const { contentType } = useContentStore();
  const [isLoading, setImageLoading] = useState(true);

  if (!trendingContent) {
    return (
      <>
        <div className="h-screen text-white relative">
          <Navbar />
          <div className="absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center -z-10 shimmer" />
        </div>
      </>
    );
  }
  return (
    <>
      <div className="relative h-screen text-white">
        <Navbar />

        {isLoading && (
          <div className="absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center shimmer -z-10" />
        )}

        <img
          src={original_image_Url + trendingContent?.backdrop_path}
          onLoad={() => {
            setImageLoading(false);
          }}
          alt="image"
          className="absolute top-0 left-0 h-full w-full object-cover -z-50"
        />

        <div
          className="absolute top-0 left-0 w-full h-full bg-black/60 -z-50"
          aria-hidden="true"
        />
        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center px-8 md:px-16 lg:px-32">
          <div className="bg-gradient-to-b from-black via-transparent to-transparent absolute w-full h-full top-0 left-0 -z-10" />

          <div className="max-w-2xl">
            <h1 className="mt-4 text-6xl font-extrabold text-balance">
              {trendingContent?.title || trendingContent?.name}
            </h1>
            <p className="mt-2 text-lg">
              {trendingContent?.release_date?.split("-")[0]}
              {trendingContent?.first_air_date?.split("-")[0]} |{" "}
              {trendingContent?.adult ? "18+" : "PG-13"}
            </p>

            <p className="mt-4 text-lg">
              {trendingContent?.overview.length > 200
                ? trendingContent?.overview.slice(0, 200) + "..."
                : trendingContent?.overview}
            </p>
          </div>

          <div className="flex mt-8">
            <Link
              to={`/watch/${trendingContent?.id}`}
              className="bg-white hover:bg-white/80 text-black font-bold py-2 px-4 rounded mr-4 flex items-center"
            >
              <Play className="size-6 inline-block mr-2 fill-black" />
              Play
            </Link>

            <Link
              // to={`/`}
              className="bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded flex items-center"
            >
              More Info
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-10 bg-black py-10">
        {contentType === "movie"
          ? movie_category.map((category) => (
              <ContentSlider key={category} category={category} />
            ))
          : tv_category.map((category) => (
              <ContentSlider key={category} category={category} />
            ))}
      </div>
    </>
  );
};

export default HomeScreen;
