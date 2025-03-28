// useToast.jsx
import React from "react";


import { Toast } from '../components/ui/Toast'; // Solo importa Toast

/**
 * Límite máximo de toasts visibles
 */
const TOAST_LIMIT = 4;
/**
 * Tiempo para remover toasts en ms
 */
const TOAST_REMOVE_DELAY = 100000; // Ajusta a tu preferencia

let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

const toastTimeouts = new Map();

/**
 * @typedef {Object} ToasterToast
 * @property {string} id
 * @property {boolean} [open]
 * @property {(open: boolean) => void} [onOpenChange]
 * @property {string} [title]
 * @property {string} [description]
 * @property {"info" | "success" | "warning" | "error" | "loading"} [variant]
 * @property {boolean} [disableDismiss]
 * @property {Object} [action]
 */

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
};

const listeners = [];
let memoryState = { toasts: [] };

function reducer(state, action) {
  switch (action.type) {
    case actionTypes.ADD_TOAST: {
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };
    }
    case actionTypes.UPDATE_TOAST: {
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };
    }
    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action;
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? { ...t, open: false }
            : t
        ),
      };
    }
    case actionTypes.REMOVE_TOAST: {
      if (action.toastId === undefined) {
        return { ...state, toasts: [] };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
    }
    default:
      return state;
  }
}

function dispatch(action) {
  if (action.type === actionTypes.ADD_TOAST) {
    const toastExists = memoryState.toasts.some(
      (t) => t.id === action.toast.id
    );
    if (toastExists) return;
  }
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

function addToRemoveQueue(toastId) {
  if (toastTimeouts.has(toastId)) {
    return;
  }
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({ type: actionTypes.REMOVE_TOAST, toastId });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
}

/**
 * Crea un nuevo toast.
 * @param {Omit<ToasterToast, 'id'> & { id?: string }} props
 */
function toast(props) {
  const id = props.id || genId();

  function update(updatedProps) {
    dispatch({
      type: actionTypes.UPDATE_TOAST,
      toast: { ...updatedProps, id },
    });
  }

  function dismiss() {
    dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id });
  }

  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return { id, dismiss, update };
}

function dismissToast(toastId) {
  dispatch({ type: actionTypes.DISMISS_TOAST, toastId });
}

/**
 * Hook para manejar toasts en React.
 * Retorna { toasts, toast, dismiss }.
 */
export function useToast() {
  const [state, setState] = React.useState(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: dismissToast,
  };
}