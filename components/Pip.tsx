import { PIP_SVG } from "./pip-art";

// The mascot's markup. All movement and behavior lives in lib/fx/pip.ts.
export function Pip() {
  return (
    <div className="pip" id="pip" data-mood="idle" data-prop="">
      <div className="pbub" id="pbub" role="status" />
      <button className="pip-f" type="button" aria-label="Pip, the page mascot. Press for a trick.">
        <div className="pip-b" dangerouslySetInnerHTML={{ __html: PIP_SVG }} />
      </button>
    </div>
  );
}
