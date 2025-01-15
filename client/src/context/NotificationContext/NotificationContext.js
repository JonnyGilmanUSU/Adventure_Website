import React, { createContext, useState, useContext, useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "./NotificationContext.module.scss";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    const now = Date.now();
    const storedNotifications = localStorage.getItem("notifications");
    if (storedNotifications) {
      const parsedNotifications = JSON.parse(storedNotifications);
      // Filter out expired notifications immediately
      return parsedNotifications.filter((notif) => notif.expiry > now);
    }
    return [];
  });

  const syncWithLocalStorage = (updatedNotifications) => {
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
  };

  const addNotification = (type, message) => {
    const expiry = Date.now() + 3000; // 3 seconds expiration
    const newNotification = { type, message, id: Date.now(), expiry };
    const updatedNotifications = [...notifications, newNotification];

    setNotifications(updatedNotifications);
    syncWithLocalStorage(updatedNotifications);

    // Schedule removal
    setTimeout(() => {
      removeNotification(newNotification.id);
    }, 3000);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => {
      const updatedNotifications = prev.filter((notif) => notif.id !== id);
      syncWithLocalStorage(updatedNotifications);
      return updatedNotifications;
    });
  };

  useEffect(() => {
    const now = Date.now();
    setNotifications((prev) => {
      // Clean up expired notifications on mount
      const validNotifications = prev.filter((notif) => notif.expiry > now);
      syncWithLocalStorage(validNotifications);
      return validNotifications;
    });

    return () => {
      // Optional cleanup of localStorage on unmount
      localStorage.removeItem("notifications");
    };
  }, []);

  return (
    <NotificationContext.Provider value={addNotification}>
      {children}
      {ReactDOM.createPortal(
        <div className={styles.notificationContainer}>
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`${styles.notification} ${styles[notif.type]}`}
            >
              <div className={styles.typeIndicator}></div> {/* Type Indicator */}
              <span
                className={styles.dismissButton}
                onClick={() => removeNotification(notif.id)}
              >
                &times; {/* Close button */}
              </span>
              {notif.message}
            </div>
          ))}
        </div>,
        document.getElementById("notification-root")
      )}
    </NotificationContext.Provider>
  );
};
