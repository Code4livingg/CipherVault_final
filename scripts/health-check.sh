#!/bin/bash

# Post-Deployment Health Check Script

BACKEND_URL="${BACKEND_URL:-https://ciphervault-api.onrender.com}"

# Health check endpoint
response=$(curl -s "$BACKEND_URL/api/health")

if echo "$response" | grep -q "ok\|healthy"; then
    echo "✓ Health check passed"
    exit 0
else
    echo "✗ Health check failed"
    echo "Response: $response"
    exit 1
fi
