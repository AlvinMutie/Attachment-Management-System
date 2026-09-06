import {
    LayoutDashboard,
    BookOpen,
    MapPin,
    UserCheck,
    Users,
    Settings,
    ShieldCheck,
    User,
    ClipboardCheck,
    Building2,
    Activity,
    History,
    GraduationCap,
    MessageCircle,
    FileText
} from 'lucide-react';

export const ROLE_DEFINITIONS = {
    student: {
        label: 'Student',
        badgeColor: 'blue',
        defaultPath: '/student/dashboard',
        prefix: 'student'
    },
    industry_supervisor: {
        label: 'Industry Supervisor',
        badgeColor: 'emerald',
        defaultPath: '/industry/dashboard',
        prefix: 'industry'
    },
    university_supervisor: {
        label: 'University Supervisor',
        badgeColor: 'purple',
        defaultPath: '/university/dashboard',
        prefix: 'university'
    },
    school_admin: {
        label: 'School Admin',
        badgeColor: 'amber',
        defaultPath: '/school_admin/dashboard',
        prefix: 'school_admin'
    },
    super_admin: {
        label: 'Super Admin',
        badgeColor: 'rose',
        defaultPath: '/superadmin/dashboard',
        prefix: 'superadmin'
    }
};

export const ROLE_NAVIGATION = {
    student: [
        {
            section: 'Navigation',
            items: [
                { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
                { label: 'My Profile', path: '/student/profile', icon: User }
            ]
        },
        {
            section: 'Workspace',
            items: [
                { label: 'Weekly Logs', path: '/student/logbooks', icon: BookOpen },
                { label: 'My Visits', path: '/student/visits', icon: MapPin },
                { label: 'Messages', path: '/student/messages', icon: MessageCircle }
            ]
        },
        {
            section: 'General',
            items: [
                { label: 'Settings', path: '/settings', icon: Settings }
            ]
        }
    ],

    industry_supervisor: [
        {
            section: 'Navigation',
            items: [
                { label: 'Dashboard', path: '/industry/dashboard', icon: LayoutDashboard },
                { label: 'My Profile', path: '/industry/profile', icon: User }
            ]
        },
        {
            section: 'Workspace',
            items: [
                { label: 'Presence Hub', path: '/industry/presence', icon: Activity },
                { label: 'Attendance', path: '/industry/attendance', icon: UserCheck },
                { label: 'Site Visits', path: '/industry/visits', icon: MapPin },
                { label: 'Messages', path: '/industry/messages', icon: MessageCircle }
            ]
        },
        {
            section: 'General',
            items: [
                { label: 'Settings', path: '/settings', icon: Settings }
            ]
        }
    ],

    university_supervisor: [
        {
            section: 'Navigation',
            items: [
                { label: 'Dashboard', path: '/university/dashboard', icon: LayoutDashboard },
                { label: 'My Profile', path: '/university/profile', icon: User }
            ]
        },
        {
            section: 'Workspace',
            items: [
                { label: 'Assessments', path: '/university/assessments', icon: ClipboardCheck },
                { label: 'Meetings', path: '/university/meetings', icon: MapPin },
                { label: 'Messages', path: '/university/messages', icon: MessageCircle }
            ]
        },
        {
            section: 'General',
            items: [
                { label: 'Settings', path: '/settings', icon: Settings }
            ]
        }
    ],

    school_admin: [
        {
            section: 'Navigation',
            items: [
                { label: 'Dashboard', path: '/school_admin/dashboard', icon: LayoutDashboard },
                { label: 'My Profile', path: '/school_admin/profile', icon: User }
            ]
        },
        {
            section: 'Workspace',
            items: [
                { label: 'Student Registry', path: '/school_admin/students', icon: GraduationCap },
                { label: 'User Directory', path: '/school_admin/users', icon: Users },
                { label: 'Analytics', path: '/school_admin/analytics', icon: Activity }
            ]
        },
        {
            section: 'General',
            items: [
                { label: 'Settings', path: '/settings', icon: Settings }
            ]
        }
    ],

    super_admin: [
        {
            section: 'Navigation',
            items: [
                { label: 'Dashboard', path: '/superadmin/dashboard', icon: LayoutDashboard }
            ]
        },
        {
            section: 'Workspace',
            items: [
                { label: 'Institutions', path: '/superadmin/schools', icon: Building2 },
                { label: 'User Management', path: '/superadmin/users', icon: Users },
                { label: 'Audit Logs', path: '/superadmin/audit-logs', icon: History },
                { label: 'System Health', path: '/superadmin/system-health', icon: Activity }
            ]
        },
        {
            section: 'General',
            items: [
                { label: 'Settings', path: '/settings', icon: Settings }
            ]
        }
    ]
};
