// Baseline load test helper. Usage: npm run loadtest -- /api/posts?limit=50 [connections] [seconds]
import autocannon from 'autocannon';

const [, , route = '/api/posts', connections = '50', duration = '10'] = process.argv;
const url = `http://localhost:${process.env.PORT || 3001}${route}`;

const result = await autocannon({ url, connections: Number(connections), duration: Number(duration) });
console.log(autocannon.printResult(result));
