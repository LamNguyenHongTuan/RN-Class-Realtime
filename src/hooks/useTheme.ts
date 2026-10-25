import { useBookingStore } from '../store/useBookingStore';
import { VKU_COLORS } from '../constants/colors';

export function useTheme() {
  const { themeMode } = useBookingStore();
  const isDark = themeMode === 'dark';
  return {
    isDark,
    themeMode,
    // backgrounds
    bg: isDark ? '#0f172a' : '#f8fafc',
    card: isDark ? '#1e293b' : '#ffffff',
    cardBorder: isDark ? '#334155' : '#e2e8f0',
    inputBg: isDark ? '#1e293b' : '#f8fafc',
    searchBg: isDark ? '#1e293b' : '#f1f5f9',
    sectionBg: isDark ? '#1e293b' : '#f8fafc',
    tabBar: isDark ? '#1e293b' : '#ffffff',
    tabBorder: isDark ? '#334155' : '#e2e8f0',
    // text
    textPrimary: isDark ? '#f1f5f9' : '#0f172a',
    textSecondary: isDark ? '#cbd5e1' : '#1e293b',
    textMuted: isDark ? '#94a3b8' : '#64748b',
    textSubtle: isDark ? '#64748b' : '#94a3b8',
    // borders/dividers
    divider: isDark ? '#334155' : '#f1f5f9',
    border: isDark ? '#334155' : '#e2e8f0',
    switchBg: isDark ? '#334155' : '#cbd5e1',
    chipBg: isDark ? '#1e293b' : '#f1f5f9',
    chipBorderColor: isDark ? '#334155' : '#e2e8f0',
    chipText: isDark ? '#94a3b8' : '#475569',
    capacityBg: isDark ? '#0f172a' : '#f8fafc',
    // VKU brand always same
    ...VKU_COLORS,
    headerBg: VKU_COLORS.darkBlue,
  };
}
