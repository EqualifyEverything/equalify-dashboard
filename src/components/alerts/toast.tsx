import { useEffect, useRef, useState } from 'react';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const liveRegionRef = useRef<HTMLDivElement>(null);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const toastElement = document.querySelector('.sonner-toast');
      if (toastElement) {
        const message = toastElement.textContent || '';
        setToastMessage(message);
      }
    });

    if (liveRegionRef.current) {
      observer.observe(liveRegionRef.current, {
        childList: true,
        subtree: true,
      });
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (toastMessage && liveRegionRef.current) {
      liveRegionRef.current.textContent = toastMessage;
    }
  }, [toastMessage]);

  return (
    <>
      <div
        ref={liveRegionRef}
        aria-live="assertive"
        aria-atomic="true"
        role="alert"
        className="sr-only"
      />
      <Sonner
        theme="light"
        className="toaster group"
        toastOptions={{
          classNames: {
            toast:
              'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
            description: 'group-[.toast]:text-muted-foreground',
            actionButton:
              'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
            cancelButton:
              'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
          },
        }}
        {...props}
      />
    </>
  );
};

export { Toaster };
