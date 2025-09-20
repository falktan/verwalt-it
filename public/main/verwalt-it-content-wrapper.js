(() => {
    class ContentWrapper extends HTMLElement {
        constructor() {
            super();
        }
        connectedCallback() {
            this.attachShadow({mode: 'open'});
            this.shadowRoot.innerHTML = this.render();
        }

        render() {
            return `
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@latest/css/pico.classless.min.css">
                <link rel="stylesheet" href="/style.css">

                <div class="content-wrapper" id="content-wrapper">
                    <div class="nav-bar">
                        <a href="/">
                            <slot name="logo">
                                <!-- Default logo if none is provided via slot -->
                                <img class="logo" src="assets/logo.svg" alt="Logo">
                            </slot>
                        </a>
                        <br/>
                        <div class="nav-links">
                            <a style="margin: 1em;" href="/">Startseite</a>
                            <a style="margin: 1em;" href="/impressum">Impressum</a>
                            <a style="margin: 1em;" href="/datenschutzerklaerung">Datenschutz</a>
                        </div>
                    </div>
                    <div class="main-content" id="main-content">
                        <slot></slot>
                    </div>
                    <div class="footer" id="footer">
                    </div>
                </div>
            `;
        }
    }

    customElements.define('verwalt-it-content-wrapper', ContentWrapper);
})();
