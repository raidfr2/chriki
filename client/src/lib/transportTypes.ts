export type SegmentMode = 'walk' | 'bus' | 'tram';

export type PointKind = 'start' | 'end';

export interface PointSegment {
  type: 'point';
  kind: PointKind;
  title: string;
  subtitle?: string;
  icon?: string; // optional emoji/icon override
  color?: string; // tailwind color or hex for circle
}

export interface WalkSegment {
  type: 'walk';
  minutes: number;
  distanceMeters: number;
}

export interface TransitSegment {
  type: 'transit';
  mode: Exclude<SegmentMode, 'walk'>; // 'bus' | 'tram'
  fromTitle: string;
  fromSubtitle?: string;
  toTitle: string;
  toSubtitle?: string;
  minutes: number;
  headwayMinutes?: number; // e.g., every 20 minutes
  lineLabel?: string; // e.g., Line 39, Algiers Tramway
  priceLabel?: string; // e.g., 1 $US
}

export type RouteSegment = PointSegment | WalkSegment | TransitSegment;

export interface RoutePlanMeta {
  title: string; // e.g., "🚌 Bus, tram"
  durationLabel: string; // e.g., "49 min"
}

export interface RoutePlan {
  meta: RoutePlanMeta;
  segments: RouteSegment[];
}

export const demoRoutePlan: RoutePlan = {
  meta: { title: 'De Rouïba à Hôpital Mustapha-Pacha', durationLabel: '49 min' },
  segments: [
    { type: 'point', kind: 'start', title: 'Sidi Dris', subtitle: 'Rouïba, Algérie', icon: '🚶', color: '#6b7280' },
    { type: 'transit', mode: 'tram', fromTitle: 'Sidi Dris', fromSubtitle: 'Rouïba, Algérie', toTitle: 'APC Bab Ezzouar - CUB 3', toSubtitle: 'Alger', minutes: 16, headwayMinutes: 10, lineLabel: 'Algiers Tramway' },
    { type: 'walk', minutes: 8, distanceMeters: 680 },
    { type: 'transit', mode: 'bus', fromTitle: 'Station 02 Mai', fromSubtitle: 'Alger', toTitle: 'Place du 1er Mai', toSubtitle: 'Alger', minutes: 13, headwayMinutes: 20, lineLabel: 'Line 39', priceLabel: '1 $US' },
    { type: 'walk', minutes: 7, distanceMeters: 610 },
    { type: 'point', kind: 'end', title: 'Hôpital Mustapha-Pacha', subtitle: 'Hôpital Mustapha-Pacha, Algérie', icon: '📍', color: '#ef4444' },
  ],
};
