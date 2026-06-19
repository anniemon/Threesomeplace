import Link from "next/link";
import { PlayExperience } from "./play-experience";

export default function PlayPage() {
  return (
    <main className="app-shell">
      <div className="container">
        <header className="topbar">
          <Link className="brand" href="/" aria-label="쓰리썸플레이스 홈">
            <span className="brand-mark">
              <span>쓰리썸</span>
              <span>플레이스</span>
            </span>
          </Link>
          <span className="pill">1 → 2 → 3 → 관계 모양</span>
        </header>
        <PlayExperience />
      </div>
    </main>
  );
}
