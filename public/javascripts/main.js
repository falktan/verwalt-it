const main = async () => {
    const response = await fetch('/api')
    const data = await response.json()

    document.getElementById('test-api').innerText = data.message;
}


main();
