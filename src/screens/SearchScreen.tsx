import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, StyleSheet, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { searchMovies, getMovieGenres, discoverMoviesByGenre } from '../services/api';
import MovieCard from '../components/MovieCard';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<any[]>([]);
  const [genres, setGenres] = useState<any[]>([]);
  const [activeGenre, setActiveGenre] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const data = await getMovieGenres();
      setGenres(data);
    } catch (error) {
      console.error('Error fetching genres', error);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    setActiveGenre(null);
    setLoading(true);
    setSearched(true);
    try {
      const data = await searchMovies(query);
      setMovies(data);
    } catch (error) {
      console.error('Error searching movies', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenreSelect = async (genreId: number) => {
    setQuery('');
    setActiveGenre(genreId);
    setLoading(true);
    setSearched(true);
    try {
      const data = await discoverMoviesByGenre(genreId);
      setMovies(data);
    } catch (error) {
      console.error('Error discovering movies', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Search</Text>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Movies, actors, directors..."
            placeholderTextColor="#666"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={20} color="#888" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.genresContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={genres}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[styles.genreButton, activeGenre === item.id && styles.activeGenreButton]}
                onPress={() => handleGenreSelect(item.id)}
              >
                <Text style={[styles.genreText, activeGenre === item.id && styles.activeGenreText]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          />
        </View>
        
        {loading ? (
          <ActivityIndicator size="large" color="#E50914" style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={movies}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <MovieCard movie={item} />}
            numColumns={2}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              searched && !loading ? (
                <View style={styles.emptyContainer}>
                  <Ionicons name="film-outline" size={64} color="#333" />
                  <Text style={styles.emptyText}>No movies found</Text>
                  <Text style={styles.emptySubText}>Try searching for something else</Text>
                </View>
              ) : null
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    marginHorizontal: 20,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  genresContainer: {
    paddingBottom: 20,
  },
  genreButton: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  activeGenreButton: {
    backgroundColor: '#E50914',
    borderColor: '#E50914',
  },
  genreText: {
    color: '#aaa',
    fontSize: 14,
    fontWeight: '600',
  },
  activeGenreText: {
    color: '#fff',
  },
  list: {
    paddingHorizontal: 12,
    paddingBottom: 100, // Space for tab bar
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubText: {
    color: '#666',
    fontSize: 14,
    marginTop: 8,
  },
});
