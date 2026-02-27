export async function fetchAPI(path: string, options: RequestInit = {}) {
    const res = await fetch(`http://localhost:3000/${path}`, {
        ...options,
        credentials: "include",
        headers: {
            ...(options.headers ?? {}),
            "Content-Type": "application/json",
        }
    })

    const data = await res.json()
    if (!res.ok) {
        const err: any = new Error(data?.error ?? data?.message ?? "Nieznany błąd")
        err.status = res.status
        err.data = data
        throw err
    }

    return data
}