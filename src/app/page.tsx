import Link from "next/link";
import { tallyUrl } from "@/lib/activity";

export default function Home() {
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
          <span className="pill">참여형 설문</span>
        </header>

        <section className="hero-grid">
          <div className="panel hero-copy">
            <h1 className="hero-title">내가 원하는 관계의 모양은 무엇일까?</h1>
            <p className="hero-text">
              나에게 잘 맞는 관계의 구성 요소를 직접 조립해 만들어보아요.
              <br />
              결과는 링크로 공유할 수 있어요.
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
                참여하기
              </Link>
              <a className="button secondary" href={tallyUrl} target="_blank">
                고민 상담 신청 폼 보기
              </a>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
