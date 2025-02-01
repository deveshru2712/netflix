import React, { useState } from "react";
import { Search } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

import useContentStore from "../store/Content";
import Navbar from "../Components/Navbar";

import { Link } from "react-router-dom";

import { original_image_Url } from "../Utils/constant.js";

const SearchPage = () => {
  const [activeTab, setActiveTab] = useState("movie");
  const [search, setSearch] = useState("");

  const [results, setResults] = useState([]);
  const { setContentType } = useContentStore();

  const handleTabClick = (tab) => {
    setActiveTab(tab);

    tab === "movie" ? setContentType("movie") : setContentType("tv");
    setResults([]);
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const response = await axios(`/api/search/${activeTab}/${search}`);
      setResults(response.data.content);
    } catch (error) {
      if (error.response.status === 404) {
        toast.error(`Make sure you are searching in the right category 🥲`);
      } else toast.error(`Error occurred while finding the search results`);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center gap-3 mb-4">
          <button
            onClick={() => {
              handleTabClick("movie");
            }}
            className={`py-2 px-4 rounded ${
              activeTab === "movie" ? "bg-red-600" : "bg-gray-800"
            } hover:bg-red-700`}
          >
            Movies
          </button>

          <button
            onClick={() => {
              handleTabClick("tv");
            }}
            className={`py-2 px-4 rounded ${
              activeTab === "tv" ? "bg-red-600" : "bg-gray-800"
            } hover:bg-red-700`}
          >
            Tv Shows
          </button>

          <button
            onClick={() => handleTabClick("person")}
            className={`py-2 px-4 rounded ${
              activeTab === "person" ? "bg-red-600" : "bg-gray-800"
            } hover:bg-red-700`}
          >
            Person
          </button>
        </div>
        <form
          onSubmit={handleSearch}
          className="flex gap-2 items-stretch mb-8 max-w-2xl mx-auto"
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={"Search for a" + activeTab}
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
          <button className="bg-red-600 hover:bg-red-700 text-white p-2 rounded">
            <Search className="size-6" />
          </button>
        </form>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map((result) => {
            if (!result?.poster_path && !result.profile_path) return null;
            return (
              <div key={result.id} className="bg-gray-800 rounded p-4">
                {activeTab === "person" ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={original_image_Url + result?.profile_path}
                      alt="person-image"
                      className="max-h-96 rounded mx-auto"
                    />
                    <h2 className="mt-2 text-xl font-bold">{result?.name}</h2>
                  </div>
                ) : (
                  <Link
                    to={"/watch/" + result?.id}
                    onClick={() => {
                      setContentType(activeTab);
                    }}
                  >
                    <img
                      src={original_image_Url + result?.poster_path}
                      alt={result?.title || result?.name}
                      className="w-full h-auto rounded"
                    />
                    <h2 className="mt-2 text-xl font-bold">
                      {result?.title || result?.name}
                    </h2>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
