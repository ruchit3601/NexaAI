import { modules } from "../data/modules";
import ModuleCard from "./ModuleCard";
import ConnectionLines from "./ConnectionLines";

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
      <h1 className="font-display text-4xl md:text-5xl font-bold text-center mb-3">
        AI Tools Lab
      </h1>
      <p className="text-muted-steel text-center mb-16 max-w-md">
        A hands-on workbench for AI capabilities — plug in, try it live, see how it works.
      </p>

      <div className="relative w-full flex justify-center">
        <ConnectionLines count={modules.length} />
        <div className="flex flex-wrap justify-center gap-6 mt-36">
          {modules.map((module, i) => (
            <ModuleCard key={module.id} module={module} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}