import * as yup from 'yup';
const today = new Date();

const baseSchema = yup.object().shape({
  fullName: yup
    .string()
    .trim()
    .required('Không được bỏ trống')
    .min(1, 'Không được bỏ trống'),
  username: yup.string().trim(),
  email: yup.string().trim(),
  password: yup
    .string()
    .trim()
    .min(8, 'mật khẩu quá ngắn')
    .matches(/[A-Z]/, 'Mật khẩu không đúng định dạng')
    .matches(/[a-z]/, 'Mật khẩu không đúng định dạng')
    .matches(/\d/, 'Mật khẩu không đúng định dạng')
    .matches(/[@$!%*?&#]/, 'Mật khẩu không đúng định dạng')
    .matches(/^\S+$/, 'Mật khẩu không đúng định dạng')
    .required('Không được bỏ trống'),
  confirmPassword: yup
    .string()
    .required('Không được bỏ trống')
    .oneOf([yup.ref('password')], 'Mật khẩu nhập lại không khớp'),

  phone: yup.string(),

  address: yup.string().trim(),

  gender: yup.string().trim().required('Không được bỏ trống'),

  idCard: yup
    .string()
    .matches(/^\d{12}$/, 'Số CCCD không hợp lệ')
    .trim()
    .required('Không được bỏ trống'),

  dateOfBirth: yup
    .date()
    .transform((_, originalValue) => {
      return originalValue ? new Date(originalValue) : null;
    })
    .typeError('Vui lòng nhập đúng định dạng ngày')
    .required('Vui lòng chọn ngày sinh')
    .max(today, 'Ngày sinh không được ở tương lai'),
});

export const signUpSchema = baseSchema.pick([
  'fullName',
  'username',
  'email',
  'password',
  'confirmPassword',
  'phone',
]);

export const signUpStaffSchema = baseSchema.pick([
  'fullName',
  'username',
  'email',
  'confirmPassword',
  'phone',
  'idCard',
  'address',
  'gender',
  'dateOfBirth',
]);
export const book = baseSchema.pick([
  'fullName',
  'email',
  'phone',
  'address',
  'gender',
  'dateOfBirth',
]);
