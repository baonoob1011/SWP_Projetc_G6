import * as yup from "yup";

const noSpace = /^\S+$/;

export const signUpSchema = yup.object().shape({
  fullName: yup
    .string()
    .trim()
    .required("Không được bỏ trống")
    .min(1, "Không được bỏ trống"),
  username: yup
    .string()
    .trim()
    .required()
    .matches(noSpace, "không được có khoảng trắng")
    .min(8, "Tên quá ngắn"),
  email: yup
    .string()
    .trim()
    .required("Không được bỏ trống")
    .matches(noSpace, "không được có khoảng trắng")
    .min(1, "Không được bỏ trống"),
  password: yup
    .string()
    .trim()
    .min(8, "mật khẩu quá ngắn")
    .matches(/[A-Z]/, "Mật khẩu không đúng định dạng")
    .matches(/[a-z]/, "Mật khẩu không đúng định dạng")
    .matches(/\d/, "Mật khẩu không đúng định dạng")
    .matches(/[@$!%*?&#]/, "Mật khẩu không đúng định dạng")
    .matches(/^\S+$/, "Mật khẩu không đúng định dạng")
    .required("Không được bỏ trống"),
  confirmPassword: yup
    .string()
    .required("Không được bỏ trống")
    .oneOf([yup.ref("password")], "Mật khẩu nhập lại không khớp"),

  phone: yup
    .string()
    .required()
    .matches(/^0\d{9}$/, "Số điện thoại không đúng"),
});
