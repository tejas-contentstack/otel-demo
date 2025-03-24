const http = require('http');
const axios = require('axios');

async function fetchData() {
    // Calls an external API
    const response = await axios.get('https://jsonplaceholder.typicode.com/todos/1');
    return response.data;
}

const server = http.createServer(async (req, res) => {
    console.log('Request received');

    try {
        const result = await fetchData();

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`Hello from Node.js! ${JSON.stringify(result)}\n`);
    } catch (error) {
        console.error('Error:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error\n');
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
