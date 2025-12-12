export type Status = 'Pending' | 'Document Screening' | 'Audition' | 'Hold' | 'Won' | 'Lost';
export type Category = 'Movie' | 'Drama' | 'Commercial' | 'Variety' | 'Stage' | 'Other';

export interface Audition {
    id: string;
    projectTitle: string;
    category: Category;
    role?: string;
    status: Status;
    date?: string;
    notes?: string;
    isArchived?: boolean;
}

export interface Talent {
    id: string;
    name: string;
    avatarUrl: string;
    auditions: Audition[];
}

export const getStatusColor = (status: Status) => {
    switch (status) {
        case 'Won': return 'var(--accent-success)';
        case 'Lost': return 'var(--text-muted)';
        case 'Audition': return 'var(--accent-purple)';
        case 'Hold': return 'var(--accent-gold)';
        case 'Document Screening': return 'var(--accent-cyan)';
        default: return 'var(--text-secondary)';
    }
};
