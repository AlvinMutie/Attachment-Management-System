import { useEffect, useState } from 'react';
import {
    Search, Lock, Unlock, RotateCcw, UserCog, Shield,
    Globe, Mail, User, Users, VenetianMask, Key,
    Filter, ChevronLeft, ChevronRight
} from 'lucide-react';
import {
    getUsers, updateUserRole, resetPassword,
    lockUser, impersonateUser, resetPasswordDirect
} from '../../utils/superadminApi';
import { useNavigate } from 'react-router-dom';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, [searchTerm, roleFilter, statusFilter, pagination.page]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await getUsers({
                page: pagination.page,
                limit: pagination.limit,
                search: searchTerm,
                role: roleFilter,
                status: statusFilter
            });
            setUsers(response.data.users);
            setPagination(prev => ({ ...prev, ...response.data.pagination }));
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (user) => {
        if (confirm(`Send secure reset sequence to ${user.email}?`)) {
            try {
                await resetPassword(user.id);
                alert('Password reset link sent');
            } catch (error) {
                alert('Failed to reset password');
            }
        }
    };

    const handleLockUser = async (user) => {
        const action = user.status === 'locked' ? 'unlock' : 'lock';
        if (confirm(`Are you sure you want to ${action} ${user.name}?`)) {
            try {
                await lockUser(user.id, user.status !== 'locked');
                fetchUsers();
            } catch (error) {
                alert(`Failed to ${action} user`);
            }
        }
    };

    const handleChangeRole = async (user) => {
        const newRole = prompt(`Select new role for ${user.name}:\n- student\n- industry_supervisor\n- university_supervisor\n- school_admin`, user.role);
        if (newRole && ['student', 'industry_supervisor', 'university_supervisor', 'school_admin'].includes(newRole)) {
            try {
                await updateUserRole(user.id, newRole);
                fetchUsers();
            } catch (error) {
                alert('Failed to change role');
            }
        }
    };

    const handleImpersonateUser = async (user) => {
        if (user.role === 'super_admin') {
            alert('Cannot impersonate another system administrator.');
            return;
        }

        if (confirm(`Access system as ${user.name}? You will be temporarily logged in as this user.`)) {
            try {
                const response = await impersonateUser(user.id);
                localStorage.setItem('ams_superadmin_backup', localStorage.getItem('ams_user'));
                const newTokenData = { ...response.data.user, token: response.data.token };
                localStorage.setItem('ams_user', JSON.stringify(newTokenData));
                window.location.href = '/';
            } catch (error) {
                console.error('Impersonation failed:', error);
                alert(error.response?.data?.message || 'Login failed');
            }
        }
    };

    const handleDirectReset = async (user) => {
        const newPassword = prompt(`Enter new direct password for ${user.email} (min 6 chars):`);
        if (newPassword && newPassword.length >= 6) {
            try {
                await resetPasswordDirect(user.id, newPassword);
                alert('Password updated successfully');
            } catch (error) {
                alert(error.response?.data?.message || 'Failed to update password');
            }
        } else if (newPassword) {
            alert('Password too short');
        }
    };

    const getRoleBadge = (role) => {
        const styles = {
            student: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            industry_supervisor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
            university_supervisor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
            school_admin: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
            super_admin: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
        };
        return (
            <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-widest rounded-lg border ${styles[role] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                {role.replace('_', ' ')}
            </span>
        );
    };

    return (
        <div className="flex-1 space-y-8 p-8 max-w-7xl mx-auto">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center space-x-5">
                    <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 text-white">
                        <Users size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">User <span className="text-indigo-500">Registry</span></h1>
                        <p className="text-slate-400 text-sm mt-1 font-medium">Manage cross-institutional user accounts and access levels.</p>
                    </div>
                </div>
            </header>

            {/* Filters */}
            <div className="glass-card p-4 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, email or ID..."
                        className="input-field pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center space-x-3 w-full md:w-auto">
                    <Filter className="text-slate-500" size={18} />
                    <select
                        className="input-field text-xs font-bold uppercase tracking-widest"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="">All Roles</option>
                        <option value="student">Student</option>
                        <option value="industry_supervisor">Industry</option>
                        <option value="university_supervisor">University</option>
                        <option value="school_admin">School Admin</option>
                    </select>
                    <select
                        className="input-field text-xs font-bold uppercase tracking-widest"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="locked">Locked</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900/50 border-b border-white/5">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">User Details</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Institution</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Role</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="5" className="px-6 py-6"><div className="h-4 bg-slate-800 rounded w-full"></div></td>
                                    </tr>
                                ))
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-blue-400 font-bold group-hover:bg-blue-600/20 transition-all">
                                                    {user.name?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-white uppercase tracking-tight">{user.name}</div>
                                                    <div className="text-[10px] text-slate-500 font-medium">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
                                                <Globe size={14} className="text-slate-500" />
                                                <span>{user.school?.name || 'Central Platform'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getRoleBadge(user.role)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${user.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {user.role !== 'super_admin' && (
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button onClick={() => handleChangeRole(user)} className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-600/10 rounded-lg transition-all" title="Change Role"><UserCog size={16} /></button>
                                                    <button onClick={() => handleResetPassword(user)} className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-600/10 rounded-lg transition-all" title="Email Reset"><RotateCcw size={16} /></button>
                                                    <button onClick={() => handleDirectReset(user)} className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-600/10 rounded-lg transition-all" title="Direct Reset"><Key size={16} /></button>
                                                    <button onClick={() => handleImpersonateUser(user)} className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-600/10 rounded-lg transition-all" title="Impersonate"><VenetianMask size={16} /></button>
                                                    <button onClick={() => handleLockUser(user)} className={`p-2 rounded-lg transition-all ${user.status === 'locked' ? 'text-slate-400 hover:text-emerald-400 hover:bg-emerald-600/10' : 'text-slate-400 hover:text-rose-400 hover:bg-rose-600/10'}`} title={user.status === 'locked' ? 'Unlock' : 'Lock'}>
                                                        {user.status === 'locked' ? <Unlock size={16} /> : <Lock size={16} />}
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-6 bg-slate-900/30 flex items-center justify-between border-t border-white/5">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                        Total Identity Indexed: <span className="text-white">{pagination.total}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                            disabled={pagination.page === 1}
                            className="p-2 bg-slate-900 border border-white/5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 transition-all"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <div className="px-4 py-1.5 bg-indigo-600/10 border border-indigo-500/20 rounded-lg text-xs font-bold text-indigo-400">
                            {pagination.page} / {pagination.totalPages}
                        </div>
                        <button
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                            disabled={pagination.page >= pagination.totalPages}
                            className="p-2 bg-slate-900 border border-white/5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 transition-all"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
