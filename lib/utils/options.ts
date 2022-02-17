// https://dev.to/lucianbc/union-type-merging-in-typescript-9al

export type Options<T> = {
  [k in keyof T]?: T[k];
}

export type Settings<T> = {
  [k in keyof T]: T[k];
}
