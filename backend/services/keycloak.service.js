const KcAdminClient = require("@keycloak/keycloak-admin-client").default;

const kcAdminClient = new KcAdminClient({
  baseUrl: process.env.KEYCLOAK_URL,
  realmName: "master",
});

async function autenticarAdmin() {
  await kcAdminClient.auth({
    username: process.env.KEYCLOAK_ADMIN_USER,
    password: process.env.KEYCLOAK_ADMIN_PASSWORD,
    grantType: "password",
    clientId: "admin-cli",
  });

  kcAdminClient.setConfig({
    realmName: process.env.KEYCLOAK_REALM,
  });
}
async function crearUsuarioKeycloak({
  username,
  email,
  password,
  firstName,
  lastName,
  rol,
}) {
  await autenticarAdmin();

  // Verificar si ya existe
  const existentes = await kcAdminClient.users.find({
    realm: process.env.KEYCLOAK_REALM,
    username,
  });

  if (existentes.length > 0) {
    throw new Error("Ya existe un usuario con ese correo en Keycloak");
  }

  // Crear usuario
  await kcAdminClient.users.create({
    realm: process.env.KEYCLOAK_REALM,
    username,
    email,
    enabled: true,
    emailVerified: true,
    firstName,
    lastName,
  });

  // Buscar el usuario recién creado
  const [usuario] = await kcAdminClient.users.find({
    realm: process.env.KEYCLOAK_REALM,
    username,
  });

  if (!usuario) {
    throw new Error("No fue posible obtener el usuario creado en Keycloak");
  }

  // Asignar contraseña
  await kcAdminClient.users.resetPassword({
    realm: process.env.KEYCLOAK_REALM,
    id: usuario.id,
    credential: {
      temporary: false,
      type: "password",
      value: password,
    },
  });

  // Buscar rol
  const realmRole = await kcAdminClient.roles.findOneByName({
    realm: process.env.KEYCLOAK_REALM,
    name: rol,
  });

  if (!realmRole) {
    throw new Error(`No existe el rol ${rol} en Keycloak`);
  }

  // Asignar rol
  await kcAdminClient.users.addRealmRoleMappings({
    realm: process.env.KEYCLOAK_REALM,
    id: usuario.id,
    roles: [
      {
        id: realmRole.id,
        name: realmRole.name,
      },
    ],
  });

  return usuario.id;
}

module.exports = {
  crearUsuarioKeycloak,
};