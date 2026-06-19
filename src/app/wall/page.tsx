import Link from "next/link";
import { WallView } from "./wall-view";

export default function WallPage() {
  return (
    <main className="app-shell">
      <div className="container wall-container">
        <header className="topbar">
          <Link className="brand" href="/">
            <span className="brand-mark">3</span>
            <span>
              쓰리썸
              <br />
              플레이스
            </span>
          </Link>
          <span className="pill">현장 전시 월</span>
        </header>
        <WallView />
      </div>
    </main>
  );
}
