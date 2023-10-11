export const senderRequests =async (req:any) => {
    console.log('tttt ', req.token)
    const res = await fetch('http://localhost:5000/sender/requests', {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${req.token}`
        },
    })
    const data = await res.json()
    return data
}

export const sendRequest =async (req:any) => {
    const res = await fetch('http://localhost:5000/requests/send/:receiverId', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(req)
    })
    const data = await res.json()
    return data
}