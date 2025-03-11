import { goto } from '$app/navigation';
import { userStore } from '$stores/userStore';

export async function handleLogin(event: Event): Promise<void> {
    event.preventDefault();
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;

    const email: string = emailInput.value;
    const password: string = passwordInput.value;

    try {
        const response: Response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (response.ok) {
            alert('Login successful');
            userStore.set({
                authUser: result.data.user,
                session: result.data.session,
            });
            goto('/projects');
        } else {
            alert('Error logging in: ' + result.error);
        }
    } catch (error) {
        console.error('Login request failed:', error);
        alert('An error occurred while logging in.');
    }
}
