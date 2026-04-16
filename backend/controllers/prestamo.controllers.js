const pool = require("../db");

const getAllPrestamos = async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.*,
        CASE 
          WHEN p.solicitante_tipo = 'ALUMNO' THEN a.matricula
          ELSE e2.noeconomico
        END AS solicitante_codigo,
        CASE 
          WHEN p.solicitante_tipo = 'ALUMNO' THEN CONCAT(a.nombre, ' ', a.apellidopaterno)
          ELSE CONCAT(e2.nombre, ' ', e2.apellidopaterno)
        END AS solicitante_nombre,
        p.solicitante_tipo,
        e.nombre AS empleado_nombre
      FROM prestamo p

      LEFT JOIN alumno a 
        ON p.solicitante_id = a.id 
        AND p.solicitante_tipo = 'ALUMNO'

      LEFT JOIN empleado e2 
        ON p.solicitante_id = e2.id 
        AND p.solicitante_tipo = 'EMPLEADO'

      LEFT JOIN empleado e 
        ON e.id = p.idempleado
    `);

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

const getPrestamosActivos = async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.*,
        CASE 
          WHEN p.solicitante_tipo = 'ALUMNO' THEN a.matricula
          ELSE e2.noeconomico
        END AS solicitante_codigo,
        CASE 
          WHEN p.solicitante_tipo = 'ALUMNO' THEN CONCAT(a.nombre, ' ', a.apellidopaterno)
          ELSE CONCAT(e2.nombre, ' ', e2.apellidopaterno)
        END AS solicitante_nombre,
        p.solicitante_tipo,
        e.nombre AS empleado_nombre
      FROM prestamo p
      LEFT JOIN alumno a 
        ON p.solicitante_id = a.id 
        AND p.solicitante_tipo = 'ALUMNO'
      LEFT JOIN empleado e2 
        ON p.solicitante_id = e2.id 
        AND p.solicitante_tipo = 'EMPLEADO'
      LEFT JOIN empleado e 
        ON e.id = p.idempleado
      WHERE p.estadoprestamo = 0
    `);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

const getPrestamosAlumno = async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT 
        p.*, 
        a.matricula AS alumno_matricula, 
        e.nombre AS empleado_nombre
      FROM prestamo p
      LEFT JOIN alumno a ON a.id = p.idalumno
      LEFT JOIN empleado e ON e.id = p.idempleado
      WHERE p.idalumno = $1
    `,
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

const getPrestamo = async (req, res, next) => {
  const { id } = req.params;

  try {
    const prestamoQuery = `
      SELECT 
        p.id,
        p.solicitante_id,
        p.solicitante_tipo,
        CASE 
          WHEN p.solicitante_tipo = 'ALUMNO' THEN a.matricula
          ELSE e2.noeconomico
        END AS solicitante_codigo,
        CASE 
          WHEN p.solicitante_tipo = 'ALUMNO' 
            THEN CONCAT(a.nombre, ' ', a.apellidopaterno, ' ', a.apellidomaterno)
          ELSE CONCAT(e2.nombre, ' ', e2.apellidopaterno, ' ', e2.apellidomaterno)
        END AS solicitante_nombre,
        p.idempleado,
        e.noeconomico AS no_economico,
        p.tipoprestamo,
        p.fechaprestamo,
        p.fechadevolucion,
        p.uea,
        p.grupo,
        p.observaciones
      FROM prestamo p
      LEFT JOIN alumno a 
        ON p.solicitante_id = a.id 
        AND p.solicitante_tipo = 'ALUMNO'
      LEFT JOIN empleado e2 
        ON p.solicitante_id = e2.id 
        AND p.solicitante_tipo = 'EMPLEADO'
      LEFT JOIN empleado e 
        ON p.idempleado = e.id
      WHERE p.id = $1
    `;
    const prestamoResult = await pool.query(prestamoQuery, [id]);
    if (prestamoResult.rows.length === 0) {
      return res.status(404).json({ message: "Préstamo no encontrado" });
    }
    const prestamo = prestamoResult.rows[0];

    const materialesQuery = `
      SELECT 
        mp.idmaterial,
        m.nombrematerial,
        mp.cantidad,
        m.tipo
      FROM material_prestamo mp
      JOIN material m ON mp.idmaterial = m.id
      WHERE mp.idprestamo = $1
    `;
    const materialesResult = await pool.query(materialesQuery, [id]);

    res.json({
      id: prestamo.id,
      solicitante_tipo: prestamo.solicitante_tipo,
      solicitante_codigo: prestamo.solicitante_codigo,
      solicitante_nombre: prestamo.solicitante_nombre,
      numeroEconomico: prestamo.no_economico,
      fechaPrestamo: prestamo.fechaprestamo,
      fechaDevolucion: prestamo.fechadevolucion,
      tipoPrestamo: prestamo.tipoprestamo,
      uea: prestamo.uea,
      grupo: prestamo.grupo,
      observaciones: prestamo.observaciones,
      materiales: materialesResult.rows,
    });
  } catch (error) {
    console.error("Error al obtener el préstamo:", error);
    next(error);
  }
};

const createPrestamo = async (req, res, next) => {
  const client = await pool.connect();
  try {
    const {
      id,
      solicitante_id,
      solicitante_tipo,
      idEmpleado,
      estadoPrestamo,
      fechaPrestamo,
      fechaDevolucion,
      uea,
      grupo,
      observaciones,
      tipoPrestamo,
      materiales,
    } = req.body;

    const prestamoExistente = await pool.query(
      "SELECT 1 FROM prestamo WHERE id = $1",
      [id]
    );
    if (prestamoExistente.rows.length > 0) {
      return res.status(400).json({ message: "El ID del préstamo ya existe" });
    }

    if (!solicitante_id || !solicitante_tipo) {
      return res.status(400).json({
        message: "Debes indicar solicitante_id y solicitante_tipo",
      });
    }

    let tabla = "";

    if (solicitante_tipo === "ALUMNO") {
      tabla = "alumno";
    } else if (solicitante_tipo === "EMPLEADO") {
      tabla = "empleado";
    } else {
      return res.status(400).json({
        message: "Tipo de solicitante inválido",
      });
    }

     const existeSolicitante = await pool.query(
      `SELECT 1 FROM ${tabla} WHERE id = $1`,
      [solicitante_id]
    );

    if (existeSolicitante.rows.length === 0) {
      return res.status(400).json({
        message: `${solicitante_tipo} no existe`,
      });
    }

    const empleado = await pool.query("SELECT 1 FROM empleado WHERE id = $1", [
      idEmpleado,
    ]);
    if (empleado.rows.length === 0) {
      return res.status(400).json({ message: "El empleado no existe" });
    }

    if (new Date(fechaDevolucion) < new Date(fechaPrestamo)) {
      return res.status(400).json({
        message: "La fecha de devolución no puede ser menor que la de préstamo",
      });
    }

    await client.query("BEGIN");

    const result = await client.query(
      `INSERT INTO prestamo 
        (id, solicitante_id, solicitante_tipo, idempleado, estadoprestamo, fechaprestamo, fechadevolucion, uea, grupo, observaciones, tipoprestamo) 
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING *`,
      [
        id,
        solicitante_id,
        solicitante_tipo,
        idEmpleado,
        estadoPrestamo,
        fechaPrestamo,
        fechaDevolucion,
        uea,
        grupo,
        observaciones,
        tipoPrestamo,
      ]
    );

    const descripcion = `Préstamo asignado a ${solicitante_tipo.toLowerCase()} ${solicitante_id}`;

    for (const material of materiales) {
      const { idMaterial, cantidad } = material;

      const materialDB = await client.query(
        "SELECT cantidad, tipo, estado FROM material WHERE id = $1",
        [idMaterial]
      );

      if (materialDB.rows.length === 0) {
        await client.query("ROLLBACK");
        return res
          .status(400)
          .json({ message: `Material ${idMaterial} no existe` });
      }

      if (materialDB.rows[0].cantidad < cantidad) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          message: `Cantidad de ${idMaterial} solicitada mayor a la disponible`,
        });
      }

      const estadoAnterior = materialDB.rows[0].estado ?? ESTADOS.DISPONIBLE;

      const esConsumible = materialDB.rows[0].tipo === 1;

      if (esConsumible) {

        await client.query(
          "UPDATE material SET cantidad = cantidad - $1 WHERE id = $2",
          [cantidad, idMaterial]
        );
      } else {

        await client.query(
          "UPDATE material SET cantidad = cantidad - $1, estado = $2 WHERE id = $3",
          [cantidad, ESTADOS.PRESTADO, idMaterial]
        );
      }


      await client.query(
        "INSERT INTO material_prestamo (IdPrestamo, IdMaterial, Cantidad) VALUES ($1, $2, $3)",
        [id, idMaterial, cantidad]
      );

      const estadoNuevo = esConsumible ? estadoAnterior : ESTADOS.PRESTADO;

      await client.query(
        `INSERT INTO material_historial 
          (idmaterial, idprestamo, idempleado, tipo_evento, descripcion_evento, estado_anterior, estado_nuevo) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          idMaterial,
          id,
          idEmpleado,
          1,
          descripcion,
          estadoAnterior,
          estadoNuevo,
        ]
      );
    }

    await client.query("COMMIT");
    res.status(201).json(result.rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    next(error);
  } finally {
    client.release();
  }
};

const getPrestamosPorEmpleado = async (req, res, next) => {
  try {
    const { idEmpleado } = req.params;
    const result = await pool.query(
      "SELECT COUNT(*) FROM prestamo WHERE idempleado = $1",
      [idEmpleado]
    );
    const contador = parseInt(result.rows[0].count, 10);
    res.json({ contador });
  } catch (error) {
    next(error);
  }
};

const ESTADOS = {
  DISPONIBLE: 0,
  PRESTADO: 1,
  CON_INCIDENCIA: 2,
  EN_REPARACION: 3,
  DE_BAJA: 4
};

const finalizarPrestamo = async (req, res, next) => {
  const { id } = req.params;
  const { observaciones, incidencias } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const prestamoRes = await client.query(
      "SELECT * FROM prestamo WHERE id = $1 AND estadoprestamo = 0",
      [id]
    );
    if (prestamoRes.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Préstamo no encontrado o ya finalizado." });
    }
    const idEmpleado = prestamoRes.rows[0].idempleado;

    const materialesRes = await client.query(
      `SELECT mp.idmaterial, mp.cantidad, m.tipo 
       FROM material_prestamo mp
       JOIN material m ON mp.idmaterial = m.id
       WHERE mp.idprestamo = $1`,
      [id]
    );

    if (materialesRes.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "El préstamo no tiene materiales." });
    }

    for (const { idmaterial, cantidad, tipo } of materialesRes.rows) {
      const inc = incidencias?.[idmaterial] || {};
      const cantidadDevuelta = tipo === 1 ? (inc.cantidadDevuelta ?? cantidad) : cantidad;
      const estadoAnteriorRes = await client.query(
        "SELECT estado, cantidad FROM material WHERE id = $1",
        [idmaterial]
      );
      const materialActual = estadoAnteriorRes.rows[0];
      const estadoAnterior = materialActual.estado;
      const cantidadActual = materialActual.cantidad;

      let estadoNuevo;
      let tipoEvento;
      let descripcionEvento;

      if (inc.estado === "mal") {
        estadoNuevo = ESTADOS.CON_INCIDENCIA;
        tipoEvento = 5;
        descripcionEvento = inc.comentario;
      } else {
        if (tipo === 1) {
          estadoNuevo = cantidadActual + cantidadDevuelta > 0 ? ESTADOS.DISPONIBLE : ESTADOS.AGOTADO;
        } else {
          estadoNuevo = ESTADOS.DISPONIBLE;
        }
        tipoEvento = 2;
        if (tipo === 1) {
          if (cantidadDevuelta === cantidad) {
            descripcionEvento = `Devolución completa (${cantidadDevuelta}/${cantidad})`;
          } else if (cantidadDevuelta > 0) {
            descripcionEvento = `Devolución parcial (${cantidadDevuelta}/${cantidad})`;
          } else {
            descripcionEvento = `No se devolvió (${cantidadDevuelta}/${cantidad})`;
          }
        } else {
          descripcionEvento = "Devolución sin incidencias";
        }
      }
      await client.query(
        `UPDATE material 
         SET estado = $1, cantidad = cantidad + $2
         WHERE id = $3`,
        [estadoNuevo, cantidadDevuelta, idmaterial]
      );

      await client.query(
        `INSERT INTO material_historial
         (idmaterial, idprestamo, idempleado, tipo_evento, descripcion_evento, idtecnico, estado_anterior, estado_nuevo)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [idmaterial, id, idEmpleado, tipoEvento, descripcionEvento, null, estadoAnterior, estadoNuevo]
      );
    }

    const observacionFinal = observaciones?.trim() || "Devolución sin incidencias";
    await client.query(
      `UPDATE prestamo 
       SET estadoprestamo = 1,
           fechaentregado = CURRENT_DATE,
           observaciones = $2
       WHERE id = $1`,
      [id, observacionFinal]
    );

    await client.query("COMMIT");
    res.json({ message: "Préstamo finalizado correctamente." });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    next(error);
  } finally {
    client.release();
  }
};

module.exports = {
  getAllPrestamos,
  getPrestamosAlumno,
  getPrestamosActivos,
  getPrestamo,
  createPrestamo,
  getPrestamosPorEmpleado,
  finalizarPrestamo,
};
