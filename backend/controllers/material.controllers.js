const pool = require("../db");

const getAllMateriales = async (req, res, next) => {
  try {
    const allMateriales = await pool.query("SELECT * FROM material");
    res.json(allMateriales.rows);
  } catch (error) {
    next(error);
  }
};

const getMaterial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM material WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Material no encontrado" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const createMaterial = async (req, res) => {
  try {
    const {
      inventarioUAM,
      inventarioCoordinacion,
      marca,
      modelo,
      numeroSerie,
      estado,
      nombreMaterial,
      cantidad,
      tipo,
      descripcion,
    } = req.body;

    const lastIdResult = await pool.query(
      `SELECT ID 
       FROM material 
       WHERE ID LIKE 'MAT-LAB-%' 
       ORDER BY ID DESC 
       LIMIT 1`
    );

    let newId;
    if (lastIdResult.rows.length === 0) {
      newId = "MAT-LAB-000001";
    } else {
      const lastId = lastIdResult.rows[0].id;
      const lastNumber = parseInt(lastId.replace("MAT-LAB-", ""), 10);
      const nextNumber = (lastNumber + 1).toString().padStart(6, "0");
      newId = `MAT-LAB-${nextNumber}`;
    }

    const result = await pool.query(
      `INSERT INTO material 
        (ID, Inventario_UAM, Inventario_coordinacion, Marca, Modelo, NumeroSerie, 
         Estado, NombreMaterial, Cantidad, Tipo, Descripcion) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
        RETURNING *`,
      [
        newId,
        inventarioUAM,
        inventarioCoordinacion,
        marca,
        modelo,
        numeroSerie,
        estado,
        nombreMaterial,
        cantidad,
        tipo,
        descripcion,
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error en createMaterial:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const deleteMaterial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM material WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Material no encontrado" });
    }

    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const updateMaterial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      inventarioUAM,
      inventarioCoordinacion,
      marca,
      modelo,
      numeroSerie,
      estado,
      nombreMaterial,
      cantidad,
      tipo,
      descripcion,
    } = req.body;

    const result = await pool.query(
      `UPDATE material 
            SET Inventario_UAM = $1, Inventario_coordinacion = $2, Marca = $3, Modelo = $4, 
                NumeroSerie = $5, Estado = $6, NombreMaterial = $7, Cantidad = $8, 
                Tipo = $9, Descripcion = $10
            WHERE ID = $11 
            RETURNING *`,
      [
        inventarioUAM,
        inventarioCoordinacion,
        marca,
        modelo,
        numeroSerie,
        estado,
        nombreMaterial,
        cantidad,
        tipo,
        descripcion,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Material no encontrado" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};


const getHistorialMaterial = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT 
        mh.*,
        e.nombre AS nombre_empleado
      FROM material_historial mh
      LEFT JOIN empleado e ON mh.idempleado = e.id
      WHERE mh.idmaterial = $1
      ORDER BY mh.fecha_evento DESC
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "No hay historial para este material",
      });
    }

    return res.json(result.rows);
  } catch (error) {
    next(error);
  }
};


const getMaterialesIncidencias = async (req, res) => {
  const client = await pool.connect();

  try {
    const query = `
      SELECT DISTINCT ON (mh.idmaterial)
        m.id,
        m.nombrematerial AS nombre,
        mh.fecha_evento AS fecha,
        mh.idprestamo,
        e.nombre AS "reportadoPor",
        mh.descripcion_evento AS comentario,
        mh.estado_nuevo AS estado
      FROM material_historial mh
      JOIN material m 
        ON mh.idmaterial = m.id
      LEFT JOIN empleado e 
        ON mh.idempleado = e.id
      WHERE mh.estado_nuevo IN (2, 3)
      ORDER BY mh.idmaterial, mh.fecha_evento DESC
    `;

    const result = await client.query(query);

    res.status(200).json(result.rows);

  } catch (error) {
    console.error("Error en getMaterialesIncidencias:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  } finally {
    client.release();
  }
};

const putHistorialYEstadoMaterial = async (req, res) => {
  const { id } = req.params;
  const { nuevoEstado, descripcion, nombreTecnico, idEmpleado } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      "SELECT estado FROM material WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error("Material no encontrado");
    }

    const estadoAnterior = result.rows[0].estado;

    const transicionesValidas = {
      2: [3, 0, 4],
      3: [0, 4],
    };

    if (!transicionesValidas[estadoAnterior]?.includes(nuevoEstado)) {
      throw new Error("Transición no permitida");
    }

    let tipoEvento;

   if (estadoAnterior === 2 && nuevoEstado === 3) {
  tipoEvento = 3; // Enviado a reparación
}
else if (estadoAnterior === 3 && nuevoEstado === 0) {
  tipoEvento = 7; //Reparado
}
else if (estadoAnterior === 2 && nuevoEstado === 0) {
  tipoEvento = 6; //Resuelto sin reparación
}
else if (nuevoEstado === 4) {
  tipoEvento = 4; // Baja
}

    await client.query(
      "UPDATE material SET estado = $1 WHERE id = $2",
      [nuevoEstado, id]
    );

    const empleado = await client.query(
      "SELECT 1 FROM empleado WHERE id = $1",
      [idEmpleado]
    );

    if (empleado.rows.length === 0) {
      throw new Error("Empleado no válido");
    }

    await client.query(
      `INSERT INTO material_historial 
        (idmaterial, idprestamo, idempleado, tipo_evento, descripcion_evento, 
        nombre_tecnico, estado_anterior, estado_nuevo)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        id,
        null,
        idEmpleado,
        tipoEvento,
        descripcion,
        nombreTecnico || null,
        estadoAnterior,
        nuevoEstado
      ]
    );

    await client.query("COMMIT");

    res.json({ message: "Gestión realizada correctamente" });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

module.exports = {
  getAllMateriales,
  getMaterial,
  createMaterial,
  deleteMaterial,
  updateMaterial,
  getHistorialMaterial,
  getMaterialesIncidencias,
  putHistorialYEstadoMaterial
};
