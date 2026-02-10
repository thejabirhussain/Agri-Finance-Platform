import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(username, password);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid username or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Simple Header */}
            <header className="px-6 py-4">
                <div className="text-gray-900 font-medium text-sm">
                    Farm OS
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 pb-16">
                <div className="w-full max-w-md">
                    {/* Login Card */}
                    <div className="bg-white border border-gray-200 rounded-lg px-8 py-10 shadow-sm">
                        <div className="mb-8">
                            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                                Sign in
                            </h1>
                            <p className="text-sm text-gray-600">
                                Access your Farm OS account
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-sm text-red-800">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-medium text-gray-700 mb-1.5"
                                >
                                    Username
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow"
                                    placeholder="Enter your username"
                                    required
                                    disabled={isLoading}
                                    autoComplete="username"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700 mb-1.5"
                                >
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow"
                                    placeholder="Enter your password"
                                    required
                                    disabled={isLoading}
                                    autoComplete="current-password"
                                />
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gray-900 text-white text-sm font-medium px-4 py-2.5 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isLoading ? 'Signing in...' : 'Sign in'}
                                </button>
                            </div>

                            <div className="pt-1">
                                <a
                                    href="#"
                                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    Forgot password?
                                </a>
                            </div>
                        </form>

                        {/* Demo Credentials */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                                Demo Credentials
                            </p>
                            <div className="bg-gray-50 border border-gray-200 rounded-md px-4 py-3">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500">Username:</span>
                                        <span className="ml-2 font-mono text-gray-900">admin</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Password:</span>
                                        <span className="ml-2 font-mono text-gray-900">admin123</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Need an account?{' '}
                            <a href="#" className="text-gray-900 hover:underline">
                                Contact your administrator
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
