'use client';
import useSWR, { SWRConfiguration } from 'swr';

export class FetchError extends Error {
  status: number;
  info: any;
  constructor(message: string, status: number, info: any) {
    super(message);
    this.status = status;
    this.info = info;
  }
}

export async function fetcher<T = any>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const info = await res.json().catch(() => ({}));
    throw new FetchError(info?.error || `Request failed (${res.status})`, res.status, info);
  }
  return res.json();
}

const common: SWRConfiguration = { revalidateOnFocus: false, shouldRetryOnError: false };

// ─── Typed hooks ───
export interface GamificationData {
  xp: number; level: number; streak: number; streakFreezes: number;
  xpIntoLevel: number; xpForLevel: number; newlyEarned: string[];
  badges: { code: string; name: string; description: string; icon: string; earned: boolean; earnedAt: string | null }[];
}
export const useGamification = () => useSWR<GamificationData>('/api/gamification', fetcher, common);

export interface ChatListItem { id: string; title: string; subject: string | null; mode: string; messageCount: number; updatedAt: string }
export const useChats = () => useSWR<{ chats: ChatListItem[] }>('/api/chats', fetcher, common);

export interface WeakTopic { subject: string; chapter: string | null; topic: string | null; attempts: number; accuracy: number }
export const useWeakTopics = () => useSWR<{ weakTopics: WeakTopic[] }>('/api/analytics/weak-topics', fetcher, common);

export interface MockTestListItem { id: string; title: string; subject: string; classNum: number; durationMin: number; totalMarks: number; bestScore: number | null; createdAt: string }
export const useMockTests = () => useSWR<{ tests: MockTestListItem[] }>('/api/mock-test', fetcher, common);

export interface ReviewCard { id: string; subject: string; chapter: string; topic: string | null; prompt: string; answer: string; dueAt: string; repetitions: number }
export const useReviews = () => useSWR<{ due: ReviewCard[]; dueCount: number; upcomingCount: number }>('/api/review', fetcher, common);

export interface PlanItem { id: string; subject: string; chapter: string; topic: string | null; dueDate: string; status: string; order: number }
export interface StudyPlan { id: string; title: string; subject: string | null; classNum: number; targetDate: string; total: number; done: number; items: PlanItem[] }
export const useStudyPlans = () => useSWR<{ plans: StudyPlan[] }>('/api/study-plan', fetcher, common);

export interface Leader { rank: number; name: string; score: number; level: number; isCurrentUser: boolean }
export const useLeaderboard = (scope: 'global' | 'class') =>
  useSWR<{ scope: string; leaders: Leader[] }>(`/api/leaderboard?scope=${scope}`, fetcher, common);

export interface ProgressData { subjects: { subject: string; avgScore: number; count: number }[]; streak: number; totalSolved: number; weeklyGoal: { done: number; target: number } }
export const useProgress = () => useSWR<ProgressData>('/api/progress', fetcher, common);

export interface ParentLinkItem { id: string; code: string; label: string | null; active: boolean; expiresAt: string | null; lastUsedAt: string | null; viewCount: number; createdAt: string }
export const useParentLinks = () => useSWR<{ links: ParentLinkItem[] }>('/api/parent-link', fetcher, common);

export interface MeData { user: { id: string; name: string | null; email: string; image: string | null; grade: string | null; board: string | null; goal: string | null } }
export const useMe = () => useSWR<MeData>('/api/user/me', fetcher, common);
