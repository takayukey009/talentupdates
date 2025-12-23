export type Status = 'Pending' | 'Document Screening' | 'Audition' | 'Hold' | 'Won' | 'Lost';
export type Category = 'Movie' | 'Drama' | 'Commercial' | 'Variety' | 'Stage' | 'Music' | 'Event' | 'Other';

export interface Audition {
    id: string;
    projectTitle: string;
    category: Category;
    role?: string;
    status: Status;
    date?: string; // AD Date
    shootDate?: string;
    client?: string;
    manager?: string;
    notes?: string;
    isArchived?: boolean;
    documentPassed?: boolean;
}

export interface SNSData {
    date: string;
    instagram: number;
    tiktok: number;
    x: number;
}

export interface HighLight {
    id: string;
    date: string;
    title: string;
    content: string;
    link?: string;
}

export interface Talent {
    id: string;
    name: string;
    avatarUrl: string;
    auditions: Audition[];
    sns?: SNSData[];
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
