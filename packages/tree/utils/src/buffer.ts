/**
 * This functions were extracted from lib0/buffer.
 * by Kevin Jahns, licensed under MIT
 * https://github.com/dmonad/lib0
 */

/**
 * @param {Uint8Array} bytes
 * @return {string}
 */
const toBase64Node = (bytes: any) =>
  Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).toString(
    "base64"
  );

/**
 * @param {string} s
 */
const fromBase64Node = (s: any) => {
  const buf = Buffer.from(s, "base64");
  return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
};

export default {
  toBase64: toBase64Node,
  fromBase64: fromBase64Node,
};
