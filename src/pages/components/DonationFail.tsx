import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface DonationFailProps {
    show: boolean;
    onClose: () => void;
}

const DonationFail: React.FC<DonationFailProps & { title: string; message: string; }> = ({ show, onClose, title, message }) => {
    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{message}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button className="btn-primary" onClick={onClose}>
                    Fechar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DonationFail;