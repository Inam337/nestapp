"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeDrawer } from "@/store/slices/drawerSlice";
import { RootState } from "@/store/store";

interface DrawerProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  isOverlayClose?: boolean;
}

const Drawer: React.FC<DrawerProps> = ({
  title,
  children,
  isOpen,
  onClose,
  size = "md",
  isOverlayClose = true,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOverlayClose &&
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose, isOverlayClose]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      onClose();
    }
  };

  // Calculate width based on size
  const getWidth = () => {
    switch (size) {
      case "sm":
        return "max-w-sm";
      case "md":
        return "max-w-md";
      case "lg":
        return "max-w-lg";
      case "xl":
        return "max-w-xl";
      case "full":
        return "max-w-full";
      default:
        return "max-w-md";
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      onKeyDown={handleKeyDown}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
          <div
            ref={drawerRef}
            className={`transform transition ease-in-out duration-300 w-full ${getWidth()}`}
          >
            <div className="h-full flex flex-col bg-white shadow-xl">
              <div className="px-4 py-6 sm:px-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-medium text-gray-900">{title}</h2>
                  <div className="ml-3 h-7 flex items-center">
                    <button
                      onClick={onClose}
                      className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      <span className="sr-only">Close panel</span>
                      <svg
                        className="h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="relative flex-1 px-4 sm:px-6 py-6 overflow-auto">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Connected Drawer Component
const ConnectedDrawer = () => {
  const dispatch = useDispatch();
  const { isOpen, title, contentType, contentProps, size, isOverlayClose } =
    useSelector((state: RootState) => state.drawer);

  const handleClose = () => {
    dispatch(closeDrawer());
  };

  // Simple content renderer based on contentType
  const renderContent = () => {
    if (!contentType) return null;

    // This is a placeholder - in a full implementation you would import and render
    // different components based on contentType
    return (
      <div className="p-4">
        <h3 className="text-lg font-medium mb-4">
          Content Type: {contentType}
        </h3>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(contentProps, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <Drawer
      isOpen={isOpen}
      title={title}
      onClose={handleClose}
      size={size}
      isOverlayClose={isOverlayClose}
    >
      {renderContent()}
    </Drawer>
  );
};

export default ConnectedDrawer;
