import Link from "next/link";
import { tallyUrl } from "@/lib/activity";

export default function Home() {
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
          <span className="pill">여성민우회 현장 참여형 웹</span>
        </header>

        <section className="hero-grid">
          <div className="panel hero-copy">
            <h1 className="hero-title">독점도 비독점도 아닌 말을 섞는 곳</h1>
            <p className="hero-text">
              관계 믹서, 질투 통역소, 합의 문장을 지나 나의 관계 레시피를
              만들어보세요. 결과는 링크로 공유할 수 있고, 익명 응답은 현장 전시
              월에 섞입니다.
            </p>
            <p className="notice">
              이름이나 연락처는 묻지 않습니다. 제출한 선택지와 문장은 익명 집계와
              현장 전시에 쓰일 수 있습니다.
            </p>
          </div>

          <aside className="start-panel">
            <strong>
              3분 참여
              <br />
              익명 집계
              <br />
              링크 공유
            </strong>
            <div className="result-layout">
              <Link className="button" href="/play">
                섞으러 가기
              </Link>
              <a className="button secondary" href={tallyUrl} target="_blank">
                사전 신청 폼 보기
              </a>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
