const http = require('http');

const TARGET_PORT = 8089;

const server = http.createServer((req, res) => {
    // Forward request to local Spring Boot on TARGET_PORT
    const options = {
        hostname: '127.0.0.1',
        port: TARGET_PORT,
        path: req.url,
        method: req.method,
        headers: req.headers
    };

    const proxyReq = http.request(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
    });

    proxyReq.on('error', (err) => {
        console.error(`[Proxy Error] ${err.message}`);
        res.writeHead(502, { 'Content-Type': 'text/html' });
        res.end(`
            <html>
                <head><title>502 Bad Gateway</title></head>
                <body style="font-family: sans-serif; text-align: center; padding-top: 100px; background-color: #f7f9fa; color: #333;">
                    <h1 style="color: #e03131;">502 Bad Gateway</h1>
                    <p style="font-size: 1.1em;">Failed to connect to the backend server.</p>
                    <p style="color: #666; font-size: 0.9em; max-width: 500px; margin: 20px auto; border-top: 1px solid #ddd; padding-top: 10px;">
                        The Spring Boot application on port ${TARGET_PORT} might be starting up or currently offline.<br>
                        Error details: <code>${err.message}</code>
                    </p>
                </body>
            </html>
        `);
    });

    req.pipe(proxyReq, { end: true });
});

// Hostinger / Phusion Passenger passes a port or socket in process.env.PORT
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Proxy server listening on port ${port}, forwarding to ${TARGET_PORT}`);
});
