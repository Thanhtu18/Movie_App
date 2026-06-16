import axios from 'axios';
import { TMDB_ACCESS_TOKEN, TMDB_BASE_URL } from '@env';

// If @env doesn't load correctly (e.g., TS type issues), fallback or assure it's working:
const API_URL = TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const TOKEN = TMDB_ACCESS_TOKEN;

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${TOKEN}`,
  },
});

export const getTrendingMovies = async () => {
  const response = await apiClient.get('/trending/movie/week');
  return response.data.results;
};

export const searchMovies = async (query: string) => {
  const response = await apiClient.get('/search/movie', {
    params: { query },
  });
  return response.data.results;
};

export const getMovieDetails = async (id: number) => {
  const response = await apiClient.get(`/movie/${id}`);
  return response.data;
};

export const getMovieReviews = async (id: number) => {
  const response = await apiClient.get(`/movie/${id}/reviews`);
  return response.data.results;
};

export const getMovieCredits = async (id: number) => {
  const response = await apiClient.get(`/movie/${id}/credits`);
  return response.data;
};

export const getMovieVideos = async (id: number) => {
  const response = await apiClient.get(`/movie/${id}/videos`);
  return response.data.results;
};

export const getSimilarMovies = async (id: number) => {
  const response = await apiClient.get(`/movie/${id}/similar`);
  return response.data.results;
};

export const getNowPlayingMovies = async () => {
  const response = await apiClient.get('/movie/now_playing');
  return response.data.results;
};

export const getMovieGenres = async () => {
  const response = await apiClient.get('/genre/movie/list');
  return response.data.genres;
};

export const discoverMoviesByGenre = async (genreId: number) => {
  const response = await apiClient.get('/discover/movie', {
    params: { with_genres: genreId },
  });
  return response.data.results;
};
