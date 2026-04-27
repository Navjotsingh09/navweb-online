import type { Metadata } from "next";
import { CollaborateForm } from "./collaborate-form";

export const metadata: Metadata = {
  title: "Collaborate — Pitch a Project or Propose an Essay",
  description:
    "Got a biomimicry research project, a bio-inspired product idea, or an essay to propose? Get in touch with Navjot directly — collaborations, commissions, and conversations welcome.",
  alternates: { canonical: "/collaborate" },
  openGraph: {
    title: "Collaborate with Nav Web Online",
    description:
      "Pitch a project, propose an essay, or just say hello. A direct line to Navjot for biomimicry collaborations.",
    url: "/collaborate",
    type: "website",
  },
};

export default function CollaboratePage() {
  return (
    <div className="collab-shell">
      <section className="collab-intro">
        <p className="collab-kicker">Collaborate</p>
        <h1 className="collab-title">
          <span>Let&apos;s build something</span>
          <span className="collab-title-italic">worth shipping.</span>
        </h1>
        <p className="collab-lede">
          Pitch a project, propose an essay, request a workshop, or just say
          hello. Replies usually within a working day.
        </p>

        <ul className="collab-channels">
          <li>
            <a href="mailto:navjot.singh@5rv.digital" className="collab-channel">
              <span className="collab-channel-label">Email</span>
              <span className="collab-channel-value">navjot.singh@5rv.digital</span>
            </a>
          </li>
          <li>
            <a href="tel:+447587830397" className="collab-channel">
              <span className="collab-channel-label">Phone</span>
              <span className="collab-channel-value">07587 830 397</span>
            </a>
          </li>
        </ul>
      </section>

      <CollaborateForm />
    </div>
  );
}
