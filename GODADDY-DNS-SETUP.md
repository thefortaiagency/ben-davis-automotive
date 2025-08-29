# GoDaddy DNS Setup for bendavis.thefortaiagency.ai

## Quick Setup Instructions

To link bendavis.thefortaiagency.ai to your Vercel deployment, you need to add one DNS record in GoDaddy.

### Manual Setup (GoDaddy Dashboard)

1. **Log in to GoDaddy** at https://www.godaddy.com
2. Go to **My Products** → **Domains**
3. Find **thefortaiagency.ai** and click **DNS**
4. Click **Add** to create a new record
5. Enter these values:
   - **Type:** A
   - **Name:** bendavis
   - **Value:** 76.76.21.21
   - **TTL:** 600 seconds (or leave default)
6. Click **Save**

### Automated Setup (Using Script)

Run the included script with your GoDaddy API credentials:

```bash
cd /Users/thefortob/Development/ACTIVE-PROJECTS/ben-davis-platform
./configure-bendavis-dns.sh
```

You'll need:
- Your GoDaddy API Key
- Your GoDaddy API Secret

Get these from: https://developer.godaddy.com/keys

### Verification

After adding the DNS record, it may take 5-10 minutes to propagate. You can verify it's working:

```bash
# Check DNS resolution
nslookup bendavis.thefortaiagency.ai

# Or use dig
dig bendavis.thefortaiagency.ai
```

Once configured, your site will be available at:
**https://bendavis.thefortaiagency.ai**

### Current Deployment

The site is currently deployed at:
- Production URL: https://ben-davis-platform-12pcdbvus-the-fort-ai.vercel.app
- Custom Domain: https://bendavis.thefortaiagency.ai (after DNS setup)

### Troubleshooting

If the domain doesn't work after 30 minutes:
1. Check that the A record was added correctly in GoDaddy
2. Verify in Vercel dashboard that the domain is configured
3. Clear your browser cache and try again

Vercel is already configured and waiting for the DNS to point to their servers.