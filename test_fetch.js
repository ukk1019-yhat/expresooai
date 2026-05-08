// Let's try native fetch or axios. Actually node v25 has native fetch.

async function test() {
    const url = 'https://script.google.com/macros/s/AKfycbzhrxzAwG1gNzduIaLCXxn397fq91QCcp7DOtxx4hJUNRun4DJ2lPzsuCobzk-DcDEabw/exec';
    
    const params = new URLSearchParams();
    params.append('name', 'Test Node');
    params.append('email', 'node@example.com');
    params.append('company', 'Node Corp');
    params.append('message', 'Testing from node test script');

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params.toString()
        });
        const data = await response.json();
        console.log("Response:", data);
    } catch(e) {
        console.error("Error:", e);
    }
}

test();
