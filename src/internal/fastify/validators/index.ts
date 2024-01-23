export const isFormdataFromBodyParser = (data: any): boolean => {
  const fieldList = [
    'encoding',
    'fieldname' /*, "fieldnameTruncated"*/,
    'fields',
    'mimetype' /*, "value", "valueTruncated"*/,
  ];
  return Object.keys(data).every((key) => {
    return fieldList.every((field) => !!data[key]?.hasOwnProperty(field));
  });
};

export const convertFormdataToObject = (data: any) => {
  return Object.entries(data).reduce((previousValue, [key, value]) => {
    previousValue[key] = (<any>value).hasOwnProperty('value') ? (<any>value).value : value;
    return previousValue;
  }, <any>{});
};
