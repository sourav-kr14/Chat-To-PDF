export const fetchMe= async(token:string)=>
{
    const res= await fetch("http://localhost:5000/api/auth/me",
        {
            headers:{
                Authorization:`Bearer{token}`,
            }
        }
    )

    if(!res.ok)
    {
        throw new Error("Unauthorized");
    }

    return res.json();
}