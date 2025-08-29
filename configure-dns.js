#!/usr/bin/env node

const GODADDY_API_KEY = 'key_3mEUUH9PXRjuanvfKwCfQA7d3YKJrF9j';
const GODADDY_API_SECRET = 'secret_EXBZJGS8AXCZH7JMU7F4EA';

async function configureDNS() {
  console.log('🌐 Configuring DNS for bendavis.thefortaiagency.ai...');
  
  const response = await fetch(
    'https://api.godaddy.com/v1/domains/thefortaiagency.ai/records',
    {
      method: 'PATCH',
      headers: {
        'Authorization': `sso-key ${GODADDY_API_KEY}:${GODADDY_API_SECRET}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([{
        type: 'A',
        name: 'bendavis',
        data: '76.76.21.21',
        ttl: 600
      }])
    }
  );

  if (response.ok) {
    console.log('✅ DNS configured successfully!');
  } else {
    console.error('❌ Failed:', await response.text());
  }
}

configureDNS();