<script>
  export const title = "Welcome to ScrumTool";
</script>

<style>
  /* Add your styles here */
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0px;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px;
  }
  .nav-links {
    display: flex;
    gap: 20px;
  }
  .footer {
    margin-top: 50px;
    padding: 20px 0;
    text-align: center;
    border-top: 1px solid #ccc;
  }
</style>

<div class="container">
  <header class="header">
    <div class="logo">
      <h1>ScrumTool</h1>
    </div>
    <nav class="nav-links">
      <a href="/">Home</a>
      <a href="/#features">Features</a>
      <a href="/#how-it-works">How It Works</a>
      <a href="/#pricing">Pricing</a>
      <a href="/login">Login</a>
      <a href="/register">Register</a>
    </nav>
  </header>

  <main>
    <slot />
  </main>

  <footer class="footer">
    <p>&copy; 2025 ScrumTool. All rights reserved.</p>
  </footer>
</div>
