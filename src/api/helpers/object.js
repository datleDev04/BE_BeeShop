import lodash from 'lodash';

export const cleanObject = (obj) => {
  return lodash.pickBy(obj, (value) => {
    return (
      value !== null && value !== undefined && !(typeof value === 'string' && value.trim() === '')
    );
  });
};

export const filterObjectKeys = (object, type = 'exclude', keys = []) => {
  const output = {}

  for(const [key, value] of Object.entries(object)) {
    if(type === 'exclude'){
      if(!keys.includes(key)) output[key] = value
    }else if(type === 'include') {
      if(keys.includes(key)) output[key] = value
    }
  }

  return output
}

export const removeObjectValues = (obj, values = []) => {
  const output = {}

  const valuesJSON = values.map(v => JSON.stringify(v))

  for(const [key, value] of Object.entries(obj)) {
    if(!valuesJSON.includes(JSON.stringify(value))) output[key] = value
  }

  return output
}