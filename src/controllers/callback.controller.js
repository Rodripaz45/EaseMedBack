export const processCallback = (req, res) => {
    const { PedidoID, Fecha, Hora, Estado, MetodoPago } = req.query;

    // Log the received data for debugging purposes
    console.log('Datos recibidos:', { PedidoID, Fecha, Hora, Estado, MetodoPago });

    // Send a success response
    res.send({
        error: 0,
        status: "1",
        message: "Pago Realizado Con exito",
        values: true
    });
};
