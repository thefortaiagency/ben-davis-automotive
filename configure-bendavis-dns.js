#!/usr/bin/env node

import https from 'https';

// GoDaddy API credentials
const API_KEY = '9jHwmx1uNpS_KYhM4NMXJez63FjXEcjKhu';
const API_SECRET = 'QYDxHfEyfpLCeJsS8r3CzU';

// Domain configuration
const DOMAIN = 'thefortaiagency.ai';
const SUBDOMAIN = 'bendavis';
const VERCEL_IP = '76.76.21.21';

async function configureDNS() {
  console.log('🌐 Configuring DNS for bendavis.thefortaiagency.ai...');
  
  const auth = `sso-key ${API_KEY}:${API_SECRET}`;
  
  // Create A record for subdomain
  const recordData = JSON.stringify([
    {
      type: 'A',
      name: SUBDOMAIN,
      data: VERCEL_IP,
      ttl: 600
    }
  ]);

  const options = {
    hostname: 'api.godaddy.com',
    path: `/v1/domains/${DOMAIN}/records/A/${SUBDOMAIN}`,
    method: 'PUT',
    headers: {
      'Authorization': auth,
      'Content-Type': 'application/json',
      'Content-Length': recordData.length
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 204) {
          console.log('✅ DNS configured successfully!');
          console.log(`🚀 bendavis.thefortaiagency.ai → ${VERCEL_IP}`);
          console.log('⏱️  DNS propagation may take up to 48 hours');
          resolve(data);
        } else {
          console.error(`❌ Failed with status ${res.statusCode}`);
          console.error('Response:', data);
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('❌ Request failed:', error);
      reject(error);
    });
    
    req.write(recordData);
    req.end();
  });
}

// Run the configuration
configureDNS()
  .then(() => {
    console.log('\n🎉 DNS configuration complete!');
    console.log('📝 Next steps:');
    console.log('1. Wait for DNS propagation (usually 5-30 minutes)');
    console.log('2. Visit https://bendavis.thefortaiagency.ai');
  })
  .catch((error) => {
    console.error('\n❌ DNS configuration failed:', error.message);
    process.exit(1);
  });