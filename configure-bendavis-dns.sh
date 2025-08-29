#!/bin/bash

# GoDaddy DNS Configuration for bendavis.thefortaiagency.ai
# This script adds the necessary A record to point to Vercel

echo "========================================="
echo "GoDaddy DNS Configuration for Ben Davis"
echo "========================================="
echo ""
echo "This script will configure the DNS for bendavis.thefortaiagency.ai"
echo "to point to Vercel's IP address: 76.76.21.21"
echo ""

# You need to provide these credentials
read -p "Enter your GoDaddy API Key: " GODADDY_KEY
read -s -p "Enter your GoDaddy API Secret: " GODADDY_SECRET
echo ""

DOMAIN="thefortaiagency.ai"
SUBDOMAIN="bendavis"
VERCEL_IP="76.76.21.21"

echo ""
echo "Configuring DNS record..."
echo "  Subdomain: ${SUBDOMAIN}.${DOMAIN}"
echo "  Type: A"
echo "  Value: ${VERCEL_IP}"
echo ""

# Create the DNS record
curl -X PATCH "https://api.godaddy.com/v1/domains/${DOMAIN}/records" \
  -H "Authorization: sso-key ${GODADDY_KEY}:${GODADDY_SECRET}" \
  -H "Content-Type: application/json" \
  -d "[{\"data\":\"${VERCEL_IP}\",\"name\":\"${SUBDOMAIN}\",\"ttl\":600,\"type\":\"A\"}]"

echo ""
echo ""
echo "DNS configuration complete!"
echo ""
echo "Please wait a few minutes for DNS propagation."
echo "Your site will be available at: https://bendavis.thefortaiagency.ai"
echo ""
echo "You can check the DNS status with:"
echo "  nslookup bendavis.thefortaiagency.ai"
echo ""