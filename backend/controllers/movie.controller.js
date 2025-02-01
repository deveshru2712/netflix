import fetchFromTMDB from "../Services/tmdb.service.js";

export const getTrendingMovies = async (req, res) => {
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/trending/movie/day?language=en-US`
    );

    const movie =
      data.results[Math.floor(Math.random() * data.results?.length)];

    res.json({ success: true, content: movie });
  } catch (error) {
    console.log(
      `An error occurred in the trending fetching controller:${error.message} `
    );
    res.status(500).json({
      success: false,
      message: "Interval Server Error",
    });
  }
};

export const getTrailerMovies = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`
    );

    res.json({ success: true, trailers: data.results });
  } catch (error) {
    console.log(
      `An error occurred in the trailer fetching controller:${error.message} `
    );
    res.status(500).json({
      success: false,
      message: "Interval Server Error",
    });
  }
};

export const getDetailsMovies = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${id}?language=en-US`
    );

    res.status(200).json({
      success: true,
      content: data,
    });
  } catch (error) {
    console.log(
      `An error occurred in the get details controller:${error.message} `
    );
    res.status(500).json({
      success: false,
      message: "Interval Server Error",
    });
  }
};

export const getSimilarMovies = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1`
    );

    res.status(200).json({
      success: true,
      content: data.results,
    });
  } catch (error) {
    console.log(`Error occurred in the get similar: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getByCategoryMovies = async (req, res) => {
  const { category } = req.params;
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`
    );

    res.status(200).json({
      success: true,
      content: data.results,
    });
  } catch (error) {
    console.log(
      `Error occurred in the get by category controller: ${error.message}`
    );
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
