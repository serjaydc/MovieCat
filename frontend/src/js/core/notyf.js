import { Notyf } from "notyf";
import "notyf/notyf.min.css";

export const notyf = new Notyf({
  duration: 3000,
  position: {
    x: "center",
    y: "top",
  },
  ripple: true,
  dismissible: true,
});
