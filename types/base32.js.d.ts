declare module "base32.js" {
  export class Decoder {
    constructor(type?: string);
    write(input: string): Decoder;
    finalize(): Uint8Array;
  }

  export class Encoder {
    constructor(type?: string);
    write(input: Uint8Array): Encoder;
    finalize(): string;
  }
}
