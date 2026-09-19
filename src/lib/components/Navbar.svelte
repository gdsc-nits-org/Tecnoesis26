<script>
    const navItems = ['Home', 'Gallery', 'Modules', 'Spark', 'Teams'];
</script>


<nav class="main-nav" aria-label="Main navigation">
			<div class="nav2">
                {#each navItems as item}
				<a href="/" class:active={item === 'Home'}>{item}</a>
			{/each}
            </div>
            <button class="login-btn">Login</button>
		</nav> 

<style>
    .main-nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 2rem;
		flex: 1;
		margin: 0;
	}

	.main-nav nav2 a {
		color: rgba(255, 255, 255, 0.8);
		display: inline-flex;
		align-items: center;
        gap: 2rem;
		justify-content: center;
		text-decoration: none;
		font-weight: 600;
		font-size: 1.1rem;
		opacity: 0.95;
	}
	.nav2   {
		color: rgba(255, 255, 255, 0.8);
		display: inline-flex;
		align-items: center;
        gap: 2rem;
		justify-content: center;
		text-decoration: none;
		font-weight: 600;
		font-size: 1.1rem;
		opacity: 0.95;
	}

	.main-nav a.active {
		position: relative;
	}

	.main-nav a.active::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: -0.5rem;
		height: 2px;
		background: rgba(255, 255, 255, 0.9);
	}

	.login-btn {
		appearance: none;
		background: transparent;
		border: none;
		color: rgba(255, 255, 255, 0.9);
		font-size: 1.1rem;
		font-weight: 600;
		cursor: pointer;
		padding: 0.5rem 0.75rem;
	}
</style>