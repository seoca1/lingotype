# 0008 - 빌드 타겟 (SPA / PWA / Electron wrapper)

## 상태

**Accepted**

## 결정일

2026-06-18 (구현 중 확정 — SPA 채택, PWA는 별도 ADR로 분리 검토)

## 컨텍스트

빌드한 게임을 어떤 형태로 배포할지 결정.

**요건**:
- 브라우저에서 URL만으로 플레이 (1차)
- 오프라인 가능 (학습 도구로 사용 가능성)
- 데스크톱 설치 옵션 (Phase 7+)

## 옵션 비교

| 옵션 | 장점 | 단점 | 비고 |
| --- | --- | --- | --- |
| **SPA (Vercel/Netlify/GitHub Pages)** | 가장 단순, URL만으로 플레이 | 오프라인 불가 | **추천 (Phase 4~6)** |
| PWA | 오프라인 가능, 설치 가능, 푸시 알림 | 추가 설정, 서비스 워커 디버깅 | Phase 7 검토 |
| Electron wrapper | 데스크톱 앱, OS 통합 | 빌드/배포 복잡, 메모리 | |
| Tauri | Electron보다 가벼움 | Rust 의존성 | |
| 모바일 앱 (Capacitor) | iOS/Android | 키보드 입력 한계 | 비추천 |

## 결정 (제안)

**SPA (1차) → PWA (Phase 7)**

- 1차: Vite build → 정적 호스팅 (Vercel/Netlify/GitHub Pages)
- Phase 7: PWA 추가 (서비스 워커, manifest)

## 이유

1. **단순성**: SPA는 가장 빠른 배포
2. **URL만으로 플레이**: 학습 도구로 공유 용이
3. **오프라인**: PWA는 추가 복잡도 대비 학습 도구로 가치 있음 → Phase 7에서 검토
4. **데스크톱**: Electron은 과함, PWA가 충분

## 결과 / 영향

### 긍정적
- 빌드 파이프라인 단순
- GitHub Pages 무료 호스팅 가능
- PWA 추가는 점진적

### 부정적 / 트레이드오프
- 오프라인 불가 (Phase 6까지)
- 모바일 최적화 제한 (Phase 7+)

### 제약
- localStorage는 도메인 단위 → 도메인 변경 시 데이터 이전 필요
- HTTPS 필수 (PWA, 마이크, 알림 등)

## 열린 질문

- [ ] 호스팅 플랫폼 (Vercel vs Netlify vs GitHub Pages)
- [ ] CI/CD (GitHub Actions 자동 배포?)
- [ ] 도메인 (개인 도메인 vs 무료 서브도메인)
- [ ] 분석 도구 (Plausible, GA 등)

## 다음 단계

- 사용자 결정 대기
- 결정 후 `prototype/` 에 빌드 설정
- Phase 6: 배포 자동화 (GitHub Actions)