
import axios from 'axios';
import fs from 'fs';

async function run() {
    try {
        const response = await axios.post('http://localhost:3001/api/gemini', { prompt: 'test' });
        console.log("Success! Status:", response.status);
        console.log("Response:", response.data);
    } catch (error) {
        if (error.response) {
            console.log("Status:", error.response.status);
            console.log("Data:", JSON.stringify(error.response.data, null, 2));
            fs.writeFileSync('response_dump.json', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error("Error:", error.message);
        }
    }
}

run();
