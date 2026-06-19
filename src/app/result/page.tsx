import Link from "next/link";
import { Suspense } from "react";
import { ResultView } from "./result-view";

export default function ResultPage() {
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
          <span className="pill">오늘의 관계 레시피</span>
        </header>
        <Suspense fallback={<div className="panel card">결과를 섞는 중</div>}>
          <ResultView />
        </Suspense>
      </div>
    </main>
  );
}
