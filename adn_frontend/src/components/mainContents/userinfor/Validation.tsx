import * as yup from "yup";

const noSpace = /^\S+$/;
const today = new Date().getTime();

const baseSchema = yup.object().shape({
  fullName: yup
    .string()
    .trim()
    .required("Không được bỏ trống")
    .min(1, "Không được bỏ trống"),
  username: yup
    .string()
    .trim()
    .matches(noSpace, "không được có khoảng trắng")
    .min(8, "Tên quá ngắn")
    .required("Không được bỏ trống"),
  email: yup
    .string()
    .trim()
    .matches(noSpace, "không được có khoảng trắng")
    .email("Đúng định dạng ___ @ ___")
    .required("Không được bỏ trống"),
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
    .matches(/^0\d{9}$/, "Số điện thoại không đúng")
    .required("Không được bỏ trống"),

  address: yup
  .string()
  .trim()
  .required("Không được bỏ trống"),

  gender: yup
  .string()
  .trim()
  .required("Không được bỏ trống"),

  idCard: yup
  .string()
  .matches( /^\d{12}$/, "Số CCCD không hợp lệ")
  .trim()
  .required("Không được bỏ trống"),

  dateOfBirth: yup
  .string()
  .required("Vui lòng chọn ngày sinh")
  .matches(/^\d{4}-\d{2}-\d{2}$/, "Ngày không đúng định dạng")
  .max(today, "Ngày sinh không được vượt quá hôm nay"),
});

export const signUpSchema = baseSchema.pick([
  "fullName",
  "username",
  "email",
  "password",
  "confirmPassword",
  "phone",
]);

export const signUpStaffSchema = baseSchema.pick([
  "fullName",
  "username",
  "email",
  "password",
  "confirmPassword",
  "phone",
  "idCard",
  "address",
  "gender",
  "dateOfBirth"
]);