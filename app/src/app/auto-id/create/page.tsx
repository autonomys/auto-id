import { discord, github, google } from "../../../services/auth";

export default function NewAutoId() {
  const providerClassNames =
    "aspect-square hover:opacity-85 hover:cursor-pointer w-1/4 bg-white rounded";

  return (
    <div className="flex flex-col border border-black rounded p-4 md:w-[60%] min-h-[60%] w-9/10 items-center gap-4 bg-slate-50">
      <h1 className="text text-3xl">Create Auto-ID</h1>
      <p>Select an Auto-ID provider</p>
      <div className="flex flex-row gap-4 w-2/3 justify-center">
        <a href={google.AUTH_URL} target="_self" className={providerClassNames}>
          <img src="/google.png" className="w-full h-full" />
        </a>
        <a
          href={discord.AUTH_URL}
          target="_self"
          className={providerClassNames}
        >
          <img src="/discord.png" className="w-full h-full" />
        </a>
        <a href={github.AUTH_URL} className={providerClassNames}>
          <img src="/github.png" className="w-full h-full" />
        </a>
      </div>
    </div>
  );
}