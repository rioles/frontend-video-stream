import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:8080",
  realm: "videostream",
  clientId: "frontend-vid-stream",
});

export default keycloak;
