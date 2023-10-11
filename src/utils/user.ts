export const userSignUp = async (req:any) => {
    const res = await fetch('http://localhost:5000/users/signup', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(req)
    })
    const data = await res.json()
    return data
}

export const userLogin =async (req:any) => {
    const res = await fetch('http://localhost:5000/users/login', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(req)
    })
    const data = await res.json()
    return data
}

export const getReceivers = async (req:any) => {
    console.log('tttt ', req.token)
    const res = await fetch('http://localhost:5000/users/receivers', {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${req.token}`
        },
    })
    const data = await res.json()
    return data
}
