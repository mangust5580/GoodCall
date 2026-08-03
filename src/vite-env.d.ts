/// <reference types="vite/client" />

declare module '*.module.scss' {
  const content: { [key: string]: string };
  export default content;
}

declare module '*.scss' {
  const content: string;
  export default content;
}
