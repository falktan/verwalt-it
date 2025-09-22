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
                    </div>
                    <div class="main-content" id="main-content">
                        <slot></slot>
                    </div>
					<div class="footer" id="footer">
						<div class="nav-links">
                            <a href="/">Startseite</a>
                            <a href="/hochschule-schmalkalden/fak-elektrotechnik/antrag-ausgabe-batchelorarbeit">FH Schmalkalden</a>
                            <a href="/impressum">Impressum</a>
                            <a href="/datenschutzerklaerung">Datenschutz</a>
                            <a href="https://github.com/falktan/verwalt-it">Verwalt-It auf GitHub</a>
						</div>
					</div>
                </div>
            `;
        }
    }

    customElements.define('verwalt-it-content-wrapper', ContentWrapper);
})();
