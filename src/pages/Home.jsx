import InfoCard from '../components/InfoCard';

function Home() {
    return (
        <>
            <section className="mt-5 text-center mx-auto" style={{ maxWidth: '750px' }}>
                <h2 className="lato-bold-italic">Tus recetas cuando y donde las necesites</h2>
                <p className='text-center lato-bold'>
                    Estamos trabajando para poder brindarte una excelente experiencia. Pronto podrás encontrar las mejores recetas de una forma fácil y rápida, filtrando por los ingredientes que tengas disponibles o el tipo de dieta que nececites
                </p>
            </section>
            <section className="d-flex justify-content-between align-items-center px-4 py-5">
                <img src="/comida_corazon.png" alt="Imagen de cocina" className="img-fluid" style={{ maxWidth: '500px' }} />
                <aside className="ms-auto" style={{ maxWidth: '500px' }}>
                    <InfoCard />
                </aside>
            </section>
        </>
    );
}

export default Home;