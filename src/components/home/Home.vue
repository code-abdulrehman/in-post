<template>
    <div class="home-container">
        <div class="hero-section">
            <h1 class="title">InPost - Create Beautiful Designs</h1>
            <p class="subtitle">A powerful design tool inspired by Canva to create stunning graphics for social media, presentations, and more</p>
            <div class="action-buttons">
                <router-link to="/editor">
                    <Button label="Start Creating" icon="pi pi-pencil" class="p-button-lg" />
                </router-link>
                <router-link to="/dashboard">
                    <Button label="My Designs" icon="pi pi-images" class="p-button-outlined p-button-lg ml-3" />
                </router-link>
            </div>
        </div>

        <div class="features-section">
            <h2>Powerful Design Tools</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <i class="pi pi-image feature-icon"></i>
                    <h3>Templates</h3>
                    <p>Choose from a variety of ready-made templates for social media, presentations, and more.</p>
                </div>
                <div class="feature-card">
                    <i class="pi pi-palette feature-icon"></i>
                    <h3>Customization</h3>
                    <p>Easily customize colors, fonts, and layouts to match your brand identity.</p>
                </div>
                <div class="feature-card">
                    <i class="pi pi-th-large feature-icon"></i>
                    <h3>Elements</h3>
                    <p>Add shapes, text, images, and more to create compelling designs.</p>
                </div>
                <div class="feature-card">
                    <i class="pi pi-download feature-icon"></i>
                    <h3>Export Options</h3>
                    <p>Download your designs in various formats including PNG, JPG, PDF, and SVG.</p>
                </div>
            </div>
        </div>

        <div class="formats-section">
            <h2>Export to Multiple Formats</h2>
            <div class="formats-container">
                <div class="format-item">
                    <i class="pi pi-image format-icon"></i>
                    <span>PNG</span>
                </div>
                <div class="format-item">
                    <i class="pi pi-images format-icon"></i>
                    <span>JPG</span>
                </div>
                <div class="format-item">
                    <i class="pi pi-file-pdf format-icon"></i>
                    <span>PDF</span>
                </div>
                <div class="format-item">
                    <i class="pi pi-file format-icon"></i>
                    <span>SVG</span>
                </div>
                <div class="format-item">
                    <i class="pi pi-file-word format-icon"></i>
                    <span>DOC</span>
                </div>
                <div class="format-item">
                    <i class="pi pi-code format-icon"></i>
                    <span>INPOST</span>
                </div>
            </div>
        </div>

        <div class="cta-section">
            <h2>Ready to create stunning designs?</h2>
            <router-link to="/editor">
                <Button label="Start Creating Now" icon="pi pi-pencil" class="p-button-lg" />
            </router-link>
        </div>
    </div>
</template>

<script setup>

</script>

<style scoped>
.home-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

.hero-section {
    text-align: center;
    margin: 4rem 0;
}

.title {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: var(--primary-color);
}

.subtitle {
    font-size: 1.25rem;
    color: var(--text-color-secondary);
    max-width: 700px;
    margin: 0 auto 2rem;
}

.action-buttons {
    margin-top: 2rem;
}

.features-section {
    margin: 4rem 0;
    text-align: center;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
}

.feature-card {
    background-color: var(--surface-card);
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.feature-icon {
    font-size: 3rem;
    color: var(--primary-color);
    margin-bottom: 1rem;
}

.formats-section {
    margin: 4rem 0;
    text-align: center;
}

.formats-container {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 2rem;
    margin-top: 2rem;
}

.format-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.5rem;
    background-color: var(--surface-card);
    border-radius: 12px;
    min-width: 120px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.format-icon {
    font-size: 2.5rem;
    color: var(--primary-color);
    margin-bottom: 1rem;
}

.cta-section {
    margin: 6rem 0 4rem;
    text-align: center;
    background-color: var(--surface-ground);
    padding: 3rem;
    border-radius: 12px;
}
</style>

