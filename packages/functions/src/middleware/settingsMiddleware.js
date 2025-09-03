import * as yup from 'yup';

export const settingsSchema = async (ctx, next) => {
  const schema = yup.object().shape({
    displayDuration: yup
      .number()
      .min(1)
      .max(20)
      .required(),
    firstDelay: yup
      .number()
      .min(1)
      .max(20)
      .required(),
    popsInterval: yup
      .number()
      .min(1)
      .max(20)
      .required(),
    maxPopsDisplay: yup
      .number()
      .min(1)
      .max(80)
      .required(),
    position: yup
      .string()
      .oneOf(['bottom-left', 'bottom-right', 'top-left', 'top-right'])
      .required(),
    allowShow: yup
      .string()
      //   .oneOf(['all', 'online_store', 'order_status'])
      .required(),
    hideTimeAgo: yup.boolean().required(),
    truncateProductName: yup.boolean().required(),
    includedUrls: yup.string().nullable(),
    excludedUrls: yup.string().nullable(),
    shopId: yup.string().required(),
    shopDomain: yup.string().required(),
    id: yup.string().required()
  });
  try {
    await schema.validate(ctx.req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    await next();
  } catch (err) {
    console.log('Validation error details:', err.errors);
    ctx.status = 400;
    ctx.body = {success: false, errors: err.errors};
  }
};
