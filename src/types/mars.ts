/**
 * Types for Mars 3D Explorer - American Space Dushanbe
 */

import { NASAImage, PlanetType } from './planetary';

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

export interface MarsPOI {
  id: string;
  planet?: PlanetType;
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
  photos?: NASAImage[];
  geologicalCompositionRu?: string[];
  kidFriendlyChallengeRu: string;
  unlockedByDefault?: boolean;
}

export interface QuizQuestion {
  id: number;
  questionRu: string;
  questionEn: string;
  optionsRu: string[];
  optionsEn: string[];
  correctIndex: number;
  explanationRu: string;
  explanationEn: string;
  funFactRu: string;
}

export interface RoverComponent {
  id: string;
  nameRu: string;
  nameEn: string;
  iconName: string;
  roleRu: string;
  kidExplanationRu: string;
  nasaDetailsRu: string;
  specMetric: string;
}

export interface TimelineMilestone {
  year: number;
  name: string;
  agency: string;
  type: 'flyby' | 'orbiter' | 'lander' | 'rover' | 'helicopter' | 'future';
  titleRu: string;
  descriptionRu: string;
  scientificBreakthroughRu: string;
  status: 'completed' | 'active' | 'planned';
}
