/**
 * Taken from github https://github.com/Semantic-Org/Semantic-UI/issues/4805#issuecomment-292021293
 */

import PropTypes from "prop-types";
import { Button } from "semantic-ui-react";
import "./TextButton.css";

const TextButton = ({ className = "", ...props }) => (
  <Button basic color="blue" className={["link", className].join(" ")} {...props} />
);

TextButton.propTypes = {
  className: PropTypes.string,
};

export default TextButton;
