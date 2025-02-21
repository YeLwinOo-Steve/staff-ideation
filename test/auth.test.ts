import { useAuthStore } from "@/store/authStore";

beforeEach(() => {
    useAuthStore.setState({ user: null });
});

test('initial use should be null', () => {
    expect(useAuthStore.getState().user).toBe(null);
});

test('signup should set user and return the same user name and email', () => {
    const { signup } = useAuthStore.getState();
    signup('tuco', 'b@gmail.com', 'a');
    const user = useAuthStore.getState().user;
    expect(user?.name).toBe('tuco');
    expect(user?.email).toBe('b@gmail.com');
});

test('login should set user and return the same user email', () => {
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