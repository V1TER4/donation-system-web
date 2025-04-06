import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface DonationSuccessProps {
    show: boolean;
    onClose: () => void;
}

const DonationSuccess: React.FC<DonationSuccessProps> = ({ show, onClose }) => {
    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Doação Concluída</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Obrigado por sua doação! Sua contribuição faz a diferença.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button className="btn-primary" onClick={onClose}>
                    Fechar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DonationSuccess;