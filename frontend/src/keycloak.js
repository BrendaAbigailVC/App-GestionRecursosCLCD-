import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8080', //Docker local
  realm: 'GestionRecursos',
  clientId: 'frontend-react'
});

export default keycloak;