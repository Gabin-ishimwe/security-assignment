export const senderRequests = async (req: any) => {
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

export const sendRequest = async (req: any, token: any, receiverId: any) => {
    const res = await fetch(`http://localhost:5000/requests/send/${receiverId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json", "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(req)
    })
    const data = await res.json()
    return data
}

export const requestDetails = async (req: any) => {
  
  const res = await fetch(`http://localhost:5000/requests/${req.id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${req.token}`,
    },
  });
  const data = await res.json(); 
  return data;
};

export const addComment = async (req: any) => {
  console.log('comment request => ', req)
  const res = await fetch(`http://localhost:5000/requests/${req.id}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", "Authorization": `Bearer ${req.token}`
    },
    body: JSON.stringify({comment: req.comment})
  });
  const data = await res.json();
  return data;
}