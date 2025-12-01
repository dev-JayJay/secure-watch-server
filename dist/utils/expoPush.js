import fetch from "node-fetch";
export async function sendExpoNotifications(tokens, payload) {
    if (!tokens || tokens.length === 0)
        return;
    const messages = tokens.map((token) => ({
        to: token,
        sound: "default",
        title: payload.notification.title,
        body: payload.notification.body,
        data: payload.data,
        priority: "high",
    }));
    try {
        const response = await fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(messages),
        });
        const data = await response.json();
        console.log("Expo push response:", data);
        if (!response.ok) {
            console.error("Failed to send push notifications:", data);
        }
        return data;
    }
    catch (error) {
        console.error("Error sending push notifications:", error);
        throw error;
    }
}
