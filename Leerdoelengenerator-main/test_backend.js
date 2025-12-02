
async function testBackend() {
    try {
        console.log("Testing backend at http://localhost:3001/api/gemini...");
        const response = await fetch('http://localhost:3001/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: 'Hello, are you working?' })
        });

        const data = await response.json();
        console.log("Status:", response.status);

        if (data.availableModels && data.availableModels.models) {
            console.log("Writing models to models.json...");
            const fs = require('fs');
            fs.writeFileSync('models.json', JSON.stringify(data.availableModels, null, 2));
        } else {
            console.log("Response:", data);
        }
    } catch (error) {
        console.error("Test failed:", error);
    }
}

testBackend();
