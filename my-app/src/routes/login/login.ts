import { goto } from '$app/navigation';

export async function handleLogin(event: Event): Promise<void> {
  event.preventDefault();
  const emailInput = document.getElementById('email') as HTMLInputElement;
  const passwordInput = document.getElementById('password') as HTMLInputElement;

  const email: string = emailInput.value;
  const password: string = passwordInput.value;

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
    goto('/backlog');
  } else {
    alert('Error logging in: ' + result.error);
  }
}