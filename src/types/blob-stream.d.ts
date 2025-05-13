/**
 * Type definitions for blob-stream
 * 
 * This module provides a writable stream interface for creating a Blob.
 */

declare module 'blob-stream' {
  import { Writable } from 'stream';

  /**
   * Creates a writable stream that can be used to create a Blob.
   * 
   * @returns A writable stream with additional methods to handle the Blob.
   */
  function blobStream(): BlobStream;

  /**
   * A writable stream with additional methods for handling Blobs.
   */
  interface BlobStream extends Writable {
    /**
     * Returns a Blob containing the data written to the stream.
     * 
     * @param type The MIME type of the data in the Blob.
     * @returns A Blob containing the data written to the stream.
     */
    toBlob(type?: string): Blob;
    
    /**
     * Returns a URL for the Blob.
     * 
     * @param type The MIME type of the data in the Blob.
     * @returns A URL for the Blob.
     */
    toBlobURL(type?: string): string;
    
    /**
     * Emitted when all data has been written to the stream.
     */
    on(event: 'finish', listener: () => void): this;
    on(event: string, listener: Function): this;
  }

  export = blobStream;
}