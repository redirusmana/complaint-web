import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import { getInitial } from "../Tools/converter";

const generateAvatarStyle = (name, image, style) => {
  const result = {
    ...style
  };

  if (image) {
    result.backgroundImage = `url(${image})`;
  }

  return result;
};

const Avatar = ({
  tag: Tag,
  name,
  size,
  image,
  style,
  avatarClass,
  ...rest
}) => (
  <Tag
    className={cn({
      avatar: true,
      [`avatar-${size}`]: !!size,
      [avatarClass]: !!avatarClass
    })}
    style={generateAvatarStyle(name, image, style)}
    {...rest}
  >
    {image ? "" : getInitial(name)}
  </Tag>
);

Avatar.propTypes = {
  tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  image: PropTypes.string,
  size: PropTypes.oneOf(["", "sm", "md", "lg", "xl", "xxl", "xxxl"]),
  style: PropTypes.shape({}),
  avatarClass: PropTypes.string
};

Avatar.defaultProps = {
  tag: "div",
  image: "",
  name: "avatar",
  size: "",
  style: {
    margin: "auto",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover"
  },
  avatarClass: "avatar-link"
};

export default Avatar;
