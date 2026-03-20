#!/bin/sh

echo "Waiting for Keycloak..."

until wget -q --spider http://keycloak:8080; do
  echo "Keycloak not ready yet..."
  sleep 5
done

echo "Keycloak is ready!"