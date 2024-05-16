export const confirmarPago = async (req, res) => {
    console.log('Solicitud recibida en /confirmar_pago');
    const data = req.body;
    console.log('Datos recibidos:', data);

    if (data.error === 0 && data.status === 1) {
        const pedidoID = data.PedidoID;
        console.log('Pago confirmado para el pedido ID:', pedidoID);
        res.json({ message: 'Pago confirmado' });
    } else {
        console.warn('Pago no confirmado:', data);
        res.status(400).json({ error: 'Pago no confirmado' });
    }
};