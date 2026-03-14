import React, { useCallback, useEffect, useState } from 'react';
import { Sun, Moon, User, Mail, Edit, Save, Loader2, LogOut, Flame } from 'lucide-react';

import type { AppTheme } from '../app/types';
import { db } from '../db';
import { signOut } from '../lib/auth';
import { getCurrentUser, getMyProfile, upsertProfile } from '../lib/userDb';
import { useUserLevel } from '../hooks/useUserLevel';
import LevelBadge from './LevelBadge';
import XPProgressBar from './XPProgressBar';
import LevelUpModal from './LevelUpModal';
import { TransitionPlaceholder } from './TransitionUI';
import useDelayedPending from '../hooks/useDelayedPending';

type ProfileData = {
    nickname: string;
    email: string;
    joinedDate: string;
    bio: string;
};

type CachedProfile = {
    data: ProfileData;
    editBio: string;
    updatedAt: number;
};

type CachedStats = {
    bookmarkCount: number;
    reviewCount: number;
    masteredCount: number;
    updatedAt: number;
};

const PROFILE_CACHE_KEY = 'vm_profile_cache_v1';
const PROFILE_STATS_CACHE_KEY = 'vm_profile_stats_cache_v1';

const safeReadJson = <T,>(key: string): T | null => {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        return JSON.parse(raw) as T;
    } catch {
        return null;
    }
};

const safeWriteJson = (key: string, value: unknown) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
    }
};

const formatDate = (iso: string | null | undefined) => {
    if (!iso) return '-';
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('ko-KR');
};

const ProfileView = ({ theme, onThemeChange }: { theme: AppTheme; onThemeChange: (theme: AppTheme) => void }) => {
    const [loading, setLoading] = useState(true);
    const [statsLoading, setStatsLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const [profileData, setProfileData] = useState<ProfileData>({
        nickname: '',
        email: '',
        joinedDate: '-',
        bio: ''
    });

    const [editNickname, setEditNickname] = useState('');
    const [editBio, setEditBio] = useState('');

    const [bookmarkCount, setBookmarkCount] = useState(0);
    const [reviewCount, setReviewCount] = useState(0);
    const [masteredCount, setMasteredCount] = useState(0);
    const loadingVisible = useDelayedPending(loading);

    const { totalXP, currentLevel, streakDays, xpProgress, levelUpInfo, clearLevelUp } = useUserLevel();

    const handleThemeToggle = useCallback((newTheme: AppTheme, e: React.MouseEvent) => {
        e.preventDefault();
        onThemeChange(newTheme);
    }, [onThemeChange]);

    const loadProfile = useCallback(async ({ silent = false }: { silent?: boolean } = {}) => {
        if (!silent) {
            setLoading(true);
        }
        setErrorMessage('');

        try {
            const [user, profile] = await Promise.all([
                getCurrentUser(),
                getMyProfile(),
            ]);

            const nickname = profile?.nickname?.trim() || user.email?.split('@')[0] || 'User';
            const bio = profile?.bio?.trim() || '아직 소개가 없습니다.';

            const nextProfileData: ProfileData = {
                nickname,
                email: user.email ?? '-',
                joinedDate: formatDate(user.created_at),
                bio,
            };

            setProfileData(nextProfileData);

            setEditNickname(nickname);
            setEditBio(profile?.bio ?? '');

            safeWriteJson(PROFILE_CACHE_KEY, {
                data: nextProfileData,
                editBio: profile?.bio ?? '',
                updatedAt: Date.now(),
            } satisfies CachedProfile);
        } catch (error) {
            const message = error instanceof Error ? error.message : '프로필 정보를 불러오지 못했습니다.';
            setErrorMessage(message);
        } finally {
            if (!silent) {
                setLoading(false);
            }
        }
    }, []);

    const loadStats = useCallback(async ({ silent = false }: { silent?: boolean } = {}) => {
        if (!silent) {
            setStatsLoading(true);
        }
        try {
            const [bookmarks, records] = await Promise.all([
                db.bookmarks.count(),
                db.studyRecords.toArray(),
            ]);
            const mastered = records.filter((row) => row.memoryScore >= 3).length;
            setBookmarkCount(bookmarks);
            setReviewCount(records.length);
            setMasteredCount(mastered);

            safeWriteJson(PROFILE_STATS_CACHE_KEY, {
                bookmarkCount: bookmarks,
                reviewCount: records.length,
                masteredCount: mastered,
                updatedAt: Date.now(),
            } satisfies CachedStats);
        } catch (error) {
            const message = error instanceof Error ? error.message : '학습 통계를 불러오지 못했습니다.';
            setErrorMessage(message);
        } finally {
            if (!silent) {
                setStatsLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        const cachedProfile = safeReadJson<CachedProfile>(PROFILE_CACHE_KEY);
        const cachedStats = safeReadJson<CachedStats>(PROFILE_STATS_CACHE_KEY);

        if (cachedProfile?.data) {
            setProfileData(cachedProfile.data);
            setEditNickname(cachedProfile.data.nickname);
            setEditBio(cachedProfile.editBio ?? '');
            setLoading(false);
            void loadProfile({ silent: true });
        } else {
            void loadProfile();
        }

        if (cachedStats) {
            setBookmarkCount(cachedStats.bookmarkCount);
            setReviewCount(cachedStats.reviewCount);
            setMasteredCount(cachedStats.masteredCount);
            setStatsLoading(false);
            void loadStats({ silent: true });
        } else {
            void loadStats();
        }
    }, [loadProfile, loadStats]);

    const handleProfileEdit = () => {
        setEditNickname(profileData.nickname);
        setEditBio(profileData.bio === '아직 소개가 없습니다.' ? '' : profileData.bio);
        setIsEditing(true);
    };

    const handleProfileSave = async () => {
        const nickname = editNickname.trim();
        if (!nickname) {
            setErrorMessage('닉네임을 입력해 주세요.');
            return;
        }

        setSaving(true);
        setErrorMessage('');

        try {
            await upsertProfile(nickname, editBio.trim());
            const nextData = {
                ...profileData,
                nickname,
                bio: editBio.trim() || '아직 소개가 없습니다.'
            };

            setProfileData(nextData);
            safeWriteJson(PROFILE_CACHE_KEY, {
                data: nextData,
                editBio: editBio.trim(),
                updatedAt: Date.now(),
            } satisfies CachedProfile);
            setIsEditing(false);
        } catch (error) {
            const message = error instanceof Error ? error.message : '프로필 저장 중 오류가 발생했습니다.';
            setErrorMessage(message);
        } finally {
            setSaving(false);
        }
    };

    const handleProfileCancel = () => {
        setIsEditing(false);
        setEditNickname(profileData.nickname);
        setEditBio(profileData.bio === '아직 소개가 없습니다.' ? '' : profileData.bio);
    };

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            const message = error instanceof Error ? error.message : '로그아웃 중 오류가 발생했습니다.';
            setErrorMessage(message);
        }
    };

    if (loading) {
        if (loadingVisible) {
            return <TransitionPlaceholder title="프로필 정보를 동기화하고 있어요" variant="stats" />;
        }
        return (
            <div className="vm-page" aria-busy="true" />
        );
    }

    return (
        <>
            <div className="vm-page text-slate-900 dark:text-zinc-100 md:!p-10">
            <div className="flex items-center justify-between vm-page-header max-w-5xl mx-auto w-full">
                <div>
                    <h1 className="vm-page-title flex items-center gap-3">
                        <User className="vm-accent-text" size={32} />
                        내 프로필
                    </h1>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-1 flex rounded-lg">
                        <button
                            onClick={(e) => handleThemeToggle('light', e)}
                            className={`p-2 rounded-md transition-all ${
                                theme === 'light'
                                    ? 'bg-slate-100 text-amber-500 shadow-sm'
                                    : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            <Sun size={20} />
                        </button>
                        <button
                            onClick={(e) => handleThemeToggle('dark', e)}
                            className={`p-2 rounded-md transition-all ${
                                theme === 'dark'
                                    ? 'bg-zinc-800 text-indigo-400 shadow-sm'
                                    : 'text-slate-400 hover:text-slate-300'
                            }`}
                        >
                            <Moon size={20} />
                        </button>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="h-10 px-3 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-sm font-semibold text-slate-700 dark:text-zinc-200 inline-flex items-center gap-2"
                    >
                        <LogOut size={16} />
                        로그아웃
                    </button>
                </div>
            </div>

            {errorMessage && (
                <div className="w-full max-w-5xl mx-auto mb-6 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
                    {errorMessage}
                </div>
            )}

            <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-6">
                    <div className="vm-card rounded-3xl p-6 overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-indigo-500 to-violet-600 opacity-90" />

                        <div className="relative pt-12 flex flex-col items-center text-center">
                            <div className="w-28 h-28 rounded-full border-[6px] border-white dark:border-zinc-900 bg-slate-100 dark:bg-zinc-800 overflow-hidden shadow-lg mb-4 flex items-center justify-center text-slate-300 dark:text-zinc-600">
                                <User size={56} />
                            </div>

                            {isEditing ? (
                                <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="text-left">
                                        <label className="text-xs font-bold text-slate-400 uppercase ml-1">Nickname</label>
                                        <input
                                            type="text"
                                            value={editNickname}
                                            onChange={(e) => setEditNickname(e.target.value)}
                                            className="vm-input font-bold text-center mt-1"
                                        />
                                    </div>
                                    <div className="text-left">
                                        <label className="text-xs font-bold text-slate-400 uppercase ml-1">Bio</label>
                                        <textarea
                                            value={editBio}
                                            onChange={(e) => setEditBio(e.target.value)}
                                            className="vm-textarea text-sm mt-1 h-24"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 pt-2">
                                        <button
                                            onClick={handleProfileSave}
                                            disabled={saving}
                                            className="vm-btn-primary text-sm flex justify-center items-center gap-2"
                                        >
                                            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 저장
                                        </button>
                                        <button
                                            onClick={handleProfileCancel}
                                            className="vm-btn-secondary text-sm"
                                        >
                                            취소
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1">{profileData.nickname}</h3>
                                    <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium bg-slate-100 dark:bg-zinc-800 px-3 py-1 rounded-full mb-6">
                                        <Mail size={14} /> {profileData.email}
                                    </div>

                                    <div className="w-full bg-slate-50 dark:bg-zinc-800/50 p-5 rounded-2xl text-slate-600 dark:text-zinc-400 text-sm leading-relaxed mb-6">
                                        {profileData.bio}
                                    </div>

                                    <button
                                        onClick={handleProfileEdit}
                                        className="w-full vm-btn-secondary text-sm flex items-center justify-center gap-2"
                                    >
                                        <Edit size={16} /> 프로필 수정
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="vm-card rounded-3xl p-6">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Join Date</span>
                            <span className="font-mono text-sm font-bold text-slate-600 dark:text-slate-400">{profileData.joinedDate}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bookmarked</span>
                            <span className="font-mono text-sm font-bold vm-accent-text">{bookmarkCount}</span>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-7 lg:col-span-8 space-y-6" aria-busy={statsLoading}>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl p-6 text-white shadow-lg shadow-orange-500/20 relative overflow-hidden group">
                            <div className="absolute -right-4 -bottom-4 bg-white/10 w-32 h-32 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                            <div className="relative z-10">
                                <div className="text-orange-100 font-bold text-sm uppercase tracking-wider mb-2">Current Level</div>
                                <div className="flex items-center gap-3 mt-1">
                                    <LevelBadge level={currentLevel} size="lg" />
                                    <div>
                                        <div className="text-5xl font-black leading-none">{currentLevel}</div>
                                        <div className="text-orange-100 text-sm font-semibold">{xpProgress.current.title}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="vm-card rounded-3xl p-6 flex flex-col justify-center">
                            <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Total Experience</div>
                            <div className="text-4xl font-black text-slate-800 dark:text-white mb-2">
                                {totalXP.toLocaleString()} <span className="text-lg text-slate-400 font-bold ml-1">XP</span>
                            </div>
                            <XPProgressBar xpProgress={xpProgress} totalXP={totalXP} />
                        </div>
                    </div>

                    <div className="vm-card rounded-3xl p-8">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-bold text-slate-700 dark:text-slate-200">학습 요약</h4>
                            {statsLoading && (
                                <span className="text-xs text-slate-400 dark:text-zinc-500">업데이트 중...</span>
                            )}
                            {streakDays > 0 && (
                                <div className="flex items-center gap-1.5 text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-3 py-1 rounded-full text-sm font-bold">
                                    <Flame size={16} className="fill-orange-500" />
                                    {streakDays}일 연속
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div className="text-2xl font-black text-slate-800 dark:text-white">{reviewCount}</div>
                                <div className="text-xs text-slate-400 font-medium mt-0.5">총 리뷰</div>
                            </div>
                            <div>
                                <div className="text-2xl font-black text-slate-800 dark:text-white">{masteredCount}</div>
                                <div className="text-xs text-slate-400 font-medium mt-0.5">마스터 단어</div>
                            </div>
                            <div>
                                <div className="text-2xl font-black text-slate-800 dark:text-white">{bookmarkCount}</div>
                                <div className="text-xs text-slate-400 font-medium mt-0.5">북마크</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {levelUpInfo && (
            <LevelUpModal
                level={levelUpInfo.level}
                title={levelUpInfo.title}
                onClose={clearLevelUp}
            />
        )}
        </>
    );
};



export default ProfileView;


