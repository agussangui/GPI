<script lang="ts">
  import LandingLayout from '$lib/layouts/LandingLayout.svelte';
  import { handleLogin } from './login';

  let email: string = '';
  let password: string = '';
</script>
<LandingLayout title="Login">
<div class="container">
  <h2>Login</h2>
  <form on:submit={handleLogin}>
    <div class="form-group">
      <label for="email">Email</label>
      <input type="email" id="email" bind:value={email} required>
    </div>
    <div class="form-group">
      <label for="password">Password</label>
      <input type="password" id="password" bind:value={password} required>
    </div>
    <button type="submit" class="login-button">Login</button>
  </form>
</div>
</LandingLayout>

<style>
  .container {
    max-width: 400px;
    margin: 100px auto;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    background-color: #ffffff;
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  }
  .container:hover {
    transform: scale(1.02);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
  h2 {
    text-align: center;
    margin-bottom: 20px;
    color: #007bff;
  }
  .form-group {
    margin-bottom: 15px;
  }
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #333;
  }
  input {
    width: 100%;
    padding: 10px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    transition: border-color 0.3s ease-in-out, background-color 0.3s ease-in-out, color 0.3s ease-in-out;
    background-color: #fff;
    color: #000;
  }
  input:focus {
    border-color: #007bff;
    background-color: #fff;
    color: #000;
  }
  .login-button {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 20px;
    transition: background-color 0.3s ease-in-out;
  }
  .login-button:hover {
    background-color: #0056b3;
  }
</style>