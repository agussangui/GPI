<script lang="ts">
  import LandingLayout from '$lib/layouts/LandingLayout.svelte';
</script>

<style>
  :root {
    --primary-color: #007bff;
    --secondary-color: #6c757d;
    --bg-light: #f8f9fa;
    --text-dark: #212529;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  .hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 80px 20px;
    background: var(--bg-light);
    border-radius: 10px;
  }

  .hero h2 {
    font-size: 2.5rem;
    color: var(--text-dark);
  }

  .hero p {
    font-size: 1.2rem;
    color: var(--secondary-color);
    max-width: 800px;
    margin-top: 10px;
  }

  .buttons {
    margin-top: 20px;
    display: flex;
    gap: 20px;
  }

  .button {
    padding: 12px 24px;
    font-size: 1rem;
    color: #fff;
    background: var(--primary-color);
    border: none;
    border-radius: 5px;
    cursor: pointer;
    text-decoration: none;
    transition: 0.3s;
  }
  .button:hover {
    background: darkblue;
  }

  .dashboard-preview {
    margin-top: 50px;
    text-align: center;
  }

  .dashboard-placeholder {
    width: 100%;
    max-width: 900px;
    height: 400px;
    background: #ddd;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--secondary-color);
    border-radius: 10px;
  }
</style>

<LandingLayout title="Landing">
  <div class="container">
    <section class="hero">
      <h2>Build better products with agile development</h2>
      <p>ScrumTool helps teams track projects, prioritize work, and ship value to customers faster. Simplify your workflow with our intuitive scrum tools.</p>
      <div class="buttons">
        <a href="/register" class="button">Get Started</a>
        <a href="/login" class="button" style="background: var(--secondary-color);">Log In</a>
      </div>
    </section>

    <!-- <section class="dashboard-preview">
      <h3>ScrumTool Dashboard Preview</h3>
      <div class="dashboard-placeholder">Dashboard Preview Image</div>
    </section> -->
  </div>
</LandingLayout>