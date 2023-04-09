import type { PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <main className="h-screen w-full flex justify-center overscroll-none">
      <div className="flex flex-col grow border-x border-slate-400 md:max-w-2xl">
        {props.children}
      </div>
    </main>
  )
}