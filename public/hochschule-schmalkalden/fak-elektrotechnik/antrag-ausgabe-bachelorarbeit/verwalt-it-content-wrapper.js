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
                <link rel="stylesheet" href="/style.css">

                <div class="content-wrapper" id="content-wrapper">
                    <div class="nav-bar">
                        <a href="/">
                            <img class="logo" src="https://www.hs-schmalkalden.de/typo3conf/ext/hsm_sitepackage/Resources/Public/Images/logo.jpg" alt="Logo Hochschule Schmalkalden"> 
                        </a>
					<br/>
                    </div>

                    <div class="main-content" id="main-content">
                        <slot></slot>
                    </div>
                    <hr/>

                    <div class="footer" id="footer">
						<div class="nav-links">
                            <a href="/">Startseite</a>
                            <a href="/impressum">Impressum</a>
                            <a href="/datenschutzerklaerung">Datenschutz</a>
                            <a href="https://github.com/falktan/verwalt-it" target="_blank">Verwalt-It auf GitHub</a>
						</div>
					</div>
                </div>
            `;
        }
    }

    customElements.define('verwalt-it-content-wrapper', ContentWrapper);
})();
