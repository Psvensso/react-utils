import * as React from 'react';
export function getLocalStorageItem<T>(key: string, ifNull: T) {
    try {
        var item = localStorage.getItem(key);
        return item === null ? ifNull : JSON.parse(item);
    } catch (e) {
        localStorage.removeItem(key);
        return ifNull;
    }
}

export function saveLocalStorageItem(key: string, item) {
    try {
        localStorage.setItem(key, JSON.stringify(item));
    } catch (e) {
        localStorage.removeItem(key);
    }
}

let hasLocalStorage = !!localStorage;

if (hasLocalStorage) {
    let testKey = 'react_fc9704944c8f';
    try {
        // Access to global `localStorage` property must be guarded as it
        // fails under iOS private session mode.
        localStorage.setItem(testKey, 'foo')
        localStorage.removeItem(testKey)
    } catch (e) {
        hasLocalStorage = false;
    }
}

interface LocalStorageHOCOptions {
    storrageKey: string;
    whiteListObject?: MapLike<boolean>;
}

export const savesStateTolocalStorage = (args: LocalStorageHOCOptions) =>
    <TOriginalProps extends {}>(Component: (React.ComponentClass<TOriginalProps>)): React.ComponentClass<TOriginalProps> => {
        const { storrageKey, whiteListObject } = args;
        // Return Component if no localStorage is available
        if (!hasLocalStorage) {
            return Component;
        }


        let name = storrageKey;

        class LocalStorageComponent extends Component {
            componentDidCatch() {
                localStorage.removeItem(name);
            }
            componentWillMount() {
                this.setState(getLocalStorageItem<any>(name, {}));
            }

            componentWillUpdate(nextProps, nextState) {
                if (this.state === nextState) {
                    return;
                }
                if (whiteListObject) {
                    let newState = {};
                    Object.keys(whiteListObject).forEach((allowedKey) => {
                        if (!!nextState[allowedKey]) {
                            newState[allowedKey] = nextState[allowedKey];
                        }
                    });
                    saveLocalStorageItem(name, newState);
                } else {
                    saveLocalStorageItem(name, nextState);
                }
            }
        }

        return LocalStorageComponent
    }
