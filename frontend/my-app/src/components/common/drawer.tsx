// components/common/drawer.tsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeDrawer } from "@/store/slices/drawerSlice";
import { RootState } from "@/store/store";
import CategoryForm from "@/components/categories/CategoryForm";

// Define all possible drawer content components here
const DRAWER_CONTENT_COMPONENTS: Record<string, React.FC<any>> = {
  CATEGORY_FORM: CategoryForm,
  // Add more drawer content components as needed
};

const Drawer: React.FC = () => {
  const dispatch = useDispatch();
  const { isOpen, title, contentType, contentProps, isOverlayClose } =
    useSelector((state: RootState) => state.drawer);

  const handleOverlayClick = () => {
    if (isOverlayClose) dispatch(closeDrawer());
  };

  // Render the appropriate component based on contentType
  const renderContent = () => {
    if (!contentType) return null;

    const ContentComponent = DRAWER_CONTENT_COMPONENTS[contentType];

    if (!ContentComponent) {
      console.error(`No component registered for contentType: ${contentType}`);
      return <div>Error: Unknown content type</div>;
    }

    return <ContentComponent {...contentProps} />;
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={handleOverlayClick}
          ></div>

          {/* Drawer Panel */}
          <div className="ml-auto h-full w-[400px] bg-white shadow-xl p-6 z-50 transition-transform transform translate-x-0">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">{title}</h2>
              <button onClick={() => dispatch(closeDrawer())}>✖️</button>
            </div>
            <div className="overflow-y-auto max-h-[calc(100vh-80px)]">
              {renderContent()}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Drawer;
