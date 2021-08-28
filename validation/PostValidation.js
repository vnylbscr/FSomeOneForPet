import * as yup from 'yup';

export const postSchema = yup.object().shape({
  postTitle: yup
    .string()
    .required('Bu alan gerekli')
    .min(5, 'Başlık en az 5 karakter olmalıdır.'),
  postContent: yup
    .string()
    .required('Bu alan gerekli.')
    .min(10, 'Çok kısa')
    .max('200', 'Çok uzun'),
  postPrice: yup
    .number()
    .positive()
    .min(10, 'Geçerli bir fiyat girin.')
    .required('Bu alan gerekli.'),
});
