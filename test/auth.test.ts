import { useAuthStore } from "@/store/authStore";

beforeEach(() => {
    useAuthStore.setState({ user: null });
});

test('initial use should be null', () => {
    expect(useAuthStore.getState().user).toBe(null);
});

test('login should set user and return the same user', () => {
    const { login } = useAuthStore.getState();
    login('a@gmail.com', 'a');
    const user = useAuthStore.getState().user;
    expect(user?.name).toBe('John Doe');
    expect(user?.email).toBe('a@gmail.com');
});

test('logout should reset user to null', () => {
    const { logout } = useAuthStore.getState();
    logout();
    expect(useAuthStore.getState().user).toBe(null);
});