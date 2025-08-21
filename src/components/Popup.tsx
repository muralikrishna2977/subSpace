import type React from "react";
import "./Popup.css";
import { useRef, useEffect, useState, useMemo, useLayoutEffect } from "react";

type Props = {
  children: React.ReactNode;
  content: React.ReactNode;
  align?: "left" | "right" | "topCenter";
  triggerClassName?: string;
  openProp?: boolean;
  setOpenProp?: React.Dispatch<React.SetStateAction<boolean>>;
};

function Popup({
  children,
  content,
  align = "left",
  triggerClassName = "",
  openProp,
  setOpenProp,
}: Props) {
  const [popupWidth, setPopupWidth] = useState<number>(0);
  const [popupHeight, setPopupHeight] = useState<number>(0);
  const [internalOpen, setInternalOpen] = useState<boolean>(false);

  const triggerRef = useRef<HTMLDivElement | null>(null);
  const popupContainerRef = useRef<HTMLDivElement | null>(null);

  const open = typeof openProp === "boolean" ? openProp : internalOpen;

  useLayoutEffect(() => {
    if (popupContainerRef.current) {
      setPopupWidth(popupContainerRef.current.offsetWidth);
      setPopupHeight(popupContainerRef.current.offsetHeight);
    }
  }, [open]);

  const popupContainerStyle = useMemo(() => {
    if (!triggerRef.current) return {};

    const rect = triggerRef.current.getBoundingClientRect();

    if (align === "right") {
      return {
        top: `${rect.top}px`,
        left: `${rect.right + 8}px`,
      };
    }
    if (align === "left") {
      return {
        top: `${rect.top + 45}px`,
        left: `${rect.left - popupWidth + 40}px`,
      };
    }
    if (align === "topCenter") {
      return {
        top: `${rect.top - popupHeight - 6}px`,
        left: `${rect.left + rect.width / 2 - popupWidth / 2}px`,
      };
    }
    return {};
  }, [align, popupHeight, popupWidth]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        open &&
        popupContainerRef.current &&
        triggerRef.current &&
        !popupContainerRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        if (typeof openProp === "boolean") {
          setOpenProp?.(false);
        } else {
          setInternalOpen(false);
        }
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, openProp, setOpenProp]);

  const togglePopup = () => {
    if (typeof openProp === "boolean") {
      setOpenProp?.(!openProp);
    } else {
      setInternalOpen((prev) => !prev);
    }
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div
        ref={triggerRef}
        className={`triger ${triggerClassName}`}
        onClick={togglePopup}
      >
        {children}
      </div>

      {open && (
        <div
          ref={popupContainerRef}
          className="popupContainer"
          style={popupContainerStyle}
        >
          {content}
        </div>
      )}
    </div>
  );
}

export default Popup;
