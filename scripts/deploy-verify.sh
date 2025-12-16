#!/bin/bash

# CipherVault Deployment Verification Script

set -e

echo "🚀 CipherVault Deployment Verification"
echo "========================================"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
FRONTEND_URL="${FRONTEND_URL:-https://ciphervault.app}"
BACKEND_URL="${BACKEND_URL:-https://ciphervault-api.onrender.com}"

# Function to check endpoint
check_endpoint() {
    local url=$1
    local name=$2
    
    echo -n "Checking $name... "
    
    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200\|301\|302"; then
        echo -e "${GREEN}✓ OK${NC}"
        return 0
    else
        echo -e "${RED}✗ FAILED${NC}"
        return 1
    fi
}

# Function to check API health
check_api_health() {
    echo -n "Checking API health... "
    
    response=$(curl -s "$BACKEND_URL/api/health")
    
    if echo "$response" | grep -q "ok\|healthy"; then
        echo -e "${GREEN}✓ Healthy${NC}"
        return 0
    else
        echo -e "${RED}✗ Unhealthy${NC}"
        return 1
    fi
}

# Function to check SSL
check_ssl() {
    local url=$1
    local name=$2
    
    echo -n "Checking SSL for $name... "
    
    if curl -s -I "$url" | grep -q "HTTP/2 \|HTTP/1.1"; then
        echo -e "${GREEN}✓ SSL Active${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠ SSL Warning${NC}"
        return 1
    fi
}

# Run checks
echo ""
echo "Frontend Checks:"
echo "----------------"
check_endpoint "$FRONTEND_URL" "Homepage"
check_endpoint "$FRONTEND_URL/dashboard" "Dashboard"
check_endpoint "$FRONTEND_URL/create" "Create Vault"
check_ssl "$FRONTEND_URL" "Frontend"

echo ""
echo "Backend Checks:"
echo "---------------"
check_endpoint "$BACKEND_URL/api/health" "Health Endpoint"
check_api_health
check_ssl "$BACKEND_URL" "Backend"

echo ""
echo "Performance Checks:"
echo "-------------------"

# Check response time
echo -n "Frontend response time... "
response_time=$(curl -o /dev/null -s -w '%{time_total}' "$FRONTEND_URL")
if (( $(echo "$response_time < 2.0" | bc -l) )); then
    echo -e "${GREEN}✓ ${response_time}s${NC}"
else
    echo -e "${YELLOW}⚠ ${response_time}s (slow)${NC}"
fi

echo -n "API response time... "
api_time=$(curl -o /dev/null -s -w '%{time_total}' "$BACKEND_URL/api/health")
if (( $(echo "$api_time < 1.0" | bc -l) )); then
    echo -e "${GREEN}✓ ${api_time}s${NC}"
else
    echo -e "${YELLOW}⚠ ${api_time}s (slow)${NC}"
fi

echo ""
echo "Security Checks:"
echo "----------------"

# Check security headers
echo -n "Security headers... "
headers=$(curl -s -I "$FRONTEND_URL")

if echo "$headers" | grep -q "X-Content-Type-Options" && \
   echo "$headers" | grep -q "X-Frame-Options" && \
   echo "$headers" | grep -q "Strict-Transport-Security"; then
    echo -e "${GREEN}✓ Present${NC}"
else
    echo -e "${YELLOW}⚠ Missing some headers${NC}"
fi

echo ""
echo "========================================"
echo -e "${GREEN}✓ Deployment Verification Complete${NC}"
echo ""
echo "Frontend: $FRONTEND_URL"
echo "Backend:  $BACKEND_URL"
echo ""
