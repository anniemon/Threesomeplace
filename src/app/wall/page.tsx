import Link from "next/link";
import { WallView } from "./wall-view";

export default function WallPage() {
  return (
    <main className="app-shell">
      <div className="container wall-container">
        <header className="topbar">
          <Link className="brand" href="/" aria-label="쓰리썸플레이스 홈">
            <span className="brand-mark">
              <span>쓰리썸</span>
              <span>플레이스</span>
            </span>
          </Link>
          <span className="pill">현장 전시 월</span>
        </header>
        <WallView />
      </div>
    </main>
  );
}
