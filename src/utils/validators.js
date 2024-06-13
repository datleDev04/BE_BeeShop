export const OBJECT_ID_RULE = /^[0-9a-fA-F]{24}$/
export const OBJECT_ID_RULE_MESSAGE = 'Your string fails to match the Object Id pattern!'

export const PHONE_NUMBER_RULE = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
export const PHONE_NUMBER_RULE_MESSAGE = 'Your phone number fails to match the phone number pattern!'


export const validateBeforeCreateOrUpdate = async (correct_Condition, data) => {
  return await correct_Condition.validateAsync(data,  { abortEarly: false })
}