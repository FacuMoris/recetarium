import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function InfoCard() {
    return (
        <Card className="text-center bg-light">
            <Card.Header>¡Muy pronto!</Card.Header>
            <Card.Body className='bg-light'>
                <Card.Title className='lato-bold'>Quiero que me avisen</Card.Title>
                <Card.Text>
                    Dejanos tu mail y te estaremos envíando una notificación para que seas de los primeros en encontrar las mejores recetas
                </Card.Text>
                <Button variant="primary"><span className='lato-bold'>Anotarme</span></Button>
            </Card.Body>
            <Card.Footer className="text-muted">¡Muy Pronto!</Card.Footer>
        </Card>
    );
}

export default InfoCard;