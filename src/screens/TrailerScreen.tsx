import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

export default function TrailerScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { trailerKey } = route.params;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <View style={styles.videoContainer}>
        <YoutubePlayer
          height={width * (9 / 16)}
          play={true}
          videoId={trailerKey}
          onChangeState={(state) => {
            if (state === 'ended') {
              navigation.goBack();
            }
          }}
        />
      </View>

      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <BlurView tint="dark" intensity={80} style={styles.backButtonBlur}>
          <Ionicons name="close" size={28} color="#fff" />
        </BlurView>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000', 
    justifyContent: 'center' 
  },
  videoContainer: { 
    width: '100%',
  },
  backButton: { 
    position: 'absolute', 
    top: 50, 
    left: 20, 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    overflow: 'hidden' 
  },
  backButtonBlur: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255,255,255,0.2)' 
  }
});
