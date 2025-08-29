#!/usr/bin/env node

/**
 * Configure GoDaddy DNS for bendavis.thefortaiagency.ai
 * NEXUS Platform Automation - DNS Configuration
 */

const https = require('https');
const readline = require('readline');

const DOMAIN = 'thefortaiagency.ai';
const SUBDOMAIN = 'bendavis';
const VERCEL_IP = '76.76.21.21';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function configureDNS(apiKey, apiSecret) {
    console.log('\n🌐 Configuring DNS for bendavis.thefortaiagency.ai...\n');
    
    const headers = {
        'Authorization': `sso-key ${apiKey}:${apiSecret}`,
        'Content-Type': 'application/json'
    };
    
    // Check if record exists
    console.log('📝 Checking existing DNS records...');
    
    const checkOptions = {
        hostname: 'api.godaddy.com',
        path: `/v1/domains/${DOMAIN}/records/A/${SUBDOMAIN}`,
        method: 'GET',
        headers: headers
    };
    
    return new Promise((resolve, reject) => {
        const checkReq = https.request(checkOptions, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 404) {
                    // Record doesn't exist, create it
                    console.log('   No existing record found, creating new...\n');
                    createRecord(headers);
                } else if (res.statusCode === 200) {
                    // Record exists, update it
                    console.log('   Found existing record, updating...\n');
                    updateRecord(headers);
                } else {
                    console.error(`❌ Error: ${res.statusCode} - ${data}`);
                    reject(new Error(data));
                }
            });
        });
        
        checkReq.on('error', reject);
        checkReq.end();
    });
}

function createRecord(headers) {
    const recordData = JSON.stringify([{
        data: VERCEL_IP,
        name: SUBDOMAIN,
        ttl: 600,
        type: 'A'
    }]);
    
    const options = {
        hostname: 'api.godaddy.com',
        path: `/v1/domains/${DOMAIN}/records`,
        method: 'PATCH',
        headers: {
            ...headers,
            'Content-Length': recordData.length
        }
    };
    
    const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            if (res.statusCode === 200 || res.statusCode === 201) {
                console.log('✅ DNS record created successfully!\n');
                showSuccess();
            } else {
                console.error(`❌ Error: ${res.statusCode} - ${data}`);
            }
            rl.close();
        });
    });
    
    req.on('error', (error) => {
        console.error('❌ Request failed:', error);
        rl.close();
    });
    
    req.write(recordData);
    req.end();
}

function updateRecord(headers) {
    const recordData = JSON.stringify([{
        data: VERCEL_IP,
        ttl: 600
    }]);
    
    const options = {
        hostname: 'api.godaddy.com',
        path: `/v1/domains/${DOMAIN}/records/A/${SUBDOMAIN}`,
        method: 'PUT',
        headers: {
            ...headers,
            'Content-Length': recordData.length
        }
    };
    
    const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            if (res.statusCode === 200) {
                console.log('✅ DNS record updated successfully!\n');
                showSuccess();
            } else {
                console.error(`❌ Error: ${res.statusCode} - ${data}`);
            }
            rl.close();
        });
    });
    
    req.on('error', (error) => {
        console.error('❌ Request failed:', error);
        rl.close();
    });
    
    req.write(recordData);
    req.end();
}

function showSuccess() {
    console.log('🎉 DNS Configuration Complete!\n');
    console.log('📌 Details:');
    console.log(`   Domain: bendavis.thefortaiagency.ai`);
    console.log(`   Type: A Record`);
    console.log(`   Points to: ${VERCEL_IP} (Vercel)`);
    console.log('');
    console.log('⏱️  DNS propagation usually takes 5-10 minutes.');
    console.log('');
    console.log('🔍 You can verify with:');
    console.log('   nslookup bendavis.thefortaiagency.ai');
    console.log('   dig bendavis.thefortaiagency.ai');
    console.log('');
    console.log('🌐 Your site will be available at:');
    console.log('   https://bendavis.thefortaiagency.ai');
    console.log('');
}

async function main() {
    console.log('');
    console.log('═══════════════════════════════════════════════');
    console.log('  Ben Davis Automotive - DNS Configuration');
    console.log('  NEXUS Platform Automation System');
    console.log('═══════════════════════════════════════════════');
    console.log('');
    
    // Check for environment variables first
    let apiKey = process.env.GODADDY_API_KEY;
    let apiSecret = process.env.GODADDY_API_SECRET;
    
    if (!apiKey || !apiSecret) {
        console.log('📝 GoDaddy API credentials needed.');
        console.log('   Get them at: https://developer.godaddy.com/keys\n');
        
        if (!apiKey) {
            apiKey = await question('Enter your GoDaddy API Key: ');
        }
        if (!apiSecret) {
            apiSecret = await question('Enter your GoDaddy API Secret: ');
        }
    } else {
        console.log('✅ Using GoDaddy credentials from environment variables.\n');
    }
    
    try {
        await configureDNS(apiKey, apiSecret);
    } catch (error) {
        console.error('❌ Configuration failed:', error.message);
        rl.close();
    }
}

main();