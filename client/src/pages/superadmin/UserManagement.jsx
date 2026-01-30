import { useEffect, useState } from 'react';
import { Search, Lock, Unlock, RotateCcw, UserCog, Shield, Globe, Mail, User, Users } from 'lucide-react';
import { getUsers, updateUserRole, resetPassword, lockUser } from '../../utils/superadminApi';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [pagination, setPagination] = useState({ page: 1, limit: 10 });

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
                alert('Reset sequence initiated');
            } catch (error) {
                alert('Sequence failed');
            }
        }
    };

    const handleLockUser = async (user) => {
        const action = user.status === 'locked' ? 'restore' : 'terminate';
        if (confirm(`Are you sure you want to ${action} ${user.name}'s access?`)) {
            try {
                await lockUser(user.id, user.status !== 'locked');
                fetchUsers();
            } catch (error) {
                alert(`Operation failed`);
            }
        }
    };

    const handleChangeRole = async (user) => {
        const newRole = prompt(`Assign new role profile for ${user.name}:\n- student\n- industry_supervisor\n- university_supervisor\n- school_admin`, user.role);
        if (newRole && ['student', 'industry_supervisor', 'university_supervisor', 'school_admin'].includes(newRole)) {
            try {
                await updateUserRole(user.id, newRole);
                fetchUsers();
            } catch (error) {
                alert('Role assignment failed');
            }
        }
    };

    const getRoleBadge = (role) => {
        const styles = {
            student: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
            industry_supervisor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
            university_supervisor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
            school_admin: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
            super_admin: 'bg-rose-500/10 text-rose-400 border-rose-500/20 font-black'
        };
        return (
            <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-widest rounded-lg border ${styles[role] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                {role.replace('_', ' ')}
            </span>
        );
    };

    const getStatusBadge = (status) => {
        const styles = {
            active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
            locked: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
            pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
        };
        return (
            <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-widest rounded-lg border ${styles[status]}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-end gap-8 animate-fade-in">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-600/30 ring-1 ring-white/20">
                        <Users size={40} className="text-white" />
                    </div>
                    <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Identity Protocols</span>
                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Global <span className="text-blue-500">Directory</span></h1>
                        <p className="text-slate-500 font-medium leading-relaxed max-w-lg">Universal user tracking and administrative authority console.</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="glass-card p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative md:col-span-2">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search identities by name, email or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-field pl-12"
                        />
                    </div>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="input-field cursor-pointer font-semibold text-xs"
                    >
                        <option value="">Roles: All Profiles</option>
                        <option value="student">Profiles: Student</option>
                        <option value="industry_supervisor">Profiles: Industry</option>
                        <option value="university_supervisor">Profiles: University</option>
                        <option value="school_admin">Profiles: Admin</option>
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="input-field cursor-pointer font-semibold text-xs"
                    >
                        <option value="">State: All Conditions</option>
                        <option value="active">State: Active</option>
                        <option value="locked">State: Terminated</option>
                        <option value="pending">State: Pending</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="glass-card overflow-hidden border-white/5">
                {loading ? (
                    <div className="flex items-center justify-center h-64 text-blue-500">
                        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/5">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Identity</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Affiliation</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Classification</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Authority</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-blue-400 font-bold group-hover:bg-blue-600/20 transition-all">
                                                    {user.name?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white tracking-tight">{user.name}</p>
                                                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                                                        <Mail size={10} />
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-sm text-slate-300 font-bold">
                                                <Globe size={14} className="text-slate-500" />
                                                {user.school?.name || 'CENTRAL'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            {getRoleBadge(user.role)}
                                        </td>
                                        <td className="px-6 py-5">
                                            {getStatusBadge(user.status)}
                                        </td>
                                        <td className="px-6 py-5">
                                            {user.role !== 'super_admin' && (
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <button
                                                        onClick={() => handleChangeRole(user)}
                                                        className="p-2 rounded-lg bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all border border-indigo-500/20"
                                                        title="Assign Role Profile"
                                                    >
                                                        <UserCog size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleResetPassword(user)}
                                                        className="p-2 rounded-lg bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white transition-all border border-blue-500/20"
                                                        title="Reset Security Sequence"
                                                    >
                                                        <RotateCcw size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleLockUser(user)}
                                                        className={`p-2 rounded-lg transition-all border ${user.status === 'locked'
                                                            ? 'bg-emerald-600/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-600 hover:text-white'
                                                            : 'bg-rose-600/10 text-rose-400 border-rose-500/20 hover:bg-rose-600 hover:text-white'
                                                            }`}
                                                        title={user.status === 'locked' ? 'Restore Infrastructure Access' : 'Restrict Network Connection'}
                                                    >
                                                        {user.status === 'locked' ? <Unlock size={16} /> : <Lock size={16} />}
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {!loading && users.length > 0 && (
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                        Global ID Index: {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} OF {pagination.total} IDENTITIES
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                            disabled={pagination.page === 1}
                            className="px-6 py-2 glass-card rounded-xl text-xs font-black uppercase tracking-widest disabled:opacity-20 hover:bg-white/10 transition-colors"
                        >
                            Back
                        </button>
                        <button
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                            disabled={pagination.page >= pagination.totalPages}
                            className="px-6 py-2 glass-card rounded-xl text-xs font-black uppercase tracking-widest disabled:opacity-20 hover:bg-white/10 transition-colors"
                        >
                            Forward
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
