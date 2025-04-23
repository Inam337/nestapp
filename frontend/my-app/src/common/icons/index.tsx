import { memo } from "react";
import { CommonIconNames, IconProps } from "./types";
import { HomeIcon } from "./home.icon";

export const CommonIcon: React.FC<IconProps> = memo((props) => {
  const { name } = props;

  switch (name) {
    case CommonIconNames.HOME_ICON:
      return <HomeIcon {...props} />;
    default:
      return null;
  }
});
