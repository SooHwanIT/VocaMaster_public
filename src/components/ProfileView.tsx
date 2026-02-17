import React, { useCallback, useEffect, useState } from 'react';
import { Sun, Moon, User, Mail, Edit, Save } from 'lucide-react';

import type { AppTheme, MicSettings } from '../app/types';
import { loadMicSettings } from '../app/storage';

type UserProfile = {
    name: string;
    email: string;
    level: number;
    exp: number;
    joinedDate: string;
    bio: string;
};

const ProfileView = ({ theme, onThemeChange }: { theme: AppTheme; onThemeChange: (theme: AppTheme) => void }) => {
    const handleThemeToggle = useCallback((newTheme: AppTheme, e: React.MouseEvent) => {
        e.preventDefault();
        onThemeChange(newTheme);
    }, [onThemeChange]);

    const [micSettings] = useState<MicSettings>(loadMicSettings);
    // const [devices, setDevices] = useState<AudioDevice[]>([]);
    // const [loadingDevices, setLoadingDevices] = useState(true);
    const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

    // Profile State
    const [isEditing, setIsEditing] = useState(false);
    const [userProfile, setUserProfile] = useState<UserProfile>({
        name: 'Happy User',
        email: 'user@example.com',
        level: 12,
        exp: 2450,
        joinedDate: '2025-10-15',
        bio: 'Learning English to travel the world!'
    });
    const [editForm, setEditForm] = useState<UserProfile>(userProfile);

    // We can just check permission on mount
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                stream.getTracks().forEach(t => t.stop());
                setPermissionGranted(true);
            })
            .catch(() => setPermissionGranted(false));
    }, []);

    const handleProfileEdit = () => {
        setEditForm(userProfile);
        setIsEditing(true);
    };

    const handleProfileSave = () => {
        setUserProfile(editForm);
        setIsEditing(false);
        // Save to DB or Storage here
    };

    const handleProfileCancel = () => {
        setIsEditing(false);
        setEditForm(userProfile);
    };

    return (
        <div className="flex flex-col h-full w-full bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 p-6 md:p-10 overflow-y-auto">
            {/* Header Area using simple flexbox */}
            <div className="flex items-center justify-between mb-8 max-w-5xl mx-auto w-full">
                <div>
                    <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                        <User className="text-indigo-500" size={32} />
                        내 프로필
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
                        학습 기록 및 계정 관리
                    </p>
                </div>
                
                {/* Theme Toggle */}
                <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-1 flex rounded-lg shrink-0">
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
            </div>

            {/* Main Content Grid */}
            <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Left Column: Profile Card (Takes 4 columns on desktop) */}
                <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm overflow-hidden relative">
                         <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-indigo-500 to-violet-600 opacity-90" />
                        
                        <div className="relative pt-12 flex flex-col items-center text-center">
                            <div className="w-28 h-28 rounded-full border-[6px] border-white dark:border-zinc-900 bg-slate-100 dark:bg-zinc-800 overflow-hidden shadow-lg mb-4 flex items-center justify-center text-slate-300 dark:text-zinc-600">
                                <User size={56} />
                            </div>

                            {isEditing ? (
                                <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="text-left">
                                        <label className="text-xs font-bold text-slate-400 uppercase ml-1">Name</label>
                                        <input 
                                            type="text" 
                                            value={editForm.name} 
                                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                            className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-xl font-bold text-center px-3 py-3 mt-1 focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div className="text-left">
                                        <label className="text-xs font-bold text-slate-400 uppercase ml-1">Bio</label>
                                        <textarea 
                                            value={editForm.bio} 
                                            onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                                            className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-xl text-sm px-3 py-3 mt-1 resize-none h-24 focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 pt-2">
                                        <button 
                                            onClick={handleProfileSave}
                                            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 rounded-xl text-sm flex justify-center items-center gap-2"
                                        >
                                            <Save size={16} /> 저장
                                        </button>
                                        <button 
                                            onClick={handleProfileCancel}
                                            className="bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-400 font-bold py-3 rounded-xl text-sm hover:bg-slate-200 dark:hover:bg-zinc-700"
                                        >
                                            취소
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1">{userProfile.name}</h3>
                                    <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium bg-slate-100 dark:bg-zinc-800 px-3 py-1 rounded-full mb-6">
                                        <Mail size={14} /> {userProfile.email}
                                    </div>
                                    
                                    <div className="w-full bg-slate-50 dark:bg-zinc-800/50 p-5 rounded-2xl text-slate-600 dark:text-zinc-400 text-sm leading-relaxed mb-6 italic relative">
                                        <span className="absolute top-2 left-3 text-3xl text-slate-200 dark:text-zinc-700 font-serif">“</span>
                                        {userProfile.bio}
                                    </div>

                                    <button 
                                        onClick={handleProfileEdit}
                                        className="w-full py-3 rounded-xl border-2 border-slate-100 dark:border-zinc-800 font-bold text-slate-600 dark:text-zinc-400 hover:border-indigo-500 hover:text-indigo-500 dark:hover:text-indigo-400 dark:hover:border-indigo-500 transition-all flex items-center justify-center gap-2 text-sm"
                                    >
                                        <Edit size={16} /> 프로필 수정
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Join Date</span>
                            <span className="font-mono text-sm font-bold text-slate-600 dark:text-slate-400">{userProfile.joinedDate}</span>
                        </div>
                         <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account Type</span>
                            <span className="font-mono text-xs font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded border border-indigo-100 dark:border-indigo-900/30">PREMIUM</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Stats & Achievements (Takes 8 columns on desktop) */}
                <div className="md:col-span-7 lg:col-span-8 space-y-6">
                    {/* Stats Grid */}
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl p-6 text-white shadow-lg shadow-orange-500/20 relative overflow-hidden group">
                             <div className="absolute -right-4 -bottom-4 bg-white/10 w-32 h-32 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                            <div className="relative z-10">
                                <div className="text-orange-100 font-bold text-sm uppercase tracking-wider mb-2">Current Level</div>
                                <div className="text-5xl font-black mb-1">{userProfile.level}</div>
                                <div className="text-orange-100 text-xs font-medium bg-white/20 inline-block px-2 py-0.5 rounded">Master Learner</div>
                            </div>
                        </div>

                         <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col justify-center">
                            <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Total Experience</div>
                            <div className="text-4xl font-black text-slate-800 dark:text-white mb-2">
                                {userProfile.exp.toLocaleString()} <span className="text-lg text-slate-400 font-bold ml-1">XP</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                                <div className="bg-indigo-500 h-full rounded-full" style={{ width: '75%' }} />
                            </div>
                            <div className="text-right text-[10px] text-slate-400 mt-1 font-mono">NEXT LEVEL: 3000 XP</div>
                        </div>
                    </div>

                    {/* Placeholder for future sections like Achievements or Activity Graph */}
                    <div className="bg-slate-100 dark:bg-zinc-800/50 border border-dashed border-slate-300 dark:border-zinc-700 rounded-3xl p-8 flex flex-col items-center justify-center text-center h-48">
                        <div className="w-12 h-12 bg-slate-200 dark:bg-zinc-700 rounded-full flex items-center justify-center text-slate-400 mb-3">
                            <span className="text-2xl">🏆</span>
                        </div>
                        <h4 className="font-bold text-slate-600 dark:text-slate-300">Recent Achievements</h4>
                        <p className="text-xs text-slate-400 mt-1 max-w-[200px]">Complete daily challenges to earn badges and unlock achievements.</p>
                    </div>

                     <div className="bg-slate-100 dark:bg-zinc-800/50 border border-dashed border-slate-300 dark:border-zinc-700 rounded-3xl p-8 flex flex-col items-center justify-center text-center h-48">
                         <div className="w-12 h-12 bg-slate-200 dark:bg-zinc-700 rounded-full flex items-center justify-center text-slate-400 mb-3">
                            <span className="text-2xl">📈</span>
                        </div>
                        <h4 className="font-bold text-slate-600 dark:text-slate-300">Learning Statistics</h4>
                        <p className="text-xs text-slate-400 mt-1 max-w-[200px]">Your weekly learning progress will be displayed here.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileView;
