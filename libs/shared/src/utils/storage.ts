const getItem = <T>(key: string) => {
    const value = localStorage.getItem(key) || '';
    try {
        return JSON.parse(value) as T;
    } catch {
        return null;
    }
}

const setItem = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
}

const removeItem = (key: string) => {
    localStorage.removeItem(key);
}

const clearStorage = () => {
    localStorage.clear();
}

const setSessionItem = (key: string, value: any) => {
    sessionStorage.setItem(key, JSON.stringify(value))
}

const getSessionItem = <T>(key: string) => {
    const value = sessionStorage.getItem(key) || '';
    try {
        return JSON.parse(value) as T;
    } catch {
        return null;
    }
}


const clearSessionStorage = () => {
    sessionStorage.clear();
}


export {
    clearStorage,
    getItem,
    removeItem,
    setItem,
    clearSessionStorage,
    getSessionItem,
    setSessionItem
}
