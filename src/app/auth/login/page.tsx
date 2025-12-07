// Jirai - Login Page
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, Lock, Sparkles, ArrowRight, Zap, Brain, Workflow } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const supabase = getSupabaseBrowserClient();
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            router.push('/');
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const features = [
        { icon: Brain, text: 'AI-Powered Mind Maps' },
        { icon: Workflow, text: 'Visual Workflows' },
        { icon: Zap, text: 'Real-time Sync' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950 flex">
            {/* Left side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                {/* Animated gradient orbs */}
                <div className="absolute top-20 left-20 w-72 h-72 bg-violet-500/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />

                {/* Content */}
                <div className="relative z-10 p-12 flex flex-col justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Logo */}
                        <div className="flex items-center gap-3 mb-12">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-violet-500/30">
                                <Sparkles className="w-7 h-7 text-white" />
                            </div>
                            <span className="text-4xl font-bold text-white tracking-tight">Jirai</span>
                        </div>

                        <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
                            Organize your thoughts.
                            <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-purple-400">
                                Visualize your ideas.
                            </span>
                        </h1>

                        <p className="text-xl text-slate-400 mb-12 max-w-md">
                            The AI-powered mind mapping tool that helps you think, plan, and create with clarity.
                        </p>

                        {/* Features */}
                        <div className="space-y-4">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={feature.text}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + index * 0.1 }}
                                    className="flex items-center gap-3"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                                        <feature.icon className="w-5 h-5 text-violet-400" />
                                    </div>
                                    <span className="text-lg text-slate-300">{feature.text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
                        {/* Mobile logo */}
                        <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-white">Jirai</span>
                        </div>

                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
                            <p className="text-slate-400">Sign in to your account to continue</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-5">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
                                >
                                    <p className="text-sm text-red-400">{error}</p>
                                </motion.div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-300">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="pl-10 h-12 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-slate-300">Password</Label>
                                    <Link href="/auth/forgot-password" className="text-sm text-violet-400 hover:text-violet-300">
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="pl-10 h-12 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-slate-400">
                                Don't have an account?{' '}
                                <Link href="/auth/signup" className="text-violet-400 hover:text-violet-300 font-medium">
                                    Sign up free
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
