function Footer() {
    return (
        <footer className="bg-light text-dark fixed-bottom  lato-bold" style={{ height: 150 }}>
            <div className="container d-flex justify-content-around align-items-center flex-column flex-md-row gap-3 h-100">
                <div className="d-flex flex-row align-items-center gap-5 justify-content-around">
                    <a href="#" target="_blank" rel="noopener noreferrer">
                        <img src="/icon-wpp.svg" alt="WhatsApp" width="45" />
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                        <img src="/icon-ig.svg" alt="Instagram" width="50" />
                    </a>
                </div>

                <div className="text-center text-md-end small">
                    <p className="mb-0">&copy; {new Date().getFullYear()} Recetarium. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;