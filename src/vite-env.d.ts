/// <reference types="vite/client" />

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  import { FC, SVGProps } from 'react';
  const src: string;
  const component: FC<SVGProps<SVGSVGElement>>;
  export default src;
  export { component };
}
