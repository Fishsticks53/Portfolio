// Server-rendered frames for the five project demos. They show each demo's finished state;
// lib/fx/stages.ts replays the story while a demo is on screen. Examples are synthetic.
import type { CSSProperties, ReactNode } from "react";
import type { Tool } from "@/lib/resume";

const GKL = "k9 i16 p7 s14|k7 i22 p5 e18|p6|k8 i18 p5 i16|k8 k8 i22 p5 i12|p6|s4 k8 i16 p5 i20|s4 i22 p5 s16 p4|p6|k9 i18 p6 s20|s4 k8 i16 p5 i20|s4 i22 p5 s16 p4".split("|");
const TALK: [string, string][] = [["Doctor", "What brings you in today?"], ["Patient", "I’ve had a headache for two days."], ["Doctor", "Any fever?"], ["Patient", "No fever, but I feel tired."]];
const NOTE = ["Reports headache for two days.", "Reports fatigue.", "No fever reported."];

const Mark = () => (
  <i className="mk">
    <svg className="s-ok" viewBox="0 0 16 16"><path d="M3 8.5l3.2 3L13 4.5" /></svg>
    <svg className="s-bad" viewBox="0 0 16 16"><path d="M4 4l8 8M12 4l-8 8" /></svg>
  </i>
);

function Stage({ id, label, say, prop, mood, children }: { id: string; label: string; say: string; prop: string; mood: string; children: ReactNode }) {
  return (
    <div className="stage" id={`st-${id}`} data-perch data-say={say} data-prop={prop} data-mood={mood} aria-label={`${label} animated example`}>
      {children}
    </div>
  );
}

function Gatekeeper() {
  return (
    <Stage id="gk" label="Gatekeeper" say="Scanning. Evidence matters." prop="mag" mood="focus">
      <div className="gk-bar"><span>src/billing/invoice.ts</span><span>sandbox · compared with the last run</span></div>
      <div className="gk-code" id="gkCode">
        {GKL.map((line, i) => (
          <div className="cl" key={i}>
            <b>{i + 1}</b>
            {line.split(" ").map((t, j) => <span key={j} className={`tk ${t[0]}`} style={{ "--w": t.slice(1) } as CSSProperties} />)}
          </div>
        ))}
        <i className="beam" id="gkBeam" />
      </div>
      <ul className="gk-found" id="gkFound" />
      <p className="gk-sum" id="gkSum" />
    </Stage>
  );
}

function Caresum() {
  return (
    <Stage id="cs" label="CARESUM" say="The verifier did its job." prop="clip" mood="focus">
      <div className="cs-steps" id="csSteps">
        {[["g", "Generator"], ["v", "Verifier"], ["j", "Judge"]].map(([k, n]) => <span key={k} data-s={k} className="on">{n}</span>)}
      </div>
      <div className="cs-cols">
        <div className="cs-talk" id="csTalk">
          <h4>Conversation</h4>
          {TALK.map(([who, said]) => <p key={said}><b>{who}:</b> {said}</p>)}
        </div>
        <div>
          <h4>Clinical note</h4>
          <div id="csNote">
            {NOTE.map((t) => <p key={t} className="ns ok"><span className="tx">{t}</span><Mark /></p>)}
          </div>
        </div>
      </div>
    </Stage>
  );
}

function Reviewop() {
  return (
    <Stage id="ro" label="ReviewOp and FACET" say="An unseen aspect. Noted." prop="flag" mood="think">
      <div className="ro-tags" id="roTags"><span data-t="r">ReviewOp · Prototypical Network</span><span data-t="f" className="on">FACET · mixture of experts</span></div>
      <p className="ro-rev" id="roRev">The <mark>strap rubbed my wrist</mark> raw.</p>
      <svg className="ro-svg" id="roSvg" viewBox="0 0 520 340" role="img" aria-label="Aspect points flying to their nearest prototype" />
      <p className="ro-cap" id="roCap">No prototype is close enough. FACET groups it as a new aspect, no domain label needed.</p>
    </Stage>
  );
}

function CoolTools({ tools }: { tools: Tool[] }) {
  return (
    <Stage id="ct" label="Cool Tools" say="Eight tools. All local." prop="wrench" mood="idle">
      <div className="ct-win" id="ctWin">
        {tools[0] && (
          <>
            <p className="ct-h">{tools[0].name}</p>
            <p className="ct-sub">{tools[0].description}</p>
          </>
        )}
      </div>
      <div className="ct-dock" id="ctDock" />
    </Stage>
  );
}

function Space7() {
  return (
    <Stage id="s7" label="Space7 mobile app" say="Membership checked. You’re in." prop="clip" mood="focus">
      <div className="s7-phones">
        <div className="s7-phone" role="group" aria-label="Space7 invite on a phone">
          <div className="s7-screen">
            <div className="s7-statusbar"><b>9:41</b><span className="s7-signal"><i /><i /><i /></span></div>
            <div className="s7-appbar"><b className="s7-wordmark">space7</b><span className="s7-menu" aria-hidden="true" /></div>
            <div className="s7-joinflow">
              <div className="s7-state" id="s7Invite">
                <span className="s7-emblem">S7</span>
                <span className="s7-eyebrow">SPACE INVITE</span>
                <h4>Design circle</h4>
                <p>Maya invited you to join this space.</p>
                <span className="s7-join">Join space</span>
                <small>Shared by invite link</small>
              </div>
              <div className="s7-state" id="s7Verify">
                <span className="s7-verify-mark"><i /></span>
                <span className="s7-eyebrow">SECURE JOIN</span>
                <h4>Checking membership</h4>
                <p>Verifying your access before connecting to chat.</p>
                <span className="s7-verify-line"><i /></span>
              </div>
              <div className="s7-state active" id="s7Connected">
                <span className="s7-verify-mark ok"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m4 10 4 4 8-8" /></svg></span>
                <span className="s7-eyebrow">SPACE7</span>
                <h4>You’re in</h4>
                <p>Membership verified. The chat is ready.</p>
                <span className="s7-join">Open chat</span>
              </div>
            </div>
            <div className="s7-home" />
          </div>
        </div>
        <div className="s7-sync" id="s7Sync" aria-hidden="true"><i /></div>
        <div className="s7-phone" role="group" aria-label="Space7 live chat on a second phone">
          <div className="s7-screen">
            <div className="s7-statusbar"><b>9:41</b><span className="s7-signal"><i /><i /><i /></span></div>
            <div className="s7-appbar"><i className="s7-back" /><span className="s7-room-mark">D</span><div><b>Design circle</b><small>Space7</small></div><span className="s7-more" aria-hidden="true"><i /><i /><i /></span></div>
            <div className="s7-thread">
              <span className="s7-day">TODAY</span>
              <div className="s7-message" id="s7Message1"><span className="s7-name">Maya</span><p>Welcome to the space!</p></div>
              <div className="s7-message out" id="s7Message2"><span className="s7-name">You</span><p>Thanks! Happy to be here.</p></div>
              <div className="s7-message" id="s7Message3"><span className="s7-name">Maya</span><p>Great to have you with us.</p></div>
            </div>
            <div className="s7-composer"><span>Message the space</span><i /></div>
            <div className="s7-home" />
          </div>
        </div>
      </div>
    </Stage>
  );
}

/** Which demo belongs to which project (matched by project name), and whether it sits on the left. */
export const STAGES: Record<string, { flip: boolean; render: (tools: Tool[]) => ReactNode }> = {
  Gatekeeper: { flip: false, render: () => <Gatekeeper /> },
  CARESUM: { flip: true, render: () => <Caresum /> },
  "ReviewOp + FACET": { flip: false, render: () => <Reviewop /> },
  "Cool Tools": { flip: true, render: (tools) => <CoolTools tools={tools} /> },
  Space7: { flip: false, render: () => <Space7 /> },
};
