import React, { useEffect, useState } from "react";
import useContentStore from "../Store/ContentStore";
import axios from "axios";

const useTrending = () => {
  const [trendingContent, setTrendingContent] = useState(null);
  const { contentType } = useContentStore();

  useEffect(() => {
    const getTrending = async () => {
      const response = await axios(`/api/${contentType}/trending`);
      setTrendingContent(response.data.content);
    };
    getTrending();
  }, [contentType]);
  return { trendingContent };
};

export default useTrending;
