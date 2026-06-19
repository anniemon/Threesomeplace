import Link from "next/link";
import { Suspense } from "react";
import { ResultView } from "./result-view";

export default function ResultPage() {
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
          <span className="pill">오늘의 관계 모양</span>
        </header>
        <Suspense fallback={<div className="panel card">결과를 섞는 중</div>}>
          <ResultView />
        </Suspense>
      </div>
    </main>
  );
}
