export const handlePagoNotification = async (req, res) => {
    const { PedidoID, Estado, MetodoPago, error, message } = req.body;

    try {
        
        console.log('Pago recibido:', req.body);

        res.status(200).send({ message: 'Notificación recibida exitosamente' });
    } catch (error) {
        console.error('Error al procesar la notificación de pago:', error);
        res.status(500).send({ message: 'Error interno del servidor' });
    }
};
