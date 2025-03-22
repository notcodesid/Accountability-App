import { Request, Response, NextFunction } from 'express';
import { User } from '@prisma/client';

export enum GoalType {
  STEPS = 'STEPS',
  WORKOUTS = 'WORKOUTS',
  MEDITATION = 'MEDITATION',
  CUSTOM = 'CUSTOM'
}

export enum DataSource {
  GOOGLE_FIT = 'GOOGLE_FIT',
  APPLE_HEALTH = 'APPLE_HEALTH',
  FITBIT = 'FITBIT',
  MANUAL = 'MANUAL'
}

export interface FirebaseUser {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
}

export interface AuthRequest extends Request {
  user?: User;
}

// Custom request handler that allows return values from Express routes
export type RequestHandler = (
  req: Request,
  res: Response,
  next?: NextFunction
) => Promise<any> | any;

export interface CreateChallengeInput {
  title: string;
  description: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  goalType: GoalType;
  goalTarget: number;
  entryFee: number;
  isPublic: boolean;
}

export interface JoinChallengeInput {
  challengeId: string;
}

export interface RecordProgressInput {
  challengeId: string;
  date: string; // ISO date string
  value: number;
  source: DataSource;
} 