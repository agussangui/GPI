import { goto } from '$app/navigation';

export async function handleRegister(event: Event): Promise<void> {
  event.preventDefault();
  const emailInput = document.getElementById('email') as HTMLInputElement;
  const passwordInput = document.getElementById('password') as HTMLInputElement;

  const email: string = emailInput.value;
  const password: string = passwordInput.value;

  const response: Response = await fetch('/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const result = await response.json();

  if (response.ok) {
    alert('Registration successful');
    goto('/login');
  } else {
    alert('Error registering: ' + result.error);
  }
}
