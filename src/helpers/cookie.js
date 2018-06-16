import cookies from 'js-cookie';

const expires = 7;
const secure = (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') ? false : true;

export const clearStorage = (name) => {
    cookies.remove(name);
};

export const setStorage = (name, value, settings={expires ,secure}) => {
    cookies.set(name, value, settings);
};

export const getStorage = (name) => {
    return cookies.get(name);
}
