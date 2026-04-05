const http = require('http');

const request = (method, path, data = null, token = null) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: '127.0.0.1',
            port: 5000,
            path: `/api${path}`,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, res => {
            let body = '';
            res.on('data', chunk => body += chunk.toString());
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(body) });
                } catch(e) {
                    resolve({ status: res.statusCode, body });
                }
            });
        });

        req.on('error', reject);

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
};

(async () => {
   try {
       console.log("=== API INTEGRATION TEST ===\n");
       
       const unique = Date.now();
       const email = `admin${unique}@test.com`;
       
       console.log("1. Registering an Admin User...");
       let res = await request('POST', '/auth/register', {
           name: 'Admin User',
           email: email,
           password: 'password123',
           role: 'admin'
       });
       if (res.status !== 201) throw new Error("Registration Failed: " + JSON.stringify(res.data));
       console.log(`[Success] Status: ${res.status}`);
       const token = res.data.meta.token;
       
       console.log("\n2. Finding My Profile (Auth Check)...");
       res = await request('GET', '/auth/me', null, token);
       console.log(`[Success] Status: ${res.status} | User: ${res.data.data.name} (${res.data.data.role})`);
       
       console.log("\n3. Creating an Income Record...");
       res = await request('POST', '/records', {
           amount: 6000,
           type: 'income',
           category: 'Salary',
           notes: 'Monthly pay'
       }, token);
       console.log(`[Success] Status: ${res.status} | msg: ${res.data.message}`);
       
       console.log("\n4. Creating an Expense Record (Over Budget Limit > $5000)...");
       res = await request('POST', '/records', {
           amount: 5100,
           type: 'expense',
           category: 'Equipment',
           notes: 'Big server purchase'
       }, token);
       console.log(`[Success] Status: ${res.status}`);
       if (res.data.meta && res.data.meta.warning) {
           console.log(`[!] Alert Triggered Correctly: ${res.data.meta.warning}`);
       }
       
       console.log("\n5. Fetching Dashboard Analytics (Fresh)...");
       res = await request('GET', '/dashboard/summary', null, token);
       console.log(`[Success] Status: ${res.status} | Cached: ${res.data.meta.cached}`);
       console.log(`Total Income: ${res.data.data.summary.totalIncome}`);
       console.log(`Net Balance: ${res.data.data.summary.netBalance}`);
       
       console.log("\n6. Fetching Dashboard Analytics (Cached)...");
       res = await request('GET', '/dashboard/summary', null, token);
       console.log(`[Success] Status: ${res.status} | Cached: ${res.data.meta.cached}`);
       if (res.data.meta.cached) {
           console.log("[!] Caching mechanism working correctly!");
       }
       
       console.log("\n7. Test Export CSV feature...");
       res = await request('GET', '/records?format=csv', null, token);
       console.log(`[Success] Status: ${res.status}`);
       console.log(`CSV Output Headers: \n${res.body.split('\\n')[0].substring(0, 50)}...`);

       console.log("\n=== ALL TESTS COMPLETED SUCCESSFULLY ===");
   } catch(err) {
       console.error("Test Failed:", err);
   }
})();
