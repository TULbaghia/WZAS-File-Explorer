import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { v4 } from "uuid";
import AlertDialog from "./Util/AlertDialog";
import PromptDialog from "./Util/PromptDialog";
import DialogContent from "@material-ui/core/DialogContent";
import { CircularProgress } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";

const AppContext = createContext(undefined);

export default function AppProvider(props) {
  const [directoryStack, dispatchDirectoryChange] = useReducer(
    (state, action) => {
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
    },
    []
  );

  const [fileHandles, dispatchFileHandle] = useReducer((state, action) => {
    switch (action.type) {
      case "ADD_FILE":
        state = [...state, action.payload];
        return state;
      case "CLOSE_FILE":
        return state.filter((x) => x.id !== action.payload.id);
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
        return state.filter((x) => x.id !== action.payload.id);
      default:
        return state;
    }
  }, []);

  const [circularProgress, dispatchCircularProgress] = useState(false);

  const [videoMap, setVideoMap] = useState(new Map());
  const [audioMap, setAudioMap] = useState(new Map());
  // playlist feature
  const [audioList, setAudioList] = useState(new Set());

  const updateVideoMap = (key, value) => {
    videoMap.set(key, value);
    console.log(videoMap);
  };

  const updateAudioMap = (key, value) => {
    audioMap.set(key, value);
    console.log(audioMap);
  };

  const addToAudioList = (item) => {
    audioList.add(item);
    console.log(audioList);
  };

  const deleteFromAudioList = (item) => {
    audioList.delete(item);
    console.log(audioList);
  };

  const dispatcher = {
    directoryStack,
    dispatchDirectoryChange,
    fileHandles,
    dispatchFileHandle,
    dispatchAlert,
    dispatchCircularProgress,
    videoMap,
    updateVideoMap,
    audioMap,
    updateAudioMap,
    audioList,
    addToAudioList,
    deleteFromAudioList
  };

  return (
    <AppContext.Provider value={dispatcher}>
      <Dialog open={circularProgress}>
        <DialogContent style={{ paddingBottom: "20px" }}>
          <CircularProgress />
        </DialogContent>
      </Dialog>
      {showAlert.map((item) => {
        if (item.type === "ALERT")
          return (
            <AlertDialog dispatch={dispatchAlert} key={item.id} {...item} />
          );
        if (item.type === "PROMPT")
          return (
            <PromptDialog dispatch={dispatchAlert} key={item.id} {...item} />
          );
        return { item };
      })}
      {props.children}
    </AppContext.Provider>
  );
}

export const usePushDirectory = () => {
  const dispatch = useContext(AppContext);

  return ({ name, handle, ...props }) => {
    dispatch.dispatchDirectoryChange({
      type: "PUSH_DIRECTORY",
      payload: {
        name,
        handle,
        ...props,
      },
    });
  };
};

export const usePopDirectory = () => {
  const dispatch = useContext(AppContext);

  return () => {
    dispatch.dispatchDirectoryChange({
      type: "POP_DIRECTORY",
      payload: {},
    });
  };
};

export const useGetDirectory = () => {
  const dispatch = useContext(AppContext);

  return dispatch.directoryStack;
};

export const usePushFileHandle = () => {
  const dispatch = useContext(AppContext);

  return ({ name, handle, ...props }) => {
    dispatch.dispatchFileHandle({
      type: "ADD_FILE",
      payload: {
        id: v4(),
        name,
        handle,
        ...props,
      },
    });
  };
};

export const useCloseFileHandle = () => {
  const dispatch = useContext(AppContext);

  return (fileId) => {
    dispatch.dispatchFileHandle({
      type: "CLOSE_FILE",
      payload: {
        id: fileId,
      },
    });
  };
};

export const useGetFileHandle = () => {
  const dispatch = useContext(AppContext);

  return [...dispatch.fileHandles];
};

export const useDispatchAlertDialog = () => {
  const dispatch = useContext(AppContext);

  return ({
    title,
    message,
    callbackOnOk = () => {},
    callbackOnCancel = () => {},
    showCancel = false,
    ...props
  }) => {
    dispatch.dispatchAlert({
      type: "ADD_ALERT",
      payload: {
        id: v4(),
        type: "ALERT",
        title,
        message,
        callbackOnOk,
        callbackOnCancel,
        showCancel,
        ...props,
      },
    });
  };
};

export const useDispatchPromptDialog = () => {
  const dispatch = useContext(AppContext);

  return ({
    title,
    message,
    callbackOnOk = () => {},
    callbackOnCancel = () => {},
    callbackValidator = (i) => true,
    label = "",
    ...props
  }) => {
    dispatch.dispatchAlert({
      type: "ADD_ALERT",
      payload: {
        id: v4(),
        showCancel: true,
        type: "PROMPT",
        title,
        message,
        callbackOnOk,
        callbackOnCancel,
        callbackValidator,
        label,
        ...props,
      },
    });
  };
};

export const useDispatchCircularProgress = () => {
  const dispatch = useContext(AppContext);

  return (enabled) => {
    dispatch.dispatchCircularProgress(enabled);
  };
};

export const useAppContext = () => React.useContext(AppContext);
