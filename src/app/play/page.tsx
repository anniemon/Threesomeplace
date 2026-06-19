import Link from "next/link";
import { PlayExperience } from "./play-experience";

export default function PlayPage() {
  return (
    <main className="app-shell">
      <div className="container">
        <header className="topbar">
          <Link className="brand" href="/">
            <span className="brand-mark">3</span>
            <span>
              쓰리썸
              <br />
              플레이스
            </span>
          </Link>
          <span className="pill">1 → 2 → 3 → 관계 모양</span>
        </header>
        <PlayExperience />
      </div>
    </main>
  );
}
