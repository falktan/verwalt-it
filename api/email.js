import 'dotenv/config';


export async function sendMail(to, subject, body) {
    const response = await fetch('https://send.api.mailtrap.io/api/send', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.MAILTRAP_API_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            from: { email: 'hello@demomailtrap.co', name: 'Mailtrap Test' },
            to: [{ email: to }],
            subject: subject,
            text: body,
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response from email API:', {errorText, status: response.status});
        throw new Error(`Failed to send email: ${response.status} - ${errorText}`);
    }
}
