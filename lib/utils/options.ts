// https://dev.to/lucianbc/union-type-merging-in-typescript-9al

export type Options<T> = Partial<T>

export type Settings<T> = {
  [k in keyof T]: T[k];
}
