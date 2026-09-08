import { useEffect, useState } from 'react';
import {
    Search, Lock, Unlock, RotateCcw, UserCog,
    Users, Key, Filter, ChevronLeft, ChevronRight,
    UserCheck, Shield
} from 'lucide-react';
import {
    getUsers, updateUserRole, resetPassword,
    lockUser, impersonateUser, resetPasswordDirect
} from '../../utils/superadminApi';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

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
        if (confirm(`Send secure reset link to ${user.email}?`)) {
            try {
                await resetPassword(user.id);
                alert('Password reset link dispatched.');
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

    const getRoleBadgeVariant = (role) => {
        switch (role) {
            case 'super_admin': return 'danger';
            case 'school_admin': return 'warning';
            case 'university_supervisor': return 'purple';
            case 'industry_supervisor': return 'info';
            case 'student': return 'success';
            default: return 'neutral';
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="bg-[#15171f] border border-[#22242f] rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
                        <Users size={24} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-violet-400">Identity Control</span>
                            <span className="text-xs text-slate-400">Total: {pagination.total}</span>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-100 tracking-tight mt-0.5">User Registry</h1>
                        <p className="text-xs text-slate-400 mt-0.5">Manage cross-institutional user accounts, role elevations, and active access states.</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-[#15171f] border border-[#22242f] rounded-xl p-4 flex flex-col sm:flex-row gap-3 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
                    <input
                        type="text"
                        placeholder="Search by user name, email address..."
                        className="w-full bg-[#12141c] border border-[#22242f] rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <select
                        className="bg-[#12141c] border border-[#22242f] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-500"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="">All Roles</option>
                        <option value="student">Student</option>
                        <option value="industry_supervisor">Industry Supervisor</option>
                        <option value="university_supervisor">University Supervisor</option>
                        <option value="school_admin">School Admin</option>
                    </select>
                    <select
                        className="bg-[#12141c] border border-[#22242f] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-500"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="locked">Locked</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-[#15171f] border border-[#22242f] rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#12141c] border-b border-[#22242f]">
                                <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">User Details</th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Institution</th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Role</th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#22242f]">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="5" className="px-5 py-4"><div className="h-4 bg-[#181a24] rounded w-full"></div></td>
                                    </tr>
                                ))
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-5 py-8 text-center text-xs text-slate-400">
                                        No users match the search criteria.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-[#181a24]/50 transition-colors">
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[#181a24] border border-[#22242f] flex items-center justify-center text-xs font-semibold text-violet-400">
                                                    {user.name?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <div className="text-xs font-semibold text-slate-200">{user.name}</div>
                                                    <div className="text-[11px] text-slate-400">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className="text-xs text-slate-300">{user.school?.name || 'Central Platform'}</span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <Badge variant={getRoleBadgeVariant(user.role)}>
                                                {user.role?.replace('_', ' ')}
                                            </Badge>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <Badge variant={user.status === 'active' ? 'success' : 'danger'}>
                                                {user.status}
                                            </Badge>
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            {user.role !== 'super_admin' && (
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button onClick={() => handleChangeRole(user)} className="p-1.5 text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 rounded-md transition-colors" title="Change Role"><UserCog size={15} /></button>
                                                    <button onClick={() => handleResetPassword(user)} className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-md transition-colors" title="Email Reset Link"><RotateCcw size={15} /></button>
                                                    <button onClick={() => handleDirectReset(user)} className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-md transition-colors" title="Direct Password Reset"><Key size={15} /></button>
                                                    <button onClick={() => handleImpersonateUser(user)} className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-md transition-colors" title="Impersonate User"><UserCheck size={15} /></button>
                                                    <button onClick={() => handleLockUser(user)} className={`p-1.5 rounded-md transition-colors ${user.status === 'locked' ? 'text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10' : 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10'}`} title={user.status === 'locked' ? 'Unlock Account' : 'Lock Account'}>
                                                        {user.status === 'locked' ? <Unlock size={15} /> : <Lock size={15} />}
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
                <div className="p-4 bg-[#12141c] flex items-center justify-between border-t border-[#22242f] text-xs text-slate-400">
                    <div>
                        Total registered: <span className="font-semibold text-slate-200">{pagination.total}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                            disabled={pagination.page === 1}
                            icon={ChevronLeft}
                        >
                            Previous
                        </Button>
                        <span className="px-3 py-1 bg-[#15171f] border border-[#22242f] rounded text-xs font-semibold text-slate-300">
                            {pagination.page} / {pagination.totalPages || 1}
                        </span>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                            disabled={pagination.page >= pagination.totalPages}
                            icon={ChevronRight}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
