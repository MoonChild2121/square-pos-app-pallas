declare module 'json-bigint' {
  function JSONBigInt(options?: { useNativeBigInt?: boolean }): {
    stringify: (value: any, replacer?: (key: string, value: any) => any, space?: string | number) => string;
    parse: (text: string, reviver?: (key: any, value: any) => any) => any;
  };
  export = JSONBigInt;
} 