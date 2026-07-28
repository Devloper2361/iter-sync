const { twMerge } = require("tailwind-merge");
const clsx = require("clsx");

console.log(twMerge(clsx(
  "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg",
  "w-[95vw] max-w-[720px] p-0 flex flex-col gap-0 max-h-[90vh] overflow-hidden bg-background sm:rounded-2xl"
)));
