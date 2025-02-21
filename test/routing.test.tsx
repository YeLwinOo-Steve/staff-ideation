import Login from '@/app/login/page';
import mockRouter from 'next-router-mock';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';

jest.mock('next/navigation', () => jest.requireActual('next-router-mock'))
jest.mock('@/util/sleep', () => ({
    sleep: jest.fn().mockResolvedValue(undefined),
}));


afterEach(() => jest.clearAllMocks());

describe('Login page', () => {
    beforeEach(() => {
        mockRouter.push('/login');
    });
    it('should navigate to home page after successful authentication', async () => {
        render(<Login />);
        fireEvent.change(screen.getByPlaceholderText('example@gmail.com'), {
            target: { value: 'a@gmail.com' },
        });
        fireEvent.change(screen.getByPlaceholderText('password'), {
            target: { value: '123456' },
        });

        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(mockRouter.pathname).toBe('/dashboard');
        });
    });
});