import * as React from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';
import * as ToastPrimitive from '@radix-ui/react-toast';

interface ToastPayload {
  title: string;
  description: string;
  status?: 'default' | 'success' | 'error';
  duration?: number;
}

interface ToastContextValue {
  (payload: ToastPayload): void;
  success: (payload: ToastPayload) => void;
  error: (payload: ToastPayload) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);
const ToastContextImpl = React.createContext<{
  toastElementsMapRef: React.MutableRefObject<Map<string, HTMLLIElement>>;
  sortToasts: () => void;
} | null>(null);

const ANIMATION_OUT_DURATION = 350;

const CheckmarkIcon = () => <div aria-hidden className="checkmark" />;
const ErrorIcon = () => <div aria-hidden className="error" />;

export const Toasts: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = React.useState<Map<string, ToastPayload>>(new Map());
  const toastElementsMapRef = React.useRef<Map<string, HTMLLIElement>>(new Map());
  const viewportRef = React.useRef<HTMLOListElement | null>(null);

  const sortToasts = React.useCallback(() => {
    const toastElements = Array.from(toastElementsMapRef.current).reverse();
    const heights: number[] = [];

    toastElements.forEach(([, toast], index) => {
      if (!toast) return;
      const height = toast.clientHeight;
      heights.push(height);
      const frontToastHeight = heights[0];
      toast.setAttribute('data-front', String(index === 0));
      toast.setAttribute('data-hidden', String(index > 2));
      toast.style.setProperty('--index', String(index));
      toast.style.setProperty('--height', `${height}px`);
      toast.style.setProperty('--front-height', `${frontToastHeight}px`);
      const hoverOffsetY = heights
        .slice(0, index)
        .reduce((res, next) => (res += next), 0);
      toast.style.setProperty('--hover-offset-y', `-${hoverOffsetY}px`);
    });
  }, []);

  const handleAddToast = React.useCallback((toast: ToastPayload) => {
    setToasts((currentToasts) => {
      const newMap = new Map(currentToasts);
      newMap.set(String(Date.now()), {
        ...toast,
        status: toast.status || 'default',
      });
      return newMap;
    });
  }, []);

  const handleRemoveToast = React.useCallback((key: string) => {
    setToasts((currentToasts) => {
      const newMap = new Map(currentToasts);
      newMap.delete(key);
      return newMap;
    });
  }, []);

  const handleDispatchDefault = React.useCallback(
    (payload: ToastPayload) =>
      handleAddToast({ ...payload, status: 'default' }),
    [handleAddToast],
  );

  const handleDispatchSuccess = React.useCallback(
    (payload: ToastPayload) =>
      handleAddToast({ ...payload, status: 'success' }),
    [handleAddToast],
  );

  const handleDispatchError = React.useCallback(
    (payload: ToastPayload) => handleAddToast({ ...payload, status: 'error' }),
    [handleAddToast],
  );

  React.useEffect(() => {
    const viewport = viewportRef.current;

    if (viewport) {
      const handleFocus = () => {
        toastElementsMapRef.current.forEach((toast) => {
          toast.setAttribute('data-hovering', 'true');
        });
      };

      const handleBlur = (event: FocusEvent) => {
        if (
          !viewport.contains(event.target as Node) ||
          viewport === event.target
        ) {
          toastElementsMapRef.current.forEach((toast) => {
            toast.setAttribute('data-hovering', 'false');
          });
        }
      };

      viewport.addEventListener('pointermove', handleFocus);
      viewport.addEventListener('pointerleave', handleBlur);
      viewport.addEventListener('focusin', handleFocus);
      viewport.addEventListener('focusout', handleBlur);
      return () => {
        viewport.removeEventListener('pointermove', handleFocus);
        viewport.removeEventListener('pointerleave', handleBlur);
        viewport.removeEventListener('focusin', handleFocus);
        viewport.removeEventListener('focusout', handleBlur);
      };
    }
  }, []);

  React.useEffect(() => {
    ToastManager.getInstance().setAddToastFunction(handleAddToast);
  }, [handleAddToast]);

  return (
    <ToastContext.Provider
      value={React.useMemo(
        () =>
          Object.assign(handleDispatchDefault, {
            success: handleDispatchSuccess,
            error: handleDispatchError,
          }),
        [handleDispatchDefault, handleDispatchSuccess, handleDispatchError],
      )}
    >
      <ToastContextImpl.Provider
        value={React.useMemo(
          () => ({
            toastElementsMapRef,
            sortToasts,
          }),
          [sortToasts],
        )}
      >
        <ToastPrimitive.Provider swipeDirection="right">
          {children}
          {Array.from(toasts).map(([key, toast]) => (
            <Toast
              key={key}
              id={key}
              toast={toast}
              onOpenChange={(open) => {
                if (!open) {
                  toastElementsMapRef.current.delete(key);
                  sortToasts();
                  setTimeout(() => {
                    handleRemoveToast(key);
                  }, ANIMATION_OUT_DURATION);
                }
              }}
            />
          ))}
          <ToastPrimitive.Viewport
            ref={viewportRef}
            className="ToastViewport"
          />
        </ToastPrimitive.Provider>
      </ToastContextImpl.Provider>
    </ToastContext.Provider>
  );
};

class ToastManager {
  private static instance: ToastManager;
  private addToast: (toast: ToastPayload) => void = () => {};

  private constructor() {}

  public static getInstance(): ToastManager {
    if (!ToastManager.instance) {
      ToastManager.instance = new ToastManager();
    }
    return ToastManager.instance;
  }

  public setAddToastFunction(addToastFunction: (toast: ToastPayload) => void) {
    this.addToast = addToastFunction;
  }

  public success(toast: ToastPayload) {
    this.addToast({ ...toast, status: 'success' });
  }

  public error(toast: ToastPayload) {
    this.addToast({ ...toast, status: 'error' });
  }

  public default(toast: ToastPayload) {
    this.addToast({ ...toast, status: 'default' });
  }
}

export const toast = ToastManager.getInstance();

const Toast: React.FC<{
  toast: ToastPayload;
  id: string;
  onOpenChange: (open: boolean) => void;
}> = ({ toast, id, onOpenChange }) => {
  const ref = React.useRef<HTMLLIElement | null>(null);
  const { sortToasts, toastElementsMapRef } =
    React.useContext(ToastContextImpl)!;

  React.useLayoutEffect(() => {
    if (ref.current) {
      toastElementsMapRef.current.set(id, ref.current);
      sortToasts();
    }
  }, [id, sortToasts, toastElementsMapRef]);

  return (
    <ToastPrimitive.Root
      ref={ref}
      type="foreground"
      duration={toast.duration}
      className="ToastRoot"
      onOpenChange={onOpenChange}
    >
      <div className="ToastInner" data-status={toast.status}>
        {toast.status === 'success' && <CheckmarkIcon />}
        {toast.status === 'error' && <ErrorIcon />}
        <ToastPrimitive.Title className="ToastTitle">{toast.title}</ToastPrimitive.Title>
        <ToastPrimitive.Description className="ToastDescription">{toast.description}</ToastPrimitive.Description>
        <ToastPrimitive.Close aria-label="Close" className="ToastClose">
          <Cross2Icon />
        </ToastPrimitive.Close>
      </div>
    </ToastPrimitive.Root>
  );
};