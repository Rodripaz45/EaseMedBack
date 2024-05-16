export const handlePaymentCallback = (req, res) => {
    const { PedidoID, Estado } = req.body;

    if (Estado === "completado") {
        // Procesar la confirmación del pago
        console.log(`Pago para el pedido ${PedidoID} completado`);
        res.status(200).send({ error: 0, status: 1, message: "Pago Realizado Con exito" });
    } else {
        console.log(`Pago para el pedido ${PedidoID} no completado`);
        res.status(400).send({ error: 1, status: 0, message: "Error en el pago" });
    }
};