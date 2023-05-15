export enum EditorStatus {
  /** Unsupported system */
  UNSUPPORTED = 0x01,

  /** Unknown error */
  ERROR = 0x02,

  /** Empty viewer */
  EMPTY = 0x11,

  /** Open viewer */
  OPEN = 0x12,

  /** Loading image */
  LOADING = 0x14,
}
