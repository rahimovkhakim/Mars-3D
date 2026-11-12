/**
 * Planetary and Space Exploration Types
 * Supports Earth and Mars scientific simulation for American Space Dushanbe
 */

export type PlanetType = 'mars' | 'earth';

export type POICategory =
  | 'volcano'
  | 'canyon'
  | 'rover'
  | 'pole'
  | 'crater'
  | 'plain'
  | 'spaceport'
  | 'observatory'
  | 'station'
  | 'ocean'
  | 'mountain';

export interface NASAImage {
  id: string;
  titleRu: string;
  titleEn: string;
  descriptionRu: string;
  camera: string;
  mission: string;
  year: number;
  imageUrl: string;
  credit: string;
  tags?: string[];
}

export interface PlanetaryPOI {
  id: string;
  planet: PlanetType;
  nameRu: string;
  nameEn: string;
  category: POICategory;
  badge: string;
  lat: number; // -90 to +90
  lon: number; // -180 to +180
  elevationKm: number;
  diameterKm?: number;
  missionName?: string;
  missionYear?: number;
  highlightFactRu: string;
  highlightFactEn: string;
  shortDescRu: string;
  shortDescEn: string;
  detailedTextRu: string;
  detailedTextEn: string;
  nasaDataRu: {
    label: string;
    value: string;
  }[];
  photos: NASAImage[];
  geologicalCompositionRu?: string[];
  kidFriendlyChallengeRu: string;
  unlockedByDefault?: boolean;
}

export interface PlanetComparisonMetric {
  id: string;
  nameRu: string;
  earthValue: string;
  marsValue: string;
  ratioNoticeRu: string;
  icon: string;
  category: 'physics' | 'atmosphere' | 'magnetism' | 'hydrology' | 'orbit';
  kidFactRu: string;
  scienceExplanationRu: string;
}

export interface ISSData {
  nameRu: string;
  speedKmh: number;
  altitudeKm: number;
  periodMinutes: number;
  crewCount: number;
  launchYear: number;
  massKg: number;
  pressurizedVolumeM3: number;
  modules: {
    name: string;
    agency: string;
    year: number;
    descriptionRu: string;
  }[];
}
