export type DrawFn = (context: CanvasRenderingContext2D, width: number, height: number) => void;
export type SimResult<T> = { t: number; value: T };
export type SimResults<T> = SimResult<T>[];
