import React, {createContext, useContext, useReducer} from 'react';
import {v4} from "uuid";
import AlertDialog from "./Util/AlertDialog";

const AppContext = createContext(undefined);

export default function AppProvider(props) {
    const [directoryStack, dispatchDirectoryChange] = useReducer((state, action) => {
        switch (action.type) {
            case "PUSH_DIRECTORY":
                state = [...state, action.payload];
                return state;
            case "POP_DIRECTORY":
                if (state.length > 1) {
                    let list = [...state];
                    list.pop();
                    return list;
                }
                return state;
            default:
                return state;
        }
    }, []);

    const [fileHandles, dispatchFileHandle] = useReducer((state, action) => {
        switch (action.type) {
            case "ADD_FILE":
                state = [...state, action.payload];
                return state;
            case "CLOSE_FILE":
                return state.filter(x => x.handle.name !== action.payload);
            default:
                return state;
        }
    }, []);

    const [showAlert, dispatchAlert] = useReducer((state, action) => {
        switch (action.type) {
            case "ADD_ALERT":
                state = [...state, action.payload];
                return state;
            case "CLOSE_ALERT":
                return state.filter(x => x.id !== action.payload.id);
            default:
                return state;
        }
    }, []);

    const dispatcher = {
        directoryStack, dispatchDirectoryChange,
        fileHandles, dispatchFileHandle,
        dispatchAlert
    }

    return (
        <AppContext.Provider value={dispatcher}>
            {showAlert.map((item) => <AlertDialog dispatch={dispatchAlert} key={item.id} {...item}/>)}
            {props.children}
        </AppContext.Provider>
    );
}

export const usePushDirectory = () => {
    const dispatch = useContext(AppContext);

    return ({name, handle, ...props}) => {
        dispatch.dispatchDirectoryChange({
            type: "PUSH_DIRECTORY",
            payload: {
                name,
                handle,
                ...props
            }
        });
    }
}

export const usePopDirectory = () => {
    const dispatch = useContext(AppContext);

    return () => {
        dispatch.dispatchDirectoryChange({
            type: "POP_DIRECTORY",
            payload: {}
        });
    }
}

export const useGetDirectory = () => {
    const dispatch = useContext(AppContext);

    return dispatch.directoryStack;
}

export const usePushFileHandle = () => {
    const dispatch = useContext(AppContext);

    return (payload) => {
        dispatch.dispatchFileHandle({
            type: "PUSH_FILE",
            payload: {
                id: v4(),
                ...payload
            }
        });
    }
}

export const useCloseFileHandle = () => {
    const dispatch = useContext(AppContext);

    return (fileId) => {
        dispatch.dispatchFileHandle({
            type: "POP_FILE",
            payload: {
                id: fileId
            }
        });
    }
}

export const useGetFileHandle = () => {
    const dispatch = useContext(AppContext);

    return dispatch.fileHandles;
}

export const useDispatchAlertDialog = () => {
    const dispatch = useContext(AppContext);

    return ({title, message, callbackOnOk = (() => {}), callbackOnCancel = (() => {}), ...props}) => {
        dispatch.dispatchAlert({
            type: "ADD_ALERT",
            payload: {
                id: v4(),
                title,
                message,
                callbackOnOk,
                callbackOnCancel,
                ...props
            }
        });
    }
}