export const decodeToken=(token: string)=> {
    const base64Url = token?.split('.')[1];
    const base64 = base64Url?.replace(/-/g, '+').replace(/_/g, '/');
    if(base64){
        const payload = JSON.parse(atob(base64));
        return payload;
    }
    return;
};