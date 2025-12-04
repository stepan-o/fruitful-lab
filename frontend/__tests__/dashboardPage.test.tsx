import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import DashboardPage from '@/app/dashboard/page';
import { fetchPinterestMonthlyStats } from '@/lib/pinterestStats';
import { cookies } from 'next/headers';

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

    it('throws when auth token is missing', async () => {
        (cookies as unknown as jest.Mock).mockReturnValue({
            get: () => undefined,
        });

        await expect(DashboardPage()).rejects.toThrow(
            /Missing auth token in dashboard/i,
        );
    });
});
