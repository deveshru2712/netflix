import fetchFromTMDB from "../Services/tmdb.service.js";
import User from "../models/user.model.js";

export const searchPerson = async (req, res) => {
  const { query } = req.params;
  try {
    const response = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/person?query=${query}&include_adult=false&language=en-US&page=1`
    );

    if (response.results.length === 0) {
      return res.status(404).send(null);
    }

    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        searchHistory: {
          id: response.results[0].id,
          image: response.results[0].profile_path,
          searchType: "Person",
          title: response.results[0].name,
          createdAt: Date.now(),
        },
      },
    });

    res.status(200).json({
      success: true,
      content: response.results,
    });
  } catch (error) {
    console.log(
      `Error occurred in the search person controller: ${error.message}`
    );
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const searchMovie = async (req, res) => {
  const { query } = req.params;

  try {
    const response = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`
    );

    if (response.results.length === 0) {
      return res.status(404).send(null);
    }

    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        searchHistory: {
          id: response.results[0].id,
          image: response.results[0].poster_path,
          searchType: "Movie",
          title: response.results[0].title,
          createdAt: Date.now(),
        },
      },
    });

    res.status(200).json({
      success: true,
      content: response.results,
    });
  } catch (error) {
    console.log(
      `Error occurred in the  search movie controllers: ${error.message}`
    );
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const searchTv = async (req, res) => {
  const { query } = req.params;

  try {
    const response = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=false&language=en-US&page=1`
    );

    if (response.results.length === 0) {
      return res.status(404).send(null);
    }

    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        searchHistory: {
          id: response.results[0].id,
          image: response.results[0].poster_path,
          searchType: "Tv",
          title: response.results[0].name,
          createdAt: Date.now(),
        },
      },
    });

    res.status(200).json({
      success: true,
      content: response.results,
    });
  } catch (error) {
    console.log(
      `Error occurred in the  search tv controllers: ${error.message}`
    );
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getSearchHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findOne(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Unable to find the user",
      });
    }

    const searchHistory = user.searchHistory;

    return res.status(200).json({
      success: true,
      content: searchHistory,
    });
  } catch (error) {
    console.log(
      `Error occurred while fetching the user search history: ${error.message}`
    );
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const removeFromSearchHistory = async (req, res) => {
  const userId = req.user._id;
  let { id } = req.params;

  // parsing the id as what we receive from the params is always a string
  id = parseInt(id);
  try {
    const updatedHistory = await User.findByIdAndUpdate(userId, {
      $pull: {
        searchHistory: { id },
      },
    });

    res.status(200).json({
      success: true,
      content: "Search history deleted",
    });
  } catch (error) {
    console.log(
      `Error occurred while deleting the user search history: ${error.message}`
    );
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
