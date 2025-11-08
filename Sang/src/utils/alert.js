import Swal from "sweetalert2";

export const showSuccess = (message) => {
  Swal.fire({
    icon: "success",
    title: "Success",
    text: message || "Operation completed successfully",
    timer: 2000,
    showConfirmButton: false,
  });
};

export const showError = (message) => {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: message || "Something went wrong. Please try again.",
  });
};
