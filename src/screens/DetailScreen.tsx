import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity, FlatList, Linking, Dimensions, StatusBar } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { getMovieDetails, getMovieReviews, getMovieCredits, getMovieVideos, getSimilarMovies } from '../services/api';
import { TMDB_IMAGE_BASE_URL } from '@env';
import MovieCard from '../components/MovieCard';
import YoutubePlayer from 'react-native-youtube-iframe';

const { width, height } = Dimensions.get('window');

export default function DetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { id } = route.params;

  const [movie, setMovie] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [credits, setCredits] = useState<any>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [playingTrailer, setPlayingTrailer] = useState(false);
  const [similar, setSimilar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchData();
    checkIfFavorite();
  }, [id]);

  const fetchData = async () => {
    try {
      const [movieData, reviewsData, creditsData, videosData, similarData] = await Promise.all([
        getMovieDetails(id),
        getMovieReviews(id),
        getMovieCredits(id),
        getMovieVideos(id),
        getSimilarMovies(id)
      ]);
      setMovie(movieData);
      setReviews(reviewsData);
      setCredits(creditsData);
      setSimilar(similarData);

      const trailer = videosData.find((vid: any) => vid.site === 'YouTube' && vid.type === 'Trailer');
      setTrailerKey(trailer ? trailer.key : null);
    } catch (error) {
      console.error('Error fetching details', error);
    } finally {
      setLoading(false);
    }
  };

  const checkIfFavorite = async () => {
    try {
      const favsString = await AsyncStorage.getItem('favorites');
      if (favsString) {
        const favs = JSON.parse(favsString);
        setIsFavorite(favs.some((fav: any) => fav.id === id));
      }
    } catch (error) {
      console.error('Error checking favorite', error);
    }
  };

  const toggleFavorite = async () => {
    try {
      const favsString = await AsyncStorage.getItem('favorites');
      let favs = favsString ? JSON.parse(favsString) : [];

      if (isFavorite) {
        favs = favs.filter((fav: any) => fav.id !== id);
      } else {
        favs.push(movie);
      }
      await AsyncStorage.setItem('favorites', JSON.stringify(favs));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite', error);
    }
  };

  const openTrailer = () => {
    if (trailerKey) setPlayingTrailer(!playingTrailer);
  };

  const renderCastItem = ({ item }: { item: any }) => {
    const profileUrl = item.profile_path 
      ? `${TMDB_IMAGE_BASE_URL}${item.profile_path}`
      : 'https://via.placeholder.com/150?text=N/A';

    return (
      <View style={styles.castItem}>
        <Image source={{ uri: profileUrl }} style={styles.castImage} />
        <Text style={styles.castName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.castCharacter} numberOfLines={1}>{item.character}</Text>
      </View>
    );
  };

  if (loading || !movie) {
    return (
      <View style={styles.center}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  const imageUrl = movie.poster_path 
    ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` 
    : 'https://via.placeholder.com/500x750?text=No+Image';

  const genres = movie.genres?.map((g: any) => g.name).join(' • ') || '';
  const director = credits?.crew?.find((member: any) => member.job === 'Director')?.name || 'N/A';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        
        {/* Cinematic Hero Header */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: imageUrl }} style={styles.backdrop} />
          <LinearGradient
            colors={['transparent', 'rgba(10,10,10,0.8)', '#0A0A0A']}
            style={styles.heroGradient}
          />
          
          <View style={styles.heroContent}>
            <Text style={styles.title}>{movie.title}</Text>
            {movie.tagline ? <Text style={styles.tagline}>{movie.tagline}</Text> : null}
            
            <View style={styles.metaRow}>
              <View style={styles.badge}>
                <Ionicons name="star" size={14} color="#F5C518" />
                <Text style={styles.badgeText}>{movie.vote_average.toFixed(1)}</Text>
              </View>
              <Text style={styles.metaText}>{movie.release_date?.substring(0, 4) || 'N/A'}</Text>
              <Text style={styles.metaText}>{movie.runtime}m</Text>
            </View>
            <Text style={styles.genresText}>{genres}</Text>
          </View>
        </View>

        {/* Content Body */}
        <View style={styles.bodyContent}>
          
          {playingTrailer && trailerKey && (
            <View style={styles.inlineVideoContainer}>
              <YoutubePlayer
                height={(width - 40) * (9 / 16)}
                play={playingTrailer}
                videoId={trailerKey}
                onChangeState={(state: string) => {
                  if (state === 'ended') {
                    setPlayingTrailer(false);
                  }
                }}
              />
            </View>
          )}

          <View style={styles.actionRow}>
            {trailerKey ? (
              <TouchableOpacity style={styles.trailerButton} onPress={openTrailer}>
                <Ionicons name={playingTrailer ? "close" : "play"} size={20} color="#fff" />
                <Text style={styles.trailerButtonText}>{playingTrailer ? "Close Trailer" : "Play Trailer"}</Text>
              </TouchableOpacity>
            ) : <View style={{ flex: 1 }} />}
            
            <TouchableOpacity onPress={toggleFavorite} style={styles.iconButton}>
              <BlurView tint="dark" intensity={80} style={styles.iconButtonBlur}>
                <Ionicons 
                  name={isFavorite ? 'heart' : 'heart-outline'} 
                  size={28} 
                  color={isFavorite ? '#E50914' : '#fff'} 
                />
              </BlurView>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Storyline</Text>
          <Text style={styles.overview}>{movie.overview}</Text>
          
          <Text style={styles.directorText}>
            <Text style={styles.directorLabel}>Director: </Text>
            {director}
          </Text>

          {credits?.cast && credits.cast.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Cast</Text>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={credits.cast.slice(0, 15)}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderCastItem}
                contentContainerStyle={styles.horizontalList}
              />
            </>
          )}

          <Text style={styles.sectionTitle}>Reviews</Text>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewAvatar}>
                    <Text style={styles.reviewAvatarText}>{review.author.charAt(0).toUpperCase()}</Text>
                  </View>
                  <Text style={styles.reviewAuthor}>{review.author}</Text>
                </View>
                <Text style={styles.reviewContent} numberOfLines={4}>{review.content}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>No reviews available yet.</Text>
          )}

          {similar.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Similar Movies</Text>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={similar}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <MovieCard movie={item} />}
                contentContainerStyle={[styles.horizontalList, { paddingLeft: 10 }]}
              />
            </>
          )}
          
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Floating Back Button */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <BlurView tint="dark" intensity={80} style={styles.backButtonBlur}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </BlurView>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A0A' },
  heroContainer: { width, height: height * 0.65, position: 'relative' },
  backdrop: { width: '100%', height: '100%', resizeMode: 'cover' },
  heroGradient: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '70%' },
  heroContent: { position: 'absolute', bottom: 0, left: 20, right: 20, paddingBottom: 20 },
  title: { color: '#fff', fontSize: 32, fontWeight: '900', marginBottom: 8, letterSpacing: 0.5 },
  tagline: { color: '#ccc', fontSize: 16, fontStyle: 'italic', marginBottom: 12 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 12 },
  badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: '#fff', fontSize: 14, fontWeight: 'bold', marginLeft: 4 },
  metaText: { color: '#aaa', fontSize: 14, fontWeight: '600' },
  genresText: { color: '#888', fontSize: 14, marginTop: 4 },
  bodyContent: { paddingHorizontal: 20, paddingTop: 10 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  trailerButton: { flex: 1, flexDirection: 'row', backgroundColor: '#E50914', paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 16, shadowColor: '#E50914', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 5 },
  trailerButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
  iconButton: { width: 50, height: 50, borderRadius: 25, overflow: 'hidden' },
  iconButtonBlur: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)' },
  sectionTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 16, marginTop: 10 },
  overview: { color: '#ccc', fontSize: 15, lineHeight: 24, marginBottom: 16 },
  directorText: { color: '#aaa', fontSize: 15, marginBottom: 30 },
  directorLabel: { fontWeight: 'bold', color: '#fff' },
  horizontalList: { paddingRight: 20 },
  castItem: { width: 110, marginRight: 16 },
  castImage: { width: 110, height: 160, borderRadius: 12, marginBottom: 8 },
  castName: { color: '#fff', fontWeight: 'bold', fontSize: 14, marginBottom: 2 },
  castCharacter: { color: '#888', fontSize: 12 },
  reviewCard: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 16, borderRadius: 16, marginBottom: 16 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  reviewAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E50914', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  reviewAvatarText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  reviewAuthor: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  reviewContent: { color: '#aaa', lineHeight: 22, fontSize: 14 },
  noDataText: { color: '#888', fontStyle: 'italic', marginBottom: 20 },
  backButton: { position: 'absolute', top: 50, left: 20, width: 44, height: 44, borderRadius: 22, overflow: 'hidden' },
  backButtonBlur: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
  inlineVideoContainer: { width: '100%', marginBottom: 20, borderRadius: 12, overflow: 'hidden', backgroundColor: '#000' }
});
