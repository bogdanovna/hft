/* eslint-disable @typescript-eslint/no-explicit-any */
import { inspect } from "util";

export function log(...args: any[]) {
  console.log(...args.map((a) => inspect(a, {
    depth: 4,
    colors: true,
    showHidden: true,
  })));
}