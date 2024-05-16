export const confirmarPago = async (req, res) => {
    console.log('Solicitud recibida en /confirmar_pago');
    
    try {
        const data = req.body;
        console.log('Datos recibidos:', JSON.stringify(data, null, 2));

        if (data.error === 0 && data.status === 1) {
            const pedidoID = data.PedidoID;
            console.log('Pago confirmado para el pedido ID:', pedidoID);
            res.json({ message: 'Pago confirmado' });
        } else {
            console.warn('Pago no confirmado:', JSON.stringify(data, null, 2));
            res.status(400).json({ error: 'Pago no confirmado' });
        }
    } catch (error) {
        console.error('Error procesando la solicitud:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};