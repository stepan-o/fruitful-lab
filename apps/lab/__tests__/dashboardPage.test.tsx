import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import DashboardPage from '@/app/(admin)/admin/dashboard/page';
import { fetchPinterestMonthlyStats } from '@/lib/pinterestStats';
import { cookies } from 'next/headers';

// Mock role helper
jest.mock('@/lib/auth', () => ({
    getCurrentUser: jest.fn(),
}));

jest.mock('next/headers', () => ({
    cookies: jest.fn(),
}));

jest.mock('@/lib/pinterestStats', () => ({
    fetchPinterestMonthlyStats: jest.fn(),
}));

describe('DashboardPage', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('renders stats table when user is authenticated and stats are available', async () => {
        const { getCurrentUser } = jest.requireMock('@/lib/auth');
        // admin user
        getCurrentUser.mockResolvedValue({
            id: 1,
            email: 'admin@example.com',
            is_admin: true,
            groups: [],
        });

        // mock cookie with token
        (cookies as unknown as jest.Mock).mockReturnValue({
            get: () => ({ value: 'token-123' }),
        });

        // mock stats coming from backend
        (fetchPinterestMonthlyStats as jest.Mock).mockResolvedValue([
            {
                id: 1,
                // Use a mid-month date to avoid timezone converting it into Dec 2023
                calendar_month: '2024-01-15',
                impressions: 100,
                engagements: 10,
                outbound_clicks: 5,
                saves: 2,
            },
        ]);

        // DashboardPage is an async server component – call it to get JSX
        const jsx = await DashboardPage();

        render(jsx as React.ReactElement);

        expect(
            screen.getByText(/Fruitful Lab – Pinterest Stats/i),
        ).toBeInTheDocument();

        // formatted month, per formatMonth()
        expect(screen.getByText(/Jan 2024/)).toBeInTheDocument();

        // a couple of numbers from the table
        expect(screen.getByText('100')).toBeInTheDocument();
        expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('redirects to login when user is not authenticated', async () => {
        const { getCurrentUser } = jest.requireMock('@/lib/auth');
        getCurrentUser.mockResolvedValue(null);

        await expect(DashboardPage()).rejects.toThrow(/NEXT_REDIRECT/);
    });

    it('redirects non-admins to /tools', async () => {
        const { getCurrentUser } = jest.requireMock('@/lib/auth');
        getCurrentUser.mockResolvedValue({ id: 2, email: 'user@x.com', is_admin: false, groups: [] });

        await expect(DashboardPage()).rejects.toThrow(/NEXT_REDIRECT/);
    });
});
