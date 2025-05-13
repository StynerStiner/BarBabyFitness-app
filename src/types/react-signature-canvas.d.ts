// react-signature-canvas.d.ts
declare module 'react-signature-canvas' {
  import { Component, CanvasHTMLAttributes } from 'react';

  export interface SignatureCanvasProps {
    canvasProps?: CanvasHTMLAttributes<HTMLCanvasElement>;
    // optional: define other props like minWidth, maxWidth, etc.
    // see the library docs or source for what's available
  }

  export default class SignatureCanvas extends Component<SignatureCanvasProps> {
    clear(): void;
    fromDataURL(base64String: string, options?: any): void;
    toData(): any;
    toDataURL(type?: string, encoderOptions?: number): string;
    on(): void;
    off(): void;
    isEmpty(): boolean;
    getTrimmedCanvas(): HTMLCanvasElement;
    getCanvas(): HTMLCanvasElement;
  }
}
