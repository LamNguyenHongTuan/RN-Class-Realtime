import React from 'react';
import { View, Image, StyleSheet, ViewStyle, ImageStyle } from 'react-native';

interface VKULogoProps {
  width?: number;
  height?: number;
  style?: ViewStyle;
  imageStyle?: ImageStyle;
}

export const VKULogo: React.FC<VKULogoProps> = ({
  width = 90,
  height = 46,
  style,
  imageStyle,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Image
        source={require('../../assets/vku-logo.png')}
        style={[
          {
            width,
            height,
          },
          styles.logoImage,
          imageStyle,
        ]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    // Keep aspect ratio
  },
});
