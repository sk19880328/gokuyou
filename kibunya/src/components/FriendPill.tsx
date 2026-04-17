// 友達ステータスピル(横スクロール用)
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../config/colors';

type Props = {
  name: string;
  online: boolean;
};

export default function FriendPill({ name, online }: Props) {
  return (
    <View style={styles.pill}>
      <View
        style={[
          styles.dot,
          { backgroundColor: online ? '#3BB273' : 'rgba(26,26,26,0.2)' },
        ]}
      />
      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: 'rgba(27,58,107,0.08)',
    borderRadius: 20,
    marginRight: 8,
    maxWidth: 140,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  name: {
    fontSize: 12,
    color: colors.ai,
    fontWeight: '500',
  },
});
